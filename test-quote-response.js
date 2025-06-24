// Test script to create a quote and test email response functionality
const { DatabaseService } = require('./lib/database.ts');
const { submitQuoteRequest } = require('./app/actions/quote-actions.ts');

async function createTestQuote() {
  try {
    console.log('Creating test quote...');
    
    const testQuoteData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      phone: '+32 123 456 789',
      deviceType: 'SMARTPHONE',
      brand: 'Apple',
      model: 'iPhone 15 Pro',
      service: 'Screen Repair',
      issueDescription: 'Screen is cracked and has black spots. Touch functionality is partially working.',
      issues: ['Cracked Screen', 'Display Issues', 'Touch Problems'],
      photos: [],
      urgency: 'normal',
      contactMethod: 'email'
    };

    const result = await submitQuoteRequest(testQuoteData);
    
    if (result.success) {
      console.log('✅ Test quote created successfully!');
      console.log('Quote ID:', result.quoteId);
      console.log('You can now test the admin email response functionality:');
      console.log('1. Go to http://localhost:3000/admin');
      console.log('2. Click on the "Quotes" tab');
      console.log('3. Find the test quote and click "View Details"');
      console.log('4. Enter pricing information and a response message');
      console.log('5. Click "Send Quote Response" to test the email functionality');
    } else {
      console.error('❌ Failed to create test quote:', result.message);
    }
  } catch (error) {
    console.error('❌ Error creating test quote:', error);
  }
}

createTestQuote();
