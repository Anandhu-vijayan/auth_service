"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";

export default function AuthForm({ type = "login", onSubmit }) {
  const isRegister = type === "register";
  const isForgot = type === "forgot";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = isRegister
      ? { name, email, password }
      : isForgot
      ? { email }
      : { email, password };
    onSubmit(payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-lg shadow-2xl p-8 rounded-2xl">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {!isForgot && (
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            )}

            <Button type="submit" className="w-full text-lg py-2.5">
              {isRegister
                ? "Register"
                : isForgot
                ? "Send Reset Link"
                : "Login"}
            </Button>
          </form>

          {type === "login" && (
            <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
              <p>
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
              <p>
                <Link href="/forgot-password" className="text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
