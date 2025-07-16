import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all agenda items (with optional filtering)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const meetingId = searchParams.get('meetingId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    
    if (meetingId) {
      where.meetingId = meetingId;
    }

    const agendaItems = await prisma.agendaItem.findMany({
      where,
      include: {
        Meeting: {
          include: {
            Municipality: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: {
        order: 'asc'
      },
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const total = await prisma.agendaItem.count({ where });

    return NextResponse.json({
      agendaItems,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching agenda items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agenda items', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST new agenda item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.content || !body.order || !body.meetingId) {
      return NextResponse.json(
        { error: 'Missing required fields: content, order, and meetingId are required' },
        { status: 400 }
      );
    }

    // Verify meeting exists
    const meeting = await prisma.meeting.findUnique({
      where: { id: body.meetingId }
    });

    if (!meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      );
    }

    const agendaItem = await prisma.agendaItem.create({
      data: {
        id: crypto.randomUUID(),
        content: body.content.trim(),
        order: parseInt(body.order),
        meetingId: body.meetingId
      },
      include: {
        Meeting: {
          include: {
            Municipality: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(agendaItem, { status: 201 });
  } catch (error) {
    console.error('Error creating agenda item:', error);
    return NextResponse.json(
      { error: 'Failed to create agenda item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 