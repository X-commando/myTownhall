import { Municipality } from './store';

export const mockMunicipalities: Municipality[] = [
  // Serviced municipalities
  {
    id: '1',
    name: 'Somerville',
    state: 'NJ',
    zipCode: '08876',
    population: 12423,
    isServiced: true,
    coordinates: [40.5751, -74.6097],
    slug: 'somerville-nj'
  },
  {
    id: '2',
    name: 'Princeton',
    state: 'NJ',
    zipCode: '08540',
    population: 31161,
    isServiced: true,
    coordinates: [40.3573, -74.6672],
    slug: 'princeton-nj'
  },
  {
    id: '3',
    name: 'Madison',
    state: 'WI',
    zipCode: '53703',
    population: 259680,
    isServiced: true,
    coordinates: [43.0731, -89.4012],
    slug: 'madison-wi'
  },
  {
    id: '4',
    name: 'Burlington',
    state: 'VT',
    zipCode: '05401',
    population: 44743,
    isServiced: true,
    coordinates: [44.4759, -73.2121],
    slug: 'burlington-vt'
  },
  // Coming soon municipalities
  {
    id: '5',
    name: 'Austin',
    state: 'TX',
    zipCode: '73301',
    population: 965872,
    isServiced: false,
    coordinates: [30.2672, -97.7431],
    slug: 'austin-tx'
  },
  {
    id: '6',
    name: 'Portland',
    state: 'OR',
    zipCode: '97201',
    population: 652503,
    isServiced: false,
    coordinates: [45.5152, -122.6784],
    slug: 'portland-or'
  },
  {
    id: '7',
    name: 'Boulder',
    state: 'CO',
    zipCode: '80301',
    population: 107353,
    isServiced: false,
    coordinates: [40.0150, -105.2705],
    slug: 'boulder-co'
  },
  {
    id: '8',
    name: 'Ann Arbor',
    state: 'MI',
    zipCode: '48103',
    population: 123851,
    isServiced: false,
    coordinates: [42.2808, -83.7430],
    slug: 'ann-arbor-mi'
  }
];

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  downvotes: number;
  comments: ForumComment[];
  tags: string[];
  municipalityId: string;
}

export interface ForumComment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  threadId: string;
}

export interface BudgetData {
  year: number;
  totalBudget: number;
  categories: {
    name: string;
    amount: number;
    color: string;
  }[];
  municipalityId: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  committee: string;
  agenda: string[];
  status: 'upcoming' | 'past';
  municipalityId: string;
}

export const mockForumThreads: ForumThread[] = [
  {
    id: '1',
    title: 'New Park Development on Main Street',
    content: 'Has anyone heard about the proposed park development? I think it would greatly benefit our community.',
    author: 'Sarah M.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    upvotes: 23,
    downvotes: 2,
    comments: [],
    tags: ['Budget', 'Parks'],
    municipalityId: '1'
  },
  {
    id: '2',
    title: 'Budget Question: Road Maintenance',
    content: 'The potholes on Elm Street have been getting worse. When will they be fixed?',
    author: 'Mike R.',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    upvotes: 45,
    downvotes: 1,
    comments: [],
    tags: ['Budget', 'Infrastructure'],
    municipalityId: '1'
  }
];

export const mockBudgetData: BudgetData[] = [
  {
    year: 2024,
    totalBudget: 25000000,
    categories: [
      { name: 'Public Safety', amount: 8500000, color: '#2C6E49' },
      { name: 'Education', amount: 7200000, color: '#D94F30' },
      { name: 'Infrastructure', amount: 4800000, color: '#3A4F68' },
      { name: 'Parks & Recreation', amount: 2100000, color: '#8B5A3C' },
      { name: 'Administration', amount: 1400000, color: '#6B7280' },
      { name: 'Other', amount: 1000000, color: '#9CA3AF' }
    ],
    municipalityId: '1'
  }
];

export const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'City Council Regular Meeting',
    date: new Date('2024-02-15'),
    time: '7:00 PM',
    committee: 'City Council',
    agenda: [
      'Approval of previous meeting minutes',
      'Budget review for Q1 2024',
      'Park development proposal discussion',
      'Public comments'
    ],
    status: 'upcoming',
    municipalityId: '1'
  },
  {
    id: '2',
    title: 'Public Safety Committee',
    date: new Date('2024-02-08'),
    time: '6:30 PM',
    committee: 'Public Safety',
    agenda: [
      'Police department budget review',
      'New traffic light installation',
      'Community safety initiatives'
    ],
    status: 'past',
    municipalityId: '1'
  }
];