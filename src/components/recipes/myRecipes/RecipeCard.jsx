"use client";

import { Clock, Tag, Globe, ChefHat, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const diffStyle = {
  Easy: "bg-green-50 text-green-700 border-green-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Hard: "bg-rose-50 text-rose-700 border-rose-200",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RecipeCard({ recipe }) {
  const router = useRouter();
  const {
    _id,
    name,
    category,
    cuisine,
    prepTime,
    difficulty,
    image,
    userEmail,
    userImage,
    createdAt,
  } = recipe;
  const initial = userEmail?.[0]?.toUpperCase() ?? "?";

  async function handleDelete() {
    if (!confirm("এই recipe টা delete করবে?")) return;
    await fetch(`/api/recipes/${_id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <article className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      {image ? (
        <div className="relative w-full h-40">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div className="w-full h-40 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
          <ChefHat size={32} />
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col gap-2">
        <p className="font-medium text-zinc-900 dark:text-zinc-50 leading-snug">
          {name}
        </p>

        <div className="flex flex-wrap gap-2">
          {category && (
            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400">
              <Tag size={11} /> {category}
            </span>
          )}
          {cuisine && (
            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400">
              <Globe size={11} /> {cuisine}
            </span>
          )}
          {prepTime && (
            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400">
              <Clock size={11} /> {prepTime}
            </span>
          )}
          {difficulty && (
            <span
              className={`text-xs px-2 py-1 rounded-lg border font-medium ${diffStyle[difficulty] ?? diffStyle.Medium}`}
            >
              {difficulty}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
        {userImage ? (
          <Image
            src={userImage}
            alt={userEmail || "User"}
            width={24}
            height={24}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-[10px] font-medium text-blue-700 dark:text-blue-300">
            {initial}
          </div>
        )}
        <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
          {userEmail}
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-auto shrink-0">
          {formatDate(createdAt)}
        </span>
      </div>

      <div className="px-4 pb-4 flex gap-2">
        <Link
          href={`/browse-recipes/${recipe._id || recipe.id}`}
          className="flex-1"
        >
          <button className="w-full text-sm font-medium py-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors">
            View Details
          </button>
        </Link>

        <Link href={`/dashboard/recipes/${_id}/edit`}>
          <button className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <Pencil size={15} />
          </button>
        </Link>

        <button
          onClick={handleDelete}
          className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200 dark:hover:border-rose-900 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}
