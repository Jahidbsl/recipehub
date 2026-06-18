"use client";
import { useState } from "react";
import { Card, Input, Button, TextField, Label } from "@heroui/react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // ইমেইল ও পাসওয়ার্ড দিয়ে লগইন
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

  // গুগল সোশ্যাল লগইন
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard"
      });
      toast.success("Redirecting to Google... 🚀");
    } catch (err) {
      toast.error("Google login failed! ❌");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 dark:bg-zinc-950">
      <Card className="w-full max-w-md p-2">
        <Card.Header className="flex flex-col items-center justify-center gap-1 text-center">
          <Card.Title className="text-2xl font-bold">Welcome Back 👋</Card.Title>
          <Card.Description className="text-sm text-neutral-500">
            Discover & share amazing culinary recipes
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Field */}
            <TextField isRequired name="email" className="w-full">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </TextField>
            
            {/* Password Field */}
        <TextField isRequired name="password" className="w-full">
  <Label>Password</Label>

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
      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-500 hover:text-gray-700"
    >
      {showPassword ? (
        <EyeOff size={18} />
      ) : (
        <Eye size={18} />
      )}
    </button>
  </div>
</TextField>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-semibold"
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute w-full border-t border-neutral-200 dark:border-neutral-800"></div>
            <span className="relative bg-white px-3 text-xs text-neutral-400 dark:bg-zinc-900">OR</span>
          </div>

          {/* 🛠️ এখানে text-neutral-800 এবং dark:text-neutral-200 যোগ করা হয়েছে */}
          <Button
            className="w-full border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-800 dark:text-neutral-200 font-medium"
            isLoading={googleLoading}
            onPress={handleGoogleLogin}
            startContent={
              <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.422 1.421 15.6 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.854 11.57-11.79 0-.795-.085-1.4-.195-1.925H12.24z"/>
              </svg>
            }
          >
            Continue with Google
          </Button>
        </Card.Content>

        <Card.Footer className="flex justify-center text-sm text-neutral-600 dark:text-neutral-400">
          <span>New to RecipeHub? </span>
          <Link href="/auth/signup" className="text-blue-600 font-semibold ml-1 hover:underline">
            Create an account
          </Link>
        </Card.Footer>
      </Card>
    </div>
  ); 
}