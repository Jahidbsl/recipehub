"use client";

import React from "react";
import { 
  ChefHat, 
  Users, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Globe, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

// Framer Motion ভ্যারিয়েন্টস (অ্যানিমেশন রিইউজ করার জন্য)
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-50 transition-colors duration-300 overflow-hidden">
      
      {/* ১. হিরো সেকশন (Hero Section) */}
      <div className="relative py-24 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-b from-emerald-500/5 to-transparent">
        {/* ব্যাকগ্রাউন্ড গ্লো অ্যানিমেশন */}
        <div className="absolute inset-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-center pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl absolute -top-20 -right-20" 
          />
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-3xl absolute -bottom-20 -left-20" 
          />
        </div>

        {/* হিরো কন্টেন্ট অ্যানিমেশন */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative mx-auto max-w-3xl px-4 text-center space-y-6 sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Sparkles size={12} className="animate-pulse" /> Our Story & Mission
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl font-black tracking-tight text-neutral-950 dark:text-zinc-50 leading-tight">
            We are Revolutionizing <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              The Art of Cooking
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Welcome to our culinary hub! We connect food lovers, home chefs, and professionals worldwide to share recipes, discover exotic tastes, and master the kitchen.
          </motion.p>
        </motion.div>
      </div>

      {/* ২. কোর ভ্যালু বা স্ট্যাটস সেকশন (Scroll-triggered Cards) */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* কার্ড ১ */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 p-6 rounded-2xl shadow-sm space-y-4 transition-all duration-200 cursor-pointer"
          >
            <div className="p-3 w-fit rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500">
              <ChefHat size={24} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">10K+ Recipes</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              A continuously growing collection of diverse, curated, and mouth-watering culinary creations.
            </p>
          </motion.div>

          {/* কার্ড ২ */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 p-6 rounded-2xl shadow-sm space-y-4 transition-all duration-200 cursor-pointer"
          >
            <div className="p-3 w-fit rounded-xl bg-orange-50 dark:bg-orange-950/30 text-orange-500">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Global Community</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Thousands of passionate home cooks and master chefs inspiring each other daily.
            </p>
          </motion.div>

          {/* কার্ড ৩ */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 p-6 rounded-2xl shadow-sm space-y-4 transition-all duration-200 cursor-pointer"
          >
            <div className="p-3 w-fit rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-500">
              <Heart size={24} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Made with Love</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Every feature and algorithm is engineered to offer the best, personalized browsing experience.
            </p>
          </motion.div>

          {/* কার্ড ৪ */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 p-6 rounded-2xl shadow-sm space-y-4 transition-all duration-200 cursor-pointer"
          >
            <div className="p-3 w-fit rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-500">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Verified Creators</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Our premium plans ensure you get authentic recipes verified by certified food nutritionists.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* ৩. আওয়ার মিশন অ্যান্ড ভিশন (Left/Right Reveal Animation) */}
      <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* বাম দিকের টেক্সট অ্যানিমেশন */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-zinc-50">
              Empowering Anyone to Cook Like a Pro
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
              We believe that cooking shouldn't be intimidating. Our platform simplifies grocery planning, ingredient management, and step-by-step preparation so anyone can create premium meals at home.
            </p>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
              From fast 15-minute weekday meals to complex master-level gourmet desserts, our platform provides advanced sorting, dynamic scales, and instant cooking metrics for the modern era.
            </p>
            <div className="pt-2">
              <Link href="/recipes" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 group hover:underline">
                Explore Recipes 
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* ডান দিকের ইমেজ অ্যানিমেশন */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-72 sm:h-96 w-full overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-lg group"
          >
            <Image
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop"
              alt="Cooking Concept"
              fill
              className="object-cover opacity-90 dark:opacity-75 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full w-fit border border-white/10">
                <Globe size={12} className="animate-spin-slow" /> Founded in 2026
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ৪. কল টু অ্যাকশন সেকশন (Scale-up Viewport CTA) */}
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-8 sm:p-16 text-center space-y-6 relative overflow-hidden"
        >
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Start Your Cooking Journey?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Create a free account today to save your favorite recipes, create shopping lists, and track your kitchen insights.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 relative z-10">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link 
                href="/auth/signup" 
                className="px-6 py-3.5 inline-block rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/10 transition-colors duration-200"
              >
                Get Started Free
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link 
                href="/plans" 
                className="px-6 py-3.5 inline-block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-bold text-sm transition-colors duration-200"
              >
                View Pricing
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}