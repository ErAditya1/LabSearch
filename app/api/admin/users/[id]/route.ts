import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    try {
        const { role } = await req.json();
        if (!["admin", "analyst", "viewer"].includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        // Await params specifically as it's required for Next.js 15+ dynamic route handlers
        const resolvedParams = await params;

        await connectDB();
        const user = await User.findByIdAndUpdate(resolvedParams.id, { role }, { new: true });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user: { id: user._id, role: user.role } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    try {
        const resolvedParams = await params;

        // Prevent admin from deleting themselves
        if ((session.user as any).id === resolvedParams.id) {
             return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
        }

        await connectDB();
        const user = await User.findByIdAndDelete(resolvedParams.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
