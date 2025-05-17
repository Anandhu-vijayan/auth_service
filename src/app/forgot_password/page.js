import AuthForm from "@/components/AuthForm";

export default function ForgotPasswordPage() {
  const handleForgotPassword = async (data) => {
    console.log("Forgot password payload", data);
    // Call your forgot password API here
  };

  return <AuthForm type="forgot" onSubmit={handleForgotPassword} />;
}
