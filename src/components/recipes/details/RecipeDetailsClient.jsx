// components/recipes/details/RecipeDetailsClient.jsx
"use client";

import { useState } from "react";
import { Heart, Bookmark, Flag, ShoppingCart, Clock, Tag, Globe, ChefHat } from "lucide-react";

import { ReportModal } from "./ReportModal";
import { purchaseRecipe, toggleFavorite, toggleLike } from "@/lib/actions/recipes";

const diffStyle = {
  Easy:   "bg-green-50 text-green-700 border-green-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Hard:   "bg-rose-50 text-rose-700 border-rose-200",
};

export function RecipeDetailsClient({ recipe, user, initialInteractions }) {
  const [liked,     setLiked]     = useState(initialInteractions.liked);
  const [favorited, setFavorited] = useState(initialInteractions.favorited);
  const [likeCount, setLikeCount] = useState(recipe.likeCount || 0);
  const [showReport, setShowReport] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const {
    _id, name, category, cuisine, prepTime, difficulty,
    image, ingredients, instructions, userEmail, userImage, createdAt, price,
  } = recipe;

  async function handleLike() {
    if (!user) return alert("Login করো আগে!");
    const res = await toggleLike(_id, user.id);
    setLiked(res.liked);
    setLikeCount((c) => res.liked ? c + 1 : c - 1);
  }

  async function handleFavorite() {
    if (!user) return alert("Login করো আগে!");
    const res = await toggleFavorite(_id, user.id);
    setFavorited(res.favorited);
  }
async function handlePurchase() {
  if (!user) return alert("Login first");
  setPurchasing(true);
  const res = await purchaseRecipe(_id, name, price, user.id, user.email); // ← user info দাও
  if (res?.url) {
    window.location.href = res.url;
  } else {
    alert(res?.error || "Payment failed!");
    setPurchasing(false);
  }
}

  return (
    <>
      <div className="space-y-6">
        {/* Image */}
        {image ? (
          <img src={image} alt={name} className="w-full h-64 sm:h-80 object-cover rounded-2xl" />
        ) : (
          <div className="w-full h-64 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400">
            <ChefHat size={48} />
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{name}</h1>

            <div className="flex flex-wrap gap-2">
              {category && (
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500">
                  <Tag size={11} /> {category}
                </span>
              )}
              {cuisine && (
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500">
                  <Globe size={11} /> {cuisine}
                </span>
              )}
              {prepTime && (
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500">
                  <Clock size={11} /> {prepTime}
                </span>
              )}
              {difficulty && (
                <span className={`text-xs px-2 py-1 rounded-lg border font-medium ${diffStyle[difficulty] ?? diffStyle.Medium}`}>
                  {difficulty}
                </span>
              )}
            </div>
          </div>

          {/* Like count */}
          <div className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 shrink-0">
            <Heart size={16} className={liked ? "fill-rose-500 text-rose-500" : ""} />
            <span>{likeCount} likes</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
              liked
                ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            <Heart size={15} className={liked ? "fill-rose-500" : ""} />
            {liked ? "Liked" : "Like"}
          </button>

          <button
            onClick={handleFavorite}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
              favorited
                ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            <Bookmark size={15} className={favorited ? "fill-amber-500" : ""} />
            {favorited ? "Saved" : "Favorite"}
          </button>

          <button
            onClick={() => setShowReport(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Flag size={15} /> Report
          </button>

          <button
            onClick={handlePurchase}
            disabled={purchasing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-60 ml-auto"
          >
            <ShoppingCart size={15} />
            {purchasing ? "Redirecting..." : `Purchase ${price ? `$${price}` : "$4.99"}`}
          </button>
        </div>

        {/* Ingredients */}
        {ingredients && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Ingredients</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
              {ingredients}
            </p>
          </div>
        )}

        {/* Instructions */}
        {instructions && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Instructions</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
              {instructions}
            </p>
          </div>
        )}

        {/* Author */}
        <div className="flex items-center gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          {userImage ? (
            <img src={userImage} alt="" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-sm font-medium text-blue-700 dark:text-blue-300">
              {userEmail?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{userEmail}</p>
            <p className="text-xs text-zinc-400">
              {new Date(createdAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReport && (
        <ReportModal
          recipeId={_id}
          userId={user?.id}
          onClose={() => setShowReport(false)}
        />
      )}
    </>
  );
}