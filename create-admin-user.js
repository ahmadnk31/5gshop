const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔍 Checking for existing admin users...');
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Name: ${existingAdmin.name || 'Not set'}`);
      return;
    }

    console.log('❌ No admin user found. Creating one...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        hashedPassword: hashedPassword,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: admin123`);
    console.log(`   Role: ${adminUser.role}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function listUsers() {
  try {
    console.log('👥 Listing all users:');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    if (users.length === 0) {
      console.log('   No users found');
      return;
    }

    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.role})`);
      console.log(`      Name: ${user.firstName || ''} ${user.lastName || ''}`);
      console.log(`      Created: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error listing users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function updateUserRole(email, newRole) {
  try {
    console.log(`🔄 Updating user role for ${email} to ${newRole}...`);
    
    const user = await prisma.user.update({
      where: { email },
      data: { role: newRole }
    });

    console.log('✅ User role updated successfully!');
    console.log(`   Email: ${user.email}`);
    console.log(`   New Role: ${user.role}`);

  } catch (error) {
    console.error('❌ Error updating user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get command line arguments
const command = process.argv[2];
const email = process.argv[3];
const role = process.argv[4];

switch (command) {
  case 'create':
    createAdminUser();
    break;
  case 'list':
    listUsers();
    break;
  case 'update-role':
    if (!email || !role) {
      console.log('Usage: node create-admin-user.js update-role <email> <role>');
      console.log('Example: node create-admin-user.js update-role user@example.com admin');
      process.exit(1);
    }
    updateUserRole(email, role);
    break;
  default:
    console.log('Available commands:');
    console.log('  create        - Create a default admin user');
    console.log('  list          - List all users');
    console.log('  update-role   - Update user role (requires email and role)');
    console.log('');
    console.log('Examples:');
    console.log('  node create-admin-user.js create');
    console.log('  node create-admin-user.js list');
    console.log('  node create-admin-user.js update-role user@example.com admin');
    break;
} 