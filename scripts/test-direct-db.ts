import { PrismaClient } from '@prisma/client';

// Create a new Prisma client with direct connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
});

async function testDirectDatabase() {
  try {
    console.log('🔍 Testing direct database connection...');
    
    // Test basic connection
    const count = await prisma.municipality.count();
    console.log(`✅ Direct database connected! Found ${count} municipalities`);
    
    if (count === 0) {
      console.log('📝 Adding test municipality via direct connection...');
      
      const newMunicipality = await prisma.municipality.create({
        data: {
          id: crypto.randomUUID(),
          name: 'Direct Test Town',
          state: 'NY',
          zipCode: '10001',
          population: 15000,
          isServiced: true,
          latitude: 40.7128,
          longitude: -74.0060,
          slug: 'direct-test-town-ny',
          updatedAt: new Date(),
        }
      });
      
      console.log('✅ Added test municipality via direct connection:', newMunicipality.name);
    } else {
      console.log('✅ Database already has municipalities via direct connection');
    }
    
  } catch (error) {
    console.error('❌ Direct database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDirectDatabase(); 