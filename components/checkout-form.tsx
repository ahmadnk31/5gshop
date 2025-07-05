"use client";

import { useState, useEffect, useRef } from "react";
import { PaymentElement, AddressElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-context";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { loadStripe } from "@stripe/stripe-js";
import { MapPin, CreditCard, CheckCircle, ArrowRight } from "lucide-react";

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

// Add prop types for CheckoutPaymentForm
interface CheckoutPaymentFormProps {
  clientSecret: string;
  onResult: (success: boolean, errorMsg?: string) => void;
  t: (key: string, params?: any) => string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function CheckoutPaymentForm({ clientSecret, onResult, t, loading, setLoading }: CheckoutPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    if (error) {
      setError(error.message || t('error.paymentFailed'));
      setSuccess(false);
      if (onResult) onResult(false, error.message || t('error.paymentFailed'));
    } else {
      setSuccess(true);
      if (onResult) onResult(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 text-lg font-semibold"
        size="lg"
      >
        {loading ? t('processing') : t('pay')}
      </Button>
      {error && <div className="text-red-600 text-base mt-2">{error}</div>}
    </form>
  );
}

interface CheckoutFormProps {
  clientSecret: string;
  setCheckoutMeta?: (meta: { repairType?: string; shippingOption?: string }) => void;
  onPaymentSuccess?: () => void;
}

export function CheckoutForm({ clientSecret, setCheckoutMeta, onPaymentSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, getTotal, getBuyNowTotal, buyNowCart, clearCart } = useCart();
  const { data: session } = useSession();
  const t = useTranslations('checkout');
  const [step, setStep] = useState<"address" | "payment" | "result">("address");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [addressSubStep, setAddressSubStep] = useState<"repair" | "shipping" | null>(null);
  const [repairType, setRepairType] = useState<'self' | 'by_us' | null>(null);
  const [shippingOption, setShippingOption] = useState<'at_shop' | 'send' | 'receive' | null>(null);
  const addressRef = useRef<any>(null);
  const [addressData, setAddressData] = useState<any>(null);
  const [elementsInstance, setElementsInstance] = useState<any>(null);

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

  const getName = () => {
    // Try to get name from session, addressData, or fallback
    if (session?.user?.name) return session.user.name;
    if (addressData?.name) return addressData.name;
    if (addressData?.firstName || addressData?.lastName) return `${addressData.firstName || ''} ${addressData.lastName || ''}`.trim();
    return '';
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
    setLoading(true);
    // Create PaymentIntent with email and address
    const response = await fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: (buyNowCart ? getBuyNowTotal() : getTotal()) * 100,
        currency: "eur",
        cart,
        repairType,
        shippingOption: shippingOption || 'at_shop',
        email: session?.user?.email,
        userId: session?.user?.id,
        address: {
          ...addressData,
          name: getName(),
        },
      }),
    });
    const data = await response.json();
    setLoading(false);
    if (data.clientSecret) {
      setOrderId(data.orderId);
      if (setCheckoutMeta) {
        setCheckoutMeta({
          ...(isPartsCart(cart) ? { repairType: repairType ?? undefined } : {}),
          ...(isPartsCart(cart) && repairType === 'by_us' ? { shippingOption: shippingOption ?? undefined } : {}),
        });
      }
      setStep("payment");
    } else {
      setError('Failed to create payment intent.');
    }
  };

  // Stepper UI
  const steps = [
    { label: t('stepper.address'), icon: MapPin, step: "address" },
    { label: t('stepper.payment'), icon: CreditCard, step: "payment" },
    { label: t('stepper.result'), icon: CheckCircle, step: "result" }
  ];
  const currentStep = step === "address" ? 0 : step === "payment" ? 1 : 2;

  const handleStepClick = (stepIndex: number, stepName: string) => {
    // Only allow navigation to completed steps or current step
    if (stepIndex <= currentStep) {
      if (stepName === "address") {
        setStep("address");
      } else if (stepName === "payment" && clientSecret) {
        setStep("payment");
      }
    }
  };

  // Trigger payment success callback when step changes to result
  useEffect(() => {
    if (step === "result" && onPaymentSuccess) {
      onPaymentSuccess();
    }
  }, [step, onPaymentSuccess]);

  return (
    <div className="max-w-2xl w-full mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative overflow-hidden">
      {/* Watermark */}
      <img
        src="/logo.svg"
        alt="Watermark Logo"
        className="pointer-events-none select-none opacity-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 max-w-xs z-0"
        aria-hidden="true"
      />
      {/* Stepper */}
      <div className="flex justify-between mb-10 relative">
        {/* Background connector line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300 z-0" />
        
        {steps.map((stepItem, idx) => {
          const Icon = stepItem.icon;
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isClickable = idx <= currentStep && (stepItem.step !== "payment" || clientSecret);
          
          return (
            <div key={stepItem.label} className="flex-1 flex flex-col items-center relative z-10">
              {/* Progress line overlay for completed steps */}
              {idx < steps.length - 1 && isCompleted && (
                <div className="absolute top-5 left-1/2 w-full h-0.5 bg-blue-600 z-5" />
              )}
              
              <button
                type="button"
                onClick={() => handleStepClick(idx, stepItem.step)}
                disabled={!isClickable}
                className={`group flex flex-col items-center transition-all duration-200 ${
                  isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'
                }`}
              >
                <div className={`rounded-full w-10 h-10 flex items-center justify-center mb-2 text-white text-lg font-bold transition-all duration-200 relative z-10 ${
                  isCompleted 
                    ? 'bg-green-600 shadow-lg' 
                    : isCurrent 
                    ? 'bg-blue-600 shadow-lg' 
                    : 'bg-gray-300'
                } ${isClickable && !isCurrent ? 'group-hover:bg-blue-500' : ''}`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`text-sm text-center transition-colors duration-200 ${
                  isCurrent 
                    ? 'font-bold text-blue-700' 
                    : isCompleted 
                    ? 'font-medium text-green-700' 
                    : 'text-gray-500'
                } ${isClickable && !isCurrent ? 'group-hover:text-blue-600' : ''}`}>
                  {stepItem.label}
                </span>
              </button>
            </div>
          );
        })}
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
          <span>€{(buyNowCart ? getBuyNowTotal() : getTotal()).toFixed(2)}</span>
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
                    <Button type="button" className="flex-1" onClick={handleAddressComplete}>Skip</Button>
                    <Button type="button" className="flex-1" onClick={() => {
                      if (!repairType) { setError(t('repair.errorSelectRepairType')); return; }
                      setError(null);
                      if (repairType === 'by_us') setAddressSubStep('shipping');
                      else handleAddressComplete();
                    }}>Next</Button>
                  </div>
                </>
              )}
              {addressSubStep === "shipping" && repairType === 'by_us' && (
                <>
                  <div className="font-semibold mb-2">{t('repair.howToGetDevice')}</div>
                  <div className="space-y-3">
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
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shippingOption"
                        value="receive"
                        checked={shippingOption === 'receive'}
                        onChange={() => setShippingOption('receive')}
                      />
                      {t('repair.receive')}
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
                  {shippingOption === 'receive' && (
                    <div className="mt-4 text-green-700 font-semibold">
                      {t('repair.receiveDesc')}</div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button type="button" className="flex-1" onClick={() => setAddressSubStep('repair')}>
                      {t('back')}
                    </Button>
                    <Button type="button" className="flex-1" onClick={() => {
                      if (!shippingOption) { setError(t('repair.errorSelectShippingOption')); return; }
                      setError(null);
                      handleAddressComplete();
                    }}>{t('next')}</Button>
                  </div>
                </>
              )}
            </div>
          )}
          {error && <div className="text-red-600 text-base mt-2">{error}</div>}
          {/* If not parts cart, just continue */}
          {!isPartsCart(cart) && (
            <Button onClick={handleAddressComplete} disabled={loading}>
              {loading ? t('loading') : t('continueToPayment')}
            </Button>
          )}
        </div>
      )}
      {step === "payment" && clientSecret && (
        <Elements stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)} options={{ clientSecret }}>
          <CheckoutPaymentForm
            clientSecret={clientSecret}
            t={t}
            loading={loading}
            setLoading={setLoading}
            onResult={(success, errorMsg) => {
              setPaymentSuccess(success);
              setStep("result");
              if (errorMsg) setError(errorMsg);
            }}
          />
        </Elements>
      )}
      {step === "result" && (
        <div className="text-center py-16">
          {paymentSuccess ? (
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