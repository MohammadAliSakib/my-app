import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Company } from "@/models/Company";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    await connectToDatabase();
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { sector: { $regex: search, $options: "i" } }
        ]
      };
    }

    // simplistic sort, assuming networth strings format is sortable (in real life, parse as number)
    const companies = await Company.find(query).sort({ netWorth: -1 });
    return NextResponse.json({ success: true, data: companies });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!verifyAuth(authHeader)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();
    
    const company = await Company.create(body);
    return NextResponse.json({ success: true, data: company }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
