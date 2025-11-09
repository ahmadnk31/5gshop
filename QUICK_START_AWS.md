# 🚀 Quick Start: AWS S3 + CloudFront

## What You Need (5 Minutes)

### 1. Create S3 Bucket
```
1. Go to AWS Console → S3
2. Create bucket: "5gshop-images"
3. Region: eu-central-1 (or your region)
4. Uncheck "Block all public access"
5. Add bucket policy (see guide)
```

### 2. Create IAM User
```
1. AWS Console → IAM → Users
2. Create user: "5gshop-uploader"
3. Attach policy: "AmazonS3FullAccess"
4. Save Access Key ID and Secret
```

### 3. Create CloudFront (Optional)
```
1. AWS Console → CloudFront
2. Create distribution
3. Origin: Your S3 bucket
4. Save domain: d1234567890.cloudfront.net
```

### 4. Configure .env.local
```bash
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET_NAME=5gshop-images
AWS_CLOUDFRONT_DOMAIN=d1234567890.cloudfront.net
```

### 5. Restart Server
```bash
npm run dev
```

---

## ✅ What You Get

```
✅ Automatic WebP conversion (70-85% smaller)
✅ Image optimization (max 1920x1920)
✅ Thumbnail generation (400x400)
✅ CloudFront CDN (10x faster)
✅ 1-year browser caching
✅ Unlimited scalability
✅ $0-4/month cost
```

---

## 📖 Full Guide

See: `AWS_CLOUDFRONT_SETUP_GUIDE.md`

---

**Status:** Ready to Configure!
