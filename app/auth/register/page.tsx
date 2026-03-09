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
        <div className="flex min-h-screen bg-slate-50">

            {/* Left Form Section */}
            <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-8">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30">
                            <FlaskConical className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Sign up for LabSearch</h1>
                        <p className="mt-2 text-sm text-slate-500">Create your account</p>
                    </div>

                    {error && (
                        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-green-600">
                            <CheckCircle className="h-5 w-5 flex-shrink-0" />
                            <p className="text-sm font-medium">Account created! Redirecting to login...</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="John Doe"
                                className="block w-full rounded-xl border-slate-300 px-4 py-3.5 text-slate-900 shadow-sm outline-none border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="analyst@laboratory.com"
                                className="block w-full rounded-xl border-slate-300 px-4 py-3.5 text-slate-900 shadow-sm outline-none border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Min 6 characters"
                                className="block w-full rounded-xl border-slate-300 px-4 py-3.5 text-slate-900 shadow-sm outline-none border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="mt-4 flex w-full justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 animate-in fade-in transition-all disabled:opacity-50"
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-slate-500">Already have an account? </span>
                        <a href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                            Sign In
                        </a>
                    </div>
                </div>
            </div>

            {/* Right Banner Section (Hidden on Mobile) */}
            <div className="hidden lg:relative lg:block lg:w-1/2 overflow-hidden bg-slate-900">
                <div
                    className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-16 text-white text-center">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Join Your Digital Lab</h2>
                    <p className="text-lg text-slate-300">
                        Create an account to access procedures, collaborate with analysts, and securely search your lab document library.
                    </p>
                </div>
            </div>
        </div>
    );
}
