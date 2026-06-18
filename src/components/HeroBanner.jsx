"use client";

import { motion } from "framer-motion";
import { ArrowRight, Utensils, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import Lottie from "lottie-react";
import chefAnimation from "@/assets/Chef.json";

export default function HeroBanner() {
  // Framer Motion অ্যানিমেশন ভেরিয়েন্ট
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-neutral-50 dark:bg-zinc-950 text-neutral-900 dark:text-white px-4 sm:px-6 lg:px-8 transition-colors duration-300 py-12 md:py-0">
      
      {/* ব্যাকগ্রাউন্ড ডেকোরেশন (Glowing Orbs) */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/10 dark:bg-green-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* মেইন কন্টেনার - ২ কলাম বিশিষ্ট গ্রিড লেআউট */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6 items-center z-10">
        
        {/* লেফট সাইড: টেক্সট কন্টেন্ট */}
        <motion.div
          className="text-center md:text-left max-w-2xl mx-auto md:mx-0 order-2 md:order-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* টপ ব্যাজ */}
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 dark:bg-white/5 border border-green-500/20 dark:border-white/10 backdrop-blur-md mb-6 text-sm font-medium text-green-700 dark:text-emerald-400"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Your Ultimate Culinary Community</span>
          </motion.div>

          {/* মেইন হেডিং */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 dark:text-white mb-6 leading-[1.15]"
          >
            Share Recipes, <br />
            <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 dark:from-green-400 dark:via-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">
              Inspire Foodies
            </span>
          </motion.h1>

          {/* সাবটাইটেল */}
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg text-neutral-600 dark:text-zinc-400 mb-10 leading-relaxed"
          >
            Discover thousands of mouth-watering recipes, publish your own culinary masterpieces, and connect with a community of passionate home chefs and professionals.
          </motion.p>

          {/* অ্যাকশন বাটনসমূহ */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
          >
            <Link href="/recipes" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0px 10px 25px rgba(16, 185, 129, 0.25)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all group"
              >
                Explore Recipes
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/dashboard" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 bg-neutral-200/60 hover:bg-neutral-200 dark:bg-white/5 border border-neutral-300/50 dark:border-white/10 hover:border-neutral-400/50 dark:hover:border-white/20 font-semibold rounded-xl text-neutral-800 dark:text-white transition-all"
              >
                Share Your Recipe
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* রাইট সাইড: লটি অ্যানিমেশন কম্পোনেন্ট */}
        <motion.div 
          className="w-full flex justify-center items-center order-1 md:order-2 max-w-[280px] sm:max-w-[400px] md:max-w-none mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-full h-full aspect-square flex items-center justify-center">
            <Lottie 
              animationData={chefAnimation} 
              loop={true}
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

      </div>

      {/* ব্যাকগ্রাউন্ড গ্রিড ওভারলে */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />
    </div>
  ); 
}