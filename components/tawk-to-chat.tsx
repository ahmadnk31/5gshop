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
          // Initialize Tawk.to API in isolated scope with error suppression
          window.Tawk_API = window.Tawk_API || {}
          window.Tawk_LoadStart = new Date()
          
          // Suppress Tawk.to console errors
          const originalError = console.error
          console.error = (...args) => {
            // Filter out Tawk.to i18next errors
            if (args[0]?.toString().includes('i18next') || 
                args[0]?.toString().includes('Tawk') ||
                args[0]?.toString().includes('parseVisitorName')) {
              return
            }
            originalError.apply(console, args)
          }

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
          
          // Restore console.error after Tawk loads
          script.onload = () => {
            setTimeout(() => {
              console.error = originalError
            }, 3000) // Give Tawk 3 seconds to initialize
          }
          
          // Append to head
          document.head.appendChild(script)
        } catch (error) {
          console.warn('Failed to initialize Tawk.to:', error)
        }
      }

      // OPTIMIZED: Load on user interaction or after 5 seconds (whichever comes first)
      const timer = setTimeout(initializeTawk, 5000) // Increased from 2s to 5s
      
      // Load immediately on scroll, mousemove, or touchstart
      const events = ['scroll', 'mousemove', 'touchstart', 'click'];
      const loadOnInteraction = () => {
        clearTimeout(timer);
        initializeTawk();
        // Remove listeners after first interaction
        events.forEach(event => {
          window.removeEventListener(event, loadOnInteraction);
        });
      };
      
      events.forEach(event => {
        window.addEventListener(event, loadOnInteraction, { once: true, passive: true });
      });
      
      return () => {
        clearTimeout(timer);
        events.forEach(event => {
          window.removeEventListener(event, loadOnInteraction);
        });
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
