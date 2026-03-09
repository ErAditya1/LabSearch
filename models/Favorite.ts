import mongoose, { Schema, Document } from "mongoose";

export interface IFavoriteModel extends Document {
  userId: mongoose.Types.ObjectId;
  documentId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavoriteModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    documentId: { type: Schema.Types.ObjectId, ref: "LabDocument", required: true },
  },
  { timestamps: true }
);

// Unique constraint: one favorite per user per document
FavoriteSchema.index({ userId: 1, documentId: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model<IFavoriteModel>("Favorite", FavoriteSchema);
