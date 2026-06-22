// app/dashboard/page.jsx  →  Server Component (no "use client")

import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import UserDashboardPage from "./UserDashboardPage";

export default async function DashboardPage() {
  const user = await getUserSession();

  if (!user) redirect("/auth/signin");

  return <UserDashboardPage user={user} />;
}