"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuoteDetailModal } from "@/components/admin/quote-detail-modal";
import { getQuotes, updateQuoteStatus, deleteQuote } from "@/app/actions/quote-actions";
import { Quote } from "@/lib/types";
import { 
  DollarSign, 
  Phone, 
  Search, 
  Eye, 
  Trash2, 
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Smartphone,
  Calendar,
  User
} from "lucide-react";

interface QuoteStats {
  total: number;
  pending: number;
  responded: number;
  approved: number;
  rejected: number;
}

export function QuotesList() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState<QuoteStats>({ total: 0, pending: 0, responded: 0, approved: 0, rejected: 0 });
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const quoteData = await getQuotes();
      setQuotes(quoteData);
      updateStats(quoteData);
    } catch (error) {
      console.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (quoteData: Quote[]) => {
    const stats = {
      total: quoteData.length,
      pending: quoteData.filter(q => q.status === 'PENDING').length,
      responded: quoteData.filter(q => q.status === 'RESPONDED').length,
      approved: quoteData.filter(q => q.status === 'APPROVED').length,
      rejected: quoteData.filter(q => q.status === 'REJECTED').length,
    };
    setStats(stats);
  };

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowDetailModal(true);
  };

  const handleStatusUpdate = async (quoteId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await updateQuoteStatus(quoteId, status);
      await loadQuotes();
    } catch (error) {
      console.error('Failed to update quote status:', error);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
      try {
        console.log('Attempting to delete quote:', quoteId);
        await deleteQuote(quoteId);
        console.log('Quote deleted successfully');
        
        // Remove the quote from the local state immediately for better UX
        setQuotes(prevQuotes => prevQuotes.filter(q => q.id !== quoteId));
        
        // Update stats
        const updatedQuotes = quotes.filter(q => q.id !== quoteId);
        updateStats(updatedQuotes);
        
        // Show success message
        alert('Quote deleted successfully');
      } catch (error) {
        console.error('Failed to delete quote:', error);
        alert(`Failed to delete quote: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const filteredQuotes = quotes.filter((quote) => {
    const customerName = quote.customer ? `${quote.customer.firstName || ''} ${quote.customer.lastName || ''}`.trim() : '';
    const customerEmail = quote.customer?.email || '';
    const deviceInfo = quote.device ? `${quote.device.brand || ''} ${quote.device.model || ''}`.trim() : '';
    
    const matchesSearch = 
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deviceInfo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || quote.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'SENT': 'bg-blue-100 text-blue-800',
      'RESPONDED': 'bg-purple-100 text-purple-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'EXPIRED': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      'urgent': 'bg-red-100 text-red-800',
      'normal': 'bg-blue-100 text-blue-800',
      'flexible': 'bg-gray-100 text-gray-800'
    };
    return colors[urgency as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'SENT':
        return <MessageSquare className="h-4 w-4" />;
      case 'RESPONDED':
        return <CheckCircle className="h-4 w-4" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responded</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responded}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Quotes List */}
      <Card>
        <CardHeader>
          <CardTitle>Quote Management</CardTitle>
          <CardDescription>Manage customer quote requests and provide responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search quotes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="RESPONDED">Responded</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quotes List */}
          <div className="space-y-4">
            {filteredQuotes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No quotes found.
              </div>
            ) : (
              filteredQuotes.map((quote) => (
                <div key={quote.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">
                          {quote.customer ? `${quote.customer.firstName || ''} ${quote.customer.lastName || ''}`.trim() : 'Unknown Customer'}
                        </h3>
                        <Badge className={getStatusColor(quote.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(quote.status)}
                            <span>{quote.status}</span>
                          </div>
                        </Badge>
                        <Badge className={getUrgencyColor(quote.urgency)}>
                          {typeof quote.urgency === 'string' ? quote.urgency.toUpperCase() : 'UNKNOWN'}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{quote.customer?.email || 'No email'}</span>
                        </div>
                        {quote.customer?.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{quote.customer.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-4 w-4" />
                          <span>{quote.device ? `${quote.device.brand || ''} ${quote.device.model || ''}`.trim() : 'Unknown Device'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                        <span className="font-medium">Issues:</span> {Array.isArray(quote.issues) ? quote.issues.join(', ') : (typeof quote.issues === 'string' ? quote.issues : 'No issues specified')}
                      </p>
                      
                      {quote.description && (
                        <p className="text-sm text-gray-700 line-clamp-2">
                          <span className="font-medium">Description:</span> {quote.description}
                        </p>
                      )}
                      
                      <div className="text-xs text-gray-500 mt-2">
                        Submitted: {new Date(quote.createdAt).toLocaleDateString()} at {new Date(quote.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewQuote(quote)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Select
                        value={quote.status}
                        onValueChange={(value) => handleStatusUpdate(quote.id, value as 'APPROVED' | 'REJECTED')}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="SENT">Sent</SelectItem>
                          <SelectItem value="RESPONDED">Responded</SelectItem>
                          <SelectItem value="APPROVED">Approved</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                          <SelectItem value="EXPIRED">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteQuote(quote.id)}
                        className="hover:bg-red-700"
                        title="Delete quote"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete quote</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <QuoteDetailModal
          quote={selectedQuote}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedQuote(null);
          }}
          onStatusUpdate={handleStatusUpdate}
          onQuoteUpdate={loadQuotes}
        />
      )}
    </div>
  );
}
