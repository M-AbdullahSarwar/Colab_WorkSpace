"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginRequestBodySchema } from "@colab/shared/schema";
import { Alert, AuthShell, Button, Field } from "@/components/ui";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
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

        setPending(true);
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData.data),
            });
            if (!response.ok) {
                setError(
                    response.status === 401
                        ? "That email and password don't match an account"
                        : "Could not sign in. Try again.",
                );
                return;
            }

            const data = await response.json();
            if (!data.token) {
                // A 200 without a token is a server bug, not a user mistake —
                // say so instead of leaving the form silently idle.
                setError("Signed in, but no session was issued. Try again.");
                return;
            }
            {
                localStorage.setItem("token", data.token);
                // Display-only cache so the room can name people instead of UUIDs.
                // Never read as a permission or identity source.
                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                }
                router.push("/");
            }
        } catch {
            setError("Could not reach the server. Check your connection.");
        } finally {
            setPending(false);
        }
    };

    return (
        <AuthShell
            title="Sign in"
            intro="Open your team's rooms and pick up the thread where it was left."
            footer={
                <>
                    No account yet?{" "}
                    <Link
                        href="/signup"
                        className="text-accent underline decoration-accent/35 hover:decoration-accent"
                    >
                        Create one
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                {error ? <Alert>{error}</Alert> : null}
                <Field
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@team.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Field
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" disabled={pending} className="mt-1 w-full">
                    {pending ? "Signing in…" : "Sign in"}
                </Button>
            </form>
        </AuthShell>
    );
}
