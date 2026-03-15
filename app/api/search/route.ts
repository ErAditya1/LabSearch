import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { extractSnippet, highlightText, searchDocuments } from "@/lib/search";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();
    const type = (searchParams.get("type") || "all") as "all" | "title" | "content";

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const { documents: results } = await searchDocuments(query, type);

    // Add highlighted snippets to each result
    const enriched = results.map((doc: any) => {
      const snippet = extractSnippet(doc.extractedText || "", query);
      return {
        document: doc,
        snippet: highlightText(snippet, query),
      };
    });

    return NextResponse.json({ results: enriched, total: enriched.length });
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: error.message || "Search failed" },
      { status: 500 }
    );
  }
}
