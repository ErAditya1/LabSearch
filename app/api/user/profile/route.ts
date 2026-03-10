import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { uploadToImageKit } from "@/lib/imagekit";
import User from "@/models/User";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/utils/constants";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const name = formData.get("name") as string | null;
        const file = formData.get("file") as File | null;

        const updates: { name?: string; image?: string } = {};

        if (name) {
            updates.name = name.trim();
        }

        if (file && file.size > 0) {
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                return NextResponse.json({ error: "Invalid file type. Only PDF, JPG, PNG, TIFF allowed." }, { status: 400 });
            }

            const maxSize = 5 * 1024 * 1024; // 5MB for avatars
            if (file.size > maxSize) {
                return NextResponse.json({ error: "Avatar too large. Maximum 5MB allowed." }, { status: 400 });
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const { url } = await uploadToImageKit(buffer, file.name, "/labsearch/avatars");

            updates.image = url;
        }

        if (Object.keys(updates).length > 0) {
            await connectDB();
            const updatedUser = await User.findByIdAndUpdate(
                (session.user as any).id,
                { $set: updates },
                { new: true }
            );

            if (!updatedUser) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                message: "Profile updated successfully",
                user: {
                    name: updatedUser.name,
                    image: updatedUser.image,
                }
            });
        }

        return NextResponse.json({
            success: true,
            message: "No changes made",
        });

    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update profile" },
            { status: 500 }
        );
    }
}
