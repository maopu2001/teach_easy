"use client";

import { useState } from "react";
import ProfileTabs from "./ProfileTabs";
import AvatarUpload from "./AvatarUpload";
import { IUser } from "@/types";

interface ProfileClientProps {
  initialUser: IUser;
}

export default function ProfileClient({ initialUser }: ProfileClientProps) {
  const [user, setUser] = useState(initialUser);

  return (
    <div className="min-h-screen bg-background py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-lg shadow-md border border-border">
          {/* Profile Header */}
          <div className="px-4 sm:px-6 py-6 sm:py-8 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative flex-shrink-0">
                <AvatarUpload
                  userId={user._id}
                  currentAvatar={user.avatar}
                  userName={user.fullName}
                  setUser={setUser}
                />
                {user.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                    <svg
                      className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground"
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
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                  {user.fullName}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-1 truncate">
                  {user.email}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "teacher"
                        ? "bg-primary/10 text-primary"
                        : user.role === "admin"
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                  {user.isEmailVerified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Email Verified
                    </span>
                  )}
                  {user.isPhoneVerified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
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
