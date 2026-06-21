"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { reportRecipe } from "@/lib/actions/recipes";

const REASONS = [
  "Inappropriate content",
  "Spam or misleading",
  "Copyright violation",
  "Incorrect information",
  "Other",
];

export function ReportModal({ recipeId, userId, onClose }) {
  const [reason,  setReason]  = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  async function handleSubmit() {
    if (!reason) return alert("Please select a reason");
    if (!userId) return alert("Please login first!");
    setLoading(true);
    await reportRecipe(recipeId, userId, reason, details);
    setLoading(false);
    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Report Recipe</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center space-y-2">
            <p className="text-2xl">✅</p>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">Report submitted</p>
            <p className="text-sm text-zinc-400">We will review it shortly.</p>
            <button onClick={onClose} className="mt-4 px-5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-medium">
              Close
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Reason</label>
              <div className="space-y-2">
                {REASONS.map((r) => (
                  <label key={r} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="accent-zinc-900 dark:accent-zinc-50"
                    />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Details <span className="text-zinc-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Write more details here if you want..."
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}