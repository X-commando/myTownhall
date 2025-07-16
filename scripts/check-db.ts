import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAndSeedDatabase() {
  try {
    console.log('🔍 Checking database for municipalities...');
    
    const municipalities = await prisma.municipality.findMany();
    console.log(`Found ${municipalities.length} municipalities in database`);
    
    if (municipalities.length === 0) {
      console.log('📝 Database is empty, adding basic municipalities...');
      
      // Add Somerville, NJ
      const somerville = await prisma.municipality.create({
        data: {
          name: 'Somerville',
          state: 'NJ',
          zipCode: '08876',
          population: 12423,
          isServiced: true,
          latitude: 40.5751,
          longitude: -74.6097,
          slug: 'somerville-nj',
        }
      });
      console.log('✅ Created Somerville, NJ');

      // Add Princeton, NJ
      const princeton = await prisma.municipality.create({
        data: {
          name: 'Princeton',
          state: 'NJ',
          zipCode: '08540',
          population: 31161,
          isServiced: true,
          latitude: 40.3573,
          longitude: -74.6672,
          slug: 'princeton-nj',
        }
      });
      console.log('✅ Created Princeton, NJ');

      // Add Madison, WI
      const madison = await prisma.municipality.create({
        data: {
          name: 'Madison',
          state: 'WI',
          zipCode: '53703',
          population: 259680,
          isServiced: true,
          latitude: 43.0731,
          longitude: -89.4012,
          slug: 'madison-wi',
        }
      });
      console.log('✅ Created Madison, WI');

      // Add Burlington, VT
      const burlington = await prisma.municipality.create({
        data: {
          name: 'Burlington',
          state: 'VT',
          zipCode: '05401',
          population: 44743,
          isServiced: true,
          latitude: 44.4759,
          longitude: -73.2121,
          slug: 'burlington-vt',
        }
      });
      console.log('✅ Created Burlington, VT');

      console.log('🎉 Database seeded with basic municipalities!');
    } else {
      console.log('✅ Database already has municipalities');
    }
  } catch (error) {
    console.error('❌ Error checking/seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndSeedDatabase(); 