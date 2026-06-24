"use client";
import { getAdminTransactions } from "@/lib/api/recipes";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Action path-ti thikmoto import kore niben apnar folder framework setup tracking layout onujayi


export default function AdminTransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔢 Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Direct Server Action invoking method, client manual localstorage lagbe na
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
      <div className="flex justify-center items-center p-20 bg-slate-50 dark:bg-slate-950/40 rounded-xl">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
        <span className="ml-3 font-semibold text-gray-600 dark:text-gray-300">
          Loading Secure Financial Ledger... ⏳
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-gray-100 dark:border-slate-900 transition-colors duration-300">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
            Financial Transactions 💳
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total Logs Tracked: {transactions.length}
          </p>
        </div>
      </div>

      {/* 📊 Data Grid Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800 text-left">
          <thead className="bg-gray-50 dark:bg-slate-900/50">
            <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b dark:border-slate-800">
              <th className="p-4">Transaction ID</th>
              <th className="p-4">User Email / Source</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
              <th className="p-4">Payment Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-950 divide-y divide-gray-200 dark:divide-slate-800 text-sm text-gray-600 dark:text-gray-300">
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-12 text-gray-400 dark:text-gray-500 font-medium"
                >
                  No payment transactions captured in the system database yet!
                  📂
                </td>
              </tr>
            ) : (
              currentItems.map((tx) => (
                <tr
                  key={tx.transactionId}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition"
                >
                  {/* ID */}
                  <td className="p-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold select-all">
                    {tx.transactionId}
                  </td>

                  {/* User Profile Info */}
                  <td className="p-4 font-medium text-gray-900 dark:text-white">
                    <div className="flex flex-col">
                      <span>{tx.user}</span>
                      <span className="text-[11px] font-normal text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wide bg-gray-100 dark:bg-slate-900 px-1.5 py-0.5 rounded w-max">
                        {tx.type}
                      </span>
                    </div>
                  </td>

                  {/* Cash Flow Value */}
                  <td className="p-4 font-bold text-gray-900 dark:text-white text-base">
                    ${tx.amount.toFixed(2)}
                  </td>

                  {/* Timestamp Logging */}
                  <td className="p-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
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
                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        tx.status?.toLowerCase() === "success" ||
                        tx.status?.toLowerCase() === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
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

      {/* 🎛️ Dynamic Pagination Controls Wrapper */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 sm:px-2 mt-4 transition-colors duration-300">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {indexOfFirstItem + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {indexOfLastItem > transactions.length
                    ? transactions.length
                    : indexOfLastItem}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {transactions.length}
                </span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  ⬅️
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold border ${
                      currentPage === index + 1
                        ? "z-10 bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500"
                        : "bg-white text-gray-700 border-gray-300 dark:bg-slate-900 dark:text-gray-300 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-40"
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
