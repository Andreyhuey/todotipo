/**
 * Daily visits email: yesterday's visitors and where they came from.
 * Cron: daily, early morning (local time).
 */
import { MailerService } from '../services/MailService';
import { LogService } from '../services/LogService';
import { adminLink, analyticsRecipients, change, fmtDay, fmtDuration, localDayStart, runTask, siteName, visitStats } from './_shared';

runTask('daily-visits', async () => {
  const start = localDayStart(1);
  const end = localDayStart(0);
  const prevStart = localDayStart(2);

  const [day, prev] = await Promise.all([visitStats(start, end), visitStats(prevStart, start)]);
  const to = await analyticsRecipients();
  if (!to.length) throw new Error('No recipient: set ANALYTICS_EMAIL or a notification email in Site settings');

  const nf = new Intl.NumberFormat('en-GB');
  const located = day.countries.filter((c) => c.name !== 'Unknown location');

  await new MailerService().send({
    to,
    subject: `${siteName()} daily visits — ${nf.format(day.visitors)} visitor${day.visitors === 1 ? '' : 's'} on ${fmtDay(start, { weekday: 'short', year: undefined, month: 'short' })}`,
    templateName: 'report',
    internal: true,
    templateData: {
      siteName: siteName(),
      kicker: 'Daily visits',
      heading: fmtDay(start),
      intro: day.pageViews
        ? `${nf.format(day.visitors)} people visited the site, viewing ${nf.format(day.pageViews)} pages${located.length ? ` from ${located.length} countr${located.length === 1 ? 'y' : 'ies'}` : ''}.`
        : 'No visits were recorded on the site yesterday.',
      stats: [
        { label: 'Visitors', value: nf.format(day.visitors), change: change(day.visitors, prev.visitors) },
        { label: 'Page views', value: nf.format(day.pageViews), change: change(day.pageViews, prev.pageViews) },
        { label: 'Avg. time on page', value: fmtDuration(day.avgDuration) },
      ],
      sections: day.pageViews
        ? [
            {
              title: 'Where visitors came from',
              rows: day.countries.map((c) => ({ label: c.name, value: `${nf.format(c.count)} visitor${c.count === 1 ? '' : 's'}` })),
            },
            {
              title: 'Top cities',
              rows: day.cities.map((c) => ({ label: c.name, value: nf.format(c.count) })),
              empty: 'No city-level locations yesterday.',
            },
            {
              title: 'Most viewed pages',
              rows: day.pages.map((p) => ({ label: p.name, value: `${nf.format(p.count)} view${p.count === 1 ? '' : 's'}` })),
            },
            {
              title: 'How they found the site',
              rows: [
                ...day.sources.map((s) => ({ label: s.name, value: nf.format(s.count) })),
                { label: 'Direct / bookmarks', value: nf.format(day.directVisits) },
              ],
            },
            {
              title: 'Devices',
              rows: day.devices.map((d) => ({ label: d.name.charAt(0).toUpperCase() + d.name.slice(1), value: nf.format(d.count) })),
            },
          ]
        : [],
      cta: { label: 'Open analytics', href: adminLink('/analytics') },
      footnote: 'Locations are estimated from IP addresses and are usually accurate to the city.',
    },
  });

  await LogService.system('report.daily_visits', `Daily visits email sent (${day.visitors} visitors, ${day.pageViews} page views)`, 'info', {
    recipients: to,
  });
  console.log(`Daily visits sent to ${to.join(', ')}`);
});
