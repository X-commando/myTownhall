import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add a comment to a thread
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        author: body.author,
        threadId: body.threadId
      }
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}