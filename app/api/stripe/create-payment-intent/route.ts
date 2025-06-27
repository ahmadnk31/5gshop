import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-05-28.basil",
  typescript: true});

export async function POST(req: NextRequest) {
  const { amount, currency, cart, repairType, shippingOption } = await req.json();
  // Optionally, validate cart and amount here
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
    metadata: {
      cart: JSON.stringify(cart),
      ...(repairType ? { repairType } : {}),
      ...(shippingOption ? { shippingOption } : {}),
    },
  });
  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
