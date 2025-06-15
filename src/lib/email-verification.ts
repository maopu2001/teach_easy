import crypto from "crypto";
import { Auth, User } from "@/schema";
import { connectDB } from "@/lib/connectDb";
import EmailUtils from "@/lib/email-utils";

// TODO: need to chekc this
export interface EmailVerificationResult {
  success: boolean;
  message: string;
  isAlreadyVerified?: boolean;
}

export const generateEmailVerificationToken = (): {
  token: string;
  expires: Date;
} => {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return { token, expires };
};

export const verifyEmailToken = async (
  token: string
): Promise<EmailVerificationResult> => {
  try {
    await connectDB();

    // Find auth record with the verification token
    const authRecord = await Auth.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    }).populate("user");

    if (!authRecord) {
      return {
        success: false,
        message: "Invalid or expired verification token",
      };
    }

    // Check if already verified
    if (authRecord.user.isEmailVerified) {
      return {
        success: false,
        message: "Email is already verified",
        isAlreadyVerified: true,
      };
    }

    // Update user as verified
    await User.findByIdAndUpdate(authRecord.user._id, {
      isEmailVerified: true,
    });

    // Clear verification token
    authRecord.emailVerificationToken = undefined;
    authRecord.emailVerificationExpires = undefined;
    await authRecord.save();

    // Send welcome email
    try {
      await EmailUtils.sendWelcomeEmail({
        userName: authRecord.user.fullName,
        email: authRecord.user.email,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the verification if welcome email fails
    }

    return {
      success: true,
      message: "Email verified successfully! You can now sign in.",
    };
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      success: false,
      message: "An error occurred during email verification",
    };
  }
};

export const resendVerificationEmail = async (
  email: string
): Promise<EmailVerificationResult> => {
  try {
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return {
        success: false,
        message: "Email is already verified",
        isAlreadyVerified: true,
      };
    }

    // Find auth record
    const authRecord = await Auth.findOne({ user: user._id });
    if (!authRecord) {
      return {
        success: false,
        message: "Authentication record not found",
      };
    }

    // Check resend attempts (limit to prevent spam)
    if (authRecord.emailVerificationAttempts >= 5) {
      return {
        success: false,
        message: "Too many verification attempts. Please contact support.",
      };
    }

    // Generate new verification token
    const { token, expires } = generateEmailVerificationToken();

    authRecord.emailVerificationToken = token;
    authRecord.emailVerificationExpires = expires;
    authRecord.emailVerificationAttempts += 1;
    await authRecord.save();

    // Send verification email
    try {
      await EmailUtils.sendEmailVerification({
        userName: user.fullName,
        email: user.email,
        verificationToken: token,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue anyway as token is saved
    }

    return {
      success: true,
      message: "Verification email sent successfully!",
    };
  } catch (error) {
    console.error("Resend verification email error:", error);
    return {
      success: false,
      message: "An error occurred while sending verification email",
    };
  }
};
