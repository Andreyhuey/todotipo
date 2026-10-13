import { Request, Response } from 'express';
import { MailerService } from '../services/MailService';
import { SettingsService } from '../services/SettingsService';
import { site as siteEnv } from '../config/site';
import { AppDataSource } from '../config/database';
import { NewsletterSubscriber } from '../entity/Mail';
import { Inquiry } from '../entity/Inquiry';
import { HttpError, str } from '../helpers/http';
import { LogService, requestContext } from '../services/LogService';

const mailer = new MailerService();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Where staff notifications go: CMS setting, then env, then the SMTP inbox. */
const getRouting = async () => {
  const site = await SettingsService.get('site');
  return {
    siteName: site.name || siteEnv.SITE_NAME,
    notify:
      site.notifyEmail || process.env.NOTIFY_EMAIL || site.email || process.env.SMTP_USER!,
    replyTo: site.email || undefined,
  };
};

const requireEmail = (email: string) => {
  if (!EMAIL_RE.test(email)) throw new HttpError(400, 'A valid email is required');
};

export const sendContactFormMail = async (req: Request, res: Response) => {
  const name = str(req.body.name);
  const email = str(req.body.email).toLowerCase();
  const phone = str(req.body.phone);
  const subject = str(req.body.subject) || 'Website enquiry';
  const message = str(req.body.message);

  requireEmail(email);
  if (!name || !message) throw new HttpError(400, 'Name and message are required');

  // Persist first so a mail outage never loses a lead.
  const contact = await AppDataSource.getRepository(Inquiry).save({
    type: 'contact',
    name,
    email,
    phone,
    subject,
    message,
    meta: {},
  });

  LogService.record({
    ...requestContext(req),
    actor: { type: 'visitor', email },
    category: 'inbox',
    action: 'contact.submitted',
    message: `${name} sent a message: “${subject}”`,
    target: { type: 'inquiry', id: contact.id, label: `${name} <${email}>` },
  });

  const { siteName, notify, replyTo } = await getRouting();
  const year = new Date().getFullYear();

  await Promise.all([
    mailer.send({
      to: notify,
      replyTo: email,
      subject: `${subject}`,
      templateName: 'contact-form',
      templateData: { name, email, phone, subject, message, siteName },
    }),
    mailer.send({
      to: email,
      replyTo,
      subject: 'We have received your message',
      templateName: 'confirm-contact-form',
      templateData: { name, email, subject, year, siteName },
    }),
  ]);

  res.status(200).json({ status: true, message: 'Message sent successfully.' });
};

export const sendProductQuote = async (req: Request, res: Response) => {
  const data = {
    name: str(req.body.name),
    fullname: str(req.body.fullname),
    phone: str(req.body.phone),
    email: str(req.body.email).toLowerCase(),
    address: str(req.body.address),
    city: str(req.body.city),
    quantity: str(req.body.quantity),
    message: str(req.body.message),
    projectType: str(req.body.projectType),
    link: str(req.body.link),
  };

  requireEmail(data.email);
  if (!data.fullname) throw new HttpError(400, 'Full name is required');

  const quote = await AppDataSource.getRepository(Inquiry).save({
    type: 'quote',
    name: data.fullname,
    email: data.email,
    phone: data.phone,
    subject: `Quote: ${data.name}`,
    message: data.message,
    meta: {
      product: data.name,
      quantity: data.quantity,
      projectType: data.projectType,
      address: data.address,
      city: data.city,
      link: data.link,
    },
  });

  LogService.record({
    ...requestContext(req),
    actor: { type: 'visitor', email: data.email },
    category: 'inbox',
    action: 'quote.requested',
    message: `${data.fullname} requested a quote for ${data.name}${data.quantity ? ` (qty ${data.quantity})` : ''}`,
    target: { type: 'inquiry', id: quote.id, label: `${data.fullname} <${data.email}>` },
  });

  const { siteName, notify, replyTo } = await getRouting();

  await Promise.all([
    mailer.send({
      to: notify,
      replyTo: data.email,
      subject: `Product Quote: ${data.fullname}`,
      templateName: 'product-quote',
      templateData: { ...data, siteName },
    }),
    mailer.send({
      to: data.email,
      replyTo,
      subject: "We've received your quote request",
      templateName: 'product-quote-confirmation',
      templateData: { ...data, year: new Date().getFullYear(), siteName },
    }),
  ]);

  res.status(200).json({
    status: true,
    message: 'Quote request sent — we will be in touch shortly.',
  });
};

export const joinSubscribersList = async (req: Request, res: Response) => {
  const email = str(req.body.email).toLowerCase();
  requireEmail(email);

  const repo = AppDataSource.getRepository(NewsletterSubscriber);
  if (await repo.findOneBy({ email })) {
    throw new HttpError(400, 'You are already subscribed.');
  }
  await repo.save(repo.create({ email }));
  LogService.record({
    ...requestContext(req),
    actor: { type: 'visitor', email },
    category: 'inbox',
    action: 'newsletter.subscribed',
    message: `${email} subscribed to the newsletter`,
  });

  const { siteName, notify, replyTo } = await getRouting();

  await Promise.all([
    mailer.send({
      to: notify,
      subject: `New Subscriber: ${email}`,
      templateName: 'mailing-list',
      templateData: { email, siteName },
    }),
    mailer.send({
      to: email,
      replyTo,
      subject: "You're subscribed!",
      templateName: 'confirm-mailing-list',
      templateData: { siteName, email, year: new Date().getFullYear() },
    }),
  ]);

  res.status(201).json({ status: true, message: 'Subscribed successfully.' });
};
