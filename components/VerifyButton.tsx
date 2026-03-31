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
    className="relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300"
    style={{
      background: "rgba(139,92,246,0.2)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(139,92,246,0.4)",
      color: "rgba(196,181,253,0.95)",
      boxShadow: "0 4px 15px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(139,92,246,0.35)";
      e.currentTarget.style.border = "1px solid rgba(139,92,246,0.65)";
      e.currentTarget.style.boxShadow = "0 6px 25px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.15)";
      e.currentTarget.style.transform = "translateY(-1px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(139,92,246,0.2)";
      e.currentTarget.style.border = "1px solid rgba(139,92,246,0.4)";
      e.currentTarget.style.boxShadow = "0 4px 15px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.1)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
    onMouseDown={(e) => {
      e.currentTarget.style.transform = "translateY(1px) scale(0.98)";
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(139,92,246,0.25)";
    }}
    onMouseUp={(e) => {
      e.currentTarget.style.transform = "translateY(-1px)";
      e.currentTarget.style.boxShadow = "0 6px 25px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.15)";
    }}
  >
    {/* Shine sweep overlay */}
    <div
      className="absolute inset-0 pointer-events-none rounded-xl"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)",
      }}
    />

    {/* Shield icon */}
    <svg
      className="w-4 h-4 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="rgba(196,181,253,0.9)"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>

    <span className="relative">Verify</span>
  </button>
);
}