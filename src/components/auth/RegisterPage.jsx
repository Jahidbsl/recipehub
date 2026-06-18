"use client";

import { useState } from "react";
import { Card, Input, Button, TextField, Label } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

            // Auto Sign In
            await authClient.signIn.email({
              email,
              password,
            });

            router.push("/");
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
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 dark:bg-zinc-950">
      <Card className="w-full max-w-md p-2">
        <Card.Header className="flex flex-col items-center justify-center gap-1 text-center">
          <Card.Title className="text-2xl font-bold">
            Join RecipeHub 🍳
          </Card.Title>
          <Card.Description className="text-sm text-neutral-500">
            Start sharing your passion for cooking today
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <form onSubmit={handleRegister} className="space-y-4">
            <TextField isRequired name="name" className="w-full">
              <Label>Full Name</Label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </TextField>

            <TextField isRequired name="email" className="w-full">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </TextField>

            <TextField name="image" className="w-full">
              <Label>Profile Image</Label>
              <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-4 transition-colors hover:border-green-500 bg-neutral-100/50 dark:bg-zinc-900/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />

                {imagePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-green-500 shadow-sm">
                      <Image
                        src={imagePreview}
                        alt="Profile Preview"
                        fill
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-xs text-neutral-500 max-w-[200px] truncate">
                      {imageFile?.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center gap-1">
                    <svg
                      className="w-8 h-8 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Click to upload file
                    </span>
                    <span className="text-xs text-neutral-400">
                      Supports PNG, JPG, JPEG
                    </span>
                  </div>
                )}
              </div>
            </TextField>

            <TextField isRequired name="password" className="w-full">
              <Label>Password</Label>

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
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </TextField>

            <Button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold shadow-md hover:bg-green-700"
              isLoading={loading}
            >
              Sign Up
            </Button>
          </form>
        </Card.Content>

        <Card.Footer className="flex justify-center text-sm text-neutral-600 dark:text-neutral-400">
          <span>Already have an account? </span>
          <Link
            href="/auth/signin"
            className="text-green-600 font-semibold ml-1 hover:underline"
          >
            Sign In instead
          </Link>
        </Card.Footer>
      </Card>
    </div>
  );
}
