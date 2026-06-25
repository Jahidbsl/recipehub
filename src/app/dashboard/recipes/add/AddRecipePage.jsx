"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BarChart, ListPlus, BookOpen } from "lucide-react";
import {
  ChefHat,
  Clock,
  Globe,
  Tag,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { TextArea } from "@heroui/react";
import { addRecipe } from "@/lib/actions/recipes";

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

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;

function Field({ label, required, children, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-700 dark:text-zinc-300">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

function Input({ icon: Icon, error, ...props }) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 transition-all bg-white dark:bg-zinc-900 ${error ? "border-red-400 ring-2 ring-red-400/20" : "border-neutral-200 dark:border-zinc-700 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20"}`}
    >
      {Icon && <Icon size={16} className="shrink-0 text-neutral-400" />}
      <input
        className="w-full bg-transparent text-sm text-neutral-900 placeholder-neutral-400 outline-none dark:text-zinc-50"
        {...props}
      />
    </div>
  );
}

function Select({ icon: Icon, error, children, ...props }) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 transition-all bg-white dark:bg-zinc-900 ${error ? "border-red-400 ring-2 ring-red-400/20" : "border-neutral-200 dark:border-zinc-700 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20"}`}
    >
      {Icon && <Icon size={16} className="shrink-0 text-neutral-400" />}
      <select
        className="w-full bg-transparent text-sm text-neutral-900 outline-none dark:text-zinc-50 cursor-pointer"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

function ImageUploader({ preview, onChange, onRemove, error }) {
  const inputRef = useRef(null);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-700 dark:text-zinc-300">
        Recipe image <span className="ml-1 text-red-500">*</span>
      </label>
      {preview ? (
        <div className="relative h-52 w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-zinc-700">
          <Image
            src={preview}
            alt="Recipe preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-2 left-2 rounded-lg bg-black/50 px-2 py-1 text-[11px] text-white">
            Click × to change image
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex h-52 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-colors ${error ? "border-red-400 bg-red-50 dark:bg-red-900/10" : "border-neutral-300 bg-neutral-50 hover:border-green-400 hover:bg-green-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-green-600"}`}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${error ? "bg-red-100" : "bg-green-100 dark:bg-green-900/30"}`}
          >
            <Upload
              size={22}
              className={
                error ? "text-red-500" : "text-green-700 dark:text-green-400"
              }
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-700 dark:text-zinc-300">
              Click to upload image
            </p>
            <p className="text-xs text-neutral-400">
              PNG, JPG, WEBP — max 10MB
            </p>
          </div>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

export default function AddRecipePage({ user }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    category: "",
    cuisine: "",
    prepTime: "",
    difficulty: "",
    ingredients: "",
    instructions: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStep, setUploadStep] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Recipe name is required";
    if (!form.category) e.category = "Please select a category";
    if (!form.cuisine) e.cuisine = "Please select a cuisine";
    if (!form.prepTime) e.prepTime = "Please select preparation time";
    if (!imageFile) e.image = "Please upload a recipe image";
    if (!form.difficulty) e.difficulty = "Please select difficulty";
    if (!form.ingredients?.trim()) e.ingredients = "Ingredients are required";
    if (!form.instructions?.trim())
      e.instructions = "Instructions are required";
    setErrors(e);
    return Object.keys(e).length === 0;
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
  const DIFFICULTIES = ["Easy", "Medium", "Hard"];
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      setUploadStep("uploading-image");
      const imageUrl = await uploadToImgbb(imageFile);

      
      setUploadStep("saving");
      const payload = {
        name: form.name.trim(),
        category: form.category,
        cuisine: form.cuisine,
        prepTime: form.prepTime,
        difficulty: form.difficulty,
        ingredients: form.ingredients.trim(),
        instructions: form.instructions.trim(),
        image: imageUrl,
        userEmail: user?.email,
        userId: user?.id,
        userImage: user?.image,
      };

      
      const res = await addRecipe(payload);

      console.log("Response:", res);

      if (res?.success) {
        toast.success(res.message || "Recipe added successfully!");
        setTimeout(() => {
          router.push("/dashboard/recipes/my-recipes");
        }, 1500);
      }
      
      else {
        toast.error(res?.message || "Failed to add recipe");

     
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
      setUploadStep("");
    }
  };

  const submitLabel = () => {
    if (uploadStep === "uploading-image") return "Uploading image…";
    if (uploadStep === "saving") return "Saving recipe…";
    return "Add recipe";
  };

  return (
    <div className=" ">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-8">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-green-700">
            <ChefHat size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-zinc-50">
            Add a new recipe
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-zinc-400">
            Fill in the details below. Your image will be hosted on ImgBB.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8"
        >
          <div className="flex flex-col gap-6">
            {/* 1. Recipe Name */}
            <Field label="Recipe name" required error={errors.name}>
              <Input
                icon={ChefHat}
                placeholder="e.g. Chicken Biriyani"
                value={form.name}
                onChange={handleChange("name")}
                error={errors.name}
              />
            </Field>

            {/* Category & Cuisine */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="Category" required error={errors.category}>
                <Select
                  icon={Tag}
                  value={form.category}
                  onChange={handleChange("category")}
                  error={errors.category}
                >
                  <option
                    value=""
                    className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50"
                  >
                    Select category
                  </option>
                  {CATEGORIES.map((c) => (
                    <option
                      key={c}
                      value={c}
                      className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50"
                    >
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Cuisine" required error={errors.cuisine}>
                <Select
                  icon={Globe}
                  value={form.cuisine}
                  onChange={handleChange("cuisine")}
                  error={errors.cuisine}
                >
                  <option
                    value=""
                    className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50"
                  >
                    Select cuisine
                  </option>
                  {CUISINES.map((c) => (
                    <option
                      key={c}
                      value={c}
                      className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50"
                    >
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            {/* Prep Time & 2. Difficulty Level */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="Preparation time" required error={errors.prepTime}>
                <Select
                  icon={Clock}
                  value={form.prepTime}
                  onChange={handleChange("prepTime")}
                  error={errors.prepTime}
                >
                  <option
                    value=""
                    className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50"
                  >
                    Select prep time
                  </option>
                  {PREP_TIMES.map((t) => (
                    <option
                      key={t}
                      value={t}
                      className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50"
                    >
                      {t}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                label="Difficulty Level"
                required
                error={errors.difficulty}
              >
                <Select
                  icon={BarChart}
                  value={form.difficulty}
                  onChange={handleChange("difficulty")}
                  error={errors.difficulty}
                >
                  <option
                    value=""
                    className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50"
                  >
                    Select difficulty
                  </option>
                  {DIFFICULTIES.map((d) => (
                    <option
                      key={d}
                      value={d}
                      className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50"
                    >
                      {d}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            {/* 3. Ingredients */}
            <Field label="Ingredients" required error={errors.ingredients}>
              <TextArea
                icon={ListPlus}
                placeholder="Enter ingredients (e.g., 500g Chicken, 2 cups Basmati Rice, 1 tbsp Ginger paste...)"
                value={form.ingredients}
                onChange={handleChange("ingredients")}
                error={errors.ingredients}
              />
            </Field>

            {/* 4. Instructions */}
            <Field
              label="Instructions / Steps"
              required
              error={errors.instructions}
            >
              <TextArea
                icon={BookOpen}
                placeholder="Step 1. Marinate the chicken...&#10;Step 2. Wash and soak the rice..."
                value={form.instructions}
                onChange={handleChange("instructions")}
                error={errors.instructions}
              />
            </Field>

            {/* 5. Recipe Image Upload */}
            <ImageUploader
              preview={imagePreview}
              onChange={handleImageChange}
              onRemove={() => {
                setImageFile(null);
                setImagePreview("");
              }}
              error={errors.image}
            />

            <div className="border-t border-neutral-100 dark:border-zinc-800" />

            {/* Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-green-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:opacity-70 dark:bg-green-600 dark:hover:bg-green-700"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                {submitLabel()}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
