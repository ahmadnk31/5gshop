// Test script to verify AWS SES configuration
const { SESClient, GetSendQuotaCommand, GetIdentityVerificationAttributesCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testSESConfig() {
  try {
    console.log("Testing AWS SES Configuration...");
    console.log("Region:", process.env.AWS_REGION);
    console.log("From Email:", process.env.SES_FROM_EMAIL);
    console.log("Admin Email:", process.env.SES_ADMIN_EMAIL);
    console.log("Has Access Key:", !!process.env.AWS_ACCESS_KEY_ID);
    console.log("Has Secret Key:", !!process.env.AWS_SECRET_ACCESS_KEY);
    
    // Check send quota
    const quotaCommand = new GetSendQuotaCommand({});
    const quotaResult = await sesClient.send(quotaCommand);
    console.log("Send Quota:", quotaResult);
    
    // Check identity verification
    const identityCommand = new GetIdentityVerificationAttributesCommand({
      Identities: [process.env.SES_FROM_EMAIL, process.env.SES_ADMIN_EMAIL]
    });
    const identityResult = await sesClient.send(identityCommand);
    console.log("Identity Verification:", identityResult.VerificationAttributes);
    
  } catch (error) {
    console.error("SES Configuration Error:", error.message);
    console.error("Error Code:", error.name);
    console.error("Full Error:", error);
  }
}

testSESConfig();
