import React from "react";

import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import MyPurchases from "./MyPurchases";

const DashboardMypurchases = async () => {
  const user = await getUserSession().catch(() => null);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full">
      <MyPurchases user={user} />
    </div>
  );
};

export default DashboardMypurchases;
