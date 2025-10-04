import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { LikeButton } from "@/components/LikeButton";
import { createClient } from "@/lib/supabase/server";

interface BlogPostPageProps {
  params: { id: string };
}
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const postId = resolvedParams.id;


  // Fetch the post with author and likes
  const post = await prisma.blogPost.findUnique({
    where: { id: postId },
    include: { author: { select: { name: true } }, likes: true },
  });

  if (!post) notFound();

  const likeCount = post.likes.length;

  // Get current logged-in user (server-side)
  let userId = "";
  try {
    const supabase = createClient();
    const { data: { session } } = await (await supabase).auth.getSession();
    if (session) userId = session.user.id;
  } catch (error) {
    console.error("Supabase session error:", error);
  }

  const initialIsLiked = post.likes.some(like => like.userId === userId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/protected" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Back to all posts
      </Link>

      <article className="bg-white rounded-lg shadow-md p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-600 mb-4">
            <span className="font-medium">{post.author.name || "Anonymous"}</span>
            <span>•</span>
            <time dateTime={post.createdAt.toISOString()}>
              {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </time>
          </div>
        </header>

        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>

        <footer className="border-t pt-4">
          <LikeButton
            blogPostId={post.id}
            userId={userId} // pass server-side userId
            initialLikes={likeCount}
            initialIsLiked={initialIsLiked}
          />
        </footer>
      </article>
    </div>
  );
}
