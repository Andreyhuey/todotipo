import { LessThan } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Visit } from '../entity/Visit';
import { MailerService } from './MailService';
import { site } from '../config/site';

/**
 * Emails the landing page of each new session (bots and /admin are filtered
 * out upstream), so a visitor browsing several pages sends one email, not one
 * per page. Sent after geolocation so the email includes where the visitor is.
 *
 *   VISIT_EMAIL=analytics@example.com   comma-separated; falls back to ANALYTICS_EMAIL
 *   VISIT_EMAIL=off                     disables per-visit emails
 */
const mailer = new MailerService();

const recipients = () => {
  const raw = (process.env.VISIT_EMAIL ?? process.env.ANALYTICS_EMAIL ?? '').trim();
  if (raw.toLowerCase() === 'off') return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

const siteName = () => site.SITE_NAME.replace(/\.$/, '');

export const VisitNotifier = {
  enabled: () => recipients().length > 0,

  async send(visitId: number) {
    const to = recipients();
    if (!to.length) return;
    const repo = AppDataSource.getRepository(Visit);
    const v = await repo.findOneBy({ id: visitId });
    if (!v) return;
    // Only the session's first page view.
    if (await repo.existsBy({ sessionId: v.sessionId, id: LessThan(v.id) })) return;

    const location = [v.city, v.region, v.country].filter(Boolean).join(', ') || 'Unknown location';
    const row = (label: string, value: string) => (value ? [{ label, value }] : []);

    try {
      // internal: a failure must not be logged as an error (that would trigger
      // an alert email per failed visit email).
      await mailer.send({
        to,
        subject: `[${siteName()}] Visit: ${v.path} — ${location}`,
        templateName: 'report',
        internal: true,
        templateData: {
          siteName: siteName(),
          kicker: 'New visitor session',
          heading: v.title || v.path,
          intro: `Someone from ${location} landed on ${v.path}.`,
          sections: [
            {
              title: 'Visit',
              rows: [
                ...row('Landing page', v.path),
                ...row('Time', new Date(v.createdAt).toUTCString()),
                ...row('Referrer', v.referrer || 'Direct'),
              ],
            },
            {
              title: 'Visitor',
              rows: [
                ...row('Location', location),
                ...row('IP', v.ip),
                ...row('ISP', v.isp),
                ...row('Device', [v.device, v.os, v.browser].filter(Boolean).join(' · ')),
                ...row('Screen', v.screen),
                ...row('Language', v.language),
                ...row('Visitor id', v.visitorId),
              ],
            },
          ],
          cta: { label: 'Open analytics', href: `${site.SITE_LINK.replace(/\/$/, '')}/admin/analytics` },
          footnote: 'Locations are estimated from IP addresses and are usually accurate to the city.',
        },
      });
    } catch (err) {
      console.warn('⚠️  Visit email failed:', (err as Error).message);
    }
  },
};
