"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/ui/file-upload";
import { 
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  Search,
  AlertTriangle,
  DollarSign,
  Loader2,
  Box,
  Tag,
  Smartphone,
  Cable,
  Headphones,
  Shield,
  Zap,
  Monitor
} from "lucide-react";
import { Accessory, AccessoryCategory } from "@/lib/types";
import { 
  getAccessories, 
  createAccessory, 
  updateAccessory, 
  deleteAccessory, 
  updateAccessoryStock, 
  getLowStockAccessories 
} from "@/app/actions/accessory-actions";

interface AccessoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons: Record<AccessoryCategory, React.ComponentType<any>> = {
  CASE: Shield,
  CHARGER: Zap,
  CABLE: Cable,
  HEADPHONES: Headphones,
  SCREEN_PROTECTOR: Shield,
  KEYBOARD: Monitor,
  MOUSE: Monitor,
  STYLUS: Edit,
  STAND: Monitor,
  MOUNT: Monitor,
  OTHER: Box,
};

const categoryLabels: Record<AccessoryCategory, string> = {
  CASE: 'Cases & Covers',
  CHARGER: 'Chargers & Power',
  CABLE: 'Cables & Adapters',
  HEADPHONES: 'Audio & Headphones',
  SCREEN_PROTECTOR: 'Screen Protection',
  KEYBOARD: 'Keyboards',
  MOUSE: 'Mice & Trackpads',
  STYLUS: 'Stylus & Pens',
  STAND: 'Stands & Holders',
  MOUNT: 'Mounts & Brackets',
  OTHER: 'Other Accessories',
};

