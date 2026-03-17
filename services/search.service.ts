import { searchDocuments } from "@/lib/search";
import { IDocument } from "@/types/document";
import { truncate } from "@/utils/helpers";

export type SearchType = "all" | "title" | "content";

export interface SearchResultWithSnippet {
  document: IDocument;
  snippet: string;
}

export class SearchService {
  static async search(
    query: string,
    type: SearchType = "all"
  ): Promise<SearchResultWithSnippet[]> {
    if (!query) return [];

    const result = await searchDocuments(query, type);

    // handle unexpected structure safely
    const documents = result?.documents || [];

    return documents.map((doc: any) => ({
      document: doc as IDocument,
      snippet: this.extractSnippet(
        doc.extractedText || doc.title || "",
        query
      ),
    }));
  }

  private static extractSnippet(
    text: string,
    query: string,
    contextLength = 200
  ): string {
    if (!text || !query) return truncate(text || "", contextLength);

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return truncate(text, contextLength);

    const start = Math.max(0, index - 80);
    const end = Math.min(text.length, index + query.length + 120);

    let snippet = text.slice(start, end);

    if (start > 0) snippet = "..." + snippet;
    if (end < text.length) snippet += "...";

    return snippet;
  }
}