"use client";

import { useState } from "react";
import { Card, Input, Button, TextField, Label } from "@heroui/react";
import { Eye, EyeOff, UploadCloud } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import loadingGray from "@/assets/loading_gray.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();

  // ইউআরএল থেকে callbackUrl নেওয়া হচ্ছে, না থাকলে ডিফল্ট হোম পেজ ("/")
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;

  const validatePassword = (pass) => {
    const hasUppercase = /[A-Z]/.test(pass);
    const hasLowercase = /[a-z]/.test(pass);
    const isLongEnough = pass.length >= 6;
    return hasUppercase && hasLowercase && isLongEnough;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!validatePassword(password)) {
      toast.warning(
        "Password must contain at least 6 characters, 1 uppercase and 1 lowercase letter",
      );
      return;
    }

    setLoading(true);

    try {
      let uploadedImageUrl =
        "https://api.dicebear.com/7.x/avataaars/svg?seed=user";

      if (imageFile) {
        uploadedImageUrl = await uploadImageToImgbb(imageFile);
      }

      await authClient.signUp.email(
        {
          email,
          password,
          name,
          image: uploadedImageUrl,
        },
        {
          onSuccess: async () => {
            toast.success("Registration successful!");

            await authClient.signIn.email({
              email,
              password,
            });

            router.push(callbackUrl);
          },

          onError: (ctx) => {
            console.log(ctx);
            toast.error(ctx.error.message || "Registration failed");
          },
        },
      );
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 dark:bg-zinc-950 transition-colors duration-300">
      <Card className="w-full max-w-md border border-neutral-200/60 bg-white p-6 shadow-xl dark:border-zinc-800/60 dark:bg-zinc-900/50 rounded-2xl">
        <Card.Header className="flex flex-col items-center justify-center gap-1.5 text-center p-0 pb-6">
          <Card.Title className="text-2xl font-black tracking-tight text-neutral-900 dark:text-zinc-50">
            Join RecipeHub 🍳
          </Card.Title>
          <Card.Description className="text-sm text-neutral-500 dark:text-zinc-400">
            Start sharing your passion for cooking today
          </Card.Description>
        </Card.Header>

        <Card.Content className="p-0">
          <form onSubmit={handleRegister} className="space-y-5">
            <TextField isRequired name="name" className="w-full space-y-1.5">
              <Label className="text-sm font-semibold text-neutral-700 dark:text-zinc-300">
                Full Name
              </Label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </TextField>

            <TextField isRequired name="email" className="w-full space-y-1.5">
              <Label className="text-sm font-semibold text-neutral-700 dark:text-zinc-300">
                Email Address
              </Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </TextField>

            <TextField name="image" className="w-full space-y-1.5">
              <Label className="text-sm font-semibold text-neutral-700 dark:text-zinc-300">
                Profile Image
              </Label>
              <div className="relative flex flex-col items-center justify-center border border-dashed border-neutral-200 dark:border-zinc-800 rounded-xl p-5 transition-all duration-200 hover:border-green-500 bg-neutral-50/50 dark:bg-zinc-950/30">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />

                {imagePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full ring-4 ring-green-500/10 shadow-sm">
                      <Image
                        src={imagePreview}
                        alt="Profile Preview"
                        fill
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-medium text-neutral-500 dark:text-zinc-400 max-w-[220px] truncate">
                      {imageFile?.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <UploadCloud className="w-7 h-7 text-neutral-400" />
                    <span className="text-sm font-semibold text-neutral-600 dark:text-zinc-400">
                      Click to upload file
                    </span>
                    <span className="text-xs text-neutral-400 dark:text-zinc-500">
                      Supports PNG, JPG, JPEG
                    </span>
                  </div>
                )}
              </div>
            </TextField>

            <TextField
              isRequired
              name="password"
              className="w-full space-y-1.5"
            >
              <Label className="text-sm font-semibold text-neutral-700 dark:text-zinc-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (Min 6 chars, 1 Upper, 1 Lower)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-neutral-400 hover:text-neutral-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </TextField>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold h-11 rounded-xl shadow-md shadow-green-600/10 hover:bg-green-700 transition-all duration-200 flex items-center justify-center overflow-hidden"
            >
              {loading ? (
                <div className="flex h-full w-full items-center justify-center opacity-90 mix-blend-multiply dark:mix-blend-screen scale-125">
                  <Lottie
                    animationData={loadingGray}
                    loop={true}
                    className="h-6 w-6"
                  />
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Card.Content>

        <Card.Footer className="flex justify-center text-sm text-neutral-500 dark:text-zinc-400 p-0 pt-5 mt-2 border-t border-neutral-100 dark:border-zinc-900">
          <span>Already have an account?</span>
          <Link
            href="/auth/signin"
            className="text-green-600 font-bold ml-1.5 hover:underline dark:text-green-500"
          >
            Sign In instead
          </Link>
        </Card.Footer>
      </Card>
    </div>
  );
}
