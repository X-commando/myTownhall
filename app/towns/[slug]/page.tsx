import { mockMunicipalities } from '@/lib/mockData';
import TownClientPage from './TownClientPage';

export async function generateStaticParams() {
  return mockMunicipalities.map((municipality) => ({
    slug: municipality.slug,
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