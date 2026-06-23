"use client";

import React from "react";
import Lottie from "lottie-react";

import loading from "@/assets/loading_gray.json"

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-colors duration-300">
      {/* Lottie Container */}
      <div className="w-48 h-48 sm:w-64 sm:h-64 relative flex items-center justify-center">
        <Lottie
          animationData={loading}
          loop={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      
      {/* Loading Text */}
      <p className="mt-2 text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 animate-pulse">
        Loading Deliciousness...
      </p>
    </div>
  );
}