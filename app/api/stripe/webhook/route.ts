export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendConfirmationEmail } from "@/lib/email/sendConfirmationEmail";
import { prisma } from "@/lib/database";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-05-28.basil",typescript: true });

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    // Extract address and email
    const shipping = paymentIntent.shipping?.address;
    const name = paymentIntent.shipping?.name || "";
    const email = paymentIntent.receipt_email || paymentIntent.shipping?.name || "";
    const cart = paymentIntent.metadata?.cart || "[]";
    const userId = paymentIntent.metadata?.userId || null;
    const repairType = paymentIntent.metadata?.repairType || null;
    const shippingOption = paymentIntent.metadata?.shippingOption || null;
    // Save address
    let addressId: string | null = null;
    if (shipping) {
      const address = await prisma.orderAddress.create({
        data: {
          name,
          line1: shipping.line1 || "",
          line2: shipping.line2 || undefined,
          city: shipping.city || "",
          state: shipping.state || undefined,
          postalCode: shipping.postal_code || "",
          country: shipping.country || "",
        },
      });
      addressId = address.id;
    }
    // Save order
    await prisma.order.create({
      data: {
        stripeId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        email,
        cart,
        addressId: addressId || undefined,
        userId: userId || undefined,
        repairType: repairType || undefined,
        shippingOption: shippingOption || undefined,
      },
    });
    // Send confirmation email
    if (email) {
      await sendConfirmationEmail({
        to: email,
        subject: "Order Confirmation",
        html: `<h1>Thank you for your order!</h1><p>Your payment was successful. We will ship your items soon.</p>`
      });
    }
  }

  return new NextResponse("ok");
}
