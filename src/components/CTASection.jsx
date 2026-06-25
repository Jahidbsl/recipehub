"use client";
import React from "react";
import { motion } from "framer-motion";
import { ChefHat, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 bg-zinc-50 dark:bg-zinc-950 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 70 }}
          className="relative bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-[28px] p-8 sm:p-12 text-center space-y-6 overflow-hidden shadow-xl dark:shadow-2xl"
        >
          {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্ট (Light ও Dark মোডে মানানসই) */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/5 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 dark:bg-amber-500/5 blur-[100px] pointer-events-none rounded-full" />

          {/* আইকন এনিমেশন */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-12 h-12 bg-emerald-50 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center rounded-xl border border-emerald-100 dark:border-zinc-700 shadow-sm"
          >
            <ChefHat size={24} />
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-2.5">
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              Have a Recipe of Your Own?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg mx-auto">
              Join thousands of home chefs sharing their culinary experiments
              daily. Get feedback, build your followers, and showcase your
              talent to the world.
            </p>
          </div>

          {/* বাটন অ্যাকশনস (সাইজ ছোট ও প্রিমিয়াম করা হয়েছে) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <Link
              href="/dashboard/recipes/add"
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white dark:text-white font-bold text-xs py-3 px-5 rounded-xl flex items-center justify-center gap-2 group shadow-md shadow-emerald-500/10 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle size={14} />
              <span>Share Your Recipe</span>
            </Link>

            <Link
              href="/auth/signup"
              className="w-full sm:w-auto bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 font-bold text-xs py-3 px-6 rounded-xl flex items-center justify-center shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Join as Member</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}