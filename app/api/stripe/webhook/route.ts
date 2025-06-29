export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { SESService } from "@/lib/ses-service";
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
    
    // Parse cart items for email
    let cartItems: Array<{ name: string; image?: string; quantity: number; price: number }> = [];
    try {
      const parsedCart = JSON.parse(cart);
      cartItems = parsedCart.map((item: any) => ({
        name: item.name || 'Unknown Item',
        image: item.image,
        quantity: item.quantity || 1,
        price: item.price || 0
      }));
    } catch (e) {
      console.error('Failed to parse cart:', e);
      cartItems = [{ name: 'Order Items', quantity: 1, price: paymentIntent.amount / 100 }];
    }
    
    // Save order
    const order = await prisma.order.create({
      data: {
        stripeId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: "SUCCEEDED",
        email,
        cart,
        addressId: addressId || undefined,
        userId: userId || undefined,
        repairType: repairType || undefined,
        shippingOption: shippingOption || undefined,
      },
    });
    
    // Send order confirmation email to customer
    if (email) {
      try {
        await SESService.sendOrderStatusEmail({
          to: email,
          status: 'confirmed',
          orderId: order.id,
          order: {
            id: order.id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            createdAt: order.createdAt,
            shippingAddress: shipping ? {
              name,
              line1: shipping.line1 || "",
              line2: shipping.line2 || "",
              city: shipping.city || "",
              state: shipping.state || "",
              postalCode: (shipping as any).postalCode || (shipping as any).postal_code || "",
              country: shipping.country || "",
            } : null
          },
          products: cartItems
        });
        console.log('✅ Order confirmation email sent to customer');
      } catch (error) {
        console.error('❌ Failed to send order confirmation email:', error);
      }
    }
    
    // Send admin notification for manual shipping label processing
    try {
      const adminSubject = `New Order Received - Order #${order.id}`;
      const adminHtmlBody = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
              .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #495057; }
              .value { color: #212529; margin-top: 5px; }
              .order-items { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
              .item { display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
              .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 15px; }
              .action-button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Order Received</h1>
                <p>Order #${order.id} - Manual Shipping Label Required</p>
              </div>
              
              <div class="content">
                <div class="field">
                  <div class="label">Order ID:</div>
                  <div class="value">${order.id}</div>
                </div>
                
                <div class="field">
                  <div class="label">Customer Email:</div>
                  <div class="value">${email}</div>
                </div>
                
                <div class="field">
                  <div class="label">Customer Name:</div>
                  <div class="value">${name}</div>
                </div>
                
                <div class="field">
                  <div class="label">Order Amount:</div>
                  <div class="value">${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}</div>
                </div>
                
                ${shipping ? `
                  <div class="field">
                    <div class="label">Shipping Address:</div>
                    <div class="value">
                      ${name}<br>
                      ${shipping.line1 || ''}<br>
                      ${shipping.line2 ? shipping.line2 + '<br>' : ''}
                      ${shipping.city || ''}, ${shipping.state || ''} ${(shipping as any).postalCode || (shipping as any).postal_code || ''}<br>
                      ${shipping.country || ''}
                    </div>
                  </div>
                ` : ''}
                
                <div class="order-items">
                  <div class="label">Order Items:</div>
                  ${cartItems.map(item => `
                    <div class="item">
                      <span>${item.name} (Qty: ${item.quantity})</span>
                      <span>${(item.price / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}</span>
                    </div>
                  `).join('')}
                  <div class="total">
                    Total: ${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}
                  </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/orders/${order.id}" class="action-button">
                    View Order Details
                  </a>
                </div>
                
                <p style="margin-top: 20px; color: #6c757d; font-size: 14px;">
                  Please process this order and send the shipping label to the customer manually.
                </p>
              </div>
            </div>
          </body>
        </html>
      `;
      
      const adminTextBody = `
        New Order Received - Order #${order.id}
        
        Customer: ${name}
        Email: ${email}
        Amount: ${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}
        
        ${shipping ? `
        Shipping Address:
        ${name}
        ${shipping.line1 || ''}
        ${shipping.line2 || ''}
        ${shipping.city || ''}, ${shipping.state || ''} ${(shipping as any).postalCode || (shipping as any).postal_code || ''}
        ${shipping.country || ''}
        ` : ''}
        
        Order Items:
        ${cartItems.map(item => `- ${item.name} (Qty: ${item.quantity}) - ${(item.price / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}`).join('\n')}
        
        Total: ${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}
        
        View order at: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/orders/${order.id}
        
        Please process this order and send the shipping label to the customer manually.
      `;
      
      await SESService.sendRawEmail({
        to: SESService['adminEmail'],
        subject: adminSubject,
        html: adminHtmlBody,
        text: adminTextBody
      });
      console.log('✅ Admin notification email sent');
    } catch (error) {
      console.error('❌ Failed to send admin notification:', error);
    }
  }

  // Handle payment failed
  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const stripeId = paymentIntent.id;
    await prisma.order.updateMany({
      where: { stripeId },
      data: { status: "FAILED" },
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
        data: { status: "REFUNDED" },
      });
    }
    // Optionally notify user of refund
  }

  return new NextResponse("ok");
}

