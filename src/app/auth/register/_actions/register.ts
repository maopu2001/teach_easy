"use server";
import { signIn } from "@/lib/next-auth";
import { RegistrationFormData } from "../_components/RegistrationForm";
import { connectDB } from "@/lib/connectDb";
import { User, Auth } from "@/schema";
import { generateEmailVerificationToken } from "@/lib/email-verification";
import EmailUtils from "@/lib/email-utils";
import { randomBytes } from "crypto";

export async function registerEmail(data: RegistrationFormData) {
  try {
    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: data.email.toLowerCase(),
    });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new user
    const newUser = await User.create({
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      role: data.role,
      isActive: true,
      isVerified: data.role === "teacher" ? false : true,
      isEmailVerified: false,
      isPhoneVerified: false,
      isBlocked: false,
    });

    // Generate email verification token
    const { token: emailVerificationToken, expires: emailVerificationExpires } =
      generateEmailVerificationToken();

    // Create auth record
    await Auth.create({
      user: newUser._id,
      password: data.password,
      emailVerificationToken,
      emailVerificationExpires,
      emailVerificationAttempts: 0,
      passwordResetAttempts: 0,
    });

    // Send verification email
    try {
      await EmailUtils.sendEmailVerification({
        userName: newUser.fullName,
        email: newUser.email,
        verificationToken: emailVerificationToken,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail registration if email sending fails
    }

    return {
      success: true,
      message:
        "Account created successfully! Please check your email to verify your account.",
    };
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("An unexpected error occurred during registration");
  }
}

export async function registerGoogle(
  role: "customer" | "teacher" = "customer"
) {
  const { cookies } = await import("next/headers");

  const cookieStore = await cookies();
  cookieStore.set("pending-role", role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
  });

  await signIn("google");
}

export async function handleGoogleSignUp(
  googleUserData: {
    email: string;
    name: string;
    image?: string;
  },
  role: "customer" | "teacher" = "customer"
) {
  try {
    await connectDB();

    const existingUser = await User.findOne({
      email: googleUserData.email.toLowerCase(),
    });

    if (existingUser) {
      await User.findByIdAndUpdate(existingUser._id, {
        lastLoginAt: new Date(),
        lastActiveAt: new Date(),
      });

      return {
        success: true,
        message: "Welcome back!",
        userId: existingUser._id.toString(),
        isNewUser: false,
      };
    }

    const newUser = await User.create({
      fullName: googleUserData.name,
      email: googleUserData.email.toLowerCase(),
      role: role,
      isVerified: role === "teacher" ? false : true,
      avatar: googleUserData.image || undefined,
      isEmailVerified: true,
      lastLoginAt: new Date(),
      lastActiveAt: new Date(),
    });

    await Auth.create({
      user: newUser._id,
      password: randomBytes(8).toString("hex"), // Random password for Google users
      emailVerificationAttempts: 0,
      passwordResetAttempts: 0,
    });

    try {
      await EmailUtils.sendWelcomeEmail({
        userName: newUser.fullName,
        email: newUser.email,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return {
      success: true,
      message: "Account created successfully! Welcome to TeachEasy!",
      userId: newUser._id.toString(),
      isNewUser: true,
    };
  } catch (error) {
    console.error("Google registration error:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("An unexpected error occurred during Google registration");
  }
}
