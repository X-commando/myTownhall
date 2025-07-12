import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handle upvotes and downvotes
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { threadId, commentId, voteType } = body;
    
    if (threadId) {
      // Voting on a thread
      const thread = await prisma.forumThread.update({
        where: { id: threadId },
        data: {
          upvotes: voteType === 'up' ? { increment: 1 } : undefined,
          downvotes: voteType === 'down' ? { increment: 1 } : undefined
        }
      });
      return NextResponse.json(thread);
    } else if (commentId) {
      // Voting on a comment
      const comment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          upvotes: voteType === 'up' ? { increment: 1 } : undefined,
          downvotes: voteType === 'down' ? { increment: 1 } : undefined
        }
      });
      return NextResponse.json(comment);
    }
    
    return NextResponse.json(
      { error: 'No threadId or commentId provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json(
      { error: 'Failed to vote' },
      { status: 500 }
    );
  }
}