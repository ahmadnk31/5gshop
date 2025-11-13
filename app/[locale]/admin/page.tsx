"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AdminProvider, useAdmin } from "@/lib/admin-context-server";
import { RepairDetailModal } from "@/components/admin/repair-detail-modal";
import { NewRepairModal } from "@/components/admin/new-repair-modal";
import { InventoryModal } from "@/components/admin/inventory-modal";
import { DeviceCatalogModal } from "@/components/admin/device-catalog-modal";
import { AccessoryModal } from "@/components/admin/accessory-modal";
import { CustomerDetailModal } from "@/components/admin/customer-detail-modal";
import { CustomerEditModal } from "@/components/admin/customer-edit-modal";
import { ContactList } from "@/components/admin/contact-list";
import { QuotesList } from "@/components/admin/quotes-list";
import { ReportsModal } from "@/components/admin/reports-modal";
import { OrdersTable } from "@/components/admin/orders-table";
import { UserManagement } from "@/components/admin/user-management";
import { Repair, Customer, Priority, RepairStatus, Part } from "@/lib/types";
import { 
  DollarSign, 
  Users, 
  Wrench, 
  Package, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Calendar,
  BarChart3,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Box,
  Phone,
  Mail,
  MapPin,
  UserPlus,
  Activity,
  PieChart,
  LineChart,
  MessageSquare,
  Shield,
  Loader2,
  ArrowUp,
  ArrowDown
} from "lucide-react";

