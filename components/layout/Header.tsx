"use client";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Overview of your lab document system" },
  "/dashboard/upload": { title: "Upload Document", subtitle: "Add new lab manuals and procedures" },
  "/dashboard/library": { title: "Document Library", subtitle: "Browse all uploaded lab manuals" },
  "/dashboard/search": { title: "Search", subtitle: "Find test methods instantly" },
  "/dashboard/favorites": { title: "Favorites", subtitle: "Your bookmarked test procedures" },
  "/dashboard/settings": { title: "Settings", subtitle: "Configure your account" },
};

import { Menu } from "lucide-react";

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const page = pageTitles[pathname] || { title: "LabSearch", subtitle: "" };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-800">{page.title}</h2>
          <p className="hidden md:block text-xs text-slate-500">{page.subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-slate-700">
            {session?.user?.name || session?.user?.email?.split("@")[0]}
          </p>
          <p className="text-xs text-slate-400">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
          {(session?.user?.email || "U")[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}
