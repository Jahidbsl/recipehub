"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Heart,
  ShoppingBag,
  UserCircle,
  Users,
  UtensilsCrossed,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Crown,
  ExternalLink,
  Shield,
  User,
} from "lucide-react";

const USER_NAV = [
  {
    section: "Main",
    items: [
      {
        label: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        label: "My recipes",
        href: "/dashboard/recipes/my-recipes",
        icon: BookOpen,
        exact: true,
      },
      {
        label: "Add recipe",
        href: "/dashboard/recipes/add",
        icon: PlusCircle,
       
        badgeVariant: "warn",
        noteKey: "add-recipe",
      },
    ],
  },
  {
    section: "Library",
    items: [
      { label: "My favorites", href: "/dashboard/my-favorites", icon: Heart },
      {
        label: "Purchased recipes",
        href: "/dashboard/purchased",
        icon: ShoppingBag,
      },
    ],
  },
  {
    section: "Account",
    items: [{ label: "Profile", href: "/profile", icon: UserCircle }],
  },
];

const ADMIN_NAV = [
  {
    section: "Dashboard",
    items: [
      { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard, exact: true },
      {
        label: "Manage users",
        href: "/admin/dashboard/manage-users",
        icon: Users,
       
      },
      {
        label: "Manage recipes",
        href: "/admin/dashboard/manage-recipes",
        icon: UtensilsCrossed,
        
      },
      { label: "Reports", href: "/admin/dashboard/manage-reports", icon: BarChart3 },
    ],
  },
];

function AddRecipeNote() {
  return (
    <div className="mx-1 mb-1 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/40 dark:bg-amber-900/20">
      <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
        You can add <span className="font-semibold">2 recipes</span> on the free
        plan.{" "}
        <a
          href="/plans"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-semibold text-green-700 underline-offset-2 hover:underline dark:text-green-400"
        >
          Become premium <ExternalLink size={11} className="shrink-0" />
        </a>{" "}
        to unlock unlimited recipes.
      </p>
    </div>
  );
}

function NavItem({ item, collapsed, isAdmin, pathname }) {
  const Icon = item.icon;
  const isActive = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(item.href + "/");

  const activeClass = isAdmin
    ? "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    : "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300";

  const inactiveClass =
    "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50";

  const badgeStyles = {
    default:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    warn: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  };

  return (
    <>
      <Link
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={`group flex items-center rounded-xl text-sm transition-colors duration-100 ${
          collapsed ? "justify-center w-10 h-10" : "gap-2.5 px-3 py-2"
        } ${isActive ? activeClass : inactiveClass}`}
      >
        <Icon
          size={18}
          className={`shrink-0 ${
            isActive
              ? ""
              : "text-neutral-400 group-hover:text-neutral-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
          }`}
        />
        {!collapsed && (
          <>
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <span
                className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  badgeStyles[
                    isAdmin ? "blue" : (item.badgeVariant ?? "default")
                  ]
                }`}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
      {item.noteKey === "add-recipe" && !collapsed && <AddRecipeNote />}
    </>
  );
}

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = user?.role === "admin";
  const navGroups = isAdmin ? ADMIN_NAV : USER_NAV;
  const accentBg = isAdmin
    ? "bg-blue-600 dark:bg-blue-500"
    : "bg-green-700 dark:bg-green-600";

  return (
    <aside
      className={`flex h-screen flex-col border-r border-neutral-200 bg-white transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-950 ${
        collapsed ? "w-[68px]" : "w-[252px]"
      }`}
    >
      {/* ── logo / header ── */}
      <div
        className={`flex h-14 shrink-0 items-center border-b border-neutral-200 dark:border-zinc-800 ${
          collapsed ? "justify-center" : "justify-between px-3 gap-2"
        }`}
      >
        {!collapsed && (
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accentBg}`}
            >
              <UtensilsCrossed size={16} className="text-white" />
            </div>
            <span className="truncate text-[15px] font-semibold text-neutral-900 dark:text-zinc-50">
              RecipeHub
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* ── role badge ── */}
      {!collapsed && (
        <div className="px-3 pt-3">
          <div
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
              isAdmin
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
            }`}
          >
            {isAdmin ? <Shield size={12} /> : <User size={12} />}
            {isAdmin ? "Admin dashboard" : "User dashboard"}
          </div>
        </div>
      )}

      {/* ── nav ── */}
      <nav
        className={`flex flex-1 flex-col overflow-y-auto py-2 ${
          collapsed ? "items-center px-0 gap-1" : "px-2 gap-0"
        }`}
      >
        {navGroups.map((group) => (
          <div
            key={group.section}
            className={
              collapsed ? "flex flex-col items-center gap-1 mb-2" : "mb-2"
            }
          >
            {!collapsed && (
              <p className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-zinc-600">
                {group.section}
              </p>
            )}
            <div
              className={`flex flex-col ${collapsed ? "items-center gap-1" : "gap-0.5"}`}
            >
              {group.items.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  isAdmin={isAdmin}
                  pathname={pathname}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── premium upsell (user only, expanded only) ── */}
      {!isAdmin && !collapsed && (
        <div className="px-3 pb-3">
          <a
            href="/plans"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 transition-colors hover:border-amber-300 dark:border-amber-800/40 dark:bg-amber-900/20"
          >
            <Crown
              size={16}
              className="shrink-0 text-amber-600 dark:text-amber-400"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                Go Premium
              </p>
              <p className="truncate text-[11px] text-amber-600 dark:text-amber-500">
                Unlimited recipes &amp; more
              </p>
            </div>
            <ExternalLink
              size={12}
              className="ml-auto shrink-0 text-amber-500"
            />
          </a>
        </div>
      )}

      {/* ── footer ── */}
      <div
        className={`flex shrink-0 items-center border-t border-neutral-200 dark:border-zinc-800 ${
          collapsed ? "justify-center py-3" : "gap-2.5 px-3 py-3"
        }`}
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "User"}
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
              isAdmin
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                : "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
            }`}
          >
            {user?.name?.slice(0, 2).toUpperCase() ?? "??"}
          </div>
        )}
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-neutral-900 dark:text-zinc-50">
              {user?.name ?? "Unknown user"}
            </p>
            <p className="truncate text-[11px] text-neutral-400 dark:text-zinc-500">
              {isAdmin
                ? "Administrator"
                : user?.emailVerified
                  ? "Free member"
                  : "Unverified"}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
