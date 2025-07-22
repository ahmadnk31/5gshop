"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
  address?: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

const ORDER_STATUS_STEPS = [
  'CREATED',
  'PAID',
  'SUCCEEDED',
  'RECEIVED',
  'IN_PROGRESS',
  'READY',
  'SHIPPED',
  'DELIVERED',
  'FINISHED',
  'FAILED',
  'REFUNDED',
  'CANCELLED',
];

function OrderStatusStepper({ status }: { status: string }) {
  const currentStep = ORDER_STATUS_STEPS.indexOf(status.toUpperCase());
  return (
    <ol className="relative border-l border-gray-200 ml-4 my-4">
      {ORDER_STATUS_STEPS.map((step, idx) => (
        <li key={step} className="mb-4 ml-6">
          <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full border-2 text-xs font-bold
            ${idx < currentStep ? 'bg-blue-500 border-blue-500 text-white' : ''}
            ${idx === currentStep ? 'bg-white border-blue-600 text-blue-600 ring-2 ring-blue-300' : ''}
            ${idx > currentStep ? 'bg-gray-200 border-gray-300 text-gray-400' : ''}
          `}>
            {idx < currentStep ? '✓' : idx + 1}
          </span>
          <span className={`text-sm font-medium ${idx === currentStep ? 'text-blue-700' : idx < currentStep ? 'text-gray-500' : 'text-gray-400'}`}>{step.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</span>
        </li>
      ))}
    </ol>
  );
}

export default function OrdersPage() {
  const t = useTranslations("orders");
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.email) return;
      
      try {
        const response = await fetch("/api/account/orders");
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchOrders();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status]);

  if (status === "loading" || loading) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow border my-8">
        <div className="text-center">{t("loading")}</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow border my-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("accessDenied")}</h1>
          <p className="text-gray-600 mb-4">{t("loginRequired")}</p>
          <Link href="/auth/login">
            <Button>{t("login")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow border my-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
          <p className="text-red-600 mb-4">{t("error")}</p>
          <Button onClick={() => window.location.reload()}>{t("tryAgain")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow border my-8">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">{t("noOrdersFound.title")}</div>
          <p className="text-sm text-gray-400">{t("noOrdersFound.description")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">
                  {t("orderNumber")} #{order.id.slice(-6)}
                </span>
                <span className="text-sm text-gray-600">
                  {t("date")}: {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-1">
                {t("total")}: <span className="font-medium">
                  {(order.amount / 100).toFixed(2)} {order.currency.toUpperCase()}
                </span>
              </div>
              <div className="mb-1">
                {t("status")}: <span className="font-medium">{order.status}</span>
              </div>
              {order.address && (
                <div className="text-sm text-gray-700 mt-2">
                  <div>
                    {t("shippingAddress")}: {order.address.name}, {order.address.line1}
                    {order.address.line2 ? `, ${order.address.line2}` : ""}, {order.address.city}, {order.address.country}
                  </div>
                  <div>{t("postalCode")}: {order.address.postalCode}</div>
                </div>
              )}
              <OrderStatusStepper status={order.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
