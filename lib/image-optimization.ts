/**
 * Image Optimization Utilities
 * 
 * Provides server-side image optimization functions using sharp.
 * Automatically converts images to WebP format and generates responsive sizes.
 */

import sharp from 'sharp';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// Configuration
export const IMAGE_CONFIG = {
  webp: {
    quality: 80,
    effort: 4, // 0-6, higher = better compression but slower
  },
  maxDimensions: {
    width: 1920,
    height: 1920,
  },
  thumbnail: {
    width: 400,
    height: 400,
    quality: 75,
  },
  responsiveSizes: [320, 640, 750, 828, 1080, 1200, 1920],
};

export interface OptimizationResult {
  url: string;
  thumbnailUrl?: string;
  responsiveUrls?: { size: number; url: string }[];
  originalSize: number;
  optimizedSize: number;
  savings: number;
  savingsPercent: number;
}

/**
 * Optimize a single image and convert to WebP
 */
export async function optimizeImage(
  buffer: Buffer,
  outputPath: string,
  options?: {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
  }
): Promise<{ buffer: Buffer; info: sharp.OutputInfo }> {
  const quality = options?.quality ?? IMAGE_CONFIG.webp.quality;
  const maxWidth = options?.maxWidth ?? IMAGE_CONFIG.maxDimensions.width;
  const maxHeight = options?.maxHeight ?? IMAGE_CONFIG.maxDimensions.height;

  const result = await sharp(buffer)
    .resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality, effort: IMAGE_CONFIG.webp.effort })
    .toBuffer({ resolveWithObject: true });
  
  return { buffer: result.data, info: result.info };
}

/**
 * Generate thumbnail for an image
 */
export async function generateThumbnail(
  buffer: Buffer,
  outputPath: string
): Promise<Buffer> {
  return await sharp(buffer)
    .resize(IMAGE_CONFIG.thumbnail.width, IMAGE_CONFIG.thumbnail.height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: IMAGE_CONFIG.thumbnail.quality })
    .toBuffer();
}

/**
 * Generate responsive image sizes
 */
export async function generateResponsiveSizes(
  buffer: Buffer,
  baseFileName: string,
  outputDir: string
): Promise<{ size: number; path: string }[]> {
  const metadata = await sharp(buffer).metadata();
  const originalWidth = metadata.width || IMAGE_CONFIG.maxDimensions.width;

  const results: { size: number; path: string }[] = [];

  for (const size of IMAGE_CONFIG.responsiveSizes) {
    // Skip if image is smaller than this size
    if (originalWidth < size) continue;

    const fileName = baseFileName.replace('.webp', `-${size}w.webp`);
    const filePath = join(outputDir, fileName);

    await sharp(buffer)
      .resize(size, null, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: IMAGE_CONFIG.webp.quality })
      .toFile(filePath);

    results.push({ size, path: filePath });
  }

  return results;
}

/**
 * Complete image optimization pipeline
 * Generates optimized main image, thumbnail, and responsive sizes
 */
export async function optimizeImageComplete(
  buffer: Buffer,
  fileName: string,
  outputDir: string,
  urlPrefix: string,
  options?: {
    generateThumbnail?: boolean;
    generateResponsive?: boolean;
  }
): Promise<OptimizationResult> {
  const generateThumb = options?.generateThumbnail ?? true;
  const generateResponsive = options?.generateResponsive ?? false;

  const originalSize = buffer.length;

  // Get metadata
  const metadata = await sharp(buffer).metadata();
  console.log(
    `Optimizing image: ${metadata.width}x${metadata.height}, ${(originalSize / 1024).toFixed(2)} KB`
  );

  // Optimize main image
  const mainPath = join(outputDir, fileName);
  const { buffer: optimizedBuffer, info } = await optimizeImage(buffer, mainPath);
  await writeFile(mainPath, optimizedBuffer);

  const optimizedSize = optimizedBuffer.length;
  const savings = originalSize - optimizedSize;
  const savingsPercent = (savings / originalSize) * 100;

  const result: OptimizationResult = {
    url: `${urlPrefix}/${fileName}`,
    originalSize,
    optimizedSize,
    savings,
    savingsPercent: parseFloat(savingsPercent.toFixed(1)),
  };

  console.log(
    `Main image: ${(optimizedSize / 1024).toFixed(2)} KB (${savingsPercent.toFixed(1)}% reduction)`
  );

  // Generate thumbnail
  if (generateThumb) {
    const thumbFileName = fileName.replace('.webp', '-thumb.webp');
    const thumbPath = join(outputDir, thumbFileName);
    const thumbBuffer = await generateThumbnail(buffer, thumbPath);
    await writeFile(thumbPath, thumbBuffer);
    result.thumbnailUrl = `${urlPrefix}/${thumbFileName}`;
    console.log(`Thumbnail generated: ${(thumbBuffer.length / 1024).toFixed(2)} KB`);
  }

  // Generate responsive sizes
  if (generateResponsive) {
    const responsivePaths = await generateResponsiveSizes(buffer, fileName, outputDir);
    result.responsiveUrls = responsivePaths.map((item) => ({
      size: item.size,
      url: `${urlPrefix}/${item.path.split('/').pop()}`,
    }));
    console.log(`Generated ${responsivePaths.length} responsive sizes`);
  }

  return result;
}

/**
 * Convert existing image file to WebP
 * Useful for batch conversion scripts
 */
export async function convertToWebP(
  inputPath: string,
  outputPath: string,
  quality: number = IMAGE_CONFIG.webp.quality
): Promise<{ originalSize: number; optimizedSize: number; savingsPercent: number }> {
  const fs = await import('fs/promises');
  const inputBuffer = await fs.readFile(inputPath);
  const originalSize = inputBuffer.length;

  const result = await sharp(inputBuffer)
    .webp({ quality, effort: IMAGE_CONFIG.webp.effort })
    .toBuffer({ resolveWithObject: true });

  await fs.writeFile(outputPath, result.data);

  const optimizedSize = result.data.length;
  const savingsPercent = ((originalSize - optimizedSize) / originalSize) * 100;

  return {
    originalSize,
    optimizedSize,
    savingsPercent: parseFloat(savingsPercent.toFixed(1)),
  };
}

/**
 * Validate image file
 */
export async function validateImage(buffer: Buffer): Promise<{
  valid: boolean;
  error?: string;
  metadata?: sharp.Metadata;
}> {
  try {
    const metadata = await sharp(buffer).metadata();

    if (!metadata.format) {
      return { valid: false, error: 'Unable to detect image format' };
    }

    if (!['jpeg', 'jpg', 'png', 'webp', 'gif', 'svg', 'tiff'].includes(metadata.format)) {
      return { valid: false, error: 'Unsupported image format' };
    }

    return { valid: true, metadata };
  } catch (error) {
    return { valid: false, error: 'Invalid image file' };
  }
}

/**
 * Get optimized image dimensions
 */
export function getOptimizedDimensions(
  width: number,
  height: number,
  maxWidth: number = IMAGE_CONFIG.maxDimensions.width,
  maxHeight: number = IMAGE_CONFIG.maxDimensions.height
): { width: number; height: number } {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  const aspectRatio = width / height;

  if (width > maxWidth) {
    width = maxWidth;
    height = Math.round(width / aspectRatio);
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = Math.round(height * aspectRatio);
  }

  return { width, height };
}
