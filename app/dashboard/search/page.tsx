"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SearchBox from "@/components/ui/SearchBox";
import SearchResultCard from "@/components/search/SearchResultCard";
import DocumentViewer from "@/components/documents/DocumentViewer";
import Loader from "@/components/ui/Loader";
import { IDocument } from "@/types/document";
import { SUGGESTED_KEYWORDS } from "@/utils/constants";
import { Search } from "lucide-react";

interface SearchResult {
  document: IDocument;
  snippet: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<IDocument | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("lab_recent_searches") || "[]"); }
    catch { return []; }
  });

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setQuery(q);
    router.push(`/dashboard/search?q=${encodeURIComponent(q)}`, { scroll: false });

    // Save to recent
    setRecentSearches((prev) => {
      const updated = [q, ...prev.filter((s) => s !== q)].slice(0, 5);
      localStorage.setItem("lab_recent_searches", JSON.stringify(updated));
      return updated;
    });

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, [router]);

  const favMutation = useMutation({
    mutationFn: (documentId: string) =>
      fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documentId }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  // Auto search from URL params
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) doSearch(q);
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Search box */}
      <SearchBox
        onSearch={doSearch}
        initialValue={query}
        placeholder="Search test methods, chemicals, procedures..."
        large
      />

      {/* Suggested keywords */}
      {!searched && (
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wide">Quick searches</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_KEYWORDS.map((keyword) => (
              <button
                key={keyword}
                onClick={() => doSearch(keyword)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {keyword}
              </button>
            ))}
          </div>

          {recentSearches.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wide">Recent searches</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => doSearch(s)}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:border-blue-200 hover:text-blue-600 transition-colors"
                  >
                    <Search className="h-3 w-3 opacity-50" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Searching documents..." />
        </div>
      )}

      {/* Results */}
      {!loading && searched && (
        <div>
          <p className="mb-4 text-sm text-slate-500">
            {results.length === 0
              ? `No results for "${query}"`
              : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
          </p>

          {results.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200">
              <Search className="h-12 w-12 text-slate-200" />
              <p className="text-slate-500">Try different keywords or upload the manual</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map(({ document, snippet }) => (
                <SearchResultCard
                  key={document._id}
                  document={document}
                  snippet={snippet}
                  query={query}
                  onView={setViewingDoc}
                  onFavorite={(id) => favMutation.mutate(id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {viewingDoc && (
        <DocumentViewer document={viewingDoc} onClose={() => setViewingDoc(null)} />
      )}
    </div>
  );
}
