"use client";
import { useEffect, useState } from "react";
import { Card } from "@heroui/react";
import { Users, BookOpen, AlertTriangle, ShieldAlert, Clock } from "lucide-react";
import { getUsers } from "@/lib/api/user";
import { getRecipes } from "@/lib/api/recipes";
import { getAllReports } from "@/lib/api/reports";


export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalReports: 0,
    blockedUsers: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getUsers().catch(() => []),
      getRecipes().catch(() => []),
      getAllReports().catch(() => [])
    ])
      .then(([usersData, recipesData, reportsData]) => {
        const users = Array.isArray(usersData) ? usersData : [];
        const recipes = Array.isArray(recipesData) ? recipesData : [];
        const reports = Array.isArray(reportsData) ? reportsData : [];

        const blocked = users.filter((u) => u.isBlocked === true || u.isBlocked === "true").length;

        setStats({
          totalUsers: users.length,
          totalRecipes: recipes.length,
          totalReports: reports.length,
          blockedUsers: blocked,
        });

        setRecentReports(reports.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-zinc-950">
        <p className="text-lg font-medium text-neutral-500 animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-neutral-50 dark:bg-zinc-950 min-h-screen space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-sm text-neutral-500">Real-time platform metrics and monitoring dashboard.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-row items-center justify-between border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Users</span>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">{stats.totalUsers}</h2>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-blue-600 dark:text-blue-400">
            <Users size={24} />
          </div>
        </Card>

        <Card className="p-4 flex flex-row items-center justify-between border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Recipes</span>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">{stats.totalRecipes}</h2>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-xl text-green-600 dark:text-green-400">
            <BookOpen size={24} />
          </div>
        </Card>

        <Card className="p-4 flex flex-row items-center justify-between border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Active Reports</span>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">{stats.totalReports}</h2>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl text-red-600 dark:text-red-400">
            <AlertTriangle size={24} />
          </div>
        </Card>

        <Card className="p-4 flex flex-row items-center justify-between border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Restrictions</span>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{stats.blockedUsers} Blocked</h2>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-amber-600 dark:text-amber-400">
            <ShieldAlert size={24} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-5 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" /> Recent Infractions & Reports
            </h3>
            <span className="text-xs bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 px-2 py-1 rounded font-medium">Action Required</span>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {recentReports.length === 0 ? (
              <p className="text-sm text-neutral-400 py-4">No active user or recipe reports found.</p>
            ) : (
              recentReports.map((report) => (
                <div key={report._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1 max-w-2xl">
                    <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      {report.recipeDetails?.title || "Archived/Deleted Recipe"}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Reason: <span className="text-red-500 font-semibold">{report.reason}</span>
                    </p>
                    {report.details && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 p-2 rounded mt-1">
                        Context: {report.details}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-neutral-400 sm:flex-shrink-0">
                    <Clock size={12} />
                    <span>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "Pending"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}