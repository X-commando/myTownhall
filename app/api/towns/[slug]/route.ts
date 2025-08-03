import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { slug } = await params;
      
      if (!slug) {
        return NextResponse.json(
          { error: 'Slug parameter is required' },
          { status: 400 }
        );
      }

      console.log('Looking for town with slug:', slug);
      
      const town = await prisma.municipality.findUnique({
        where: {
          slug: slug
        },
        include: {
          Budget: {
            include: {
              BudgetCategory: {
                orderBy: {
                  amount: 'desc'
                }
              }
            },
            orderBy: {
              year: 'desc'
            }
          },
          Meeting: {
            include: {
              AgendaItem: {
                orderBy: {
                  order: 'asc'
                }
              }
            },
            orderBy: {
              date: 'desc'
            }
          },
          ForumThread: {
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
          }
        }
      });

      if (!town) {
        // Get all available slugs for debugging
        const allTowns = await prisma.municipality.findMany({
          select: { slug: true, name: true }
        });
        
        console.log('Town not found. Available slugs:', allTowns);
        
        return NextResponse.json(
          { 
            error: 'Town not found', 
            availableSlugs: allTowns,
            requestedSlug: slug
          },
          { status: 404 }
        );
      }

      console.log('Found town:', town.name);
      return NextResponse.json(town);
    } catch (error) {
      console.error(`Error fetching town (attempt ${attempt}):`, error);
      lastError = error;
      
      if (attempt < maxRetries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  return NextResponse.json(
    { error: 'Failed to fetch town after multiple attempts', details: lastError instanceof Error ? lastError.message : 'Unknown error' },
    { status: 500 }
  );
}

// UPDATE town
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const updatedTown = await prisma.municipality.update({
      where: { slug },
      data: body
    });

    return NextResponse.json(updatedTown);
  } catch (error) {
    console.error('Error updating town:', error);
    return NextResponse.json(
      { error: 'Failed to update town', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE town
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await prisma.municipality.delete({
      where: { slug }
    });

    return NextResponse.json({ message: 'Town deleted successfully' });
  } catch (error) {
    console.error('Error deleting town:', error);
    return NextResponse.json(
      { error: 'Failed to delete town', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}