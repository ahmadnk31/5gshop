"use client";

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@/lib/admin-context-server";
import { Part, Accessory } from "@/lib/types";
import { Package, Plus, Minus, AlertTriangle, CheckCircle, Wrench, ShoppingBag } from "lucide-react";
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
  // Device part filter state
  const [filterDeviceType, setFilterDeviceType] = useState<string>('');
  const [filterBrand, setFilterBrand] = useState<string>('');
  const [filterModel, setFilterModel] = useState<string>('');
  // Memoized unique device types, brands, and models from parts
  const deviceTypes = useMemo(() => {
    const types = new Set<string>();
    state.parts.forEach((p: Part) => { if (p.deviceType) types.add(p.deviceType); });
    return Array.from(types).sort();
  }, [state.parts]);

  // Brand is not a top-level field on Part, but often encoded in deviceModel or description. Try to extract from deviceModel or description if possible.
  const brands = useMemo(() => {
    const brands = new Set<string>();
    state.parts.forEach((p: Part) => {
      // Try to extract brand from deviceModel (e.g., "iPhone 14" => "Apple") or from description
      if (p.deviceModel) {
        // Heuristic: if deviceModel contains a brand prefix, extract it
        const match = p.deviceModel.match(/^(Apple|Samsung|Huawei|Xiaomi|OnePlus|Sony|Google|Nokia|Motorola|LG|HTC|Asus|Acer|Lenovo|Microsoft|Honor|Realme|Oppo|Vivo|Nothing|Fairphone|Alcatel|BlackBerry|Meizu|ZTE|TCL|Panasonic|Sharp|Philips|Amazon|Other)[\s-]/i);
        if (match) brands.add(match[1]);
      }
      // Fallback: look for brand in description
      if (p.description) {
        const match = p.description.match(/^(Apple|Samsung|Huawei|Xiaomi|OnePlus|Sony|Google|Nokia|Motorola|LG|HTC|Asus|Acer|Lenovo|Microsoft|Honor|Realme|Oppo|Vivo|Nothing|Fairphone|Alcatel|BlackBerry|Meizu|ZTE|TCL|Panasonic|Sharp|Philips|Amazon|Other)[\s-]/i);
        if (match) brands.add(match[1]);
      }
    });
    return Array.from(brands).sort();
  }, [state.parts]);

  const models = useMemo(() => {
    const models = new Set<string>();
    state.parts.forEach((p: Part) => {
      // Only show models for selected brand/deviceType
      let matchesBrand = true;
      if (filterBrand) {
        // Try to extract brand from deviceModel
        if (p.deviceModel) {
          const match = p.deviceModel.match(/^(Apple|Samsung|Huawei|Xiaomi|OnePlus|Sony|Google|Nokia|Motorola|LG|HTC|Asus|Acer|Lenovo|Microsoft|Honor|Realme|Oppo|Vivo|Nothing|Fairphone|Alcatel|BlackBerry|Meizu|ZTE|TCL|Panasonic|Sharp|Philips|Amazon|Other)[\s-]/i);
          matchesBrand = !!(match && match[1] === filterBrand);
        } else {
          matchesBrand = false;
        }
      }
      if (
        (!filterDeviceType || p.deviceType === filterDeviceType) &&
        matchesBrand &&
        p.deviceModel
      ) {
        models.add(p.deviceModel);
      }
    });
    return Array.from(models).sort();
  }, [state.parts, filterDeviceType, filterBrand]);

  // Filtered parts
  const filteredParts = useMemo(() => {
    return state.parts.filter((p: Part) => {
      // Brand filter: extract brand from deviceModel or description
      let matchesBrand = true;
      if (filterBrand) {
        if (p.deviceModel) {
          const match = p.deviceModel.match(/^(Apple|Samsung|Huawei|Xiaomi|OnePlus|Sony|Google|Nokia|Motorola|LG|HTC|Asus|Acer|Lenovo|Microsoft|Honor|Realme|Oppo|Vivo|Nothing|Fairphone|Alcatel|BlackBerry|Meizu|ZTE|TCL|Panasonic|Sharp|Philips|Amazon|Other)[\s-]/i);
          matchesBrand = !!(match && match[1] === filterBrand);
        } else if (p.description) {
          const match = p.description.match(/^(Apple|Samsung|Huawei|Xiaomi|OnePlus|Sony|Google|Nokia|Motorola|LG|HTC|Asus|Acer|Lenovo|Microsoft|Honor|Realme|Oppo|Vivo|Nothing|Fairphone|Alcatel|BlackBerry|Meizu|ZTE|TCL|Panasonic|Sharp|Philips|Amazon|Other)[\s-]/i);
          matchesBrand = !!(match && match[1] === filterBrand);
        } else {
          matchesBrand = false;
        }
      }
      return (
        (!filterDeviceType || p.deviceType === filterDeviceType) &&
        matchesBrand &&
        (!filterModel || p.deviceModel === filterModel)
      );
    });
  }, [state.parts, filterDeviceType, filterBrand, filterModel]);
  
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

  const handleQuickUpdate = (part: Part, change: number) => {
    if (change > 0) {
      handleUpdateStock(part.id, change, 'add');
    } else if (change < 0) {
      handleUpdateStock(part.id, Math.abs(change), 'subtract');
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[55vw] max-h-[95vh] overflow-y-auto p-8">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Package className="h-6 w-6 mr-3" />
            Unified Inventory Management
          </DialogTitle>
          <DialogDescription className="text-base">
            Monitor and update both parts and accessories inventory levels
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="parts" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="parts" className="flex items-center">
              <Wrench className="h-4 w-4 mr-2" />
              Repair Parts ({state.parts.length})
            </TabsTrigger>
            <TabsTrigger value="accessories" className="flex items-center">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Accessories ({accessories.length})
            </TabsTrigger>
          </TabsList>

          {/* Parts Tab */}
          <TabsContent value="parts" className="space-y-6">
            {/* Device Part Filters */}
            <div className="flex flex-wrap gap-4 items-end mb-2">
              <div>
                <label className="block text-xs font-medium mb-1">Device Type</label>
                <select
                  className="border rounded px-2 py-1 min-w-[120px]"
                  value={filterDeviceType}
                  onChange={e => {
                    setFilterDeviceType(e.target.value);
                    setFilterBrand('');
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
                <label className="block text-xs font-medium mb-1">Brand</label>
                <select
                  className="border rounded px-2 py-1 min-w-[120px]"
                  value={filterBrand}
                  onChange={e => {
                    setFilterBrand(e.target.value);
                    setFilterModel('');
                  }}
                >
                  <option value="">All</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Model</label>
                <select
                  className="border rounded px-2 py-1 min-w-[120px]"
                  value={filterModel}
                  onChange={e => setFilterModel(e.target.value)}
                >
                  <option value="">All</option>
                  {models.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
              {(filterDeviceType || filterBrand || filterModel) && (
                <button
                  type="button"
                  className="ml-2 px-2 py-1 border rounded text-xs bg-gray-100 hover:bg-gray-200"
                  onClick={() => {
                    setFilterDeviceType('');
                    setFilterBrand('');
                    setFilterModel('');
                  }}
                >
                  Clear Filters
                </button>
              )}
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
              {filteredParts.map((part: Part) => (
                  <Card key={part.id} className={`${part.inStock <= part.minStock ? 'border-orange-200 bg-orange-50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
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
                              onChange={(e) => handleUpdateStock(part.id, parseInt(e.target.value) || 0, 'set')}
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
