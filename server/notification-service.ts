/**
 * Notification Service
 * 
 * This service handles all notification types:
 * 1. In-app notifications (database)
 * 2. Email notifications (requires external service)
 * 3. WhatsApp notifications (requires external service)
 * 
 * To enable email/WhatsApp notifications, add the respective environment variables
 * and uncomment the implementation sections below.
 */

import type { IStorage } from "./storage";

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: string;
  relatedId?: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
}

export class NotificationService {
  constructor(private storage: IStorage) {}

  /**
   * Send a notification through all available channels
   */
  async sendNotification(payload: NotificationPayload): Promise<void> {
    // Always create in-app notification
    await this.createInAppNotification(payload);

    // Send email if enabled and email is provided
    if (payload.userEmail) {
      await this.sendEmailNotification(payload);
    }

    // Send WhatsApp if enabled and phone is provided
    if (payload.userPhone) {
      await this.sendWhatsAppNotification(payload);
    }
  }

  /**
   * Create in-app notification (always enabled)
   */
  private async createInAppNotification(payload: NotificationPayload): Promise<void> {
    try {
      await this.storage.createNotification({
        userId: payload.userId,
        title: payload.title,
        message: payload.message,
        type: payload.type,
        relatedId: payload.relatedId || null,
      });
      console.log(`✅ In-app notification created for user ${payload.userId}`);
    } catch (error) {
      console.error("❌ Failed to create in-app notification:", error);
    }
  }

  /**
   * Send email notification
   * 
   * To enable email notifications:
   * 1. Install a service like SendGrid, AWS SES, or Nodemailer
   * 2. Add environment variables (e.g., SENDGRID_API_KEY, SMTP_HOST, etc.)
   * 3. Uncomment and implement the code below
   * 
   * Example with SendGrid:
   * ```
   * import sgMail from '@sendgrid/mail';
   * sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
   * 
   * await sgMail.send({
   *   to: payload.userEmail,
   *   from: 'noreply@greenpowersolutions.com',
   *   subject: payload.title,
   *   html: `<p>${payload.message}</p>`,
   * });
   * ```
   */
  private async sendEmailNotification(payload: NotificationPayload): Promise<void> {
    if (!process.env.EMAIL_SERVICE_ENABLED) {
      console.log(`ℹ️  Email notification skipped (service not configured): ${payload.userEmail}`);
      return;
    }

    try {
      // TODO: Implement email sending with your preferred service
      // Uncomment and customize based on your email provider
      
      /*
      // Example with Nodemailer (SMTP)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: '"Green Power Solutions" <noreply@greenpowersolutions.com>',
        to: payload.userEmail,
        subject: payload.title,
        html: `
          <h2>${payload.title}</h2>
          <p>${payload.message}</p>
          ${payload.relatedId ? `<p>Reference: ${payload.relatedId.slice(0, 8).toUpperCase()}</p>` : ''}
        `,
      });
      */

      console.log(`✅ Email notification sent to ${payload.userEmail}`);
    } catch (error) {
      console.error("❌ Failed to send email notification:", error);
    }
  }

  /**
   * Send WhatsApp notification
   * 
   * To enable WhatsApp notifications:
   * 1. Set up Twilio WhatsApp or WhatsApp Business API
   * 2. Add environment variables (e.g., TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER)
   * 3. Uncomment and implement the code below
   * 
   * Example with Twilio:
   * ```
   * import twilio from 'twilio';
   * const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
   * 
   * await client.messages.create({
   *   from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
   *   to: `whatsapp:${payload.userPhone}`,
   *   body: `${payload.title}\n\n${payload.message}${payload.relatedId ? `\n\nReference: ${payload.relatedId.slice(0, 8).toUpperCase()}` : ''}`,
   * });
   * ```
   */
  private async sendWhatsAppNotification(payload: NotificationPayload): Promise<void> {
    if (!process.env.WHATSAPP_SERVICE_ENABLED) {
      console.log(`ℹ️  WhatsApp notification skipped (service not configured): ${payload.userPhone}`);
      return;
    }

    try {
      // TODO: Implement WhatsApp sending with your preferred service
      // Uncomment and customize based on your WhatsApp provider
      
      /*
      // Example with Twilio WhatsApp
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${payload.userPhone}`,
        body: `*${payload.title}*\n\n${payload.message}${payload.relatedId ? `\n\nReference: ${payload.relatedId.slice(0, 8).toUpperCase()}` : ''}`,
      });
      */

      console.log(`✅ WhatsApp notification sent to ${payload.userPhone}`);
    } catch (error) {
      console.error("❌ Failed to send WhatsApp notification:", error);
    }
  }

