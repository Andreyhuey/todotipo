import fs from 'fs';
import path from 'path';

const templateCache = new Map<string, string>();

export async function getHtmlTemplate(templateName: string): Promise<string> {
  if (templateCache.has(templateName)) {
    return templateCache.get(templateName)!;
  }

  try {
    const templatePath = path.resolve(
      __dirname,
      `../templates/${templateName}.html`
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
    templateCache.set(templateName, htmlTemplate); // Cache it
    return htmlTemplate;
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    throw new Error(
      `Failed to load template ${templateName}. Please ensure the file exists.`
    );
  }
}
