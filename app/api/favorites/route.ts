import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";

// GET: List user's favorites
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const favorites = await Favorite.find({
      userId: (session.user as any).id,
    })
      .populate("documentId", "title fileType fileUrl extractedText structuredData createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ favorites });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Add a favorite
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId } = await req.json();
    if (!documentId) {
      return NextResponse.json({ error: "documentId required" }, { status: 400 });
    }

    await connectDB();

    // Upsert: create if not exists
    const favorite = await Favorite.findOneAndUpdate(
      { userId: (session.user as any).id, documentId },
      { userId: (session.user as any).id, documentId },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, favorite });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a favorite by ID
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Favorite ID required" }, { status: 400 });
    }

    await connectDB();
    await Favorite.findOneAndDelete({
      _id: id,
      userId: (session.user as any).id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
