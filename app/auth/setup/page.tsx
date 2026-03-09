"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function SetupPage() {
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
        body: JSON.stringify({ ...form, role: "admin" }),
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #22c55e 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 bg-lab-500 rounded-xl flex items-center justify-center shadow-lg shadow-lab-500/30">
            <FlaskConical className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">LabSearch</h1>
            <p className="text-slate-400 text-xs font-mono">Initial Setup</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-1">Create Admin Account</h2>
          <p className="text-slate-400 text-sm mb-8">Set up the first administrator account for your lab</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-950/50 border border-red-800 text-red-300 rounded-lg px-4 py-3 mb-6 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-green-950/50 border border-green-800 text-green-300 rounded-lg px-4 py-3 mb-6 text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              Admin account created! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Lab Manager"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-lab-500 focus:ring-1 focus:ring-lab-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@lab.com"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-lab-500 focus:ring-1 focus:ring-lab-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 6 characters"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-lab-500 focus:ring-1 focus:ring-lab-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-lab-500 hover:bg-lab-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 flex items-center justify-center gap-2 transition-colors text-sm"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
              ) : "Create Admin Account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <a href="/auth/login" className="block text-center text-sm text-slate-400 hover:text-slate-200 transition-colors">
              ← Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
