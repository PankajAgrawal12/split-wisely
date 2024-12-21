"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { HiHome } from "react-icons/hi";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { BiGroup } from "react-icons/bi";
import { dummy_data } from "./subscriptions/page";
import { useState } from "react";
import NewSubscriptionModal from "../components/NewSubscriptionModal";

const DashboardPage = () => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const quickStats = [
    {
      title: "Active Subscriptions",
      value: dummy_data.length,
      icon: <RiMoneyDollarCircleFill className="w-6 h-6" />,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Monthly Spend",
      value: `₹${dummy_data.reduce((acc, curr) => acc + (curr.billingCycle === "MONTHLY" ? curr.amount : curr.amount / 12), 0).toFixed(2)}`,
      icon: <HiHome className="w-6 h-6" />,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Active Groups",
      value: "3",
      icon: <BiGroup className="w-6 h-6" />,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-base-content/70">
            Here's what's happening with your subscriptions
          </p>
        </div>
        <div>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "size-10",
              },
            }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="card bg-base-100 shadow hover:shadow-lg transition-shadow"
          >
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
                <div>
                  <h3 className="card-title text-base">{stat.title}</h3>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/dashboard/subscriptions"
          className="card bg-primary text-primary-content shadow-lg hover:shadow-xl transition-all"
        >
          <div className="card-body">
            <h3 className="card-title">View All Subscriptions</h3>
            <p>Manage and track all your subscription payments</p>
            <div className="card-actions justify-end">
              <button className="btn btn-ghost">View →</button>
            </div>
          </div>
        </Link>
        <div className="card bg-secondary text-secondary-content shadow-lg hover:shadow-xl transition-all">
          <div className="card-body">
            <h3 className="card-title">Add New Subscription</h3>
            <p>Start tracking a new subscription with friends</p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-ghost"
                onClick={() => setIsModalOpen(true)}
              >
                Create →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Made by you */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">Upcoming payments</h2>
          <div className="space-y-3">
            {dummy_data.map((subscription) => (
              <div
                key={subscription.id}
                className="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {subscription.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{subscription.name}</p>
                    <p className="text-sm text-base-content/70">
                      {subscription.billingCycle.toLowerCase()} •{" "}
                      {subscription.splitType.toLowerCase()} split
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{subscription.amount}</p>
                  <p className="text-sm text-base-content/70">
                    {subscription.participants.length + 1} members
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <NewSubscriptionModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default DashboardPage;
