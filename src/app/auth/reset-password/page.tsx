"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms";
import { toast } from "sonner";

const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      // TODO: Implement password reset logic
      console.log("Reset password for:", data.email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setEmailSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("An error occurred while sending the reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center py-10 px-4">
      <Card className="mx-auto w-full max-w-md px-4">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            {emailSent
              ? "Check your email for reset instructions"
              : "Enter your email address to reset your password"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!emailSent ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormInput
                  control={form.control}
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Email"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                If an account with that email exists, we&apos;ve sent you a
                password reset link.
              </p>
              <Button
                onClick={() => setEmailSent(false)}
                variant="outline"
                className="w-full"
              >
                Send Another Email
              </Button>
            </div>
          )}

          <div className="text-center text-sm space-y-2">
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
