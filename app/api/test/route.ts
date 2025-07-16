import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const response: any = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      DIRECT_URL_EXISTS: !!process.env.DIRECT_URL,
    },
    tests: {
      basic: null,
      prisma: null,
      count: null,
    },
    error: null
  };

  try {
    // Test 1: Basic connection
    try {
      const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
      response.tests.basic = { success: true, result };
    } catch (err) {
      response.tests.basic = { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }

    // Test 2: Prisma connection
    try {
      await prisma.$connect();
      response.tests.prisma = { success: true, message: 'Connected to database' };
    } catch (err) {
      response.tests.prisma = { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }

    // Test 3: Count municipalities
    try {
      const count = await prisma.municipality.count();
      response.tests.count = { success: true, count };
    } catch (err) {
      response.tests.count = { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }

  } catch (error) {
    response.error = error instanceof Error ? {
      message: error.message,
      stack: error.stack
    } : 'Unknown error';
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      console.error('Error disconnecting:', e);
    }
  }

  return NextResponse.json(response);
}