import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import LabDocument from "@/models/Document";

// GET: List all documents
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const documents = await LabDocument.find()
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    return NextResponse.json({ documents, total: documents.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a document by ID
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "admin") {
      return NextResponse.json({ error: "Only admins can delete documents" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
    }

    await connectDB();
    const doc = await LabDocument.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Document deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: placeholder for other updates
export async function PATCH(req: NextRequest) {
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
