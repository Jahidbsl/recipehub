"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Stylesheet for proper rendering

export default function AdminTransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔢 Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/admin/transactions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const result = await res.json();
        
        if (res.ok && result.success) {
          setTransactions(result.data);
        } else {
          toast.error(result.message || "Transactions load failed! ❌");
        }
      } catch (err) {
        console.error(err);
        toast.error("Network error, something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // 🧮 Pagination Calculations
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
      <div className="flex justify-center items-center p-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
        <span className="ml-3 font-semibold text-gray-600">Loading Financial Ledger... ⏳</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {/* 🔔 ToastContainer layout element injection */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Financial Transactions 💳</h2>
          <p className="text-sm text-gray-500 mt-1">Total Logs Tracked: {transactions.length}</p>
        </div>
      </div>

      {/* 📊 Data Grid Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-gray-50">
            <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500 border-b">
              <th className="p-4">Transaction ID</th>
              <th className="p-4">User Email / Source</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
              <th className="p-4">Payment Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-600">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-8 text-gray-400 font-medium">
                  No payment transactions captured in the system database yet!
                </td>
              </tr>
            ) : (
              currentItems.map((tx) => (
                <tr key={tx.transactionId} className="hover:bg-slate-50/70 transition">
                  <td className="p-4 font-mono text-xs text-blue-600 font-semibold select-all">
                    {tx.transactionId}
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    <div className="flex flex-col">
                      <span>{tx.user}</span>
                      <span className="text-[11px] font-normal text-gray-400 mt-0.5 uppercase tracking-wide bg-gray-100 px-1.5 py-0.5 rounded w-max">
                        {tx.type}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-900 text-base">
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="p-4 text-gray-500 whitespace-nowrap">
                    {tx.date ? new Date(tx.date).toLocaleDateString("en-US", {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
                    }) : "N/A"}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      tx.status?.toLowerCase() === "success" || tx.status?.toLowerCase() === "active"
                        ? "bg-green-100 text-green-800" 
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        tx.status?.toLowerCase() === "success" || tx.status?.toLowerCase() === "active" ? "bg-green-500" : "bg-amber-500"
                      }`}></span>
                      {tx.status?.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🎛️ Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-4 sm:px-2 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-semibold">
                  {indexOfLastItem > transactions.length ? transactions.length : indexOfLastItem}
                </span>{" "}
                of <span className="font-semibold">{transactions.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  ⬅️
                </button>
                
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold border ${
                      currentPage === index + 1
                        ? "z-10 bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40"
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