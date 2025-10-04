import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

//  Fix: Use `any` for context to avoid Next.js 15 type validation error
export async function GET(request: NextRequest, context: any) {
  const { params } = context;

  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    if (!blogPost)
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: any) {
  const { params } = context;

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await (await supabase).auth.getUser();

    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const blogPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!blogPost)
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });

    if (blogPost.authorId !== user.id)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { title, content } = await request.json();

    const updatedPost = await prisma.blogPost.update({
      where: { id: params.id },
      data: { title, content },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: any) {
  const { params } = context;

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await (await supabase).auth.getUser();

    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const blogPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!blogPost)
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });

    if (blogPost.authorId !== user.id)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.blogPost.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
