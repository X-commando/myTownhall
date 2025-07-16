import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all meetings (with optional filtering)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const municipalityId = searchParams.get('municipalityId');
    const committee = searchParams.get('committee');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    
    if (municipalityId) {
      where.municipalityId = municipalityId;
    }
    
    if (committee) {
      where.committee = committee;
    }
    
    if (status) {
      where.status = status;
    }

    const meetings = await prisma.meeting.findMany({
      where,
      include: {
        AgendaItem: {
          orderBy: {
            order: 'asc'
          }
        },
        Municipality: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const total = await prisma.meeting.count({ where });

    return NextResponse.json({
      meetings,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meetings', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST new meeting
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.date || !body.time || !body.committee || !body.status || !body.municipalityId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, date, time, committee, status, and municipalityId are required' },
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

    const meeting = await prisma.meeting.create({
      data: {
        id: crypto.randomUUID(),
        title: body.title.trim(),
        date: new Date(body.date),
        time: body.time.trim(),
        committee: body.committee.trim(),
        status: body.status.trim(),
        municipalityId: body.municipalityId
      },
      include: {
        AgendaItem: true,
        Municipality: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });

    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json(
      { error: 'Failed to create meeting', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 