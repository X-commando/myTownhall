import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all towns
export async function GET() {
  try {
    const towns = await prisma.municipality.findMany({
      include: {
        Budget: {
          include: {
            BudgetCategory: true
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
            Comment: true,
            ThreadTag: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10 // Limit to latest 10 threads per town
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(towns);
  } catch (error) {
    console.error('Error fetching towns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch towns', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST new town
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.state || !body.zipCode || !body.population || 
        body.coordinates === undefined || !body.slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingTown = await prisma.municipality.findUnique({
      where: { slug: body.slug }
    });

    if (existingTown) {
      return NextResponse.json(
        { error: 'A town with this slug already exists' },
        { status: 409 }
      );
    }

    const newTown = await prisma.municipality.create({
      data: {
        id: crypto.randomUUID(),
        name: body.name,
        state: body.state,
        zipCode: body.zipCode,
        population: parseInt(body.population),
        isServiced: body.isServiced || false,
        latitude: parseFloat(body.coordinates[0]),
        longitude: parseFloat(body.coordinates[1]),
        slug: body.slug,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(newTown, { status: 201 });
  } catch (error) {
    console.error('Error creating town:', error);
    return NextResponse.json(
      { error: 'Failed to create town', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}