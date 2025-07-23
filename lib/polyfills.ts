// Global polyfill for build environment
// This prevents "self is not defined" errors during Next.js build

if (typeof global !== 'undefined' && typeof global.self === 'undefined') {
  (global as any).self = global;
}

export {};
