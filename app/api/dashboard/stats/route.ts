import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import LabDocument from "@/models/Document";
import Favorite from "@/models/Favorite";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const [totalDocs, totalFavorites] = await Promise.all([
    LabDocument.countDocuments(),
    Favorite.countDocuments({ userId: (session.user as any).id }),
  ]);

  return NextResponse.json({ totalDocs, totalFavorites });
}
