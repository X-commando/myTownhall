'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, ArrowRight, Loader2, Building2, Star, Filter } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getTowns } from '@/lib/api';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-900 animate-pulse" />
});

type FilterType = 'all' | 'available' | 'coming-soon';

export default function Explore() {
  const { 
    municipalities, 
    selectedMunicipality, 
    searchQuery,
    setMunicipalities,
    setSelectedMunicipality,
    setSearchQuery,
    getFilteredMunicipalities
  } = useStore();

  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    // Load real towns from database
    const loadTowns = async () => {
      try {
        setIsLoading(true);
        setDataError(null);
        console.log('Fetching towns from API...');
        
        const towns = await getTowns();
        console.log('Received towns:', towns);
        
        if (!towns || towns.length === 0) {
          console.warn('No towns received from API');
          setDataError('No municipalities found in database');
          return;
        }
        
        // Transform the data to match our format
        const formattedTowns = towns.map((town: any) => ({
          id: town.id,
          name: town.name,
          state: town.state,
          zipCode: town.zipCode,
          population: town.population,
          isServiced: town.isServiced,
          coordinates: [town.latitude, town.longitude],
          slug: town.slug
        }));
        
        console.log('Formatted towns:', formattedTowns);
        setMunicipalities(formattedTowns);
      } catch (error) {
        console.error('Error loading towns:', error);
        setDataError('Failed to load municipalities. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTowns();
  }, [setMunicipalities]);

  const filteredMunicipalities = getFilteredMunicipalities();

  // Apply additional filter based on activeFilter
  const getFilteredAndSearchedMunicipalities = () => {
    let filtered = filteredMunicipalities;
    
    if (activeFilter === 'available') {
      filtered = filtered.filter(m => m.isServiced);
    } else if (activeFilter === 'coming-soon') {
      filtered = filtered.filter(m => !m.isServiced);
    }
    
    return filtered;
  };

  const displayMunicipalities = getFilteredAndSearchedMunicipalities();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowError(false);
    
    if (query) {
      // First apply the active filter, then search within that filtered set
      let searchableMunicipalities = municipalities;
      
      if (activeFilter === 'available') {
        searchableMunicipalities = municipalities.filter(m => m.isServiced);
      } else if (activeFilter === 'coming-soon') {
        searchableMunicipalities = municipalities.filter(m => !m.isServiced);
      }
      
      const filtered = searchableMunicipalities.filter(m =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.state.toLowerCase().includes(query.toLowerCase()) ||
        m.zipCode.includes(query)
      );
      
      if (filtered.length > 0) {
        setSelectedMunicipality(filtered[0]);
      } else {
        setSelectedMunicipality(null);
      }
    } else {
      setSelectedMunicipality(null);
    }
  };

  const handleMunicipalitySelect = (municipality: any) => {
    setSelectedMunicipality(municipality);
    setSearchQuery(`${municipality.name}, ${municipality.state}`);
    setShowError(false);
  };

  const handleLaunch = () => {
    if (!selectedMunicipality) return;
    
    if (!selectedMunicipality.isServiced) {
      setShowError(true);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      window.location.href = `/towns/${selectedMunicipality.slug}`;
    }, 500);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    // Clear selection when changing filters
    setSelectedMunicipality(null);
    setSearchQuery('');
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading municipalities...</p>
        </div>
      </div>
    );
  }

  // Show error state if data failed to load
  if (dataError) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">Error Loading Data</h2>
          <p className="text-slate-400 mb-6">{dataError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex flex-col bg-slate-900">
        {/* Fixed Header Bar */}
        <div className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex-shrink-0 z-40" />
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-2/5 lg:w-1/3 bg-slate-800 border-r border-slate-700 flex flex-col">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500 rounded-full" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500 rounded-full" />
            </div>
            
            {/* Search Section */}
            <div className="relative z-10 p-6 lg:p-8 space-y-4">
              {/* Title */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-light text-white">Find Your</h1>
                  <p className="text-3xl font-medium text-emerald-400">Community</p>
                </div>
              </div>
              
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search city, state, or ZIP..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                    activeFilter === 'all'
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  All ({municipalities.length})
                </button>
                <button
                  onClick={() => handleFilterChange('available')}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                    activeFilter === 'available'
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  Available ({municipalities.filter(m => m.isServiced).length})
                </button>
                <button
                  onClick={() => handleFilterChange('coming-soon')}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                    activeFilter === 'coming-soon'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  Coming Soon ({municipalities.filter(m => !m.isServiced).length})
                </button>
              </div>

              {/* Launch Button */}
              <button
                onClick={handleLaunch}
                disabled={!selectedMunicipality || isLoading}
                className={`w-full py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedMunicipality?.isServiced
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/25'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Launch MyTownhall</span>
                    {selectedMunicipality?.isServiced && <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>

              {/* Error Message */}
              {showError && (
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <p className="text-orange-400 text-sm font-medium">
                    Coming soon to {selectedMunicipality?.name}
                  </p>
                  <p className="text-orange-400/70 text-xs mt-1">
                    We're working to bring transparency to your community
                  </p>
                </div>
              )}
            </div>

            {/* Municipality List */}
            <div className="flex-1 flex flex-col min-h-0 px-4 pb-4">
              <h3 className="text-slate-400 text-sm font-medium mb-3 px-4">
                {activeFilter === 'all' ? 'Available Communities' : activeFilter === 'available' ? 'Available Communities' : 'Coming Soon'} ({displayMunicipalities.length})
              </h3>
              <div className="flex-1 overflow-y-auto scrollbar-custom">
                <div className="space-y-2 pr-2">
                  {/* Show selected municipality prominently if no search results */}
                  {displayMunicipalities.length === 0 && selectedMunicipality && (
                    <div className="mb-4">
                      <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-xl p-4 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                            <Star className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="text-emerald-400 font-semibold text-lg">
                              {selectedMunicipality.name}
                            </h3>
                            <p className="text-emerald-400/70 text-sm">
                              {selectedMunicipality.state} • {selectedMunicipality.population.toLocaleString()} residents
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${
                              selectedMunicipality.isServiced ? 'bg-emerald-400' : 'bg-orange-400'
                            }`} />
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                              selectedMunicipality.isServiced
                                ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50' 
                                : 'bg-orange-500/30 text-orange-400 border border-orange-500/50'
                            }`}>
                              {selectedMunicipality.isServiced ? 'Available' : 'Soon'}
                            </span>
                          </div>
                          <button
                            onClick={() => handleMunicipalitySelect(selectedMunicipality)}
                            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Show filtered results or all municipalities */}
                  {(displayMunicipalities.length > 0 || !selectedMunicipality) ? (
                    displayMunicipalities.map((municipality) => (
                      <button
                        key={municipality.id}
                        onClick={() => handleMunicipalitySelect(municipality)}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                          selectedMunicipality?.id === municipality.id 
                            ? 'bg-emerald-500/20 border border-emerald-500/30 shadow-lg' 
                            : 'hover:bg-slate-700/50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`font-medium ${
                              selectedMunicipality?.id === municipality.id
                                ? 'text-emerald-400'
                                : 'text-white'
                            }`}>
                              {municipality.name}
                            </h3>
                            <p className={`text-sm mt-1 ${
                              selectedMunicipality?.id === municipality.id
                                ? 'text-emerald-400/70'
                                : 'text-slate-400'
                            }`}>
                              {municipality.state} • {municipality.population.toLocaleString()} residents
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${
                              municipality.isServiced ? 'bg-emerald-400' : 'bg-orange-400'
                            }`} />
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                              municipality.isServiced
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            }`}>
                              {municipality.isServiced ? 'Available' : 'Soon'}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-400">No municipalities found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="flex-1 relative">
            <MapComponent
              municipalities={municipalities}
              selectedMunicipality={selectedMunicipality}
              onMunicipalityClick={handleMunicipalitySelect}
            />
            
            {/* Municipality Info Card */}
            {selectedMunicipality && (
              <div className="absolute top-6 right-6 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 max-w-sm animate-slideIn">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white text-lg">
                      {selectedMunicipality.name}
                    </h3>
                    <p className="text-emerald-400 font-medium">{selectedMunicipality.state}</p>
                  </div>
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-sm text-slate-400">Population</span>
                    <span className="text-sm font-semibold text-white">
                      {selectedMunicipality.population.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-sm text-slate-400">ZIP Code</span>
                    <span className="text-sm font-semibold text-white">
                      {selectedMunicipality.zipCode}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-700">
                    <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                      selectedMunicipality.isServiced 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                        : 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    }`}>
                      <div className="w-2 h-2 rounded-full bg-white" />
                      <span>{selectedMunicipality.isServiced ? 'MyTownhall Available' : 'Coming Soon'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Map Legend */}
            <div className="absolute bottom-6 left-6 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Legend</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-sm" />
                  <span className="text-xs text-slate-400">Available Communities</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full shadow-sm" />
                  <span className="text-xs text-slate-400">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: #475569 #1e293b;
        }

        .scrollbar-custom::-webkit-scrollbar {
          width: 10px;
        }

        .scrollbar-custom::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 5px;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 5px;
          min-height: 40px;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}