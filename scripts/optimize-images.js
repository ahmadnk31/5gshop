#!/usr/bin/env node

/**
 * Image Optimization Script for 5gshop
 * 
 * This script:
 * 1. Finds all images in the public directory
 * 2. Converts them to WebP format
 * 3. Compresses them to quality 80
 * 4. Generates blur placeholders
 * 5. Creates responsive srcsets
 * 
 * Usage: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Configuration
const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const WEBP_QUALITY = 80;
const BLUR_WIDTH = 10; // Small size for blur placeholder

// Responsive sizes for srcset
const RESPONSIVE_SIZES = [640, 750, 828, 1080, 1200, 1920];

async function getAllFiles(dir, fileList = []) {
  const files = await readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);
    
    if (fileStat.isDirectory()) {
      // Skip node_modules and hidden directories
      if (!file.startsWith('.') && file !== 'node_modules') {
        await getAllFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  }
  
  return fileList;
}

async function generateBlurPlaceholder(inputPath) {
  try {
    const buffer = await sharp(inputPath)
      .resize(BLUR_WIDTH)
      .webp({ quality: 20 })
      .toBuffer();
    
    return `data:image/webp;base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error(`Error generating blur placeholder for ${inputPath}:`, error.message);
    return null;
  }
}

async function convertToWebP(inputPath) {
  const parsedPath = path.parse(inputPath);
  const outputPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
  
  // Skip if WebP already exists and is newer
  if (fs.existsSync(outputPath)) {
    const inputStat = await stat(inputPath);
    const outputStat = await stat(outputPath);
    
    if (outputStat.mtime > inputStat.mtime) {
      console.log(`✓ Skipping ${path.basename(inputPath)} (already optimized)`);
      return { success: true, skipped: true };
    }
  }
  
  try {
    const info = await sharp(inputPath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);
    
    const originalSize = (await stat(inputPath)).size;
    const webpSize = info.size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    
    console.log(`✓ Converted ${path.basename(inputPath)} → ${path.basename(outputPath)} (${savings}% smaller)`);
    
    return {
      success: true,
      originalSize,
      webpSize,
      savings: parseFloat(savings)
    };
  } catch (error) {
    console.error(`✗ Error converting ${inputPath}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function generateResponsiveSizes(inputPath) {
  const parsedPath = path.parse(inputPath);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    const results = [];
    
    for (const size of RESPONSIVE_SIZES) {
      // Skip if the image is smaller than the target size
      if (metadata.width < size) continue;
      
      const outputPath = path.join(
        parsedPath.dir,
        `${parsedPath.name}-${size}w.webp`
      );
      
      // Skip if already exists
      if (fs.existsSync(outputPath)) {
        continue;
      }
      
      await sharp(inputPath)
        .resize(size)
        .webp({ quality: WEBP_QUALITY })
        .toFile(outputPath);
      
      results.push(size);
    }
    
    if (results.length > 0) {
      console.log(`  Generated responsive sizes: ${results.join(', ')}w`);
    }
    
    return { success: true, sizes: results };
  } catch (error) {
    console.error(`  Error generating responsive sizes for ${inputPath}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🖼️  Image Optimization Script\n');
  console.log('Searching for images...\n');
  
  const images = await getAllFiles(PUBLIC_DIR);
  
  if (images.length === 0) {
    console.log('No images found to optimize.');
    return;
  }
  
  console.log(`Found ${images.length} images to process\n`);
  
  let totalOriginalSize = 0;
  let totalWebpSize = 0;
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (const imagePath of images) {
    const relativePath = path.relative(PUBLIC_DIR, imagePath);
    console.log(`\nProcessing: ${relativePath}`);
    
    // Convert to WebP
    const result = await convertToWebP(imagePath);
    
    if (result.success) {
      if (result.skipped) {
        skipCount++;
      } else {
        successCount++;
        totalOriginalSize += result.originalSize;
        totalWebpSize += result.webpSize;
        
        // Generate responsive sizes
        await generateResponsiveSizes(imagePath);
      }
    } else {
      errorCount++;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Optimization Summary');
  console.log('='.repeat(60));
  console.log(`Total images processed: ${images.length}`);
  console.log(`Successfully converted: ${successCount}`);
  console.log(`Skipped (already optimized): ${skipCount}`);
  console.log(`Errors: ${errorCount}`);
  
  if (totalOriginalSize > 0) {
    const totalSavings = ((totalOriginalSize - totalWebpSize) / totalOriginalSize * 100).toFixed(1);
    const savedBytes = totalOriginalSize - totalWebpSize;
    const savedMB = (savedBytes / 1024 / 1024).toFixed(2);
    
    console.log(`\nOriginal size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`WebP size: ${(totalWebpSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total savings: ${savedMB} MB (${totalSavings}%)`);
  }
  
  console.log('\n✨ Done!\n');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { convertToWebP, generateBlurPlaceholder, generateResponsiveSizes };
