import { auth } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface WelcomePageProps {
  searchParams: Promise<{
    source?: string;
  }>;
}

export default async function WelcomePage({ searchParams }: WelcomePageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const isFromGoogle = (await searchParams).source === "google";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <Image src="/icons/tick.svg" alt="Tick" width={50} height={50} />
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to TeachEasy! 🎉
          </h1>

          <p className="text-xl text-foreground/80 mb-8">
            Hi {session.user.name}! Your account has been created successfully.
          </p>

          {isFromGoogle && (
            <div className="bg-card border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm space-y-2">
                <span>
                  ✅ Your Google account has been linked successfully.
                </span>
                <br />
                <span>✅ Your email ({session.user.email}) is verified.</span>
              </p>
            </div>
          )}
        </div>

        <div className="bg-card rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            What&apos;s Next?
          </h2>

          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100">
                  <span className="text-sm font-medium text-indigo-600">1</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  Complete Your Profile
                </h3>
                <p className="text-foreground/80">
                  Add more details to your profile to get personalized
                  recommendations.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100">
                  <span className="text-sm font-medium text-indigo-600">2</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  Explore Products
                </h3>
                <p className="text-foreground/80">
                  Browse our extensive catalog of products.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profile"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Complete Profile
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse Products
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            You can access your dashboard anytime by clicking{" "}
            <Link
              href="/dashboard"
              className="text-indigo-600 hover:text-indigo-500"
            >
              here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
