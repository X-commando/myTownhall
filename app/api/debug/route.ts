import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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