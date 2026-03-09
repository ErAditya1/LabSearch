"use client";
import { IDocument } from "@/types/document";
import { Eye, Heart, ExternalLink } from "lucide-react";
import { formatDate, getFileTypeIcon } from "@/utils/helpers";
import { useState } from "react";
import { cn } from "@/utils/helpers";

interface SearchResultCardProps {
  document: IDocument;
  snippet?: string;
  query?: string;
  isFavorited?: boolean;
  onFavorite?: (id: string) => void;
  onView?: (document: IDocument) => void;
}

export default function SearchResultCard({
  document,
  snippet,
  query,
  isFavorited = false,
  onFavorite,
  onView,
}: SearchResultCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);

  const handleFavorite = () => {
    setFavorited(!favorited);
    onFavorite?.(document._id);
  };

  // Highlight query in snippet
  const highlightedSnippet = snippet && query
    ? snippet.replace(
        new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
        '<mark class="bg-yellow-200 text-yellow-900 rounded px-0.5">$1</mark>'
      )
    : snippet;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-lg">{getFileTypeIcon(document.fileType)}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold uppercase text-slate-500">
              {document.fileType}
            </span>
            <span className="text-xs text-slate-400">{formatDate(document.createdAt)}</span>
          </div>

          <h3 className="mb-2 text-lg font-bold text-slate-800 leading-tight">{document.title}</h3>

          {highlightedSnippet && (
            <p
              className="text-sm leading-relaxed text-slate-600"
              dangerouslySetInnerHTML={{ __html: highlightedSnippet }}
            />
          )}

          {document.structuredData && Object.keys(document.structuredData).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {document.structuredData.principle && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">Principle ✓</span>
              )}
              {document.structuredData.procedure && (
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-600">Procedure ✓</span>
              )}
              {document.structuredData.calculation && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-600">Calculation ✓</span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {onView && (
            <button
              onClick={() => onView(document)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Eye className="h-4 w-4" />
              View
            </button>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleFavorite}
              className={cn(
                "rounded-xl border px-3 py-2 transition-colors",
                favorited
                  ? "border-red-200 bg-red-50 text-red-500"
                  : "border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-400"
              )}
            >
              <Heart className={cn("h-4 w-4", favorited && "fill-current")} />
            </button>
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-200 px-3 py-2 text-slate-400 transition-colors hover:border-blue-200 hover:text-blue-500"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
