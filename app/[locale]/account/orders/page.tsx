import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/database";
import { notFound } from "next/navigation";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return notFound();

  // Fetch orders for the logged-in user
  const orders = await prisma.order.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
    include: { address: true },
  });

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow border mt-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-gray-500">No orders found.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Order #{order.id.slice(-6)}</span>
                <span className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mb-1">Amount: <span className="font-medium">{(order.amount / 100).toFixed(2)} {order.currency.toUpperCase()}</span></div>
              <div className="mb-1">Status: <span className="font-medium">{order.status}</span></div>
              {order.address && (
                <div className="text-sm text-gray-700 mt-2">
                  <div>Shipping to: {order.address.name}, {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}, {order.address.city}, {order.address.country}</div>
                  <div>Postal Code: {order.address.postalCode}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
