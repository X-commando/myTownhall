import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const municipalities = await prisma.municipality.findMany();
    return NextResponse.json({
      count: municipalities.length,
      municipalities: municipalities.map(m => ({
        id: m.id,
        name: m.name,
        slug: m.slug
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}