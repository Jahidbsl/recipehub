"use client";

import { useState, useEffect } from "react";
import { Heart, Bookmark, Flag, ShoppingCart, Clock, Tag, Globe, ChefHat, CheckCircle, X } from "lucide-react";
import Image from "next/image"; // নেক্সট ইমেজ ইম্পোর্ট করা হলো
import { useRouter } from "next/navigation"; // ইউআরএল ক্লিন করার জন্য

import { ReportModal } from "./ReportModal";
import { purchaseRecipe, toggleFavorite, toggleLike } from "@/lib/actions/recipes";

const diffStyle = {
  Easy:   "bg-green-50 text-green-700 border-green-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Hard:   "bg-rose-50 text-rose-700 border-rose-200",
};

export function RecipeDetailsClient({ recipe, user, initialInteractions, showSuccessModal }) {
  const [liked,     setLiked]     = useState(initialInteractions.liked);
  const [favorited, setFavorited] = useState(initialInteractions.favorited);
  const [likeCount, setLikeCount] = useState(recipe.likeCount || 0);
  const [showReport, setShowReport] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const router = useRouter();

  const {
    _id, name, category, cuisine, prepTime, difficulty,
    image, ingredients, instructions, userEmail, userImage, createdAt, price,
  } = recipe;

  // সাকসেস মোডাল ট্রিগার এবং ৫ সেকেন্ডের অটো-ক্লোজ টাইমার লজিক
  useEffect(() => {
    if (showSuccessModal) {
      setIsModalOpen(true);

      const timer = setTimeout(() => {
        closeModal();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const closeModal = () => {
    setIsModalOpen(false);
    // মোডাল বন্ধের পর ইউআরএল থেকে সেশন আইডি রিমুভ করা যেন রিফ্রেশে মোডাল আবার না আসে
    router.replace(`/browse-recipes/${_id}`);
  };

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
    const res = await purchaseRecipe(_id, name, price, user.id, user.email);
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
        {/* Main Recipe Image using Next.js Image Component */}
        {image ? (
          <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-sm">
            <Image 
              src={image} 
              alt={name} 
              fill
              sizes="(max-w-768px) 100vw, 800px"
              priority
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-64 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 border border-zinc-200 dark:border-zinc-800">
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

        {/* Author Footer */}
        <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          {userImage ? (
            <div className="relative w-9 h-9 rounded-full overflow-hidden">
              <Image 
                src={userImage} 
                alt="Author" 
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
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

      {/* --- পেমেন্ট সাকসেস মোডাল UI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl max-w-sm w-full text-center shadow-xl relative animate-[scale-up_0.2s_ease-out]">
            
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mb-4 shadow-inner">
              <CheckCircle size={28} />
            </div>

            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Payment Successful!
            </h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Thank you for your purchase. You have unlocked full access to{" "}
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                "{name}"
              </span>. Happy Cooking!
            </p>

            {/* ৫ সেকেন্ডের স্লাইডিং প্রোগ্রেস বার ইন্ডিকেটর */}
            <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-5 overflow-hidden">
              <div className="h-full bg-emerald-500 animate-[shrink-width_5s_linear_forwards]" />
            </div>
          </div>
        </div>
      )}

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