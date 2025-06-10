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
      to: 'projects@todotipo.ca',
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
      subject: 'We have gotten your message',
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

export const sendProductQuote = async (req: Request, res: Response) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      city,
      quantity,
      message,
      projectType,
      link,
    } = req.body;

    // First send to support
    const support = mailer.send({
      to: 'projects@todotipo.ca',
      subject: `Product Quote: ${name}`,
      templateName: 'product-quote',
      templateData: {
        name,
        phone,
        email,
        address,
        city,
        quantity,
        message,
        projectType,
        link,
      },
    });

    // Then confirmation to user
    const confirmation = mailer.send({
      to: email,
      subject: "We've received your product quote request",
      templateName: 'product-quote-confirmation',
      templateData: {
        name,
        email,
        message,
        quantity,
        projectType,
        link,
        year: new Date().getFullYear(),
        siteName: site.SITE_NAME,
      },
    });

    await Promise.all([support, confirmation]);

    res.status(200).json({
      status: true,
      message: 'Product Quote Request Successful',
    });
  } catch (error) {
    console.error('❌ Error sending property request:', error);
    res.status(500).json({
      status: false,
      message: 'Product Request Failed!',
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

    const existing = await repo.findOneBy({ email });

    if (existing) {
      res.status(400).json({
        status: false,
        message: 'You are already subscribed.',
      });
    } else {
      const subscriber = repo.create({ email });
      await repo.save(subscriber);

      const support = mailer.send({
        to: 'projects@todotipo.ca',
        subject: `New Subscriber: ${email}`,
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
    }
  } catch (error) {
    console.error('❌ Error subscribing:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to subscribe.',
    });
  }
};
