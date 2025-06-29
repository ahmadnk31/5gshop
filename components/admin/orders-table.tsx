"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Paperclip, 
  X, 
  Send, 
  Truck,
  FileText
} from "lucide-react";

interface Attachment {
  filename: string;
  content: string;
  contentType: string;
}

export function OrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editOrder, setEditOrder] = useState<any | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editLoading, setEditLoading] = useState(false);
  const [shippingLabelOrder, setShippingLabelOrder] = useState<any | null>(null);
  const [labelAttachment, setLabelAttachment] = useState<Attachment | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [message, setMessage] = useState('');
  const [sendingLabel, setSendingLabel] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch("/api/admin/orders");
        
        if (res.status === 401) {
          setError("Authentication required. Please log in.");
          return;
        }
        
        if (res.status === 403) {
          const errorData = await res.json();
          setError(`Access denied: ${errorData.error}. Your role: ${errorData.userRole || 'unknown'}`);
          return;
        }
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch orders");
        }
        
        const data = await res.json();
        setOrders(data.orders || []);
        
        console.log('Orders fetched successfully:', {
          count: data.count,
          user: data.user
        });
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleLabelFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const base64Content = content.split(',')[1]; // Remove data URL prefix
      
      const attachment: Attachment = {
        filename: file.name,
        content: base64Content,
        contentType: file.type || 'application/octet-stream'
      };
      
      setLabelAttachment(attachment);
    };
    reader.readAsDataURL(file);
  };

  const removeLabelAttachment = () => {
    setLabelAttachment(null);
  };

  const handleSendShippingLabel = async () => {
    if (!labelAttachment || !shippingLabelOrder) return;

    setSendingLabel(true);
    try {
      const response = await fetch(`/api/admin/orders/${shippingLabelOrder.id}/send-shipping-label`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          labelAttachment,
          trackingNumber,
          message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send shipping label');
      }

      // Update order status in local state
      setOrders(orders => orders.map(o => 
        o.id === shippingLabelOrder.id ? { ...o, status: 'shipped' } : o
      ));

      // Reset form
      setShippingLabelOrder(null);
      setLabelAttachment(null);
      setTrackingNumber('');
      setMessage('');
      
      alert('Shipping label sent successfully!');
    } catch (error) {
      console.error('Failed to send shipping label:', error);
      alert('Failed to send shipping label. Please try again.');
    } finally {
      setSendingLabel(false);
    }
  };

  // Check if order is eligible for shipping label
  const isEligibleForShippingLabel = (order: any) => {
    return order.repairType === 'by_us' && order.shippingOption === 'send';
  };

  // Filtering
  const filteredOrders = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

  if (loading) return <div>Loading orders...</div>;
  if (error) return (
    <div className="text-center py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="text-red-600 mb-4">
          <svg className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Orders</h3>
        <p className="text-red-700 mb-4">{error}</p>
        {error.includes('Access denied') && (
          <div className="text-sm text-red-600 bg-red-100 p-3 rounded">
            <p className="font-medium mb-1">To fix this issue:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Make sure you're logged in</li>
              <li>Contact an administrator to grant you admin access</li>
              <li>Your account needs the 'admin' role to view orders</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
  if (!orders.length) return <div className="text-center py-8 text-gray-500">No orders found.</div>;

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex items-center gap-4">
        <label className="font-medium">Filter by status:</label>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded px-2 py-1">
          <option value="all">All</option>
          <option value="created">Created</option>
          <option value="paid">Paid</option>
          <option value="ready">Ready</option>
          <option value="shipped">Shipped</option>
          <option value="finished">Finished</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2">Order ID</th>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Repair Type</th>
            <th className="px-4 py-2">Shipping Option</th>
            <th className="px-4 py-2">Created</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 font-mono">{order.id.slice(-6)}</td>
              <td className="px-4 py-2">{order.user?.email || order.email}</td>
              <td className="px-4 py-2">{(order.amount / 100).toFixed(2)} {order.currency?.toUpperCase()}</td>
              <td className="px-4 py-2">
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${order.status === 'paid' ? 'bg-green-100 text-green-700' : order.status === 'created' ? 'bg-yellow-100 text-yellow-700' : order.status === 'ready' ? 'bg-blue-100 text-blue-700' : order.status === 'shipped' ? 'bg-purple-100 text-purple-700' : order.status === 'finished' ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
              </td>
              <td className="px-4 py-2">{order.repairType || '-'}</td>
              <td className="px-4 py-2">{order.shippingOption || '-'}</td>
              <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-2 space-x-2">
                <button className="text-blue-600 hover:underline" onClick={() => setSelectedOrder(order)}>View</button>
                <button className="text-green-600 hover:underline" onClick={() => { setEditOrder(order); setEditStatus(order.status); }}>Edit</button>
                {isEligibleForShippingLabel(order) && (
                  <button 
                    className="text-purple-600 hover:underline flex items-center space-x-1"
                    onClick={() => setShippingLabelOrder(order)}
                  >
                    <Truck className="h-4 w-4" />
                    <span>Send Label</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setSelectedOrder(null)}>&times;</button>
            <h3 className="text-lg font-bold mb-2">Order #{selectedOrder.id.slice(-6)}</h3>
            <div className="mb-2 text-sm text-gray-700">Created: {new Date(selectedOrder.createdAt).toLocaleString()}</div>
            <div className="mb-2 text-sm">User: <span className="font-medium">{selectedOrder.user?.email || selectedOrder.email}</span></div>
            <div className="mb-2 text-sm">Amount: <span className="font-medium">{(selectedOrder.amount / 100).toFixed(2)} {selectedOrder.currency?.toUpperCase()}</span></div>
            <div className="mb-2 text-sm">Status: <span className="font-medium">{selectedOrder.status}</span></div>
            {selectedOrder.address && (
              <div className="mb-2 text-sm">
                <div className="font-semibold">Shipping Address:</div>
                <div>{selectedOrder.address.name}</div>
                <div>{selectedOrder.address.line1}{selectedOrder.address.line2 ? `, ${selectedOrder.address.line2}` : ""}</div>
                <div>{selectedOrder.address.city}, {selectedOrder.address.country} {selectedOrder.address.postalCode}</div>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {editOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setEditOrder(null)}>&times;</button>
            <h3 className="text-lg font-bold mb-2">Edit Order #{editOrder.id.slice(-6)}</h3>
            <div className="mb-4">
              <label className="block font-medium mb-1">Status</label>
              <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="border rounded px-2 py-1 w-full">
                <option value="created">Created</option>
                <option value="paid">Paid</option>
                <option value="ready">Ready</option>
                <option value="shipped">Shipped</option>
                <option value="finished">Finished</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setEditOrder(null)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={editLoading} onClick={async () => {
                setEditLoading(true);
                const res = await fetch(`/api/admin/orders/${editOrder.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: editStatus }),
                });
                setEditLoading(false);
                if (res.ok) {
                  setOrders(orders => orders.map(o => o.id === editOrder.id ? { ...o, status: editStatus } : o));
                  setEditOrder(null);
                } else {
                  alert('Failed to update order');
                }
              }}>Save</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Shipping Label Modal */}
      {shippingLabelOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" 
              onClick={() => setShippingLabelOrder(null)}
            >
              &times;
            </button>
            
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Send Shipping Label - Order #{shippingLabelOrder.id.slice(-6)}
            </h3>
            
            <div className="space-y-4">
              {/* Order Info */}
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm">
                  <strong>Customer:</strong> {shippingLabelOrder.user?.email || shippingLabelOrder.email}
                </p>
                <p className="text-sm">
                  <strong>Amount:</strong> {(shippingLabelOrder.amount / 100).toFixed(2)} {shippingLabelOrder.currency?.toUpperCase()}
                </p>
                {shippingLabelOrder.address && (
                  <div className="text-sm mt-2">
                    <strong>Shipping Address:</strong>
                    <div className="mt-1">
                      {shippingLabelOrder.address.name}<br />
                      {shippingLabelOrder.address.line1}{shippingLabelOrder.address.line2 ? `, ${shippingLabelOrder.address.line2}` : ""}<br />
                      {shippingLabelOrder.address.city}, {shippingLabelOrder.address.country} {shippingLabelOrder.address.postalCode}
                    </div>
                  </div>
                )}
              </div>

              {/* Label Attachment */}
              <div className="space-y-2">
                <Label htmlFor="label-file">Shipping Label File *</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('label-file-upload')?.click()}
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      Upload Label
                    </Button>
                    <input
                      id="label-file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleLabelFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <span className="text-sm text-gray-500">
                      PDF or Image files
                    </span>
                  </div>
                  
                  {labelAttachment && (
                    <div className="flex items-center justify-between bg-green-50 p-2 rounded border border-green-200">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{labelAttachment.filename}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeLabelAttachment}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tracking Number */}
              <div className="space-y-2">
                <Label htmlFor="tracking-number">Tracking Number (Optional)</Label>
                <Input
                  id="tracking-number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                />
              </div>

              {/* Additional Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Additional Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add any additional information for the customer..."
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShippingLabelOrder(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendShippingLabel}
                  disabled={!labelAttachment || sendingLabel}
                >
                  {sendingLabel ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Label
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
