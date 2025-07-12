import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all threads for ONE SPECIFIC TOWN
export async function GET(
  request: Request,
  { params }: { params: Promise<{ municipalityId: string }> }
) {
  try {
    const { municipalityId } = await params;
    const threads = await prisma.forumThread.findMany({
      where: {
        municipalityId: municipalityId  // Only get threads for THIS town
      },
      include: {
        comments: true,
        tags: true
      },
      orderBy: {
        createdAt: 'desc'  // Newest first
      }
    });

    return NextResponse.json(threads);
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch threads' },
      { status: 500 }
    );
  }
}