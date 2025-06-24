// Test AWS S3 configuration
require('dotenv').config({ path: '.env.local' });
const { S3Client, ListBucketsCommand, HeadBucketCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';

async function testS3Configuration() {
  console.log('Testing AWS S3 Configuration...');
  console.log('Region:', process.env.AWS_REGION);
  console.log('Bucket Name:', BUCKET_NAME);
  console.log('Access Key ID:', process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not set');
  console.log('Secret Access Key:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set');
  console.log('');

  try {
    // Test if we can list buckets (general AWS access)
    console.log('Testing general AWS access...');
    const listCommand = new ListBucketsCommand({});
    const buckets = await s3Client.send(listCommand);
    console.log('✓ AWS credentials are valid');
    console.log('Available buckets:', buckets.Buckets?.map(b => b.Name).join(', ') || 'None');
    console.log('');

    // Test if the specific bucket exists and we have access
    console.log(`Testing access to bucket: ${BUCKET_NAME}...`);
    const headCommand = new HeadBucketCommand({ Bucket: BUCKET_NAME });
    await s3Client.send(headCommand);
    console.log('✓ Bucket exists and is accessible');
    
  } catch (error) {
    console.error('✗ S3 Configuration Error:', error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.error('The bucket does not exist. Available buckets are listed above.');
    } else if (error.name === 'Forbidden' || error.name === 'AccessDenied') {
      console.error('Access denied. Check your IAM permissions.');
    } else if (error.name === 'InvalidAccessKeyId') {
      console.error('Invalid AWS Access Key ID.');
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.error('Invalid AWS Secret Access Key.');
    }
  }
}

testS3Configuration();
