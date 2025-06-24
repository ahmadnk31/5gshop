const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
require('dotenv').config({ path: '.env.local' });

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testEmailSending() {
  try {
    console.log("📧 Testing email sending...");
    console.log("From:", process.env.SES_FROM_EMAIL);
    console.log("To:", process.env.SES_ADMIN_EMAIL);
    
    const command = new SendEmailCommand({
      Source: process.env.SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [process.env.SES_ADMIN_EMAIL],
      },
      Message: {
        Subject: {
          Data: "Test Email from Contact System",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: `
              <h2>🎉 Email System Test</h2>
              <p>This is a test email from your contact management system.</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>System:</strong> TechFix Pro Contact Management</p>
              <p>If you received this email, your AWS SES configuration is working correctly!</p>
            `,
            Charset: "UTF-8",
          },
          Text: {
            Data: `
              Email System Test
              
              This is a test email from your contact management system.
              Time: ${new Date().toLocaleString()}
              System: TechFix Pro Contact Management
              
              If you received this email, your AWS SES configuration is working correctly!
            `,
            Charset: "UTF-8",
          },
        },
      },
    });

    const result = await sesClient.send(command);
    console.log("✅ Test email sent successfully!");
    console.log("📧 Message ID:", result.MessageId);
    console.log("📬 Check your inbox at:", process.env.SES_ADMIN_EMAIL);
    
  } catch (error) {
    console.error("❌ Failed to send test email:", error.message);
    
    if (error.message.includes('Email address not verified')) {
      console.log("📋 Solution: Verify your email addresses first:");
      console.log("   1. Check inboxes for verification emails");
      console.log("   2. Click verification links");
      console.log("   3. Run this test again");
    }
  }
}

testEmailSending();
