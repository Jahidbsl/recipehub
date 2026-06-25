"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Home Chef Enthusiast",
    image: "https://ibb.co.com/N6vXhv3y",
    review: "This platform completely changed how I organize my weekly meals. The smart dynamic portions scaling works flawlessly every single time!",
    rating: 5
  },
  {
    name: "Marcus Thorne",
    role: "Restaurant Consultant",
    image: "https://ibb.co.com/5hBQdG0M",
    review: "As a professional, I appreciate the clean UI and deep recipe analytics. Managing premium culinary content has never been this intuitive.",
    rating: 5
  },
  {
    name: "Elena Rostova",
    role: "Food Blogger & Stylist",
    image: "https://ibb.co.com/xqNPYvkw",
    review: "I love the community features and verified badges. It brings massive authenticity to recipes and allows food lovers to connect genuinely.",
    rating: 5
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-neutral-50/30 dark:bg-zinc-950/20 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
            Wall of Love
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Trusted by Cooks Worldwide
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            Don't just take our word for it—see what our vibrant cooking community has to say.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((user, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="relative p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="absolute top-6 right-8 text-zinc-100 dark:text-zinc-800 pointer-events-none">
                <Quote size={40} className="transform rotate-180 fill-current" />
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: user.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-current" />
                  ))}
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 italic leading-relaxed">
                  "{user.review}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                <div className="relative h-11 w-11 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <Image 
                    src={`${user.image.replace("ibb.co.com", "i.ibb.co.com")}.png`}
                    alt={user.name} 
                    fill 
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                    {user.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-medium">
                    {user.role}
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}