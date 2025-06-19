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
      <h2 className="text-xl font-semibold text-foreground">
        Security Settings
      </h2>

      {/* Password Change */}
      <div className="bg-muted p-4 sm:p-6 rounded-lg">
        <h3 className="text-lg font-medium text-foreground mb-4">
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Security Information */}
      <div className="bg-muted p-4 sm:p-6 rounded-lg">
        <h3 className="text-lg font-medium text-foreground mb-4">
          Security Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Account Created
            </label>
            <p className="text-muted-foreground text-sm">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Last Login
            </label>
            <p className="text-muted-foreground text-sm">
              {user.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString()
                : "Never"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Login Attempts
            </label>
            <p className="text-muted-foreground text-sm">
              {user.loginAttempts || 0}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Account Status
            </label>
            <div className="space-y-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
              {user.isBlocked && (
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                    Blocked
                  </span>
                  {user.blockReason && (
                    <p className="text-sm text-destructive mt-1">
                      Reason: {user.blockReason}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
