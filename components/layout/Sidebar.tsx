"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard, Upload, Library, Search, Heart, Settings, LogOut, FlaskConical, ChevronRight
} from "lucide-react";
import { cn } from "@/utils/helpers";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/upload", label: "Upload", icon: Upload },
  { href: "/dashboard/library", label: "Library", icon: Library },
  { href: "/dashboard/search", label: "Search", icon: Search },
  { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
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
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
