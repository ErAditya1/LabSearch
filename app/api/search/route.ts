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
    const query = searchParams.get("q")?.trim() || "";
    const type = (searchParams.get("type") || "all") as "all" | "title" | "content";

    if (!query) {
      return NextResponse.json({ results: [], total: 0 });
    }

    const { documents } = await searchDocuments(query, type);

    const enriched = documents.map((doc: any) => {
      const textSource =
        type === "title"
          ? doc.title || ""
          : type === "content"
          ? doc.extractedText || ""
          : doc.extractedText || doc.title || "";

      const snippet = extractSnippet(textSource, query);

      return {
        document: doc,
        snippet: highlightText(snippet, query),
      };
    });

    return NextResponse.json({
      results: enriched,
      total: enriched.length,
    });
  } catch (error: any) {
    console.error("Search error:", error);

    return NextResponse.json(
      {
        error: error.message || "Search failed",
      },
      { status: 500 }
    );
  }
}