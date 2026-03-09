"use client";
import { IDocument } from "@/types/document";
import { formatDate, formatFileSize, getFileTypeIcon } from "@/utils/helpers";
import { Heart, Trash2, ExternalLink, Eye } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/helpers";

interface DocumentCardProps {
  document: IDocument;
  isFavorited?: boolean;
  onFavorite?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (document: IDocument) => void;
  canDelete?: boolean;
}

export default function DocumentCard({
  document,
  isFavorited = false,
  onFavorite,
  onDelete,
  onView,
  canDelete = false,
}: DocumentCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [deleting, setDeleting] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorited(!favorited);
    onFavorite?.(document._id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this document? This cannot be undone.")) return;
    setDeleting(true);
    onDelete?.(document._id);
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
      {/* File type badge + icon */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getFileTypeIcon(document.fileType)}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold uppercase text-slate-500">
            {document.fileType}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onFavorite && (
            <button
              onClick={handleFavorite}
              className={cn(
                "rounded-lg p-1.5 transition-colors",
                favorited ? "text-red-500 hover:bg-red-50" : "text-slate-400 hover:bg-slate-100 hover:text-red-400"
              )}
              title={favorited ? "Remove favorite" : "Add to favorites"}
            >
              <Heart className={cn("h-4 w-4", favorited && "fill-current")} />
            </button>
          )}
          {canDelete && onDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
              title="Delete document"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="mb-2 line-clamp-2 font-semibold text-slate-800 leading-tight">
        {document.title}
      </h3>

      {/* Meta */}
      <div className="mb-4 space-y-1 text-xs text-slate-500">
        <p>Uploaded {formatDate(document.createdAt)}</p>
        {document.fileSize && <p>{formatFileSize(document.fileSize)}</p>}
        {document.pageCount && <p>{document.pageCount} {document.pageCount === 1 ? "page" : "pages"}</p>}
        {document.uploadedByEmail && <p>By: {document.uploadedByEmail}</p>}
      </div>

      {/* Structured data indicator */}
      {document.structuredData && Object.keys(document.structuredData).length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1">
          {document.structuredData.principle && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">Principle</span>
          )}
          {document.structuredData.procedure && (
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-600">Procedure</span>
          )}
          {document.structuredData.calculation && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-600">Calculation</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {onView && (
          <button
            onClick={() => onView(document)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Eye className="h-4 w-4" />
            View
          </button>
        )}
        <a
          href={document.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-slate-600 transition-colors hover:border-blue-200 hover:text-blue-600"
          title="Open original"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
