import { DeviceTypeNavbar } from '@/components/device-type-navbar';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Device Type Navbar Demo',
  description: 'Demo of the horizontal device type navbar with hover effects',
  path: '/device-navbar-demo'
});

export default function DeviceNavbarDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Device Type Navbar Demo</h1>
          <p className="mt-2 text-lg text-gray-600">
            Hover over each device type to see their available parts
          </p>
        </div>
      </div>

      {/* Device Type Navbar */}
      <DeviceTypeNavbar />

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Hover Effects</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Hover over device types to see parts preview</li>
                <li>• Smooth animations and transitions</li>
                <li>• Loading states for better UX</li>
                <li>• Responsive design for all screen sizes</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Data Loading</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Lazy loading of parts data</li>
                <li>• Caching for better performance</li>
                <li>• Fallback for missing images</li>
                <li>• Direct links to parts and categories</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Use</h3>
            <p className="text-blue-800">
              Simply hover over any device type in the navbar above to see a preview of available parts. 
              Click on any part to view details, or click "View All" to see the complete category.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
