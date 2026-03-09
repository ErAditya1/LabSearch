/**
 * Format bytes to human readable size.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Format a date to a readable string.
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Truncate text to a given length.
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

/**
 * Get file extension from a file type string.
 */
export function getFileTypeLabel(fileType: string): string {
  if (fileType.includes("pdf")) return "PDF";
  if (fileType.includes("jpeg") || fileType.includes("jpg")) return "JPG";
  if (fileType.includes("png")) return "PNG";
  if (fileType.includes("tiff")) return "TIFF";
  return fileType.toUpperCase();
}

/**
 * Get a simple icon for a given file type.
 */
export function getFileTypeIcon(fileType: string): string {
  if (!fileType) return "📄";
  const normalized = fileType.toLowerCase();

  if (normalized.includes("pdf")) return "📄";
  if (normalized.includes("image") || normalized.includes("jpeg") || normalized.includes("jpg") || normalized.includes("png") || normalized.includes("tiff")) return "🖼️";
  if (normalized.includes("word") || normalized.includes("msword") || normalized.includes("doc")) return "📄";
  if (normalized.includes("excel") || normalized.includes("spreadsheet") || normalized.includes("sheet")) return "📊";
  if (normalized.includes("text") || normalized.includes("plain")) return "📄";
  return "📄";
}

/**
 * Combine classnames (utility).
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
