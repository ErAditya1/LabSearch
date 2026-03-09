import { createWorker } from "tesseract.js";

/**
 * Run OCR on an image buffer using Tesseract.js.
 * Returns the extracted text.
 */
export async function runOCR(imageBuffer: Buffer): Promise<string> {
  const worker = await createWorker("eng");
  
  try {
    const { data } = await worker.recognize(imageBuffer);
    return data.text;
  } finally {
    await worker.terminate();
  }
}
