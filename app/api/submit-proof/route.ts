import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Proof from "@/models/Proof";
import { uploadToIPFS } from "@/lib/ipfs";
import { submitToBlockchain } from "@/lib/blockchain";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    await connectDB();



    // ✅ Use formData (NOT json)
    const formData = await req.formData();



    const file = formData.get("image") as File;
    const projectId = formData.get("projectId") as string;
    const deviceId = formData.get("deviceId") as string;
    const timestamp = Number(formData.get("timestamp"));
    const latitude = Number(formData.get("latitude"));
    const longitude = Number(formData.get("longitude"));

    console.log(projectId);

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

    


    // 🔥 1. Upload to IPFS
    
    const ipfsHash = await uploadToIPFS(buffer);
    // const ipfsHash = "test_hash";

    // 🔐 2. Generate hash (important for verification later)
    const dataHash =
        "0x" +
        crypto.createHash("sha256").update(buffer).digest("hex");

    // ⛓️ 3. Store on blockchain

    const txHash = await submitToBlockchain(
      projectId,
      deviceId,
      timestamp,
      ipfsHash,
      dataHash
    );



    // 💾 4. Save in MongoDB
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