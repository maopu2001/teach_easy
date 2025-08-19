"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const resendSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResendFormData = z.infer<typeof resendSchema>;

export default function ResendVerificationPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const form = useForm<ResendFormData>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResendFormData) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage(result.message);
        form.reset();
      } else {
        setError(result.error || "Failed to send verification email");
      }
    } catch {
      setError("An error occurred while sending verification email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-foreground">
            Resend Verification Email
          </h2>
          <p className="mt-2 text-center text-sm">
            Enter your email address and we&apos;ll send you a new verification
            link
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded border border-red-200 bg-primary/40 p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded border border-green-200 bg-green-600 p-3 text-sm text-black dark:text-white">
                {message}
              </div>
            )}

            <FormInput
              control={form.control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="your.email@example.com"
              autoComplete="email"
              required
            />

            <Button type="submit" className="w-full -mt-2" disabled={loading}>
              {loading ? "Sending..." : "Send Verification Email"}
            </Button>

            <div className="text-center space-y-2">
              <Link
                href="/auth/login"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Back to Sign In
              </Link>
              <div>
                <Link
                  href="/auth/register"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Create a new account
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
