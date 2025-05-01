import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as ftp from 'basic-ftp';
import dotenv from 'dotenv';
import { Readable } from 'stream';
import { config } from '../config/ftp';

dotenv.config();

export class FileService {
  private readonly FTP_BASE_PATH = config.FTP_BASE_PATH;
  private readonly FTP_PUBLIC_URL = config.FTP_PUBLIC_URL;

  private async connectFTP() {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    await client.access({
      host: process.env.FTP_HOST!,
      user: process.env.FTP_USER!,
      password: process.env.FTP_PASSWORD!,
      port: Number(process.env.FTP_PORT)!,
      secure: false, // Change to true if you're using FTPS
    });
    return client;
  }

  async saveFiles(files: Express.Multer.File[]): Promise<string[]> {
    const savedFiles: string[] = [];
    const client = await this.connectFTP();

    try {
      // Ensure the base directory exists or create it
      await client.ensureDir(this.FTP_BASE_PATH);

      for (const file of files) {
        const fileExtension = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExtension}`;
        const remotePath = `${this.FTP_BASE_PATH}/${fileName}`;

        // Upload the file
        await client.uploadFrom(Readable.from(file.buffer), remotePath);

        const publicUrl = `${this.FTP_PUBLIC_URL}/${fileName}`;
        savedFiles.push(publicUrl);
      }
    } catch (error) {
      console.error('Error saving files:', error);
      throw new Error('Error saving files to FTP server');
    } finally {
      client.close();
    }
    return savedFiles;
  }

  async removeFiles(files: string[]): Promise<void> {
    const client = await this.connectFTP();

    for (const fileUrl of files) {
      try {
        const fileName = path.basename(fileUrl); // get just the filename
        const remotePath = `${this.FTP_BASE_PATH}/${fileName}`; // use correct FTP path

        await client.remove(remotePath);
      } catch (error) {
        console.warn(`Failed to remove file: ${fileUrl}`, error);
      }
    }

    client.close();
  }
}

if (require.main === module) {
  import('fs').then((fs) => {
    const filePath = './test-image.jpg'; // Replace with your actual file path
    const fileBuffer = fs.readFileSync(filePath);

    const testFile: Express.Multer.File = {
      fieldname: 'files',
      originalname: 'test-image.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: fileBuffer,
      size: fileBuffer.length,
      destination: '',
      filename: '',
      path: '',
      stream: Readable.from(fileBuffer),
    };

    const service = new FileService();

    service
      .saveFiles([testFile])
      .then((urls) => {
        console.log('Uploaded file URLs:', urls);
      })
      .catch((err) => {
        console.error('Upload failed:', err);
      });
  });
}
