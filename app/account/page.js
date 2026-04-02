"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";

const supabase = createClient();

export default function Page() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = (type) => async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      if (type === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) throw error;

        alert("Signed in successfully!");
        router.push("/"); // ✅ redirect AFTER login
      }

      if (type === "signup") {
        const { data: userData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (error) throw error;

        if (userData.user) {
          await supabase.from("profiles").insert([
            {
              id: userData.user.id,
              username: data.username,
            },
          ]);
        }

        alert("Account created successfully!");
        router.push("/"); // ✅ redirect AFTER signup
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-4">
      <Card className="w-full max-w-md border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl shadow-2xl rounded-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold text-white">
            Welcome
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Secure access to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 bg-zinc-800">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* SIGN IN */}
            <TabsContent value="signin">
              <form onSubmit={handleSubmit("signin")} className="space-y-4">
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="bg-zinc-800 border-zinc-700 text-white"
                />

                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-zinc-200"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* SIGN UP */}
            <TabsContent value="signup">
              <form onSubmit={handleSubmit("signup")} className="space-y-4">
                <Input
                  name="username"
                  type="text"
                  placeholder="Username"
                  required
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="bg-zinc-800 border-zinc-700 text-white"
                />

                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-zinc-200"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="text-center text-xs text-zinc-500">
          By continuing, you agree to our Terms & Privacy Policy
        </CardFooter>
      </Card>
    </div>
  );
}