function AdminDashboardContent() {
  const { state, actions } = useAdmin();
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showRepairModal, setShowRepairModal] = useState(false);
  const [showNewRepairModal, setShowNewRepairModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showDeviceCatalogModal, setShowDeviceCatalogModal] = useState(false);
  const [showAccessoryModal, setShowAccessoryModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showCustomerEditModal, setShowCustomerEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RepairStatus | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'repairs' | 'customers' | 'contacts' | 'quotes' | 'analytics' | 'inventory' | 'orders' | 'users'>('overview');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showTodayFilter, setShowTodayFilter] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [editingPartOrderId, setEditingPartOrderId] = useState<string | null>(null);
  const [tempPartOrderValue, setTempPartOrderValue] = useState<number>(0);
  
  // Helper function to check if a date is today
  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Helper function for loading states
  const isLoading = (key: string) => state.operationLoading[key] || false;

  // Filter data based on today filter
  const getFilteredData = () => {
    if (!showTodayFilter) {
      return {
        repairs: state.repairs,
        customers: state.customers,
        quotes: state.quotes
      };
    }

    return {
      repairs: state.repairs.filter(repair => isToday(repair.createdAt)),
      customers: state.customers.filter(customer => isToday(customer.createdAt)),
      quotes: state.quotes.filter(quote => isToday(quote.createdAt))
    };
  };

  const filteredData = getFilteredData();

  // Update stats for today filter
  const getDisplayStats = () => {
    if (!showTodayFilter) return state.stats;

    const todayRepairs = filteredData.repairs;
    const todayRevenue = todayRepairs.reduce((sum, repair) => sum + (repair.cost || 0), 0);
    const todayPending = todayRepairs.filter(r => r.status === 'PENDING').length;
    const todayCompleted = todayRepairs.filter(r => r.status === 'COMPLETED').length;

    return {
      ...state.stats,
      totalRevenue: todayRevenue,
      pendingRepairs: todayPending,
      completedRepairs: todayCompleted,
      totalCustomers: filteredData.customers.length,
      activeQuotes: filteredData.quotes.length
    };
  };

  const displayStats = getDisplayStats();

  const stats = [
    {
      title: showTodayFilter ? "Today's Revenue" : "Total Revenue",
      value: `$${displayStats.totalRevenue.toFixed(2)}`,
      change: showTodayFilter ? "today's earnings" : `+${state.stats.monthlyRevenue.length > 0 ? state.stats.monthlyRevenue[state.stats.monthlyRevenue.length - 1].revenue : 0} this month`,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: showTodayFilter ? "Today's Repairs" : "Active Repairs",
      value: displayStats.pendingRepairs.toString(),
      change: `${displayStats.completedRepairs} completed${showTodayFilter ? ' today' : ''}`,
      icon: Wrench,
      color: "text-blue-600"
    },
    {
      title: showTodayFilter ? "New Customers" : "Total Customers",
      value: displayStats.totalCustomers.toString(),
      change: `${displayStats.activeQuotes} ${showTodayFilter ? 'new ' : 'active '}quotes`,
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Inventory Alerts",
      value: state.stats.lowStockParts.toString(),
      change: "items need restocking",
      icon: Package,
      color: "text-orange-600"
    }
  ];

  const filteredRepairs = filteredData.repairs.filter((repair: Repair) => {
    const matchesSearch = 
      repair.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${repair.customer.firstName} ${repair.customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.device.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || repair.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: RepairStatus) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'DIAGNOSED': 'bg-blue-100 text-blue-800', 
      'IN_PROGRESS': 'bg-purple-100 text-purple-800',
      'WAITING_PARTS': 'bg-orange-100 text-orange-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'DELIVERED': 'bg-gray-100 text-gray-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: Priority) => {
    const colors: Record<Priority, string> = {
      'LOW': 'bg-green-100 text-green-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'EMERGENCY': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const handleViewRepair = (repair: Repair) => {
    setSelectedRepair(repair);
    setShowRepairModal(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerEditModal(true);
  };

  const handleDeleteRepair = async (repairId: string) => {
    if (confirm('Are you sure you want to delete this repair?')) {
      try {
        await actions.deleteRepair(repairId);
      } catch (error) {
        console.error('Failed to delete repair:', error);
      }
    }
  };

  // Part order management functions
  const sortedParts = [...state.parts].sort((a, b) => a.order - b.order);

  const handleUpdatePartOrder = async (partId: string, newOrder: number) => {
    try {
      await actions.updatePart(partId, { order: newOrder });
    } catch (error) {
      console.error('Failed to update part order:', error);
    }
  };

  const handleMovePartUp = async (part: Part, index: number) => {
    if (index === 0) return;
    const prevPart = sortedParts[index - 1];
    await handleUpdatePartOrder(part.id, prevPart.order);
    await handleUpdatePartOrder(prevPart.id, part.order);
  };

  const handleMovePartDown = async (part: Part, index: number) => {
    if (index === sortedParts.length - 1) return;
    const nextPart = sortedParts[index + 1];
    await handleUpdatePartOrder(part.id, nextPart.order);
    await handleUpdatePartOrder(nextPart.id, part.order);
  };

  const startEditingPartOrder = (part: Part) => {
    setEditingPartOrderId(part.id);
    setTempPartOrderValue(part.order);
  };

  const savePartOrderEdit = async (partId: string) => {
    await handleUpdatePartOrder(partId, tempPartOrderValue);
    setEditingPartOrderId(null);
  };

  const cancelPartOrderEdit = () => {
    setEditingPartOrderId(null);
    setTempPartOrderValue(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <Button 
                variant={showTodayFilter ? "default" : "outline"}
                onClick={() => setShowTodayFilter(!showTodayFilter)}
                className="w-full sm:w-auto"
              >
                <Calendar className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{showTodayFilter ? "Show All" : "Today"}</span>
                <span className="sm:hidden">{showTodayFilter ? "All" : "Today"}</span>
              </Button>
              <Button 
                onClick={() => setShowReportsModal(true)}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Reports</span>
                <span className="sm:hidden">Reports</span>
              </Button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="border-b mt-4">
            <nav className="flex overflow-x-auto scrollbar-hide space-x-2 sm:space-x-8 pb-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'repairs', label: 'Repairs', icon: Wrench },
                { id: 'customers', label: 'Customers', icon: Users },
                { id: 'contacts', label: 'Contacts', icon: MessageSquare },
                { id: 'quotes', label: 'Quotes', icon: DollarSign },
                { id: 'analytics', label: 'Analytics', icon: PieChart },
                { id: 'inventory', label: 'Inventory', icon: Package },
                { id: 'orders', label: 'Orders', icon: Box },
                { id: 'users', label: 'Users', icon: Shield }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium truncate">{stat.title}</CardTitle>
                    <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color} flex-shrink-0`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground truncate">{stat.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
                    <CardDescription className="text-sm">Latest updates across all operations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {state.repairs.slice(0, 5).map((repair: Repair) => (
                        <div key={repair.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(repair.status)} flex-shrink-0`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {repair.device.brand} {repair.device.model} - {repair.issue}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                Customer: {repair.customer.firstName} {repair.customer.lastName}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end sm:justify-start">
                            <Badge variant={repair.status === 'COMPLETED' ? 'default' : 'secondary'} className="text-xs">
                              {repair.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    <Button 
                      className="w-full justify-start text-sm bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800" 
                      variant="outline"
                      onClick={() => setShowNewRepairModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">New Repair Order</span>
                      <span className="sm:hidden">New Repair</span>
                    </Button>
                    <Button 
                      className="w-full justify-start text-sm bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800" 
                      variant="outline"
                      onClick={() => setShowInventoryModal(true)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Manage Inventory</span>
                      <span className="sm:hidden">Inventory</span>
                    </Button>
                    <Button 
                      className="w-full justify-start text-sm bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700 hover:text-purple-800" 
                      variant="outline"
                      onClick={() => setShowDeviceCatalogModal(true)}
                    >
                      <Box className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Device Catalog</span>
                      <span className="sm:hidden">Devices</span>
                    </Button>
                    <Button 
                      className="w-full justify-start text-sm bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700 hover:text-orange-800" 
                      variant="outline"
                      onClick={() => setShowAccessoryModal(true)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Accessories</span>
                      <span className="sm:hidden">Accessories</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Customer Management Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Management</h2>
                <p className="text-sm sm:text-base text-gray-600">Manage customer information and view repair history</p>
              </div>
              <Button 
                onClick={() => setShowNewRepairModal(true)} 
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Add Customer</span>
                <span className="sm:hidden">Add Customer</span>
              </Button>
            </div>

            {/* Customer Search */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg sm:text-xl">Customer List</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search customers..."
                        value={customerSearchTerm}
                        onChange={(e) => setCustomerSearchTerm(e.target.value)}
                        className="pl-10 w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredData.customers
                    .filter(customer => 
                      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                      customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                      customer.phone.includes(customerSearchTerm)
                    )
                    .map((customer: Customer) => (
                      <div key={customer.id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                              <h3 className="font-semibold text-base sm:text-lg truncate">
                                {customer.firstName} {customer.lastName}
                              </h3>
                              <Badge variant="secondary" className="w-fit">
                                {customer.totalRepairs} repairs
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs sm:text-sm text-gray-600">
                              <div className="flex items-center min-w-0">
                                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{customer.email}</span>
                              </div>
                              <div className="flex items-center min-w-0">
                                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{customer.phone}</span>
                              </div>
                              {customer.address && (
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {customer.address}
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              Customer since: {new Date(customer.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleViewCustomer(customer)}
                              className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEditCustomer(customer)}
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  {filteredData.customers.filter(customer => 
                    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                    customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                    customer.phone.includes(customerSearchTerm)
                  ).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No customers found matching your search criteria.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <ContactList />
        )}

        {/* Quotes Tab */}
        {activeTab === 'quotes' && (
          <QuotesList />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Analytics Header */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics & Reports</h2>
              <p className="text-sm sm:text-base text-gray-600">Business insights and performance metrics</p>
            </div>

            {/* Analytics Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${state.stats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    +${state.stats.monthlyRevenue.length > 0 ? 
                      state.stats.monthlyRevenue[state.stats.monthlyRevenue.length - 1].revenue.toFixed(2) : 
                      '0.00'} this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Repair Time</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{state.stats.averageRepairTime.toFixed(1)} days</div>
                  <p className="text-xs text-muted-foreground">
                    Average completion time
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {state.stats.totalRepairs > 0 ? 
                      Math.round((state.stats.completedRepairs / state.stats.totalRepairs) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Completed repairs
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                  <Activity className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{state.stats.customerSatisfaction}%</div>
                  <p className="text-xs text-muted-foreground">
                    Based on completion rate
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <LineChart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Monthly Revenue
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Revenue breakdown by month</CardDescription>
                </CardHeader>
                <CardContent>
                  {state.stats.monthlyRevenue.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {state.stats.monthlyRevenue.map((month, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span className="text-xs sm:text-sm font-medium">{month.month}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-full sm:w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ 
                                  width: `${Math.min(100, (month.revenue / Math.max(...state.stats.monthlyRevenue.map(m => m.revenue))) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-xs sm:text-sm font-bold whitespace-nowrap">${month.revenue.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No revenue data available yet
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Device Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <PieChart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Device Type Distribution
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Repairs by device type</CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const deviceCounts = state.repairs.reduce((acc, repair) => {
                      const type = repair.device.type;
                      acc[type] = (acc[type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);

                    const totalRepairs = state.repairs.length;
                    const deviceTypes = Object.entries(deviceCounts).sort((a, b) => b[1] - a[1]);

                    return deviceTypes.length > 0 ? (
                      <div className="space-y-3">
                        {deviceTypes.map(([type, count]) => {
                          const percentage = Math.round((count / totalRepairs) * 100);
                          return (
                            <div key={type} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <span className="text-xs sm:text-sm font-medium capitalize truncate">
                                {type.toLowerCase().replace('_', ' ')}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-full sm:w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs sm:text-sm whitespace-nowrap">{count} ({percentage}%)</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        No repair data available yet
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Repair Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Repair Status Overview
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Current repair statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const statusCounts = state.repairs.reduce((acc, repair) => {
                      acc[repair.status] = (acc[repair.status] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);

                    const statusColors = {
                      'PENDING': 'bg-yellow-500',
                      'DIAGNOSED': 'bg-blue-500',
                      'IN_PROGRESS': 'bg-purple-500',
                      'WAITING_PARTS': 'bg-orange-500',
                      'COMPLETED': 'bg-green-500',
                      'DELIVERED': 'bg-gray-500',
                      'CANCELLED': 'bg-red-500'
                    };

                    return Object.entries(statusCounts).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(statusCounts).map(([status, count]) => (
                          <div key={status} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <span className="text-xs sm:text-sm font-medium truncate">
                              {status.replace('_', ' ')}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-full sm:w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'}`}
                                  style={{ 
                                    width: `${Math.round((count / state.repairs.length) * 100)}%` 
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs sm:text-sm font-bold whitespace-nowrap">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        No repair status data available
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Top Performing Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Top Services
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Most requested repair services</CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const serviceCounts = state.repairs.reduce((acc, repair) => {
                      const issue = repair.issue.toLowerCase();
                      if (issue.includes('screen')) {
                        acc.screen = (acc.screen || 0) + 1;
                      } else if (issue.includes('battery')) {
                        acc.battery = (acc.battery || 0) + 1;
                      } else if (issue.includes('water')) {
                        acc.water = (acc.water || 0) + 1;
                      } else if (issue.includes('camera')) {
                        acc.camera = (acc.camera || 0) + 1;
                      } else if (issue.includes('charging')) {
                        acc.charging = (acc.charging || 0) + 1;
                      } else {
                        acc.other = (acc.other || 0) + 1;
                      }
                      return acc;
                    }, {} as Record<string, number>);

                    const services = [
                      { name: 'Screen Replacement', count: serviceCounts.screen || 0, icon: '📱' },
                      { name: 'Battery Replacement', count: serviceCounts.battery || 0, icon: '🔋' },
                      { name: 'Water Damage Recovery', count: serviceCounts.water || 0, icon: '💧' },
                      { name: 'Camera Repair', count: serviceCounts.camera || 0, icon: '📷' },
                      { name: 'Charging Port Repair', count: serviceCounts.charging || 0, icon: '🔌' },
                      { name: 'Other Services', count: serviceCounts.other || 0, icon: '🔧' },
                    ].sort((a, b) => b.count - a.count);

                    return services.some(s => s.count > 0) ? (
                      <div className="space-y-3">
                        {services.filter(s => s.count > 0).slice(0, 5).map((service, index) => (
                          <div key={index} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="text-base sm:text-lg">{service.icon}</span>
                              <span className="text-xs sm:text-sm font-medium truncate">{service.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">{service.count}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        No service data available yet
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Inventory Management</h2>
                <p className="text-sm sm:text-base text-gray-600">Manage parts, accessories, and stock levels</p>
              </div>
              <Button onClick={() => setShowInventoryModal(true)} className="w-full sm:w-auto">
                <Package className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Manage Inventory</span>
                <span className="sm:hidden">Manage</span>
              </Button>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowInventoryModal(true)}>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Unified Inventory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl sm:text-2xl font-bold">{state.parts.length}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Parts & accessories in one place</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowAccessoryModal(true)}>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Box className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Accessories Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl sm:text-2xl font-bold">Advanced</p>
                  <p className="text-xs sm:text-sm text-gray-600">Full accessories CRUD operations</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowDeviceCatalogModal(true)}>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Wrench className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Device Catalog
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl sm:text-2xl font-bold">Services</p>
                  <p className="text-xs sm:text-sm text-gray-600">Manage repair services</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Repairs Tab */}
        {activeTab === 'repairs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Repairs Management */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Repair Orders</CardTitle>
                      <CardDescription className="text-sm">Manage all repair requests and their status</CardDescription>
                    </div>
                    <Button 
                      onClick={() => setShowNewRepairModal(true)}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">New Repair</span>
                      <span className="sm:hidden">New</span>
                    </Button>
                  </div>
                  
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search repairs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as RepairStatus | 'all')}
                      className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto"
                    >
                      <option value="all">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="DIAGNOSED">Diagnosed</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="WAITING_PARTS">Waiting Parts</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="DELIVERED">Delivered</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4 max-h-[70vh] sm:max-h-96 overflow-y-auto">
                    {filteredRepairs.map((repair: Repair) => (
                      <div key={repair.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-semibold text-sm sm:text-base truncate">{repair.id}</span>
                            <Badge className={`${getPriorityColor(repair.priority)} text-xs`}>
                              {repair.priority}
                            </Badge>
                            <Badge className={`${getStatusColor(repair.status)} text-xs`}>
                              {repair.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            <strong>{repair.customer.firstName} {repair.customer.lastName}</strong> - {repair.device.brand} {repair.device.model}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">{repair.issue}</p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs text-gray-400">
                            <span className="truncate">Created: {repair.createdAt}</span>
                            <span className="hidden sm:inline truncate">Est: {repair.estimatedCompletion}</span>
                            <span className="font-semibold">${repair.cost}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewRepair(repair)}
                            className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 flex-1 sm:flex-none"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="ml-1 sm:hidden">View</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteRepair(repair.id)}
                            disabled={isLoading(`delete-repair-${repair.id}`)}
                            className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
                          >
                            {isLoading(`delete-repair-${repair.id}`) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4" />
                                <span className="ml-1 sm:hidden">Delete</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredRepairs.length === 0 && (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        No repairs found matching your criteria.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Alerts */}
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
                  <Button 
                    className="w-full text-xs sm:text-sm" 
                    variant="outline"
                    onClick={() => setShowNewRepairModal(true)}
                  >
                    <Wrench className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">New Repair Order</span>
                    <span className="sm:hidden">New Repair</span>
                  </Button>
                  <Button 
                    className="w-full text-xs sm:text-sm" 
                    variant="outline"
                    onClick={() => setShowInventoryModal(true)}
                  >
                    <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Manage Inventory</span>
                    <span className="sm:hidden">Inventory</span>
                  </Button>
                  <Button 
                    className="w-full text-xs sm:text-sm" 
                    variant="outline"
                    onClick={() => setShowAccessoryModal(true)}
                  >
                    <Box className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Manage Accessories</span>
                    <span className="sm:hidden">Accessories</span>
                  </Button>
                  <Button 
                    className="w-full text-xs sm:text-sm" 
                    variant="outline"
                    onClick={() => setShowDeviceCatalogModal(true)}
                  >
                    <Wrench className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Device Catalog</span>
                    <span className="sm:hidden">Devices</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Services Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Services Overview</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Most popular repair services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  <div className="grid gap-2">
                    {(() => {
                      // Calculate service statistics from actual repair data
                      const serviceCounts = state.repairs.reduce((acc, repair) => {
                        const issue = repair.issue.toLowerCase();
                        if (issue.includes('screen')) {
                          acc.screen = (acc.screen || 0) + 1;
                        } else if (issue.includes('battery')) {
                          acc.battery = (acc.battery || 0) + 1;
                        } else if (issue.includes('water')) {
                          acc.water = (acc.water || 0) + 1;
                        } else if (issue.includes('camera')) {
                          acc.camera = (acc.camera || 0) + 1;
                        } else {
                          acc.other = (acc.other || 0) + 1;
                        }
                        return acc;
                      }, {} as Record<string, number>);

                      const totalRepairs = state.repairs.length;
                      const services = [
                        { name: 'Screen Replacement', count: serviceCounts.screen || 0 },
                        { name: 'Battery Replacement', count: serviceCounts.battery || 0 },
                        { name: 'Water Damage Recovery', count: serviceCounts.water || 0 },
                        { name: 'Camera Repair', count: serviceCounts.camera || 0 },
                        { name: 'Other Services', count: serviceCounts.other || 0 },
                      ].sort((a, b) => b.count - a.count);

                      return services.slice(0, 4).map((service, index) => {
                        const percentage = totalRepairs > 0 ? Math.round((service.count / totalRepairs) * 100) : 0;
                        return (
                          <div key={index} className="flex items-center justify-between py-2 gap-2">
                            <span className="text-xs sm:text-sm truncate flex-1">{service.name}</span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-gray-500">({service.count})</span>
                              <Badge variant="secondary" className="text-xs">{percentage}%</Badge>
                            </div>
                          </div>
                        );
                      });
                    })()}
                    {state.repairs.length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-xs sm:text-sm">
                        No repair data available yet
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3 text-xs sm:text-sm"
                    onClick={() => setShowDeviceCatalogModal(true)}
                  >
                    Manage Services
                  </Button>
                </CardContent>
              </Card>

              {/* Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">System Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  {state.stats.lowStockParts > 0 && (
                    <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-yellow-50 rounded-lg">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium">Low Stock Alert</p>
                        <p className="text-xs text-gray-600 truncate">{state.stats.lowStockParts} items need restocking</p>
                      </div>
                    </div>
                  )}
                  
                  {state.stats.activeQuotes > 0 && (
                    <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium">Pending Quotes</p>
                        <p className="text-xs text-gray-600 truncate">{state.stats.activeQuotes} quotes awaiting response</p>
                      </div>
                    </div>
                  )}
                  
                  {state.repairs.filter((r: Repair) => r.status === 'COMPLETED').length > 0 && (
                    <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium">Repairs Complete</p>
                        <p className="text-xs text-gray-600 truncate">
                          {state.repairs.filter((r: Repair) => r.status === 'COMPLETED').length} repairs ready for pickup
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Parts Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Inventory Status</CardTitle>
                  <CardDescription className="text-xs">Click order number to edit, use arrows to reorder</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 sm:space-y-3">
                    {sortedParts.slice(0, 5).map((part: Part, index: number) => (
                      <div key={part.id} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50">
                        {/* Order Controls */}
                        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMovePartUp(part, index)}
                            disabled={index === 0 || isLoading(`update-part-${part.id}`)}
                            className="h-5 w-5 p-0 hover:bg-gray-200"
                            title="Move up"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          {editingPartOrderId === part.id ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <Input
                                type="number"
                                value={tempPartOrderValue}
                                onChange={(e) => setTempPartOrderValue(parseInt(e.target.value) || 0)}
                                className="w-10 h-5 text-[10px] text-center p-0.5 border"
                                min="0"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') savePartOrderEdit(part.id);
                                  if (e.key === 'Escape') cancelPartOrderEdit();
                                }}
                              />
                              <div className="flex gap-0.5">
                                <button
                                  onClick={() => savePartOrderEdit(part.id)}
                                  className="text-[10px] text-green-600 hover:text-green-800 px-1"
                                  title="Save"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={cancelPartOrderEdit}
                                  className="text-[10px] text-red-600 hover:text-red-800 px-1"
                                  title="Cancel"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditingPartOrder(part)}
                              className="text-[10px] text-gray-600 hover:text-blue-600 font-mono cursor-pointer px-1"
                              title="Click to edit order"
                            >
                              #{part.order}
                            </button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMovePartDown(part, index)}
                            disabled={index === sortedParts.slice(0, 5).length - 1 || isLoading(`update-part-${part.id}`)}
                            className="h-5 w-5 p-0 hover:bg-gray-200"
                            title="Move down"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {/* Part Info */}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium truncate">{part.name}</p>
                          <p className="text-xs text-gray-500 truncate">SKU: {part.sku}</p>
                        </div>
                        
                        {/* Stock Badge */}
                        <div className="text-right flex-shrink-0">
                          <Badge variant={part.inStock <= part.minStock ? "destructive" : "secondary"} className="text-xs">
                            {part.inStock}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold">Orders Management</h2>
            <OrdersTable />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <UserManagement />
          </div>
        )}
      </div>

      {/* Modals */}
      <RepairDetailModal
        isOpen={showRepairModal}
        onClose={() => setShowRepairModal(false)}
        repair={selectedRepair}
      />
      
      <NewRepairModal
        isOpen={showNewRepairModal}
        onClose={() => setShowNewRepairModal(false)}
      />
      
      <InventoryModal
        isOpen={showInventoryModal}
        onClose={() => setShowInventoryModal(false)}
      />
      
      <DeviceCatalogModal
        isOpen={showDeviceCatalogModal}
        onClose={() => setShowDeviceCatalogModal(false)}
      />
      
      <AccessoryModal
        isOpen={showAccessoryModal}
        onClose={() => setShowAccessoryModal(false)}
      />

      <CustomerDetailModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        customer={selectedCustomer}
      />

      <CustomerEditModal
        isOpen={showCustomerEditModal}
        onClose={() => setShowCustomerEditModal(false)}
        customer={selectedCustomer}
      />

      <ReportsModal
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
        data={{
          repairs: state.repairs,
          customers: state.customers,
          quotes: state.quotes,
          parts: state.parts,
          stats: state.stats
        }}
      />
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminProvider>
      <AdminDashboardContent />
    </AdminProvider>
  );
}
