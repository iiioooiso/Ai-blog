import prisma from '@/lib/prisma';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default async function BlogPage() {
  // Fetch all blog posts with author info
  const posts = await prisma.blogPost.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Blog Posts</h1>

      {posts.length === 0 ? (
        <p className="text-gray-600">No blog posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <span>By {post.author?.name || 'Anonymous'}</span>
                <span className="mx-2">•</span>
                <time dateTime={post.createdAt.toISOString()}>
                  {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </time>
              </div>
              <p className="text-gray-700 line-clamp-3">{post.content}</p>
              <div className="mt-4">
                <Link
                  href={`/protected/blog/${post.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Read more
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
