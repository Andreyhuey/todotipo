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

  // Sends the actual email
  public async send({
    to,
    subject,
    templateName,
    templateData,
  }: SendMailProps): Promise<void> {
    const from = `"${site.SITE_NAME}" <${config.SMTP_USER}>`;

    try {
      const htmlTemplate = await getHtmlTemplate(templateName);
      const compiledTemplate = handlebars.compile(htmlTemplate);
      const htmlContent = juice(compiledTemplate(templateData));

      const mailOptions: SMTPTransport.Options = {
        from,
        to,
        subject,
        html: htmlContent,
        priority: 'high',
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent:', info.response);
    } catch (error) {
      console.error('❌ Failed to send email:', error);
    }
  }
}

// Test email
// (async () => {
//   const mailer = new MailerService();

//   await mailer.send({
//     to: 'example@gmail.com', // change to a real email address
//     subject: 'Test Email from MailerService',
//     templateName: 'verification-code', // make sure this template exists in your template directory
//     templateData: {
//       code: 23455,
//     },
//   });
// })();
