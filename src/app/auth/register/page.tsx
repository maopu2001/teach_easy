"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegistrationForm from "./_components/RegistrationForm";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center py-10 px-4">
      <Card className="mx-auto w-full max-w-md px-4">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <RegistrationForm />
          <div className="relative flex items-center justify-center">
            <span className="absolute inset-x-0 h-px bg-muted"></span>
            <span className="relative bg-card px-4 text-sm text-muted-foreground">
              or continue with
            </span>
          </div>

          {/* Social Registration */}
          <div className="grid grid-cols-1 gap-3">
            <Link href="/auth/register/google">
              <Button variant="outline" className="w-full">
                <Image
                  src="/icons/google.svg"
                  alt="Google"
                  height={20}
                  width={20}
                />
                Continue with Google
              </Button>
            </Link>
          </div>

          {/* Terms & Privacy */}
          <p className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              className="font-medium underline hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium underline hover:text-primary"
            >
              Privacy Policy
            </Link>
          </p>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
