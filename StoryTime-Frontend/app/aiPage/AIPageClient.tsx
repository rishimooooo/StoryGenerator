"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { createAIStory } from "@/api/aiApi";
import { createStory } from "@/api/storyApi";

export default function AIPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialStory = searchParams.get("story") || "";
  const title = searchParams.get("title") || "Untitled";
  const imageUrl = searchParams.get("imageUrl") || "";

  const [story, setStory] = useState(initialStory);
  const [displayedStory, setDisplayedStory] = useState(initialStory);
  const [isTyping, setIsTyping] = useState(false);
  const [isUserEditing, setIsUserEditing] = useState(false);

  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animate typing effect when story is updated (unless user is editing)
  useEffect(() => {
    if (!story || isUserEditing) return;

    let index = 0;
    setDisplayedStory("");
    setIsTyping(true);

    typingIntervalRef.current = setInterval(() => {
      setDisplayedStory((prev) => {
        if (index >= story.length) return prev;
        return prev + story[index++];
      });

      if (index >= story.length) {
        clearInterval(typingIntervalRef.current as NodeJS.Timeout);
        setIsTyping(false);
      }
    }, 40);

    return () => clearInterval(typingIntervalRef.current as NodeJS.Timeout);
  }, [story, isUserEditing]);

  const handleRegenerate = async () => {
    setIsTyping(true);
    setIsUserEditing(false);

    try {
      const response = await createAIStory(title, story);
      if (response?.suggestion) {
        setStory(response.suggestion);
      } else {
        throw new Error("No suggestion returned.");
      }
    } catch (err) {
      console.error("AI generation failed:", err);
      alert("Something went wrong while regenerating the story.");
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
        alert("Story published successfully!");
        router.push("/homepage");
      } else {
        throw new Error("No response received from server.");
      }
    } catch (err) {
      console.error("Error publishing story:", err);
      alert("Failed to publish the story.");
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">✍️ AI-Generated Story</h1>

      <textarea
        aria-label="Generated story text"
        className="w-full h-64 text-lg p-4 border border-gray-300 rounded-md bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={displayedStory}
        onChange={(e) => {
          handleStopTyping();
          setDisplayedStory(e.target.value);
          setStory(e.target.value);
          setIsUserEditing(true);
        }}
      />

      <div className="flex flex-wrap gap-4 mt-4">
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
