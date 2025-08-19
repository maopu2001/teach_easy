import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { User, Auth } from "@/schema";
import { generateEmailVerificationToken } from "@/lib/email-verification";
import EmailUtils from "@/lib/email-utils";
import { randomBytes } from "crypto";
import { z } from "zod";

const registrationSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    role: z.enum(["customer", "teacher"], {
      errorMap: () => ({ message: "Please select a role" }),
    }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registrationSchema.parse(body);

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: validatedData.email.toLowerCase(),
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = await User.create({
      fullName: validatedData.fullName,
      email: validatedData.email.toLowerCase(),
      role: validatedData.role,
      isActive: true,
      isVerified: validatedData.role === "teacher" ? false : true,
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
      password: validatedData.password,
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

    return NextResponse.json({
      success: true,
      message:
        "Account created successfully! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "An unexpected error occurred during registration" },
      { status: 500 }
    );
  }
}