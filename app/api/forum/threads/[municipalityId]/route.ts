import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get all threads for a specific municipality
export async function GET(
  request: Request,
  { params }: { params: Promise<{ municipalityId: string }> }
) {
  try {
    const { municipalityId } = await params;
    
    if (!municipalityId) {
      return NextResponse.json(
        { error: 'Municipality ID is required' },
        { status: 400 }
      );
    }

    // Verify municipality exists
    const municipality = await prisma.municipality.findUnique({
      where: { id: municipalityId }
    });

    if (!municipality) {
      return NextResponse.json(
        { error: 'Municipality not found' },
        { status: 404 }
      );
    }

    const threads = await prisma.forumThread.findMany({
      where: {
        municipalityId: municipalityId
      },
      include: {
        Comment: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        ThreadTag: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(threads);
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch threads', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}