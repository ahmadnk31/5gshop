"use client";

import { useState } from "react";
import { PaymentElement, AddressElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-context";
import { useTranslations } from "next-intl";

export function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, getTotal } = useCart();
  const t = useTranslations('checkout');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<"address" | "payment" | "result">("address");

  const handleAddressComplete = () => {
    setStep("payment");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });
    setLoading(false);
    setStep("result");
    if (error) {
      setError(error.message || t('error.paymentFailed'));
      setSuccess(false);
    } else {
      setSuccess(true);
    }
  };

  // Stepper UI
  const steps = [t('stepper.address'), t('stepper.payment'), t('stepper.result')];
  const currentStep = step === "address" ? 0 : step === "payment" ? 1 : 2;

  return (
    <div className="max-w-2xl w-full mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      {/* Stepper */}
      <div className="flex justify-between mb-10">
        {steps.map((label, idx) => (
          <div key={label} className="flex-1 flex flex-col items-center">
            <div className={`rounded-full w-10 h-10 flex items-center justify-center mb-1 text-white text-lg font-bold ${idx <= currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}>{idx + 1}</div>
            <span className={`text-sm ${idx === currentStep ? 'font-bold text-blue-700' : 'text-gray-500'}`}>{label}</span>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">{t('cart.title')}</h2>
        <ul className="divide-y divide-gray-200 mb-2">
          {cart.map(item => (
            <li key={item.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded border" />}
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-gray-500">x{item.quantity}</span>
              </div>
              <span className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>{t('cart.total')}</span>
          <span>€{getTotal().toFixed(2)}</span>
        </div>
      </div>

      {/* Step Content */}
      {step === "address" && (
        <div>
          <AddressElement options={{ mode: "shipping" }} onBlur={handleAddressComplete} />
          <Button className="w-full mt-8 py-3 text-lg" onClick={handleAddressComplete} type="button">
            {t('continue')}
          </Button>
        </div>
      )}
      {step === "payment" && (
        <form onSubmit={handleSubmit} className="space-y-8">
          <PaymentElement />
          {error && <div className="text-red-600 text-base mt-2">{error}</div>}
          <Button type="submit" disabled={!stripe || loading} className="w-full py-3 text-lg mt-4">
            {loading ? t('paying') : t('pay')}
          </Button>
        </form>
      )}
      {step === "result" && (
        <div className="text-center py-16">
          {success ? (
            <>
              <h2 className="text-3xl font-bold mb-4 text-green-700">{t('success.title')}</h2>
              <p className="text-lg">{t('success.message')}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4 text-red-600">{t('error.title')}</h2>
              <p className="text-lg">{error || t('error.message')}</p>
              <Button className="mt-8 py-3 text-lg" onClick={() => setStep("payment")}>{t('back')}</Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
