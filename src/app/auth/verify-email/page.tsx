import { verifyEmailToken } from "@/lib/email-verification";
import Image from "next/image";
import Link from "next/link";

interface VerifyEmailPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex items-center justify-center bg-background">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-foreground">
              Invalid Verification Link
            </h2>
            <p className="mt-2 text-sm">
              The verification link is missing or invalid.
            </p>
            <div className="mt-6">
              <Link
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/50"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const result = await verifyEmailToken(token);

  return (
    <div className="flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {result.success ? (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Image
                  src="/icons/tick.svg"
                  alt="Tick"
                  width={50}
                  height={50}
                />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-foreground">
                Email Verified!
              </h2>
              <p className="mt-2 text-sm text-foreground">{result.message}</p>
              <div className="mt-6">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/50"
                >
                  Sign In Now
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 p-1 rounded-full bg-primary/20">
                <Image
                  src="/icons/cross.svg"
                  alt="Cross"
                  width={50}
                  height={50}
                />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-foreground">
                Verification Failed
              </h2>
              <p className="mt-2 text-sm text-foreground">{result.message}</p>
              <div className="mt-6 space-y-3">
                {result.isAlreadyVerified ? (
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign In
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/resend-verification"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Resend Verification Email
                    </Link>
                    <div>
                      <Link
                        href="/auth/register"
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        Or create a new account
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
