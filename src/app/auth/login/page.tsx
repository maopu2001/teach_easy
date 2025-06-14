import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./_components/LoginForm";
import GoogleSignInButton from "./_components/GoogleSignInButton";

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center py-10 px-4">
      <Card className="mx-auto w-full max-w-md px-4">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <LoginForm />

          <div className="relative flex items-center justify-center">
            <span className="absolute inset-x-0 h-px bg-muted"></span>
            <span className="relative bg-card px-4 text-sm text-muted-foreground">
              or continue with
            </span>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-1 gap-3">
            <GoogleSignInButton />
          </div>

          {/* Terms & Privacy */}
          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
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
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
          <div className="text-center text-sm">
            <Link
              href="/auth/reset-password"
              className="font-medium text-muted-foreground hover:text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
