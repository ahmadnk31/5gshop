"use client"
import { useEffect, useState } from "react";

export function OrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editOrder, setEditOrder] = useState<any | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/admin/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Filtering
  const filteredOrders = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!orders.length) return <div>No orders found.</div>;

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
    </div>
  );
}
