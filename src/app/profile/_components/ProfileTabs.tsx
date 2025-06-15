"use client";

import { useState } from "react";
import ProfileInfo from "./ProfileInfo";
import AccountSettings from "./AccountSettings";
import OrderHistory from "./OrderHistory";
import SecuritySettings from "./SecuritySettings";

interface ProfileTabsProps {
  user: any;
}

const tabs = [
  { id: "profile", name: "Profile Information", icon: "👤" },
  { id: "settings", name: "Account Settings", icon: "⚙️" },
  { id: "orders", name: "Order History", icon: "📦" },
  { id: "security", name: "Security", icon: "🔒" },
];

export default function ProfileTabs({ user }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo user={user} />;
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

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Tab Navigation */}
      <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-200">
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible p-4 space-x-4 lg:space-x-0 lg:space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6">{renderTabContent()}</div>
    </div>
  );
}
