import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";

const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "analyst", "viewer"]),
});

// GET: List all users (admin only)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  await connectDB();
  const users = await User.find().select("-password").lean();
  return NextResponse.json({ users });
}

// POST: Create new user (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = CreateUserSchema.parse(body);

    await connectDB();
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const user = await User.create({ ...data });

    return NextResponse.json({
      success: true,
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
