"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormSelect, FormTextarea } from "@/components/forms";
import { updateProfile, ProfileFormData } from "../_actions/profile";
import { toast } from "sonner";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

interface ProfileInfoProps {
  user: any;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName || "",
      phone: user.phone || "",
      dateOfBirth: user.dateOfBirth?.split("T")[0] || "",
      gender: user.gender || undefined,
      bio: user.bio || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      const result = await updateProfile(user._id, data);

      if (result.success) {
        toast.success(result.message);
        setIsEditing(false);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ];

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Profile Information
          </h2>
          <Button onClick={() => setIsEditing(true)} variant="outline">
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <p className="text-gray-900">{user.fullName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-gray-900">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <p className="text-gray-900">{user.phone || "Not provided"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <p className="text-gray-900">
              {user.dateOfBirth
                ? new Date(user.dateOfBirth).toLocaleDateString()
                : "Not provided"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <p className="text-gray-900 capitalize">
              {user.gender?.replace("_", " ") || "Not provided"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Member Since
            </label>
            <p className="text-gray-900">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {user.bio && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <p className="text-gray-900">{user.bio}</p>
          </div>
        )}

        {/* Stats Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Account Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">
                {user.stats?.totalOrders || 0}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">
                ৳{user.stats?.totalSpent || 0}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">
                {user.stats?.loyaltyPoints || 0}
              </div>
              <div className="text-sm text-gray-600">Loyalty Points</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">
                {user.stats?.reviewsCount || 0}
              </div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Edit Profile Information
        </h2>
        <Button
          onClick={() => setIsEditing(false)}
          variant="outline"
          disabled={loading}
        >
          Cancel
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              control={form.control}
              name="fullName"
              label="Full Name"
              placeholder="Enter your full name"
              required
            />

            <FormInput
              control={form.control}
              name="phone"
              label="Phone Number"
              placeholder="+880 1X XXX XXXXX"
              type="tel"
            />

            <FormInput
              control={form.control}
              name="dateOfBirth"
              label="Date of Birth"
              type="text"
            />

            <FormSelect
              control={form.control}
              name="gender"
              label="Gender"
              placeholder="Select gender"
              options={genderOptions}
            />
          </div>

          <FormTextarea
            control={form.control}
            name="bio"
            label="Bio"
            placeholder="Tell us about yourself..."
            rows={4}
          />

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
