"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@heroui/react";
import { Trophy, ShieldCheck, Zap, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export default function ProcessSection() {
  const steps = [
    {
      icon: <Sparkles size={22} className="text-amber-500" />,
      title: "1. Discover Recipes",
      desc: "Explore thousands of community-verified gourmet and secret homemade dishes tailored to your taste.",
      bg: "bg-amber-500/10"
    },
    {
      icon: <Zap size={22} className="text-blue-500" />,
      title: "2. Master Cooking",
      desc: "Follow crystal-clear, step-by-step instructions and prep guides crafted by passionate culinary experts.",
      bg: "bg-blue-500/10"
    },
    {
      icon: <ShieldCheck size={22} className="text-emerald-500" />,
      title: "3. Share & Grow",
      desc: "Publish your own kitchen experiments, earn appreciation badges, and build your food community.",
      bg: "bg-emerald-500/10"
    }
  ];

  return (
    <section className="py-24 bg-neutral-50 dark:bg-zinc-950 border-y border-neutral-200/60 dark:border-zinc-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 bg-neutral-200/50 dark:bg-zinc-900 px-3 py-1 rounded-full">
            The Cooking Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            How RecipeHub Works
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
            From picking ingredients to serving the perfect platter—we make your culinary venture effortless.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants} className="relative h-full">
              <Card className="h-full p-6 flex flex-col justify-between border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-900 shadow-sm rounded-3xl group">
                <div className="space-y-4">
                  <div className={`w-12 h-12 ${step.bg} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
