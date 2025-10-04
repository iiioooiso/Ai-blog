"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogPostCardProps {
  id: string;
  title: string;
  content: string;
  author: {
    name: string | null;
    image: string | null;
  };
  likes: number;
  isLiked: boolean;
  createdAt: Date;
  className?: string;
}

export function BlogPostCard({
  id,
  title,
  content,
  author,
  likes,
  isLiked: initiallyLiked,
  createdAt,
  className,
}: BlogPostCardProps) {
  const [isLiked, setIsLiked] = useState(initiallyLiked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = async () => {
    try {
      const response = await fetch("/protected/api/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogPostId: id }),
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const excerpt = content.length > 150 ? `${content.slice(0, 150)}...` : content;

  return (
    <Card className={cn("hover:shadow-lg transition-shadow duration-300", className)}>
      <CardHeader className="pb-3">
        <Link href={`/protected/blog/${id}`}>
          <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={author.image || undefined} />
            <AvatarFallback>
              {author.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span>{author.name || "Unknown Author"}</span>
          <span>•</span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn(
            "gap-2 transition-colors",
            isLiked && "text-red-500 hover:text-red-600"
          )}
        >
          <Heart
            className={cn("h-4 w-4", isLiked && "fill-current")}
          />
          <span>{likeCount}</span>
        </Button>
        
        <Link href={`/protected/blog/${id}`}>
          <Button variant="link" size="sm">
            Read more
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}