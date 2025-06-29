const { SESService } = require('./lib/ses-service');

async function testOrderEmailSystem() {
  console.log('🧪 Testing Order Email System...\n');

  try {
    // Test 1: Order confirmation email
    console.log('📧 Test 1: Sending order confirmation email...');
    await SESService.sendOrderStatusEmail({
      to: 'test@example.com',
      status: 'confirmed',
      orderId: 'test-order-123',
      order: {
        id: 'test-order-123',
        amount: 99.99,
        currency: 'EUR',
        createdAt: new Date(),
        shippingAddress: {
          name: 'John Doe',
          line1: '123 Test Street',
          line2: 'Apt 4B',
          city: 'Leuven',
          state: 'Vlaams-Brabant',
          postalCode: '3000',
          country: 'Belgium'
        }
      },
      products: [
        {
          name: 'iPhone 14 Screen Replacement',
          image: 'https://example.com/screen.jpg',
          quantity: 1,
          price: 99.99
        },
        {
          name: 'Phone Case',
          image: 'https://example.com/case.jpg',
          quantity: 2,
          price: 15.00
        }
      ]
    });
    console.log('✅ Order confirmation email test completed\n');

    // Test 2: Shipping label email
    console.log('📧 Test 2: Sending shipping label email...');
    await SESService.sendShippingLabelEmail({
      customerEmail: 'test@example.com',
      customerName: 'John Doe',
      orderId: 'test-order-123',
      orderDetails: {
        id: 'test-order-123',
        amount: 99.99,
        currency: 'EUR',
        createdAt: new Date(),
        shippingAddress: {
          name: 'John Doe',
          line1: '123 Test Street',
          line2: 'Apt 4B',
          city: 'Leuven',
          state: 'Vlaams-Brabant',
          postalCode: '3000',
          country: 'Belgium'
        }
      },
      labelAttachment: {
        filename: 'shipping-label-test.pdf',
        content: 'JVBERi0xLjQKJcOkw7zDtsO...', // Base64 encoded PDF content
        contentType: 'application/pdf'
      },
      trackingNumber: 'TRACK123456789',
      message: 'Your order has been shipped! You can track it using the tracking number above.'
    });
    console.log('✅ Shipping label email test completed\n');

    // Test 3: Admin notification email
    console.log('📧 Test 3: Sending admin notification email...');
    await SESService.sendRawEmail({
      to: SESService.adminEmail,
      subject: 'Test: New Order Received - Order #test-order-123',
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
              .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #495057; }
              .value { color: #212529; margin-top: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Test: New Order Received</h1>
                <p>Order #test-order-123 - Manual Shipping Label Required</p>
              </div>
              
              <div class="content">
                <div class="field">
                  <div class="label">Order ID:</div>
                  <div class="value">test-order-123</div>
                </div>
                
                <div class="field">
                  <div class="label">Customer Email:</div>
                  <div class="value">test@example.com</div>
                </div>
                
                <div class="field">
                  <div class="label">Customer Name:</div>
                  <div class="value">John Doe</div>
                </div>
                
                <div class="field">
                  <div class="label">Order Amount:</div>
                  <div class="value">€99.99 EUR</div>
                </div>
                
                <div class="field">
                  <div class="label">Shipping Address:</div>
                  <div class="value">
                    John Doe<br>
                    123 Test Street<br>
                    Apt 4B<br>
                    Leuven, Vlaams-Brabant 3000<br>
                    Belgium
                  </div>
                </div>
                
                <p style="margin-top: 20px; color: #6c757d; font-size: 14px;">
                  This is a test email. Please process this order and send the shipping label to the customer manually.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Test: New Order Received - Order #test-order-123
        
        Customer: John Doe
        Email: test@example.com
        Amount: €99.99 EUR
        
        Shipping Address:
        John Doe
        123 Test Street
        Apt 4B
        Leuven, Vlaams-Brabant 3000
        Belgium
        
        This is a test email. Please process this order and send the shipping label to the customer manually.
      `
    });
    console.log('✅ Admin notification email test completed\n');

    console.log('🎉 All email tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Order confirmation emails will be sent to customers when orders are placed');
    console.log('- Admin notification emails will be sent to you for manual shipping label processing');
    console.log('- Shipping label emails can be sent manually from the admin panel');
    console.log('- All emails use AWS SES and include proper HTML formatting');

  } catch (error) {
    console.error('❌ Email test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('- Check your AWS SES configuration in .env file');
    console.log('- Ensure your email addresses are verified in SES');
    console.log('- Check if MOCK_EMAIL_MODE is enabled for development');
  }
}

// Run the test
testOrderEmailSystem(); 