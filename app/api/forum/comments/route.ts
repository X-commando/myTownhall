import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Add a comment to a thread
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.content || !body.author || !body.threadId) {
      return NextResponse.json(
        { error: 'Missing required fields: content, author, and threadId are required' },
        { status: 400 }
      );
    }

    // Verify thread exists
    const thread = await prisma.forumThread.findUnique({
      where: { id: body.threadId }
    });

    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        id: crypto.randomUUID(),
        content: body.content.trim(),
        author: body.author.trim(),
        threadId: body.threadId
      },
      include: {
        ForumThread: {
          select: {
            title: true,
            municipalityId: true
          }
        }
      }
    });

    // Update thread's updatedAt timestamp
    await prisma.forumThread.update({
      where: { id: body.threadId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Get comments for a thread
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('threadId');
    
    if (!threadId) {
      return NextResponse.json(
        { error: 'Thread ID is required' },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { threadId },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}