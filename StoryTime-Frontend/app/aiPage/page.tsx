// app/aiPage/page.tsx

import dynamic from "next/dynamic";

// Dynamically import the AIPage component with SSR disabled
const AIPageClient = dynamic(() => import("./AIPageClient"), {
  ssr: false,
});

export default function AIPage() {
  return <AIPageClient />;
}
