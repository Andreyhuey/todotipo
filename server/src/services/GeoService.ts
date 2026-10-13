import net from 'net';
import { AppDataSource } from '../config/database';
import { IpGeo } from '../entity/IpGeo';
import { Visit } from '../entity/Visit';
import { LogService } from './LogService';

// At most one log entry per problem type every 30 minutes (e.g. quota exhausted).
const lastLogged = new Map<string, number>();
const logGeoProblem = (kind: string, message: string, meta: Record<string, unknown>) => {
  const now = Date.now();
  if (now - (lastLogged.get(kind) ?? 0) < 30 * 60_000) return;
  lastLogged.set(kind, now);
  LogService.system('geolocation.failed', message, 'warning', meta);
};

/**
 * IP → location via ipgeolocation.io (v3). Results are cached per IP for
 * CACHE_DAYS so returning visitors don't spend API credits, and concurrent
 * lookups for the same IP share one request.
 */
const API_URL = 'https://api.ipgeolocation.io/v3/ipgeo';
const CACHE_DAYS = Number(process.env.IP_GEO_CACHE_DAYS || 30);
const apiKey = () => process.env.IP_GEO_LOCATION_CONFIG || process.env.IPGEOLOCATION_API_KEY || '';

const inFlight = new Map<string, Promise<Record<string, any> | null>>();

/** Loopback, private and link-local ranges can't be geolocated. */
export const isPublicIp = (ip: string) => {
  if (!net.isIP(ip)) return false;
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return !(
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127)
    );
  }
  const v6 = ip.toLowerCase();
  return !(v6 === '::1' || v6.startsWith('fc') || v6.startsWith('fd') || v6.startsWith('fe80'));
};

async function fetchGeo(ip: string): Promise<Record<string, any> | null> {
  const key = apiKey();
  if (!key) return null;

  const repo = AppDataSource.getRepository(IpGeo);
  const cached = await repo.findOneBy({ ip });
  const fresh = cached && Date.now() - new Date(cached.fetchedAt).getTime() < CACHE_DAYS * 864e5;
  if (fresh) return cached.data.error ? null : cached.data;

  try {
    const res = await fetch(`${API_URL}?apiKey=${encodeURIComponent(key)}&ip=${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      // 401/429 = key or quota problem: don't cache, so it retries later.
      console.warn(`⚠️  IP geolocation failed (${res.status}): ${data?.message ?? ''}`);
      logGeoProblem(`http-${res.status}`, `IP geolocation lookups are failing (HTTP ${res.status})${res.status === 429 ? ' — API quota reached' : res.status === 401 ? ' — check the API key' : ''}`, {
        status: res.status,
        response: data?.message,
      });
      if (res.status === 400 || res.status === 423) await repo.save({ ip, data: { error: res.status } });
      return null;
    }
    await repo.save({ ip, data });
    return data;
  } catch (err) {
    console.warn('⚠️  IP geolocation request error:', (err as Error).message);
    logGeoProblem('network', 'IP geolocation service could not be reached', { error: (err as Error).message });
    return cached?.data && !cached.data.error ? cached.data : null;
  }
}

export const GeoService = {
  lookup(ip: string) {
    if (!isPublicIp(ip)) return Promise.resolve(null);
    let p = inFlight.get(ip);
    if (!p) {
      p = fetchGeo(ip).finally(() => inFlight.delete(ip));
      inFlight.set(ip, p);
    }
    return p;
  },

  /** Copies the useful location fields onto a visit row. */
  async enrichVisit(visitId: number, ip: string) {
    const geo = await this.lookup(ip);
    if (!geo) return;
    const loc = geo.location ?? {};
    const num = (v: unknown) => (v === undefined || v === null || v === '' ? null : Number(v));
    await AppDataSource.getRepository(Visit).update(visitId, {
      country: String(loc.country_name ?? '').slice(0, 100),
      countryCode: String(loc.country_code2 ?? '').slice(0, 2).toUpperCase(),
      region: String(loc.state_prov ?? '').slice(0, 100),
      city: String(loc.city ?? '').slice(0, 100),
      latitude: num(loc.latitude),
      longitude: num(loc.longitude),
      isp: String(geo.asn?.organization ?? geo.isp ?? '').slice(0, 255),
      timezone: String(geo.time_zone?.name ?? '').slice(0, 100),
    });
  },
};
