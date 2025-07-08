import { create } from 'zustand';

export interface Municipality {
  id: string;
  name: string;
  state: string;
  zipCode: string;
  population: number;
  isServiced: boolean;
  coordinates: [number, number];
  slug: string;
}

interface StoreState {
  municipalities: Municipality[];
  selectedMunicipality: Municipality | null;
  searchQuery: string;
  setMunicipalities: (municipalities: Municipality[]) => void;
  setSelectedMunicipality: (municipality: Municipality | null) => void;
  setSearchQuery: (query: string) => void;
  getFilteredMunicipalities: () => Municipality[];
}

export const useStore = create<StoreState>((set, get) => ({
  municipalities: [],
  selectedMunicipality: null,
  searchQuery: '',
  
  setMunicipalities: (municipalities) => set({ municipalities }),
  setSelectedMunicipality: (municipality) => set({ selectedMunicipality: municipality }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  getFilteredMunicipalities: () => {
    const { municipalities, searchQuery } = get();
    if (!searchQuery) return municipalities;
    
    return municipalities.filter(municipality =>
      municipality.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      municipality.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      municipality.zipCode.includes(searchQuery)
    );
  },
}));