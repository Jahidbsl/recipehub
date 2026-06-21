import DashboardSidebar from "@/components/Dashboardsidebar";
import { getUserSession } from "@/lib/core/session";

// app/dashboard/layout.jsx
export default async function DashboardLayout({ children }) {
 const user = await getUserSession()

  return (
    <div className="flex min-h-screen">  
      <DashboardSidebar user={user} />
      <main className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-zinc-950">
        {children}
      </main>
    </div>
  );
}