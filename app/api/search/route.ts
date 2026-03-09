import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import LabDocument from "@/models/Document";
import { extractSnippet, highlightText } from "@/lib/search";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    await connectDB();

    // MongoDB full-text search on extractedText and title
    const results = await LabDocument.find(
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
      .lean();

    // Add highlighted snippets to each result
    const enriched = results.map((doc: any) => {
      const snippet = extractSnippet(doc.extractedText || "", query);
      return {
        ...doc,
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
