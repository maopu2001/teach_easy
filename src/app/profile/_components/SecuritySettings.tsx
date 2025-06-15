"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms";
import { toast } from "sonner";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

interface SecuritySettingsProps {
  user: any;
}

export default function SecuritySettings({ user }: SecuritySettingsProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    try {
      // TODO: Implement password change API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay

      toast.success("Password updated successfully");
      form.reset();
    } catch {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>

      {/* Password Change */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Change Password
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              control={form.control}
              name="currentPassword"
              label="Current Password"
              type="password"
              placeholder="Enter your current password"
              required
            />

            <FormInput
              control={form.control}
              name="newPassword"
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              required
            />

            <FormInput
              control={form.control}
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="Confirm your new password"
              required
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Security Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Security Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Created
            </label>
            <p className="text-gray-900">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Login
            </label>
            <p className="text-gray-900">
              {user.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString()
                : "Never"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Login Attempts
            </label>
            <p className="text-gray-900">{user.loginAttempts || 0}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Status
            </label>
            <div className="space-y-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
              {user.isBlocked && (
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Blocked
                  </span>
                  {user.blockReason && (
                    <p className="text-sm text-red-600 mt-1">
                      Reason: {user.blockReason}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Two-Factor Authentication
        </h3>
        <p className="text-gray-600 mb-4">
          Add an extra layer of security to your account by enabling two-factor
          authentication.
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">2FA Status</p>
            <p className="text-sm text-gray-600">
              Two-factor authentication is currently disabled
            </p>
          </div>
          <Button variant="outline">Enable 2FA</Button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Active Sessions
        </h3>
        <p className="text-gray-600 mb-4">
          These are the devices that are currently logged into your account.
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                🖥️
              </div>
              <div>
                <p className="font-medium text-gray-900">Current Session</p>
                <p className="text-sm text-gray-600">
                  Chrome on macOS • Last active now
                </p>
              </div>
            </div>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-900">Deactivate Account</p>
              <p className="text-sm text-red-700">
                Temporarily disable your account. You can reactivate it anytime.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Deactivate
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-900">Delete Account</p>
              <p className="text-sm text-red-700">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
