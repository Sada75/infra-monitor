import { ethers } from "ethers";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;

const ABI = [
  "function submitProof(string,string,uint256,string,bytes32)"
];

export async function submitToBlockchain(
  projectId: string,
  deviceId: string,
  timestamp: number,
  ipfsHash: string,
  dataHash: string
) {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  const signer = new ethers.Wallet(
    process.env.PRIVATE_KEY!,
    provider
  );

  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  console.log("Calling contract...");

  const tx = await contract.submitProof(
    projectId,
    deviceId,
    timestamp,
    ipfsHash,
    dataHash
  );

  console.log("Waiting for tx...");

  await tx.wait();

  console.log("TX SUCCESS:", tx.hash);

  return tx.hash;
}