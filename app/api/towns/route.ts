import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This is the road for GETTING all towns
export async function GET() {
  try {
    // Go to the filing cabinet and get all municipalities
    const towns = await prisma.municipality.findMany({
      include: {
        // Also grab their budgets
        budgets: {
          include: {
            categories: true
          }
        },
        // And their meetings
        meetings: {
          include: {
            agendaItems: {
              orderBy: {
                order: 'asc'
              }
            }
          }
        },
        // And their forum threads
        forumThreads: {
          include: {
            comments: true,
            tags: true
          }
        }
      }
    });

    // Send the towns back to whoever asked
    return NextResponse.json(towns);
  } catch (error) {
    // If something goes wrong, say "oops!"
    console.error('Error fetching towns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch towns' },
      { status: 500 }
    );
  }
}

// This is the road for ADDING a new town
export async function POST(request: Request) {
  try {
    // Get the information about the new town
    const body = await request.json();
    
    // Save it to the filing cabinet
    const newTown = await prisma.municipality.create({
      data: {
        name: body.name,
        state: body.state,
        zipCode: body.zipCode,
        population: body.population,
        isServiced: body.isServiced || false,
        latitude: body.coordinates[0],
        longitude: body.coordinates[1],
        slug: body.slug
      }
    });

    // Tell them it worked!
    return NextResponse.json(newTown, { status: 201 });
  } catch (error) {
    // If something goes wrong, say "oops!"
    console.error('Error creating town:', error);
    return NextResponse.json(
      { error: 'Failed to create town' },
      { status: 500 }
    );
  }
}