import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-05-28.basil",
  typescript: true});

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { amount, currency, cart, repairType, shippingOption, email, address, userId } = await req.json();
  
  // Create a simplified cart summary for metadata (essential info only)
  const cartSummary = cart.map((item: any) => `${item.name} x${item.quantity}`).join(', ');
  const cartItemCount = cart.reduce((total: number, item: any) => total + item.quantity, 0);
  
  // Keep metadata under 500 characters by only storing essential information
  const metadata: any = {
    cartItemCount: cartItemCount.toString(),
    totalAmount: amount.toString(),
    cartSummary: cartSummary.length > 400 ? cartSummary.substring(0, 397) + '...' : cartSummary,
  };
  
  // Add optional fields only if they exist and keep within limits
  if (repairType) metadata.repairType = repairType;
  if (shippingOption) metadata.shippingOption = shippingOption;
  if (userId) metadata.userId = userId;
  
  // For address, only store essential parts
  if (address) {
    const addressSummary = `${address.line1 || ''}, ${address.city || ''}, ${address.postal_code || ''}`.substring(0, 100);
    metadata.address = addressSummary;
  }
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      metadata,
    });
    
    // Store full cart data and order details in database
    let orderAddressId = null;
    
    // Create address record if address data is provided
    if (address) {
      const orderAddress = await prisma.orderAddress.create({
        data: {
          name: address.name || '',
          line1: address.line1 || '',
          line2: address.line2 || null,
          city: address.city || '',
          state: address.state || null,
          postalCode: address.postal_code || address.postalCode || '',
          country: address.country || 'BE', // Default to Belgium
        },
      });
      orderAddressId = orderAddress.id;
    }
    
    // Create order record with complete cart data
    const order = await prisma.order.create({
      data: {
        stripeId: paymentIntent.id,
        amount,
        currency,
        status: 'CREATED',
        email: email || '',
        cart: JSON.stringify(cart), // Store complete cart data as JSON
        addressId: orderAddressId,
        userId: userId || null,
        repairType: repairType || null,
        shippingOption: shippingOption || null,
      },
    });
    
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      orderId: order.id // Return our database order ID
    });
  } catch (error) {
    console.error('Payment intent or order creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
