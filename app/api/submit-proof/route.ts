import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Proof from "@/models/Proof";
import { uploadToIPFS } from "@/lib/ipfs";
import { submitToBlockchain } from "@/lib/blockchain";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    console.log("Step 1: Request received");


    // ✅ Use formData (NOT json)
    const formData = await req.formData();

    console.log("Step 2: FormData parsed");


    const file = formData.get("image") as File;
    const projectId = formData.get("projectId") as string;
    const deviceId = formData.get("deviceId") as string;
    const timestamp = Number(formData.get("timestamp"));
    const latitude = Number(formData.get("latitude"));
    const longitude = Number(formData.get("longitude"));

    // 🔍 Basic validation
    if (!file || !projectId || !deviceId || !timestamp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🧠 Convert file → buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Step 3: File converted to buffer");


    // 🔥 1. Upload to IPFS
    console.log("Step 4: Uploading to IPFS");
    const ipfsHash = await uploadToIPFS(buffer);
    // const ipfsHash = "test_hash";

    console.log("Step 5: IPFS upload complete");
    // 🔐 2. Generate hash (important for verification later)
    const dataHash =
        "0x" +
        crypto.createHash("sha256").update(buffer).digest("hex");

    // ⛓️ 3. Store on blockchain
    console.log("Step 6: Submitting to blockchain");

    const txHash = await submitToBlockchain(
      projectId,
      deviceId,
      timestamp,
      ipfsHash,
      dataHash
    );

    console.log("Step 7: Blockchain submission complete");


    // 💾 4. Save in MongoDB
    console.log("Step 8: Saving to MongoDB");
    const proof = await Proof.create({
      projectId,
      deviceId,
      timestamp,
      ipfsHash,
      dataHash,
      latitude,
      longitude,
    });

    return new NextResponse(
      JSON.stringify({ 
        message: "Proof submitted successfully", 
        ipfsHash,
        txHash ,
        proof,
      }),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to process proof" }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}