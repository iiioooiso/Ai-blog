"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
  _count: {
    likes: number;
  };
  likes: Array<{ userId: string }>;
}

export default function ProtectedDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNum: number) => {
    try {
      const res = await fetch(`/protected/api/blog?page=${pageNum}&limit=10`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      const fetchedPosts = Array.isArray(data.posts) ? data.posts : [];
      setPosts(prev => (pageNum === 1 ? fetchedPosts : [...prev, ...fetchedPosts]));
      setHasMore(!!data.hasMore);
    } catch (err) {
      console.error(err);
      if (pageNum === 1) setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const handleLikeUpdate = (postId: string, liked: boolean, newLikeCount: number) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
            ...post,
            _count: { ...post._count, likes: newLikeCount },
            likes: liked
              ? [...post.likes, { userId: "current-user" }]
              : post.likes.filter(like => like.userId !== "current-user"),
          }
          : post
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Dashboard</h1>
        <Link href="/protected/blog">
          <Button>All Blogs</Button>
        </Link>
      </div>
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Welcome</p>
        <Link href="/protected/blog/create">
          <Button>Create Your First Post</Button>
        </Link>
      </div>
    </div>
  );
}
