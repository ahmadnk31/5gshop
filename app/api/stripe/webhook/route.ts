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
  // Add basic logging for webhook receipt
  console.log("Stripe webhook received");
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  // For security, do not log the full raw body, but log the event type after parsing
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
    console.log('paymentIntent.shipping:', paymentIntent.shipping);
    console.log('paymentIntent.metadata.address:', paymentIntent.metadata?.address);
    let shipping = paymentIntent.shipping?.address;
    let name = paymentIntent.shipping?.name || "";
    const email = paymentIntent.receipt_email || paymentIntent.shipping?.name || "";
    const cart = paymentIntent.metadata?.cart || "[]";
    const userId = paymentIntent.metadata?.userId || null;
    const repairType = paymentIntent.metadata?.repairType || null;
    const shippingOption = paymentIntent.metadata?.shippingOption || null;
    if (!shipping && paymentIntent.metadata?.address) {
      try {
        const parsedAddress = JSON.parse(paymentIntent.metadata.address);
        console.log('Parsed address from metadata:', parsedAddress);
        shipping = parsedAddress;
        // Type guard to check if parsedAddress has a 'name' property
        if (parsedAddress && typeof parsedAddress === "object" && "name" in parsedAddress && typeof parsedAddress.name === "string") {
          name = parsedAddress.name || name;
        }
      } catch (e) {
        console.error('Failed to parse address from metadata:', e);
      }
    }
    // Save address
    let addressId: string | null = null;
    if (shipping) {
      // Map both postal_code and postalCode to postalCode
      const postalCode = (shipping as any).postalCode || (shipping as any).postal_code || "";
      const address = await prisma.orderAddress.create({
        data: {
          name,
          line1: shipping.line1 || "",
          line2: shipping.line2 || undefined,
          city: shipping.city || "",
          state: shipping.state || undefined,
          postalCode,
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

  // Handle payment failed
  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const stripeId = paymentIntent.id;
    await prisma.order.updateMany({
      where: { stripeId },
      data: { status: "failed" },
    });
    // Optionally notify user of failure
  }

  // Handle refund
  if (event.type === "charge.refunded") {
    const charge = event.data.object as any;
    const stripeId = typeof charge.payment_intent === 'string' ? charge.payment_intent : undefined;
    if (stripeId) {
      await prisma.order.updateMany({
        where: { stripeId },
        data: { status: "refunded" },
      });
    }
    // Optionally notify user of refund
  }

  return new NextResponse("ok");
}

