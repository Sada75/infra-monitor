"use client";

import crypto from "crypto";

export default function VerifyButton({
  imageUrl,
  dataHash,
}: {
  imageUrl: string;
  dataHash: string;
}) {
  async function verify() {
  const res = await fetch(imageUrl);
  const buffer = await res.arrayBuffer();

  const hashBuffer = await window.crypto.subtle.digest("SHA-256", buffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex =
    "0x" +
    hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  if (hashHex === dataHash) {
    alert("✅ Verified: Not tampered");
  } else {
    alert("❌ Tampered");
  }
}

  return (
    <button
      onClick={verify}
      className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
    >
      Verify
    </button>
  );
}