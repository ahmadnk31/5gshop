"use client";

import { useState, useEffect, useRef } from "react";
import { PaymentElement, AddressElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-context";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

// Dynamically import LeafletMap to avoid SSR issues
const LeafletMap = dynamic(() => import("./leaflet-map").then(mod => ({ default: mod.LeafletMap })), {
  ssr: false,
  loading: () => <div className="h-64 w-full rounded-lg bg-gray-200 animate-pulse flex items-center justify-center">Loading map...</div>
});

// Helper to check if any cart items are parts (not accessories)
function isPartsCart(cart: any[]): boolean {
  if (!cart.length) return false;
  // Return true if ANY item is a part (type === 'part')
  return cart.some(item => item.type === 'part');
}

export function CheckoutForm({ clientSecret, setCheckoutMeta }: { clientSecret: string, setCheckoutMeta?: (meta: { repairType?: string, shippingOption?: string }) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, getTotal } = useCart();
  const { data: session } = useSession();
  const t = useTranslations('checkout');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<"address" | "payment" | "result">("address");
  // For substeps in address (repairType/shippingOption)
  const [addressSubStep, setAddressSubStep] = useState<"repair" | "shipping" | null>(null);
  // New state for repair type and shipping option
  const [repairType, setRepairType] = useState<'self' | 'by_us' | null>(null);
  const [shippingOption, setShippingOption] = useState<'at_shop' | 'send' | null>(null);
  const addressRef = useRef<any>(null);
  const [addressData, setAddressData] = useState<any>(null);

  // Auto-populate address data from user session
  const getUserAddressData = () => {
    if (!session?.user) return null;
    
    const user = session.user as any;
    if (!user.firstName && !user.lastName && !user.address1) return null;

    return {
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      address: {
        line1: user.address1 || '',
        line2: user.address2 || '',
        city: user.city || '',
        state: user.state || '',
        postal_code: user.postalCode || '',
        country: user.country || '',
      },
      phone: user.phone || '',
    };
  };

  const userAddressData = getUserAddressData();

  // Listen for address completion from AddressElement
  const handleAddressChange = (event: any) => {
    if (event.complete && event.value) {
      setAddressData(event.value.address);
    }
  };

  const handleAddressComplete = async () => {
    // If parts cart, require repairType
    if (isPartsCart(cart) && !repairType) {
      setError('Please select who will perform the repair.');
      return;
    }
    // If repair by us, require shipping option
    if (isPartsCart(cart) && repairType === 'by_us' && !shippingOption) {
      setError('Please select a shipping option.');
      return;
    }
    if (!addressData) {
      setError('Please complete your address.');
      return;
    }
    setError(null);
    // Create PaymentIntent with email and address
    const response = await fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: getTotal() * 100,
        currency: "eur",
        cart,
        repairType,
        shippingOption,
        email: session?.user?.email,
        address: addressData,
      }),
    });
    const data = await response.json();
    if (data.clientSecret && setCheckoutMeta) {
      setCheckoutMeta({
        ...(isPartsCart(cart) ? { repairType: repairType ?? undefined } : {}),
        ...(isPartsCart(cart) && repairType === 'by_us' ? { shippingOption: shippingOption ?? undefined } : {}),
      });
    }
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
          {userAddressData && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center text-blue-800">
                <span className="text-sm font-medium">
                  {t('addressForm.autoFilled', { defaultValue: 'Address auto-filled from your profile' })}
                </span>
              </div>
            </div>
          )}
          <AddressElement 
            options={{ 
              mode: "shipping",
              defaultValues: userAddressData || undefined
            }} 
            onChange={handleAddressChange}
          />
          {/* Parts-specific repair type selection with stepper */}
          {isPartsCart(cart) && (
            <div className="mt-6 space-y-4">
              {(!addressSubStep || addressSubStep === "repair") && (
                <>
                  <div className="font-semibold mb-2">{t('repair.whoWillPerform')}</div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="repairType"
                        value="self"
                        checked={repairType === 'self'}
                        onChange={() => { setRepairType('self'); setShippingOption(null); }}
                      />
                      {t('repair.self')}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="repairType"
                        value="by_us"
                        checked={repairType === 'by_us'}
                        onChange={() => setRepairType('by_us')}
                      />
                      {t('repair.byUs')}
                    </label>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button type="button" className="flex-1" onClick={() => setStep("payment")}>Skip</Button>
                    <Button type="button" className="flex-1" onClick={() => {
                      if (!repairType) { setError(t('repair.errorSelectRepairType')); return; }
                      setError(null);
                      if (repairType === 'by_us') setAddressSubStep('shipping');
                      else setStep('payment');
                    }}>Next</Button>
                  </div>
                </>
              )}
              {addressSubStep === "shipping" && repairType === 'by_us' && (
                <>
                  <div className="font-semibold mb-2">{t('repair.howToGetDevice')}</div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shippingOption"
                        value="at_shop"
                        checked={shippingOption === 'at_shop'}
                        onChange={() => setShippingOption('at_shop')}
                      />
                      {t('repair.atShop')}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shippingOption"
                        value="send"
                        checked={shippingOption === 'send'}
                        onChange={() => setShippingOption('send')}
                      />
                      {t('repair.send')}
                    </label>
                  </div>
                  {/* Show something for each shipping option */}
                  {shippingOption === 'at_shop' && (
                    <div className="mt-4"><LeafletMap /></div>
                  )}
                  {shippingOption === 'send' && (
                    <div className="mt-4 text-blue-700 font-semibold">
                      {t('repair.sendDesc')}</div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button type="button" className="flex-1" onClick={() => setAddressSubStep('repair')}>
                      {t('back')}
                    </Button>
                    <Button type="button" className="flex-1" onClick={() => {
                      if (!shippingOption) { setError(t('repair.errorSelectShippingOption')); return; }
                      setError(null);
                      setStep('payment');
                    }}>{t('next')}</Button>
                  </div>
                </>
              )}
            </div>
          )}
          {error && <div className="text-red-600 text-base mt-2">{error}</div>}
          {/* If not parts cart, just continue */}
          {!isPartsCart(cart) && (
            <Button className="w-full mt-8 py-3 text-lg" onClick={() => setStep('payment')} type="button">
              {t('continue')}
            </Button>
          )}
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