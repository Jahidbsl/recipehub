import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/Dashboardsidebar";
import { getUserSession } from "@/lib/core/session";

export default async function DashboardLayout({ children }) {
  const user = await getUserSession();

  if (user?.isBlocked === true || user?.isBlocked === "true") {
    redirect("/auth/signin?error=Your+account+has+been+blocked+by+the+admin!+🚫");
  }

  return (
    <div className="flex min-h-screen">  
      <DashboardSidebar user={user} />
      <main className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-zinc-950">
        {children}
      </main>
    </div>
  );
}