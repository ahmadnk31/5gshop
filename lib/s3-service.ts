import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';
const CLOUDFRONT_DOMAIN = process.env.AWS_CLOUDFRONT_DOMAIN || ''; // e.g., d1234567890.cloudfront.net

// Image optimization settings
const WEBP_QUALITY = 80;
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;

export class S3Service {
  // Generate presigned URL for uploading files
  static async getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
  }

  // Upload file directly (server-side) with automatic optimization
  static async uploadFile(key: string, file: Buffer, contentType: string): Promise<string> {
    let processedBuffer = file;
    let finalContentType = contentType;
    let finalKey = key;

    // Optimize images before uploading
    if (contentType.startsWith('image/') && !contentType.includes('svg')) {
      try {
        console.log(`Optimizing image for S3 upload: ${key}`);
        const originalSize = file.length;

        // Convert to WebP and optimize
        finalKey = key.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
        processedBuffer = await sharp(file)
          .resize(MAX_WIDTH, MAX_HEIGHT, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer();

        finalContentType = 'image/webp';
        const optimizedSize = processedBuffer.length;
        const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
        
        console.log(`Image optimized: ${(originalSize / 1024).toFixed(2)} KB → ${(optimizedSize / 1024).toFixed(2)} KB (${savings}% reduction)`);
      } catch (error) {
        console.error('Error optimizing image, uploading original:', error);
        // If optimization fails, upload original
        processedBuffer = file;
        finalContentType = contentType;
        finalKey = key;
      }
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: finalKey,
      Body: processedBuffer,
      ContentType: finalContentType,
      CacheControl: 'public, max-age=31536000, immutable', // 1 year cache
    });

    await s3Client.send(command);

    // Return CloudFront URL if configured, otherwise S3 URL
    if (CLOUDFRONT_DOMAIN) {
      return `https://${CLOUDFRONT_DOMAIN}/${finalKey}`;
    }
    
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${finalKey}`;
  }

  // Delete file
  static async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  }

  // Generate unique file key (with .webp extension for images)
  static generateFileKey(prefix: string, filename: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    let extension = filename.split('.').pop() || 'jpg';
    
    // Convert image extensions to webp
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension.toLowerCase())) {
      extension = 'webp';
    }
    
    return `${prefix}/${timestamp}-${randomString}.${extension}`;
  }

  // Get CloudFront URL for a key
  static getCloudFrontUrl(key: string): string {
    if (CLOUDFRONT_DOMAIN) {
      return `https://${CLOUDFRONT_DOMAIN}/${key}`;
    }
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
  }

  // Upload optimized image with thumbnail generation
  static async uploadImageOptimized(
    key: string, 
    file: Buffer, 
    generateThumbnail: boolean = true
  ): Promise<{ url: string; thumbnailUrl?: string; key: string; thumbnailKey?: string }> {
    console.log(`Uploading optimized image to S3: ${key}`);
    const originalSize = file.length;

    // Ensure key has .webp extension
    const webpKey = key.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');

    // Optimize main image
    const optimizedBuffer = await sharp(file)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    // Upload main image
    const mainCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: webpKey,
      Body: optimizedBuffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    });

    await s3Client.send(mainCommand);

    const result: { url: string; thumbnailUrl?: string; key: string; thumbnailKey?: string } = {
      url: this.getCloudFrontUrl(webpKey),
      key: webpKey,
    };

    // Generate and upload thumbnail
    if (generateThumbnail) {
      const thumbnailKey = webpKey.replace('.webp', '-thumb.webp');
      const thumbnailBuffer = await sharp(file)
        .resize(400, 400, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 75 })
        .toBuffer();

      const thumbCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: thumbnailKey,
        Body: thumbnailBuffer,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      });

      await s3Client.send(thumbCommand);

      result.thumbnailUrl = this.getCloudFrontUrl(thumbnailKey);
      result.thumbnailKey = thumbnailKey;

      console.log(`Thumbnail uploaded: ${thumbnailKey}`);
    }

    const optimizedSize = optimizedBuffer.length;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    console.log(`Image uploaded to S3: ${(optimizedSize / 1024).toFixed(2)} KB (${savings}% reduction)`);

    return result;
  }
}
