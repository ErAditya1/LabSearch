"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import DocumentCard from "@/components/documents/DocumentCard";
import DocumentViewer from "@/components/documents/DocumentViewer";
import Loader from "@/components/ui/Loader";
import { IDocument } from "@/types/document";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const queryClient = useQueryClient();
  const [viewingDoc, setViewingDoc] = useState<IDocument | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetch("/api/favorites").then((r) => r.json()),
  });

  const favMutation = useMutation({
    mutationFn: (documentId: string) =>
      fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documentId }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader size="lg" text="Loading favorites..." /></div>;
  }

  const favorites = data?.favorites || [];
  const docs: IDocument[] = favorites
    .map((f: any) => f.documentId)
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <p className="text-slate-500">{docs.length} saved test method{docs.length !== 1 ? "s" : ""}</p>

      {docs.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200">
          <Heart className="h-12 w-12 text-slate-300" />
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-600">No favorites yet</p>
            <p className="text-sm text-slate-400">Click the heart icon on any document to save it here</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <DocumentCard
              key={doc._id}
              document={doc}
              isFavorited={true}
              onView={setViewingDoc}
              onFavorite={(id) => favMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      {viewingDoc && (
        <DocumentViewer document={viewingDoc} onClose={() => setViewingDoc(null)} />
      )}
    </div>
  );
}
