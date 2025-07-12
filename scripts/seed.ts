import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting to plant data seeds...');

  // Create Somerville, NJ
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
      
      // Add budget data
      budgets: {
        create: {
          year: 2024,
          totalBudget: 25000000,
          categories: {
            create: [
              { name: 'Public Safety', amount: 8500000, color: '#2C6E49' },
              { name: 'Education', amount: 7200000, color: '#D94F30' },
              { name: 'Infrastructure', amount: 4800000, color: '#3A4F68' },
              { name: 'Parks & Recreation', amount: 2100000, color: '#8B5A3C' },
              { name: 'Administration', amount: 1400000, color: '#6B7280' },
              { name: 'Other', amount: 1000000, color: '#9CA3AF' }
            ]
          }
        }
      },
      
      // Add a meeting
      meetings: {
        create: {
          title: 'City Council Regular Meeting',
          date: new Date('2024-02-15'),
          time: '7:00 PM',
          committee: 'City Council',
          status: 'upcoming',
          agendaItems: {
            create: [
              { content: 'Approval of previous meeting minutes', order: 1 },
              { content: 'Budget review for Q1 2024', order: 2 },
              { content: 'Park development proposal discussion', order: 3 },
              { content: 'Public comments', order: 4 }
            ]
          }
        }
      },
      
      // Add a forum thread
      forumThreads: {
        create: {
          title: 'New Park Development on Main Street',
          content: 'Has anyone heard about the proposed park development? I think it would greatly benefit our community.',
          author: 'Sarah M.',
          upvotes: 23,
          downvotes: 2,
          tags: {
            create: [
              { name: 'Budget' },
              { name: 'Parks' }
            ]
          }
        }
      }
    }
  });

  console.log('✅ Created Somerville, NJ');

  // Create Princeton, NJ
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
      
      budgets: {
        create: {
          year: 2024,
          totalBudget: 45000000,
          categories: {
            create: [
              { name: 'Public Safety', amount: 12000000, color: '#2C6E49' },
              { name: 'Education', amount: 15000000, color: '#D94F30' },
              { name: 'Infrastructure', amount: 8000000, color: '#3A4F68' },
              { name: 'Parks & Recreation', amount: 5000000, color: '#8B5A3C' },
              { name: 'Administration', amount: 3000000, color: '#6B7280' },
              { name: 'Other', amount: 2000000, color: '#9CA3AF' }
            ]
          }
        }
      }
    }
  });

  console.log('✅ Created Princeton, NJ');

  // Create Madison, WI (but not serviced yet)
  const madison = await prisma.municipality.create({
    data: {
      name: 'Madison',
      state: 'WI',
      zipCode: '53703',
      population: 259680,
      isServiced: false,  // Coming soon!
      latitude: 43.0731,
      longitude: -89.4012,
      slug: 'madison-wi'
    }
  });

  console.log('✅ Created Madison, WI (coming soon)');

  console.log('🎉 All done! Your database has data now!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });