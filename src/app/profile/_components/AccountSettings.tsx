"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormCheckbox } from "@/components/forms";
import { updatePreferences, PreferencesFormData } from "../_actions/profile";
import { toast } from "sonner";
import { IUser } from "@/types";
import { format } from "date-fns";

const preferencesSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
    marketing: z.boolean(),
  }),
  newsletter: z.boolean(),
});

interface AccountSettingsProps {
  user: IUser;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      notifications: {
        email: user.preferences?.notifications?.email ?? true,
        sms: user.preferences?.notifications?.sms ?? true,
        push: user.preferences?.notifications?.push ?? true,
        marketing: user.preferences?.notifications?.marketing ?? true,
      },
      newsletter: user.preferences?.newsletter ?? false,
    },
  });

  const onSubmit = async (data: PreferencesFormData) => {
    setLoading(true);
    try {
      const result = await updatePreferences(user._id, data);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">
        Account Settings
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Account Status */}
          <div className="bg-muted p-4 sm:p-6 rounded-lg">
            <h3 className="text-lg font-medium text-foreground mb-4">
              Account Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Account Status
                </label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Verification Status
                </label>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isEmailVerified
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    Email {user.isEmailVerified ? "Verified" : "Pending"}
                  </span>
                  {user.phone && (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isPhoneVerified
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      Phone {user.isPhoneVerified ? "Verified" : "Pending"}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Last Login
                </label>
                <p className="text-muted-foreground text-sm">
                  {user.lastLoginAt
                    ? format(
                        new Date(user.lastLoginAt),
                        "dd MMMM, yyyy; hh:mm a"
                      )
                    : "Never"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Last Active
                </label>
                <p className="text-muted-foreground text-sm">
                  {user.lastActiveAt
                    ? format(
                        new Date(user.lastActiveAt),
                        "dd MMMM, yyyy; hh:mm a"
                      )
                    : "Never"}
                </p>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-muted p-4 sm:p-6 rounded-lg">
            <h3 className="text-lg font-medium text-foreground mb-4">
              Notification Preferences
            </h3>
            <div className="space-y-4">
              <FormCheckbox
                control={form.control}
                name="notifications.email"
                label="Email Notifications"
                description="Receive notifications via email"
              />

              <FormCheckbox
                control={form.control}
                name="notifications.sms"
                label="SMS Notifications"
                description="Receive notifications via SMS"
              />

              <FormCheckbox
                control={form.control}
                name="notifications.push"
                label="Push Notifications"
                description="Receive push notifications on your device"
              />

              <FormCheckbox
                control={form.control}
                name="notifications.marketing"
                label="Marketing Communications"
                description="Receive marketing emails and promotions"
              />

              <FormCheckbox
                control={form.control}
                name="newsletter"
                label="Newsletter Subscription"
                description="Subscribe to our newsletter for updates and offers"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
