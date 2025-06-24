// Test script to verify quote auto-population
console.log("Testing quote auto-population...");

// Test URL parameters
const testParams = new URLSearchParams({
  service: "Screen Replacement",
  deviceType: "SMARTPHONE"
});

console.log("Test URL:", `/quote?${testParams.toString()}`);

// Test manual navigation
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search);
  console.log("Current URL params:", {
    service: params.get('service'),
    deviceType: params.get('deviceType'),
    brand: params.get('brand'),
    model: params.get('model'),
    part: params.get('part')
  });
}
