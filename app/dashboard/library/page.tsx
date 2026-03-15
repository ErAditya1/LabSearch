"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSession } from "next-auth/react";
import DocumentCard from "@/components/documents/DocumentCard";
import DocumentViewer from "@/components/documents/DocumentViewer";
import Loader from "@/components/ui/Loader";
import SearchBox from "@/components/ui/SearchBox";
import { IDocument } from "@/types/document";
import { Library, Search } from "lucide-react";

export default function LibraryPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const queryClient = useQueryClient();
  const [viewingDoc, setViewingDoc] = useState<IDocument | null>(null);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState<"all" | "title" | "content">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: () => fetch("/api/documents").then((r) => r.json()),
  });

  const { data: favData } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetch("/api/favorites").then((r) => r.json()),
  });

  const favIds = new Set(favData?.favorites?.map((f: any) => f.documentId?._id || f.documentId));

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/documents/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  });

  const favMutation = useMutation({
    mutationFn: (documentId: string) =>
      fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documentId }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  const documents: IDocument[] = data?.documents || [];

  const filtered = documents.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const titleMatch = d.title.toLowerCase().includes(q);
    const contentMatch = (d.extractedText || "").toLowerCase().includes(q);

    if (searchType === "title") return titleMatch;
    if (searchType === "content") return contentMatch;
    return titleMatch || contentMatch;
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="lg" text="Loading documents..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search filter */}
      <div className="flex items-center gap-4">
        <SearchBox
          onSearch={(q, type) => {
            setSearch(q);
            setSearchType(type);
          }}
          placeholder="Filter by title or content..."
          className="flex-1"
        />
        <p className="text-sm text-slate-500 whitespace-nowrap">{filtered.length} document{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Document grid */}
      {filtered.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200">
          {documents.length === 0 ? (
            <>
              <Library className="h-12 w-12 text-slate-300" />
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-600">Library is empty</p>
                <p className="text-sm text-slate-400">Upload documents to get started</p>
              </div>
            </>
          ) : (
            <>
              <Search className="h-12 w-12 text-slate-300" />
              <p className="text-slate-500">No documents match your search</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => (
            <DocumentCard
              key={doc._id}
              document={doc}
              isFavorited={favIds.has(doc._id)}
              onView={setViewingDoc}
              onFavorite={(id) => favMutation.mutate(id)}
              onDelete={(id) => deleteMutation.mutate(id)}
              canDelete={role === "admin" || role === "analyst"}
            />
          ))}
        </div>
      )}

      {/* Document viewer modal */}
      {viewingDoc && (
        <DocumentViewer document={viewingDoc} onClose={() => setViewingDoc(null)} />
      )}
    </div>
  );
}
