"use server";

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

const WEBP_QUALITY = 80;
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;

export async function uploadImage(formData: FormData): Promise<string> {
  try {
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'device' or 'part'
    
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 10MB - we'll optimize it)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size must be less than 10MB');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename with .webp extension
    const fileName = `${randomUUID()}.webp`;
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', type + 's');
    await mkdir(uploadDir, { recursive: true });
    
    // Optimize image using sharp
    const filePath = join(uploadDir, fileName);
    
    // Get original image info
    const imageInfo = await sharp(buffer).metadata();
    console.log(`Original image: ${imageInfo.width}x${imageInfo.height}, ${(file.size / 1024).toFixed(2)} KB`);
    
    // Process and save as WebP
    const optimizedBuffer = await sharp(buffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
    
    await writeFile(filePath, optimizedBuffer);
    
    const savedSize = optimizedBuffer.length;
    const savingsPercent = ((file.size - savedSize) / file.size * 100).toFixed(1);
    console.log(`Optimized image: ${(savedSize / 1024).toFixed(2)} KB (${savingsPercent}% reduction)`);
    
    // Return public URL
    return `/uploads/${type}s/${fileName}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    if (!imageUrl.startsWith('/uploads/')) {
      return; // Not a local upload
    }
    
    const fs = await import('fs/promises');
    const filePath = join(process.cwd(), 'public', imageUrl);
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error for image deletion failures
  }
}

export async function uploadImageFile(file: File, type: 'device' | 'part' = 'device'): Promise<string> {
  try {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 10MB - we'll optimize it)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size must be less than 10MB');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename with .webp extension
    const fileName = `${randomUUID()}.webp`;
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', type + 's');
    await mkdir(uploadDir, { recursive: true });
    
    // Optimize image using sharp
    const filePath = join(uploadDir, fileName);
    
    // Get original image info
    const imageInfo = await sharp(buffer).metadata();
    console.log(`Original image: ${imageInfo.width}x${imageInfo.height}, ${(file.size / 1024).toFixed(2)} KB`);
    
    // Process and save as WebP with responsive sizes
    const optimizedBuffer = await sharp(buffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
    
    await writeFile(filePath, optimizedBuffer);
    
    // Also generate thumbnail for faster loading in lists
    const thumbnailName = `${randomUUID()}-thumb.webp`;
    const thumbnailPath = join(uploadDir, thumbnailName);
    
    await sharp(buffer)
      .resize(400, 400, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 75 })
      .toFile(thumbnailPath);
    
    const savedSize = optimizedBuffer.length;
    const savingsPercent = ((file.size - savedSize) / file.size * 100).toFixed(1);
    console.log(`Optimized image: ${(savedSize / 1024).toFixed(2)} KB (${savingsPercent}% reduction)`);
    console.log(`Generated thumbnail: ${thumbnailName}`);
    
    // Return public URL (main image)
    return `/uploads/${type}s/${fileName}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}
