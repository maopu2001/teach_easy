"use server";

import { connectDB } from "@/lib/connectDb";
import { User } from "@/schema";
import { revalidatePath } from "next/cache";
import { IUser } from "@/types/user";

export interface ProfileFormData {
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  bio?: string;
}

export interface PreferencesFormData {
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  newsletter: boolean;
}

export async function getUserById(userId: string): Promise<IUser | null> {
  try {
    await connectDB();

    const user = await User.findById(userId).lean();

    if (!user) {
      return null;
    }

    // Convert MongoDB _id to string and format dates
    return {
      ...user,
      _id: (user as any)._id.toString(),
      createdAt: (user as any).createdAt?.toISOString(),
      updatedAt: (user as any).updatedAt?.toISOString(),
      lastLoginAt: (user as any).lastLoginAt?.toISOString(),
      lastActiveAt: (user as any).lastActiveAt?.toISOString(),
      dateOfBirth: (user as any).dateOfBirth?.toISOString(),
    } as unknown as IUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function updateProfile(userId: string, data: ProfileFormData) {
  try {
    await connectDB();

    const updateData: any = {
      fullName: data.fullName,
      bio: data.bio,
    };

    if (data.phone) updateData.phone = data.phone;
    if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.gender) updateData.gender = data.gender;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    revalidatePath("/profile");

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: error.message || "Failed to update profile",
    };
  }
}

export async function updatePreferences(
  userId: string,
  data: PreferencesFormData
) {
  try {
    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { preferences: data },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    revalidatePath("/profile");

    return {
      success: true,
      message: "Preferences updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating preferences:", error);
    return {
      success: false,
      message: error.message || "Failed to update preferences",
    };
  }
}

export async function uploadAvatar(userId: string, avatarUrl: string) {
  try {
    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    );

    if (!updatedUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    revalidatePath("/profile");

    return {
      success: true,
      message: "Avatar updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating avatar:", error);
    return {
      success: false,
      message: error.message || "Failed to update avatar",
    };
  }
}
