/**
 * Small user-agent classifier. The geolocation free plan doesn't include
 * user-agent parsing, and broad buckets (browser / OS / device) are all the
 * analytics need.
 */
export interface ParsedUA {
  browser: string;
  os: string;
  device: 'desktop' | 'mobile' | 'tablet';
  isBot: boolean;
}

const BOT_RE =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link|whatsapp|telegram|discord|preview|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl|wget|python-requests|axios|node-fetch|go-http-client|java\//i;

const BROWSERS: [RegExp, string][] = [
  [/edg(e|a|ios)?\//i, 'Edge'],
  [/opr\/|opera/i, 'Opera'],
  [/samsungbrowser/i, 'Samsung Internet'],
  [/ucbrowser/i, 'UC Browser'],
  [/yabrowser/i, 'Yandex'],
  [/firefox|fxios/i, 'Firefox'],
  [/crios|chrome|chromium/i, 'Chrome'],
  [/safari/i, 'Safari'],
];

const OSES: [RegExp, string][] = [
  [/windows/i, 'Windows'],
  [/iphone|ipad|ipod/i, 'iOS'],
  [/android/i, 'Android'],
  [/cros/i, 'ChromeOS'],
  [/mac os x|macintosh/i, 'macOS'],
  [/linux/i, 'Linux'],
];

export function parseUserAgent(ua = ''): ParsedUA {
  const browser = BROWSERS.find(([re]) => re.test(ua))?.[1] ?? 'Other';
  const os = OSES.find(([re]) => re.test(ua))?.[1] ?? 'Other';
  const device = /ipad|tablet|(android(?!.*mobile))/i.test(ua)
    ? 'tablet'
    : /mobi|iphone|ipod|android/i.test(ua)
      ? 'mobile'
      : 'desktop';
  return { browser, os, device, isBot: !ua || BOT_RE.test(ua) };
}
