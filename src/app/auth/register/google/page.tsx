"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormSelect } from "@/components/forms";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerGoogle } from "../_actions/register";
import Link from "next/link";

const roleSchema = z.object({
  role: z.enum(["customer", "teacher"], {
    required_error: "Please select a role",
  }),
});

type RoleFormData = z.infer<typeof roleSchema>;

export default function GoogleRegistrationPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role: "customer",
    },
  });

  const onSubmit = async (data: RoleFormData) => {
    setLoading(true);
    setError("");

    try {
      // Call registerGoogle with the selected role
      await registerGoogle(data.role);
    } catch (err) {
      console.error("Google registration error:", err);
      setError("An error occurred during registration. Please try again.");
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: "customer",
      label: "Customer",
    },
    {
      value: "teacher",
      label: "Teacher",
    },
  ];

  return (
    <div className="flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Join TeachEasy with Google
          </h2>
          <p className="mt-2 text-sm text-foreground">
            Choose your role to get started
          </p>
        </div>

        <div className="bg-card py-8 px-6 shadow rounded-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <FormSelect
                control={form.control}
                name="role"
                label="I want to join as a"
                placeholder="Select your role"
                options={roleOptions}
                description="You can change this later in your profile settings"
                required
              />

              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  "Connecting to Google..."
                ) : (
                  <>
                    <svg className="size-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:text-primary/80"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:text-primary/80"
                  >
                    Privacy Policy
                  </Link>
                </p>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                  <p className="text-sm text-foreground mt-2">
                    Prefer email registration?{" "}
                    <Link
                      href="/auth/register"
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Register with email
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
