import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET specific meeting
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Meeting ID is required' },
        { status: 400 }
      );
    }

    const meeting = await prisma.meeting.findUnique({
      where: { id },
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
      }
    });

    if (!meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(meeting);
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meeting', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH update meeting
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: body,
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
      }
    });

    return NextResponse.json(updatedMeeting);
  } catch (error) {
    console.error('Error updating meeting:', error);
    return NextResponse.json(
      { error: 'Failed to update meeting', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE meeting
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.meeting.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return NextResponse.json(
      { error: 'Failed to delete meeting', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 