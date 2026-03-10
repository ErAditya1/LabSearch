"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/contexts/UserContext";
import { useSession } from "next-auth/react";
import { User, Shield, Bell, Database, Loader2, Camera } from "lucide-react";
import Link from "next/link";
import RouteGuard from "@/components/auth/RouteGuard";

export default function SettingsPage() {
  const { id, email: contextEmail, name: contextName, image: contextImage, role, isLoading } = useUser();
  const { update } = useSession();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      setEmail(contextEmail || "");
      setName(contextName || "");
      setAvatarPreview(contextImage || null);
    }
  }, [isLoading, contextEmail, contextName, contextImage]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (avatar) {
        formData.append("file", avatar);
      }

      const res = await fetch("/api/user/profile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Tell NextAuth to update the session to reflect the new name & image
      await update({ name: data.user.name, image: data.user.image });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RouteGuard allowedRoles={["admin", "analyst", "viewer"]}>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Profile */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="flex h-20 w-20 overflow-hidden rounded-full bg-blue-50 border-2 border-slate-100 items-center justify-center relative">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-blue-600" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/jpeg, image/png, image/webp"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Profile Settings</h3>
              <p className="text-sm text-slate-500">Update your personal information and display picture</p>
            </div>
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
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
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
