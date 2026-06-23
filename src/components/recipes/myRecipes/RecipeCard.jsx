"use client";

import { useState, useRef } from "react";
import {
  Clock,
  Tag,
  Globe,
  ChefHat,
  Pencil,
  Trash2,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Dessert",
  "Appetizer",
  "Soup",
  "Salad",
  "Beverage",
  "Baking",
];
const CUISINES = [
  "Bangladeshi",
  "Indian",
  "Chinese",
  "Italian",
  "Mexican",
  "Japanese",
  "Thai",
  "Middle Eastern",
  "Mediterranean",
  "American",
  "French",
  "Korean",
  "Other",
];
const PREP_TIMES = [
  "Under 15 mins",
  "15–30 mins",
  "30–45 mins",
  "45–60 mins",
  "1–2 hours",
  "Over 2 hours",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;

const diffStyle = {
  Easy: "bg-green-50 text-green-800 border-green-200",
  Medium: "bg-amber-50 text-amber-800 border-amber-200",
  Hard: "bg-rose-50  text-rose-800  border-rose-200",
};

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

function ModalInput({ error, ...props }) {
  return (
    <input
      className={`w-full border rounded-lg px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition ${
        error
          ? "border-red-400 ring-2 ring-red-400/20"
          : "border-zinc-200 dark:border-zinc-700"
      }`}
      {...props}
    />
  );
}

function ModalSelect({ error, children, ...props }) {
  return (
    <select
      className={`w-full border rounded-lg px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition cursor-pointer ${
        error
          ? "border-red-400 ring-2 ring-red-400/20"
          : "border-zinc-200 dark:border-zinc-700"
      }`}
      {...props}
    >
      {children}
    </select>
  );
}

function ModalTextarea({ error, ...props }) {
  return (
    <textarea
      rows={4}
      className={`w-full border rounded-lg px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition resize-none ${
        error
          ? "border-red-400 ring-2 ring-red-400/20"
          : "border-zinc-200 dark:border-zinc-700"
      }`}
      {...props}
    />
  );
}

export function RecipeCard({ recipe, deleteRecipe, updateRecipe }) {
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
    ingredients,
    instructions,
  } = recipe;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadStep, setUploadStep] = useState("");
  const [editErrors, setEditErrors] = useState({});

  const [editForm, setEditForm] = useState({
    name: name || "",
    category: category || "",
    cuisine: cuisine || "",
    prepTime: prepTime || "",
    difficulty: difficulty || "Medium",
    ingredients: ingredients || "",
    instructions: instructions || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(image || "");
  const imageInputRef = useRef(null);

  const initial = userEmail?.[0]?.toUpperCase() ?? "?";

  const handleEditChange = (field) => (e) => {
    setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (editErrors[field]) setEditErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be under 10MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    if (editErrors.image) setEditErrors((prev) => ({ ...prev, image: "" }));
  };

  const uploadToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      { method: "POST", body: formData },
    );
    const data = await res.json();
    if (!data.success)
      throw new Error(data.error?.message || "Image upload failed");
    return data.data.url;
  };

  const validateEdit = () => {
    const e = {};
    if (!editForm.name.trim()) e.name = "Recipe name is required";
    if (!editForm.category) e.category = "Please select a category";
    if (!editForm.cuisine) e.cuisine = "Please select a cuisine";
    if (!editForm.prepTime) e.prepTime = "Please select prep time";
    if (!editForm.difficulty) e.difficulty = "Please select difficulty";
    if (!editForm.ingredients.trim())
      e.ingredients = "Ingredients are required";
    if (!editForm.instructions.trim())
      e.instructions = "Instructions are required";
    if (!imagePreview) e.image = "Please upload a recipe image";
    setEditErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateEdit()) return;

    setIsSaving(true);
    try {
      let imageUrl = imagePreview;

      if (imageFile) {
        setUploadStep("uploading-image");
        imageUrl = await uploadToImgbb(imageFile);
      }

      setUploadStep("saving");
      const payload = {
        ...editForm,
        image: imageUrl,
      };

      if (typeof updateRecipe === "function") {
        const result = await updateRecipe(_id, payload);
        if (result?.success) {
          setShowEditModal(false);
          router.refresh();
          return;
        }
        throw new Error(result?.message || "Update failed");
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
      const res = await fetch(`${baseUrl}/api/recipes/update/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data?.success)
        throw new Error(data?.message || "Update failed");

      setShowEditModal(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert(err.message || "Update failed. Please try again.");
    } finally {
      setIsSaving(false);
      setUploadStep("");
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      // যদি বাইরে থেকে (Parent Component) deleteRecipe ফাংশন পাস করা হয়
      if (typeof deleteRecipe === "function") {
        const result = await deleteRecipe(_id);
        if (result?.success) {
          setShowDeleteModal(false);
          router.refresh();
          return;
        }
        throw new Error(result?.message || "Delete failed");
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
      const res = await fetch(`${baseUrl}/api/recipes/delete/${_id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data?.success)
        throw new Error(data?.message || "Delete failed");

      setShowDeleteModal(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert(err.message || "Delete failed. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const savingLabel = () => {
    if (uploadStep === "uploading-image") return "Uploading image…";
    if (uploadStep === "saving") return "Saving…";
    return "Save changes";
  };

  return (
    <>
      {/* ── CARD ── */}
      <article className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all">
        {image ? (
          <div className="relative w-full h-40">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {difficulty && (
              <span
                className={`absolute top-2 right-2 text-xs px-2.5 py-1 rounded-full border font-medium ${diffStyle[difficulty] ?? diffStyle.Medium}`}
              >
                {difficulty}
              </span>
            )}
          </div>
        ) : (
          <div className="w-full h-40 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center relative">
            <ChefHat size={32} className="text-zinc-300 dark:text-zinc-600" />
            {difficulty && (
              <span
                className={`absolute top-2 right-2 text-xs px-2.5 py-1 rounded-full border font-medium ${diffStyle[difficulty] ?? diffStyle.Medium}`}
              >
                {difficulty}
              </span>
            )}
          </div>
        )}

        <div className="p-4 flex-1 flex flex-col gap-2.5">
          <p className="font-medium text-zinc-900 dark:text-zinc-50 leading-snug text-[15px]">
            {name}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {category && (
              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                <Tag size={10} /> {category}
              </span>
            )}
            {cuisine && (
              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                <Globe size={10} /> {cuisine}
              </span>
            )}
            {prepTime && (
              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                <Clock size={10} /> {prepTime}
              </span>
            )}
          </div>
        </div>

        <div className="px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
          {userImage ? (
            <Image
              src={userImage}
              alt={userEmail || "User"}
              width={22}
              height={22}
              className="w-[22px] h-[22px] rounded-full object-cover"
            />
          ) : (
            <div className="w-[22px] h-[22px] rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-[10px] font-semibold text-blue-700 dark:text-blue-300">
              {initial}
            </div>
          )}
          <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate flex-1">
            {userEmail}
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
            {formatDate(createdAt)}
          </span>
        </div>

        <div className="px-4 pb-4 pt-3 flex gap-2">
          <Link href={`/browse-recipes/${_id}`} className="flex-1">
            <button className="w-full text-sm font-medium py-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors">
              View details
            </button>
          </Link>
          <button
            onClick={() => setShowEditModal(true)}
            title="Edit recipe"
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            title="Delete recipe"
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </article>

      {/* ── EDIT MODAL ── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 my-6">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Edit recipe
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Make changes to "{name}"
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Recipe Name */}
              <Field label="Recipe name" required error={editErrors.name}>
                <ModalInput
                  placeholder="e.g. Chicken Biriyani"
                  value={editForm.name}
                  onChange={handleEditChange("name")}
                  error={editErrors.name}
                />
              </Field>

              {/* Category & Cuisine */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Category" required error={editErrors.category}>
                  <ModalSelect
                    value={editForm.category}
                    onChange={handleEditChange("category")}
                    error={editErrors.category}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </ModalSelect>
                </Field>
                <Field label="Cuisine" required error={editErrors.cuisine}>
                  <ModalSelect
                    value={editForm.cuisine}
                    onChange={handleEditChange("cuisine")}
                    error={editErrors.cuisine}
                  >
                    <option value="">Select cuisine</option>
                    {CUISINES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </ModalSelect>
                </Field>
              </div>

              {/* Prep Time & Difficulty */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prep time" required error={editErrors.prepTime}>
                  <ModalSelect
                    value={editForm.prepTime}
                    onChange={handleEditChange("prepTime")}
                    error={editErrors.prepTime}
                  >
                    <option value="">Select prep time</option>
                    {PREP_TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </ModalSelect>
                </Field>
                <Field
                  label="Difficulty"
                  required
                  error={editErrors.difficulty}
                >
                  <ModalSelect
                    value={editForm.difficulty}
                    onChange={handleEditChange("difficulty")}
                    error={editErrors.difficulty}
                  >
                    <option value="">Select difficulty</option>
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </ModalSelect>
                </Field>
              </div>

              {/* Ingredients */}
              <Field
                label="Ingredients"
                required
                error={editErrors.ingredients}
              >
                <ModalTextarea
                  placeholder="e.g. 500g Chicken, 2 cups Basmati Rice..."
                  value={editForm.ingredients}
                  onChange={handleEditChange("ingredients")}
                  error={editErrors.ingredients}
                />
              </Field>

              {/* Instructions */}
              <Field
                label="Instructions / Steps"
                required
                error={editErrors.instructions}
              >
                <ModalTextarea
                  placeholder={
                    "Step 1. Marinate the chicken...\nStep 2. Wash and soak the rice..."
                  }
                  value={editForm.instructions}
                  onChange={handleEditChange("instructions")}
                  error={editErrors.instructions}
                  rows={5}
                />
              </Field>

              {/* Image Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Recipe image <span className="text-red-500">*</span>
                </label>
                {imagePreview ? (
                  <div className="relative h-44 w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                    >
                      <X size={13} />
                    </button>
                    <div className="absolute bottom-2 left-2 rounded-lg bg-black/50 px-2 py-1 text-[11px] text-white">
                      Click × to change image
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className={`flex h-44 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors ${
                      editErrors.image
                        ? "border-red-400 bg-red-50 dark:bg-red-900/10"
                        : "border-zinc-300 bg-zinc-50 hover:border-blue-400 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${editErrors.image ? "bg-red-100" : "bg-blue-100 dark:bg-blue-900/30"}`}
                    >
                      <Upload
                        size={20}
                        className={
                          editErrors.image
                            ? "text-red-500"
                            : "text-blue-600 dark:text-blue-400"
                        }
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Click to upload image
                      </p>
                      <p className="text-xs text-zinc-400">
                        PNG, JPG, WEBP — max 10MB
                      </p>
                    </div>
                  </button>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {editErrors.image && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={11} /> {editErrors.image}
                  </p>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={isSaving}
                className="px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-60 transition flex items-center gap-2"
              >
                {isSaving && (
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                )}
                {savingLabel()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center mb-4">
              <Trash2 size={18} className="text-rose-600" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Delete recipe?
            </h3>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              "{name}" It will be delete permanently.You can't undo this work.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium bg-rose-600 text-white rounded-xl hover:bg-rose-700 disabled:opacity-60 transition flex items-center gap-2"
              >
                {isDeleting ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
