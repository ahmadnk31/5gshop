# Fix CloudFront 403 Error - Step by Step

## Current Status
✅ S3 direct access works: `https://tire-files.s3.us-east-1.amazonaws.com/...`
❌ CloudFront access fails: `https://d1ruemo77mk2ro.cloudfront.net/...` (403 Forbidden)

## Root Cause
CloudFront distribution is not properly configured to access your S3 bucket.

## Solution: Fix CloudFront Origin Settings

### Step 1: Go to CloudFront Console

1. Open [AWS CloudFront Console](https://console.aws.amazon.com/cloudfront/v3/home)
2. Find your distribution: **d1ruemo77mk2ro.cloudfront.net**
3. Click on the Distribution ID to open it

### Step 2: Edit the Origin

1. Click on the **Origins** tab
2. You should see an origin pointing to `tire-files.s3.us-east-1.amazonaws.com`
3. Select that origin (checkbox)
4. Click **Edit** button

### Step 3: Configure Origin Access

You'll see **"Origin access"** section. Change it to **"Public"**:

**Option A: Simple Public Access (Recommended for now)**
1. Under **Origin access**, select: **"Public"**
2. Scroll down and click **Save changes**

This tells CloudFront to access your S3 bucket as a public endpoint.

### Step 4: Wait for Deployment

1. Back on the distribution page, you'll see **Status: Deploying**
2. Wait 5-10 minutes for status to change to **Deployed**
3. The **Last modified** date will update

### Step 5: Create Invalidation (Clear Cache)

Since CloudFront cached the 403 error, we need to clear it:

1. Click on the **Invalidations** tab
2. Click **Create invalidation**
3. In **Object paths**, enter: `/*`
4. Click **Create invalidation**
5. Wait 2-3 minutes for invalidation to complete

### Step 6: Test

Run this command:
```bash
curl -I https://d1ruemo77mk2ro.cloudfront.net/repair-images/1762713805678-00i9ksdhslgw8.webp
```

You should see:
```
HTTP/2 200 
```

If you still see 403, wait another 5 minutes and try again.

---

## Alternative: Origin Access Control (More Secure)

If you want more security (only CloudFront can access S3, not direct links):

### Step A: Create Origin Access Control

1. In CloudFront Console, click on your distribution
2. **Origins** tab → Select origin → **Edit**
3. Under **Origin access**, select: **"Origin access control settings (recommended)"**
4. Click **Create new OAC**
   - Name: `tire-files-oac`
   - Signing behavior: `Sign requests (recommended)`
   - Origin type: `S3`
5. Click **Create**
6. Click **Save changes**

### Step B: Update S3 Bucket Policy

CloudFront will show you a policy. Copy it. It looks like this:

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
                "AWS:SourceArn": "arn:aws:cloudfront::175314215730:distribution/YOUR_DISTRIBUTION_ID"
            }
        }
    }
}
```

### Step C: Add to Your S3 Bucket Policy

Go to S3 → tire-files → Permissions → Bucket policy → Edit

**Replace your entire policy with this** (combines everything):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowCloudFrontServicePrincipalReadOnly",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudfront.amazonaws.com"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::tire-files/*",
            "Condition": {
                "StringEquals": {
                    "AWS:SourceArn": "arn:aws:cloudfront::175314215730:distribution/YOUR_DISTRIBUTION_ID"
                }
            }
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

**Important**: Replace `YOUR_DISTRIBUTION_ID` with your actual CloudFront distribution ID (starts with E...)

### Step D: Remove Public Access (Optional)

With OAC, you can make the bucket private:

1. S3 → tire-files → Permissions → Block public access
2. Click **Edit**
3. **Check** "Block all public access"
4. Save

This means only CloudFront can access files, not direct S3 URLs.

---

## Quick Fix Summary

**Fastest Solution (Do this now):**

1. CloudFront Console → Your distribution → Origins tab
2. Edit origin → Origin access → Select **"Public"**
3. Save changes
4. Wait 5 minutes
5. Create invalidation `/*`
6. Wait 2 minutes
7. Test ✅

**Time**: 10-15 minutes total

## Verification

After fixing, test both URLs:

```bash
# CloudFront URL (should work)
curl -I https://d1ruemo77mk2ro.cloudfront.net/repair-images/1762713805678-00i9ksdhslgw8.webp

# S3 URL (should work)
curl -I https://tire-files.s3.us-east-1.amazonaws.com/repair-images/1762713805678-00i9ksdhslgw8.webp
```

Both should return `HTTP 200 OK`.

## Screenshots of What to Look For

When editing CloudFront origin, you should see:

```
Origin access
○ Public (default)
○ Origin access control settings (recommended)
○ Legacy access identities
```

Select **"Public"** for the quick fix.

---

## Need Help?

If still not working after 15 minutes:
1. Check CloudFront distribution status is "Deployed"
2. Check invalidation status is "Completed"
3. Try accessing from incognito/private browser
4. Share the CloudFront distribution ID so I can help debug

## Expected Timeline

- Save origin changes: Immediate
- CloudFront deployment: 5-10 minutes
- Invalidation: 2-5 minutes
- **Total: 10-15 minutes**

Be patient! CloudFront changes take time to propagate globally.
