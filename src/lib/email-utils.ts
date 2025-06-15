import config from "./config";
import emailService, { EmailOptions, EmailResult } from "./email-service";
import EmailTemplates from "./email-templates";

//TODO: need to check this
export interface EmailVerificationData {
  userName: string;
  email: string;
  verificationToken: string;
  expirationHours?: number;
}

export interface PasswordResetData {
  userName: string;
  email: string;
  resetToken: string;
  expirationHours?: number;
}

export interface WelcomeEmailData {
  userName: string;
  email: string;
}

export interface OrderConfirmationData {
  userName: string;
  email: string;
  orderNumber: string;
  orderTotal: string;
  orderItems: Array<{ name: string; price: string; quantity: number }>;
  orderDate: string;
}

export interface NotificationData {
  userName: string;
  email: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}

class EmailUtils {
  private static baseUrl = config.site.url;

  // Send email verification
  static async sendEmailVerification(
    data: EmailVerificationData
  ): Promise<EmailResult> {
    const verificationLink = `${this.baseUrl}/auth/verify-email?token=${data.verificationToken}`;

    const template = EmailTemplates.emailVerification({
      userName: data.userName,
      verificationLink,
      expirationHours: data.expirationHours,
    });

    const emailOptions: EmailOptions = {
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    try {
      const result = await emailService.sendEmail(emailOptions);

      if (result.success) {
        console.log(`✅ Email verification sent to ${data.email}`);
      } else {
        console.error(
          `❌ Failed to send email verification to ${data.email}:`,
          result.error
        );
      }

      return result;
    } catch (error) {
      console.error("Email verification sending error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Send password reset email
  static async sendPasswordReset(
    data: PasswordResetData
  ): Promise<EmailResult> {
    const resetLink = `${this.baseUrl}/reset-password?token=${data.resetToken}`;

    const template = EmailTemplates.passwordReset({
      userName: data.userName,
      resetLink,
      expirationHours: data.expirationHours,
    });

    const emailOptions: EmailOptions = {
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    try {
      const result = await emailService.sendEmail(emailOptions);

      if (result.success) {
        console.log(`✅ Password reset email sent to ${data.email}`);
      } else {
        console.error(
          `❌ Failed to send password reset email to ${data.email}:`,
          result.error
        );
      }

      return result;
    } catch (error) {
      console.error("Password reset email sending error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Send welcome email
  static async sendWelcomeEmail(data: WelcomeEmailData): Promise<EmailResult> {
    const template = EmailTemplates.welcome({
      userName: data.userName,
    });

    const emailOptions: EmailOptions = {
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    try {
      const result = await emailService.sendEmail(emailOptions);

      if (result.success) {
        console.log(`✅ Welcome email sent to ${data.email}`);
      } else {
        console.error(
          `❌ Failed to send welcome email to ${data.email}:`,
          result.error
        );
      }

      return result;
    } catch (error) {
      console.error("Welcome email sending error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Send order confirmation
  static async sendOrderConfirmation(
    data: OrderConfirmationData
  ): Promise<EmailResult> {
    const template = EmailTemplates.orderConfirmation({
      userName: data.userName,
      orderNumber: data.orderNumber,
      orderTotal: data.orderTotal,
      orderItems: data.orderItems,
      orderDate: data.orderDate,
    });

    const emailOptions: EmailOptions = {
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    try {
      const result = await emailService.sendEmail(emailOptions);

      if (result.success) {
        console.log(`✅ Order confirmation sent to ${data.email}`);
      } else {
        console.error(
          `❌ Failed to send order confirmation to ${data.email}:`,
          result.error
        );
      }

      return result;
    } catch (error) {
      console.error("Order confirmation email sending error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Send notification email
  static async sendNotification(data: NotificationData): Promise<EmailResult> {
    const template = EmailTemplates.notification({
      userName: data.userName,
      title: data.title,
      message: data.message,
      actionUrl: data.actionUrl,
      actionText: data.actionText,
    });

    const emailOptions: EmailOptions = {
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    try {
      const result = await emailService.sendEmail(emailOptions);

      if (result.success) {
        console.log(`✅ Notification email sent to ${data.email}`);
      } else {
        console.error(
          `❌ Failed to send notification email to ${data.email}:`,
          result.error
        );
      }

      return result;
    } catch (error) {
      console.error("Notification email sending error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Send custom email
  static async sendCustomEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      const result = await emailService.sendEmail(options);

      if (result.success) {
        console.log(`✅ Custom email sent to ${options.to}`);
      } else {
        console.error(
          `❌ Failed to send custom email to ${options.to}:`,
          result.error
        );
      }

      return result;
    } catch (error) {
      console.error("Custom email sending error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export default EmailUtils;
