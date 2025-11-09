# AWS S3 + CloudFront Setup Guide

## Complete Setup for Optimized Image Delivery

This guide will help you set up AWS S3 for storage and CloudFront for fast global image delivery, with automatic WebP optimization.

---

## 📋 What You'll Need

- AWS Account (free tier available)
- AWS Access Key ID
- AWS Secret Access Key
- S3 Bucket
- CloudFront Distribution (optional but recommended)

---

## 🚀 Step-by-Step Setup

### Step 1: Create AWS Account

1. Go to https://aws.amazon.com/
2. Click "Create an AWS Account"
3. Follow the registration process
4. You'll get 12 months free tier (includes 5GB S3 storage)

---

### Step 2: Create S3 Bucket

1. **Log in to AWS Console**
   - Go to https://console.aws.amazon.com/

2. **Navigate to S3**
   - Search for "S3" in the top search bar
   - Click "S3" service

3. **Create Bucket**
   - Click "Create bucket"
   - **Bucket name:** `5gshop-images` (must be globally unique)
   - **Region:** Choose closest to your users (e.g., `eu-central-1` for Europe)
   - **Block Public Access:** UNCHECK all boxes (we need public access for images)
   - Click "Create bucket"

4. **Configure Bucket Policy**
   - Click on your bucket name
   - Go to "Permissions" tab
   - Scroll to "Bucket policy"
   - Click "Edit" and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::5gshop-images/*"
    }
  ]
}
```

   - Replace `5gshop-images` with your bucket name
   - Click "Save changes"

5. **Enable CORS**
   - Go to "Permissions" tab
   - Scroll to "Cross-origin resource sharing (CORS)"
   - Click "Edit" and paste:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

   - Click "Save changes"

---

### Step 3: Create IAM User for Programmatic Access

1. **Navigate to IAM**
   - Search for "IAM" in AWS Console
   - Click "IAM" service

2. **Create User**
   - Click "Users" in left sidebar
   - Click "Add users"
   - **User name:** `5gshop-uploader`
   - **Access type:** Select "Programmatic access"
   - Click "Next: Permissions"

3. **Set Permissions**
   - Click "Attach existing policies directly"
   - Search for "AmazonS3FullAccess"
   - Check the box next to it
   - Click "Next: Tags" → "Next: Review" → "Create user"

4. **Save Credentials** ⚠️ IMPORTANT
   - You'll see **Access key ID** and **Secret access key**
   - **Download .csv** or copy both values immediately
   - You won't be able to see the secret key again!

Example:
```
Access key ID:     AKIAIOSFODNN7EXAMPLE
Secret access key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

---

### Step 4: Create CloudFront Distribution (Recommended)

CloudFront is AWS's CDN that delivers your images faster worldwide.

1. **Navigate to CloudFront**
   - Search for "CloudFront" in AWS Console
   - Click "CloudFront" service

2. **Create Distribution**
   - Click "Create distribution"

3. **Origin Settings**
   - **Origin domain:** Select your S3 bucket from dropdown
     - It will look like: `5gshop-images.s3.eu-central-1.amazonaws.com`
   - **Name:** Auto-filled (keep it)
   - **Origin access:** Select "Public"

4. **Default Cache Behavior Settings**
   - **Viewer protocol policy:** "Redirect HTTP to HTTPS"
   - **Allowed HTTP methods:** GET, HEAD, OPTIONS
   - **Cache policy:** "CachingOptimized"
   - **Response headers policy:** "SimpleCORS"

5. **Settings**
   - **Price class:** "Use all edge locations" (or choose based on your region)
   - **Alternate domain name (CNAME):** Leave empty (or add your custom domain)
   - **SSL Certificate:** Default CloudFront certificate

6. **Create Distribution**
   - Click "Create distribution"
   - Wait 5-15 minutes for deployment
   - You'll get a domain like: `d1234567890.cloudfront.net`
   - **Save this domain!** You'll need it for `.env.local`

---

### Step 5: Configure Environment Variables

1. **Open your `.env.local` file**
   ```bash
   nano /Users/ss/5gshop/.env.local
   ```

2. **Add AWS Configuration**
   ```bash
   # AWS S3 Configuration
   AWS_REGION=eu-central-1
   AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
   AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   AWS_S3_BUCKET_NAME=5gshop-images
   
   # CloudFront Configuration (optional but recommended)
   AWS_CLOUDFRONT_DOMAIN=d1234567890.cloudfront.net
   ```

   Replace with your actual values:
   - `AWS_REGION`: Your bucket region (e.g., `eu-central-1`, `us-east-1`)
   - `AWS_ACCESS_KEY_ID`: From Step 3
   - `AWS_SECRET_ACCESS_KEY`: From Step 3
   - `AWS_S3_BUCKET_NAME`: Your bucket name
   - `AWS_CLOUDFRONT_DOMAIN`: Your CloudFront domain (without `https://`)

3. **Save and close**
   - Press `Ctrl + X`
   - Press `Y`
   - Press `Enter`

---

### Step 6: Restart Your Application

```bash
# Stop current server (Ctrl + C)
# Then restart
npm run dev
```

---

## ✅ Verification

### Test Image Upload

1. **Go to Admin Panel**
   - Navigate to http://localhost:3000/fr/admin

2. **Upload a Test Image**
   - Try uploading a device or part image
   - You should see console logs:
     ```
     Optimizing image for S3 upload: repair-images/...
     Image optimized: 2500 KB → 450 KB (82% reduction)
     Thumbnail uploaded: repair-images/...-thumb.webp
     Image uploaded to S3: 450 KB
     ```

3. **Check S3 Bucket**
   - Go to AWS Console → S3
   - Open your bucket
   - You should see folders: `repair-images/`, `devices/`, `parts/`
   - Images should be in `.webp` format

4. **Verify CloudFront**
   - Check the image URL in your database
   - It should start with your CloudFront domain:
     ```
     https://d1234567890.cloudfront.net/repair-images/...
     ```

---

## 🎯 Benefits

### With S3 Only:
```
✅ Reliable cloud storage
✅ No local storage needed
✅ Automatic backups
✅ 99.999999999% durability
✅ Automatic WebP optimization (70-85% smaller)
✅ Thumbnail generation
```

### With S3 + CloudFront:
```
✅ All S3 benefits above, PLUS:
✅ 10x faster image delivery worldwide
✅ Edge caching (images cached globally)
✅ Lower latency (images served from nearest location)
✅ Reduced S3 costs (cached at edge)
✅ Better SEO (faster = higher rankings)
✅ HTTPS by default
```

---

## 💰 Cost Estimate

### Free Tier (First 12 Months):
- **S3 Storage:** 5 GB free
- **S3 Requests:** 20,000 GET, 2,000 PUT
- **CloudFront:** 1 TB data transfer, 10M requests
- **Estimated cost:** $0/month for small sites

### After Free Tier (Example for 10 GB, 100K images/month):
- **S3 Storage:** ~$0.23/month (10 GB × $0.023/GB)
- **S3 Requests:** ~$0.40/month (100K requests)
- **CloudFront:** ~$8.50/month (100 GB transfer)
- **Total:** ~$9/month

### With Image Optimization:
- **Before:** 10 GB images
- **After:** 2 GB images (78% reduction)
- **Storage cost:** $0.23 → $0.05/month
- **Transfer cost:** $8.50 → $1.70/month
- **New total:** ~$2/month (81% savings!)

---

## 🔧 Features Implemented

### Automatic Optimization
```typescript
// When you upload an image:
Original: my-phone.jpg (2.5 MB)
↓ Automatic Processing ↓
Uploaded: abc123.webp (450 KB)  // S3
Thumbnail: abc123-thumb.webp (45 KB)  // S3
Delivered via: CloudFront (fast!)
✅ 82% smaller, 10x faster!
```

### Smart Features:
- ✅ **Auto WebP conversion** - All images → WebP
- ✅ **Image resizing** - Max 1920x1920 (preserves aspect ratio)
- ✅ **Thumbnail generation** - 400x400 for lists
- ✅ **Quality optimization** - 80% quality (invisible difference)
- ✅ **CloudFront URLs** - Fast global delivery
- ✅ **Cache headers** - 1 year browser cache
- ✅ **SVG support** - No optimization for vectors
- ✅ **Fallback** - Original uploaded if optimization fails

---

## 🛠️ Troubleshooting

### Error: "Empty value provided for input HTTP label: Bucket"

**Cause:** AWS environment variables not set

**Solution:**
1. Check `.env.local` file exists
2. Verify all AWS variables are set
3. Restart server: `npm run dev`
4. Check console for:
   ```
   Environment check: {
     hasS3Bucket: true,
     hasAccessKey: true,
     hasSecretKey: true,
     region: 'eu-central-1'
   }
   ```

### Error: "Access Denied"

**Cause:** IAM user doesn't have S3 permissions

**Solution:**
1. Go to IAM → Users → your user
2. Click "Add permissions"
3. Attach "AmazonS3FullAccess" policy

### Error: "The bucket does not allow ACLs"

**Cause:** Bucket has ACLs disabled

**Solution:**
1. Go to S3 → Your bucket → Permissions
2. Scroll to "Object Ownership"
3. Click "Edit"
4. Select "ACLs enabled"
5. Click "Save changes"

### Images Upload but Don't Load

**Cause:** Bucket policy doesn't allow public access

**Solution:**
1. Check Step 2.4 above (Bucket Policy)
2. Make sure public access is allowed
3. Verify CORS configuration

### CloudFront Shows S3 URLs Instead

**Cause:** `AWS_CLOUDFRONT_DOMAIN` not set

**Solution:**
1. Add to `.env.local`:
   ```
   AWS_CLOUDFRONT_DOMAIN=d1234567890.cloudfront.net
   ```
2. Restart server

---

## 📊 Monitoring

### Check Usage

1. **S3 Storage**
   - AWS Console → S3 → Your bucket
   - Click "Metrics" tab
   - View storage size and request metrics

2. **CloudFront**
   - AWS Console → CloudFront → Your distribution
   - Click "Monitoring" tab
   - View requests, data transfer, cache hit ratio

3. **Costs**
   - AWS Console → Billing Dashboard
   - View current month charges
   - Set up billing alerts

---

## 🔐 Security Best Practices

### 1. Rotate Access Keys Regularly
```bash
# Every 90 days:
1. Create new IAM user access key
2. Update .env.local
3. Delete old access key
```

### 2. Use Separate IAM Users
```bash
# Don't use root account
# Create dedicated IAM user per application
```

### 3. Limit Permissions
```bash
# Only grant S3 access, not EC2, RDS, etc.
# Use principle of least privilege
```

### 4. Enable CloudTrail
```bash
# Track all S3 API calls
# Detect unauthorized access
```

---

## 📝 Next Steps

### After Setup:
- [ ] Upload test image via admin
- [ ] Verify image appears on website
- [ ] Check S3 bucket for files
- [ ] Verify CloudFront URL
- [ ] Monitor first month costs
- [ ] Set up billing alerts

### Optional Enhancements:
- [ ] Add custom domain to CloudFront
- [ ] Set up SSL certificate
- [ ] Enable CloudFront logging
- [ ] Add image CDN invalidation
- [ ] Set up S3 lifecycle policies (delete old uploads)

---

## 📞 Support Resources

- **AWS Documentation:** https://docs.aws.amazon.com/
- **S3 User Guide:** https://docs.aws.amazon.com/s3/
- **CloudFront Guide:** https://docs.aws.amazon.com/cloudfront/
- **Pricing Calculator:** https://calculator.aws/
- **AWS Free Tier:** https://aws.amazon.com/free/

---

**Status:** ✅ **Ready to Configure**

**Last Updated:** November 9, 2025  
**Version:** 1.0
