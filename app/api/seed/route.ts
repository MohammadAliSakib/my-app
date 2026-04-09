import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Company } from "@/models/Company";

const seedCompanies = [
  {
    name: "Square Group",
    sector: "Pharmaceuticals & Conglomerate",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/2/25/Square_Group_Bangladesh_Logo.svg/150px-Square_Group_Bangladesh_Logo.svg.png",
    headquarters: "Dhaka, Bangladesh",
    foundedYear: 1958,
    netWorth: "$1.5B"
  },
  {
    name: "Beximco",
    sector: "Conglomerate",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Beximco_Group_Logo.svg/200px-Beximco_Group_Logo.svg.png",
    headquarters: "Dhaka, Bangladesh",
    foundedYear: 1970,
    netWorth: "$2.1B"
  },
  {
    name: "Walton",
    sector: "Electronics",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Walton_Group_logo.svg/200px-Walton_Group_logo.svg.png",
    headquarters: "Gazipur, Bangladesh",
    foundedYear: 1977,
    netWorth: "$1.2B"
  },
  {
    name: "PRAN-RFL Group",
    sector: "Food & Plastics",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/PRAN-RFL_Group_Logo.png/150px-PRAN-RFL_Group_Logo.png",
    headquarters: "Dhaka, Bangladesh",
    foundedYear: 1981,
    netWorth: "$1.8B"
  },
  {
    name: "Grameenphone",
    sector: "Telecommunications",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Grameenphone_Logo.svg/200px-Grameenphone_Logo.svg.png",
    headquarters: "Dhaka, Bangladesh",
    foundedYear: 1997,
    netWorth: "$3.5B"
  },
  {
    name: "Akij Group",
    sector: "Conglomerate",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/6/6f/Akij_Group_logo.png",
    headquarters: "Dhaka, Bangladesh",
    foundedYear: 1940,
    netWorth: "$1.4B"
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    await Company.deleteMany({});
    const inserted = await Company.insertMany(seedCompanies);
    return NextResponse.json({ success: true, message: "Database seeded successfully", count: inserted.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
