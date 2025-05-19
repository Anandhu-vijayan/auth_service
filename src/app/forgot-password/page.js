"use client";
import AuthForm from "@/components/auth-form/AuthForm";

export default function ForgotPasswordPage() {
  const handleForgotPassword = async (data) => {
    console.log("Forgot password payload", data);
    // Call your forgot password API here
  };

  return <AuthForm type="forgot" onSubmit={handleForgotPassword} />;
}
