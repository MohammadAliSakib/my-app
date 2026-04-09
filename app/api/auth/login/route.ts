import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Hardware admin credentials (typically should come from DB)
    if (username === "admin" && password === "admin123") {
      const token = signToken({ username: "admin", role: "admin" });
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
