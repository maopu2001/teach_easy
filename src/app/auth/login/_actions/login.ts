"use server";
import { connectDB } from "@/lib/connectDb";
import { Auth } from "@/schema/auths";
import { User } from "@/schema/users";

export interface LoginResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatar?: string;
  };
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        message: "Account is deactivated. Please contact support.",
      };
    }

    // Find auth record
    const auth = await Auth.findOne({ user: user._id });
    if (!auth) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Verify password
    const isPasswordCorrect = auth.correctPassword(password, auth.password);
    if (!isPasswordCorrect) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Check if email is verified (optional, depending on your requirements)
    if (!user.isEmailVerified) {
      return {
        success: false,
        message: "Please verify your email address before signing in.",
      };
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, {
      lastLoginAt: new Date(),
    });

    return {
      success: true,
      message: "Login successful",
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
      },
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      success: false,
      message: "An error occurred during authentication",
    };
  }
}

export async function getUserById(userId: string) {
  try {
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatar: user.avatar,
      isActive: user.isActive,
      emailVerified: user.isEmailVerified,
    };
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}
