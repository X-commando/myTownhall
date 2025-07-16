import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handle upvotes and downvotes
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { threadId, commentId, voteType } = body;
    
    // Validate vote type
    if (!voteType || !['up', 'down'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Invalid vote type. Must be "up" or "down"' },
        { status: 400 }
      );
    }

    // Validate that either threadId or commentId is provided
    if (!threadId && !commentId) {
      return NextResponse.json(
        { error: 'Either threadId or commentId must be provided' },
        { status: 400 }
      );
    }

    if (threadId && commentId) {
      return NextResponse.json(
        { error: 'Cannot vote on both thread and comment at the same time' },
        { status: 400 }
      );
    }
    
    if (threadId) {
      // Voting on a thread
      const thread = await prisma.forumThread.update({
        where: { id: threadId },
        data: {
          upvotes: voteType === 'up' ? { increment: 1 } : undefined,
          downvotes: voteType === 'down' ? { increment: 1 } : undefined
        }
      });
      
      return NextResponse.json({
        type: 'thread',
        id: thread.id,
        upvotes: thread.upvotes,
        downvotes: thread.downvotes
      });
    } else if (commentId) {
      // Voting on a comment
      const comment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          upvotes: voteType === 'up' ? { increment: 1 } : undefined,
          downvotes: voteType === 'down' ? { increment: 1 } : undefined
        }
      });
      
      return NextResponse.json({
        type: 'comment',
        id: comment.id,
        upvotes: comment.upvotes,
        downvotes: comment.downvotes
      });
    }
  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json(
      { error: 'Failed to process vote', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Remove a vote (optional feature)
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { threadId, commentId, voteType } = body;
    
    if (!voteType || !['up', 'down'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Invalid vote type' },
        { status: 400 }
      );
    }
    
    if (threadId) {
      const thread = await prisma.forumThread.update({
        where: { id: threadId },
        data: {
          upvotes: voteType === 'up' ? { decrement: 1 } : undefined,
          downvotes: voteType === 'down' ? { decrement: 1 } : undefined
        }
      });
      
      return NextResponse.json({
        type: 'thread',
        id: thread.id,
        upvotes: thread.upvotes,
        downvotes: thread.downvotes
      });
    } else if (commentId) {
      const comment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          upvotes: voteType === 'up' ? { decrement: 1 } : undefined,
          downvotes: voteType === 'down' ? { decrement: 1 } : undefined
        }
      });
      
      return NextResponse.json({
        type: 'comment',
        id: comment.id,
        upvotes: comment.upvotes,
        downvotes: comment.downvotes
      });
    }
    
    return NextResponse.json(
      { error: 'No threadId or commentId provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error removing vote:', error);
    return NextResponse.json(
      { error: 'Failed to remove vote', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}