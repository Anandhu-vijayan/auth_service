"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/lib/validation/authSchema";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function AuthForm({ type = "login", onSubmit }) {
  const isRegister = type === "register";
  const isForgot = type === "forgot";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(authSchema),
  });

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-lg shadow-2xl p-8 rounded-2xl">
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {isRegister && (
              <div>
                <Input placeholder="Full Name" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <Input type="email" placeholder="Email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {!isForgot && (
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}

            {isRegister && (
              <div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmpassword")}
                />
                {errors.confirmpassword && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.confirmpassword.message}
                  </p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full text-lg py-2.5">
              {isRegister ? "Register" : isForgot ? "Send Reset Link" : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            {type === "login" && (
              <>
                <p>
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
                <p>
                  <Link
                    href="/forgot-password"
                    className="text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </p>
              </>
            )}
            {type === "register" && (
              <>
                <p>
                  Have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Login
                  </Link>
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
