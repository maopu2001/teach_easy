import { Transporter, createTransport } from "nodemailer";
import config from "./config";

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
  }>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    try {
      this.transporter = createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: config.email.user,
          clientId: config.email.clientId,
          clientSecret: config.email.clientSecret,
          refreshToken: config.email.refreshToken,
        },
      });
    } catch (error) {
      console.error("Failed to create email transporter:", error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    if (!this.transporter) {
      console.error("Email transporter not initialized");
      return {
        success: false,
        error: "Email service not configured",
      };
    }

    try {
      const mailOptions = {
        from: config.email.user,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error occurred while sending email.",
      };
    }
  }
}

const emailService = new EmailService();
export default emailService;
