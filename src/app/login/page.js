'use client';

import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
    const handleLogin = async (data) => {
        console.log("Login payload", data);
        // Call your login API here
    };

    return <AuthForm type="login" onSubmit={handleLogin} />;
}
