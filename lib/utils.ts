// Generate a SKU code from a part name (e.g., "iPhone 15 Pro Screen" -> "IPH15P-SCR")
export function generateSkuFromPartName(name: string): string {
  if (!name) return '';
  // Example: "iPhone 15 Pro Screen" -> [IPH][15P][SCR]
  const words = name.split(/\s+/);
  let sku = '';
  for (const word of words) {
    if (/^iPhone$/i.test(word)) {
      sku += 'IPH';
    } else if (/^Galaxy$/i.test(word)) {
      sku += 'GAL';
    } else if (/^Pro$/i.test(word)) {
      sku += 'P';
    } else if (/^Max$/i.test(word)) {
      sku += 'MX';
    } else if (/^Plus$/i.test(word)) {
      sku += 'PL';
    } else if (/^Ultra$/i.test(word)) {
      sku += 'U';
    } else if (/^Screen$/i.test(word)) {
      sku += '-SCR';
    } else if (/^Battery$/i.test(word)) {
      sku += '-BAT';
    } else if (/^Camera$/i.test(word)) {
      sku += '-CAM';
    } else if (/^Back$/i.test(word)) {
      sku += '-BCK';
    } else if (/^Glass$/i.test(word)) {
      sku += '-GLS';
    } else if (/^Charger$/i.test(word)) {
      sku += '-CHR';
    } else if (/^Cable$/i.test(word)) {
      sku += '-CBL';
    } else if (/^Case$/i.test(word)) {
      sku += '-CAS';
    } else if (/^Protector$/i.test(word)) {
      sku += '-PRO';
    } else if (/^Speaker$/i.test(word)) {
      sku += '-SPK';
    } else if (/^Microphone$/i.test(word)) {
      sku += '-MIC';
    } else if (/^Button$/i.test(word)) {
      sku += '-BTN';
    } else if (/^SIM$/i.test(word)) {
      sku += '-SIM';
    } else if (/^Tray$/i.test(word)) {
      sku += '-TRY';
    } else if (/^Logic$/i.test(word)) {
      sku += '-LOG';
    } else if (/^Board$/i.test(word)) {
      sku += '-BRD';
    } else if (/^Flex$/i.test(word)) {
      sku += '-FLX';
    } else if (/^Sensor$/i.test(word)) {
      sku += '-SNS';
    } else if (/^Charging$/i.test(word)) {
      sku += '-CHG';
    } else if (/^Port$/i.test(word)) {
      sku += '-PRT';
    } else if (/^Frame$/i.test(word)) {
      sku += '-FRM';
    } else if (/^Lens$/i.test(word)) {
      sku += '-LNS';
    } else if (/^Home$/i.test(word)) {
      sku += '-HME';
    } else if (/^Volume$/i.test(word)) {
      sku += '-VOL';
    } else if (/^Power$/i.test(word)) {
      sku += '-PWR';
    } else if (/^Fingerprint$/i.test(word)) {
      sku += '-FPR';
    } else if (/^Face$/i.test(word)) {
      sku += '-FAC';
    } else if (/^ID$/i.test(word)) {
      sku += '-ID';
    } else if (/^A?\d{2,3}$/i.test(word)) {
      sku += word.toUpperCase();
    } else if (/^\d{2,3}$/i.test(word)) {
      sku += word;
    }
  }
  return sku.replace(/--+/g, '-').replace(/^-/, '').replace(/-$/, '');
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const fromNow = (date: Date | string) => {
  const now = new Date();
  const pastDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
}
export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}
export const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat('en-US', options).format(number);
}
