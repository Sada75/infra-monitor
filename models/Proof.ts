import mongoose from "mongoose";

const ProofSchema = new mongoose.Schema({
  projectId: String,
  deviceId: String,
  timestamp: Number,
  ipfsHash: String,
  latitude: Number,
  longitude: Number,
});

export default mongoose.models.Proof ||
  mongoose.model("Proof", ProofSchema);