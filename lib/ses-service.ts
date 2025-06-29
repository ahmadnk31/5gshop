import { SESClient, SendEmailCommand, SendRawEmailCommand } from "@aws-sdk/client-ses";
import { createReadStream } from "fs";
import { Readable } from "stream";
import { formatCurrency } from "./utils";

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';
const mockEmailMode = process.env.MOCK_EMAIL_MODE === 'true';

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export class SESService {
  private static fromEmail = process.env.SES_FROM_EMAIL || "noreply@5gphones.be";
  private static adminEmail = process.env.SES_ADMIN_EMAIL || "shafiq@5gphones.be";

  // Mock email function for development
  private static async mockSendEmail(data: any, emailType: string) {
    console.log(`📧 MOCK EMAIL [${emailType}]:`);
    console.log(`From: ${this.fromEmail}`);
    console.log(`To: ${data.customerEmail || data.email || this.adminEmail}`);
    console.log(`Subject: ${data.subject || 'Contact Form Email'}`);
    console.log(`Content: ${data.message || data.responseMessage || 'Email content'}`);
    console.log('✅ Mock email sent successfully');
    return { MessageId: 'mock-' + Date.now() };
  }

  // Helper function to convert image URL to base64 for email compatibility
  private static async convertImageToBase64(imageUrl: string): Promise<string | null> {
    try {
      // Skip if it's already a data URL
      if (imageUrl.startsWith('data:')) {
        return imageUrl;
      }

      // Convert relative URLs to absolute URLs
      if (imageUrl.startsWith('/')) {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        imageUrl = `${baseUrl}${imageUrl}`;
      }

      // Fetch the image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        console.warn(`Failed to fetch image: ${imageUrl}`);
        return null;
      }

      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      
      return `data:${contentType};base64,${base64}`;
    } catch (error) {
      console.warn(`Error converting image to base64: ${imageUrl}`, error);
      return null;
    }
  }

  static async sendContactNotification(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    serviceType: string;
    device?: string;
    message: string;
  }) {
    const subject = `New Contact Form Submission - ${data.serviceType}`;
    const htmlBody = `
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
            .message-box { background: white; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
              <p>5gphones - Customer Contact</p>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="label">Customer Name:</div>
                <div class="value">${data.firstName} ${data.lastName}</div>
              </div>
              
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${data.email}</div>
              </div>
              
              ${data.phone ? `
                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value">${data.phone}</div>
                </div>
              ` : ''}
              
              <div class="field">
                <div class="label">Service Type:</div>
                <div class="value">${data.serviceType}</div>
              </div>
              
              ${data.device ? `
                <div class="field">
                  <div class="label">Device:</div>
                  <div class="value">${data.device}</div>
                </div>
              ` : ''}
              
              <div class="message-box">
                <div class="label">Message:</div>
                <div class="value">${data.message}</div>
              </div>
            </div>
            
            <p style="text-align: center; color: #6c757d; font-size: 14px;">
              Please respond to this inquiry within 24 hours for the best customer experience.
            </p>
          </div>
        </body>
      </html>
    `;

    const textBody = `
      New Contact Form Submission - 5gphones
      
      Customer: ${data.firstName} ${data.lastName}
      Email: ${data.email}
      ${data.phone ? `Phone: ${data.phone}` : ''}
      Service Type: ${data.serviceType}
      ${data.device ? `Device: ${data.device}` : ''}
      
      Message:
      ${data.message}
    `;

    const command = new SendEmailCommand({
      Source: this.fromEmail,
      Destination: {
        ToAddresses: [this.adminEmail],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
          Text: {
            Data: textBody,
            Charset: "UTF-8",
          },
        },
      },
    });

    // Use mock email in development or when emails aren't verified
    if (mockEmailMode) {
      return this.mockSendEmail({
        email: this.adminEmail,
        message: `New contact from ${data.firstName} ${data.lastName}`,
        subject: subject
      }, 'ADMIN_NOTIFICATION');
    }

    try {
      return await sesClient.send(command);
    } catch (error) {
      console.error("Failed to send admin notification:", error);
      if (isDevelopment) {
        console.log("Falling back to mock email mode...");
        return this.mockSendEmail({
          email: this.adminEmail,
          message: `New contact from ${data.firstName} ${data.lastName}`,
          subject: subject
        }, 'ADMIN_NOTIFICATION_FALLBACK');
      }
      throw error;
    }
  }

  static async sendContactConfirmation(data: {
    customerEmail: string;
    customerName: string;
  }) {
    const subject = "Thank you for contacting 5gphones!";
    const htmlBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .highlight { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { text-align: center; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Contacting Us!</h1>
              <p>5gphones - Professional Device Repair</p>
            </div>
            
            <div class="content">
              <h2>Hi ${data.customerName},</h2>
              
              <p>Thank you for reaching out to 5gphones! We've received your message and will get back to you within 24 hours.</p>
              
              <div class="highlight">
                <h3>What happens next?</h3>
                <ul>
                  <li>Our team will review your inquiry</li>
                  <li>We'll prepare a detailed response</li>
                  <li>You'll receive our reply within 24 hours</li>
                  <li>For urgent matters, feel free to call us directly</li>
                </ul>
              </div>
              
              <h3>Contact Information:</h3>
              <ul>
                <li><strong>Phone:</strong> +32 466 13 41 81</li>
                <li><strong>Email:</strong> support@5gphones.be</li>
                <li><strong>Address:</strong> Bondgenotenlaan 84A, Leuven</li>
                <li><strong>Hours:</strong> Mon-Fri 10AM-6PM, Sat 10AM-6:30PM</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>This is an automated confirmation. Please do not reply to this email.</p>
              <p>&copy; 2025 5gphones. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textBody = `
      Thank you for contacting 5gphones!
      
      Hi ${data.customerName},
      
      We've received your message and will get back to you within 24 hours.
      
      What happens next?
      - Our team will review your inquiry
      - We'll prepare a detailed response
      - You'll receive our reply within 24 hours
      - For urgent matters, feel free to call us directly
      
      Contact Information:
      Phone: +32 466 13 41 81
      Email: support@5gphones.be
      Address: Bondgenotenlaan 84A, Leuven
      Hours: Mon-Fri 10AM-6PM, Sat 10AM-6:30PM
      
      © 2025 5gphones. All rights reserved.
    `;

    const command = new SendEmailCommand({
      Source: this.fromEmail,
      Destination: {
        ToAddresses: [data.customerEmail],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
          Text: {
            Data: textBody,
            Charset: "UTF-8",
          },
        },
      },
    });

    // Use mock email in development or when emails aren't verified
    if (mockEmailMode) {
      return this.mockSendEmail({
        customerEmail: data.customerEmail,
        message: `Confirmation email for ${data.customerName}`,
        subject: subject
      }, 'CUSTOMER_CONFIRMATION');
    }

    try {
      return await sesClient.send(command);
    } catch (error) {
      console.error("Failed to send customer confirmation:", error);
      if (isDevelopment) {
        console.log("Falling back to mock email mode...");
        return this.mockSendEmail({
          customerEmail: data.customerEmail,
          message: `Confirmation email for ${data.customerName}`,
          subject: subject
        }, 'CUSTOMER_CONFIRMATION_FALLBACK');
      }
      throw error;
    }
  }

  static async sendContactResponse(data: {
    customerEmail: string;
    customerName: string;
    responseMessage: string;
    adminEmail: string;
  }) {
    const subject = "Response from 5gphones";
    const htmlBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .response { background: white; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0; }
            .footer { text-align: center; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Response from 5gphones</h1>
              <p>Professional Device Repair Services</p>
            </div>
            
            <div class="content">
              <h2>Hi ${data.customerName},</h2>
              
              <p>Thank you for your inquiry. Here's our response to your message:</p>
              
              <div class="response">
                ${data.responseMessage.replace(/\n/g, '<br>')}
              </div>
              
              <p>If you have any additional questions or would like to proceed with our services, please don't hesitate to contact us.</p>
              
              <h3>Contact Information:</h3>
              <ul>
                <li><strong>Phone:</strong> +32 466 13 41 81</li>
                <li><strong>Email:</strong> support@5gphones.be</li>
                <li><strong>Address:</strong> Bondgenotenlaan 84A, Leuven</li>
                <li><strong>Hours:</strong> Mon-Fri 10AM-6PM, Sat 10AM-6:30PM</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>Best regards,<br>The 5gphones Team</p>
              <p>&copy; ${new Date().getFullYear()}
               5gphones. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textBody = `
      Response from 5gphones
      
      Hi ${data.customerName},
      
      Thank you for your inquiry. Here's our response to your message:
      
      ${data.responseMessage}
      
      If you have any additional questions or would like to proceed with our services, please don't hesitate to contact us.
      
      Contact Information:
      Phone: +32 466 13 41 81
      Email: support@5gphones.be
      Address: Bondgenotenlaan 84A, Leuven
      Hours: Mon-Fri 10AM-6PM, Sat 10AM-6:30PM
      
      Best regards,
      The 5gphones Team
      
      © ${new Date().getFullYear()}
       5gphones. All rights reserved.
    `;

    // Use mock email in development or when emails aren't verified
    if (mockEmailMode) {
      return this.mockSendEmail({
        customerEmail: data.customerEmail,
        responseMessage: data.responseMessage,
        subject: subject
      }, 'CONTACT_RESPONSE');
    }

    const command = new SendEmailCommand({
      Source: this.fromEmail,
      ReplyToAddresses: [data.adminEmail],
      Destination: {
        ToAddresses: [data.customerEmail],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
          Text: {
            Data: textBody,
            Charset: "UTF-8",
          },
        },
      },
    });

    try {
      console.log("Sending email to:", data.customerEmail, "from:", this.fromEmail);
      const result = await sesClient.send(command);
      console.log("Email sent successfully:", result.MessageId);
      return result;
    } catch (error) {
      console.error("AWS SES Error:", error);
      console.error("SES Configuration:", {
        fromEmail: this.fromEmail,
        region: process.env.AWS_REGION,
        hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
      });
      
      // If email sending fails, fall back to mock mode for development
      if (isDevelopment) {
        console.log("Falling back to mock email mode due to SES error...");
        return this.mockSendEmail({
          customerEmail: data.customerEmail,
          responseMessage: data.responseMessage,
          subject: subject
        }, 'CONTACT_RESPONSE_FALLBACK');
      }
      
      throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown AWS error'}`);
    }
  }

  static async sendQuoteNotification(data: {
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
    urgency: string;
    contactMethod: string;
    photos: Array<{ url: string; key: string }>;
    quality?: string;
  }) {
    const subject = `New Quote Request - ${data.brand} ${data.model}`;
    const htmlBody = `
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
            .urgent { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; margin: 10px 0; }
            .device-info { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 15px 0; }
            .issues-list { background: white; padding: 15px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔧 New Quote Request</h1>
              <p>5gphones.be Device Repair</p>
            </div>
            
            <div class="content">
              ${data.urgency === 'urgent' ? '<div class="urgent"><strong>⚡ URGENT REQUEST</strong> - Customer needs same-day service</div>' : ''}
              
              <div class="device-info">
                <h3>📱 Device Information</h3>
                <div class="field">
                  <div class="label">Device:</div>
                  <div class="value">${data.brand} ${data.model} (${data.deviceType})</div>
                </div>
                ${data.service ? `
                <div class="field">
                  <div class="label">Requested Service:</div>
                  <div class="value">${data.service}</div>
                </div>
                ` : ''}
                ${data.part ? `
                <div class="field">
                  <div class="label">Specific Part:</div>
                  <div class="value">${data.part}</div>
                </div>
                ` : ''}
                ${data.quality ? `
                <div class="field">
                  <div class="label">Part Quality:</div>
                  <div class="value">${data.quality}</div>
                </div>
                ` : ''}
              </div>

              <h3>👤 Customer Information</h3>
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${data.firstName} ${data.lastName}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${data.email}</div>
              </div>
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${data.phone}</div>
              </div>
              <div class="field">
                <div class="label">Preferred Contact:</div>
                <div class="value">${data.contactMethod}</div>
              </div>
              <div class="field">
                <div class="label">Urgency:</div>
                <div class="value">${data.urgency}</div>
              </div>

              <h3>🔍 Issue Details</h3>
              <div class="field">
                <div class="label">Description:</div>
                <div class="value">${data.issueDescription}</div>
              </div>
              
              ${data.issues.length > 0 ? `
              <div class="issues-list">
                <div class="label">Reported Issues:</div>
                <ul>
                  ${data.issues.map(issue => `<li>${issue}</li>`).join('')}
                </ul>
              </div>
              ` : ''}

              ${data.photos.length > 0 ? `
              <div class="field">
                <div class="label">Photos Uploaded:</div>
                <div class="value">${data.photos.length} photo(s) - Check admin panel for details</div>
              </div>
              ` : ''}
            </div>
            
            <p style="text-align: center; color: #6c757d; font-size: 14px;">
              Please respond to this quote request within 2 hours for the best customer experience.
            </p>
          </div>
        </body>
      </html>
    `;

    const textBody = `
      New Quote Request - 5gphones.be
      
      Customer: ${data.firstName} ${data.lastName}
      Email: ${data.email}
      Phone: ${data.phone}
      Preferred Contact: ${data.contactMethod}
      Urgency: ${data.urgency}
      
      Device: ${data.brand} ${data.model} (${data.deviceType})
      ${data.service ? `Service: ${data.service}` : ''}
      ${data.part ? `Part: ${data.part}` : ''}
      ${data.quality ? `Quality: ${data.quality}` : ''}
      
      Issue Description:
      ${data.issueDescription}
      
      Reported Issues: ${data.issues.join(', ')}
      
      Photos: ${data.photos.length} uploaded
    `;

    const command = new SendEmailCommand({
      Source: this.fromEmail,
      Destination: {
        ToAddresses: [this.adminEmail],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
          Text: {
            Data: textBody,
            Charset: "UTF-8",
          },
        },
      },
    });

    // Use mock email in development or when emails aren't verified
    if (mockEmailMode) {
      return this.mockSendEmail({
        email: this.adminEmail,
        message: `New quote request from ${data.firstName} ${data.lastName} for ${data.brand} ${data.model}`,
        subject: subject
      }, 'QUOTE_ADMIN_NOTIFICATION');
    }

    try {
      return await sesClient.send(command);
    } catch (error) {
      console.error("Failed to send quote notification:", error);
      if (isDevelopment) {
        console.log("Falling back to mock email mode...");
        return this.mockSendEmail({
          email: this.adminEmail,
          message: `New quote request from ${data.firstName} ${data.lastName} for ${data.brand} ${data.model}`,
          subject: subject
        }, 'QUOTE_ADMIN_NOTIFICATION_FALLBACK');
      }
      
      throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown AWS error'}`);
    }
  }

  static async sendQuoteConfirmation(data: {
    customerEmail: string;
    customerName: string;
    deviceInfo: string;
    serviceRequested: string;
    urgency: string;
    quality?: string;
  }) {
    const subject = `Quote Request Received - ${data.deviceInfo}`;
    const htmlBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .highlight { background: #e8f5e8; border: 1px solid #4caf50; padding: 15px; border-radius: 4px; margin: 15px 0; }
            .next-steps { background: white; padding: 20px; border-radius: 4px; margin: 15px 0; }
            .contact-info { background: #fff3e0; padding: 15px; border-radius: 4px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Quote Request Received</h1>
              <p>5gphones.be Device Repair</p>
            </div>
            
            <div class="content">
              <p>Dear ${data.customerName},</p>
              
              <div class="highlight">
                <strong>Thank you for your quote request!</strong><br>
                We've received your request for <strong>${data.serviceRequested}</strong> on your <strong>${data.deviceInfo}</strong>.
                ${data.quality ? `<br><span><strong>Selected Part Quality:</strong> ${data.quality}</span>` : ''}
              </div>

              <div class="next-steps">
                <h3>📋 What happens next?</h3>
                <ul>
                  <li><strong>Review (within 2 hours):</strong> Our technicians will review your request</li>
                  <li><strong>Quote preparation:</strong> We'll prepare a detailed quote with pricing and timeframe</li>
                  <li><strong>Contact:</strong> We'll reach out via your preferred method with the quote</li>
                  <li><strong>Approval:</strong> If you approve, we'll schedule your repair</li>
                </ul>
              </div>

              ${data.urgency === 'urgent' ? `
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 15px 0;">
                <strong>⚡ Urgent Request Noted</strong><br>
                We understand you need same-day service. Our team will prioritize your request and contact you as soon as possible.
              </div>
              ` : ''}

              <div class="contact-info">
                <h3>📞 Need immediate assistance?</h3>
                <p><strong>Phone:</strong> +32 466 13 41 81</p>
                <p><strong>Email:</strong> info@5gphones.be</p>
                <p><strong>Business Hours:</strong> Monday-Saturday, 10:00 AM - 6:00 PM</p>
              </div>

              <p>Your quote is valid for 30 days from today.</p>
              
              <p>Best regards,<br>
              The 5gphones.be Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textBody = `
      Quote Request Received - 5gphones.be
      
      Dear ${data.customerName},
      
      Thank you for your quote request!
      We've received your request for ${data.serviceRequested} on your ${data.deviceInfo}.
      ${data.quality ? `\nSelected Part Quality: ${data.quality}` : ''}
      
      What happens next:
      1. Review (within 2 hours): Our technicians will review your request
      2. Quote preparation: We'll prepare a detailed quote with pricing and timeframe
      3. Contact: We'll reach out via your preferred method with the quote
      4. Approval: If you approve, we'll schedule your repair
      
      ${data.urgency === 'urgent' ? 'URGENT REQUEST NOTED: We understand you need same-day service and will prioritize your request.' : ''}
      
      Need immediate assistance?
      Phone: +32 466 13 41 81
      Email: info@5gphones.be
      Business Hours: Monday-Saturday, 10:00 AM - 6:00 PM
      
      Your quote is valid for 30 days from today.
      
      Best regards,
      The 5gphones.be Team
    `;

    const command = new SendEmailCommand({
      Source: this.fromEmail,
      Destination: {
        ToAddresses: [data.customerEmail],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
          Text: {
            Data: textBody,
            Charset: "UTF-8",
          },
        },
      },
    });

    // Use mock email in development or when emails aren't verified
    if (mockEmailMode) {
      return this.mockSendEmail({
        customerEmail: data.customerEmail,
        message: `Quote request confirmation for ${data.deviceInfo}`,
        subject: subject
      }, 'QUOTE_CUSTOMER_CONFIRMATION');
    }

    try {
      return await sesClient.send(command);
    } catch (error) {
      console.error("Failed to send quote confirmation:", error);
      if (isDevelopment) {
        console.log("Falling back to mock email mode...");
        return this.mockSendEmail({
          customerEmail: data.customerEmail,
          message: `Quote request confirmation for ${data.deviceInfo}`,
          subject: subject
        }, 'QUOTE_CUSTOMER_CONFIRMATION_FALLBACK');
      }
      
      throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown AWS error'}`);
    }
  }

  // Send quote response email from admin to customer
  static async sendQuoteResponse(data: {
    customerEmail: string;
    customerName: string;
    deviceInfo: string;
    responseMessage: string;
    estimatedCost?: number;
    estimatedTime?: string;
    adminEmail: string;
  }) {
    const subject = `Quote Response - ${data.deviceInfo}`;
    
    // Build cost and time info
    const estimateInfo = [];
    if (data.estimatedCost) {
      estimateInfo.push(`Estimated Cost: €${data.estimatedCost.toFixed(2)}`);
    }
    if (data.estimatedTime) {
      estimateInfo.push(`Estimated Time: ${data.estimatedTime}`);
    }
    const estimateSection = estimateInfo.length > 0 ? `
      <div class="estimate-box">
        <h3>Quote Estimate</h3>
        ${estimateInfo.map(info => `<p><strong>${info}</strong></p>`).join('')}
      </div>
    ` : '';

    const htmlBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
            .estimate-box { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3; }
            .response-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6; }
            .footer { background: #6c757d; color: white; padding: 15px; text-align: center; font-size: 14px; border-radius: 8px; margin-top: 20px; }
            .button { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📱 5gphones.be</h1>
              <h2>Quote Response</h2>
            </div>
            <div class="content">
              <p>Dear ${data.customerName},</p>
              
              <p>Thank you for your quote request for your <strong>${data.deviceInfo}</strong>. We have reviewed your request and are pleased to provide you with the following response:</p>
              
              ${estimateSection}
              
              <div class="response-box">
                <h3>Our Response:</h3>
                <div style="white-space: pre-wrap;">${data.responseMessage}</div>
              </div>
              
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Next Steps:</h3>
                <ul>
                  <li>Reply to this email if you have any questions</li>
                  <li>Call us at +32 466 13 41 81 to schedule your repair</li>
                  <li>Visit our shop for immediate service</li>
                  <li>This quote is valid for 30 days</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="tel:+32466134181" class="button">📞 Call Us Now</a>
                <a href="mailto:info@5gphones.be" class="button">📧 Email Us</a>
              </div>
              
              <p><strong>Business Hours:</strong><br>
              Monday - Saturday: 10:00 AM - 6:00 PM<br>
              Sunday: Closed</p>
              
              <p><strong>Location:</strong><br>
              Bondgenotenlaan 84A, Leuven</p>
            </div>
            <div class="footer">
              <p>This email was sent from 5gphones.be in response to your quote request.</p>
              <p>© ${new Date().getFullYear()} 5gphones.be - Professional Device Repair Services</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textBody = `
5gphones.be - Quote Response

Dear ${data.customerName},

Thank you for your quote request for your ${data.deviceInfo}. We have reviewed your request and are pleased to provide you with the following response:

${estimateInfo.length > 0 ? `
QUOTE ESTIMATE:
${estimateInfo.join('\n')}
` : ''}

OUR RESPONSE:
${data.responseMessage}

NEXT STEPS:
- Reply to this email if you have any questions
- Call us at +32 466 13 41 81 to schedule your repair
- Visit our shop for immediate service
- This quote is valid for 30 days

Business Hours: Monday-Saturday, 10:00 AM - 6:00 PM
Location: Bondgenotenlaan 84A, Leuven

Best regards,
The 5gphones.be Team

This email was sent from 5gphones.be in response to your quote request.
    `;

    const command = new SendEmailCommand({
      Source: this.fromEmail,
      Destination: {
        ToAddresses: [data.customerEmail],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
          Text: {
            Data: textBody,
            Charset: "UTF-8",
          },
        },
      },
    });

    // Use mock email in development or when emails aren't verified
    if (mockEmailMode) {
      return this.mockSendEmail({
        customerEmail: data.customerEmail,
        message: `Quote response for ${data.deviceInfo}: ${data.responseMessage}`,
        subject: subject
      }, 'QUOTE_RESPONSE');
    }

    try {
      console.log(`Sending quote response email to: ${data.customerEmail} from: ${this.fromEmail}`);
      const result = await sesClient.send(command);
      console.log("Quote response email sent successfully:", result.MessageId);
      return result;
    } catch (error) {
      console.error("Failed to send quote response email:", error);
      if (isDevelopment) {
        console.log("Falling back to mock email mode...");
        return this.mockSendEmail({
          customerEmail: data.customerEmail,
          message: `Quote response for ${data.deviceInfo}: ${data.responseMessage}`,
          subject: subject
        }, 'QUOTE_RESPONSE_FALLBACK');
      }
      
      throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown AWS error'}`);
    }
  }

  static async sendVerificationEmail(email: string, token: string) {
    const subject = "Verify your email address";
    const verifyUrl = `${process.env.NEXTAUTH_PUBLIC_URL}/api/auth/verify?email=${encodeURIComponent(email)}` + (token ? `&token=${encodeURIComponent(token)}` : "");
    const htmlBody = `
      <html>
        <body>
          <h2>Verify your email address</h2>
          <p>Thank you for registering with 5gphones. Please verify your email by clicking the link below:</p>
          <p><a href="${verifyUrl}">Verify Email</a></p>
          <p>If you did not create an account, you can ignore this email.</p>
        </body>
      </html>
    `;
    const textBody = `Verify your email address\n\nThank you for registering with 5gphones. Please verify your email by visiting: ${verifyUrl}\nIf you did not create an account, you can ignore this email.`;
    const command = new SendEmailCommand({
      Source: this.fromEmail,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: {
          Html: { Data: htmlBody, Charset: "UTF-8" },
          Text: { Data: textBody, Charset: "UTF-8" },
        },
      },
    });
    if (mockEmailMode) {
      return this.mockSendEmail({ email, message: verifyUrl, subject }, 'VERIFY_EMAIL');
    }
    try {
      const result = await sesClient.send(command);
      return result;
    } catch (error) {
      if (isDevelopment) {
        return this.mockSendEmail({ email, message: verifyUrl, subject }, 'VERIFY_EMAIL_FALLBACK');
      }
      throw new Error(`Verification email failed: ${error instanceof Error ? error.message : 'Unknown AWS error'}`);
    }
  }

  static async sendResetEmail(email: string, token: string,locale: string) {

    const subject = "Reset your password";
    const resetUrl = `${process.env.NEXTAUTH_URL || "https://5gphones.be"}/${locale}/auth/reset?token=${encodeURIComponent(token)}`;
    const htmlBody = `
      <html>
        <body>
          <h2>Reset your password</h2>
          <p>We received a request to reset your password. Click the link below to set a new password:</p>
          <p><a href="${resetUrl}">Reset Password</a></p>
          <p>If you did not request this, you can ignore this email.</p>
        </body>
      </html>
    `;
    const textBody = `Reset your password\n\nWe received a request to reset your password. Visit: ${resetUrl}\nIf you did not request this, you can ignore this email.`;
    const command = new SendEmailCommand({
      Source: this.fromEmail,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: {
          Html: { Data: htmlBody, Charset: "UTF-8" },
          Text: { Data: textBody, Charset: "UTF-8" },
        },
      },
    });
    if (mockEmailMode) {
      return this.mockSendEmail({ email, message: resetUrl, subject }, 'RESET_EMAIL');
    }
    try {
      const result = await sesClient.send(command);
      return result;
    } catch (error) {
      if (isDevelopment) {
        return this.mockSendEmail({ email, message: resetUrl, subject }, 'RESET_EMAIL_FALLBACK');
      }
      throw new Error(`Reset email failed: ${error instanceof Error ? error.message : 'Unknown AWS error'}`);
    }
  }

  static async sendRawEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) {
    const command = new SendEmailCommand({
      Source: this.fromEmail,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: {
          Html: { Data: html, Charset: "UTF-8" },
          Text: { Data: text || html.replace(/<[^>]+>/g, ""), Charset: "UTF-8" },
        },
      },
    });
    if (mockEmailMode) {
      return this.mockSendEmail({ email: to, message: text || html, subject }, 'GENERIC_EMAIL');
    }
    try {
      return await sesClient.send(command);
    } catch (error) {
      console.error("Failed to send generic email:", error);
      if (isDevelopment) {
        return this.mockSendEmail({ email: to, message: text || html, subject }, 'GENERIC_EMAIL_FALLBACK');
      }
      throw error;
    }
  }

  static async sendOrderStatusEmail({
    to,
    status,
    orderId,
    order,
    products
  }: {
    to: string;
    status: string;
    orderId: string;
    order: any;
    products: Array<{ name: string; image?: string; quantity: number; price: number }>;
  }) {
    let subject = `Your order #${orderId.slice(-6)} status update`;
    let statusMsg = '';
    if (status === 'ready') statusMsg = 'Your order is ready for pickup!';
    else if (status === 'shipped') statusMsg = 'Your order has been shipped!';
    else if (status === 'finished') statusMsg = 'Your order is complete!';
    else if (status === 'paid') statusMsg = 'Your payment was received.';
    else if (status === 'created') statusMsg = 'Your order was created.';
    else if (status === 'failed') statusMsg = 'There was a problem with your order.';
    else if (status === 'refunded') statusMsg = 'Your order was refunded.';
    else statusMsg = `Order status: ${status}`;

    // Helper function to format currency
   

    // Process product images for email compatibility
    const productRows = await Promise.all(products.map(async (p) => {
      let imageHtml = '';
      
      if (p.image) {
        try {
          // Convert image to base64 for email compatibility
          const base64Image = await this.convertImageToBase64(p.image);
          if (base64Image) {
            imageHtml = `<img src="${base64Image}" alt="${p.name}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;" />`;
          } else {
            // Fallback: use original URL if conversion fails
            imageHtml = `<img src="${p.image}" alt="${p.name}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;" />`;
          }
        } catch (error) {
          console.warn(`Failed to process image for product ${p.name}:`, error);
          // Fallback: use original URL
          imageHtml = `<img src="${p.image}" alt="${p.name}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;" />`;
        }
      }
      
      return `
        <tr>
          <td style="padding:8px; border:1px solid #eee; text-align:center;">
            ${imageHtml}
          </td>
          <td style="padding:8px; border:1px solid #eee;">${p.name}</td>
          <td style="padding:8px; border:1px solid #eee; text-align:center;">${p.quantity}</td>
          <td style="padding:8px; border:1px solid #eee; text-align:right;">${formatCurrency(p.price,'EUR')}</td>
        </tr>
      `;
    }));

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="background:#4f46e5;color:white;padding:16px 24px;border-radius:8px 8px 0 0;">Order Update</h2>
        <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px;">
          <p>Hello,</p>
          <p>${statusMsg}</p>
          <h3 style="margin-top:24px;">Order Details</h3>
          <table style="width:100%;border-collapse:collapse;margin-top:12px;">
            <thead>
              <tr>
                <th style="padding:8px;border:1px solid #eee;">Image</th>
                <th style="padding:8px;border:1px solid #eee;">Product</th>
                <th style="padding:8px;border:1px solid #eee;">Qty</th>
                <th style="padding:8px;border:1px solid #eee;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${productRows.join('')}
            </tbody>
          </table>
          <p style="margin-top:24px;">Order total: <strong>€${(order.amount / 100).toFixed(2)}</strong></p>
          <p style="color:#6b7280;font-size:13px;margin-top:24px;">Thank you for shopping with us!</p>
        </div>
      </div>
    `;
    const text = `Order status: ${statusMsg}\n\nProducts:\n${products.map(p => `- ${p.name} x${p.quantity} (${formatCurrency(p.price,'EUR')})`).join('\n')}\nOrder total: €${(order.amount / 100).toFixed(2)}`;
    return this.sendRawEmail({ to, subject, html, text });
  }

  // New methods for sending emails with attachments
  static async sendEmailWithAttachment(data: {
    to: string;
    subject: string;
    htmlBody: string;
    textBody?: string;
    attachments: Array<{
      filename: string;
      content: Buffer | string;
      contentType: string;
    }>;
  }) {
    const boundary = `boundary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    let rawEmail = '';
    
    // Headers
    rawEmail += `From: ${this.fromEmail}\r\n`;
    rawEmail += `To: ${data.to}\r\n`;
    rawEmail += `Subject: ${data.subject}\r\n`;
    rawEmail += `MIME-Version: 1.0\r\n`;
    rawEmail += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;
    
    // HTML Body
    rawEmail += `--${boundary}\r\n`;
    rawEmail += `Content-Type: multipart/alternative; boundary="${boundary}_alt"\r\n\r\n`;
    
    // Text version
    if (data.textBody) {
      rawEmail += `--${boundary}_alt\r\n`;
      rawEmail += `Content-Type: text/plain; charset=UTF-8\r\n\r\n`;
      rawEmail += `${data.textBody}\r\n\r\n`;
    }
    
    // HTML version
    rawEmail += `--${boundary}_alt\r\n`;
    rawEmail += `Content-Type: text/html; charset=UTF-8\r\n\r\n`;
    rawEmail += `${data.htmlBody}\r\n\r\n`;
    
    rawEmail += `--${boundary}_alt--\r\n\r\n`;
    
    // Attachments
    for (const attachment of data.attachments) {
      rawEmail += `--${boundary}\r\n`;
      rawEmail += `Content-Type: ${attachment.contentType}; name="${attachment.filename}"\r\n`;
      rawEmail += `Content-Disposition: attachment; filename="${attachment.filename}"\r\n`;
      rawEmail += `Content-Transfer-Encoding: base64\r\n\r\n`;
      
      const content = typeof attachment.content === 'string' 
        ? attachment.content 
        : attachment.content.toString('base64');
      rawEmail += `${content}\r\n\r\n`;
    }
    
    rawEmail += `--${boundary}--\r\n`;
    
    const command = new SendRawEmailCommand({
      RawMessage: {
        Data: Buffer.from(rawEmail, 'utf-8')
      }
    });

    // Use mock email in development
    if (mockEmailMode) {
      return this.mockSendEmail({
        email: data.to,
        message: `Email with ${data.attachments.length} attachment(s): ${data.subject}`,
        subject: data.subject
      }, 'EMAIL_WITH_ATTACHMENT');
    }

    try {
      console.log(`Sending email with ${data.attachments.length} attachment(s) to: ${data.to}`);
      const result = await sesClient.send(command);
      console.log("Email with attachment sent successfully:", result.MessageId);
      return result;
    } catch (error) {
      console.error("Failed to send email with attachment:", error);
      if (isDevelopment) {
        return this.mockSendEmail({
          email: data.to,
          message: `Email with ${data.attachments.length} attachment(s): ${data.subject}`,
          subject: data.subject
        }, 'EMAIL_WITH_ATTACHMENT_FALLBACK');
      }
      throw error;
    }
  }

  static async sendQuoteResponseWithAttachment(data: {
    customerEmail: string;
    customerName: string;
    deviceInfo: string;
    responseMessage: string;
    estimatedCost?: number;
    estimatedTime?: string;
    adminEmail: string;
    attachments?: Array<{
      filename: string;
      content: Buffer | string;
      contentType: string;
    }>;
  }) {
    const subject = `Quote Response - ${data.deviceInfo}`;
    
    const htmlBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .estimate { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { text-align: center; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Quote Response</h1>
              <p>5gphones - Professional Device Repair</p>
            </div>
            
            <div class="content">
              <h2>Hi ${data.customerName},</h2>
              
              <p>Thank you for your quote request for <strong>${data.deviceInfo}</strong>. Here's our response:</p>
              
              <div class="estimate">
                ${data.responseMessage}
              </div>
              
              ${data.estimatedCost ? `
                <div class="estimate">
                  <h3>Estimated Cost: ${formatCurrency(data.estimatedCost,"EUR")}</h3>
                </div>
              ` : ''}
              
              ${data.estimatedTime ? `
                <div class="estimate">
                  <h3>Estimated Time: ${data.estimatedTime}</h3>
                </div>
              ` : ''}
              
              <p>Please contact us if you have any questions or would like to proceed with the repair.</p>
            </div>
            
            <div class="footer">
              <p>Best regards,<br>The 5gphones Team</p>
              <p>Contact: ${this.adminEmail}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textBody = `
      Quote Response - 5gphones
      
      Hi ${data.customerName},
      
      Thank you for your quote request for ${data.deviceInfo}. Here's our response:
      
      ${data.responseMessage}
      
      ${data.estimatedCost ? `Estimated Cost: €${data.estimatedCost.toFixed(2)}` : ''}
      ${data.estimatedTime ? `Estimated Time: ${data.estimatedTime}` : ''}
      
      Please contact us if you have any questions or would like to proceed with the repair.
      
      Best regards,
      The 5gphones Team
      Contact: ${this.adminEmail}
    `;

    if (data.attachments && data.attachments.length > 0) {
      return this.sendEmailWithAttachment({
        to: data.customerEmail,
        subject,
        htmlBody,
        textBody,
        attachments: data.attachments
      });
    } else {
      return this.sendQuoteResponse(data);
    }
  }

  static async sendShippingLabelEmail(data: {
    customerEmail: string;
    customerName: string;
    orderId: string;
    orderDetails: any;
    labelAttachment?: {
      filename: string;
      content: Buffer | string;
      contentType: string;
    };
    trackingNumber?: string;
    message?: string;
  }) {
    const subject = `Shipping Label - Order #${data.orderId.slice(-6)}`;
    
    const htmlBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .highlight { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { text-align: center; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Shipping Label</h1>
              <p>5gphones - Order #${data.orderId.slice(-6)}</p>
            </div>
            
            <div class="content">
              <h2>Hi ${data.customerName},</h2>
              
              <p>Your order #${data.orderId.slice(-6)} is ready for shipping.${data.labelAttachment ? ' Please find the shipping label attached to this email.' : ''}</p>
              
              ${data.trackingNumber ? `
                <div class="highlight">
                  <h3>Tracking Number: ${data.trackingNumber}</h3>
                </div>
              ` : ''}
              
              ${data.message ? `
                <div class="highlight">
                  <p><strong>Additional Information:</strong></p>
                  <p>${data.message}</p>
                </div>
              ` : ''}
              
              ${data.labelAttachment ? '<p>Please print the attached shipping label and affix it to your package before sending it to us.</p>' : ''}
              
              <p>If you have any questions, please don't hesitate to contact us.</p>
            </div>
            
            <div class="footer">
              <p>Best regards,<br>The 5gphones Team</p>
              <p>Contact: ${this.adminEmail}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textBody = `
      Shipping Label - 5gphones
      
      Hi ${data.customerName},
      
      Your order #${data.orderId.slice(-6)} is ready for shipping.${data.labelAttachment ? ' Please find the shipping label attached to this email.' : ''}
      
      ${data.trackingNumber ? `Tracking Number: ${data.trackingNumber}` : ''}
      
      ${data.message ? `Additional Information: ${data.message}` : ''}
      
      ${data.labelAttachment ? 'Please print the attached shipping label and affix it to your package before sending it to us.' : ''}
      
      If you have any questions, please don't hesitate to contact us.
      
      Best regards,
      The 5gphones Team
      Contact: ${this.adminEmail}
    `;

    if (data.labelAttachment) {
      return this.sendEmailWithAttachment({
        to: data.customerEmail,
        subject,
        htmlBody,
        textBody,
        attachments: [data.labelAttachment]
      });
    } else {
      return this.sendRawEmail({
        to: data.customerEmail,
        subject,
        html: htmlBody,
        text: textBody
      });
    }
  }
}
