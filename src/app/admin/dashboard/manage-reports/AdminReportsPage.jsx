"use client";

import { deleteRecipeAndReports, dismissReport } from "@/lib/actions/reports";
import { getAllReports } from "@/lib/api/reports";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Trash2, AlertTriangle, X } from "lucide-react";

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

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
      if (data.success || data.message?.includes("success") || data) { 
        toast.success("Report dismissed! ✅");
        setReports((prev) => prev.filter((r) => r._id !== reportId));
      } else {
        toast.error(data.message || "Failed to dismiss report");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to dismiss report");
    }
  };

  const openDeleteModal = (recipeId) => {
    if (!recipeId) {
      toast.error("Recipe ID not found!");
      return;
    }
    setSelectedRecipeId(recipeId);
    setIsModalOpen(true);
  };

  const confirmDeleteRecipe = async () => {
    if (!selectedRecipeId) return;

    try {
      const data = await deleteRecipeAndReports(selectedRecipeId);
      if (data.success || data) {
        toast.success("Recipe deleted and reports cleared! 🗑️");
        
        setReports((prev) => 
          prev.filter((r) => {
            const currentRecipeId = typeof r.recipeId === 'object' ? r.recipeId?._id : r.recipeId;
            return currentRecipeId !== selectedRecipeId;
          })
        );
      } else {
        toast.error(data.message || "Failed to delete recipe");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete recipe");
    } finally {
      setIsModalOpen(false);
      setSelectedRecipeId(null);
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
    <div className="p-6 relative">
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
            const actualRecipeId = typeof report.recipeId === 'object' ? report.recipeId?._id : report.recipeId;
            
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
                    onClick={() => openDeleteModal(actualRecipeId)}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors shadow-sm shadow-rose-600/20"
                  >
                    <Trash2 size={16} /> Delete Recipe
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 transform transition-all scale-100">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Delete Recipe Permanently?
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Are you sure you want to delete this recipe? This action cannot be undone and will clear all associated user reports.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-sm rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteRecipe}
                className="px-5 py-2.5 bg-rose-600 text-white font-semibold text-sm rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}