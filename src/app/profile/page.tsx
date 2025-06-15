import { auth } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import { getUserById } from "./_actions/profile";
import ProfileTabs from "./_components/ProfileTabs";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Profile Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Image
                  className="h-20 w-20 rounded-full object-cover"
                  src={user.avatar || "/api/placeholder/80/80"}
                  alt={user.fullName}
                  width={50}
                  height={50}
                />
                {user.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.fullName}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "teacher"
                        ? "bg-blue-100 text-blue-800"
                        : user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                  {user.isEmailVerified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Email Verified
                    </span>
                  )}
                  {user.isPhoneVerified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Phone Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <ProfileTabs user={user} />
        </div>
      </div>
    </div>
  );
}
