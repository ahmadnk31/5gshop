const { SESClient, GetIdentityVerificationAttributesCommand, VerifyEmailIdentityCommand } = require("@aws-sdk/client-ses");
require('dotenv').config({ path: '.env.local' });

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function checkAndVerifyEmails() {
  try {
    console.log("🔍 Checking email verification status...");
    
    const emails = [process.env.SES_FROM_EMAIL, process.env.SES_ADMIN_EMAIL];
    console.log("📧 Emails to check:", emails);
    
    // Check verification status
    const checkCommand = new GetIdentityVerificationAttributesCommand({
      Identities: emails
    });
    
    const result = await sesClient.send(checkCommand);
    console.log("📋 Current verification status:", result.VerificationAttributes);
    
    // Verify emails if not verified
    for (const email of emails) {
      if (!result.VerificationAttributes[email] || 
          result.VerificationAttributes[email].VerificationStatus !== 'Success') {
        console.log(`📤 Sending verification email to: ${email}`);
        
        const verifyCommand = new VerifyEmailIdentityCommand({
          EmailAddress: email
        });
        
        await sesClient.send(verifyCommand);
        console.log(`✅ Verification email sent to: ${email}`);
        console.log(`📬 Check your inbox at ${email} and click the verification link`);
      } else {
        console.log(`✅ ${email} is already verified`);
      }
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("📝 Full error:", error);
  }
}

checkAndVerifyEmails();
