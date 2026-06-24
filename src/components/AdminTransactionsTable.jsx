"use client";

import { getAdminTransactions } from "@/lib/api/recipes";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminTransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔢 Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const result = await getAdminTransactions();

        if (result && result.success) {
          setTransactions(result.data || []);
        } else {
          console.error("Payload execution failed:", result);
          toast.error(
            result?.message ||
              "Data fetching system tracking anomaly detected! ❌",
          );
        }
      } catch (err) {
        console.error("Client side handler crash error:", err);
        toast.error("Internal server resolution pipeline error!");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // 🧮 Pagination Formulas
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      // ⏳ Loading State Section (Height significantly reduced)
      <div className="flex justify-center items-center py-10 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-gray-100 dark:border-slate-900">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-emerald-500"></div>
        <span className="ml-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Loading Financial Ledger...
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-gray-100 dark:border-slate-900 transition-colors duration-300">
      <ToastContainer position="top-right" autoClose={2500} />

      {/* Header Container Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
            Financial Transactions 💳
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Total Logs Tracked: {transactions.length}
          </p>
        </div>
      </div>

      {/* 📊 Compact Data Grid Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-slate-800/80">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-800 text-left">
          <thead className="bg-gray-50/70 dark:bg-slate-900/40">
            <tr className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-800">
              <th className="py-2.5 px-4">Transaction ID</th>
              <th className="py-2.5 px-4">User Email / Source</th>
              <th className="py-2.5 px-4">Amount</th>
              <th className="py-2.5 px-4">Date</th>
              <th className="py-2.5 px-4">Payment Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-950 divide-y divide-gray-100 dark:divide-slate-800/60 text-xs text-gray-600 dark:text-gray-300">
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-gray-400 dark:text-gray-500 font-medium"
                >
                  No payment transactions captured in the database yet! 📂
                </td>
              </tr>
            ) : (
              currentItems.map((tx) => (
                <tr
                  key={tx.transactionId}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors duration-150"
                >
                  {/* ID */}
                  <td className="py-2 px-4 font-mono text-[11px] text-blue-600 dark:text-blue-400 select-all font-medium">
                    {tx.transactionId}
                  </td>

                  {/* User Profile Info */}
                  <td className="py-2 px-4 font-medium text-gray-800 dark:text-gray-200">
                    <div className="flex flex-col">
                      <span className="truncate max-w-[220px]">{tx.user}</span>
                      <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wide bg-gray-50 dark:bg-slate-900 px-1 py-0.2 rounded w-max border border-gray-100 dark:border-slate-800/50">
                        {tx.type}
                      </span>
                    </div>
                  </td>

                  {/* Cash Flow Value */}
                  <td className="py-2 px-4 font-bold text-gray-900 dark:text-white text-sm">
                    ${tx.amount.toFixed(2)}
                  </td>

                  {/* Timestamp Logging */}
                  <td className="py-2 px-4 text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {tx.date
                      ? new Date(tx.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </td>

                  {/* Status Badges */}
                  <td className="py-2 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        tx.status?.toLowerCase() === "success" ||
                        tx.status?.toLowerCase() === "active"
                          ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full mr-1 ${
                          tx.status?.toLowerCase() === "success" ||
                          tx.status?.toLowerCase() === "active"
                            ? "bg-green-500"
                            : "bg-amber-500"
                        }`}
                      ></span>
                      {tx.status?.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🎛️ Compact Pagination Controls Wrapper */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-900 bg-white dark:bg-slate-950 px-2 py-3 mt-3 transition-colors duration-300">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-900 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-900 disabled:opacity-40"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between text-xs">
            <div>
              <p className="text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {indexOfLastItem > transactions.length
                    ? transactions.length
                    : indexOfLastItem}
                </span>{" "}
                of <span className="font-semibold text-gray-800 dark:text-gray-200">{transactions.length}</span> results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm bg-white dark:bg-slate-950"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md border border-gray-200 dark:border-slate-800 px-2 py-1 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-900/60 disabled:opacity-30 transition-colors"
                >
                  ⬅️
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`relative inline-flex items-center px-3 py-1 font-medium border transition-colors ${
                      currentPage === index + 1
                        ? "z-10 bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500"
                        : "bg-white text-gray-600 border-gray-200 dark:bg-slate-950 dark:text-gray-400 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-900/60"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md border border-gray-200 dark:border-slate-800 px-2 py-1 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-900/60 disabled:opacity-30 transition-colors"
                >
                  ➡️
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}