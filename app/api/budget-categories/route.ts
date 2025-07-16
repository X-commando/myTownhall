import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all budget categories (with optional filtering)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const budgetId = searchParams.get('budgetId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    
    if (budgetId) {
      where.budgetId = budgetId;
    }

    const categories = await prisma.budgetCategory.findMany({
      where,
      include: {
        Budget: {
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
        amount: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const total = await prisma.budgetCategory.count({ where });

    return NextResponse.json({
      categories,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching budget categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budget categories', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST new budget category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.amount || !body.color || !body.budgetId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, amount, color, and budgetId are required' },
        { status: 400 }
      );
    }

    // Verify budget exists
    const budget = await prisma.budget.findUnique({
      where: { id: body.budgetId }
    });

    if (!budget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    const category = await prisma.budgetCategory.create({
      data: {
        id: crypto.randomUUID(),
        name: body.name.trim(),
        amount: parseFloat(body.amount),
        color: body.color.trim(),
        budgetId: body.budgetId
      },
      include: {
        Budget: {
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

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating budget category:', error);
    return NextResponse.json(
      { error: 'Failed to create budget category', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 