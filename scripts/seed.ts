// SEED SCRIPT COMMENTED OUT - Database already initialized
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('🌱 Starting to plant data seeds...');

//   // Create Somerville, NJ
//   const somerville = await prisma.municipality.create({
//     data: {
//       name: 'Somerville',
//       state: 'NJ',
//       zipCode: '08876',
//       population: 12423,
//       isServiced: true,
//       latitude: 40.5751,
//       longitude: -74.6097,
//       slug: 'somerville-nj',
      
//       // Add budget data
//       budgets: {
//         create: {
//           year: 2024,
//           totalBudget: 25000000,
//           categories: {
//             create: [
//               { name: 'Public Safety', amount: 8500000, color: '#2C6E49' },
//               { name: 'Education', amount: 7200000, color: '#D94F30' },
//               { name: 'Infrastructure', amount: 4800000, color: '#3A4F68' },
//               { name: 'Parks & Recreation', amount: 2100000, color: '#8B5A3C' },
//               { name: 'Administration', amount: 1400000, color: '#6B7280' },
//               { name: 'Other', amount: 1000000, color: '#9CA3AF' }
//             ]
//           }
//         }
//       },
      
//       // Add a meeting
//       meetings: {
//         create: {
//           title: 'City Council Regular Meeting',
//           date: new Date('2024-02-15'),
//           time: '7:00 PM',
//           committee: 'City Council',
//           status: 'upcoming',
//           agendaItems: {
//             create: [
//               { content: 'Approval of previous meeting minutes', order: 1 },
//               { content: 'Budget review for Q1 2024', order: 2 },
//               { content: 'Park development proposal discussion', order: 3 },
//               { content: 'Public comments', order: 4 }
//             ]
//           }
//         }
//       },
      
//       // Add a forum thread
//       forumThreads: {
//         create: {
//           title: 'New Park Development on Main Street',
//           content: 'Has anyone heard about the proposed park development? I think it would greatly benefit our community.',
//           author: 'Sarah M.',
//           upvotes: 23,
//           downvotes: 2,
//           tags: {
//             create: [
//               { name: 'Budget' },
//               { name: 'Parks' }
//             ]
//           }
//         }
//       }
//     }
//   });

//   console.log('✅ Created Somerville, NJ');

//   // Create Princeton, NJ
//   const princeton = await prisma.municipality.create({
//     data: {
//       name: 'Princeton',
//       state: 'NJ',
//       zipCode: '08540',
//       population: 31161,
//       isServiced: true,
//       latitude: 40.3573,
//       longitude: -74.6672,
//       slug: 'princeton-nj',
      
//       budgets: {
//         create: {
//           year: 2024,
//           totalBudget: 45000000,
//           categories: {
//             create: [
//               { name: 'Public Safety', amount: 12000000, color: '#2C6E49' },
//               { name: 'Education', amount: 15000000, color: '#D94F30' },
//               { name: 'Infrastructure', amount: 8000000, color: '#3A4F68' },
//               { name: 'Parks & Recreation', amount: 5000000, color: '#8B5A3C' },
//               { name: 'Administration', amount: 3000000, color: '#6B7280' },
//               { name: 'Other', amount: 2000000, color: '#9CA3AF' }
//             ]
//           }
//         }
//       }
//     }
//   });

//   console.log('✅ Created Princeton, NJ');

//   // Create Madison, WI
//   const madison = await prisma.municipality.create({
//     data: {
//       name: 'Madison',
//       state: 'WI',
//       zipCode: '53703',
//       population: 259680,
//       isServiced: true,
//       latitude: 43.0731,
//       longitude: -89.4012,
//       slug: 'madison-wi',
      
//       budgets: {
//         create: {
//           year: 2024,
//           totalBudget: 180000000,
//           categories: {
//             create: [
//               { name: 'Public Safety', amount: 45000000, color: '#2C6E49' },
//               { name: 'Education', amount: 60000000, color: '#D94F30' },
//               { name: 'Infrastructure', amount: 35000000, color: '#3A4F68' },
//               { name: 'Parks & Recreation', amount: 20000000, color: '#8B5A3C' },
//               { name: 'Administration', amount: 12000000, color: '#6B7280' },
//               { name: 'Other', amount: 8000000, color: '#9CA3AF' }
//             ]
//           }
//         }
//       }
//     }
//   });

//   console.log('✅ Created Madison, WI');

//   // Create Burlington, VT
//   const burlington = await prisma.municipality.create({
//     data: {
//       name: 'Burlington',
//       state: 'VT',
//       zipCode: '05401',
//       population: 44743,
//       isServiced: true,
//       latitude: 44.4759,
//       longitude: -73.2121,
//       slug: 'burlington-vt',
      
//       budgets: {
//         create: {
//           year: 2024,
//           totalBudget: 75000000,
//           categories: {
//             create: [
//               { name: 'Public Safety', amount: 20000000, color: '#2C6E49' },
//               { name: 'Education', amount: 25000000, color: '#D94F30' },
//               { name: 'Infrastructure', amount: 15000000, color: '#3A4F68' },
//               { name: 'Parks & Recreation', amount: 8000000, color: '#8B5A3C' },
//               { name: 'Administration', amount: 5000000, color: '#6B7280' },
//               { name: 'Other', amount: 2000000, color: '#9CA3AF' }
//             ]
//           }
//         }
//       }
//     }
//   });

//   console.log('✅ Created Burlington, VT');

//   // Create coming soon municipalities
//   const austin = await prisma.municipality.create({
//     data: {
//       name: 'Austin',
//       state: 'TX',
//       zipCode: '73301',
//       population: 965872,
//       isServiced: false,
//       latitude: 30.2672,
//       longitude: -97.7431,
//       slug: 'austin-tx'
//     }
//   });

//   console.log('✅ Created Austin, TX (coming soon)');

//   const portland = await prisma.municipality.create({
//     data: {
//       name: 'Portland',
//       state: 'OR',
//       zipCode: '97201',
//       population: 652503,
//       isServiced: false,
//       latitude: 45.5152,
//       longitude: -122.6784,
//       slug: 'portland-or'
//     }
//   });

//   console.log('✅ Created Portland, OR (coming soon)');

//   const boulder = await prisma.municipality.create({
//     data: {
//       name: 'Boulder',
//       state: 'CO',
//       zipCode: '80301',
//       population: 107353,
//       isServiced: false,
//       latitude: 40.0150,
//       longitude: -105.2705,
//       slug: 'boulder-co'
//     }
//   });

//   console.log('✅ Created Boulder, CO (coming soon)');

//   const annArbor = await prisma.municipality.create({
//     data: {
//       name: 'Ann Arbor',
//       state: 'MI',
//       zipCode: '48103',
//       population: 123851,
//       isServiced: false,
//       latitude: 42.2808,
//       longitude: -83.7430,
//       slug: 'ann-arbor-mi'
//     }
//   });

//   console.log('✅ Created Ann Arbor, MI (coming soon)');

//   console.log('🎉 All done! Your database has data now!');
// }

// main()
//   .catch((e) => {
//     console.error('❌ Error seeding data:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });