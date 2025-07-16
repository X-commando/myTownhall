import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test the data flow
    const towns = await prisma.municipality.findMany({
      include: {
        Budget: {
          include: {
            BudgetCategory: true
          }
        },
        Meeting: {
          include: {
            AgendaItem: true
          }
        },
        ForumThread: {
          include: {
            Comment: true,
            ThreadTag: true
          }
        }
      },
      take: 3
    });

    const testResults = towns.map((town: any) => ({
      name: town.name,
      state: town.state,
      slug: town.slug,
      hasBudget: town.Budget.length > 0,
      hasMeetings: town.Meeting.length > 0,
      hasThreads: town.ForumThread.length > 0,
      budgetCategories: town.Budget[0]?.BudgetCategory?.length || 0,
      meetingAgendaItems: town.Meeting[0]?.AgendaItem?.length || 0,
      threadTags: town.ForumThread[0]?.ThreadTag?.length || 0
    }));

    return NextResponse.json({
      success: true,
      message: 'Data flow test completed',
      results: testResults,
      totalTowns: towns.length
    });
  } catch (error) {
    console.error('Test data error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test data flow',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 