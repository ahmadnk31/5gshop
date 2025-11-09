"use server";

import { S3Service } from "@/lib/s3-service";

export async function getPresignedUploadUrl(filename: string, contentType: string) {
  console.log('getPresignedUploadUrl called with:', { filename, contentType });
  
  try {
    console.log('Environment check:', {
      hasS3Bucket: !!process.env.AWS_S3_BUCKET_NAME,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });

    const key = S3Service.generateFileKey('repair-images', filename);
    console.log('Generated key:', key);
    
    const url = await S3Service.getPresignedUploadUrl(key, contentType);
    console.log('Generated presigned URL successfully');
    
    // Use CloudFront URL if configured, otherwise S3 URL
    const fileUrl = S3Service.getCloudFrontUrl(key);
    
    const response = {
      uploadUrl: url,
      key,
      fileUrl,
    };
    
    console.log('Returning response:', { ...response, uploadUrl: '[HIDDEN]', fileUrl });
    return response;
  } catch (error) {
    console.error("Failed to generate presigned URL:", error);
    throw new Error(`Failed to generate upload URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function uploadFileServer(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = S3Service.generateFileKey('repair-images', file.name);
    
    // Use optimized upload for images
    if (file.type.startsWith('image/') && !file.type.includes('svg')) {
      const result = await S3Service.uploadImageOptimized(key, buffer, true);
      return {
        fileUrl: result.url,
        key: result.key,
        thumbnailUrl: result.thumbnailUrl,
        thumbnailKey: result.thumbnailKey,
      };
    }
    
    // Regular upload for non-images
    const fileUrl = await S3Service.uploadFile(key, buffer, file.type);

    return {
      fileUrl,
      key,
    };
  } catch (error) {
    console.error("Failed to upload file:", error);
    throw new Error("Failed to upload file");
  }
}

export async function deleteFile(key: string) {
  try {
    await S3Service.deleteFile(key);
  } catch (error) {
    console.error("Failed to delete file:", error);
    throw new Error("Failed to delete file");
  }
}
