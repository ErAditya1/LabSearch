"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, BookOpen, Upload, Search, TrendingUp } from "lucide-react";
import Loader from "@/components/ui/Loader";
import SearchBox from "@/components/ui/SearchBox";
import { QUICK_TESTS } from "@/utils/constants";
import { formatDate, getFileTypeIcon } from "@/utils/helpers";
import { IDocument } from "@/types/document";

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  purple: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  green: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  orange: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
  red: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  cyan: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100",
  gray: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
  yellow: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
};

export default function DashboardPage() {
  const router = useRouter();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: () => fetch("/api/stats").then((r) => r.json()),
  });

  const handleSearch = (query: string, type: string = "all") => {
    if (query.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(query)}&type=${type}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Search */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-lg shadow-blue-200">
        <h2 className="mb-2 text-2xl font-bold">Find a Test Method</h2>
        <p className="mb-5 text-blue-200">Search across all uploaded lab manuals instantly</p>
        <SearchBox
          onSearch={handleSearch}
          placeholder="Search for BOD, COD, pH, Heavy Metals..."
          className="max-w-2xl"
          large
        />
        <p className="mt-3 text-xs text-blue-300">Press <kbd className="rounded bg-blue-500 px-1.5 py-0.5 font-mono">/</kbd> to focus search</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Documents", value: stats?.totalDocuments || 0, icon: FileText, color: "text-blue-600 bg-blue-50" },
          { label: "Pages Indexed", value: stats?.totalPages || 0, icon: BookOpen, color: "text-purple-600 bg-purple-50" },
          { label: "Recent Uploads", value: stats?.recentUploads?.length || 0, icon: Upload, color: "text-green-600 bg-green-50" },
          { label: "Methods Available", value: stats?.totalDocuments || 0, icon: TrendingUp, color: "text-orange-600 bg-orange-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Tests */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Quick Access Tests</h3>
          <Link href="/dashboard/search" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_TESTS.map(({ name, description, color }) => (
            <button
              key={name}
              onClick={() => handleSearch(name)}
              className={`rounded-2xl border px-4 py-4 text-left transition-all ${colorMap[color]}`}
            >
              <p className="text-xl font-bold">{name}</p>
              <p className="mt-0.5 text-xs opacity-70">{description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent uploads */}
      {stats?.recentUploads?.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Recent Uploads</h3>
            <Link href="/dashboard/library" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View library →
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {stats.recentUploads.map((doc: IDocument, i: number) => (
              <div
                key={doc._id}
                className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 ${i !== 0 ? "border-t border-slate-100" : ""}`}
              >
                <span className="text-2xl">{getFileTypeIcon(doc.fileType)}</span>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-semibold text-slate-800">{doc.title}</p>
                  <p className="text-xs text-slate-500">{formatDate(doc.createdAt)}</p>
                </div>
                <Link
                  href={`/dashboard/library`}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-blue-200 hover:text-blue-600"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No documents CTA */}
      {stats?.totalDocuments === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center">
          <Upload className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <h3 className="mb-2 text-lg font-bold text-slate-800">No documents yet</h3>
          <p className="mb-6 text-slate-500">Upload your first lab manual to get started</p>
          <Link
            href="/dashboard/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            Upload First Document
          </Link>
        </div>
      )}
    </div>
  );
}
