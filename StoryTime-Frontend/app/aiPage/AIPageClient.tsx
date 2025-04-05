"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { createAIStory } from "@/api/aiApi";
import { createStory } from "@/api/storyApi";
import { useRouter } from "next/navigation";

export default function AIPageClient() {
  const searchParams = useSearchParams();
  const initialStory = searchParams.get("story") || "";
  const title = searchParams.get("title") || "No title provided.";
  const imageUrl = searchParams.get("imageUrl") || "No image provided.";

  const [story, setStory] = useState(initialStory);
  const [displayedStory, setDisplayedStory] = useState(initialStory);
  const [isTyping, setIsTyping] = useState(false);
  const [isUserEditing, setIsUserEditing] = useState(false);

  const router = useRouter();
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!story || isUserEditing) return;

    let index = 0;
    setDisplayedStory("");
    setIsTyping(true);

    typingIntervalRef.current = setInterval(() => {
      setDisplayedStory((prev) => prev + story[index]);
      index++;
      if (index === story.length) {
        clearInterval(typingIntervalRef.current as NodeJS.Timeout);
        setIsTyping(false);
      }
    }, 50);

    return () => clearInterval(typingIntervalRef.current as NodeJS.Timeout);
  }, [story, isUserEditing]);

  const handleRegenerate = async () => {
    setIsTyping(true);
    setIsUserEditing(false);

    const response = await createAIStory(title, story);
    if (response) {
      setStory(response.suggestion);
    } else {
      alert("AI editing failed.");
      setIsTyping(false);
    }
  };

  const handleStopTyping = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      setIsTyping(false);
    }
  };

  const handlePublish = async () => {
    try {
      const response = await createStory(title, story, imageUrl);
      if (response) {
        alert("Story published successfully.");
        router.push("/homepage");
      } else {
        alert("No response from the backend.");
      }
    } catch {
      alert("Publishing failed.");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">AI-Generated Story</h1>

      <textarea
        className="w-full h-64 text-lg p-4 border border-gray-300 rounded-md bg-white"
        value={displayedStory}
        onChange={(e) => {
          handleStopTyping();
          setDisplayedStory(e.target.value);
          setStory(e.target.value);
          setIsUserEditing(true);
        }}
      />

      <div className="flex gap-4 mt-4">
        <Button onClick={handleRegenerate} disabled={isTyping}>
          {isTyping ? "Generating..." : "Regenerate with AI"}
        </Button>
        {isTyping && (
          <Button variant="destructive" onClick={handleStopTyping}>
            Stop Typing
          </Button>
        )}
        <Button variant="outline" onClick={handlePublish}>
          Publish
        </Button>
      </div>
    </div>
  );
}
