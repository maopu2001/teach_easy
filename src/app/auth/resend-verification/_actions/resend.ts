"use server";

import { resendVerificationEmail as resendVerificationUtil } from "@/lib/email-verification";

export async function resendVerificationEmailAction(email: string) {
  return await resendVerificationUtil(email);
}
