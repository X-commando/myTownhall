import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Create a new forum thread
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content || !body.author || !body.municipalityId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, author, and municipalityId are required' },
        { status: 400 }
      );
    }

    // Verify municipality exists
    const municipality = await prisma.municipality.findUnique({
      where: { id: body.municipalityId }
    });

    if (!municipality) {
      return NextResponse.json(
        { error: 'Municipality not found' },
        { status: 404 }
      );
    }

    // Create the thread with tags
    const thread = await prisma.forumThread.create({
      data: {
        id: crypto.randomUUID(),
        title: body.title.trim(),
        content: body.content.trim(),
        author: body.author.trim(),
        municipalityId: body.municipalityId,
        updatedAt: new Date(),
        ThreadTag: {
          create: body.tags?.map((tag: string) => ({
            id: crypto.randomUUID(),
            name: tag.trim()
          })) || []
        }
      },
      include: {
        ThreadTag: true,
        Comment: true,
        Municipality: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });

    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json(
      { error: 'Failed to create thread', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Get all threads (with optional filtering)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const municipalityId = searchParams.get('municipalityId');
    const tag = searchParams.get('tag');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    
    if (municipalityId) {
      where.municipalityId = municipalityId;
    }
    
    if (tag) {
      where.ThreadTag = {
        some: {
          name: tag
        }
      };
    }

    const threads = await prisma.forumThread.findMany({
      where,
      include: {
        Comment: true,
        ThreadTag: true,
        Municipality: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const total = await prisma.forumThread.count({ where });

    return NextResponse.json({
      threads,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch threads', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}