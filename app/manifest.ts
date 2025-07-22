import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '5gphones Leuven - Device Repair & Accessories',
    short_name: '5gphones',
    description: 'Professional device repair services and premium accessories for all your devices in Leuven, Belgium',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait',
    scope: '/',
    lang: 'en',
    categories: ['shopping', 'business', 'utilities'],
    screenshots: [
      {
        src: '/screenshots/wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Homepage of 5gphones showing repair services and accessories'
      },
      {
        src: '/screenshots/narrow.png', 
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Mobile view of device catalog and repair services'
      }
    ],
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png'
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    shortcuts: [
      {
        name: 'Accessories',
        short_name: 'Accessories',
        description: 'Browse phone and device accessories',
        url: '/accessories',
        icons: [{ src: '/icons/accessories-96x96.png', sizes: '96x96' }]
      },
      {
        name: 'Repairs',
        short_name: 'Repairs',
        description: 'Device repair services',
        url: '/repairs',
        icons: [{ src: '/icons/repairs-96x96.png', sizes: '96x96' }]
      },
      {
        name: 'Parts',
        short_name: 'Parts',
        description: 'Replacement parts for devices',
        url: '/parts',
        icons: [{ src: '/icons/parts-96x96.png', sizes: '96x96' }]
      },
      {
        name: 'Contact',
        short_name: 'Contact',
        description: 'Get in touch with us',
        url: '/contact',
        icons: [{ src: '/icons/contact-96x96.png', sizes: '96x96' }]
      }
    ]
  }
}
