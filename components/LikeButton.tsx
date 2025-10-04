"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  blogPostId: string;
  userId: string; // server-provided userId
  initialLikes: number;
  initialIsLiked: boolean;
}

export function LikeButton({ blogPostId, userId, initialLikes, initialIsLiked }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeToggle = async () => {
    setIsLoading(true);
    const prevLikes = likes;
    const prevIsLiked = isLiked;

    // Optimistic update
    setLikes(prev => (isLiked ? prev - 1 : prev + 1));
    setIsLiked(prev => !prev);

    try {
      const response = await fetch("/protected/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: blogPostId, userId }),
      });

      if (!response.ok) throw new Error("Failed to toggle like");

      const data = await response.json();
      setLikes(data.likes);
      setIsLiked(data.isLiked);
    } catch (error) {
      setLikes(prevLikes);
      setIsLiked(prevIsLiked);
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLikeToggle}
      disabled={isLoading}
      className={cn("gap-2 transition-colors", isLiked && "text-red-500 hover:text-red-600")}
    >
      <Heart className={cn("h-4 w-4 transition-all", isLiked ? "fill-current" : "", isLoading && "opacity-50")} />
      <span className={cn(isLoading && "opacity-50")}>{likes}</span>
    </Button>
  );
}
