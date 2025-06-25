"use client";

import { useState } from "react";
import ProfileInfo from "./ProfileInfo";
import AccountSettings from "./AccountSettings";
import OrderHistory from "./OrderHistory";
import SecuritySettings from "./SecuritySettings";
import Addresses from "./Addresses";
import { useRouter, useSearchParams } from "next/navigation";

interface ProfileTabsProps {
  user: any;
}

const tabs = [
  { id: "profile", name: "Profile Information", icon: "👤" },
  { id: "addresses", name: "Addresses", icon: "🏠" },
  { id: "settings", name: "Account Settings", icon: "⚙️" },
  { id: "orders", name: "Order History", icon: "📦" },
  { id: "security", name: "Security", icon: "🔒" },
];

export default function ProfileTabs({ user }: ProfileTabsProps) {
  const router = useRouter();
  const query = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    (query.get("tab") as string) || "profile"
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo user={user} />;
      case "addresses":
        return <Addresses user={user} />;
      case "settings":
        return <AccountSettings user={user} />;
      case "orders":
        return <OrderHistory user={user} />;
      case "security":
        return <SecuritySettings user={user} />;
      default:
        return <ProfileInfo user={user} />;
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/profile?tab=${tabId}`);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Tab Navigation */}
      <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-border">
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible p-4 space-x-2 lg:space-x-0 lg:space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <span className="mr-2 text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4 sm:p-6">{renderTabContent()}</div>
    </div>
  );
}
