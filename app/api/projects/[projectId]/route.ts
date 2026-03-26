import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Proof from "@/models/Proof";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    await connectDB();

    const { projectId } = await context.params;

    console.log("Fetching proofs for projectId:", projectId);

    const proofs = await Proof.find({ projectId }).sort({ timestamp: -1 });

    const formattedProofs = proofs.map((p) => ({
      ...p._doc,
      imageUrl: `https://gateway.pinata.cloud/ipfs/${p.ipfsHash}`,
    }));

    return NextResponse.json({
      projectId,
      count: formattedProofs.length,
      proofs: formattedProofs,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}