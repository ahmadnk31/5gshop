"use client";

import { useCart } from "@/components/cart-context";
import { CheckoutForm } from "@/components/checkout-form";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { cart, getTotal } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  // Forwards repairType and shippingOption from CheckoutForm
  const [checkoutMeta, setCheckoutMeta] = useState<{ repairType?: string; shippingOption?: string }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const [stripeError, setStripeError] = useState<string | null>(null);

  useEffect(() => {
    async function createPaymentIntent() {
      setLoading(true);
      setStripeError(null);
      try {
        const res = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(getTotal() * 100), // in cents
            currency: "eur",
            cart,
            ...checkoutMeta,
          }),
        });
        const data = await res.json();
        
        if (!res.ok || data.error) {
          setStripeError(data.error || 'Payment service is currently unavailable');
          setLoading(false);
          return;
        }
        
        setClientSecret(data.clientSecret);
        setLoading(false);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setStripeError('Failed to initialize payment. Please try again.');
        setLoading(false);
      }
    }
    if (cart.length > 0) createPaymentIntent();
  }, [cart, getTotal, checkoutMeta]);

  // Show loading state until component is mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12">
        <div className="text-center py-12">Your cart is empty.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16']}
          gravity={0.3}
          wind={0.05}
        />
      )}
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      {stripeError && (
        <div className="max-w-md w-full bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Payment Service Unavailable</h3>
              <p className="mt-2 text-sm text-red-700">{stripeError}</p>
              <p className="mt-2 text-sm text-red-700">
                Please contact us directly to complete your order: <br />
                <a href="tel:+32466134181" title="Call 5GPhones Fix for order assistance" className="font-semibold underline">+32 (466) 13 41 81</a>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {loading && !stripeError && <div>Loading payment form...</div>}
      {clientSecret && !stripeError && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm 
            clientSecret={clientSecret} 
            setCheckoutMeta={setCheckoutMeta}
            onPaymentSuccess={() => setShowConfetti(true)}
          />
        </Elements>
      )}
    </div>
  );
}
