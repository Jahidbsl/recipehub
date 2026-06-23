"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { Button, Card } from "@heroui/react";
import {
  Shield,
  User,
  Mail,
  Calendar,
  Key,
  Save,
  Camera,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";

import { getPlanById } from "@/lib/api/plans";

function CustomInput({
  label,
  type = "text",
  value,
  onChange,
  disabled,
  placeholder,
  startContent,
  description,
}) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-neutral-750 dark:text-zinc-300">
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center rounded-xl border transition-all duration-200 ${
          disabled
            ? "bg-neutral-100 dark:bg-zinc-900 border-neutral-200 dark:border-zinc-800 opacity-70"
            : "bg-white dark:bg-zinc-900/50 border-neutral-200 dark:border-zinc-800 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20"
        }`}
      >
        {startContent && (
          <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
            {startContent}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full bg-transparent px-3.5 py-2.5 text-sm rounded-xl outline-none text-neutral-900 dark:text-zinc-50 placeholder-neutral-400 ${
            startContent ? "pl-10" : ""
          }`}
        />
      </div>
      {description && (
        <p className="text-xs text-neutral-400 dark:text-zinc-500 px-1">
          {description}
        </p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // 💡 প্ল্যান ডাটা এবং প্ল্যান লোডিং এর জন্য স্টেট
  const [userPlan, setUserPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);

  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;

  useEffect(() => {
    setMounted(true);
    if (!isPending) {
      if (!session) {
        router.push("/auth/signin");
      } else {
        setName(session.user.name || "");
        setImagePreview(session.user.image || "");

        // 💡 ২. ইউজার ডাটা পাওয়ার পর প্ল্যান এপিআই কল করা
        const fetchUserPlan = async () => {
          try {
            setPlanLoading(true);
            // ডাটাবেজের 'user.plan' ফিল্ড থেকে আইডি পাঠানো হচ্ছে (যেমন: 'free')
            const planData = await getPlanById(session.user.plan);
            setUserPlan(planData);
          } catch (error) {
            console.error("Failed to fetch plan:", error);
          } finally {
            setPlanLoading(false);
          }
        };

        fetchUserPlan();
      }
    }
  }, [session, isPending, router]);

  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const url = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success && data.data?.url) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "Imgbb upload failed!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }

    try {
      setIsUpdating(true);

      let finalImageUrl = session?.user?.image || "";

      if (selectedFile) {
        toast.info("Uploading image...");
        finalImageUrl = await uploadImageToImgbb(selectedFile);
        setImagePreview(finalImageUrl);
      }

      const { data, error } = await authClient.updateUser({
        name: name.trim(),
        image: finalImageUrl,
      });

      if (error) {
        toast.error(error.message || "Failed to update profile!");
        return;
      }

      toast.success("Profile updated successfully!");
      setSelectedFile(null);
      router.refresh();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!mounted || isPending) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-neutral-50 dark:bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!session) return null;

  const { user } = session;
  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50/50 py-10 dark:bg-zinc-950/50 transition-colors duration-300">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-neutral-950 dark:text-zinc-50">
            Account Settings
          </h1>
          <p className="text-sm text-neutral-500 dark:text-zinc-400">
            Update your profile details and manage your account.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left Column: Avatar & Dynamic Plan Badge */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border border-neutral-200/60 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/50">
              <div className="flex flex-col items-center py-8 px-4 text-center">
                <div className="relative group h-28 w-28 overflow-hidden rounded-full ring-4 ring-green-500/10 dark:ring-green-500/20 bg-neutral-100 dark:bg-zinc-800">
                  <Image
                    src={
                      imagePreview ||
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                    }
                    alt="Profile Avatar"
                    fill
                    priority
                    className="object-cover transition-all group-hover:scale-105"
                  />

                  <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer z-20">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Camera size={20} />
                    <span className="text-[10px] font-bold mt-1">Upload</span>
                  </label>
                </div>

                <h3 className="mt-4 text-lg font-bold text-neutral-900 dark:text-zinc-50 truncate max-w-full">
                  {name}
                </h3>

                <div
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    isAdmin
                      ? "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                      : "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                  }`}
                >
                  {isAdmin ? <Shield size={12} /> : <User size={12} />}
                  {user.role || "User"}
                </div>

                {selectedFile && (
                  <span className="text-[10px] text-orange-500 font-medium mt-2 animate-pulse">
                    Unsaved changes (*image)
                  </span>
                )}
              </div>
            </Card>

            {/* 💡 ৩. ডাইনামিক প্ল্যান কার্ড (ডিজাইন মেইন্টেন করে বামে অ্যাড করা হলো) */}
            {!isAdmin && (
              <Card className="border border-neutral-200/60 bg-white p-5 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/50">
                <h4 className="text-xs font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CreditCard size={14} /> Membership Plan
                </h4>

                {planLoading ? (
                  <div className="h-12 bg-neutral-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-black text-neutral-900 dark:text-zinc-50 capitalize">
                          {userPlan?.name || user.plan || "Free"}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-zinc-400">
                          {user.plan === "free"
                            ? "Limited access"
                            : "Full premium access"}
                        </p>
                      </div>
                      <span
                        className={`p-2 rounded-xl ${
                          user.plan !== "free"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-neutral-100 dark:bg-zinc-800 text-neutral-500"
                        }`}
                      >
                        <Sparkles
                          size={20}
                          className={
                            user.plan !== "free" ? "animate-spin-slow" : ""
                          }
                        />
                      </span>
                    </div>

                    {user.plan === "free" && (
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl mt-1 text-xs shadow-sm"
                        onPress={() => router.push("/plans")}
                      >
                        Upgrade to Pro
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Right Column: Form */}
          <div className="md:col-span-2">
            <Card className="border border-neutral-200/60 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/50">
              <div className="p-6 sm:p-8 space-y-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-zinc-50 border-b border-neutral-200/60 dark:border-zinc-800/60 pb-3 flex items-center gap-2">
                  <User size={18} className="text-green-600" />
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <CustomInput
                    type="text"
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    startContent={<User size={16} />}
                  />

                  <CustomInput
                    type="email"
                    label="Email Address"
                    value={user.email}
                    disabled
                    startContent={<Mail size={16} />}
                    description="Email address cannot be changed."
                  />
                </div>

                <h2 className="text-xl font-bold text-neutral-900 dark:text-zinc-50 border-b border-neutral-200/60 dark:border-zinc-800/60 pt-4 pb-3 flex items-center gap-2">
                  <Key size={18} className="text-green-600" />
                  Security & Role
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <CustomInput
                    type="text"
                    label="Account Role"
                    value={user.role ? user.role.toUpperCase() : "USER"}
                    disabled
                    startContent={<Shield size={16} />}
                  />

                  <CustomInput
                    type="text"
                    label="Verified Status"
                    value={
                      user.emailVerified ? "Verified" : "Pending Verification"
                    }
                    disabled
                    startContent={<Calendar size={16} />}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    isLoading={isUpdating}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 h-11 rounded-xl shadow-md shadow-green-600/10 transition-all duration-200 flex items-center gap-2"
                    onPress={handleUpdateProfile}
                  >
                    {!isUpdating && <Save size={16} />}
                    {isUpdating ? "Saving Profile..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
