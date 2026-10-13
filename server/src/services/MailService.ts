import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { config } from '../config/smtp';
import { site } from '../config/site';
import { SendMailProps } from '../interfaces/mail.interfaces';
import { getHtmlTemplate } from '../helpers/get-template';
import juice from 'juice';
import { LogService } from './LogService';

/** Plain-text version of an email: drops styling, keeps link targets and paragraphs. */
export function htmlToText(html: string) {
  return html
    .replace(/<(head|style|script)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, href, label) => {
      const text = label.replace(/<[^>]+>/g, '').trim();
      return text && text !== href ? `${text} (${href})` : href;
    })
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr|table)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    // Numeric entities (Handlebars escapes "=" in URLs as &#x3D;), then named ones.
    .replace(/&#x([0-9a-f]+);/gi, (_m, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_m, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&copy;/g, '©')
    .replace(/&middot;/g, '·')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

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
    headers,
    internal,
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
        // HTML-only mail is a spam signal; always include a text version.
        text: htmlToText(htmlContent),
        headers,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent:', info.response);
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      // Internal mail (alert digests) must not log its own failure — that would
      // queue another alert and loop. The caller retries instead.
      if (internal) throw error;
      LogService.system('email.failed', `Email “${subject}” to ${Array.isArray(to) ? to.join(', ') : to} could not be sent`, 'error', {
        template: templateName,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
