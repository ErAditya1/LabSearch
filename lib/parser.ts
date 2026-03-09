import { StructuredData } from "@/types/document";

/**
 * Parse raw extracted text into a structured lab method format.
 * Uses regex patterns to find common lab manual sections.
 */
export function parseLabMethod(text: string): StructuredData {
  const normalizedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const structuredData: StructuredData = {};

  // Extract Principle section
  const principleMatch = normalizedText.match(
    /(?:principle|theory|introduction)[:\s]*\n?([\s\S]*?)(?=\n(?:reagent|chemical|material|apparatus|equipment|procedure|method|step|calculation|formula|precaution|safety|note|$))/i
  );
  if (principleMatch) {
    structuredData.principle = principleMatch[1].trim();
  }

  // Extract Reagents/Chemicals section
  const reagentsMatch = normalizedText.match(
    /(?:reagent|chemical|material)[s]?[:\s]*\n?([\s\S]*?)(?=\n(?:apparatus|equipment|procedure|method|step|calculation|precaution|safety|note|principle|$))/i
  );
  if (reagentsMatch) {
    const reagentsText = reagentsMatch[1].trim();
    // Split into list items
    structuredData.reagents = reagentsText
      .split(/\n/)
      .map((line) => line.replace(/^[-•*\d.]\s*/, "").trim())
      .filter((line) => line.length > 2);
  }

  // Extract Procedure/Method section
  const procedureMatch = normalizedText.match(
    /(?:procedure|method|steps?)[:\s]*\n?([\s\S]*?)(?=\n(?:calculation|formula|result|precaution|safety|note|$))/i
  );
  if (procedureMatch) {
    structuredData.procedure = procedureMatch[1].trim();
  }

  // Extract Calculation/Formula section
  const calcMatch = normalizedText.match(
    /(?:calculation|formula|result)[s]?[:\s]*\n?([\s\S]*?)(?=\n(?:precaution|safety|note|conclusion|$))/i
  );
  if (calcMatch) {
    structuredData.calculation = calcMatch[1].trim();
  }

  // Extract Precautions/Safety section
  const precautionsMatch = normalizedText.match(
    /(?:precaution|safety|warning)[s]?[:\s]*\n?([\s\S]*?)(?=\n(?:note|conclusion|result|$))/i
  );
  if (precautionsMatch) {
    const precautionsText = precautionsMatch[1].trim();
    structuredData.precautions = precautionsText
      .split(/\n/)
      .map((line) => line.replace(/^[-•*\d.]\s*/, "").trim())
      .filter((line) => line.length > 2);
  }

  // Extract Notes section
  const notesMatch = normalizedText.match(
    /(?:note|remark)[s]?[:\s]*\n?([\s\S]*?)(?=$)/i
  );
  if (notesMatch) {
    structuredData.notes = notesMatch[1].trim();
  }

  return structuredData;
}

/**
 * Extract a best-guess title from parsed text or fallback to filename.
 */
export function extractTitle(text: string, filename: string): string {
  if (!text) return filename.replace(/\.[^/.]+$/, "");

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  // Look for an explicit title marker
  const titleLine = lines.find((line) => /^title\s*[:\-]/i.test(line));
  if (titleLine) {
    return titleLine.replace(/^title\s*[:\-]?/i, "").trim();
  }

  // Use first non-empty line if it looks like a title
  if (lines.length > 0 && lines[0].length < 100) {
    return lines[0];
  }

  return filename.replace(/\.[^/.]+$/, "");
}

/**
 * Check if structured data was successfully parsed (has at least one section).
 */
export function hasStructuredContent(data: StructuredData): boolean {
  return !!(
    data.principle ||
    (data.reagents && data.reagents.length > 0) ||
    data.procedure ||
    data.calculation
  );
}
