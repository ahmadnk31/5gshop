import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedRepairServices() {
  console.log('🔧 Seeding repair services...');

  const services = [
    {
      name: "Screen Replacement",
      description: "Cracked, black, or unresponsive screens",
      basePrice: 89,
      estimatedTime: 60,
      deviceTypes: JSON.stringify(["SMARTPHONE", "TABLET", "LAPTOP", "SMARTWATCH"]),
      popularity: "Most Popular",
      icon: "Zap"
    },
    {
      name: "Battery Replacement", 
      description: "Poor battery life or not charging properly",
      basePrice: 59,
      estimatedTime: 30,
      deviceTypes: JSON.stringify(["SMARTPHONE", "TABLET", "LAPTOP", "SMARTWATCH"]),
      popularity: "Most Popular",
      icon: "Battery"
    },
    {
      name: "Water Damage Recovery",
      description: "Device was exposed to water or liquid",
      basePrice: 149,
      estimatedTime: 180,
      deviceTypes: JSON.stringify(["SMARTPHONE", "TABLET", "SMARTWATCH"]),
      popularity: null,
      icon: "Droplet"
    },
    {
      name: "Charging Port Repair",
      description: "Device won't charge or loose connection",
      basePrice: 79,
      estimatedTime: 45,
      deviceTypes: JSON.stringify(["SMARTPHONE", "TABLET", "LAPTOP"]),
      popularity: null,
      icon: "Zap"
    },
    {
      name: "Camera Repair",
      description: "Blurry photos, camera won't open, or lens damage",
      basePrice: 119,
      estimatedTime: 90,
      deviceTypes: JSON.stringify(["SMARTPHONE", "TABLET"]),
      popularity: null,
      icon: "Camera"
    },
    {
      name: "Speaker Repair",
      description: "No sound, distorted audio, or low volume",
      basePrice: 89,
      estimatedTime: 60,
      deviceTypes: JSON.stringify(["SMARTPHONE", "TABLET", "LAPTOP"]),
      popularity: null,
      icon: "Volume2"
    },
    {
      name: "Home Button Repair",
      description: "Unresponsive home button or Touch ID issues",
      basePrice: 69,
      estimatedTime: 45,
      deviceTypes: JSON.stringify(["SMARTPHONE", "TABLET"]),
      popularity: null,
      icon: "Circle"
    },
    {
      name: "Keyboard Repair",
      description: "Sticky keys, missing keys, or unresponsive keyboard",
      basePrice: 129,
      estimatedTime: 90,
      deviceTypes: JSON.stringify(["LAPTOP", "DESKTOP"]),
      popularity: null,
      icon: "Keyboard"
    },
    {
      name: "RAM Upgrade",
      description: "Increase memory for better performance",
      basePrice: 99,
      estimatedTime: 60,
      deviceTypes: JSON.stringify(["LAPTOP", "DESKTOP"]),
      popularity: "Popular",
      icon: "Cpu"
    },
    {
      name: "SSD Upgrade",
      description: "Faster storage and better performance",
      basePrice: 179,
      estimatedTime: 120,
      deviceTypes: JSON.stringify(["LAPTOP", "DESKTOP"]),
      popularity: null,
      icon: "HardDrive"
    },
    {
      name: "Virus Removal",
      description: "Remove malware and optimize performance",
      basePrice: 89,
      estimatedTime: 180,
      deviceTypes: JSON.stringify(["LAPTOP", "DESKTOP"]),
      popularity: null,
      icon: "Shield"
    },
    {
      name: "HDMI Port Repair",
      description: "No video output or connection issues",
      basePrice: 129,
      estimatedTime: 120,
      deviceTypes: JSON.stringify(["GAMING_CONSOLE", "DESKTOP"]),
      popularity: null,
      icon: "Settings"
    },
    {
      name: "Cleaning & Maintenance",
      description: "Overheating, fan noise, or general maintenance",
      basePrice: 79,
      estimatedTime: 60,
      deviceTypes: JSON.stringify(["GAMING_CONSOLE", "DESKTOP", "LAPTOP"]),
      popularity: null,
      icon: "Droplet"
    },
    {
      name: "Button Repair",
      description: "Crown, home button, or other button malfunctions",
      basePrice: 69,
      estimatedTime: 120,
      deviceTypes: JSON.stringify(["SMARTWATCH", "SMARTPHONE", "TABLET"]),
      popularity: null,
      icon: "Settings"
    },
    {
      name: "Software Issues",
      description: "Operating system problems and software troubleshooting",
      basePrice: 89,
      estimatedTime: 120,
      deviceTypes: JSON.stringify(["SMARTPHONE", "TABLET", "SMARTWATCH"]),
      popularity: null,
      icon: "Settings"
    }
  ];

  // Clear existing services first
  await prisma.repairService.deleteMany({});

  // Create new services
  for (const service of services) {
    await prisma.repairService.create({
      data: service
    });
  }

  console.log(`✅ Created ${services.length} repair services`);
}

async function main() {
  try {
    await seedRepairServices();
  } catch (error) {
    console.error('❌ Error seeding repair services:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
