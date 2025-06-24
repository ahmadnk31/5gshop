import { DeviceType } from './types'

// Helper function to get device icon based on type
export function getDeviceIcon(deviceType: DeviceType) {
  const iconMap: Record<DeviceType, string> = {
    SMARTPHONE: 'smartphone',
    TABLET: 'tablet',
    LAPTOP: 'laptop',
    SMARTWATCH: 'watch',
    DESKTOP: 'monitor',
    GAMING_CONSOLE: 'gamepad',
    OTHER: 'package',
  }
  
  return iconMap[deviceType] || 'smartphone'
}

// Helper function to get common repair cost ranges
export function getRepairCostRange(deviceType: DeviceType, serviceType: string) {
  const costRanges: Record<DeviceType, Record<string, { min: number; max: number }>> = {
    SMARTPHONE: {
      'Screen Replacement': { min: 80, max: 250 },
      'Battery Replacement': { min: 25, max: 80 },
      'Camera Repair': { min: 60, max: 150 },
      'Charging Port Repair': { min: 40, max: 100 },
      'Water Damage Recovery': { min: 100, max: 300 },
      'Home Button Repair': { min: 30, max: 80 },
      'Speaker Repair': { min: 35, max: 90 },
      'Microphone Repair': { min: 30, max: 75 },
    },
    TABLET: {
      'Screen Replacement': { min: 120, max: 400 },
      'Battery Replacement': { min: 40, max: 120 },
      'Charging Port Repair': { min: 50, max: 120 },
      'Home Button Repair': { min: 40, max: 100 },
      'Camera Repair': { min: 70, max: 180 },
      'Software Issues': { min: 30, max: 80 },
      'Water Damage Recovery': { min: 150, max: 400 },
    },
    LAPTOP: {
      'Screen Replacement': { min: 150, max: 500 },
      'Keyboard Repair': { min: 60, max: 200 },
      'Battery Replacement': { min: 80, max: 250 },
      'Charging Port Repair': { min: 70, max: 180 },
      'Performance Optimization': { min: 50, max: 120 },
      'Virus Removal': { min: 40, max: 100 },
      'RAM Upgrade': { min: 100, max: 300 },
      'SSD Upgrade': { min: 150, max: 400 },
      'Fan Cleaning': { min: 30, max: 80 },
    },
    SMARTWATCH: {
      'Screen Replacement': { min: 60, max: 200 },
      'Battery Replacement': { min: 40, max: 120 },
      'Band Replacement': { min: 20, max: 80 },
      'Crown Repair': { min: 50, max: 150 },
      'Water Damage Recovery': { min: 80, max: 250 },
      'Software Issues': { min: 30, max: 80 },
    },
    DESKTOP: {
      'Component Replacement': { min: 100, max: 800 },
      'Performance Optimization': { min: 60, max: 150 },
      'Virus Removal': { min: 50, max: 120 },
      'RAM Upgrade': { min: 80, max: 300 },
      'Storage Upgrade': { min: 120, max: 400 },
      'Graphics Card Repair': { min: 200, max: 600 },
      'Power Supply Repair': { min: 100, max: 250 },
    },
    GAMING_CONSOLE: {
      'HDMI Port Repair': { min: 50, max: 120 },
      'Disc Drive Repair': { min: 80, max: 200 },
      'Overheating Fix': { min: 60, max: 150 },
      'Controller Repair': { min: 30, max: 80 },
      'Software Issues': { min: 40, max: 100 },
    },
    OTHER: {
      'General Repair': { min: 50, max: 200 },
      'Diagnostic': { min: 25, max: 75 },
    },
  }
  
  return costRanges[deviceType]?.[serviceType] || { min: 50, max: 200 }
}
