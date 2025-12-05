import { Resend } from "resend";

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';
const mockEmailMode = process.env.MOCK_EMAIL_MODE === 'true';

const resend = new Resend(process.env.RESEND_API_KEY);

export class ResendService {
  private static fromEmail = process.env.RESEND_FROM_EMAIL || process.env.NOREPLY_EMAIL || process.env.SES_FROM_EMAIL || "noreply@5gphones.be";
  private static adminEmail = process.env.RESEND_ADMIN_EMAIL || process.env.ADMIN_EMAIL || process.env.SES_ADMIN_EMAIL || "shafiq@5gphones.be";
  private static supportEmail = process.env.SUPPORT_EMAIL || "support@5gphones.be";
  private static contactEmail = process.env.CONTACT_EMAIL || "contact@5gphones.be";

  // Mock email function for development
  private static async mockSendEmail(data: any, emailType: string) {
    console.log(`📧 MOCK EMAIL [${emailType}]:`);
    console.log(`From: ${this.fromEmail}`);
    console.log(`To: ${data.customerEmail || data.email || this.adminEmail}`);
    console.log(`Subject: ${data.subject || 'Email'}`);
    console.log(`Content: ${data.message || data.responseMessage || 'Email content'}`);
    console.log('✅ Mock email sent successfully');
    return { id: 'mock-' + Date.now() };
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

  // Send contact form notification to admin
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
            .header { background: linear-gradient(135deg, #16A34A 0%, #15803D 100%); color: white; padding: 20px; text-align: center; }
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
          </div>
        </body>
      </html>
    `;

    const textBody = `
      New Contact Form Submission - 5gphones
      
      Customer Name: ${data.firstName} ${data.lastName}
      Email: ${data.email}
      ${data.phone ? `Phone: ${data.phone}` : ''}
      Service Type: ${data.serviceType}
      ${data.device ? `Device: ${data.device}` : ''}
      
      Message:
      ${data.message}
    `;

    if (mockEmailMode) {
      return this.mockSendEmail({
        email: this.adminEmail,
        message: textBody,
        subject: subject
      }, 'CONTACT_ADMIN_NOTIFICATION');
    }

    try {
      const { data: result, error } = await resend.emails.send({
        from: ResendService.contactEmail,
        to: [this.adminEmail],
        subject: subject,
        html: htmlBody,
        text: textBody,
      });

      if (error) {
        throw error;
      }

      return result;
    } catch (error) {
      console.error("Failed to send contact notification:", error);
      if (isDevelopment) {
        return this.mockSendEmail({
          email: this.adminEmail,
          message: textBody,
          subject: subject
        }, 'CONTACT_ADMIN_NOTIFICATION_FALLBACK');
      }
      throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Send contact confirmation to customer
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
            .header { background: linear-gradient(135deg, #16A34A 0%, #15803D 100%); color: white; padding: 20px; text-align: center; }
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
                <li><strong>Email:</strong> ${ResendService.contactEmail}</li>
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
      Email: ${ResendService.contactEmail}
      Address: Bondgenotenlaan 84A, Leuven
      Hours: Mon-Fri 10AM-6PM, Sat 10AM-6:30PM
      
      © 2025 5gphones. All rights reserved.
    `;

    if (mockEmailMode) {
      return this.mockSendEmail({
        customerEmail: data.customerEmail,
        message: textBody,
        subject: subject
      }, 'CONTACT_CUSTOMER_CONFIRMATION');
    }

    try {
      const { data: result, error } = await resend.emails.send({
        from: ResendService.contactEmail,
        to: [data.customerEmail],
        subject: subject,
        html: htmlBody,
        text: textBody,
      });

      if (error) {
        throw error;
      }

      return result;
    } catch (error) {
      console.error("Failed to send contact confirmation:", error);
      if (isDevelopment) {
        return this.mockSendEmail({
          customerEmail: data.customerEmail,
          message: textBody,
          subject: subject
        }, 'CONTACT_CUSTOMER_CONFIRMATION_FALLBACK');
      }
      throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Send contact response from admin to customer
  static async sendContactResponse(data: {
    customerEmail: string;
    customerName: string;
    responseMessage: string;
    adminEmail: string;
  }) {
    const subject = "Response to your inquiry - 5gphones";
    const htmlBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #16A34A 0%, #15803D 100%); color: white; padding: 20px; text-align: center; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .response-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6; }
            .footer { text-align: center; color: #6c757d; font-size: 14px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Response to Your Inquiry</h1>
              <p>5gphones - Customer Support</p>
            </div>
            
            <div class="content">
              <h2>Hi ${data.customerName},</h2>
              
              <p>Thank you for contacting 5gphones. We've reviewed your inquiry and here's our response:</p>
              
              <div class="response-box">
                ${data.responseMessage.split('\n').map(line => `<p>${line}</p>`).join('')}
              </div>
              
              <p>If you have any further questions, please don't hesitate to reach out to us.</p>
              
              <p>Best regards,<br>
              The 5gphones Team</p>
              
              <p>© ${new Date().getFullYear()} 5gphones. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textBody = `
      Response to Your Inquiry - 5gphones
      
      Hi ${data.customerName},
      
      Thank you for contacting 5gphones. We've reviewed your inquiry and here's our response:
      
      ${data.responseMessage}
      
      If you have any further questions, please don't hesitate to reach out to us.
      
      Best regards,
      The 5gphones Team
      
      © ${new Date().getFullYear()} 5gphones. All rights reserved.
    `;

    if (mockEmailMode) {
      return this.mockSendEmail({
        customerEmail: data.customerEmail,
        responseMessage: data.responseMessage,
        subject: subject
      }, 'CONTACT_RESPONSE');
    }

    try {
      const { data: result, error } = await resend.emails.send({
        from: ResendService.contactEmail,
        to: [data.customerEmail],
        replyTo: [data.adminEmail],
        subject: subject,
        html: htmlBody,
        text: textBody,
      });

      if (error) {
        throw error;
      }

      return result;
    } catch (error) {
      console.error("Failed to send contact response:", error);
      if (isDevelopment) {
        return this.mockSendEmail({
          customerEmail: data.customerEmail,
          responseMessage: data.responseMessage,
          subject: subject
        }, 'CONTACT_RESPONSE_FALLBACK');
      }
      throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Send quote notification to admin
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
            .header { background: linear-gradient(135deg, #16A34A 0%, #15803D 100%); color: white; padding: 20px; text-align: center; }
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
                <div class="label">Photos Uploaded (${data.photos.length}):</div>
                <div class="value" style="margin-top: 10px;">
                  ${data.photos.map((photo: { url: string; key: string }, index: number) => `
                    <div style="margin-bottom: 10px;">
                      <a href="${photo.url}" target="_blank" style="display: inline-block;">
                        <img src="${photo.url}" alt="Photo ${index + 1}" style="max-width: 200px; max-height: 200px; border: 1px solid #ddd; border-radius: 4px; margin-right: 10px; margin-bottom: 10px;" />
                      </a>
                    </div>
                  `).join('')}
                </div>
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

    if (mockEmailMode) {
      return this.mockSendEmail({
        email: this.adminEmail,
        message: `New quote request from ${data.firstName} ${data.lastName} for ${data.brand} ${data.model}`,
        subject: subject
      }, 'QUOTE_ADMIN_NOTIFICATION');
    }

    try {
      const { data: result, error } = await resend.emails.send({
        from: ResendService.supportEmail,
        to: [this.adminEmail],
        subject: subject,
        html: htmlBody,
        text: textBody,
      });

      if (error) {
        throw error;
      }

      return result;
    } catch (error) {
      console.error("Failed to send quote notification:", error);
      if (isDevelopment) {
        return this.mockSendEmail({
          email: this.adminEmail,
          message: `New quote request from ${data.firstName} ${data.lastName} for ${data.brand} ${data.model}`,
          subject: subject
        }, 'QUOTE_ADMIN_NOTIFICATION_FALLBACK');
      }
      throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Send quote confirmation to customer
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
            .header { background: linear-gradient(135deg, #16A34A 0%, #15803D 100%); color: white; padding: 20px; text-align: center; }
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
                <p><strong>Email:</strong> ${ResendService.contactEmail}</p>
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
      Email: ${ResendService.contactEmail}
      Business Hours: Monday-Saturday, 10:00 AM - 6:00 PM
      
      Your quote is valid for 30 days from today.
      
      Best regards,
      The 5gphones.be Team
    `;

    if (mockEmailMode) {
      return this.mockSendEmail({
        customerEmail: data.customerEmail,
        message: `Quote request confirmation for ${data.deviceInfo}`,
        subject: subject
      }, 'QUOTE_CUSTOMER_CONFIRMATION');
    }

    try {
      const { data: result, error } = await resend.emails.send({
        from: ResendService.supportEmail,
        to: [data.customerEmail],
        subject: subject,
        html: htmlBody,
        text: textBody,
      });

      if (error) {
        throw error;
      }

      return result;
    } catch (error) {
      console.error("Failed to send quote confirmation:", error);
      if (isDevelopment) {
        return this.mockSendEmail({
          customerEmail: data.customerEmail,
          message: `Quote request confirmation for ${data.deviceInfo}`,
          subject: subject
        }, 'QUOTE_CUSTOMER_CONFIRMATION_FALLBACK');
      }
      throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Send quote response from admin to customer
  static async sendQuoteResponse(data: {
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
            .header { background: linear-gradient(135deg, #16A34A 0%, #15803D 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
            .estimate-box { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3; }
            .response-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6; }
            .footer { background: #6c757d; color: white; padding: 15px; text-align: center; font-size: 14px; border-radius: 8px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Quote Response</h1>
              <p>5gphones.be Device Repair</p>
            </div>
            
            <div class="content">
              <p>Dear ${data.customerName},</p>
              
              <p>Thank you for your quote request for <strong>${data.deviceInfo}</strong>.</p>
              
              ${estimateSection}
              
              <div class="response-box">
                <h3>Our Response:</h3>
                ${data.responseMessage.split('\n').map(line => `<p>${line}</p>`).join('')}
              </div>
              
              <p>If you have any questions or would like to proceed with the repair, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br>
              The 5gphones.be Team</p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} 5gphones. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textBody = `
      Quote Response - 5gphones.be
      
      Dear ${data.customerName},
      
      Thank you for your quote request for ${data.deviceInfo}.
      
      ${estimateInfo.length > 0 ? estimateInfo.join('\n') + '\n\n' : ''}
      
      Our Response:
      ${data.responseMessage}
      
      If you have any questions or would like to proceed with the repair, please don't hesitate to contact us.
      
      Best regards,
      The 5gphones.be Team
      
      © ${new Date().getFullYear()} 5gphones. All rights reserved.
    `;

    if (mockEmailMode) {
      return this.mockSendEmail({
        customerEmail: data.customerEmail,
        responseMessage: data.responseMessage,
        subject: subject
      }, 'QUOTE_RESPONSE');
    }

    try {
      // Prepare attachments if provided
      // Resend expects attachments as base64 strings
      const attachments = data.attachments?.map(att => {
        let content: string;
        if (typeof att.content === 'string') {
          // If it's already a base64 string, use it directly
          // Otherwise, assume it's a buffer and convert to base64
          content = att.content.includes('base64') 
            ? att.content.split(',')[1] || att.content
            : Buffer.from(att.content, 'utf-8').toString('base64');
        } else {
          // Buffer - convert to base64
          content = att.content.toString('base64');
        }
        return {
          filename: att.filename,
          content: content,
        };
      }) || undefined;

      const { data: result, error } = await resend.emails.send({
        from: ResendService.supportEmail,
        to: [data.customerEmail],
        replyTo: [data.adminEmail],
        subject: subject,
        html: htmlBody,
        text: textBody,
        attachments: attachments,
      });

      if (error) {
        throw error;
      }

      return result;
    } catch (error) {
      console.error("Failed to send quote response:", error);
      if (isDevelopment) {
        return this.mockSendEmail({
          customerEmail: data.customerEmail,
          responseMessage: data.responseMessage,
          subject: subject
        }, 'QUOTE_RESPONSE_FALLBACK');
      }
      throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Send email verification
  static async sendVerificationEmail(email: string, token: string) {
    const subject = "Verify your email address";
    const verifyUrl = `${process.env.NEXTAUTH_PUBLIC_URL || process.env.NEXTAUTH_URL || "https://5gphones.be"}/api/auth/verify?email=${encodeURIComponent(email)}` + (token ? `&token=${encodeURIComponent(token)}` : "");
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

    if (mockEmailMode) {
      return this.mockSendEmail({ email, message: verifyUrl, subject }, 'VERIFY_EMAIL');
    }

    try {
      const { data: result, error } = await resend.emails.send({
        from: this.fromEmail,
        to: [email],
        subject: subject,
        html: htmlBody,
        text: textBody,
      });

      if (error) {
        throw error;
      }

      return result;
    } catch (error) {
      if (isDevelopment) {
        return this.mockSendEmail({ email, message: verifyUrl, subject }, 'VERIFY_EMAIL_FALLBACK');
      }
      throw new Error(`Verification email failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Send password reset email
  static async sendResetEmail(email: string, token: string, locale: string) {
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

    if (mockEmailMode) {
      return this.mockSendEmail({ email, message: resetUrl, subject }, 'RESET_EMAIL');
    }

    try {
      const { data: result, error } = await resend.emails.send({
        from: this.fromEmail,
        to: [email],
        subject: subject,
        html: htmlBody,
        text: textBody,
      });

      if (error) {
        throw error;
      }

      return result;
    } catch (error) {
      if (isDevelopment) {
        return this.mockSendEmail({ email, message: resetUrl, subject }, 'RESET_EMAIL_FALLBACK');
      }
      throw new Error(`Reset email failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Send welcome email
  static async sendWelcomeEmail(email: string, name: string) {
    const subject = "Welcome to 5gphones!";
    const htmlBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #16A34A 0%, #15803D 100%); color: white; padding: 20px; text-align: center; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .highlight { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { text-align: center; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to 5gphones!</h1>
              <p>Professional Device Repair Services</p>
            </div>
            
            <div class="content">
              <h2>Hi ${name},</h2>
              
              <p>Thank you for joining 5gphones! We're excited to have you as part of our community.</p>
              
              <div class="highlight">
                <h3>What you can do:</h3>
                <ul>
                  <li>Request repair quotes for your devices</li>
                  <li>Track your repair orders</li>
                  <li>Access exclusive deals and promotions</li>
                  <li>Get priority customer support</li>
                </ul>
              </div>
              
              <h3>Our Services:</h3>
              <ul>
                <li>📱 Smartphone repairs (all brands)</li>
                <li>💻 Laptop and desktop repairs</li>
                <li>⌚ Smartwatch repairs</li>
                <li>🎮 Gaming console repairs</li>
                <li>🔧 Fast 30-minute repairs available</li>
              </ul>
              
              <h3>Contact Information:</h3>
              <ul>
                <li><strong>Phone:</strong> +32 466 13 41 81</li>
                <li><strong>Email:</strong> ${ResendService.supportEmail}</li>
                <li><strong>Address:</strong> Bondgenotenlaan 84A, Leuven</li>
                <li><strong>Hours:</strong> Mon-Fri 10AM-6PM, Sat 10AM-6:30PM</li>
              </ul>
              
              <p>We're here to help with all your device repair needs. Don't hesitate to reach out if you have any questions!</p>
              
              <p>Best regards,<br>
              The 5gphones Team</p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} 5gphones. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textBody = `
      Welcome to 5gphones!
      
      Hi ${name},
      
      Thank you for joining 5gphones! We're excited to have you as part of our community.
      
      What you can do:
      - Request repair quotes for your devices
      - Track your repair orders
      - Access exclusive deals and promotions
      - Get priority customer support
      
      Our Services:
      - Smartphone repairs (all brands)
      - Laptop and desktop repairs
      - Smartwatch repairs
      - Gaming console repairs
      - Fast 30-minute repairs available
      
      Contact Information:
      Phone: +32 466 13 41 81
      Email: ${ResendService.supportEmail}
      Address: Bondgenotenlaan 84A, Leuven
      Hours: Mon-Fri 10AM-6PM, Sat 10AM-6:30PM
      
      We're here to help with all your device repair needs. Don't hesitate to reach out if you have any questions!
      
      Best regards,
      The 5gphones Team
      
      © ${new Date().getFullYear()} 5gphones. All rights reserved.
    `;

    if (mockEmailMode) {
      return this.mockSendEmail({ email, message: textBody, subject }, 'WELCOME_EMAIL');
    }

    try {
      const { data: result, error } = await resend.emails.send({
        from: this.fromEmail,
        to: [email],
        subject: subject,
        html: htmlBody,
        text: textBody,
      });

      if (error) {
        throw error;
      }

      return result;
    } catch (error) {
      if (isDevelopment) {
        return this.mockSendEmail({ email, message: textBody, subject }, 'WELCOME_EMAIL_FALLBACK');
      }
      throw new Error(`Welcome email failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Generic email sending method (for backward compatibility)
  static async sendRawEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) {
    if (mockEmailMode) {
      return this.mockSendEmail({ email: to, message: text || html, subject }, 'GENERIC_EMAIL');
    }

    try {
      const { data: result, error } = await resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject: subject,
        html: html,
        text: text || html.replace(/<[^>]+>/g, ""),
      });

      if (error) {
        throw error;
      }

      return result;
    } catch (error) {
      if (isDevelopment) {
        return this.mockSendEmail({ email: to, message: text || html, subject }, 'GENERIC_EMAIL_FALLBACK');
      }
      throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

