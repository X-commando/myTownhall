'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';
import { mockMunicipalities } from '@/lib/mockData';
import MapComponent from '@/components/MapComponent';

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMunicipalities(mockMunicipalities);
  }, [setMunicipalities]);

  const filteredMunicipalities = getFilteredMunicipalities();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowError(false);
    
    if (query) {
      const filtered = municipalities.filter(m =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.state.toLowerCase().includes(query.toLowerCase()) ||
        m.zipCode.includes(query)
      );
      if (filtered.length > 0) {
        setSelectedMunicipality(filtered[0]);
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

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top bar */}
      <div className="h-16 bg-slate-900 fixed top-0 left-0 right-0 z-10 border-b border-slate-800"></div>
      
      <div className="flex h-screen pt-16">
        {/* Left Panel */}
        <div className="w-full md:w-2/5 lg:w-1/3 bg-slate-800 shadow-2xl flex flex-col relative overflow-hidden border-r border-slate-700">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full transform -translate-x-48 translate-y-48"></div>
          </div>
          
          <div className="relative z-10 p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-light text-white">
                Find Your
                <span className="block text-3xl font-medium text-emerald-400">Community</span>
              </h1>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search city, state, or ZIP..."
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-white placeholder-slate-400"
              />
            </div>

            {/* Launch Button */}
            <button
              onClick={handleLaunch}
              disabled={!selectedMunicipality || isLoading}
              className={`w-full mt-4 py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                selectedMunicipality?.isServiced
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 transform hover:scale-[1.02] shadow-lg hover:shadow-emerald-500/25'
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
              <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl animate-fadeIn">
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
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto custom-scrollbar">
              <div className="p-4 space-y-2">
                <h3 className="text-slate-400 text-sm font-medium px-4 pb-2">Available Communities</h3>
                {filteredMunicipalities.map((municipality) => (
                  <button
                    key={municipality.id}
                    onClick={() => handleMunicipalitySelect(municipality)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                      selectedMunicipality?.id === municipality.id 
                        ? 'bg-emerald-500/20 border border-emerald-500/30' 
                        : 'hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className={`font-medium transition-colors ${
                          selectedMunicipality?.id === municipality.id
                            ? 'text-emerald-400'
                            : 'text-white group-hover:text-white'
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
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Panel */}
        <div className="flex-1 relative bg-slate-900">
          <MapComponent
            municipalities={municipalities}
            selectedMunicipality={selectedMunicipality}
            onMunicipalityClick={handleMunicipalitySelect}
          />
          
          {/* Map overlay info */}
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
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium w-full justify-center ${
                    selectedMunicipality.isServiced 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                      : 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  }`}>
                    <div className={`w-2 h-2 rounded-full bg-white`} />
                    <span>{selectedMunicipality.isServiced ? 'MyTownhall Available' : 'Coming Soon'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Map legend */}
          <div className="absolute bottom-6 left-6 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-3">Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-sm"></div>
                <span className="text-xs text-slate-400">Available Communities</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full shadow-sm"></div>
                <span className="text-xs text-slate-400">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #475569 #1e293b;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #475569;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #64748b;
        }
      `}</style>
    </div>
  );
}