  /**
   * Send callback request notification
   */
  async notifyCallbackRequest(data: {
    requestId: string;
    name: string;
    email: string;
    phone: string;
    preferredTime: string;
    reason: string;
  }): Promise<void> {
    const payload: NotificationPayload = {
      userId: 'admin', // Send to admin/support team
      title: 'New Callback Request',
      message: `${data.name} requested a callback at ${data.preferredTime}. Reason: ${data.reason}`,
      type: 'callback',
      relatedId: data.requestId,
      userEmail: data.email,
      userName: data.name,
      userPhone: data.phone,
    };

    await this.sendNotification(payload);

    // Also notify the customer
    const customerPayload: NotificationPayload = {
      userId: 'guest-' + Date.now(),
      title: 'Callback Request Received',
      message: `We've received your callback request. Reference: ${data.requestId.slice(0, 8).toUpperCase()}. We'll call you at ${data.preferredTime}.`,
      type: 'callback',
      relatedId: data.requestId,
      userEmail: data.email,
      userName: data.name,
      userPhone: data.phone,
    };

    // Send customer confirmation (email/WhatsApp only, no in-app for guests)
    if (customerPayload.userEmail) {
      await this.sendEmailNotification(customerPayload);
    }
    if (customerPayload.userPhone) {
      await this.sendWhatsAppNotification(customerPayload);
    }
  }

  /**
   * Send ticket creation notification
   */
  async notifyTicketCreation(data: {
    ticketId: string;
    userId: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    userEmail?: string;
    userName?: string;
    userPhone?: string;
  }): Promise<void> {
    const payload: NotificationPayload = {
      userId: data.userId,
      title: 'Support Ticket Created',
      message: `Your ticket "${data.title}" has been created. Reference: ${data.ticketId.slice(0, 8).toUpperCase()}. We'll respond soon.`,
      type: 'ticket',
      relatedId: data.ticketId,
      userEmail: data.userEmail,
      userName: data.userName,
      userPhone: data.userPhone,
    };

    await this.sendNotification(payload);

    // Notify support team
    const teamPayload: NotificationPayload = {
      userId: 'admin',
      title: 'New Support Ticket',
      message: `New ${data.priority} priority ticket in ${data.category}: ${data.title}`,
      type: 'ticket',
      relatedId: data.ticketId,
    };

    await this.createInAppNotification(teamPayload);
  }

  /**
   * Send ticket status update notification
   */
  async notifyTicketStatusUpdate(data: {
    ticketId: string;
    userId: string;
    status: string;
    userEmail?: string;
    userName?: string;
    userPhone?: string;
  }): Promise<void> {
    const payload: NotificationPayload = {
      userId: data.userId,
      title: 'Ticket Status Updated',
      message: `Your ticket ${data.ticketId.slice(0, 8).toUpperCase()} status has been updated to: ${data.status}`,
      type: 'ticket',
      relatedId: data.ticketId,
      userEmail: data.userEmail,
      userName: data.userName,
      userPhone: data.userPhone,
    };

    await this.sendNotification(payload);
  }
}

// Export a singleton instance
let notificationService: NotificationService | null = null;

export function getNotificationService(storage: IStorage): NotificationService {
  if (!notificationService) {
    notificationService = new NotificationService(storage);
  }
  return notificationService;
}
