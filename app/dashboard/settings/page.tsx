"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { User, Shield, Bell, Database, Loader2 } from "lucide-react";
import Link from "next/link";
import RouteGuard from "@/components/auth/RouteGuard";

export default function SettingsPage() {
  const { id, email: contextEmail, name: contextName, role, isLoading } = useUser();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setEmail(contextEmail || "");
      setName(contextName || "");
    }
  }, [isLoading, contextEmail, contextName]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Profile */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Profile</h3>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Role info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Account Role</h3>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-sm font-bold capitalize ${role === "admin" ? "bg-purple-100 text-purple-700" :
                role === "analyst" ? "bg-blue-100 text-blue-700" :
                  "bg-slate-200 text-slate-600"
                }`}>
                {role}
              </span>
              <p className="text-sm text-slate-600">
                {role === "admin" ? "Full system access including user management" :
                  role === "analyst" ? "Can upload, search, and manage documents" :
                    "Read-only access to search and view documents"}
              </p>
            </div>
          </div>
          {role === "admin" && (
            <div className="mt-4">
              <Link
                href="/dashboard/admin"
                className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors"
              >
                <Database className="h-4 w-4" />
                Admin Panel — Manage Users
              </Link>
            </div>
          )}
        </div>

        {/* Keyboard shortcuts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
              <Bell className="h-5 w-5 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Keyboard Shortcuts</h3>
          </div>
          <div className="space-y-3">
            {[
              { key: "/", desc: "Focus search bar" },
              { key: "Esc", desc: "Close modal / dialog" },
            ].map(({ key, desc }) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-sm text-slate-600">
                  {key}
                </kbd>
                <span className="text-sm text-slate-600">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
