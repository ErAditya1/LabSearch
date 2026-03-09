import mongoose, { Schema, Document } from "mongoose";

export interface IDocumentModel extends Document {
  title: string;
  fileUrl: string;
  fileId?: string;
  fileType: string;
  extractedText?: string;
  structuredData?: {
    principle?: string;
    reagents?: string[];
    procedure?: string;
    calculation?: string;
    notes?: string;
    precautions?: string;
  };
  uploadedBy: mongoose.Types.ObjectId;
  uploadedByEmail?: string;
  pageCount?: number;
  fileSize?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const StructuredDataSchema = new Schema({
  principle: String,
  reagents: [String],
  procedure: String,
  calculation: String,
  notes: String,
  precautions: String,
}, { _id: false });

const DocumentSchema = new Schema<IDocumentModel>(
  {
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    fileId: { type: String },
    fileType: { type: String, required: true },
    extractedText: { type: String },
    structuredData: StructuredDataSchema,
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    uploadedByEmail: { type: String },
    pageCount: { type: Number },
    fileSize: { type: Number },
    tags: [String],
  },
  { timestamps: true }
);

// Full-text search index
DocumentSchema.index({ extractedText: "text", title: "text", tags: "text" });
DocumentSchema.index({ uploadedBy: 1 });
DocumentSchema.index({ createdAt: -1 });

export default mongoose.models.LabDocument || mongoose.model<IDocumentModel>("LabDocument", DocumentSchema);
