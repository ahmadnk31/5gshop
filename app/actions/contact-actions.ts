"use server";

import { revalidatePath } from "next/cache";
import { DatabaseService } from "@/lib/database";
import { SESService } from "@/lib/ses-service";

export interface ContactSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  serviceType: string;
  device?: string;
  message: string;
  status: 'new' | 'responded' | 'resolved';
  createdAt: Date;
  respondedAt?: Date;
  adminNotes?: string;
}

export async function submitContactForm(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  serviceType: string;
  device?: string;
  message: string;
}) {
  try {
    // Save to database
    const contact = await DatabaseService.createContact({
      ...data,
      status: 'new' as const,
      createdAt: new Date(),
    });

    // Send email notification to admin via AWS SES
    await SESService.sendContactNotification({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      serviceType: data.serviceType,
      device: data.device,
      message: data.message,
    });

    // Send confirmation email to customer
    await SESService.sendContactConfirmation({
      customerEmail: data.email,
      customerName: `${data.firstName} ${data.lastName}`,
    });

    return { success: true, contactId: contact.id };
  } catch (error) {
    console.error("Failed to submit contact form:", error);
    throw new Error("Failed to submit contact form");
  }
}

export async function getContacts() {
  try {
    return await DatabaseService.getAllContactsSimple();
  } catch (error) {
    console.error("Failed to get contacts:", error);
    throw new Error("Failed to get contacts");
  }
}

export async function getContactById(id: string) {
  try {
    return await DatabaseService.getContactById(id);
  } catch (error) {
    console.error("Failed to get contact:", error);
    throw new Error("Failed to get contact");
  }
}

export async function updateContactStatus(
  contactId: string, 
  status: 'new' | 'responded' | 'resolved',
  adminNotes?: string
) {
  try {
    const contact = await DatabaseService.updateContact(contactId, {
      status,
      adminNotes,
      respondedAt: status === 'responded' ? new Date() : undefined,
    });
    revalidatePath("/admin");
    return contact;
  } catch (error) {
    console.error("Failed to update contact status:", error);
    throw new Error("Failed to update contact status");
  }
}

export async function respondToContact(
  contactId: string,
  responseMessage: string,
  adminEmail: string,
  adminNotes?: string
) {
  try {
    console.log("Starting respondToContact for contact:", contactId);
    
    const contact = await DatabaseService.getContactById(contactId);
    if (!contact) {
      console.error("Contact not found:", contactId);
      throw new Error("Contact not found");
    }

    console.log("Contact found:", contact.email, contact.firstName, contact.lastName);

    // Send response email via AWS SES
    console.log("Attempting to send email via SES...");
    await SESService.sendContactResponse({
      customerEmail: contact.email,
      customerName: `${contact.firstName} ${contact.lastName}`,
      responseMessage,
      adminEmail,
    });

    console.log("Email sent successfully, updating contact status...");

    // Update contact status
    await DatabaseService.updateContact(contactId, {
      status: 'responded',
      respondedAt: new Date(),
      adminNotes: adminNotes, // Add admin notes if provided
    });

    console.log("Contact updated successfully");

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to respond to contact:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      contactId,
      responseMessage: responseMessage?.substring(0, 100) + '...',
      adminEmail
    });
    throw new Error(`Failed to respond to contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteContact(contactId: string) {
  try {
    await DatabaseService.deleteContact(contactId);
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to delete contact:", error);
    throw new Error("Failed to delete contact");
  }
}

export async function getContactStats() {
  try {
    const contacts = await DatabaseService.getAllContactsSimple();
    const total = contacts.length;
    const newContacts = contacts.filter(c => c.status === 'new').length;
    const responded = contacts.filter(c => c.status === 'responded').length;
    const resolved = contacts.filter(c => c.status === 'resolved').length;

    return {
      total,
      new: newContacts,
      responded,
      resolved,
    };
  } catch (error) {
    console.error("Failed to get contact stats:", error);
    throw new Error("Failed to get contact stats");
  }
}
