"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FlaskConical, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="relative w-full max-w-md px-6">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500 shadow-xl shadow-blue-500/30">
              <FlaskConical className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">LabSearch</h1>
          <p className="mt-2 text-blue-300">Environmental Lab Method Finder</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-md border border-white/20 shadow-2xl">
          <h2 className="mb-6 text-xl font-bold text-white">Sign in to your account</h2>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/20 px-4 py-3 text-red-200 border border-red-500/30">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-blue-200">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="analyst@laboratory.com"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none backdrop-blur-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-blue-200">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pr-12 text-white placeholder-white/40 outline-none backdrop-blur-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50 shadow-lg shadow-blue-600/30"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-white/50">Don't have an account? </span>
            <a href="/auth/register" className="text-blue-300 hover:text-blue-200 transition-colors">
              Sign Up
            </a>
          </div>

          <p className="mt-4 text-center text-sm text-white/50">
            Contact your lab administrator for specific role permissions.
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-blue-400/60">
          LabSearch v1.0 · Environmental Laboratory Management System
        </p>
      </div>
    </div>
  );
}
