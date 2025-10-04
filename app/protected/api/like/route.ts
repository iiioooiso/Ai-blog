import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, userId } = body;

    if (!postId || !userId) {
      return NextResponse.json({ error: "postId and userId are required" }, { status: 400 });
    }

    // Check if user already liked this post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_blogPostId: { userId, blogPostId: postId },
      },
    });

    let liked: boolean;
    let updatedLikesCount: number;

    if (existingLike) {
      // Remove like
      const result = await prisma.$transaction([
        prisma.like.delete({ where: { id: existingLike.id } }),
        prisma.blogPost.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);

      liked = false;
      updatedLikesCount = result[1].likesCount;
    } else {
      // Add like
      const result = await prisma.$transaction([
        prisma.like.create({
          data: { userId, blogPostId: postId },
        }),
        prisma.blogPost.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);

      liked = true;
      updatedLikesCount = result[1].likesCount;
    }

    return NextResponse.json({ isLiked: liked, likes: updatedLikesCount });
  } catch (err) {
    console.error("Like error:", err);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
