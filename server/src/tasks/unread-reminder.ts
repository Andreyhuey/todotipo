/**
 * Reminder about enquiries still unread after 24 hours. Silent when there are none.
 * Cron: daily, morning (local time).
 */
import { LessThan } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Inquiry } from '../entity/Inquiry';
import { MailerService } from '../services/MailService';
import { LogService } from '../services/LogService';
import { adminLink, ownerRecipients, runTask, siteName } from './_shared';

const waitingFor = (d: Date) => {
  const h = Math.round((Date.now() - new Date(d).getTime()) / 3600e3);
  return h < 48 ? `${h} hours` : `${Math.round(h / 24)} days`;
};

runTask('unread-reminder', async () => {
  const overdue = await AppDataSource.getRepository(Inquiry).find({
    where: { isRead: false, createdAt: LessThan(new Date(Date.now() - 24 * 3600e3)) },
    order: { createdAt: 'ASC' },
    take: 30,
  });
  if (!overdue.length) {
    console.log('No unread enquiries older than 24 hours.');
    return;
  }

  const to = await ownerRecipients();
  if (!to.length) throw new Error('No recipient: set REPORT_EMAIL or a notification email in Site settings');
  const n = overdue.length;

  await new MailerService().send({
    to,
    subject: `${n} enquir${n === 1 ? 'y is' : 'ies are'} waiting for a reply — ${siteName()}`,
    templateName: 'report',
    internal: true,
    templateData: {
      siteName: siteName(),
      kicker: 'Inbox reminder',
      heading: `${n} unread enquir${n === 1 ? 'y' : 'ies'}`,
      intro: 'These messages arrived more than a day ago and haven\'t been opened in the admin yet. Quick replies win more quotes.',
      sections: [
        {
          title: 'Waiting for a reply',
          rows: overdue.map((i) => ({
            label: `${i.name} — ${i.type === 'quote' ? 'quote request' : 'message'}`,
            sub: `${i.subject} · ${i.email}`,
            value: waitingFor(i.createdAt),
          })),
        },
      ],
      cta: { label: 'Open inbox', href: adminLink('/inbox') },
      footnote: 'Opening a message in the admin marks it as read and stops these reminders for it.',
    },
  });

  await LogService.system('report.unread_reminder', `Reminder sent about ${n} unread enquir${n === 1 ? 'y' : 'ies'}`, 'info', { recipients: to });
  console.log(`Reminder sent to ${to.join(', ')} about ${n} enquiries`);
});
