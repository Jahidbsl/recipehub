"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
// লটি ফাইলটি ইম্পোর্ট করা হলো
import notFoundAnim from "@/assets/pagenotfound - 404.json";

// SSR (Server-Side Rendering) ডিজেবল করে লটি প্লেয়ার লোড করা হচ্ছে 
// কারণ লটি উইন্ডো/ডকুমেন্ট অবজেক্ট ব্যবহার করে যা সার্ভারে থাকে না
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center dark:bg-zinc-950">
      <div className="w-full max-w-md md:max-w-lg">
        {/* লটি অ্যানিমেশন কন্টেইনার */}
        <div className="mx-auto h-64 w-full sm:h-80 md:h-96">
          <Lottie 
            animationData={notFoundAnim} 
            loop={true} 
            className="h-full w-full"
          />
        </div>

        {/* টেক্সট কন্টেন্ট */}
        <div className="mt-6 space-y-3">
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl dark:text-zinc-50">
            Oops! Page Not Found
          </h1>
          <p className="mx-auto max-w-sm text-sm text-neutral-500 dark:text-zinc-400">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* ব্যাক টু হোম বাটন */}
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