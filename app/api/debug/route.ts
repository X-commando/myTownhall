import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get database statistics
    const [
      municipalityCount,
      threadCount,
      commentCount,
      meetingCount,
      budgetCount
    ] = await Promise.all([
      prisma.municipality.count(),
      prisma.forumThread.count(),
      prisma.comment.count(),
      prisma.meeting.count(),
      prisma.budget.count()
    ]);

    // Get all municipalities with basic info
    const municipalities = await prisma.municipality.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        state: true,
        isServiced: true,
        population: true,
        _count: {
          select: {
            ForumThread: true,
            Meeting: true,
            Budget: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({
      status: 'ok',
      database: {
        municipalities: municipalityCount,
        forumThreads: threadCount,
        comments: commentCount,
        meetings: meetingCount,
        budgets: budgetCount
      },
      municipalities: municipalities.map(m => ({
        id: m.id,
        name: m.name,
        slug: m.slug,
        state: m.state,
        isServiced: m.isServiced,
        population: m.population,
        stats: {
          threads: m._count.ForumThread,
          meetings: m._count.Meeting,
          budgets: m._count.Budget
        }
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ 
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : 'Unknown'
    }, { status: 500 });
  }
}