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
import Image from "next/image";

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
    } catch {
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
                    <Image
                      src="/icons/google-white.svg"
                      alt="Google"
                      height={20}
                      width={20}
                    />
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
