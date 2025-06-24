"use server";

import { revalidatePath } from "next/cache";
import { DatabaseService } from "@/lib/database";
import { SESService } from "@/lib/ses-service";

export async function getQuotes() {
  try {
    return await DatabaseService.getAllQuotesSimple();
  } catch (error) {
    console.error("Failed to get quotes:", error);
    throw new Error("Failed to get quotes");
  }
}

export async function createQuote(data: any) {
  try {
    const quote = await DatabaseService.createQuote(data);
    revalidatePath("/admin");
    return quote;
  } catch (error) {
    console.error("Failed to create quote:", error);
    throw new Error("Failed to create quote");
  }
}

export async function submitQuoteRequest(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deviceType: string;
  brand: string;
  model: string;
  service?: string;
  part?: string;
  issueDescription: string;
  issues: string[];
  photos: Array<{ url: string; key: string }>;
  urgency: 'urgent' | 'normal' | 'flexible';
  contactMethod: 'email' | 'phone' | 'text' | 'any';
}) {
  try {
    // Create the quote in database
    const quote = await DatabaseService.createQuote({
      customerId: null, // We'll create customer on the fly
      deviceId: null,   // We'll create device on the fly
      issues: JSON.stringify(data.issues),
      description: data.issueDescription,
      estimatedCost: 0, // Will be filled by admin
      estimatedTime: 0, // Will be filled by admin
      status: 'PENDING' as const,
      urgency: data.urgency,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });

    // Send email notification to admin
    await SESService.sendQuoteNotification({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      deviceType: data.deviceType,
      brand: data.brand,
      model: data.model,
      service: data.service,
      part: data.part,
      issueDescription: data.issueDescription,
      issues: data.issues,
      urgency: data.urgency,
      contactMethod: data.contactMethod,
      photos: data.photos
    });

    // Send confirmation email to customer
    await SESService.sendQuoteConfirmation({
      customerEmail: data.email,
      customerName: `${data.firstName} ${data.lastName}`,
      deviceInfo: `${data.brand} ${data.model}`,
      serviceRequested: data.service || data.part || 'General Repair',
      urgency: data.urgency
    });

    revalidatePath("/admin");
    return { success: true, quoteId: quote.id };
  } catch (error) {
    console.error("Failed to submit quote request:", error);
    return { 
      success: false, 
      message: "Failed to submit quote request. Please try again." 
    };
  }
}

export async function updateQuoteStatus(quoteId: string, status: 'APPROVED' | 'REJECTED') {
  try {
    const quote = await DatabaseService.updateQuote(quoteId, { status });
    revalidatePath("/admin");
    return quote;
  } catch (error) {
    console.error("Failed to update quote status:", error);
    throw new Error("Failed to update quote status");
  }
}

export async function deleteQuote(quoteId: string) {
  try {
    await DatabaseService.deleteQuote(quoteId);
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to delete quote:", error);
    throw new Error("Failed to delete quote");
  }
}

export async function sendQuoteResponse(data: {
  quoteId: string;
  customerEmail: string;
  customerName: string;
  deviceInfo: string;
  responseMessage: string;
  estimatedCost?: number;
  estimatedTime?: string;
  adminEmail: string;
  adminNotes?: string;
}) {
  try {
    console.log("Starting sendQuoteResponse for quote:", data.quoteId);
    
    // Get the quote from database
    const quotes = await DatabaseService.getAllQuotesSimple();
    const quote = quotes.find(q => q.id === data.quoteId);
    if (!quote) {
      console.error("Quote not found:", data.quoteId);
      throw new Error("Quote not found");
    }

    if (!quote.customer) {
      console.error("Quote has no customer information:", data.quoteId);
      throw new Error("Quote has no customer information");
    }

    console.log("Quote found:", quote.customer.email, quote.customer.firstName, quote.customer.lastName);

    // Update quote with new estimates if provided
    if (data.estimatedCost || data.estimatedTime) {
      await DatabaseService.updateQuote(data.quoteId, {
        estimatedCost: data.estimatedCost,
        estimatedTime: data.estimatedTime,
        status: 'RESPONDED' // Add a new status for responded quotes
      });
      console.log("Quote updated with estimates");
    }

    // Send response email via AWS SES
    console.log("Attempting to send quote response email via SES...");
    await SESService.sendQuoteResponse({
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      deviceInfo: data.deviceInfo,
      responseMessage: data.responseMessage,
      estimatedCost: data.estimatedCost,
      estimatedTime: data.estimatedTime,
      adminEmail: data.adminEmail,
    });

    console.log("Quote response email sent successfully");

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to send quote response:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      quoteId: data.quoteId,
      responseMessage: data.responseMessage?.substring(0, 100) + '...',
      adminEmail: data.adminEmail
    });
    throw new Error(`Failed to send quote response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateQuoteNotes(quoteId: string, adminNotes: string) {
  try {
    console.log("Updating admin notes for quote:", quoteId);
    
    await DatabaseService.updateQuote(quoteId, {
      adminNotes: adminNotes
    });

    console.log("Admin notes updated successfully");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update admin notes:", error);
    throw new Error(`Failed to update admin notes: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
