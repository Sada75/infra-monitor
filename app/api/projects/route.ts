import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Proof from "@/models/Proof";

export async function GET() {
  try {
    console.log("Fetching all projects...");
    await connectDB();

    const projects = await Proof.aggregate([
      {
        $group: {
          _id: "$projectId",
          count: { $sum: 1 },
          lastUpdated: { $max: "$timestamp" },
        },
      },
      {
        $sort: { lastUpdated: -1 },
      },
    ]);

    return NextResponse.json({ projects });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}