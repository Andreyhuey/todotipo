import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { config } from '../config/smtp';
import { site } from '../config/site';
import { SendMailProps } from '../interfaces/mail.interfaces';
import { getHtmlTemplate } from '../helpers/get-template';
import juice from 'juice';
import { LogService } from './LogService';

export class MailerService {
  private transporter: Transporter;

  constructor() {
    this.transporter = this.initializeTransporter();
  }

  // Encapsulates transport configuration
  private initializeTransporter(): Transporter {
    return nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: Number(config.SMTP_PORT),
      secure: true,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    });
  }

  private templates = new Map<string, HandlebarsTemplateDelegate>();

  private async loadTemplate(
    name: string
  ): Promise<HandlebarsTemplateDelegate> {
    if (!this.templates.has(name)) {
      const html = await getHtmlTemplate(name);
      const compiled = handlebars.compile(html);
      this.templates.set(name, compiled);
    }
    return this.templates.get(name)!;
  }

  // Sends the actual email
  public async send({
    to,
    replyTo,
    subject,
    templateName,
    templateData,
  }: SendMailProps): Promise<void> {
    const siteName = String(templateData.siteName || site.SITE_NAME);
    const from = `"${siteName}" <${config.SMTP_USER}>`;

    try {
      const compiledTemplate = await this.loadTemplate(templateName);
      const htmlContent = juice(
        compiledTemplate({
          siteLink: site.SITE_LINK,
          year: new Date().getFullYear(),
          ...templateData,
          siteName,
        })
      );

      const mailOptions: SMTPTransport.Options = {
        from,
        replyTo,
        to,
        subject,
        html: htmlContent,
        // priority: 'high', // no need for noice
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent:', info.response);
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      LogService.system('email.failed', `Email “${subject}” to ${Array.isArray(to) ? to.join(', ') : to} could not be sent`, 'error', {
        template: templateName,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
