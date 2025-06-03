import fs from "fs";
import path from "path";

export async function getHtmlTemplate(templateName: string): Promise<string> {
  try {
    const templatePath = path.resolve(
      __dirname,
      `../templates/${templateName}.html`
    );

    // Check if the file exists
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    // Read the HTML file content
    const htmlTemplate = fs.readFileSync(templatePath, "utf-8");
    return htmlTemplate;
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    throw new Error(
      `Failed to load template ${templateName}. Please ensure the file exists.`
    );
  }
}
