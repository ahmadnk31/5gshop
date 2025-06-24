"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Wrench, 
  Package,
  DollarSign,
  BarChart3,
  PieChart
} from "lucide-react";

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    repairs: any[];
    customers: any[];
    quotes: any[];
    parts: any[];
    stats: any;
  };
}

export function ReportsModal({ isOpen, onClose, data }: ReportsModalProps) {
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('last30days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');

  const getDateRangeData = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'yesterday':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        break;
      case 'last7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'last90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
        } else {
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const endDate = dateRange === 'custom' && customEndDate ? new Date(customEndDate) : now;

    // Filter data based on date range
    const filteredRepairs = data.repairs.filter(repair => {
      const repairDate = new Date(repair.createdAt);
      return repairDate >= startDate && repairDate <= endDate;
    });

    const filteredCustomers = data.customers.filter(customer => {
      const customerDate = new Date(customer.createdAt);
      return customerDate >= startDate && customerDate <= endDate;
    });

    const filteredQuotes = data.quotes.filter(quote => {
      const quoteDate = new Date(quote.createdAt);
      return quoteDate >= startDate && quoteDate <= endDate;
    });

    return {
      repairs: filteredRepairs,
      customers: filteredCustomers,
      quotes: filteredQuotes,
      startDate,
      endDate
    };
  };

  const rangeData = getDateRangeData();

  const generateOverviewReport = () => {
    const totalRevenue = rangeData.repairs.reduce((sum, repair) => sum + (repair.cost || 0), 0);
    const completedRepairs = rangeData.repairs.filter(r => r.status === 'COMPLETED').length;
    const avgRepairTime = rangeData.repairs.length > 0 
      ? rangeData.repairs.reduce((sum, repair) => {
          const created = new Date(repair.createdAt);
          const updated = new Date(repair.updatedAt);
          return sum + (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / rangeData.repairs.length
      : 0;

    return {
      period: dateRange === 'custom' 
        ? `${rangeData.startDate.toLocaleDateString()} - ${rangeData.endDate.toLocaleDateString()}`
        : dateRange.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      totalRepairs: rangeData.repairs.length,
      completedRepairs,
      pendingRepairs: rangeData.repairs.filter(r => r.status === 'PENDING').length,
      totalRevenue,
      newCustomers: rangeData.customers.length,
      totalQuotes: rangeData.quotes.length,
      avgRepairTime: avgRepairTime.toFixed(1),
      successRate: rangeData.repairs.length > 0 ? ((completedRepairs / rangeData.repairs.length) * 100).toFixed(1) : 0
    };
  };

  const overview = generateOverviewReport();

  const exportData = (format: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${reportType}-report-${timestamp}`;

    if (format === 'csv') {
      exportToCSV(filename);
    } else if (format === 'json') {
      exportToJSON(filename);
    }
  };

  const exportToCSV = (filename: string) => {
    let csvContent = '';
    
    if (reportType === 'overview') {
      csvContent = 'Metric,Value\n';
      csvContent += `Report Period,${overview.period}\n`;
      csvContent += `Total Repairs,${overview.totalRepairs}\n`;
      csvContent += `Completed Repairs,${overview.completedRepairs}\n`;
      csvContent += `Pending Repairs,${overview.pendingRepairs}\n`;
      csvContent += `Total Revenue,$${overview.totalRevenue.toFixed(2)}\n`;
      csvContent += `New Customers,${overview.newCustomers}\n`;
      csvContent += `Total Quotes,${overview.totalQuotes}\n`;
      csvContent += `Average Repair Time,${overview.avgRepairTime} days\n`;
      csvContent += `Success Rate,${overview.successRate}%\n`;
    } else if (reportType === 'repairs') {
      csvContent = 'Repair ID,Customer,Device,Issue,Status,Cost,Created Date,Updated Date\n';
      rangeData.repairs.forEach(repair => {
        csvContent += `${repair.id},"${repair.customer.firstName} ${repair.customer.lastName}",${repair.device.model},"${repair.issue}",${repair.status},$${repair.cost || 0},${repair.createdAt},${repair.updatedAt}\n`;
      });
    } else if (reportType === 'customers') {
      csvContent = 'Customer ID,Name,Email,Phone,Total Repairs,Created Date\n';
      rangeData.customers.forEach(customer => {
        csvContent += `${customer.id},"${customer.firstName} ${customer.lastName}",${customer.email},${customer.phone},${customer.totalRepairs || 0},${customer.createdAt}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = (filename: string) => {
    let jsonData = {};
    
    if (reportType === 'overview') {
      jsonData = overview;
    } else if (reportType === 'repairs') {
      jsonData = { repairs: rangeData.repairs, summary: overview };
    } else if (reportType === 'customers') {
      jsonData = { customers: rangeData.customers, summary: overview };
    }

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[70vw] max-h-[95vh] overflow-y-auto p-8">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <BarChart3 className="h-6 w-6 mr-3" />
            Reports & Analytics
          </DialogTitle>
          <DialogDescription className="text-base">
            Generate detailed reports and export business data
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Reports</TabsTrigger>
            <TabsTrigger value="analytics">Quick Analytics</TabsTrigger>
          </TabsList>

          {/* Generate Reports Tab */}
          <TabsContent value="generate" className="space-y-6">
            {/* Report Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overview">Business Overview</SelectItem>
                        <SelectItem value="repairs">Repairs Report</SelectItem>
                        <SelectItem value="customers">Customers Report</SelectItem>
                        <SelectItem value="revenue">Revenue Report</SelectItem>
                        <SelectItem value="inventory">Inventory Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="last7days">Last 7 Days</SelectItem>
                        <SelectItem value="last30days">Last 30 Days</SelectItem>
                        <SelectItem value="last90days">Last 90 Days</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {dateRange === 'custom' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label>Export Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Report Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
                <p className="text-sm text-gray-600">
                  Period: {overview.period}
                </p>
              </CardHeader>
              <CardContent>
                {reportType === 'overview' && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Wrench className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Total Repairs</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{overview.totalRepairs}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Revenue</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">${overview.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">New Customers</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{overview.newCustomers}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                        <span className="font-medium">Success Rate</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-600">{overview.successRate}%</p>
                    </div>
                  </div>
                )}

                {reportType === 'repairs' && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Repairs Summary ({rangeData.repairs.length} repairs)</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>Completed: {overview.completedRepairs}</div>
                      <div>Pending: {overview.pendingRepairs}</div>
                      <div>Avg Time: {overview.avgRepairTime} days</div>
                    </div>
                  </div>
                )}

                {reportType === 'customers' && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Customers Summary ({rangeData.customers.length} customers)</h4>
                    <div className="text-sm text-gray-600">
                      New customers in selected period
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Repair Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(status => {
                      const count = data.repairs.filter(r => r.status === status).length;
                      const percentage = data.repairs.length > 0 ? (count / data.repairs.length * 100).toFixed(1) : 0;
                      return (
                        <div key={status} className="flex justify-between">
                          <span className="text-sm">{status.replace('_', ' ')}</span>
                          <span className="text-sm font-medium">{count} ({percentage}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Inventory Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Parts</span>
                      <span className="text-sm font-medium">{data.parts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Low Stock</span>
                      <span className="text-sm font-medium text-orange-600">
                        {data.parts.filter(p => p.inStock <= p.minStock).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Well Stocked</span>
                      <span className="text-sm font-medium text-green-600">
                        {data.parts.filter(p => p.inStock > p.minStock * 2).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Revenue</span>
                      <span className="text-sm font-medium">${data.stats.totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Repair Time</span>
                      <span className="text-sm font-medium">{data.stats.averageRepairTime.toFixed(1)} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Customer Satisfaction</span>
                      <span className="text-sm font-medium">{data.stats.customerSatisfaction}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => exportData(exportFormat)}>
              <Download className="h-4 w-4 mr-2" />
              Export {exportFormat.toUpperCase()}
            </Button>
            <Button onClick={() => window.print()}>
              <FileText className="h-4 w-4 mr-2" />
              Print Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
