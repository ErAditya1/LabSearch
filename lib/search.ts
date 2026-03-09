import { connectDB } from "./db";
import LabDocument from "@/models/Document";
import { IDocument } from "@/types/document";

/**
 * Search documents by query terms (title + extracted text) and return matching documents.
 */
export async function searchDocuments(query: string): Promise<{ documents: IDocument[]; total: number }> {
  await connectDB();

  const results = (await LabDocument.find(
    {
      $or: [
        { $text: { $search: query } },
        { title: { $regex: query, $options: "i" } },
      ],
    },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(20)
    .lean()) as unknown as IDocument[];

  return { documents: results, total: results.length };
}

/**
 * Highlight matching text in a snippet for display in search results.
 */
export function highlightText(text: string, query: string): string {
  if (!query || !text) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

/**
 * Extract a relevant snippet from the extracted text around the search query.
 */
export function extractSnippet(text: string, query: string, length: number = 200): string {
  if (!text) return "";
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return text.substring(0, length) + (text.length > length ? "..." : "");
  }

  const start = Math.max(0, index - 80);
  const end = Math.min(text.length, index + query.length + 120);
  const snippet = (start > 0 ? "..." : "") + text.substring(start, end) + (end < text.length ? "..." : "");
  return snippet;
}
