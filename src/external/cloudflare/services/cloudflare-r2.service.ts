import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CloudFlareConfigService } from './config.service';

@Injectable()
export class CloudFlareR2Service {
  private readonly s3Client: S3Client;
  constructor(
    private readonly cloudFlareConfigService: CloudFlareConfigService,
  ) {
    // 1. Configure the S3Client to use the R2 endpoint and credentials
    this.s3Client = new S3Client({
      region: 'auto', // Cloudflare R2 region is 'auto'
      endpoint: this.cloudFlareConfigService.endpoint,
      credentials: {
        accessKeyId: this.cloudFlareConfigService.accessKeyId,
        secretAccessKey: this.cloudFlareConfigService.secretAccessKey,
      },
      // Note: If you encounter issues, try adding `forcePathStyle: true`
    });
  }

  /**
   * Directly uploads a Buffer (the file content) to Cloudflare R2.
   * @param key The desired filename/path in the R2 bucket.
   * @param buffer The binary content of the file (image, video, etc.).
   * @param contentType The file's MIME type (e.g., 'image/jpeg').
   * @returns A promise that resolves to the public URL of the uploaded file.
   */
  async uploadBuffer(key: string, buffer: Buffer, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.cloudFlareConfigService.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ContentLength: buffer.length,
    });

    await this.s3Client.send(command);

    // CRITICAL UPDATE: Use the custom domain for the public URL
    // and 'key' already contains the path (e.g., 'line-uploads/U.../589...jpeg')
    const baseUrl = this.cloudFlareConfigService.customDomain.endsWith('/')
      ? this.cloudFlareConfigService.customDomain.slice(0, -1)
      : this.cloudFlareConfigService.customDomain;

    // Ensure the key doesn't start with a slash if the base URL doesn't end with one (safe concatenation)
    const cleanedKey = key.startsWith('/') ? key.substring(1) : key;

    return `${baseUrl}/${cleanedKey}`;
  }
}