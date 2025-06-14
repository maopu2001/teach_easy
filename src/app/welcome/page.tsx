import { auth } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to TeachEasy! 🎉
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Hi {session.user.name}! Your account has been created successfully.
          </p>

          {isFromGoogle && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                ✅ Your Google account has been linked successfully.
                <br />✅ Your email ({session.user.email}) is already verified.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
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
                <h3 className="text-lg font-medium text-gray-900">
                  Complete Your Profile
                </h3>
                <p className="text-gray-600">
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
                <h3 className="text-lg font-medium text-gray-900">
                  Explore Courses
                </h3>
                <p className="text-gray-600">
                  Browse our extensive catalog of courses and start learning.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100">
                  <span className="text-sm font-medium text-indigo-600">3</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Join the Community
                </h3>
                <p className="text-gray-600">
                  Connect with other learners and instructors in our community.
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
              href="/courses"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse Courses
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
