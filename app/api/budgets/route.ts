import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all budgets (with optional filtering)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const municipalityId = searchParams.get('municipalityId');
    const year = searchParams.get('year');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    
    if (municipalityId) {
      where.municipalityId = municipalityId;
    }
    
    if (year) {
      where.year = parseInt(year);
    }

    const budgets = await prisma.budget.findMany({
      where,
      include: {
        BudgetCategory: {
          orderBy: {
            amount: 'desc'
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
        year: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const total = await prisma.budget.count({ where });

    return NextResponse.json({
      budgets,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST new budget
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.year || !body.totalBudget || !body.municipalityId) {
      return NextResponse.json(
        { error: 'Missing required fields: year, totalBudget, and municipalityId are required' },
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

    const budget = await prisma.budget.create({
      data: {
        id: crypto.randomUUID(),
        year: parseInt(body.year),
        totalBudget: parseFloat(body.totalBudget),
        municipalityId: body.municipalityId
      },
      include: {
        BudgetCategory: true,
        Municipality: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { error: 'Failed to create budget', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 