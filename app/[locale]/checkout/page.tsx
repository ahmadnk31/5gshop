"use client";

import { useCart } from "@/components/cart-context";
import { CheckoutForm } from "@/components/checkout-form";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { cart, getTotal } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function createPaymentIntent() {
      setLoading(true);
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(getTotal() * 100), // in cents
          currency: "eur",
          cart,
        }),
      });
      const data = await res.json();
      setClientSecret(data.clientSecret);
      setLoading(false);
    }
    if (cart.length > 0) createPaymentIntent();
  }, [cart, getTotal]);

  if (cart.length === 0) {
    return <div className="text-center py-12">Your cart is empty.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      {loading && <div>Loading payment form...</div>}
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
}
