"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard, Upload, Library, Search, Heart, Settings, LogOut, FlaskConical, ChevronRight
} from "lucide-react";
import { cn } from "@/utils/helpers";

const navItems: { href: string; label: string; icon: any; roles: ("admin" | "analyst" | "viewer")[] }[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "analyst", "viewer"] },
  { href: "/dashboard/upload", label: "Upload", icon: Upload, roles: ["admin", "analyst"] },
  { href: "/dashboard/library", label: "Library", icon: Library, roles: ["admin", "analyst", "viewer"] },
  { href: "/dashboard/search", label: "Search", icon: Search, roles: ["admin", "analyst", "viewer"] },
  { href: "/dashboard/favorites", label: "Favorites", icon: Heart, roles: ["admin", "analyst"] },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["admin", "analyst", "viewer"] },
];

export default function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean, setIsOpen?: (v: boolean) => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 md:static md:w-64 md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
          <FlaskConical className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-800 text-lg leading-tight">LabSearch</h1>
          <p className="text-xs text-slate-500">Lab Method Finder</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.filter(item => !role || item.roles.includes(role as any)).map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsOpen?.(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:bg-slate-50",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-slate-400")} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight className="h-4 w-4 text-blue-400" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info + Sign out */}
      <div className="border-t border-slate-100 p-4">
        <div className="mb-3 rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-sm font-medium text-slate-800 truncate">{session?.user?.email}</p>
          <span className={cn(
            "mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
            role === "admin" ? "bg-purple-100 text-purple-700" :
              role === "analyst" ? "bg-blue-100 text-blue-700" :
                "bg-slate-100 text-slate-600"
          )}>
            {role}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
