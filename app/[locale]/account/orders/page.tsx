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
    <ol className="relative border-l border-green-200 ml-4 my-4">
      {ORDER_STATUS_STEPS.map((step, idx) => (
        <li key={step} className="mb-4 ml-6">
          <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full border-2 text-xs font-bold
            ${idx < currentStep ? 'bg-green-600 border-green-600 text-white' : ''}
            ${idx === currentStep ? 'bg-white border-green-600 text-green-600 ring-2 ring-green-300' : ''}
            ${idx > currentStep ? 'bg-gray-200 border-gray-300 text-gray-400' : ''}
          `}>
            {idx < currentStep ? '✓' : idx + 1}
          </span>
          <span className={`text-sm font-medium ${idx === currentStep ? 'text-green-700' : idx < currentStep ? 'text-gray-500' : 'text-gray-400'}`}>{step.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</span>
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

  // Redirect to verification page if email is not verified
  useEffect(() => {
    if (status === "authenticated" && session?.user && !session.user.emailVerified) {
      window.location.href = "/auth/verify-required";
    }
  }, [status, session]);

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
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-green-100 my-8">
        <div className="text-center text-green-700">{t("loading")}</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-green-100 my-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-700 mb-4">{t("accessDenied")}</h1>
          <p className="text-gray-600 mb-4">{t("loginRequired")}</p>
          <Link href="/auth/login">
            <Button className="bg-green-600 hover:bg-green-700 text-white">{t("login")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show loading while checking verification status
  if (status === "authenticated" && session?.user && !session.user.emailVerified) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-green-100 my-8">
        <div className="text-center">Redirecting...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-green-100 my-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-700 mb-4">{t("title")}</h1>
          <p className="text-red-600 mb-4">{t("error")}</p>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => window.location.reload()}>{t("tryAgain")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-green-100 my-8">
      <h1 className="text-2xl font-bold text-green-700 mb-6">{t("title")}</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">{t("noOrdersFound.title")}</div>
          <p className="text-sm text-gray-400">{t("noOrdersFound.description")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-green-100 rounded-lg p-4 hover:shadow-md hover:border-green-300 transition-all">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-green-700">
                  {t("orderNumber")} #{order.id.slice(-6)}
                </span>
                <span className="text-sm text-gray-600">
                  {t("date")}: {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-1">
                {t("total")}: <span className="font-medium text-green-600">
                  {(order.amount / 100).toFixed(2)} {order.currency.toUpperCase()}
                </span>
              </div>
              <div className="mb-1">
                {t("status")}: <span className="font-medium text-green-600">{order.status}</span>
              </div>
              {order.address && (
                <div className="text-sm text-gray-700 mt-2 bg-green-50 p-3 rounded-lg">
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
