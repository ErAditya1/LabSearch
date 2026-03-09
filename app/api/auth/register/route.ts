import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// This is only used internally during seeding - not exposed to users
export async function POST(req: NextRequest) {
  return NextResponse.json({ error: "Self-registration disabled. Contact admin." }, { status: 403 });
}
