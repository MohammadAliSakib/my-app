import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Company } from "@/models/Company";
import { verifyAuth } from "@/lib/auth";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!verifyAuth(authHeader)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    await connectToDatabase();
    
    const company = await Company.findByIdAndUpdate(id, body, { new: true });
    if (!company) {
      return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: company });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!verifyAuth(authHeader)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await connectToDatabase();
    
    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Company deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
