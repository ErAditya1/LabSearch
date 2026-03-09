export interface StructuredData {
  principle?: string;
  reagents?: string[];
  procedure?: string;
  calculation?: string;
  precautions?: string[];
  notes?: string;
}

export interface IDocument {
  _id: string;
  title: string;
  fileUrl: string;
  fileType: "pdf" | "jpg" | "jpeg" | "png" | "tiff";
  extractedText: string;
  structuredData: StructuredData;
  uploadedBy: string;
  uploadedByEmail?: string;
  pageCount?: number;
  fileSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFavorite {
  _id: string;
  userId: string;
  documentId: string | IDocument;
  createdAt: Date;
}

export interface SearchResult {
  document: IDocument;
  score: number;
  snippet: string;
}
