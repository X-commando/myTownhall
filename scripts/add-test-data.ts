import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addTestData() {
  try {
    console.log('Adding test municipality...');
    
    const testMunicipality = await prisma.municipality.create({
      data: {
        id: crypto.randomUUID(),
        name: 'Somerville',
        state: 'NJ',
        zipCode: '08876',
        population: 12423,
        isServiced: true,
        latitude: 40.5751,
        longitude: -74.6097,
        slug: 'somerville-nj',
        updatedAt: new Date(),
      }
    });
    
    console.log('✅ Added test municipality:', testMunicipality);
  } catch (error) {
    console.error('❌ Error adding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestData(); 