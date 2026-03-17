import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

/**
 * One-time seed endpoint to create an admin user.
 * Access via GET /api/seed?secret=SEED_SECRET
 * IMPORTANT: Remove or secure this in production.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  // Simple protection - remove this route in production
  if (secret !== "labsearch-init-2024") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();

    // Check if admin already exists
    const existing = await User.findOne({ email: "admin@lab.com" });
    if (existing) {
      return NextResponse.json({ message: "Admin user already exists" });
    }

    // Create admin user
    await User.create({
      email: "admin@lab.com",
      password: "admin123",
      name: "Lab Admin",
      role: "admin",
    });

    // Create demo analyst
    await User.create({
      email: "analyst@lab.com",
      password: "analyst123",
      name: "Lab Analyst",
      role: "analyst",
    });

    return NextResponse.json({
      success: true,
      message: "Users created successfully",
      users: [
        { email: "admin@lab.com", password: "admin123", role: "admin" },
        { email: "analyst@lab.com", password: "analyst123", role: "analyst" },
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
