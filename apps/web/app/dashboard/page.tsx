"use client";

import { useUser } from "@clerk/nextjs";

const Dashboard = () => {
  const { user } = useUser();

  return (
    <>
      <p>Dashboard</p>
      <h1>Hey </h1>
    </>
  );
};

export default Dashboard;
