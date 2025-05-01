export interface TemplateData {
  [key: string]: string | number;
}

export interface SendMailProps {
  to: string | string[];
  subject: string;
  templateName: string;
  templateData: TemplateData;
}
