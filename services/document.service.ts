import { connectDB } from "@/lib/db";
import Document from "@/models/Document";
import Favorite from "@/models/Favorite";
import { IDocument } from "@/types/document";

export class DocumentService {
  static async getAll(page = 1, limit = 20): Promise<{ documents: IDocument[]; total: number }> {
    await connectDB();
    const skip = (page - 1) * limit;
    const [documents, total] = await Promise.all([
      Document.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Document.countDocuments(),
    ]);
    return { documents: documents as unknown as IDocument[], total };
  }

  static async getById(id: string): Promise<IDocument | null> {
    await connectDB();
    const doc = await Document.findById(id).lean();
    return doc as unknown as IDocument | null;
  }

  static async deleteById(id: string, userId: string, role: string): Promise<boolean> {
    await connectDB();
    const doc = await Document.findById(id);
    if (!doc) return false;
    // Only admin or the uploader can delete
    if (role !== "admin" && doc.uploadedBy.toString() !== userId) {
      throw new Error("Unauthorized");
    }
    await doc.deleteOne();
    // Clean up favorites
    await Favorite.deleteMany({ documentId: id });
    return true;
  }

  static async getStats(): Promise<{ totalDocuments: number; totalPages: number; recentUploads: IDocument[] }> {
    await connectDB();
    const [totalDocuments, recentUploads, pageSum] = await Promise.all([
      Document.countDocuments(),
      Document.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      Document.aggregate([{ $group: { _id: null, total: { $sum: "$pageCount" } } }]),
    ]);
    return {
      totalDocuments,
      totalPages: pageSum[0]?.total || 0,
      recentUploads: recentUploads as unknown as IDocument[],
    };
  }
}
