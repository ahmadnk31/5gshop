// Configure S3 bucket CORS policy for file uploads
require('dotenv').config({ path: '.env.local' });
const { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';

const corsConfiguration = {
  CORSRules: [
    {
      ID: 'AllowWebAppUploads',
      AllowedHeaders: ['*'],
      AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
      AllowedOrigins: [
        'http://localhost:3000',
        'http://localhost:3001', 
        'https://yourproductiondomain.com', // Replace with your actual domain
        'https://*.vercel.app' // If using Vercel
      ],
      ExposeHeaders: ['ETag'],
      MaxAgeSeconds: 3000
    }
  ]
};

async function configureCORS() {
  try {
    console.log(`Configuring CORS for bucket: ${BUCKET_NAME}`);
    
    // Check current CORS configuration
    try {
      const currentCors = await s3Client.send(new GetBucketCorsCommand({ Bucket: BUCKET_NAME }));
      console.log('Current CORS configuration:', JSON.stringify(currentCors.CORSRules, null, 2));
    } catch (error) {
      if (error.name === 'NoSuchCORSConfiguration') {
        console.log('No CORS configuration found. Setting up new configuration...');
      }
    }

    // Set new CORS configuration
    await s3Client.send(new PutBucketCorsCommand({
      Bucket: BUCKET_NAME,
      CORSConfiguration: corsConfiguration
    }));

    console.log('✓ CORS configuration updated successfully!');
    console.log('New CORS rules:');
    console.log(JSON.stringify(corsConfiguration.CORSRules, null, 2));
    
    // Verify the configuration was applied
    console.log('\nVerifying configuration...');
    const updatedCors = await s3Client.send(new GetBucketCorsCommand({ Bucket: BUCKET_NAME }));
    console.log('✓ Configuration verified!');
    
    console.log('\n🎉 Your S3 bucket is now configured for file uploads!');
    console.log('You can now try uploading files again.');
    
  } catch (error) {
    console.error('❌ Failed to configure CORS:', error.message);
    
    if (error.name === 'AccessDenied') {
      console.error('\n💡 Solution: Your AWS user needs s3:PutBucketCors permission.');
      console.error('Add this policy to your AWS user:');
      console.error(JSON.stringify({
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "s3:PutBucketCors",
              "s3:GetBucketCors",
              "s3:PutObject",
              "s3:GetObject",
              "s3:DeleteObject"
            ],
            "Resource": [
              `arn:aws:s3:::${BUCKET_NAME}`,
              `arn:aws:s3:::${BUCKET_NAME}/*`
            ]
          }
        ]
      }, null, 2));
    }
  }
}

configureCORS();
