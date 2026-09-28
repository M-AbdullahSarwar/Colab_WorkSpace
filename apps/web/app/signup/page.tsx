"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Salutation } from "@colab/shared/schema";
import { RegisterRequestBodySchema } from "@colab/shared/schema";
import { Alert, AuthShell, Button, Field } from "@/components/ui";

const SALUTATIONS = ["MR", "MS", "MRS", "DR"] as const;

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [salutation, setSalutation] = useState<Salutation | undefined>(
        undefined,
    );
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState<string | undefined>(undefined);
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const registerData = RegisterRequestBodySchema.safeParse({
            email,
            password,
            salutation,
            firstName,
            middleName,
            lastName,
        });
        if (!registerData.success) {
            // Name the field and the fix. Raw zod text names neither.
            const issue = registerData.error.issues[0];
            const field = String(issue?.path?.[0] ?? "");
            const LABEL: Record<string, string> = {
                email: "Enter a valid email address",
                password: "Password must be at least 6 characters",
                firstName: "First name must be 2 to 30 characters",
                middleName: "Middle name must be 2 to 30 characters, or left empty",
                lastName: "Last name must be 2 to 30 characters",
                salutation: "Choose one of the listed titles",
            };
            setError(LABEL[field] ?? "Check the highlighted fields and try again");
            return;
        }

        setPending(true);
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData.data),
            });
            if (response.status === 201) {
                router.push("/login");
            } else if (response.status === 409) {
                setError("That email already has an account. Sign in instead.");
            } else {
                setError("Could not create the account. Try again.");
            }
        } catch {
            setError("Could not reach the server. Check your connection.");
        } finally {
            setPending(false);
        }
    };

    return (
        <AuthShell
            title="Create your account"
            intro="One account gets you into every workspace your team adds you to."
            footer={
                <>
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-accent underline decoration-accent/35 hover:decoration-accent"
                    >
                        Sign in
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                {error ? <Alert>{error}</Alert> : null}

                <div className="grid grid-cols-[5.5rem_1fr] gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="salutation"
                            className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted"
                        >
                            Title
                        </label>
                        <select
                            id="salutation"
                            value={salutation ?? ""}
                            onChange={(e) =>
                                setSalutation(
                                    (e.target.value || undefined) as Salutation,
                                )
                            }
                            className="h-9 px-2 bg-surface text-ink text-sm rounded-[3px] border border-rule hover:border-rule-strong transition-colors duration-150"
                        >
                            <option value="">—</option>
                            {SALUTATIONS.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Field
                        label="First name"
                        name="firstName"
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Field
                        label="Middle name"
                        name="middleName"
                        autoComplete="additional-name"
                        placeholder="Optional"
                        value={middleName ?? ""}
                        onChange={(e) =>
                            setMiddleName(e.target.value || undefined)
                        }
                    />
                    <Field
                        label="Last name"
                        name="lastName"
                        autoComplete="family-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

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
                    autoComplete="new-password"
                    hint="At least 6 characters."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button type="submit" disabled={pending} className="mt-1 w-full">
                    {pending ? "Creating account…" : "Create account"}
                </Button>
            </form>
        </AuthShell>
    );
}
