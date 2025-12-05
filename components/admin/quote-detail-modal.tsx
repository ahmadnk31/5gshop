"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateQuoteNotes } from "@/app/actions/quote-actions";
import { Quote } from "@/lib/types";
import { 
  DollarSign, 
  Phone, 
  Clock, 
  MessageSquare, 
  Send, 
  User,
  Calendar,
  Smartphone,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Save,
  Paperclip,
  X
} from "lucide-react";

interface QuoteDetailModalProps {
  quote: Quote;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (quoteId: string, status: 'APPROVED' | 'REJECTED') => Promise<void>;
  onQuoteUpdate: () => Promise<void>;
}

interface Attachment {
  filename: string;
  content: string;
  contentType: string;
}

export function QuoteDetailModal({ 
  quote, 
  isOpen, 
  onClose, 
  onStatusUpdate,
  onQuoteUpdate 
}: QuoteDetailModalProps) {
  const [response, setResponse] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(quote.estimatedCost?.toString() || '');
  const [estimatedTime, setEstimatedTime] = useState(quote.estimatedTime || '');
  const [adminNotes, setAdminNotes] = useState(quote.adminNotes || '');
  const [sending, setSending] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const base64Content = content.split(',')[1]; // Remove data URL prefix
        
        const attachment: Attachment = {
          filename: file.name,
          content: base64Content,
          contentType: file.type || 'application/octet-stream'
        };
        
        setAttachments(prev => [...prev, attachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendQuoteResponse = async () => {
    if (!response.trim()) return;

    setSending(true);
    try {
      const fetchResponse = await fetch(`/api/admin/quotes/${quote.id}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responseMessage: response,
          estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
          estimatedTime,
          attachments: attachments.length > 0 ? attachments : undefined
        }),
      });

      if (!fetchResponse.ok) {
        const error = await fetchResponse.json();
        throw new Error(error.error || 'Failed to send quote response');
      }

      await onQuoteUpdate();
      setResponse('');
      setAttachments([]);
      onClose();
    } catch (error) {
      console.error('Failed to send quote response:', error);
      alert('Failed to send quote response. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleApprove = async () => {
    await onStatusUpdate(quote.id, 'APPROVED');
    onClose();
  };

  const handleReject = async () => {
    await onStatusUpdate(quote.id, 'REJECTED');
    onClose();
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await updateQuoteNotes(quote.id, adminNotes);
      await onQuoteUpdate();
      console.log('Admin notes saved successfully');
    } catch (error) {
      console.error('Failed to save admin notes:', error);
      alert('Failed to save admin notes. Please try again.');
    } finally {
      setSavingNotes(false);
    }
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[50vw]  max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Quote Details</span>
          </DialogTitle>
          <DialogDescription>
            Respond to quote request and provide pricing information
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Quote Information */}
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                {quote.customer ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Name:</span>
                      <span>{quote.customer.firstName} {quote.customer.lastName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Email:</span>
                      <span>{quote.customer.email}</span>
                    </div>
                    {quote.customer.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{quote.customer.phone}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-500 italic">No customer information available</div>
                )}
              </div>
            </div>

            {/* Device Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <Smartphone className="h-5 w-5 mr-2" />
                Device Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                {quote.device ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Device:</span>
                      <span>{quote.device.brand} {quote.device.model}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Type:</span>
                      <span className="capitalize">{quote.device.type.toLowerCase().replace('_', ' ')}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 italic">No device information available</div>
                )}
              </div>
            </div>

            {/* Quote Details */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Quote Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Status:</span>
                  <Badge className={getStatusColor(quote.status)}>
                    {quote.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Urgency:</span>
                  <Badge className={getUrgencyColor(quote.urgency)}>
                    {typeof quote.urgency === 'string' ? quote.urgency.toUpperCase() : 'UNKNOWN'}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Submitted:</span>
                  <span>{new Date(quote.createdAt).toLocaleDateString()} at {new Date(quote.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Expires:</span>
                  <span>{new Date(quote.expiresAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Existing Admin Notes Display */}
            {quote.adminNotes && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Current Admin Notes
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <p className="text-gray-700 whitespace-pre-wrap">{quote.adminNotes}</p>
                </div>
              </div>
            )}

            {/* Photos */}
            {quote.photos && quote.photos.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center">
                  <Paperclip className="h-5 w-5 mr-2" />
                  Customer Photos ({quote.photos.length})
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {quote.photos.map((photo: { url: string; key: string }, index: number) => (
                      <div key={index} className="relative group">
                        <a
                          href={photo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={photo.url}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded border border-gray-200 hover:border-green-500 transition-colors cursor-pointer"
                          />
                        </a>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 text-sm">Click to view</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Issues */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Reported Issues</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  {Array.isArray(quote.issues) ? quote.issues.map((issue, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <span>{issue}</span>
                    </div>
                  )) : (typeof quote.issues === 'string' ? (
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <span>{quote.issues}</span>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">No issues specified</div>
                  ))}
                </div>
                {quote.description && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="font-medium">Additional Description:</span>
                    <p className="mt-1 text-gray-700">{quote.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Response Form */}
          <div className="space-y-4">
            {/* Current Estimates */}
            {(quote.estimatedCost || quote.estimatedTime) && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Current Estimates</h3>
                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  {quote.estimatedCost && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">Cost:</span>
                      <span>€{quote.estimatedCost.toFixed(2)}</span>
                    </div>
                  )}
                  {quote.estimatedTime && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Time:</span>
                      <span>{quote.estimatedTime}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pricing Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Pricing Information</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="estimatedCost">Estimated Cost (€)</Label>
                  <Input
                    id="estimatedCost"
                    type="number"
                    step="0.01"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    placeholder="Enter estimated cost"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedTime">Estimated Time</Label>
                  <Input
                    id="estimatedTime"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    placeholder="e.g., 2-3 business days"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="adminNotes">Internal Notes</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </Button>
              </div>
              <Textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal notes (not sent to customer)"
                rows={3}
              />
              <p className="text-sm text-gray-500">
                These notes are for internal use only and will not be sent to the customer.
              </p>
            </div>

            {/* Response Message */}
            <div className="space-y-3">
              <Label htmlFor="response">Response to Customer</Label>
              <Textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Write your response to the customer..."
                rows={6}
              />
              <p className="text-sm text-gray-500">
                This will be sent as an email to {quote.customer?.email || 'customer email'}
              </p>
            </div>

            {/* Attachments */}
            <div className="space-y-3">
              <Label htmlFor="attachments">Attachments</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Add Attachment
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  />
                  <span className="text-sm text-gray-500">
                    PDF, DOC, Images (max 10MB each)
                  </span>
                </div>
                
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Attachments ({attachments.length}):</p>
                    {attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center space-x-2">
                          <Paperclip className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{attachment.filename}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Attachments will be included in the email sent to the customer.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleApprove}
                  className="flex-1"
                  disabled={quote.status === 'APPROVED'}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReject}
                  className="flex-1"
                  disabled={quote.status === 'REJECTED'}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          <Button
            onClick={handleSendQuoteResponse}
            disabled={!response.trim() || sending}
          >
            {sending ? (
              'Sending...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Quote Response
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
