import { runOCR } from "@/lib/ocr";
import { parseLabMethod, extractTitle } from "@/lib/parser";
import { StructuredData } from "@/types/document";

export class OCRService {
  /**
   * Process an image buffer: run OCR and parse structured data
   */
  static async processImage(
    buffer: Buffer,
    filename: string
  ): Promise<{ text: string; structured: StructuredData; title: string }> {
    const text = await runOCR(buffer);
    const structured = parseLabMethod(text);
    const title = extractTitle(text, filename);
    return { text, structured, title };
  }

  /**
   * Process PDF text (already extracted via pdf-parse)
   */
  static async processPDFText(
    text: string,
    filename: string
  ): Promise<{ structured: StructuredData; title: string }> {
    const structured = parseLabMethod(text);
    const title = extractTitle(text, filename);
    return { structured, title };
  }
}
