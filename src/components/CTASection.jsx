"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { ChefHat, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 bg-white dark:bg-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 70 }}
          className="relative bg-zinc-950 dark:bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-8 sm:p-12 lg:p-16 text-center space-y-6 overflow-hidden shadow-2xl"
        >
          {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্ট */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

          {/* আইকন এনিমেশন */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-14 h-14 bg-zinc-800 text-emerald-400 mx-auto flex items-center justify-center rounded-2xl border border-zinc-700 shadow-inner"
          >
            <ChefHat size={28} />
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Have a Recipe of Your Own?
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Join thousands of home chefs sharing their culinary experiments
              daily. Get feedback, build your followers, and showcase your
              talent to the world.
            </p>
          </div>

          {/* বাটন অ্যাকশনস */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button
              asChild
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs py-5 px-8 rounded-xl flex items-center justify-center gap-2 group shadow-lg shadow-emerald-500/20"
            >
              <Link href="/dashboard/recipes/add">
                <PlusCircle size={14} />
                <span>Share Your Recipe</span>
              </Link>
            </Button>

            <Button
              asChild
              className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 font-bold text-xs py-5 px-8 rounded-xl flex items-center justify-center"
            >
              <Link href="/auth/signup">
                <span>Join as Member</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
