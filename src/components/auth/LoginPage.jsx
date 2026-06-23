"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { Card, Input, Button, TextField, Label } from "@heroui/react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import dynamic from "next/dynamic";
import loadingGray from "@/assets/loading_gray.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const authError = searchParams.get("error");
  const hasShownError = useRef(false);

  useEffect(() => {
    if (authError && !hasShownError.current) {
      const cleanMessage = decodeURIComponent(authError).replace(/\+/g, " ");
      toast.error(cleanMessage || "Authentication failed! ❌", {
        position: "top-center",
        autoClose: 5000,
      });
      hasShownError.current = true;
    }
  }, [authError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({ 
        email, 
        password,
        callbackURL: "/" 
      });

      if (error) {
        toast.error(error.message || "Invalid credentials! ❌");
      } else {
        toast.success("Successfully logged in! 🎉");
        router.push("/");
      }
    } catch (err) {
      toast.error("Something went wrong! ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard", 
        errorCallbackURL: "/auth/signin" 
      });
      toast.success("Redirecting to Google... 🚀");
    } catch (err) {
      toast.error("Google login failed! ❌");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 dark:bg-zinc-950 transition-colors duration-300">
      <Card className="w-full max-w-md border border-neutral-200/60 bg-white p-6 shadow-xl dark:border-zinc-800/60 dark:bg-zinc-900/50 rounded-2xl">
        <Card.Header className="flex flex-col items-center justify-center gap-1.5 text-center p-0 pb-6">
          <Card.Title className="text-2xl font-black tracking-tight text-neutral-900 dark:text-zinc-50">
            Welcome Back 👋
          </Card.Title>
          <Card.Description className="text-sm text-neutral-500 dark:text-zinc-400">
            Discover & share amazing culinary recipes
          </Card.Description>
        </Card.Header>

        <Card.Content className="p-0">
          <form onSubmit={handleLogin} className="space-y-5">
            <TextField isRequired name="email" className="w-full space-y-1.5">
              <Label className="text-sm font-semibold text-neutral-700 dark:text-zinc-300">Email Address</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </TextField>
            
            <TextField isRequired name="password" className="w-full space-y-1.5">
              <Label className="text-sm font-semibold text-neutral-700 dark:text-zinc-300">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
              disabled={loading || googleLoading}
              className="w-full bg-green-600 text-white font-semibold h-11 rounded-xl shadow-md shadow-green-600/10 hover:bg-green-700 transition-all duration-200 flex items-center justify-center overflow-hidden"
            >
              {loading ? (
                <div className="flex h-full w-full items-center justify-center opacity-90 mix-blend-multiply dark:mix-blend-screen scale-100">
                  <Lottie animationData={loadingGray} loop={true} className="h-6 w-6" />
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute w-full border-t border-neutral-200 dark:border-zinc-800"></div>
            <span className="relative bg-white px-4 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:bg-zinc-900">OR</span>
          </div>

          <Button
            disabled={loading || googleLoading}
            className="w-full h-11 border border-neutral-200 dark:border-zinc-800 bg-transparent text-neutral-800 dark:text-zinc-200 font-semibold rounded-xl hover:bg-neutral-50 dark:hover:bg-zinc-900/50 transition-all duration-200 flex items-center justify-center overflow-hidden"
            onPress={handleGoogleLogin}
            startContent={
              !googleLoading && (
                <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.422 1.421 15.6 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.854 11.57-11.79 0-.795-.085-1.4-.195-1.925H12.24z"/>
                </svg>
              )
            }
          >
            {googleLoading ? (
              <div className="flex h-full w-full items-center justify-center opacity-80 mix-blend-multiply dark:mix-blend-screen scale-100">
                <Lottie animationData={loadingGray} loop={true} className="h-10 w-10" />
              </div>
            ) : (
              "Continue with Google"
            )}
          </Button>
        </Card.Content>

        <Card.Footer className="flex justify-center text-sm text-neutral-500 dark:text-zinc-400 p-0 pt-5 mt-5 border-t border-neutral-100 dark:border-zinc-900">
          <span>New to RecipeHub?</span>
          <Link href="/auth/signup" className="text-green-600 font-bold ml-1.5 hover:underline dark:text-green-500">
            Create an account
          </Link>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}