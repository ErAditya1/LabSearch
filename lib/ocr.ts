import { createWorker } from "tesseract.js";
import sharp from "sharp";

/**
 * Preprocess an image using sharp for faster and more accurate OCR.
 * - Grayscale: Removes color data.
 * - Normalize: Improves contrast.
 * - Resize: Caps width at 1800px (sweet spot for Tesseract speed).
 * - Sharpen: Enhances text edges.
 */
async function preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
  try {
    return await sharp(imageBuffer)
      .resize({ width: 1800, withoutEnlargement: true })
      .grayscale()
      .normalize()
      .sharpen()
      .toFormat("png")
      .toBuffer();
  } catch (error) {
    console.error("Image preprocessing failed, falling back to original:", error);
    return imageBuffer;
  }
}

/**
 * Run OCR on an image buffer using Tesseract.js.
 * Returns the extracted text.
 */
export async function runOCR(imageBuffer: Buffer): Promise<string> {
  const processedBuffer = await preprocessImage(imageBuffer);

  // Use Tesseract's automatic page segmentation for better layout parsing
  const worker = await createWorker("eng");

  try {
    const { data } = await worker.recognize(processedBuffer);
    return data.text;
  } finally {
    await worker.terminate();
  }
}