export function AccessoryModal({ isOpen, onClose }: AccessoryModalProps) {
  const [activeTab, setActiveTab] = useState('accessories');
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [lowStockAccessories, setLowStockAccessories] = useState<Accessory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  
  // Loading states for CRUD operations
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  // Helper functions for loading states
  const setOperationLoading = (key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  };

  const isOperationLoading = (key: string) => loadingStates[key] || false;
  
  const [newAccessory, setNewAccessory] = useState<{
    name: string;
    category: AccessoryCategory | '';
    brand: string;
    model: string;
    price: number;
    inStock: number;
    minStock: number;
    description: string;
    compatibility: string;
    imageUrl: string;
  }>({
    name: '',
    category: '',
    brand: '',
    model: '',
    price: 0,
    inStock: 0,
    minStock: 5,
    description: '',
    compatibility: '',
    imageUrl: ''
  });

  // Load data
  useEffect(() => {
    if (isOpen) {
      loadAccessories();
      loadLowStockAccessories();
    }
  }, [isOpen]);

  const loadAccessories = async () => {
    try {
      setLoading(true);
      const data = await getAccessories();
      setAccessories(data);
    } catch (error) {
      console.error('Failed to load accessories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLowStockAccessories = async () => {
    try {
      const data = await getLowStockAccessories();
      setLowStockAccessories(data);
    } catch (error) {
      console.error('Failed to load low stock accessories:', error);
    }
  };

  const handleCreateAccessory = async () => {
    if (!newAccessory.name || !newAccessory.category || !newAccessory.brand) {
      alert('Please fill in required fields');
      return;
    }

    try {
      setLoading(true);
      await createAccessory(newAccessory as any);
      await loadAccessories();
      await loadLowStockAccessories();
      
      // Reset form
      setNewAccessory({
        name: '',
        category: '' as AccessoryCategory | '',
        brand: '',
        model: '',
        price: 0,
        inStock: 0,
        minStock: 5,
        description: '',
        compatibility: '',
        imageUrl: ''
      });
      
      alert('Accessory created successfully!');
    } catch (error) {
      console.error('Failed to create accessory:', error);
      alert('Failed to create accessory');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccessory = async () => {
    if (!editingAccessory) return;

    try {
      setLoading(true);
      await updateAccessory(editingAccessory.id, editingAccessory);
      await loadAccessories();
      await loadLowStockAccessories();
      setEditingAccessory(null);
      alert('Accessory updated successfully!');
    } catch (error) {
      console.error('Failed to update accessory:', error);
      alert('Failed to update accessory');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccessory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this accessory?')) return;

    const operationKey = `delete-accessory-${id}`;
    try {
      setOperationLoading(operationKey, true);
      await deleteAccessory(id);
      await loadAccessories();
      await loadLowStockAccessories();
      alert('Accessory deleted successfully!');
    } catch (error) {
      console.error('Failed to delete accessory:', error);
      alert('Failed to delete accessory');
    } finally {
      setOperationLoading(operationKey, false);
    }
  };

  const handleStockUpdate = async (id: string, operation: 'add' | 'subtract', quantity: number) => {
    try {
      await updateAccessoryStock(id, quantity, operation);
      await loadAccessories();
      await loadLowStockAccessories();
    } catch (error) {
      console.error('Failed to update stock:', error);
      alert('Failed to update stock');
    }
  };

  const filteredAccessories = accessories.filter(accessory =>
    accessory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accessory.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accessory.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[95vw] h-[95vh] overflow-scroll flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Package className="h-6 w-6 mr-3" />
            Accessories Management
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
            <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
          </TabsList>

          {/* Accessories Tab */}
          <TabsContent value="accessories" className="flex-1 overflow-hidden">
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search accessories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Badge variant="outline">
                  {filteredAccessories.length} accessories
                </Badge>
              </div>

              <div className="flex-1 overflow-auto">
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {filteredAccessories.map((accessory) => {
                    const IconComponent = categoryIcons[accessory.category];
                    return (
                      <Card key={accessory.id}>
                        <CardHeader className="pb-3">
                          {/* Image Section */}
                          <div className="aspect-square w-full mb-3 bg-gray-100 rounded-lg overflow-hidden relative">
                            {accessory.imageUrl ? (
                              <Image 
                                src={accessory.imageUrl} 
                                alt={accessory.name}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <IconComponent className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <IconComponent className="h-5 w-5 text-blue-600" />
                              <div>
                                <CardTitle className="text-sm">{accessory.name}</CardTitle>
                                <CardDescription className="text-xs">
                                  {accessory.brand} {accessory.model && `• ${accessory.model}`}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {categoryLabels[accessory.category]}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-green-600">
                              ${accessory.price.toFixed(2)}
                            </span>
                            <Badge 
                              variant={accessory.inStock <= accessory.minStock ? "destructive" : "secondary"}
                            >
                              {accessory.inStock} in stock
                            </Badge>
                          </div>

                          {accessory.compatibility && (
                            <div className="text-xs text-gray-600">
                              <strong>Compatible:</strong> {accessory.compatibility}
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingAccessory(accessory)}
                              className="flex-1 bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteAccessory(accessory.id)}
                              disabled={isOperationLoading(`delete-accessory-${accessory.id}`)}
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isOperationLoading(`delete-accessory-${accessory.id}`) ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </Button>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStockUpdate(accessory.id, 'subtract', 1)}
                              disabled={accessory.inStock <= 0}
                            >
                              -
                            </Button>
                            <span className="text-sm px-2">{accessory.inStock}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStockUpdate(accessory.id, 'add', 1)}
                            >
                              +
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const quantity = prompt('Add stock quantity:');
                                if (quantity && !isNaN(Number(quantity))) {
                                  handleStockUpdate(accessory.id, 'add', Number(quantity));
                                }
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Add New Tab */}
          <TabsContent value="add" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="name">Accessory Name *</Label>
                  <Input
                    id="name"
                    value={newAccessory.name}
                    onChange={(e) => setNewAccessory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="iPhone 15 Pro Case"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={newAccessory.category} 
                    onValueChange={(value: AccessoryCategory) => setNewAccessory(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={newAccessory.brand}
                    onChange={(e) => setNewAccessory(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="Apple, Belkin, Anker, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={newAccessory.model}
                    onChange={(e) => setNewAccessory(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="Model or part number"
                  />
                </div>
              </div>

              {/* Middle Column - Pricing & Stock */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Pricing & Stock</h3>
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newAccessory.price}
                    onChange={(e) => setNewAccessory(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="29.99"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inStock">In Stock</Label>
                    <Input
                      id="inStock"
                      type="number"
                      value={newAccessory.inStock}
                      onChange={(e) => setNewAccessory(prev => ({ ...prev, inStock: Number(e.target.value) }))}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Min Stock</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={newAccessory.minStock}
                      onChange={(e) => setNewAccessory(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compatibility">Compatibility</Label>
                  <Input
                    id="compatibility"
                    value={newAccessory.compatibility}
                    onChange={(e) => setNewAccessory(prev => ({ ...prev, compatibility: e.target.value }))}
                    placeholder="iPhone 15 series, iPad Pro, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newAccessory.description}
                    onChange={(e) => setNewAccessory(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of the accessory..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Product Image</h3>
                
                <FileUpload
                  accept="image/*"
                  maxSize={10}
                  multiple={false}
                  label="Upload Product Image"
                  description="PNG, JPG up to 10MB. Single image only."
                  onUploadComplete={(fileUrl, key) => {
                    setNewAccessory(prev => ({
                      ...prev,
                      imageUrl: fileUrl
                    }));
                  }}
                  onUploadError={(error) => {
                    console.error('Upload error:', error);
                    alert(`Upload failed: ${error}`);
                  }}
                />
                
                {/* Image Preview */}
                {newAccessory.imageUrl && (
                  <div className="space-y-2">
                    <Label>Uploaded Image</Label>
                    <div className="relative group max-w-48">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 relative">
                        <Image 
                          src={newAccessory.imageUrl} 
                          alt="Product image"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 200px"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                        onClick={() => {
                          setNewAccessory(prev => ({
                            ...prev,
                            imageUrl: ''
                          }));
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleCreateAccessory} disabled={loading} className="w-full h-12 text-lg">
                <Plus className="h-5 w-5 mr-2" />
                {loading ? 'Creating Accessory...' : 'Create Accessory'}
              </Button>
            </div>
          </TabsContent>

          {/* Stock Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Low Stock Accessories</h3>
              <Badge variant="destructive">{lowStockAccessories.length}</Badge>
            </div>

            <div className="space-y-3">
              {lowStockAccessories.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">All accessories are well stocked!</p>
                  </CardContent>
                </Card>
              ) : (
                lowStockAccessories.map((accessory) => (
                  <Card key={accessory.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{accessory.name}</h4>
                          <p className="text-sm text-gray-600">
                            {accessory.brand} • {categoryLabels[accessory.category]}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive">
                            {accessory.inStock} left
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">
                            Min: {accessory.minStock}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Modal */}
        {editingAccessory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h3 className="text-lg font-semibold mb-6">Edit Accessory</h3>
              
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold mb-3">Basic Information</h4>
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Accessory Name *</Label>
                    <Input
                      id="edit-name"
                      value={editingAccessory.name}
                      onChange={(e) => setEditingAccessory(prev => prev ? { ...prev, name: e.target.value } : null)}
                      placeholder="iPhone 15 Pro Case"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category *</Label>
                    <Select 
                      value={editingAccessory.category} 
                      onValueChange={(value: AccessoryCategory) => setEditingAccessory(prev => prev ? { ...prev, category: value } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-brand">Brand *</Label>
                    <Input
                      id="edit-brand"
                      value={editingAccessory.brand}
                      onChange={(e) => setEditingAccessory(prev => prev ? { ...prev, brand: e.target.value } : null)}
                      placeholder="Apple, Belkin, Anker, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-model">Model</Label>
                    <Input
                      id="edit-model"
                      value={editingAccessory.model || ''}
                      onChange={(e) => setEditingAccessory(prev => prev ? { ...prev, model: e.target.value } : null)}
                      placeholder="Model or part number"
                    />
                  </div>
                </div>

                {/* Middle Column - Pricing & Stock */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold mb-3">Pricing & Stock</h4>
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Price *</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      value={editingAccessory.price}
                      onChange={(e) => setEditingAccessory(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
                      placeholder="29.99"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-inStock">In Stock</Label>
                      <Input
                        id="edit-inStock"
                        type="number"
                        value={editingAccessory.inStock}
                        onChange={(e) => setEditingAccessory(prev => prev ? { ...prev, inStock: Number(e.target.value) } : null)}
                        placeholder="50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-minStock">Min Stock</Label>
                      <Input
                        id="edit-minStock"
                        type="number"
                        value={editingAccessory.minStock}
                        onChange={(e) => setEditingAccessory(prev => prev ? { ...prev, minStock: Number(e.target.value) } : null)}
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-compatibility">Compatibility</Label>
                    <Input
                      id="edit-compatibility"
                      value={editingAccessory.compatibility || ''}
                      onChange={(e) => setEditingAccessory(prev => prev ? { ...prev, compatibility: e.target.value } : null)}
                      placeholder="iPhone 15 series, iPad Pro, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editingAccessory.description || ''}
                      onChange={(e) => setEditingAccessory(prev => prev ? { ...prev, description: e.target.value } : null)}
                      placeholder="Detailed description of the accessory..."
                      rows={4}
                    />
                  </div>
                </div>

                {/* Right Column - Image Management */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold mb-3">Product Image</h4>
                  
                  <FileUpload
                    accept="image/*"
                    maxSize={10}
                    multiple={false}
                    label="Upload Product Image"
                    description="PNG, JPG up to 10MB. Single image only."
                    onUploadComplete={(fileUrl, key) => {
                      setEditingAccessory(prev => prev ? {
                        ...prev,
                        imageUrl: fileUrl
                      } : null);
                    }}
                    onUploadError={(error) => {
                      console.error('Upload error:', error);
                      alert(`Upload failed: ${error}`);
                    }}
                  />
                  
                  {/* Current Image Preview */}
                  {editingAccessory.imageUrl && (
                    <div className="space-y-2">
                      <Label>Current Image</Label>
                      <div className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 max-w-48 relative">
                          <Image 
                            src={editingAccessory.imageUrl} 
                            alt="Product image"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 200px"
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={() => {
                            setEditingAccessory(prev => prev ? {
                              ...prev,
                              imageUrl: undefined
                            } : null);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t mt-6">
                <div className="flex space-x-3">
                  <Button onClick={handleUpdateAccessory} disabled={loading} className="flex-1">
                    {loading ? 'Updating...' : 'Update Accessory'}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingAccessory(null)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
