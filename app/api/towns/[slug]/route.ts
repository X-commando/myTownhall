import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log('Looking for town with slug:', slug);
    
    const town = await prisma.municipality.findUnique({
      where: {
        slug: slug
      },
      include: {
        budgets: {
          include: {
            categories: true
          }
        },
        meetings: {
          include: {
            agendaItems: {
              orderBy: {
                order: 'asc'
              }
            }
          }
        },
        forumThreads: {
          include: {
            comments: true,
            tags: true
          }
        }
      }
    });

    if (!town) {
      console.log('Town not found. Available slugs:');
      const allTowns = await prisma.municipality.findMany({
        select: { slug: true, name: true }
      });
      console.log(allTowns);
      
      return NextResponse.json(
        { error: 'Town not found', availableSlugs: allTowns },
        { status: 404 }
      );
    }

    console.log('Found town:', town.name);
    return NextResponse.json(town);
  } catch (error) {
    console.error('Error fetching town:', error);
    return NextResponse.json(
      { error: 'Failed to fetch town' },
      { status: 500 }
    );
  }
}