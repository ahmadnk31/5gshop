'use client'

import { useEffect } from 'react'

export function TawkToChat() {
  useEffect(() => {
    // Only load Tawk.to on the client side after hydration
    if (typeof window !== 'undefined') {
      // Initialize Tawk.to API
      window.Tawk_API = window.Tawk_API || {}
      window.Tawk_LoadStart = new Date()

      // Create and inject the script
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://embed.tawk.to/68e57f8dc72178194fdaf4a1/1j707kgfi'
      script.charset = 'UTF-8'
      script.setAttribute('crossorigin', '*')
      
      // Append to head
      document.head.appendChild(script)
    }
  }, [])

  // Return null since this component doesn't render any UI
  return null
}

// Extend the Window interface to include Tawk.to properties
declare global {
  interface Window {
    Tawk_API: any
    Tawk_LoadStart: Date
  }
}
