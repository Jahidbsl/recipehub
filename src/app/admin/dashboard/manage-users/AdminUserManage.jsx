"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck, Users, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { getUsers, patchUserBlockStatus } from "@/lib/api/user";

export default function AdminUserManage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

useEffect(() => {
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      
      
      const finalData = Array.isArray(data) ? data : (data?.data || []);
      setUsers(finalData);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Error loading users!");
    } finally {
      setLoading(false);
    }
  };
  fetchAllUsers();
}, []);

  const handleToggleBlock = async (user, userId) => {
    const stringId = typeof userId === "object" ? userId?.$oid : userId;
    const currentBlockStatus = user.isBlocked || false;
    const newBlockStatus = !currentBlockStatus;

    try {
      await patchUserBlockStatus(stringId, newBlockStatus);

      setUsers((prevUsers) =>
        prevUsers.map((u) => {
          const id = u._id?.$oid || u._id || u.id;
          return id === userId ? { ...u, isBlocked: newBlockStatus } : u;
        })
      );

      if (newBlockStatus) {
        toast.error(`Blocked account: ${user.email}`);
      } else {
        toast.success(`Unblocked account: ${user.email}`);
      }
    } catch (error) {
      console.error("Block request failed:", error);
      toast.error("Failed to update user status.");
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* হেডার */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Users /> User Management Center
          </h1>
        </div>

        {/* সার্চ কন্ট্রোল */}
        <div className="flex bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* ইউজার টেবিল */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
  <tr className="bg-neutral-50 dark:bg-zinc-800/30 border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs font-semibold uppercase">
    <th className="p-4">User Name</th>
    <th className="p-4">Email Address</th>
    <th className="p-4">Status</th>
    <th className="p-4 text-right">Actions</th>
  </tr>
</thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-zinc-400 animate-pulse">
                    Loading system users...
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-zinc-400">
                    No users found!
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => {
                  const userId = user._id?.$oid || user._id || user.id;
                  const isBlocked = user.isBlocked || false;

                  return (
                    <tr
                      key={userId}
                      className="border-b border-zinc-100 dark:border-zinc-800/40 hover:bg-neutral-50/50 dark:hover:bg-zinc-800/10"
                    >
                      {/* ১. নাম কলাম */}
                      <td className="p-4 font-bold text-zinc-900 dark:text-zinc-50">
                        {user.name || "N/A"}
                      </td>
                      
                      {/* ২. ইমেইল কলাম (নতুন যুক্ত করা হয়েছে) */}
                      <td className="p-4 text-zinc-600 dark:text-zinc-400 font-medium">
                        {user.email}
                      </td>

                      {/* ৩. স্ট্যাটাস কলাম */}
                      <td className="p-4">
                        {isBlocked ? (
                          <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
                            Blocked
                          </span>
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </td>

                      {/* ৪. অ্যাকশন বাটন কলাম */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleBlock(user, userId)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all inline-flex items-center gap-1 ${
                            isBlocked
                              ? "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 shadow-sm"
                              : "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 text-rose-500 hover:bg-rose-500 hover:text-white"
                          }`}
                        >
                          {isBlocked ? (
                            <>
                              <ShieldCheck size={14} /> Unblock User
                            </>
                          ) : (
                            <>
                              <ShieldAlert size={14} /> Block User
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* পেজিনেশন ফুটার */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-zinc-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-800/10">
              <span className="text-xs text-zinc-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-semibold px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}