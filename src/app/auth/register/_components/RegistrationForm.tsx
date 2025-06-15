"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput, FormSelect } from "@/components/forms";
import { registerEmail } from "../_actions/register";
import { toast } from "sonner";

const registrationSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    role: z.enum(["customer", "teacher"], {
      errorMap: () => ({ message: "Please select a role" }),
    }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegistrationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "customer",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setLoading(true);
    setError("");

    try {
      const result = await registerEmail(data);

      if (result.success) {
        toast.success(result.message, {
          duration: 5000,
        });
        router.push("/");
      }
    } catch (err) {
      setError(
        (err as Error).message ||
          "An error occurred during registration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "customer", label: "Customer" },
    { value: "teacher", label: "Teacher" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <FormInput
          control={form.control}
          name="fullName"
          label="Full Name"
          placeholder="M. Aktaruzzaman Opu"
          autoComplete="name"
          required
        />

        <FormInput
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="your.email@example.com"
          autoComplete="email"
          required
        />

        <FormSelect
          control={form.control}
          name="role"
          label="Role"
          placeholder="Select a role"
          options={roleOptions}
          required
        />

        <FormInput
          control={form.control}
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
        />

        <FormInput
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}
