import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const count = await prisma.municipality.count();
    console.log(`✅ Database connected! Found ${count} municipalities`);
    
    if (count === 0) {
      console.log('📝 Adding test municipality...');
      
      const newMunicipality = await prisma.municipality.create({
        data: {
          id: crypto.randomUUID(),
          name: 'Test Town',
          state: 'CA',
          zipCode: '90210',
          population: 10000,
          isServiced: true,
          latitude: 34.0522,
          longitude: -118.2437,
          slug: 'test-town-ca',
          updatedAt: new Date(),
        }
      });
      
      console.log('✅ Added test municipality:', newMunicipality.name);
    } else {
      console.log('✅ Database already has municipalities');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 