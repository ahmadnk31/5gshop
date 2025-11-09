# Fix CloudFront "Access Denied" Error

## Problem
When accessing images through CloudFront URL, you get "Access Denied" error. This happens because CloudFront doesn't have permission to access your S3 bucket.

## Solution: Configure S3 Bucket Policy

### Step 1: Go to S3 Bucket Permissions

1. Open [AWS S3 Console](https://s3.console.aws.amazon.com/s3/buckets)
2. Click on your bucket: **tire-files**
3. Go to **Permissions** tab
4. Scroll down to **Bucket policy**
5. Click **Edit**

### Step 2: Update Your Existing Bucket Policy

You already have a good policy with admin permissions. Just add the CloudFront statement to it:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::tire-files/*"
        },
        {
            "Sid": "AllowedActionsForAdmin",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::175314215730:user/tire"
            },
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::tire-files",
                "arn:aws:s3:::tire-files/*"
            ]
        },
        {
            "Sid": "AllowCloudFrontServicePrincipal",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudfront.amazonaws.com"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::tire-files/*"
        },
        {
            "Sid": "DenyNonSecureTransport",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::tire-files",
                "arn:aws:s3:::tire-files/*"
            ],
            "Condition": {
                "Bool": {
                    "aws:SecureTransport": "false"
                }
            }
        }
    ]
}
```

**What this does**:
1. ✅ **Public read access** - Anyone can view images (needed for website)
2. ✅ **Admin permissions** - Your IAM user can upload/delete files
3. ✅ **CloudFront access** - CloudFront can serve files from CDN
4. ✅ **HTTPS only** - Forces secure connections (good security practice)

### Step 3: Save the Policy

1. Click **Save changes**
2. You should see a message: "Successfully edited bucket policy"

### Step 4: Verify CloudFront Origin Access

1. Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront)
2. Click on your distribution ID (starts with E...)
3. Go to **Origins** tab
4. Click on your S3 origin
5. Click **Edit**

Make sure:
- **Origin access** is set to **Public** OR
- **Origin access control** is properly configured

If using Origin Access Control (recommended):

1. Click **Create new OAC** if you don't have one
2. Give it a name: `tire-files-oac`
3. Click **Create**
4. After saving, you'll see a message to update S3 bucket policy
5. Copy the policy and add it to your S3 bucket (replace the one above)

### Step 5: Alternative - Simpler Public Access

If the above doesn't work, make the bucket fully public:

1. In S3, go to your bucket **tire-files**
2. **Permissions** tab
3. **Block public access** section
4. Click **Edit**
5. **Uncheck** all boxes (especially "Block all public access")
6. Click **Save changes**
7. Type `confirm` and confirm

Then add the bucket policy from Step 2.

### Step 6: Test

1. Upload a test image through your application
2. Copy the CloudFront URL from the response
3. Open it in a new browser tab
4. It should display the image ✅

## Quick Check Commands

Test if S3 URL works (should work):
```bash
curl -I https://tire-files.s3.us-east-1.amazonaws.com/repair-images/test-image.webp
```

Test if CloudFront URL works (should work after fix):
```bash
curl -I https://d1ruemo77mk2ro.cloudfront.net/repair-images/test-image.webp
```

## Alternative: Keep Bucket Private (More Secure)

If you want to keep the bucket private and use CloudFront with Origin Access Control:

### 1. Create Origin Access Control in CloudFront

1. Go to CloudFront Console
2. Select your distribution
3. **Origins** tab → Select your origin → **Edit**
4. **Origin access**: Choose **Origin access control settings**
5. Create new OAC or select existing
6. **Save changes**

### 2. Copy the S3 Bucket Policy

CloudFront will show you a policy to add to S3. It looks like this:

```json
{
    "Version": "2012-10-17",
    "Statement": {
        "Sid": "AllowCloudFrontServicePrincipalReadOnly",
        "Effect": "Allow",
        "Principal": {
            "Service": "cloudfront.amazonaws.com"
        },
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::tire-files/*",
        "Condition": {
            "StringEquals": {
                "AWS:SourceArn": "arn:aws:cloudfront::YOUR-ACCOUNT-ID:distribution/YOUR-DISTRIBUTION-ID"
            }
        }
    }
}
```

### 3. Add Policy to S3

1. Go to S3 → tire-files → Permissions → Bucket policy
2. Paste the policy
3. Save

### 4. Keep Block Public Access ON

1. In S3 bucket Permissions
2. Keep **Block all public access** ENABLED (checked)
3. This keeps bucket private, only CloudFront can access

## Troubleshooting

### Still Getting Access Denied?

1. **Wait 5-10 minutes** - CloudFront changes can take time to propagate
2. **Invalidate CloudFront cache**:
   - Go to CloudFront Console
   - Select your distribution
   - **Invalidations** tab
   - Click **Create invalidation**
   - Enter `/*` to invalidate everything
   - Click **Create invalidation**

3. **Check CORS** (if uploading from browser):
   - Go to S3 → tire-files → Permissions → CORS
   - Should have the CORS configuration we added earlier

4. **Verify IAM permissions**:
   - Make sure your IAM user has these permissions:
     - `s3:PutObject`
     - `s3:GetObject`
     - `s3:DeleteObject`
     - `s3:PutObjectAcl` (optional)

## Summary

**Quick Fix (Public Access)**:
1. S3 → tire-files → Permissions
2. Unblock public access
3. Add bucket policy (from Step 2 above)
4. Wait 5-10 minutes
5. Test CloudFront URL ✅

**Secure Fix (Private with OAC)**:
1. CloudFront → Create Origin Access Control
2. Copy the policy CloudFront provides
3. Add it to S3 bucket policy
4. Keep block public access ON
5. Wait 5-10 minutes
6. Test CloudFront URL ✅

## Files to Check

After fixing, verify your `.env.local` has:
```bash
AWS_CLOUDFRONT_DOMAIN=d1ruemo77mk2ro.cloudfront.net
```

## Need Help?

If still not working:
1. Share the exact error message
2. Check browser console (F12) → Network tab
3. Look for response status (403, 404, etc.)
4. Check CloudFront distribution status (should be "Deployed")
