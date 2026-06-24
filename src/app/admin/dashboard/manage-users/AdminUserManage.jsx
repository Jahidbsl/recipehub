"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck, Users, Search, ChevronLeft, ChevronRight, Loader2, UserX } from "lucide-react";
import { toast } from "react-toastify";
import { getUsers, patchUserBlockStatus } from "@/lib/api/user";

export default function AdminUserManage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // রেসপন্সিভ গ্রিডের জন্য ৬ করা হয়েছে

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

  // ⚡ ইনস্ট্যান্ট ব্লক/আনব্লক হ্যান্ডলার (Optimistic UI Update)
  const handleToggleBlock = async (user, userId) => {
    const stringId = typeof userId === "object" ? userId?.$oid : userId;
    if (!stringId) return toast.error("Invalid User ID");

    const currentBlockStatus = user.isBlocked || false;
    const newBlockStatus = !currentBlockStatus;

    // ব্যাকএন্ড ফেইল করলে ব্যাকআপ ফিরিয়ে আনার জন্য
    const previousUsers = [...users];

    // ১. স্ক্রিনে সাথে সাথে স্টেট আপডেট করা
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        const currentId = u._id?.$oid || u._id || u.id;
        // এখানে ফিক্স করা হয়েছে: stringId এর সাথে তুলনা
        return currentId === stringId ? { ...u, isBlocked: newBlockStatus } : u;
      })
    );

    // ২. সাথে সাথে সঠিক টোস্ট মেসেজ দেখানো
    if (newBlockStatus) {
      toast.error(`Blocked account: ${user.email}`);
    } else {
      toast.success(`Unblocked account: ${user.email}`);
    }

    try {
      // ৩. ব্যাকএন্ড এপিআই কল
      await patchUserBlockStatus(stringId, newBlockStatus);
    } catch (error) {
      // ফেইল করলে আগের রোলব্যাক করা
      setUsers(previousUsers);
      console.error("Block request failed:", error);
      toast.error("Server error: Failed to update user status.");
    }
  };

  // 🔍 সার্চ ফিল্টারিং
  const filteredUsers = users.filter((user) => {
    return (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // 📄 পেজিনেশন ক্যালকুলেশন
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 p-4 sm:p-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* 👑 আকর্ষণীয় প্রিমিয়াম হেডার কার্ড */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 dark:from-rose-950 dark:to-zinc-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
              <Users className="h-8 w-8 animate-pulse" /> User Management Center
            </h1>
            <p className="text-rose-100/80 text-sm font-medium">
              Monitor system access, enforce security policies, or restrict accounts instantly.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold">
            Registered Users: {users.length}
          </div>
        </div>

        {/* 🛠️ সার্চ কন্ট্রোল এরিয়া */}
        <div className="flex bg-white dark:bg-zinc-900 p-4 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
            />
          </div>
        </div>

        {/* 📊 ডেটা টেবিল ও মোবাইল কার্ড কন্টেইনার */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          
          {/* 💻 ডেস্কটপ টেবিল ভিউ (Hidden on Mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">User Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-zinc-400клад">
                      <Loader2 className="h-7 w-7 animate-spin mx-auto mb-2 text-rose-500" />
                      Loading platform users...
                    </td>
                  </tr>
                ) : currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-zinc-400 font-medium">
                      <UserX className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      No system users found!
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => {
                    const userId = user._id?.$oid || user._id || user.id;
                    const isBlocked = user.isBlocked || false;

                    return (
                      <tr key={userId} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="p-4 pl-6 font-bold text-zinc-800 dark:text-zinc-200">
                          {user.name || "Anonymous User"}
                        </td>
                        <td className="p-4 text-zinc-600 dark:text-zinc-400 font-medium">
                          {user.email}
                        </td>
                        <td className="p-4">
                          {isBlocked ? (
                            <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                              Blocked
                            </span>
                          ) : (
                            <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right pr-6">
                          <button
                            onClick={() => handleToggleBlock(user, userId)}
                            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all inline-flex items-center gap-1.5 shadow-sm ${
                              isBlocked
                                ? "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600"
                                : "bg-white dark:bg-zinc-800 border-rose-200 dark:border-rose-900/60 text-rose-500 hover:bg-rose-500 hover:text-white"
                            }`}
                          >
                            {isBlocked ? (
                              <>
                                <ShieldCheck size={14} /> Unblock
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
          </div>

          {/* 📱 মোবাইল রেসপন্সিভ কার্ড ভিউ (Visible only on Mobile) */}
          <div className="block md:hidden p-4 space-y-4">
            {loading ? (
              <div className="p-8 text-center text-zinc-400">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-rose-500" />
                Loading users...
              </div>
            ) : currentUsers.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 text-sm">No users found!</div>
            ) : (
              currentUsers.map((user) => {
                const userId = user._id?.$oid || user._id || user.id;
                const isBlocked = user.isBlocked || false;

                return (
                  <div key={userId} className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{user.name || "Anonymous User"}</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      <div>
                        {isBlocked ? (
                          <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                            Blocked
                          </span>
                        ) : (
                          <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-200/50 dark:border-zinc-800">
                      <button
                        onClick={() => handleToggleBlock(user, userId)}
                        className={`w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                          isBlocked
                            ? "bg-emerald-500 text-white border-emerald-600"
                            : "bg-white dark:bg-zinc-800 border-rose-200 dark:border-rose-900/60 text-rose-500"
                        }`}
                      >
                        {isBlocked ? (
                          <>
                            <ShieldCheck size={14} /> Unblock Account
                          </>
                        ) : (
                          <>
                            <ShieldAlert size={14} /> Block Account
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 🏁 পেজিনেশন ফুটার */}
          {!loading && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 border-t border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/20">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Showing <span className="font-bold text-zinc-700 dark:text-zinc-300">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-bold text-zinc-700 dark:text-zinc-300">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of{" "}
                <span className="font-bold text-zinc-700 dark:text-zinc-300">{filteredUsers.length}</span> users
              </span>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-sm transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 px-3 py-1.5 border dark:border-zinc-700 rounded-xl shadow-sm">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-sm transition-all"
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