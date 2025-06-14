import config from "./config";

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

class EmailTemplates {
  private static baseUrl = config.site.url;
  private static appName = "Teach Easy";

  // Email verification template
  static emailVerification(data: {
    userName: string;
    verificationLink: string;
    expirationHours?: number;
  }): EmailTemplate {
    const { userName, verificationLink, expirationHours = 24 } = data;

    return {
      subject: `Verify your ${this.appName} account`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #6b7280; }
            .warning { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${this.appName}</h1>
          </div>
          <div class="content">
            <h2>Welcome, ${userName}!</h2>
            <p>Thank you for creating an account with ${this.appName}. To complete your registration, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">Verify Email Address</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">
              <a href="${verificationLink}">${verificationLink}</a>
            </p>
            
            <div class="warning">
              <p><strong>Important:</strong> This verification link will expire in ${expirationHours} hours for security reasons.</p>
            </div>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 ${this.appName}. All rights reserved.</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to ${this.appName}, ${userName}!
        
        Thank you for creating an account with us. To complete your registration, please verify your email address by visiting the following link:
        
        ${verificationLink}
        
        This verification link will expire in ${expirationHours} hours for security reasons.
        
        If you didn't create an account with us, please ignore this email.
        
        --
        ${this.appName} Team
      `,
    };
  }

  // Password reset template
  static passwordReset(data: {
    userName: string;
    resetLink: string;
    expirationHours?: number;
  }): EmailTemplate {
    const { userName, resetLink, expirationHours = 1 } = data;

    return {
      subject: `Reset your ${this.appName} password`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #6b7280; }
            .warning { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${this.appName}</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello ${userName},</p>
            <p>We received a request to reset your password for your ${this.appName} account. Click the button below to set a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">
              <a href="${resetLink}">${resetLink}</a>
            </p>
            
            <div class="warning">
              <p><strong>Security Notice:</strong> This reset link will expire in ${expirationHours} hour(s) for your security.</p>
            </div>
            
            <p>If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 ${this.appName}. All rights reserved.</p>
            <p>For security reasons, never share this email with anyone.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request - ${this.appName}
        
        Hello ${userName},
        
        We received a request to reset your password for your ${this.appName} account. Please visit the following link to set a new password:
        
        ${resetLink}
        
        This reset link will expire in ${expirationHours} hour(s) for your security.
        
        If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.
        
        --
        ${this.appName} Team
      `,
    };
  }

  // Welcome email template
  static welcome(data: {
    userName: string;
    loginLink?: string;
  }): EmailTemplate {
    const { userName, loginLink = `${this.baseUrl}/auth/login` } = data;

    return {
      subject: `Welcome to ${this.appName}!`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #6b7280; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #10b981; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Welcome to ${this.appName}!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Welcome to ${this.appName}! We're excited to have you on board. Your email has been verified and your account is now active.</p>
            
            <div class="feature">
              <h3>🚀 Getting Started</h3>
              <p>Explore our platform and discover all the features available to you.</p>
            </div>
            
            <div class="feature">
              <h3>📚 Learning Resources</h3>
              <p>Access our comprehensive learning materials and tutorials.</p>
            </div>
            
            <div class="feature">
              <h3>🎯 Track Progress</h3>
              <p>Monitor your learning journey and achievements.</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${loginLink}" class="button">Start Learning</a>
            </div>
            
            <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 ${this.appName}. All rights reserved.</p>
            <p>Happy learning!</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to ${this.appName}!
        
        Hello ${userName},
        
        Welcome to ${this.appName}! We're excited to have you on board. Your email has been verified and your account is now active.
        
        Getting Started:
        - Explore our platform and discover all the features available to you
        - Access our comprehensive learning materials and tutorials
        - Monitor your learning journey and achievements
        
        Start learning: ${loginLink}
        
        If you have any questions or need help getting started, don't hesitate to reach out to our support team.
        
        Happy learning!
        
        --
        ${this.appName} Team
      `,
    };
  }

  // Order confirmation template
  static orderConfirmation(data: {
    userName: string;
    orderNumber: string;
    orderTotal: string;
    orderItems: Array<{ name: string; price: string; quantity: number }>;
    orderDate: string;
  }): EmailTemplate {
    const { userName, orderNumber, orderTotal, orderItems, orderDate } = data;

    const itemsHtml = orderItems
      .map(
        (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price}</td>
      </tr>
    `
      )
      .join("");

    const itemsText = orderItems
      .map((item) => `${item.name} (Qty: ${item.quantity}) - ${item.price}`)
      .join("\n");

    return {
      subject: `Order Confirmation #${orderNumber} - ${this.appName}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .order-details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #6b7280; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { background: #f3f4f6; padding: 10px; text-align: left; }
            .total { font-weight: bold; font-size: 18px; color: #059669; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Order Confirmed! 🎉</h1>
          </div>
          <div class="content">
            <h2>Thank you for your order, ${userName}!</h2>
            <p>We've received your order and it's being processed. Here are your order details:</p>
            
            <div class="order-details">
              <h3>Order #${orderNumber}</h3>
              <p><strong>Order Date:</strong> ${orderDate}</p>
              
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr>
                    <td colspan="2" style="padding: 12px; font-weight: bold;">Total:</td>
                    <td style="padding: 12px; text-align: right;" class="total">${orderTotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p>You'll receive another email when your order ships. If you have any questions, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 ${this.appName}. All rights reserved.</p>
            <p>Thank you for choosing us!</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Order Confirmed! - ${this.appName}
        
        Thank you for your order, ${userName}!
        
        Order Details:
        Order #${orderNumber}
        Order Date: ${orderDate}
        
        Items:
        ${itemsText}
        
        Total: ${orderTotal}
        
        You'll receive another email when your order ships. If you have any questions, please contact our support team.
        
        Thank you for choosing us!
        
        --
        ${this.appName} Team
      `,
    };
  }

  // Generic notification template
  static notification(data: {
    userName: string;
    title: string;
    message: string;
    actionUrl?: string;
    actionText?: string;
  }): EmailTemplate {
    const { userName, title, message, actionUrl, actionText } = data;

    return {
      subject: `${title} - ${this.appName}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #6366f1; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${this.appName}</h1>
          </div>
          <div class="content">
            <h2>${title}</h2>
            <p>Hello ${userName},</p>
            <p>${message}</p>
            
            ${
              actionUrl && actionText
                ? `
              <div style="text-align: center;">
                <a href="${actionUrl}" class="button">${actionText}</a>
              </div>
            `
                : ""
            }
          </div>
          <div class="footer">
            <p>&copy; 2025 ${this.appName}. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        ${title} - ${this.appName}
        
        Hello ${userName},
        
        ${message}
        
        ${actionUrl && actionText ? `${actionText}: ${actionUrl}` : ""}
        
        --
        ${this.appName} Team
      `,
    };
  }
}

export default EmailTemplates;
