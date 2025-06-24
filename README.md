# TechFix Pro - Device Repair & Accessories Platform

A comprehensive platform for managing a device repair shop with accessories sales. Built with Next.js 15, TypeScript, and shadcn/ui components.

## 🚀 Features

### **Customer-Facing Features**

#### **Homepage** (`/`)
- Professional hero section with clear value proposition
- Services overview (repairs & accessories)
- Why choose us section with key benefits
- Customer testimonials with ratings
- Call-to-action sections

#### **Repair Services** (`/repairs`)
- Comprehensive repair services information
- Device type support (smartphones, tablets, laptops, smartwatches)
- Common repair types with estimated timeframes
- Warranty and guarantee information
- Step-by-step repair process explanation

#### **Accessories Store** (`/accessories`)
- Category-based product browsing
- Featured products with ratings and reviews
- Device-specific accessory tabs
- Product search and filtering
- Shopping benefits (free shipping, guarantees, returns)

#### **Quote Request** (`/quote`)
- Multi-step quote form with device selection
- Visual device type picker
- Issue checkboxes and detailed descriptions
- Photo upload capability
- Service preferences and urgency levels
- Automatic quote generation

#### **Contact** (`/contact`)
- Multiple contact methods (phone, email, location)
- Interactive contact form with service selection
- Business hours and location details
- FAQ section with common questions
- Emergency repair service information

#### **About** (`/about`)
- Company story and timeline
- Team member profiles with specialties
- Achievements and statistics
- Company values and mission
- Professional certifications and training

### **Admin Dashboard** (`/admin`)

#### **Real-Time Analytics**
- ✅ Total revenue tracking
- ✅ Active repair count
- ✅ Customer metrics
- ✅ Inventory alerts
- ✅ Monthly performance data

#### **Repair Management**
- ✅ **Create new repair orders** with multi-step wizard
- ✅ **View and edit repair details** with comprehensive modal
- ✅ **Update repair status** (pending → in-progress → completed)
- ✅ **Add repair notes** for tracking progress
- ✅ **Search and filter repairs** by status, customer, device
- ✅ **Delete repair orders** with confirmation
- ✅ **Assign technicians** to repairs
- ✅ **Track parts usage** and costs

#### **Customer Management**
- ✅ **Add new customers** during repair creation
- ✅ **Customer database** with contact information
- ✅ **Repair history** tracking per customer
- ✅ **Search customers** by name, email, phone

#### **Inventory Management**
- ✅ **Real-time stock tracking** with visual indicators
- ✅ **Low stock alerts** with automatic notifications
- ✅ **Quick stock updates** with +/- buttons
- ✅ **Bulk stock additions** for restocking
- ✅ **Stock level visualization** with progress bars
- ✅ **Part cost tracking** and inventory valuation
- ✅ **Supplier management** information

#### **Interactive Features**
- ✅ **Modal-based workflows** for detailed operations
- ✅ **Real-time state management** with React Context
- ✅ **Responsive design** for mobile and desktop
- ✅ **Search and filtering** across all data
- ✅ **Status updates** with immediate UI feedback

## 🛠 Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Context + useReducer
- **Icons**: Lucide React
- **Development**: Turbopack for fast builds

## 📱 Admin Dashboard Functionality

### **Dashboard Overview**
```typescript
// Real-time statistics
- Total Revenue: $XX,XXX.XX
- Active Repairs: XX
- Total Customers: XXX
- Inventory Alerts: X items
```

### **Repair Order Management**
```typescript
// Create new repair order
const newRepair = {
  customer: Customer | NewCustomer,
  device: Device,
  issue: string,
  description: string,
  priority: 'low' | 'medium' | 'high' | 'emergency',
  estimatedCost: number,
  estimatedDays: number
}

// Update repair status
const statusFlow = [
  'pending' → 'diagnosed' → 'in-progress' → 'waiting-parts' → 'completed' → 'delivered'
]
```

### **Inventory System**
```typescript
// Part tracking
interface Part {
  name: string;
  sku: string;
  cost: number;
  inStock: number;
  minStock: number;
  supplier: string;
}

// Stock alerts
if (part.inStock <= part.minStock) {
  // Show low stock warning
  // Prevent repairs using unavailable parts
}
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Access the platform**:
   - Customer site: `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin`

## 🔧 Admin Dashboard Usage

### **Creating a New Repair Order**
1. Click "New Repair" button
2. **Step 1**: Select existing customer or create new
3. **Step 2**: Enter device information (type, brand, model)
4. **Step 3**: Describe the issue and set priority/cost
5. Click "Create Repair Order"

### **Managing Repairs**
- **View Details**: Click the eye icon to open repair modal
- **Update Status**: Use dropdown in repair modal
- **Add Notes**: Track progress with timestamped notes
- **Search**: Filter by repair ID, customer name, or device
- **Delete**: Remove repair orders with confirmation

### **Inventory Management**
- **View Stock**: Click "Manage Inventory" 
- **Update Stock**: Use +/- buttons or enter quantity directly
- **Low Stock Alerts**: Automatic notifications when stock is low
- **Add Stock**: Enter quantity and press "Add Stock"

### **Customer Management**
- Customers are automatically added during repair creation
- View customer history and contact information
- Track total repairs per customer

## 🎯 Business Benefits

### **For Shop Owners**
- ✅ Complete repair order management
- ✅ Customer relationship tracking
- ✅ Inventory optimization with alerts
- ✅ Revenue and performance analytics
- ✅ Professional customer-facing website

### **For Customers**
- ✅ Easy online quote requests
- ✅ Transparent pricing and processes
- ✅ Professional service information
- ✅ Multiple contact options
- ✅ Quality guarantees and warranties

### **For Technicians**
- ✅ Clear repair instructions and notes
- ✅ Parts availability checking
- ✅ Status tracking and updates
- ✅ Customer communication tools

## 📋 Data Models

The platform uses TypeScript interfaces for type safety:

```typescript
interface Repair {
  id: string;
  customer: Customer;
  device: Device;
  issue: string;
  description: string;
  status: RepairStatus;
  priority: Priority;
  cost: number;
  parts: Part[];
  notes: string[];
  assignedTechnician?: string;
}
```

## 🔮 Future Enhancements

- **Payment Processing**: Integration with Stripe/PayPal
- **Email Notifications**: Automated customer updates
- **SMS Notifications**: Repair status updates
- **Advanced Analytics**: Detailed reporting and insights
- **Multi-location Support**: Franchise management
- **API Integration**: Third-party parts suppliers
- **Mobile App**: React Native customer app
- **Appointment Scheduling**: Calendar integration

## 📞 Support

This platform provides a complete solution for device repair shops, combining professional customer experience with powerful admin tools for efficient business management.

The admin dashboard is fully functional with real-time updates, making it easy to manage repairs, customers, and inventory from a single interface.
