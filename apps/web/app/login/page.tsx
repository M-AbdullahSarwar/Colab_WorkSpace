"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginRequestBodySchema } from "@colab/shared/schema";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const loginData = LoginRequestBodySchema.safeParse({ email, password });
        if (!loginData.success) {
            setError(
                "Enter a valid email and a password of at least 6 characters",
            );
            return;
        }

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData.data),
            });
            if (!response.ok) {
                setError("Login Failed");
                return;
            }

            const data = await response.json();
            if (data.token) {
                localStorage.setItem("token", data.token);
                router.push("/");
            }
        } catch (err) {
            setError("Login Failed");
            return;
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
