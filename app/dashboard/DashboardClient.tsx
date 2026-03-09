"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FileText, Search, Upload, Star, TrendingUp,
  Clock, ArrowRight, FlaskConical
} from "lucide-react";
import { QUICK_TESTS } from "@/utils/constants";
import { formatDate } from "@/utils/helpers";

interface Props {
  userName: string;
  totalDocs: number;
  recentDocs: any[];
}

export function DashboardClient({ userName, totalDocs, recentDocs }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {userName.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Search lab procedures or upload new manuals
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition"
        >
          <Upload className="w-4 h-4" />
          Upload Manual
        </Link>
      </div>

      {/* Quick search bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search test procedures... (e.g. BOD, COD, pH)"
          className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition"
        >
          Search
        </button>
      </form>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Manuals", value: totalDocs, icon: FileText, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400" },
          { label: "Indexed Pages", value: totalDocs * 12, icon: TrendingUp, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400" },
          { label: "Recent Uploads", value: recentDocs.length, icon: Clock, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/50 dark:text-orange-400" },
          { label: "Quick Tests", value: QUICK_TESTS.length, icon: FlaskConical, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-5">
            <div className={`inline-flex p-2.5 rounded-xl mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Test Access */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Quick Test Access</h2>
            <Link href="/dashboard/search" className="text-sm text-primary hover:underline flex items-center gap-1">
              See all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_TESTS.map(({ name, description, icon }) => (
              <Link
                key={name}
                href={`/dashboard/search?q=${encodeURIComponent(name)}`}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition group text-center"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary">{name}</span>
                <span className="text-xs text-muted-foreground hidden sm:block">{description}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent uploads */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Recent Uploads</h2>
            <Link href="/dashboard/library" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentDocs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No documents yet.</p>
              <Link href="/dashboard/upload" className="text-primary text-sm hover:underline mt-1 inline-block">
                Upload your first manual →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDocs.map((doc: any) => (
                <Link
                  key={doc._id}
                  href={`/dashboard/library?view=${doc._id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary">
                      {doc.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doc.fileType?.toUpperCase()} · {formatDate(doc.createdAt)}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
