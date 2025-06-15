"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      await signIn("google", {
        callbackUrl: "/",
      });
    } catch {
      toast.error("An error occurred while signing in with Google");
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      <Image src="/icons/google.svg" alt="Google" height={20} width={20} />
      {isLoading ? "Signing in..." : "Continue with Google"}
    </Button>
  );
}
