"use client";

import { SubscriptionCard } from "../../components/SubscriptionCard";

export const dummy_data = [
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Active Subscriptions</h2>
          <p className="text-base-content/70">
            Manage and track your shared subscriptions
          </p>
        </div>
        <button
          onClick={() => console.log("Create new subscription")}
          className="btn btn-primary gap-2 hover:shadow-lg transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Subscription
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="stat bg-base-100 rounded-xl shadow-md hover:shadow-lg transition-all p-6">
          <div className="stat-title text-base-content/70">Total Active</div>
          <div className="stat-value mt-2">{dummy_data.length}</div>
          <div className="stat-desc mt-1">Subscriptions</div>
        </div>
        <div className="stat bg-base-100 rounded-xl shadow-md hover:shadow-lg transition-all p-6">
          <div className="stat-title text-base-content/70">Monthly Spend</div>
          <div className="stat-value text-primary mt-2">
            ₹
            {dummy_data
              .reduce(
                (acc, curr) =>
                  acc +
                  (curr.billingCycle === "MONTHLY"
                    ? curr.amount
                    : curr.amount / 12),
                0,
              )
              .toFixed(2)}
          </div>
          <div className="stat-desc mt-1">Average per month</div>
        </div>
        <div className="stat bg-base-100 rounded-xl shadow-md hover:shadow-lg transition-all p-6">
          <div className="stat-title text-base-content/70">Next Payment</div>
          <div className="stat-value text-secondary mt-2">₹849</div>
          <div className="stat-desc mt-1">Due in 5 days</div>
        </div>
      </div>

      {/* Subscription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummy_data.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            currentUserId="user_01" // Replace with actual user ID
            onPay={() =>
              console.log("Pay button clicked for:", subscription.id)
            }
            onEnableAutoPay={() =>
              console.log("Auto pay button clicked for:", subscription.id)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
