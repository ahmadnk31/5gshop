const { SESService } = require('./lib/ses-service.ts');
require('dotenv').config({ path: '.env.local' });

// Test the real email sending functionality
async function testRealEmailSending() {
  try {
    console.log('🧪 Testing REAL email sending...');
    console.log('MOCK_EMAIL_MODE:', process.env.MOCK_EMAIL_MODE);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    const result = await SESService.sendContactResponse({
      customerEmail: 'shafiq@5gphones.be',
      customerName: 'Test Customer',
      responseMessage: 'This is a test response to verify real email sending is working. If you receive this email, the fix was successful!',
      adminEmail: 'shafiq@5gphones.be'
    });
    
    console.log('✅ Real email sent successfully!');
    console.log('📧 Message ID:', result.MessageId);
    console.log('📬 Check your inbox at: shafiq@5gphones.be');
    
  } catch (error) {
    console.error('❌ Failed to send real email:', error.message);
    console.error('Full error:', error);
  }
}

testRealEmailSending();
