"use client";
import { deleteRecipeAndReports, dismissReport } from "@/lib/actions/reports";
import { getAllReports } from "@/lib/api/reports";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getAllReports().then((data) => {
      if (Array.isArray(data)) setReports(data);
    });
  }, []);

  // ১. Dismiss অ্যাকশন হ্যান্ডলার
  const handleDismiss = async (reportId) => {
    try {
      const data = await dismissReport(reportId);
      if (data.success) {
        toast.success("Report dismissed! ✅");
        setReports((prev) => prev.filter((r) => r._id !== reportId));
      }
    } catch (err) {
      toast.error("Failed to dismiss report");
    }
  };

  // ২. Delete Recipe অ্যাকশন হ্যান্ডলার
  const handleDeleteRecipe = async (recipeId) => {
    if (!confirm("Are you sure you want to delete this recipe permanently?")) return;

    try {
      const data = await deleteRecipeAndReports(recipeId);
      if (data.success) {
        toast.error("Recipe deleted and reports cleared! 🗑️");
        // ওই রেসিপির যতগুলো রিপোর্ট UI-তে আছে সব ফিল্টার আউট করে দেওয়া হচ্ছে
        setReports((prev) => prev.filter((r) => r.recipeId !== recipeId));
      }
    } catch (err) {
      toast.error("Failed to delete recipe");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recipe Reports Dashboard</h1>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="border p-4 rounded-lg bg-white shadow-sm dark:bg-zinc-900">
              <h3 className="font-semibold text-lg">
                Recipe: {report.recipeDetails?.title || "Unknown or Already Deleted"}
              </h3>
              <p className="text-sm text-red-500 font-medium">Reason: {report.reason}</p>
              {report.details && <p className="text-sm text-gray-600 dark:text-gray-400">Details: {report.details}</p>}
              
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleDismiss(report._id)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded text-sm font-medium hover:bg-gray-300"
                >
                  Dismiss Report
                </button>
                <button
                  onClick={() => handleDeleteRecipe(report.recipeId)}
                  className="px-3 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
                >
                  Delete Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}