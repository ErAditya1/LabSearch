"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, AlertCircle, CheckCircle } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
            } else {
                setSuccess(true);
                setTimeout(() => router.push("/auth/login"), 2000);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
            <div className="pointer-events-none absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "40px 40px" }} />

            <div className="relative w-full max-w-md px-6">
                <div className="mb-8 text-center">
                    <div className="mb-4 flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500 shadow-xl shadow-blue-500/30">
                            <FlaskConical className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white">LabSearch</h1>
                    <p className="mt-2 text-blue-300">Create your account</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-md border border-white/20 shadow-2xl">
                    <h2 className="mb-6 text-xl font-bold text-white">Sign up</h2>

                    {error && (
                        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/20 px-4 py-3 text-red-200 border border-red-500/30">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-500/20 px-4 py-3 text-green-200 border border-green-500/30">
                            <CheckCircle className="h-4 w-4 flex-shrink-0" />
                            <p className="text-sm">Account created! Redirecting to login...</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-blue-200">Full Name</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="John Doe"
                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none backdrop-blur-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-blue-200">Email address</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="analyst@laboratory.com"
                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none backdrop-blur-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-blue-200">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Min 6 characters"
                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none backdrop-blur-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="mt-2 w-full rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50 shadow-lg shadow-blue-600/30"
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-white/50">
                        Already have an account?{" "}
                        <a href="/auth/login" className="text-blue-300 hover:text-blue-200 transition-colors">
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
