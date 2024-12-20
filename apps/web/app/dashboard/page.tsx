"use client";

import { useUser } from "@clerk/nextjs";

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div>
      <h1>Welcome, {user?.firstName}</h1>
      <ul>
        <li>Show upcoming payments</li>
        <li>Show active groups</li>
      </ul>
    </div>
  );
};

export default Dashboard;
