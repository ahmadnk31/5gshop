"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@/lib/admin-context-server";
import { Part, Accessory } from "@/lib/types";
import { Package, Plus, Minus, AlertTriangle, CheckCircle, Wrench, ShoppingBag, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import { getAccessories, updateAccessoryStock, getLowStockAccessories } from "@/app/actions/accessory-actions";

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InventoryModal({ isOpen, onClose }: InventoryModalProps) {
  const { state, actions } = useAdmin();
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [stockUpdate, setStockUpdate] = useState(0);
  const [activeTab, setActiveTab] = useState('parts');
  // Device part filter state - simplified to use actual Part fields
  const [filterDeviceType, setFilterDeviceType] = useState<string>('');
  const [filterModel, setFilterModel] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [tempOrderValue, setTempOrderValue] = useState<number>(0);
  
  // Memoized unique device types from parts
  const deviceTypes = useMemo(() => {
    const types = new Set<string>();
    state.parts.forEach((p: Part) => { 
      if (p.deviceType) types.add(p.deviceType); 
    });
    return Array.from(types).sort();
  }, [state.parts]);

  // Memoized models based on selected device type
  const models = useMemo(() => {
    const models = new Set<string>();
    state.parts.forEach((p: Part) => {
      if (
        (!filterDeviceType || p.deviceType === filterDeviceType) &&
        p.deviceModel
      ) {
        models.add(p.deviceModel);
      }
    });
    return Array.from(models).sort();
  }, [state.parts, filterDeviceType]);

  // Filtered parts based on actual Part fields
  const filteredParts = useMemo(() => {
    return state.parts.filter((p: Part) => {
      // Device type filter
      const matchesType = !filterDeviceType || p.deviceType === filterDeviceType;
      
      // Model filter
      const matchesModel = !filterModel || p.deviceModel === filterModel;
      
      // Search term filter (searches name, SKU, description, supplier, deviceModel)
      const matchesSearch = !searchTerm || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.deviceModel && p.deviceModel.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesType && matchesModel && matchesSearch;
    }).sort((a, b) => a.order - b.order); // Sort by order field
  }, [state.parts, filterDeviceType, filterModel, searchTerm]);
  
  // Accessories state
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [lowStockAccessories, setLowStockAccessories] = useState<Accessory[]>([]);
  const [accessoriesLoading, setAccessoriesLoading] = useState(false);

  // Load accessories data when modal opens
  useEffect(() => {
    if (isOpen) {
      loadAccessoriesData();
    }
  }, [isOpen]);

  const loadAccessoriesData = async () => {
    try {
      setAccessoriesLoading(true);
      const [allAccessories, lowStock] = await Promise.all([
        getAccessories(),
        getLowStockAccessories()
      ]);
      setAccessories(allAccessories);
      setLowStockAccessories(lowStock);
    } catch (error) {
      console.error('Failed to load accessories:', error);
    } finally {
      setAccessoriesLoading(false);
    }
  };

  // Debounce map for stock updates
  const stockDebounceRef = useRef<{ [partId: string]: NodeJS.Timeout }>({});

  // Debounced stock update function
  const debouncedUpdateStock = (partId: string, newQuantity: number, operation: 'add' | 'subtract' | 'set' = 'set') => {
    if (stockDebounceRef.current[partId]) {
      clearTimeout(stockDebounceRef.current[partId]);
    }
    stockDebounceRef.current[partId] = setTimeout(() => {
      handleUpdateStock(partId, newQuantity, operation);
      delete stockDebounceRef.current[partId];
    }, 400);
  };

  const handleUpdateStock = async (partId: string, newQuantity: number, operation: 'add' | 'subtract' | 'set' = 'set') => {
    if (operation === 'set' && newQuantity >= 0) {
      try {
        await actions.updatePartStock(partId, newQuantity, operation);
      } catch (error) {
        console.error('Failed to update stock:', error);
      }
    } else if (operation === 'add' || operation === 'subtract') {
      try {
        await actions.updatePartStock(partId, Math.abs(newQuantity), operation);
      } catch (error) {
        console.error('Failed to update stock:', error);
      }
    }
  };

  // Replace handleQuickUpdate to use debounce
  const handleQuickUpdate = (part: Part, change: number) => {
    if (change > 0) {
      debouncedUpdateStock(part.id, change, 'add');
    } else if (change < 0) {
      debouncedUpdateStock(part.id, Math.abs(change), 'subtract');
    }
  };

  const handleUpdateAccessoryStock = async (accessoryId: string, newQuantity: number, operation: 'add' | 'subtract' | 'set' = 'set') => {
    try {
      await updateAccessoryStock(accessoryId, newQuantity, operation);
      await loadAccessoriesData(); // Reload accessories data
    } catch (error) {
      console.error('Failed to update accessory stock:', error);
    }
  };

  const handleQuickUpdateAccessory = (accessory: Accessory, change: number) => {
    if (change > 0) {
      handleUpdateAccessoryStock(accessory.id, change, 'add');
    } else if (change < 0) {
      handleUpdateAccessoryStock(accessory.id, Math.abs(change), 'subtract');
    }
  };

  // Order management functions
  const handleUpdateOrder = async (partId: string, newOrder: number) => {
    try {
      await actions.updatePart(partId, { order: newOrder });
    } catch (error) {
      console.error('Failed to update part order:', error);
    }
  };

  const handleMoveUp = async (part: Part, index: number) => {
    if (index === 0) return; // Already at top
    const prevPart = filteredParts[index - 1];
    // Swap orders
    await handleUpdateOrder(part.id, prevPart.order);
    await handleUpdateOrder(prevPart.id, part.order);
  };

  const handleMoveDown = async (part: Part, index: number) => {
    if (index === filteredParts.length - 1) return; // Already at bottom
    const nextPart = filteredParts[index + 1];
    // Swap orders
    await handleUpdateOrder(part.id, nextPart.order);
    await handleUpdateOrder(nextPart.id, part.order);
  };

  const startEditingOrder = (part: Part) => {
    setEditingOrderId(part.id);
    setTempOrderValue(part.order);
  };

  const saveOrderEdit = async (partId: string) => {
    await handleUpdateOrder(partId, tempOrderValue);
    setEditingOrderId(null);
  };

  const cancelOrderEdit = () => {
    setEditingOrderId(null);
    setTempOrderValue(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-[55vw] max-h-[95vh] overflow-y-auto p-4 sm:p-6 lg:p-8">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg sm:text-xl">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
            <span className="truncate">Unified Inventory Management</span>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Monitor and update both parts and accessories inventory levels
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="parts" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="parts" className="flex items-center text-xs sm:text-sm">
              <Wrench className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Repair Parts ({state.parts.length})</span>
              <span className="sm:hidden">Parts ({state.parts.length})</span>
            </TabsTrigger>
            <TabsTrigger value="accessories" className="flex items-center text-xs sm:text-sm">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Accessories ({accessories.length})
            </TabsTrigger>
          </TabsList>

          {/* Parts Tab */}
          <TabsContent value="parts" className="space-y-6">
            {/* Device Part Filters */}
            <div className="flex flex-wrap gap-4 items-end mb-2">
              <div>
                <label className="block text-xs font-medium mb-1">Search</label>
                <Input
                  type="text"
                  placeholder="Search parts..."
                  className="min-w-[200px]"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Device Type</label>
                <select
                  className="border rounded px-2 py-1 min-w-[120px]"
                  value={filterDeviceType}
                  onChange={e => {
                    setFilterDeviceType(e.target.value);
                    setFilterModel('');
                  }}
                >
                  <option value="">All</option>
                  {deviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Model</label>
                <select
                  className="border rounded px-2 py-1 min-w-[120px]"
                  value={filterModel}
                  onChange={e => setFilterModel(e.target.value)}
                  disabled={!filterDeviceType && models.length > 50}
                  title={!filterDeviceType && models.length > 50 ? "Select a device type first" : ""}
                >
                  <option value="">All</option>
                  {models.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
              {(searchTerm || filterDeviceType || filterModel) && (
                <button
                  type="button"
                  className="ml-2 px-2 py-1 border rounded text-xs bg-gray-100 hover:bg-gray-200"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterDeviceType('');
                    setFilterModel('');
                  }}
                >
                  Clear Filters
                </button>
              )}
              <div className="ml-auto text-sm text-gray-600">
                Showing {filteredParts.length} of {state.parts.length} parts
              </div>
            </div>
            {/* Summary Cards for Parts */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Parts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{state.parts.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Low Stock Parts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {state.parts.filter((p: Part) => p.inStock <= p.minStock).length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Parts Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${state.parts.reduce((sum: number, part: Part) => sum + (part.cost * part.inStock), 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Parts List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Repair Parts Inventory</h3>
            <div className="space-y-3">
              {filteredParts.map((part: Part, index: number) => (
                  <Card key={part.id} className={`${part.inStock <= part.minStock ? 'border-orange-200 bg-orange-50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        {/* Order Controls */}
                        <div className="flex flex-col items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveUp(part, index)}
                            disabled={index === 0}
                            className="h-6 w-6 p-0"
                            title="Move up"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          {editingOrderId === part.id ? (
                            <div className="flex flex-col items-center gap-1">
                              <Input
                                type="number"
                                value={tempOrderValue}
                                onChange={(e) => setTempOrderValue(parseInt(e.target.value) || 0)}
                                className="w-12 h-6 text-xs text-center p-1"
                                min="0"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveOrderEdit(part.id);
                                  if (e.key === 'Escape') cancelOrderEdit();
                                }}
                              />
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => saveOrderEdit(part.id)}
                                  className="h-4 w-4 p-0 text-green-600"
                                  title="Save"
                                >
                                  ✓
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={cancelOrderEdit}
                                  className="h-4 w-4 p-0 text-red-600"
                                  title="Cancel"
                                >
                                  ✕
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditingOrder(part)}
                              className="text-xs text-gray-600 hover:text-blue-600 font-mono cursor-pointer min-w-[2rem] text-center"
                              title="Click to edit order"
                            >
                              #{part.order}
                            </button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveDown(part, index)}
                            disabled={index === filteredParts.length - 1}
                            className="h-6 w-6 p-0"
                            title="Move down"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold">{part.name}</h4>
                            {part.inStock <= part.minStock && (
                              <Badge variant="destructive" className="flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Low Stock
                              </Badge>
                            )}
                            {part.inStock > part.minStock * 2 && (
                              <Badge variant="secondary" className="flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Well Stocked
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">SKU:</span> {part.sku}
                            </div>
                            <div>
                              <span className="font-medium">Cost:</span> ${part.cost}
                            </div>
                            <div>
                              <span className="font-medium">Supplier:</span> {part.supplier}
                            </div>
                            <div>
                              <span className="font-medium">Min Stock:</span> {part.minStock}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {/* Current Stock */}
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Current Stock</div>
                            <div className="text-2xl font-bold">{part.inStock}</div>
                          </div>

                          {/* Quick Update Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuickUpdate(part, -1)}
                              disabled={part.inStock <= 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            
                            <Input
                              type="number"
                              value={part.inStock}
                              onChange={(e) => debouncedUpdateStock(part.id, parseInt(e.target.value) || 0, 'set')}
                              className="w-20 text-center"
                              min="0"
                            />
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuickUpdate(part, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Bulk Update */}
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              placeholder="Add qty"
                              className="w-24"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const input = e.target as HTMLInputElement;
                                  const addQuantity = parseInt(input.value) || 0;
                                  if (addQuantity > 0) {
                                    handleUpdateStock(part.id, addQuantity, 'add');
                                    input.value = '';
                                  }
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => {
                                const input = document.querySelector(`[placeholder="Add qty"]`) as HTMLInputElement;
                                if (input) {
                                  const addQuantity = parseInt(input.value) || 0;
                                  if (addQuantity > 0) {
                                    handleUpdateStock(part.id, addQuantity, 'add');
                                    input.value = '';
                                  }
                                }
                              }}
                            >
                              Add Stock
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Stock Level Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Stock Level</span>
                          <span>{part.inStock} / {part.minStock * 3} (ideal)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              part.inStock <= part.minStock 
                                ? 'bg-red-500' 
                                : part.inStock <= part.minStock * 2 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                            }`}
                            style={{
                              width: `${Math.min((part.inStock / (part.minStock * 3)) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Accessories Tab */}
          <TabsContent value="accessories" className="space-y-6">
            {/* Summary Cards for Accessories */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Accessories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{accessories.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Low Stock Accessories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {lowStockAccessories.length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Accessories Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${accessories.reduce((sum: number, accessory: Accessory) => sum + (accessory.price * accessory.inStock), 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Accessories List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Accessories Inventory</h3>
              {accessoriesLoading ? (
                <div className="text-center py-8">Loading accessories...</div>
              ) : (
                <div className="space-y-3">
                  {accessories.map((accessory: Accessory) => (
                    <Card key={accessory.id} className={`${accessory.inStock <= accessory.minStock ? 'border-orange-200 bg-orange-50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold">{accessory.name}</h4>
                              {accessory.inStock <= accessory.minStock && (
                                <Badge variant="destructive" className="flex items-center">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Low Stock
                                </Badge>
                              )}
                              {accessory.inStock > accessory.minStock * 2 && (
                                <Badge variant="secondary" className="flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Well Stocked
                                </Badge>
                              )}
                            </div>
                            
                            <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Category:</span> {accessory.category}
                              </div>
                              <div>
                                <span className="font-medium">Price:</span> ${accessory.price}
                              </div>
                              <div>
                                <span className="font-medium">Brand:</span> {accessory.brand}
                              </div>
                              <div>
                                <span className="font-medium">Min Stock:</span> {accessory.minStock}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            {/* Current Stock */}
                            <div className="text-center">
                              <div className="text-sm text-gray-500">Current Stock</div>
                              <div className="text-2xl font-bold">{accessory.inStock}</div>
                            </div>

                            {/* Quick Update Controls */}
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuickUpdateAccessory(accessory, -1)}
                                disabled={accessory.inStock <= 0}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              
                              <Input
                                type="number"
                                value={accessory.inStock}
                                onChange={(e) => handleUpdateAccessoryStock(accessory.id, parseInt(e.target.value) || 0, 'set')}
                                className="w-20 text-center"
                                min="0"
                              />
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuickUpdateAccessory(accessory, 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Bulk Update */}
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                placeholder="Add qty"
                                className="w-24"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    const input = e.target as HTMLInputElement;
                                    const addQuantity = parseInt(input.value) || 0;
                                    if (addQuantity > 0) {
                                      handleUpdateAccessoryStock(accessory.id, addQuantity, 'add');
                                      input.value = '';
                                    }
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={() => {
                                  const inputs = document.querySelectorAll(`input[placeholder="Add qty"]`);
                                  const input = Array.from(inputs).find(inp => 
                                    inp.closest('.space-y-3')?.querySelector(`[data-accessory-id="${accessory.id}"]`)
                                  ) as HTMLInputElement;
                                  if (input) {
                                    const addQuantity = parseInt(input.value) || 0;
                                    if (addQuantity > 0) {
                                      handleUpdateAccessoryStock(accessory.id, addQuantity, 'add');
                                      input.value = '';
                                    }
                                  }
                                }}
                              >
                                Add Stock
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Stock Level Bar */}
                        <div className="mt-3" data-accessory-id={accessory.id}>
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Stock Level</span>
                            <span>{accessory.inStock} / {accessory.minStock * 3} (ideal)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                accessory.inStock <= accessory.minStock 
                                  ? 'bg-red-500' 
                                  : accessory.inStock <= accessory.minStock * 2 
                                  ? 'bg-yellow-500' 
                                  : 'bg-green-500'
                              }`}
                              style={{
                                width: `${Math.min((accessory.inStock / (accessory.minStock * 3)) * 100, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline">
            Export Inventory Report
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
