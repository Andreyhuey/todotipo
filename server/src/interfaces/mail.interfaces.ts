export interface TemplateData {
  [key: string]: unknown;
}

export interface SendMailProps {
  to: string | string[];
  replyTo?: string;
  subject: string;
  templateName: string;
  templateData: TemplateData;
  /** Extra headers, e.g. List-Unsubscribe for newsletter mail. */
  headers?: Record<string, string>;
  /** Platform mail (e.g. alert digests): failures throw instead of being logged. */
  internal?: boolean;
}
