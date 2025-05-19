"use client";
import AuthForm from "@/components/auth-form/AuthForm";

export default function RegisterPage() {
  const handleRegister = async (data) => {
    console.log("Register payload", data);
    // Call your register API here
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
}
