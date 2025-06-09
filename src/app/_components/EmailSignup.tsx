"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email signup logic here
    console.log("Email signup:", email);
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-2">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
      />
      <Button
        type="submit"
        className="bg-primary hover:bg-primary/70 text-white"
      >
        Get Started
      </Button>
    </form>
  );
}
