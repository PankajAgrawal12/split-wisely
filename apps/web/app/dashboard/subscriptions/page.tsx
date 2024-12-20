"use client";

import { SubscriptionCard } from "../../components/SubscriptionCard";

const dummy_data = [
  {
    id: "507f1f77bcf86cd799439011",
    name: "Netflix Premium",
    description: "4K UHD streaming subscription shared with family",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    amount: 649,
    splitType: "EQUAL",
    billingCycle: "MONTHLY",
    owner: {
      id: "userO1",
      name: "Johnny",
    },
    participants: [
      { userId: "user_02" },
      { userId: "user_03" },
      { userId: "user_04" },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    isActive: true,
    reminderEnabled: true,
  },
  {
    id: "507f1f77bcf86cd799439012",
    name: "Spotify Family",
    description: "Music streaming family plan with 6 accounts",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2025-01-14"),
    amount: 199,
    splitType: "EQUAL",
    billingCycle: "MONTHLY",
    owner: {
      id: "userO1",
      name: "Johnny",
    },
    participants: [
      { userId: "user_01" },
      { userId: "user_03" },
      { userId: "user_04" },
      { userId: "user_05" },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    isActive: true,
    reminderEnabled: true,
  },
  {
    id: "507f1f77bcf86cd799439013",
    name: "Amazon Prime",
    description:
      "Annual subscription including Prime Video, Shopping, and Music",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2025-01-31"),
    amount: 1499,
    splitType: "PERCENTAGE",
    billingCycle: "YEARLY",
    owner: {
      id: "userO1",
      name: "Johnny",
    },
    participants: [{ userId: "user_02" }, { userId: "user_05" }],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    isActive: true,
    reminderEnabled: false,
  },
];

const Subscriptions = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Subscriptions</h1>
      <div className="grid grid-cols-2 mdmax:grid-cols-1 gap-6">
        {dummy_data.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            currentUserId="user_01" // Replace with actual user ID
            onPay={() => console.log("Pay button clicked")}
            onEnableAutoPay={() => console.log("Auto pay button clicked")}
          />
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
