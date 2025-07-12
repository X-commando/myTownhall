import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new forum thread
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create the thread
    const thread = await prisma.forumThread.create({
      data: {
        title: body.title,
        content: body.content,
        author: body.author,
        municipalityId: body.municipalityId,
        tags: {
          create: body.tags.map((tag: string) => ({
            name: tag
          }))
        }
      },
      include: {
        tags: true,
        comments: true
      }
    });

    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json(
      { error: 'Failed to create thread' },
      { status: 500 }
    );
  }
}