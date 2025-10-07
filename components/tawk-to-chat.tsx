'use client'

import { useEffect } from 'react'

export function TawkToChat() {
  useEffect(() => {
    // Only load Tawk.to on the client side after hydration
    if (typeof window !== 'undefined') {
      // Check if Tawk is already loaded
      if (window.Tawk_API && typeof window.Tawk_API === 'object') {
        return
      }

      // Delay initialization to avoid conflicts with other libraries
      const initializeTawk = () => {
        try {
          // Initialize Tawk.to API in isolated scope
          window.Tawk_API = window.Tawk_API || {}
          window.Tawk_LoadStart = new Date()

          // Create and inject the script
          const script = document.createElement('script')
          script.async = true
          script.src = 'https://embed.tawk.to/68e57f8dc72178194fdaf4a1/1j707kgfi'
          script.charset = 'UTF-8'
          script.setAttribute('crossorigin', '*')
          
          // Add error handling
          script.onerror = (error) => {
            console.warn('Tawk.to script failed to load:', error)
          }
          
          // Append to head
          document.head.appendChild(script)
        } catch (error) {
          console.warn('Failed to initialize Tawk.to:', error)
        }
      }

      // Wait for page to be fully loaded and other scripts to initialize
      const timer = setTimeout(initializeTawk, 2000)
      
      return () => {
        clearTimeout(timer)
      }
    }
  }, [])

  // Return null since this component doesn't render any UI
  return null
}

// Extend the Window interface to include Tawk.to properties
declare global {
  interface Window {
    Tawk_API?: any
    Tawk_LoadStart?: Date
  }
}
