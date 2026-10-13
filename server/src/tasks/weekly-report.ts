/**
 * Weekly summary: traffic, enquiries and subscribers for the last 7 days.
 * Cron: Monday morning (local time).
 */
import { Between, MoreThanOrEqual } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Inquiry } from '../entity/Inquiry';
import { NewsletterSubscriber } from '../entity/Mail';
import { MailerService } from '../services/MailService';
import { LogService } from '../services/LogService';
import { adminLink, change, fmtDay, localDayStart, ownerRecipients, runTask, siteName, visitStats } from './_shared';

runTask('weekly-report', async () => {
  const end = localDayStart(0);
  const start = localDayStart(7);
  const prevStart = localDayStart(14);
  const range = Between(start, new Date(end.getTime() - 1));

  const inquiries = AppDataSource.getRepository(Inquiry);
  const subscribers = AppDataSource.getRepository(NewsletterSubscriber);
  const [week, prev, newInquiries, unread, newSubs, totalSubs] = await Promise.all([
    visitStats(start, end),
    visitStats(prevStart, start),
    inquiries.find({ where: { createdAt: range }, order: { createdAt: 'DESC' } }),
    inquiries.countBy({ isRead: false }),
    subscribers.countBy({ createdAt: MoreThanOrEqual(start) }),
    subscribers.count(),
  ]);

  const to = await ownerRecipients();
  if (!to.length) throw new Error('No recipient: set REPORT_EMAIL or a notification email in Site settings');

  const nf = new Intl.NumberFormat('en-GB');
  const quotes = newInquiries.filter((i) => i.type === 'quote').length;
  const short = { weekday: undefined, year: undefined, month: 'short' } as const;
  const period = `${fmtDay(start, short)} – ${fmtDay(new Date(end.getTime() - 1), short)}`;

  await new MailerService().send({
    to,
    subject: `${siteName()} weekly summary — ${period}`,
    templateName: 'report',
    internal: true,
    templateData: {
      siteName: siteName(),
      kicker: 'Weekly summary',
      heading: period,
      intro: `${nf.format(week.visitors)} visitors, ${newInquiries.length} new enquir${newInquiries.length === 1 ? 'y' : 'ies'} and ${newSubs} new subscriber${newSubs === 1 ? '' : 's'} this week.`,
      stats: [
        { label: 'Visitors', value: nf.format(week.visitors), change: change(week.visitors, prev.visitors) },
        { label: 'Enquiries', value: String(newInquiries.length), change: `${quotes} quote request${quotes === 1 ? '' : 's'}` },
        { label: 'Subscribers', value: nf.format(totalSubs), change: `+${newSubs} this week` },
      ],
      sections: [
        {
          title: 'New enquiries',
          rows: newInquiries.slice(0, 10).map((i) => ({
            label: i.name,
            sub: `${i.type === 'quote' ? 'Quote' : 'Message'}: ${i.subject}`,
            value: i.isRead ? 'read' : 'unread',
          })),
          empty: 'No new enquiries this week.',
        },
        {
          title: 'Top countries',
          rows: week.countries.slice(0, 8).map((c) => ({ label: c.name, value: nf.format(c.count) })),
          empty: 'No visits recorded this week.',
        },
        {
          title: 'Most viewed pages',
          rows: week.pages.slice(0, 6).map((p) => ({ label: p.name, value: nf.format(p.count) })),
          empty: 'No page views this week.',
        },
      ],
      cta: unread ? { label: `Open inbox (${unread} unread)`, href: adminLink('/inbox') } : { label: 'Open dashboard', href: adminLink() },
      footnote: `Page views ${nf.format(week.pageViews)} (${change(week.pageViews, prev.pageViews)}).`,
    },
  });

  await LogService.system('report.weekly', `Weekly summary sent (${week.visitors} visitors, ${newInquiries.length} enquiries)`, 'info', {
    recipients: to,
  });
  console.log(`Weekly summary sent to ${to.join(', ')}`);
});
