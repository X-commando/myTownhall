import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET specific budget
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Budget ID is required' },
        { status: 400 }
      );
    }

    const budget = await prisma.budget.findUnique({
      where: { id },
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
      }
    });

    if (!budget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budget', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH update budget
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: body,
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
      }
    });

    return NextResponse.json(updatedBudget);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json(
      { error: 'Failed to update budget', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE budget
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.budget.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json(
      { error: 'Failed to delete budget', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 