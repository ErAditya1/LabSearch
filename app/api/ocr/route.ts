import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import LabDocument from "@/models/Document";
import { parseLabMethod } from "@/lib/parser";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId } = await req.json();
    if (!documentId) {
      return NextResponse.json({ error: "documentId is required" }, { status: 400 });
    }

    await connectDB();
    const doc = await LabDocument.findById(documentId);
    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    let extractedText = "";

    try {
      // Fetch the file from ImageKit
      const response = await fetch(doc.fileUrl);
      const buffer = Buffer.from(await response.arrayBuffer());
      const fileType = doc.fileType?.toLowerCase();

      if (fileType === "pdf") {
        // For PDF: use pdf-parse
        try {
          const pdfParse = (await import("pdf-parse")).default;
          const pdfData = await pdfParse(buffer);
          extractedText = pdfData.text;

          // Update page count
          doc.pageCount = pdfData.numpages;
        } catch (pdfErr) {
          console.error("PDF parse failed, trying OCR:", pdfErr);
          // Fallback to OCR if pdf-parse fails
          const { runOCR } = await import("@/lib/ocr");
          extractedText = await runOCR(buffer);
        }
      } else {
        // For images: use Tesseract OCR
        const { runOCR } = await import("@/lib/ocr");
        extractedText = await runOCR(buffer);
      }
    } catch (ocrErr: any) {
      console.error("OCR processing error:", ocrErr);
      extractedText = `[OCR processing failed: ${ocrErr.message}]`;
    }

    // Parse structured lab method from extracted text
    const structuredData = parseLabMethod(extractedText);

    // Update document with extracted text and structured data
    await LabDocument.findByIdAndUpdate(documentId, {
      extractedText,
      structuredData,
      ...(doc.pageCount && { pageCount: doc.pageCount }),
    });

    return NextResponse.json({
      success: true,
      message: "OCR processing complete",
      textLength: extractedText.length,
    });
  } catch (error: any) {
    console.error("OCR route error:", error);
    return NextResponse.json(
      { error: error.message || "OCR processing failed" },
      { status: 500 }
    );
  }
}
