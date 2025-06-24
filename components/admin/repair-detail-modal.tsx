"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, DollarSign, Settings, User, Phone, Mail, MapPin } from "lucide-react";
import { useAdmin } from "@/lib/admin-context-server";
import type { Repair, RepairStatus, Priority } from "@/lib/types";

interface RepairDetailModalProps {
  repair: Repair | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RepairDetailModal({ repair, isOpen, onClose }: RepairDetailModalProps) {
  const { state, actions } = useAdmin();
  const { updateRepairStatus, addRepairNote, updateRepair } = actions;
  const [isUpdating, setIsUpdating] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [totalCost, setTotalCost] = useState(repair?.cost?.toString() || "");

  if (!repair) return null;

  const handleStatusUpdate = async (newStatus: RepairStatus) => {
    setIsUpdating(true);
    try {
      await updateRepairStatus(repair.id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    setIsUpdating(true);
    try {
      await addRepairNote(repair.id, newNote.trim());
      setNewNote("");
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateCost = async () => {
    const cost = parseFloat(totalCost);
    if (isNaN(cost) || cost < 0) return;
    
    setIsUpdating(true);
    try {
      await updateRepair(repair.id, { cost });
    } catch (error) {
      console.error('Failed to update cost:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: RepairStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'DIAGNOSED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'WAITING_PARTS': return 'bg-orange-100 text-orange-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'DELIVERED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Repair Details - {repair.id}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Device Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Device</Label>
                    <p className="text-sm">{repair.device.brand} {repair.device.model}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Type</Label>
                    <p className="text-sm capitalize">{repair.device.type.toLowerCase()}</p>
                  </div>
                  {repair.device.serialNumber && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Serial Number</Label>
                      <p className="text-sm font-mono">{repair.device.serialNumber}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Repair Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-gray-600">Status:</Label>
                    <Badge className={getStatusColor(repair.status)}>
                      {repair.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-gray-600">Priority:</Label>
                    <Badge className={getPriorityColor(repair.priority)}>
                      {repair.priority}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Issue</Label>
                    <p className="text-sm">{repair.issue}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Description</Label>
                    <p className="text-sm">{repair.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <CalendarDays className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-xs text-gray-600">
                      {new Date(repair.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <CalendarDays className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Estimated Completion</p>
                    <p className="text-xs text-gray-600">
                      {new Date(repair.estimatedCompletion).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Total Cost</p>
                    <p className="text-xs text-gray-600">
                      ${repair.cost.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium">Update Status:</Label>
                  <Select value={repair.status} onValueChange={handleStatusUpdate} disabled={isUpdating}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="DIAGNOSED">Diagnosed</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="WAITING_PARTS">Waiting Parts</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium">Total Cost:</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={totalCost}
                      onChange={(e) => setTotalCost(e.target.value)}
                      className="w-32"
                    />
                    <Button 
                      onClick={handleUpdateCost} 
                      disabled={isUpdating}
                      size="sm"
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Enter your note here..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button 
                  onClick={handleAddNote} 
                  disabled={!newNote.trim() || isUpdating}
                >
                  Add Note
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Repair Notes</CardTitle>
                <CardDescription>
                  {repair.notes?.length || 0} notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {repair.notes && repair.notes.length > 0 ? (
                  <div className="space-y-3">
                    {repair.notes.map((note, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                        <p className="text-sm">{note}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No notes added yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{repair.customer.firstName} {repair.customer.lastName}</p>
                    <p className="text-sm text-gray-600">Customer ID: {repair.customer.id}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{repair.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{repair.customer.phone}</span>
                  </div>
                  {repair.customer.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-sm">{repair.customer.address}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
