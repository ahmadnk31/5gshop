"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Repair, Customer, Device, Priority, DeviceType, RepairStatus } from "@/lib/types";
import { useAdmin } from "@/lib/admin-context-server";
import { FileUpload } from "@/components/ui/file-upload";
import { Smartphone, Tablet, Laptop, Watch, Plus } from "lucide-react";

interface NewRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewRepairModal({ isOpen, onClose }: NewRepairModalProps) {
  const { state, actions } = useAdmin();
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [device, setDevice] = useState<Omit<Device, 'id' | 'createdAt' | 'updatedAt'>>({
    type: 'SMARTPHONE',
    brand: '',
    model: '',
    order: 0,
    serialNumber: '',
    purchaseDate: ''
  });
  const [repairDetails, setRepairDetails] = useState({
    issue: '',
    description: '',
    priority: 'MEDIUM' as Priority,
    estimatedCost: 0,
    estimatedDays: 2
  });
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string; key: string }>>([]);

  const generateId = () => {
    // Use crypto.randomUUID if available, fallback to timestamp-based ID
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };

  const handleSubmit = async () => {
    try {
      // Create or use existing customer
      let customer = selectedCustomer;
      if (!customer) {
        const customerData = {
          firstName: newCustomer.firstName,
          lastName: newCustomer.lastName,
          email: newCustomer.email,
          phone: newCustomer.phone,
          address: newCustomer.address || '',
        };
        customer = await actions.addCustomer(customerData);
      }

      // Calculate estimated completion date on the client side
      const estimatedCompletionDate = new Date();
      estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + repairDetails.estimatedDays);

      // For now, we'll create a device separately in the server action
      // The server action should handle creating the device if needed
      const repairData = {
        customerId: customer.id,
        deviceId: generateId(), // This will be handled by creating a device first in the server action
        issue: repairDetails.issue,
        description: repairDetails.description,
        status: 'PENDING' as RepairStatus,
        priority: repairDetails.priority,
        cost: repairDetails.estimatedCost,
        estimatedCompletion: estimatedCompletionDate.toISOString(),
        assignedTechnician: 'Auto-assigned',
        // Device data for creation
        deviceData: {
          type: device.type,
          brand: device.brand,
          model: device.model,
          serialNumber: device.serialNumber || '',
          purchaseDate: device.purchaseDate || null,
        },
        // File attachments
        attachments: uploadedFiles
      };

      await actions.createRepair(repairData);
      
      // Reset form
      setStep(1);
      setSelectedCustomer(null);
      setNewCustomer({ firstName: '', lastName: '', email: '', phone: '', address: '' });
      setDevice({ type: 'SMARTPHONE', brand: '', model: '', order: 0, serialNumber: '', purchaseDate: '' });
      setRepairDetails({ issue: '', description: '', priority: 'MEDIUM', estimatedCost: 0, estimatedDays: 2 });
      setUploadedFiles([]);
      
      onClose();
    } catch (error) {
      console.error('Failed to create repair:', error);
      // Handle error (show toast, etc.)
    }
  };

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'SMARTPHONE': return Smartphone;
      case 'TABLET': return Tablet;
      case 'LAPTOP': return Laptop;
      case 'SMARTWATCH': return Watch;
      default: return Smartphone;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[50vw] max-h-[95vh] overflow-y-auto p-8">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Repair Order</DialogTitle>
          <DialogDescription className="text-base">
            Step {step} of 3: {step === 1 ? 'Customer' : step === 2 ? 'Device' : 'Repair Details'}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Customer */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Select Existing Customer</Label>
              <Select onValueChange={(customerId) => {
                const customer = state.customers.find(c => c.id === customerId);
                setSelectedCustomer(customer || null);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose existing customer or create new" />
                </SelectTrigger>
                <SelectContent>
                  {state.customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName} - {customer.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!selectedCustomer && (
              <div className="space-y-4 border-t pt-4">
                <Label className="text-base font-semibold">Or Create New Customer</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={newCustomer.firstName}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newCustomer.lastName}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address (Optional)</Label>
                  <Input
                    id="address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                onClick={() => setStep(2)}
                disabled={!selectedCustomer && !newCustomer.firstName}
              >
                Next: Device Info
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Device */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Device Type</Label>
              <RadioGroup 
                value={device.type} 
                onValueChange={(value: DeviceType) => setDevice(prev => ({ ...prev, type: value }))}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2"
              >
                {(['SMARTPHONE', 'TABLET', 'LAPTOP', 'SMARTWATCH'] as DeviceType[]).map((type) => {
                  const Icon = getDeviceIcon(type);
                  return (
                    <div key={type} className="flex items-center space-x-2 border rounded-lg p-4">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type} className="flex flex-col items-center cursor-pointer">
                        <Icon className="h-6 w-6 mb-2" />
                        <span className="capitalize">{type}</span>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={device.brand}
                  onChange={(e) => setDevice(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="e.g., Apple, Samsung"
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={device.model}
                  onChange={(e) => setDevice(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="e.g., iPhone 14 Pro"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serialNumber">Serial Number (Optional)</Label>
                <Input
                  id="serialNumber"
                  value={device.serialNumber}
                  onChange={(e) => setDevice(prev => ({ ...prev, serialNumber: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="purchaseDate">Purchase Date (Optional)</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={device.purchaseDate || ''}
                  onChange={(e) => setDevice(prev => ({ ...prev, purchaseDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back: Customer
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={!device.brand || !device.model}
              >
                Next: Repair Details
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Repair Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="issue">Issue/Problem</Label>
              <Input
                id="issue"
                value={repairDetails.issue}
                onChange={(e) => setRepairDetails(prev => ({ ...prev, issue: e.target.value }))}
                placeholder="e.g., Screen Replacement, Battery Issues"
              />
            </div>

            <div>
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                value={repairDetails.description}
                onChange={(e) => setRepairDetails(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the problem in detail..."
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={repairDetails.priority} 
                  onValueChange={(value: Priority) => setRepairDetails(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
                <Input
                  id="estimatedCost"
                  type="number"
                  value={repairDetails.estimatedCost}
                  onChange={(e) => setRepairDetails(prev => ({ ...prev, estimatedCost: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="estimatedDays">Estimated Days</Label>
                <Input
                  id="estimatedDays"
                  type="number"
                  value={repairDetails.estimatedDays}
                  onChange={(e) => setRepairDetails(prev => ({ ...prev, estimatedDays: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back: Device Info
              </Button>
              <Button 
                onClick={() => setStep(4)}
                disabled={!repairDetails.issue || !repairDetails.description}
              >
                Next: Attachments
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: File Upload */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Device Photos & Documents</Label>
              <p className="text-sm text-gray-600 mt-1">
                Upload photos of the device damage or any relevant documents (optional)
              </p>
            </div>

            <FileUpload
              onUploadComplete={(fileUrl, key) => {
                setUploadedFiles(prev => [...prev, { url: fileUrl, key }]);
              }}
              onUploadError={(error) => {
                console.error('Upload error:', error);
                // Handle error (show toast, etc.)
              }}
              accept="image/*,.pdf,.doc,.docx"
              maxSize={10}
              multiple={true}
            />

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Uploaded Files:</Label>
                <div className="grid gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm truncate">{file.key}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back: Repair Details
              </Button>
              <Button 
                onClick={handleSubmit}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Repair Order
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
