import { getTowns } from '@/lib/api';
import TownClientPage from './TownClientPage';

export async function generateStaticParams() {
  // Get all towns from the database
  const towns = await getTowns();
  
  // Return the slugs for static generation
  return towns.map((town: any) => ({
    slug: town.slug,
  }));
}

interface TownPageProps {
  params: {
    slug: string;
  };
}

export default function TownPage({ params }: TownPageProps) {
  return <TownClientPage slug={params.slug} />;
}