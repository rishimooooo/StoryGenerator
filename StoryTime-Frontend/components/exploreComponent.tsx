"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardHorizontal } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { getStories } from "@/api/storyApi";
import { getAuthors } from "@/api/authorApi";
import Image from "next/image";

interface Author {
  id: string;
  name: string;
  bio: string;
  profileImage: string;
}

interface Story {
  _id: string;
  title: string;
  content: string;
  author: Author;
  votes: number;
  imageUrl: string;
}

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<"stories" | "authors">("stories");
  const [stories, setStories] = useState<Story[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === "stories") {
          const storiesData = await getStories();
          setStories(storiesData);
        } else {
          const authorsData = await getAuthors();
          setAuthors(authorsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <main className="min-h-screen px-4 py-4 md:px-6">
      <nav className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 gap-4">
        <div className="flex flex-col md:flex-row md:items-center">
          <h1 className="text-2xl font-bold mb-2 md:mb-0 md:mr-5">Explore •</h1>
          <ToggleGroup
            type="single"
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "stories" | "authors")
            }
            className="flex"
          >
            <ToggleGroupItem value="stories">Stories</ToggleGroupItem>
            <ToggleGroupItem value="authors">Authors</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Input placeholder="Search" className="flex-1 w-full sm:w-64" />
          <Button variant="outline" size="icon">
            <Filter size={20} />
          </Button>
        </div>
      </nav>

      <section className="mt-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : activeTab === "stories" ? (
          <StoriesList stories={stories} />
        ) : (
          <AuthorsList authors={authors} />
        )}
      </section>
    </main>
  );
}

function StoriesList({ stories }: { stories: Story[] }) {
  const router = useRouter();

  const handleNavBook = (id: string, content: string, title: string) => {
    router.push(
      `/book/${id}?story=${encodeURIComponent(
        content
      )}&title=${encodeURIComponent(title)}`
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <CardHorizontal
          key={story._id}
          className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between"
        >
          <div className="relative w-40 h-40">
            <Image
              src={story.imageUrl || "/uploads/cover.jpg"}
              alt={story.title}
              fill
              className="object-cover rounded-full"
            />
          </div>

          <div className="flex-1 pr-0 sm:pr-4">
            <h2 className="text-lg sm:text-xl font-semibold">{story.title}</h2>
            <p className="text-sm text-gray-700">
              by{" "}
              {story.author
                ? typeof story.author === "string"
                  ? story.author
                  : story.author.name
                : "Unknown"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {story.content.substring(0, 100)}...
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                onClick={() =>
                  handleNavBook(story._id, story.content, story.title)
                }
              >
                Read Now
              </Button>
            </div>
          </div>
        </CardHorizontal>
      ))}
    </div>
  );
}

function AuthorsList({ authors }: { authors: Author[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {authors.map((author) => (
        <CardHorizontal
          key={author.id}
          className="p-4 sm:p-6 flex flex-col sm:flex-row items-start"
        >
          <div className="relative w-16 h-16">
            <Image
              src={author.profileImage || "/default-avatar.png"}
              alt={author.name}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold">{author.name}</h2>
            <p className="text-sm text-gray-500">{author.bio}</p>
          </div>
        </CardHorizontal>
      ))}
    </div>
  );
}
