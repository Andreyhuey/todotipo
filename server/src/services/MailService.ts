import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { config } from '../config/smtp';
import { site } from '../config/site';
import { SendMailProps } from '../interfaces/mail.interfaces';
import { getHtmlTemplate } from '../helpers/get-template';
import juice from 'juice';

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
    subject,
    templateName,
    templateData,
  }: SendMailProps): Promise<void> {
    const from = `"${site.SITE_NAME}" <${config.SMTP_USER}>`;

    try {
      const compiledTemplate = await this.loadTemplate(templateName);
      const htmlContent = juice(compiledTemplate(templateData));

      const mailOptions: SMTPTransport.Options = {
        from,
        replyTo: 'projects@todotipo.ca',
        to,
        subject,
        html: htmlContent,
        // priority: 'high', // no need for noice
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent:', info.response);
    } catch (error) {
      console.error('❌ Failed to send email:', error);
    }
  }
}
