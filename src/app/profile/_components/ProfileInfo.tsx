"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormInput,
  FormDate,
  FormSelect,
  FormTextarea,
} from "@/components/forms";
import { updateProfile, ProfileFormData } from "../_actions/profile";
import { toast } from "sonner";
import { IUser } from "@/types";
import { format } from "date-fns";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

interface ProfileInfoProps {
  user: IUser;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName || "",
      phone: user.phone || "",
      dateOfBirth: user.dateOfBirth
        ? format(new Date(user.dateOfBirth), "dd MMMM, yyyy")
        : "",
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

  return (
    <div className="space-y-6">
      {/* Header */}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <h2 className="inline-flex items-center text-xl font-semibold text-foreground h-10">
            {isEditing ? "Edit Profile Information" : "Profile Information"}
          </h2>

          <div
            className={`flex flex-col sm:flex-row justify-end gap-3 ${
              isEditing && "order-2 sm:col-span-2"
            }`}
          >
            {isEditing ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(true)}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Edit Profile
              </Button>
            )}
            {isEditing && (
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 col-span-1 sm:col-span-2">
            <FormInput
              disabled={!isEditing}
              control={form.control}
              name="fullName"
              label="Full Name"
              placeholder="Enter your full name"
              required
            />

            <FormInput
              disabled={!isEditing}
              control={form.control}
              name="phone"
              label="Phone Number"
              placeholder="+880 1X XXX XXXXX"
              type="tel"
            />

            <FormDate
              disabled={!isEditing}
              control={form.control}
              name="dateOfBirth"
              label="Date of Birth"
              // placeholder="DD-MM-YYYY"
            />

            <FormSelect
              disabled={!isEditing}
              control={form.control}
              name="gender"
              label="Gender"
              placeholder="Select gender"
              options={genderOptions}
            />

            <FormTextarea
              className="sm:col-span-2"
              disabled={!isEditing}
              control={form.control}
              name="bio"
              label="Bio"
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
        </form>
      </Form>
      <AccountStatistics user={user} />
    </div>
  );
}

const AccountStatistics = ({ user }: { user: IUser }) => {
  return (
    <div className="border-t border-border pt-6">
      <h3 className="text-lg font-medium text-foreground mb-4">
        Account Statistics
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-muted p-4 rounded-lg text-center">
          <div className="text-lg sm:text-2xl font-bold text-foreground">
            {user.stats?.totalOrders || 0}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Total Orders
          </div>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <div className="text-lg sm:text-2xl font-bold text-foreground">
            ৳{user.stats?.totalSpent || 0}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Total Spent
          </div>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <div className="text-lg sm:text-2xl font-bold text-foreground">
            {user.stats?.loyaltyPoints || 0}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Loyalty Points
          </div>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <div className="text-lg sm:text-2xl font-bold text-foreground">
            {user.stats?.reviewsCount || 0}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Reviews
          </div>
        </div>
      </div>
    </div>
  );
};
