// ✅ app/read/page.tsx

"use client";

import { Navbar } from "@/components/Navbar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReadPage() {
  const searchParams = useSearchParams();
  const [chapters, setChapters] = useState<
    {
      id: number;
      title: string;
      content: string;
      likes: number;
      liked: boolean;
    }[]
  >([]);

  useEffect(() => {
    const chaptersParam = searchParams.get("chapters");

    if (chaptersParam) {
      try {
        const decodedChapters = JSON.parse(decodeURIComponent(chaptersParam));
        setChapters(decodedChapters);
      } catch (error) {
        console.error("Error parsing chapters:", error);
      }
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      {chapters.length > 0 ? (
        chapters.map((chapter) => (
          <div key={chapter.id} className="flex-col items-center p-10">
            <h1 className="text-5xl font-bold">{chapter.title}</h1>
            <h2 className="pl-2 text-2xl">Chapter {chapter.id}</h2>
            <div className="mt-10 h-px bg-gray-300 my-4 max-w-screen-2xl mx-auto" />

            <div className="h-full sm:h-[calc(100vh-28rem)] md:h-[calc(100vh-24rem)] lg:h-[calc(100vh-20rem)] xl:h-[calc(100vh-19rem)] overflow-y-auto p-6 border rounded-lg bg-white shadow-lg">
              <p className="text-md whitespace-pre-line">{chapter.content}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No chapters are available</p>
      )}
    </main>
  );
}
