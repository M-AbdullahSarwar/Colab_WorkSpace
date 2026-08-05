"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Salutation } from "@colab/shared/schema";
import { RegisterRequestBodySchema } from "@colab/shared/schema";

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
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const registerData = RegisterRequestBodySchema.safeParse({
                email,
                password,
                salutation,
                firstName,
                middleName,
                lastName,
            });
            if (!registerData.success) {
                setError("Invalid input data");
                return;
            }

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData.data),
            });
            if (response.status === 409) {
                setError("Email is already in use");
                return;
            } else if (response.status === 201) {
                router.push("/login");
            } else {
                setError("Error occurred while registering user");
            }
        } catch (err) {
            setError("Error occurred while registering user");
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
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
                <select
                    value={salutation || undefined}
                    onChange={(e) =>
                        setSalutation(
                            (e.target.value as Salutation) || undefined,
                        )
                    }
                >
                    <option value={undefined}>Select Salutation</option>
                    <option value="MR">Mr</option>
                    <option value="MRS">Mrs</option>
                    <option value="MS">Ms</option>
                    <option value="DR">Dr</option>
                </select>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Middle Name"
                    value={middleName || undefined}
                    onChange={(e) => setMiddleName(e.target.value || undefined)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}
