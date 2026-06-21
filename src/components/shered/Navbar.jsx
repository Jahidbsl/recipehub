"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { ChefHat, LayoutDashboard, User, Utensils, UtensilsCrossed } from "lucide-react"; // 💡 LayoutDashboard ও User আইকন ইমপোর্ট করা হয়েছে
import Image from "next/image";
import { 
  Sun, 
  Moon, 
  Bars, 
  Xmark, 
  ArrowRightFromSquare, 
  House, 
  CircleInfo 
} from "@gravity-ui/icons";

const navLinks = [
  { label: "Home", href: "/", icon: House },
  { label: "Browse Recipes", href: "/browse-recipes", icon: ChefHat },
  { label: "About Us", href: "/about", icon: CircleInfo }
];

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully!");
      router.push("/auth/signin");
      router.refresh();
    } catch (err) {
      toast.error("Logout failed!");
    }
  };

  // 💡 রোল অনুযায়ী আলাদা ড্যাশবোর্ড এবং প্রোফাইল লিঙ্ক নির্ধারণ
  const isAdmin = session?.user?.role === "admin";
  const dashboardHref = isAdmin ? "/admin/dashboard" : "/dashboard";
  const profileHref = isAdmin ? "/admin/profile" : "/profile";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200/60 bg-white/70 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/70 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tight text-neutral-900 dark:text-neutral-50 group">
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent group-hover:opacity-90">RecipeHub</span>
              <span className="text-2xl transition-transform duration-300 group-hover:rotate-12"><UtensilsCrossed className="w-4 h-4" /></span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    suppressHydrationWarning={true}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-neutral-600 dark:text-zinc-400 hover:bg-neutral-100/80 dark:hover:bg-zinc-900/80 hover:text-neutral-900 dark:hover:text-zinc-50 transition-all duration-200"
                  >
                    <IconComponent className="text-[16px] opacity-70" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {mounted && (
              <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-xl bg-neutral-100/80 hover:bg-neutral-200/80 dark:bg-zinc-900/80 dark:hover:bg-zinc-800/80 text-neutral-800 dark:text-zinc-200 border border-neutral-200/40 dark:border-zinc-800/40 transition-all duration-200"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <Sun className="text-[16px]" /> : <Moon className="text-[16px]" />}
              </button>
            )}

            {/* Auth Condition with Skeleton Loading */}
            {isPending ? (
              <div className="flex items-center gap-3 animate-pulse">
                <div className="h-8 w-24 bg-neutral-200 dark:bg-zinc-800 rounded-xl"></div>
                <div className="h-8 w-8 bg-neutral-200 dark:bg-zinc-800 rounded-full"></div>
              </div>
            ) : session ? (
              <div className="flex items-center gap-2.5 bg-neutral-100/50 dark:bg-zinc-900/50 border border-neutral-200/40 dark:border-zinc-800/40 px-2.5 py-1.5 rounded-2xl">
                
                {/* 💡 প্রোফাইল পিকচারে ক্লিক করলে প্রোফাইলে নিয়ে যাবে */}
                <Link href={profileHref} className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-green-500/20 hover:ring-green-500 transition-all" title="View Profile">
                  <Image
                    src={session.user?.image || "https://api.dicebear.com/7.x/avataaars/svg"} 
                    alt="User Profile" 
                    fill
                    sizes="32px"
                    priority
                    className="object-cover"
                  />
                </Link>

                {/* 💡 আলাদা ড্যাশবোর্ড বাটন (Admin বা User Dashboard) */}
                <Link href={dashboardHref}>
                  <Button 
                    className="bg-transparent hover:bg-green-500/10 text-neutral-700 dark:text-zinc-300 hover:text-green-600 dark:hover:text-green-400 text-xs font-semibold h-8 min-w-0 px-2 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <LayoutDashboard size={14} />
                    {isAdmin ? "Admin Panel" : "Dashboard"}
                  </Button>
                </Link>

                {/* Logout Button */}
                <Button 
                  onPress={handleLogout}
                  className="bg-transparent hover:bg-red-500/10 text-neutral-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 text-xs font-semibold h-8 min-w-0 px-2 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <ArrowRightFromSquare className="text-[14px]" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/signin">
                  <Button className="bg-transparent text-neutral-800 dark:text-zinc-200 text-sm font-semibold h-10 px-4 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-900">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold h-10 px-5 rounded-xl shadow-md shadow-green-600/10 transition-all duration-200">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && (
              <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-xl bg-neutral-100/80 dark:bg-zinc-900/80 text-neutral-800 dark:text-zinc-200 border border-neutral-200/40 dark:border-zinc-800/40"
              >
                {theme === "dark" ? <Sun className="text-[16px]" /> : <Moon className="text-[16px]" />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-neutral-600 dark:text-zinc-400 hover:bg-neutral-100/80 dark:hover:bg-zinc-900/80 transition-all"
            >
              {isOpen ? <Xmark className="text-[18px]" /> : <Bars className="text-[18px]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-neutral-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-neutral-600 dark:text-zinc-400 hover:bg-neutral-100/80 dark:hover:bg-zinc-900/80 hover:text-neutral-900 dark:hover:text-zinc-50 transition-all"
                >
                  <IconComponent className="text-[18px] opacity-70" />
                  {link.label}
                </Link>
              );
            })}
          </div>
          
          <div className="pt-4 border-t border-neutral-200/60 dark:border-zinc-800/60">
            {isPending ? (
              <div className="flex items-center justify-between p-3 bg-neutral-100/30 dark:bg-zinc-900/30 rounded-2xl animate-pulse">
                <div className="h-4 w-28 bg-neutral-200 dark:bg-zinc-800 rounded"></div>
                <div className="h-9 w-20 bg-neutral-200 dark:bg-zinc-800 rounded-xl"></div>
              </div>
            ) : session ? (
              <div className="flex flex-col gap-3 bg-neutral-100/50 dark:bg-zinc-900/50 border border-neutral-200/40 dark:border-zinc-800/40 p-4 rounded-2xl">
                
                {/* Mobile User Info & Profile Trigger */}
                <Link href={profileHref} onClick={() => setIsOpen(false)} className="relative flex items-center gap-3 border-b border-neutral-200/60 dark:border-zinc-800/60 pb-2">
                  <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-green-500/20">
                    <Image 
                      src={session.user?.image || "https://api.dicebear.com/7.x/avataaars/svg"} 
                      alt="User Profile" 
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-neutral-800 dark:text-zinc-200">{session.user?.name}</span>
                    <span className="text-[10px] uppercase font-bold text-green-600 dark:text-green-400 tracking-wider">{session.user?.role}</span>
                  </div>
                </Link>

                {/* Mobile Extra Navigation Buttons */}
                <div className="flex justify-between items-center pt-1">
                  <Link href={dashboardHref} onClick={() => setIsOpen(false)}>
                    <Button className="bg-green-600/10 hover:bg-green-600 text-green-600 dark:text-green-400 hover:text-white text-xs font-bold h-9 px-3 rounded-xl flex items-center gap-1.5">
                      <LayoutDashboard size={14} />
                      {isAdmin ? "Admin Panel" : "Dashboard"}
                    </Button>
                  </Link>

                  <Button 
                    onPress={() => { handleLogout(); setIsOpen(false); }}
                    className="bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold h-9 px-4 rounded-xl"
                  >
                    Logout
                  </Button>
                </div>

              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link href="/auth/signin" onClick={() => setIsOpen(false)} className="w-full">
                  <Button className="w-full bg-transparent text-neutral-800 dark:text-zinc-200 text-sm font-semibold h-11 border border-neutral-200 dark:border-zinc-800 rounded-xl">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setIsOpen(false)} className="w-full">
                  <Button className="w-full bg-green-600 text-white text-sm font-semibold h-11 rounded-xl shadow-md shadow-green-600/10">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}