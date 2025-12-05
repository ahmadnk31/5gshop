"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Contact } from "@/lib/types";
import { 
  Mail, 
  Phone, 
  Clock, 
  MessageSquare, 
  Send, 
  User,
  Calendar,
  Smartphone
} from "lucide-react";

interface ContactDetailModalProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (contactId: string, status: 'new' | 'responded' | 'resolved') => Promise<void>;
  onContactUpdate: () => Promise<void>;
}

export function ContactDetailModal({ 
  contact, 
  isOpen, 
  onClose, 
  onStatusUpdate,
  onContactUpdate 
}: ContactDetailModalProps) {
  const [response, setResponse] = useState('');
  const [adminNotes, setAdminNotes] = useState(contact.adminNotes || '');
  const [sending, setSending] = useState(false);
  const [addingNotes, setAddingNotes] = useState(false);

  const handleSendResponse = async () => {
    if (!response.trim()) return;

    setSending(true);
    try {
      const fetchResponse = await fetch(`/api/admin/contacts/${contact.id}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responseMessage: response,
          adminNotes: adminNotes,
        }),
      });

      if (!fetchResponse.ok) {
        const errorData = await fetchResponse.json();
        throw new Error(errorData.error || 'Failed to send response');
      }

      await onStatusUpdate(contact.id, 'responded');
      await onContactUpdate();
      setResponse('');
      onClose();
    } catch (error) {
      console.error('Failed to send response:', error);
      alert('Failed to send response. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleUpdateNotes = async () => {
    setAddingNotes(true);
    try {
      // We can add a separate function for updating notes without sending email
      await onContactUpdate();
    } catch (error) {
      console.error('Failed to update notes:', error);
    } finally {
      setAddingNotes(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'responded': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Contact Details</span>
          </DialogTitle>
          <DialogDescription>
            View and respond to customer inquiry
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{contact.firstName} {contact.lastName}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{contact.email}</span>
              </div>
              
              {contact.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{contact.phone}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>
                  {new Date(contact.createdAt).toLocaleDateString()} at{' '}
                  {new Date(contact.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium">Service Type:</span>
                <div className="mt-1">
                  <Badge variant="outline">{contact.serviceType}</Badge>
                </div>
              </div>
              
              {contact.device && (
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-gray-500" />
                  <span>{contact.device}</span>
                </div>
              )}
              
              <div>
                <span className="font-medium">Status:</span>
                <div className="mt-1">
                  <Badge className={getStatusColor(contact.status)}>
                    {contact.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
              
              {contact.respondedAt && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Responded: {new Date(contact.respondedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <Label className="text-base font-medium">Customer Message</Label>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
              <p className="whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <Label htmlFor="admin-notes" className="text-base font-medium">Admin Notes</Label>
            <Textarea
              id="admin-notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes about this contact..."
              rows={3}
              className="mt-2"
            />
          </div>

          {/* Status Update */}
          <div>
            <Label className="text-base font-medium">Update Status</Label>
            <Select
              value={contact.status}
              onValueChange={(value) => onStatusUpdate(contact.id, value as 'new' | 'responded' | 'resolved')}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Response */}
          <div>
            <Label htmlFor="response" className="text-base font-medium">Send Response</Label>
            <Textarea
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response to the customer..."
              rows={5}
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              This will be sent as an email to {contact.email}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={handleUpdateNotes}
                disabled={addingNotes}
              >
                {addingNotes ? 'Saving...' : 'Save Notes'}
              </Button>
              
              <Button
                onClick={handleSendResponse}
                disabled={!response.trim() || sending}
              >
                {sending ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Response
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
