"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer, Repair } from "@/lib/types";
import { Mail, Phone, MapPin, Calendar, User, Wrench } from "lucide-react";
import { useAdmin } from "@/lib/admin-context-server";

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export function CustomerDetailModal({ isOpen, onClose, customer }: CustomerDetailModalProps) {
  const { state } = useAdmin();

  if (!customer) return null;

  // Get customer's repair history
  const customerRepairs = state.repairs.filter(repair => repair.customer.id === customer.id);

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'DIAGNOSED': 'bg-blue-100 text-blue-800', 
      'IN_PROGRESS': 'bg-purple-100 text-purple-800',
      'WAITING_PARTS': 'bg-orange-100 text-orange-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'DELIVERED': 'bg-gray-100 text-gray-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[50vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <User className="h-6 w-6 mr-3" />
            Customer Details
          </DialogTitle>
          <DialogDescription>
            View and manage customer information and repair history
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary">
                        {customer.totalRepairs} repairs
                      </Badge>
                      <Badge variant="outline">
                        Customer ID: {customer.id}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                    {customer.address && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{customer.address}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        Customer since: {new Date(customer.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {customerRepairs.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Repairs</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {customerRepairs.filter(r => r.status === 'COMPLETED' || r.status === 'DELIVERED').length}
                      </div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        ${customerRepairs.reduce((sum, repair) => sum + repair.cost, 0).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {customerRepairs.filter(r => r.status === 'PENDING' || r.status === 'IN_PROGRESS' || r.status === 'DIAGNOSED').length}
                      </div>
                      <div className="text-sm text-gray-600">Active Repairs</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Repair History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="h-5 w-5 mr-2" />
                Repair History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customerRepairs.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {customerRepairs.map((repair: Repair) => (
                    <div key={repair.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold">{repair.id}</span>
                          <Badge className={getStatusColor(repair.status)}>
                            {repair.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          ${repair.cost}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {repair.device.brand} {repair.device.model}
                        </p>
                        <p className="text-sm text-gray-600">{repair.issue}</p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Created: {repair.createdAt}</span>
                          <span>Est. completion: {repair.estimatedCompletion}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No repair history found for this customer.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button>
                <Wrench className="h-4 w-4 mr-2" />
                New Repair
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
