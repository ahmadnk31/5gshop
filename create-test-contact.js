const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestContact() {
  try {
    console.log('🧪 Creating test contact for admin response testing...');
    
    const testContact = await prisma.contact.create({
      data: {
        firstName: 'Test',
        lastName: 'Customer',
        email: 'shafiq@5gphones.be', // Use your email so you can test receiving responses
        phone: '+32123456789',
        serviceType: 'Smartphone Repair',
        device: 'iPhone 15 Pro',
        message: 'My phone screen is cracked and not responding to touch. Can you help me get it fixed?',
        status: 'new',
        createdAt: new Date(),
      }
    });

    console.log('✅ Test contact created successfully!');
    console.log('📧 Email:', testContact.email);
    console.log('🆔 Contact ID:', testContact.id);
    console.log('📱 Device:', testContact.device);
    console.log('💬 Message:', testContact.message);
    console.log('');
    console.log('🎯 Next steps:');
    console.log('1. Go to http://localhost:3000/admin');
    console.log('2. Click "Contacts" tab');
    console.log('3. Find the test contact and click "View Details"');
    console.log('4. Send a response to test the email functionality');
    
  } catch (error) {
    console.error('❌ Error creating test contact:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestContact();
