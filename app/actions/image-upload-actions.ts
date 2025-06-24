"use server";

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${randomUUID()}.${fileExtension}`;
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', type + 's');
    await mkdir(uploadDir, { recursive: true });
    
    // Write file
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    
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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${randomUUID()}.${fileExtension}`;
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', type + 's');
    await mkdir(uploadDir, { recursive: true });
    
    // Write file
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    
    // Return public URL
    return `/uploads/${type}s/${fileName}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}
