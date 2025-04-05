"use client";

import dynamic from "next/dynamic";

// Dynamically import the AIPageClient component
const AIPageClient = dynamic(() => import("./AIPageClient"), {
  ssr: false,
});

export default function AIPage() {
  return <AIPageClient />;
}
