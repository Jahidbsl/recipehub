"use client";

import { Utensils, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-zinc-950 text-neutral-600 dark:text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Brand Brand Identity */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-50">
              <span>RecipeHub</span>
              <span><UtensilsCrossed className="w-4 h-4" /></span>
            </Link>
            <p className="text-sm text-neutral-500 max-w-xs">
              A community-driven platform to share culinary passions, step-by-step cooking recipes, and explore foods globally.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 text-sm tracking-wider uppercase">Explore</h4>
            <div className="flex flex-col gap-1.5 text-sm">
              <Link href="/recipes" className="hover:text-green-600 transition-colors">Trending Recipes</Link>
              <Link href="/cuisines" className="hover:text-green-600 transition-colors">Cuisines</Link>
              <Link href="/chefs" className="hover:text-green-600 transition-colors">Top Contributors</Link>
            </div>
          </div>

          {/* Column 3: Legal Terms */}
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 text-sm tracking-wider uppercase">Legal</h4>
            <div className="flex flex-col gap-1.5 text-sm">
              <Link href="/privacy" className="hover:text-green-600 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-green-600 transition-colors">Terms of Service</Link>
              <Link href="/contact" className="hover:text-green-600 transition-colors">Support Contact</Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-neutral-100 dark:border-neutral-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>&copy; {currentYear} RecipeHub. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-neutral-50">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-neutral-50">LinkedIn</a>
          </div>
        </div>

      </div>
    </footer>
  );
}