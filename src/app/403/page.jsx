"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

import warningAnim from "@/assets/Warning Status.json";


const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Forbidden() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-neutral-50 px-4 text-center dark:bg-zinc-950 transition-colors duration-300">
      <div className="w-full max-w-md md:max-w-lg">
        
        {/* Lotti */}
        <div className="mx-auto h-56 w-full sm:h-64 md:h-72">
          <Lottie 
            animationData={warningAnim} 
            loop={true} 
            className="h-full w-full"
          />
        </div>

        {/* text */}
        <div className="mt-4 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600 dark:bg-red-500/20 dark:text-red-400">
            403 Access Denied
          </div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl dark:text-zinc-50">
            Forbidden Area
          </h1>
          <p className="mx-auto max-w-sm text-sm text-neutral-500 dark:text-zinc-400">
            Sorry, you don't have admin privileges to access this page. If you think this is a mistake, please contact support.
          </p>
        </div>

        {/* back to home */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-green-600 px-6 font-semibold text-white shadow-md shadow-green-600/10 transition-all duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}