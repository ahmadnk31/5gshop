import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-05-28.basil",
  typescript: true});

export async function POST(req: NextRequest) {
  const { amount, currency, cart, repairType, shippingOption, email, address, userId } = await req.json();
  
  // Create a simplified cart summary for metadata (now including image)
  const cartSummary = cart.map((item: any) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    type: item.type,
    image: item.image,
    shippingOption
  }));
  
  // Optionally, validate cart and amount here
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
    receipt_email: email,
    metadata: {
      cart: JSON.stringify(cartSummary),
      cartItemCount: cart.length.toString(),
      totalAmount: amount.toString(),
      ...(repairType ? { repairType } : {}),
      ...(shippingOption ? { shippingOption } : {

      }),
      ...(address ? { address: JSON.stringify(address) } : {}),
      ...(userId ? { userId } : {}),
    },
  });
  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
