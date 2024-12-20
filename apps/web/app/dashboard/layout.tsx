"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Nav, { NavItemType } from "../components/Nav/Nav";

import { HiHome } from "react-icons/hi";
import { RiMoneyDollarCircleFill } from "react-icons/ri";

export const navItems: NavItemType[] = [
  {
    name: "Home",
    icon: HiHome,
    path: "/dashboard",
  },
  {
    name: "Subscriptions",
    icon: RiMoneyDollarCircleFill,
    path: "/dashboard/subscriptions",
  },
];

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useUser();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        {/* Logo */}
        <div className="flex items-center p-4 border-b">
          <div className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xl font-semibold text-gray-800">
              Splitwisely
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <Nav items={navItems} />

        {/* User Profile - Bottom */}
        <div className="absolute bottom-0 w-64 p-4">
          <div className="backdrop-blur-lg bg-white/30 rounded-lg p-3 shadow-lg border border-gray-200">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() =>
                document
                  .querySelector<HTMLElement>('[aria-label="Menu"]')
                  ?.click()
              }
            >
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-6",
                    // userButtonTrigger: "hidden",
                  },
                }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {user?.firstName || "Loading..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-scroll">{children}</div>
    </div>
  );
};

export default DashboardLayout;
