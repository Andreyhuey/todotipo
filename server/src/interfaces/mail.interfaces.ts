export interface TemplateData {
  [key: string]: string | number;
}

export interface SendMailProps {
  to: string | string[];
  replyTo?: string;
  subject: string;
  templateName: string;
  templateData: TemplateData;
  /** Extra headers, e.g. List-Unsubscribe for newsletter mail. */
  headers?: Record<string, string>;
}
