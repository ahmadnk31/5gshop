"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { usePagination } from "@/hooks/use-pagination";
import { getRepairsPaginated, getCustomersPaginated, getContactsPaginated } from "@/app/actions/pagination-actions";
import { Repair, Customer, RepairStatus } from "@/lib/types";
import { 
  Eye,
  Edit,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";

interface AdminPaginatedListsProps {
  activeTab: string;
  onRepairSelect?: (repair: Repair) => void;
  onCustomerSelect?: (customer: Customer) => void;
  onContactSelect?: (contact: any) => void;
}

export function AdminPaginatedLists({ 
  activeTab, 
  onRepairSelect, 
  onCustomerSelect,
  onContactSelect 
}: AdminPaginatedListsProps) {
  // Common state
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Repairs state
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [repairsTotalItems, setRepairsTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<RepairStatus | 'all'>('all');
  
  // Customers state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersTotalItems, setCustomersTotalItems] = useState(0);
  
  // Contacts state
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactsTotalItems, setContactsTotalItems] = useState(0);
  const [contactStatusFilter, setContactStatusFilter] = useState<'new' | 'responded' | 'resolved' | 'all'>('all');

  // Pagination hooks
  const repairsPagination = usePagination({
    totalItems: repairsTotalItems,
    itemsPerPage,
    initialPage: 1,
  });

  const customersPagination = usePagination({
    totalItems: customersTotalItems,
    itemsPerPage,
    initialPage: 1,
  });

  const contactsPagination = usePagination({
    totalItems: contactsTotalItems,
    itemsPerPage,
    initialPage: 1,
  });

  // Load repairs
  const loadRepairs = async (page = 1) => {
    try {
      setLoading(true);
      const result = await getRepairsPaginated({
        page,
        limit: itemsPerPage,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        status: statusFilter,
        search: searchTerm || undefined,
      });

      setRepairs(result.data);
      setRepairsTotalItems(result.pagination.totalItems);
    } catch (error) {
      console.error('Failed to load repairs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load customers
  const loadCustomers = async (page = 1) => {
    try {
      setLoading(true);
      const result = await getCustomersPaginated({
        page,
        limit: itemsPerPage,
        sortBy: 'lastName',
        sortOrder: 'asc',
        search: searchTerm || undefined,
      });

      setCustomers(result.data);
      setCustomersTotalItems(result.pagination.totalItems);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load contacts
  const loadContacts = async (page = 1) => {
    try {
      setLoading(true);
      const result = await getContactsPaginated({
        page,
        limit: itemsPerPage,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        status: contactStatusFilter,
      });

      setContacts(result.data);
      setContactsTotalItems(result.pagination.totalItems);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effects to load data when dependencies change
  useEffect(() => {
    if (activeTab === 'repairs') {
      loadRepairs(repairsPagination.currentPage);
    }
  }, [activeTab, repairsPagination.currentPage, itemsPerPage, statusFilter, searchTerm]);

  useEffect(() => {
    if (activeTab === 'customers') {
      loadCustomers(customersPagination.currentPage);
    }
  }, [activeTab, customersPagination.currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    if (activeTab === 'contacts') {
      loadContacts(contactsPagination.currentPage);
    }
  }, [activeTab, contactsPagination.currentPage, itemsPerPage, contactStatusFilter]);

  // Handle filter changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (activeTab === 'repairs') repairsPagination.goToFirstPage();
    if (activeTab === 'customers') customersPagination.goToFirstPage();
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    if (activeTab === 'repairs') repairsPagination.goToFirstPage();
    if (activeTab === 'customers') customersPagination.goToFirstPage();
    if (activeTab === 'contacts') contactsPagination.goToFirstPage();
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (activeTab === 'repairs') repairsPagination.goToFirstPage();
    if (activeTab === 'customers') customersPagination.goToFirstPage();
  };

  // Status mapping
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-blue-100 text-blue-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'EMERGENCY': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (activeTab === 'repairs') {
    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search repairs..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RepairStatus | 'all')}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="DIAGNOSED">Diagnosed</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="WAITING_PARTS">Waiting Parts</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Repairs List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading repairs...</p>
          </div>
        ) : repairs.length > 0 ? (
          <>
            <div className="space-y-4">
              {repairs.map((repair) => (
                <Card key={repair.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{repair.customer.firstName} {repair.customer.lastName}</h3>
                          <Badge className={getStatusColor(repair.status)}>
                            {repair.status}
                          </Badge>
                          <Badge className={getPriorityColor(repair.priority)}>
                            {repair.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Device:</strong> {repair.device.brand} {repair.device.model}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Issue:</strong> {repair.issue}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Cost:</strong> ${repair.cost.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created: {new Date(repair.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Due: {new Date(repair.estimatedCompletion).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRepairSelect?.(repair)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <PaginationControls 
              pagination={repairsPagination}
              className="mt-6"
            />
          </>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No repairs found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? "Try adjusting your search criteria." 
                : "No repairs have been created yet."}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'customers') {
    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Customers List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading customers...</p>
          </div>
        ) : customers.length > 0 ? (
          <>
            <div className="space-y-4">
              {customers.map((customer) => (
                <Card key={customer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">
                          {customer.firstName} {customer.lastName}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Email:</strong> {customer.email}</p>
                          <p><strong>Phone:</strong> {customer.phone}</p>
                          {customer.address && (
                            <p><strong>Address:</strong> {customer.address}</p>
                          )}
                          <p><strong>Total Repairs:</strong> {customer.totalRepairs}</p>
                          <p><strong>Member Since:</strong> {new Date(customer.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onCustomerSelect?.(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <PaginationControls 
              pagination={customersPagination}
              className="mt-6"
            />
          </>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No customers found</h3>
            <p className="text-gray-500">
              {searchTerm 
                ? "Try adjusting your search criteria." 
                : "No customers have been added yet."}
            </p>
          </div>
        )}
      </div>
    );
  }

  // For other tabs, return null or a placeholder
  return <div>Pagination not implemented for this tab yet.</div>;
}
