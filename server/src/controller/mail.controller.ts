import { Request, Response } from 'express';
import { MailerService } from '../services/MailService';
import { site } from '../config/site';
import { AppDataSource } from '../config/database';
import { NewsletterSubscriber } from '../entity/Mail';

const mailer = new MailerService();

export const sendContactFormMail = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const supportEmail = mailer.send({
      to: 'andreyhuey777@gmail.com',
      subject: `${subject}`,
      templateName: 'contact-form',
      templateData: {
        name,
        email,
        phone,
        subject,
        message,
        siteName: site.SITE_NAME,
      },
    });

    const userConfirmationEmail = mailer.send({
      to: email,
      subject: 'I have gotten your message :)',
      templateName: 'confirm-contact-form',
      templateData: {
        name,
        email,
        subject,
        year: new Date().getFullYear(),
        siteName: site.SITE_NAME,
      },
    });

    // 🔥 Run both emails at the same time
    await Promise.all([userConfirmationEmail, supportEmail]);

    res
      .status(200)
      .json({ status: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('❌ Error sending contact form email:', error);
    res.status(500).json({ status: false, message: 'Failed to send message.' });
  }
};

export const propertyRequestForm = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, id, price, message } = req.body;

    const propertyLink = `${site.SITE_LINK}/properties/${id}`;

    // First send to support
    const support = mailer.send({
      to: 'communications@easyrentprops.com',
      subject: `Property Request: ${name}`,
      templateName: 'property-request',
      templateData: {
        name,
        phone,
        email,
        message,
        price,
        property: propertyLink,
      },
    });

    // Then confirmation to user
    const confirmation = mailer.send({
      to: email,
      subject: "We've received your property request",
      templateName: 'property-request-confirmation',
      templateData: {
        name,
        email,
        propertyLink: propertyLink,
        year: new Date().getFullYear(),
        siteName: site.SITE_NAME,
      },
    });

    await Promise.all([support, confirmation]);

    res.status(200).json({
      status: true,
      message: 'Property request submitted successfully.',
    });
  } catch (error) {
    console.error('❌ Error sending property request:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to send property request.',
    });
  }
};

export const joinSubscribersList = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      status: false,
      message: 'Email is required.',
    });
  }

  try {
    const repo = AppDataSource.getRepository(NewsletterSubscriber);

    // Check if the email already exists
    const existing = await repo.findOne({ where: { email } });
    if (existing) {
      res.status(409).json({
        status: false,
        message: 'Email is already subscribed.',
      });
    }

    const subscriber = repo.create({ email });
    await repo.save(subscriber);

    const support = mailer.send({
      to: 'communications@easyrentprops.com',
      subject: `Property Request: ${name}`,
      templateName: 'mailing-list',
      templateData: {
        email,
        siteName: site.SITE_NAME,
      },
    });

    // Then confirmation to user
    const confirmation = mailer.send({
      to: email,
      subject: "You're subscribed!",
      templateName: 'confirm-mailing-list',
      templateData: {
        siteName: site.SITE_NAME,
        email,
        year: new Date().getFullYear(),
      },
    });

    await Promise.all([support, confirmation]);

    res.status(201).json({
      status: true,
      message: 'Subscribed successfully.',
    });
  } catch (error) {
    console.error('❌ Error subscribing:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to subscribe.',
    });
  }
};
