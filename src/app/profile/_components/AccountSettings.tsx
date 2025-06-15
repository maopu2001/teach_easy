"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormSelect, FormCheckbox } from "@/components/forms";
import { updatePreferences, PreferencesFormData } from "../_actions/profile";
import { toast } from "sonner";

const preferencesSchema = z.object({
  currency: z.string(),
  language: z.string(),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
    marketing: z.boolean(),
  }),
  newsletter: z.boolean(),
});

interface AccountSettingsProps {
  user: any;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      currency: user.preferences?.currency || "BDT",
      language: user.preferences?.language || "en",
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

  const currencyOptions = [
    { value: "BDT", label: "BDT (৳)" },
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
  ];

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "bn", label: "বাংলা" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* General Preferences */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              General Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                control={form.control}
                name="currency"
                label="Preferred Currency"
                options={currencyOptions}
              />

              <FormSelect
                control={form.control}
                name="language"
                label="Language"
                options={languageOptions}
              />
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
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

          {/* Account Status */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Account Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Status
                </label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Status
                </label>
                <div className="space-y-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                      user.isEmailVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    Email {user.isEmailVerified ? "Verified" : "Pending"}
                  </span>
                  {user.phone && (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isPhoneVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      Phone {user.isPhoneVerified ? "Verified" : "Pending"}
                    </span>
                  )}
                </div>
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
                  Last Active
                </label>
                <p className="text-gray-900">
                  {user.lastActiveAt
                    ? new Date(user.lastActiveAt).toLocaleString()
                    : "Never"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
