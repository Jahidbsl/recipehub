"use client";

import { deleteRecipeAndReports, dismissReport } from "@/lib/actions/reports";
import { getAllReports } from "@/lib/api/reports";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllReports()
      .then((data) => {
        if (Array.isArray(data)) {
          setReports(data);
        } else if (data && Array.isArray(data.reports)) {
          setReports(data.reports);
        } else if (data && Array.isArray(data.data)) {
          setReports(data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch reports:", err);
        toast.error("Failed to load reports");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDismiss = async (reportId) => {
    try {
      const data = await dismissReport(reportId);
      if (data.success) {
        toast.success("Report dismissed! ✅");
        setReports((prev) => prev.filter((r) => r._id !== reportId));
      } else {
        toast.error(data.message || "Failed to dismiss report");
      }
    } catch (err) {
      toast.error("Failed to dismiss report");
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!confirm("Are you sure you want to delete this recipe permanently?")) return;

    try {
      const data = await deleteRecipeAndReports(recipeId);
      if (data.success) {
        toast.success("Recipe deleted and reports cleared! 🗑️");
        setReports((prev) => prev.filter((r) => r.recipeId !== recipeId));
      } else {
        toast.error(data.message || "Failed to delete recipe");
      }
    } catch (err) {
      toast.error("Failed to delete recipe");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[200px]">
        <p className="text-zinc-500 animate-pulse">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">
        Recipe Reports Dashboard
      </h1>
      
      {reports.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <p className="text-zinc-500 dark:text-zinc-400">No reports found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const recipeName = report.recipeDetails?.name || "Unknown Recipe";
            
            return (
              <div 
                key={report._id} 
                className="border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl bg-white shadow-sm dark:bg-zinc-900/50 space-y-3"
              >
                <div>
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">
                    Recipe: {recipeName}
                  </h3>
                  <p className="text-sm text-rose-600 dark:text-rose-400 font-semibold mt-1">
                    Reason: {report.reason}
                  </p>
                  {report.details && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      {report.details}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleDismiss(report._id)}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-sm font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Dismiss Report
                  </button>
                  <button
                    onClick={() => handleDeleteRecipe(report.recipeId)}
                    className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors"
                  >
                    Delete Recipe
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}