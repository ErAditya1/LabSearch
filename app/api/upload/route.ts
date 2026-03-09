import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { uploadToImageKit } from "@/lib/imagekit";
import LabDocument from "@/models/Document";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/utils/constants";

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role === "viewer") {
      return NextResponse.json({ error: "Viewers cannot upload files" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only PDF, JPG, PNG, TIFF allowed." }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum 50MB allowed." }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to ImageKit
    const { url, fileId } = await uploadToImageKit(buffer, file.name, "/labsearch");

    // Determine file type label
    const fileType = file.type.split("/")[1] || file.type;

    // Save document record in MongoDB
    await connectDB();
    const doc = await LabDocument.create({
      title: title.trim(),
      fileUrl: url,
      fileType,
      extractedText: "",
      structuredData: {},
      uploadedBy: (session.user as any).id,
      fileSize: file.size,
    });

    return NextResponse.json({
      success: true,
      documentId: doc._id.toString(),
      message: "File uploaded successfully",
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
