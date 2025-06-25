"use server";

import { connectDB } from "@/lib/connectDb";
import { Address, User } from "@/schema";
import { revalidatePath } from "next/cache";
import { IUser } from "@/types/user";
import { addressToObject, userToObject } from "@/lib/mongoToObj";

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

    const user = await User.findById(userId);

    if (!user) {
      return null;
    }

    return userToObject(user);
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

export async function deleteAvatar(userId: string) {
  try {
    await connectDB();

    const user = await User.findById(userId);

    if (!user)
      return {
        success: false,
        message: "User not found",
      };

    const currentAvatar = user.avatar;

    await User.findByIdAndUpdate(userId, { $unset: { avatar: "" } });

    if (!currentAvatar)
      return {
        success: true,
        message: "No avatar to delete",
      };

    revalidatePath("/profile");

    return {
      success: true,
      message: "Avatar deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting avatar:", error);
    return {
      success: false,
      message: error.message || "Failed to delete avatar",
    };
  }
}

export async function getAddresses(userId: string) {
  try {
    await connectDB();

    const addresses = await Address.find({ user: userId });

    if (!addresses || addresses.length === 0) {
      return {
        result: false,
        message: "No addresses found",
      };
    }

    return {
      result: true,
      addresses: addresses.map(addressToObject),
    };
  } catch (error: any) {
    return {
      result: false,
      message: error.message || "Failed to fetch addresses",
    };
  }
}

export async function addAddress(userId: string, addressData: any) {
  try {
    await connectDB();

    if (addressData.isDefault)
      await Address.updateMany(
        { user: userId, isDefault: true },
        { $set: { isDefault: false } }
      );

    const existingAddress = await Address.findOne({ user: userId });

    const newAddress = new Address({
      user: userId,
      ...addressData,
      isDefault: existingAddress ? addressData.isDefault : true,
    });

    await newAddress.save();

    revalidatePath("/profile");

    return {
      success: true,
      message: "Address added successfully",
      address: addressToObject(newAddress),
    };
  } catch (error: any) {
    console.error("Error adding address:", error);
    return {
      success: false,
      message: error.message || "Failed to add address",
    };
  }
}

export async function updateAddress(
  userId: string,
  addressId: string,
  addressData: any
) {
  try {
    await connectDB();

    if (addressData.isDefault)
      await Address.updateMany(
        { user: userId, isDefault: true },
        { $set: { isDefault: false } }
      );

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { ...addressData },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return {
        success: false,
        message: "Address not found",
      };
    }

    revalidatePath("/profile");

    return {
      success: true,
      message: "Address updated successfully",
      address: addressToObject(updatedAddress),
    };
  } catch (error: any) {
    console.error("Error updating address:", error);
    return {
      success: false,
      message: error.message || "Failed to update address",
    };
  }
}

export async function deleteAddress(userId: string, addressId: string) {
  try {
    await connectDB();

    const deletedAddress = await Address.findByIdAndDelete(addressId);

    const existingDefaultAddress = await Address.findOne({
      user: userId,
      isDefault: true,
    });

    if (!existingDefaultAddress)
      await Address.updateOne({ user: userId }, { isDefault: true });

    revalidatePath("/profile");

    if (!deletedAddress) {
      return {
        success: false,
        message: "Address not found",
      };
    }

    revalidatePath("/profile");

    return {
      success: true,
      message: "Address deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting address:", error);
    return {
      success: false,
      message: error.message || "Failed to delete address",
    };
  }
}
