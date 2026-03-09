"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UserPlus, Shield } from "lucide-react";
import Loader from "@/components/ui/Loader";
import RouteGuard from "@/components/auth/RouteGuard";

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "analyst" });
  const [msg, setMsg] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("/api/admin/users").then((r) => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (userData: typeof form) =>
      fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(userData) }),
    onSuccess: async (res) => {
      const data = await res.json();
      if (!res.ok) { setMsg("Error: " + (data.error || "Failed")); return; }
      setMsg("User created successfully!");
      setForm({ email: "", password: "", name: "", role: "analyst" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setTimeout(() => setMsg(""), 3000);
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string, role: string }) =>
      fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) }),
    onSuccess: async (res) => {
      const data = await res.json();
      if (!res.ok) { setMsg("Error: " + (data.error || "Failed")); return; }
      setMsg("Role updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setTimeout(() => setMsg(""), 3000);
    },
  });

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader size="lg" /></div>;

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
        </div>

        {/* Create user */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-bold text-slate-800">Create New User</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "email", label: "Email", type: "email", placeholder: "analyst@lab.com" },
              { key: "name", label: "Name", type: "text", placeholder: "John Smith" },
              { key: "password", label: "Password", type: "password", placeholder: "Min 6 characters" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
                <input
                  type={type}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ))}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="analyst">Analyst</option>
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          {msg && <p className={`mt-3 text-sm ${msg.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>{msg}</p>}
          <button
            onClick={() => createMutation.mutate(form)}
            disabled={createMutation.isPending}
            className="mt-4 flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            {createMutation.isPending ? "Creating..." : "Create User"}
          </button>
        </div>

        {/* User list */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">All Users ({data?.users?.length || 0})</h3>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {["Name", "Email", "Role", "Joined"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.users?.map((user: any) => (
                <tr key={user._id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{user.name || "—"}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => updateRoleMutation.mutate({ id: user._id, role: e.target.value })}
                      disabled={updateRoleMutation.isPending && updateRoleMutation.variables?.id === user._id}
                      className={`appearance-none rounded-full px-3 py-1 text-xs font-semibold capitalize outline-none cursor-pointer focus:ring-2 focus:ring-purple-500 disabled:opacity-50 ${user.role === "admin" ? "bg-purple-100 text-purple-700" :
                        user.role === "analyst" ? "bg-blue-100 text-blue-700" :
                          "bg-slate-100 text-slate-600"
                        }`}
                    >
                      <option className="bg-white text-slate-800" value="viewer">Viewer</option>
                      <option className="bg-white text-slate-800" value="analyst">Analyst</option>
                      <option className="bg-white text-slate-800" value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RouteGuard>
  );
}
