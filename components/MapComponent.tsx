// 'use client';

// import { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { Municipality } from '@/lib/store';

// interface MapComponentProps {
//   municipalities: Municipality[];
//   selectedMunicipality: Municipality | null;
//   onMunicipalityClick: (municipality: Municipality) => void;
// }

// export default function MapComponent({ 
//   municipalities, 
//   selectedMunicipality, 
//   onMunicipalityClick 
// }: MapComponentProps) {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const mapInstanceRef = useRef<L.Map | null>(null);
//   const markersLayerRef = useRef<L.LayerGroup | null>(null);

//   useEffect(() => {
//     if (!mapRef.current) return;

//     // Initialize map with cleaner style
//     if (!mapInstanceRef.current) {
//       mapInstanceRef.current = L.map(mapRef.current, {
//         zoomControl: false,
//         attributionControl: false
//       }).setView([39.8283, -98.5795], 4);

//       // Add custom zoom control
//       L.control.zoom({
//         position: 'topleft'
//       }).addTo(mapInstanceRef.current);

//       // Dark theme base layer with better ocean/land contrast
//       L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
//         attribution: '© OpenStreetMap contributors © CARTO',
//         subdomains: 'abcd',
//         maxZoom: 18
//       }).addTo(mapInstanceRef.current);

//       // Add minimal attribution
//       L.control.attribution({
//         position: 'bottomright',
//         prefix: false
//       }).addTo(mapInstanceRef.current);

//       markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
//     }

//     // Clear existing markers
//     if (markersLayerRef.current) {
//       markersLayerRef.current.clearLayers();
//     }

//     // Add municipality markers
//     municipalities.forEach((municipality) => {
//       if (!markersLayerRef.current) return;

//       const isSelected = selectedMunicipality?.id === municipality.id;
//       const markerColor = municipality.isServiced ? '#10b981' : '#f97316';
//       const glowColor = municipality.isServiced ? 'rgba(16, 185, 129, 0.6)' : 'rgba(249, 115, 22, 0.6)';
      
//       const customIcon = L.divIcon({
//         html: `
//           <div class="marker-container" style="
//             position: relative;
//             width: ${isSelected ? '36px' : '26px'};
//             height: ${isSelected ? '36px' : '26px'};
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             transition: all 0.3s ease;
//           ">
//             <div style="
//               background: ${markerColor};
//               width: 100%;
//               height: 100%;
//               border-radius: 50%;
//               border: 3px solid rgba(255, 255, 255, 0.9);
//               box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 20px ${glowColor};
//               position: relative;
//               transition: all 0.3s ease;
//             "></div>
//             ${isSelected ? `
//               <div style="
//                 position: absolute;
//                 width: 48px;
//                 height: 48px;
//                 border: 2px solid ${markerColor};
//                 border-radius: 50%;
//                 animation: pulse 2s infinite;
//                 opacity: 0.6;
//               "></div>
//             ` : ''}
//           </div>
//         `,
//         className: 'custom-div-icon',
//         iconSize: [isSelected ? 36 : 26, isSelected ? 36 : 26],
//         iconAnchor: [isSelected ? 18 : 13, isSelected ? 18 : 13],
//         popupAnchor: [0, isSelected ? -18 : -13]
//       });

//       const marker = L.marker([municipality.coordinates[0], municipality.coordinates[1]], {
//         icon: customIcon,
//         riseOnHover: true
//       });

//       // Dark themed popup
//       marker.bindPopup(`
//         <div style="
//           padding: 20px;
//           min-width: 220px;
//           font-family: 'Inter', sans-serif;
//           background: #1e293b;
//           color: white;
//           border-radius: 12px;
//         ">
//           <h3 style="
//             font-weight: 600;
//             font-size: 18px;
//             margin-bottom: 12px;
//             color: #f1f5f9;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//           ">
//             ${municipality.name}
//             <span style="color: #10b981; font-size: 14px; font-weight: 500;">${municipality.state}</span>
//           </h3>
//           <div style="
//             display: flex;
//             flex-direction: column;
//             gap: 8px;
//             font-size: 14px;
//             padding: 12px;
//             background: #0f172a;
//             border-radius: 8px;
//             margin-bottom: 12px;
//           ">
//             <div style="display: flex; justify-content: space-between;">
//               <span style="color: #94a3b8;">ZIP Code:</span>
//               <span style="font-weight: 600; color: #e2e8f0;">${municipality.zipCode}</span>
//             </div>
//             <div style="display: flex; justify-content: space-between;">
//               <span style="color: #94a3b8;">Population:</span>
//               <span style="font-weight: 600; color: #e2e8f0;">${municipality.population.toLocaleString()}</span>
//             </div>
//           </div>
//           <div style="
//             display: inline-flex;
//             align-items: center;
//             gap: 8px;
//             padding: 8px 16px;
//             border-radius: 999px;
//             font-size: 13px;
//             font-weight: 600;
//             width: 100%;
//             justify-content: center;
//             background: ${municipality.isServiced ? '#10b981' : '#f97316'};
//             color: white;
//             box-shadow: 0 4px 12px ${municipality.isServiced 
//               ? 'rgba(16, 185, 129, 0.3)' 
//               : 'rgba(249, 115, 22, 0.3)'};
//           ">
//             <div style="
//               width: 8px;
//               height: 8px;
//               border-radius: 50%;
//               background-color: white;
//             "></div>
//             ${municipality.isServiced ? 'Available Now' : 'Coming Soon'}
//           </div>
//         </div>
//       `, {
//         closeButton: false,
//         className: 'custom-popup-dark'
//       });

//       marker.on('click', () => {
//         onMunicipalityClick(municipality);
//       });

//       markersLayerRef.current.addLayer(marker);
//     });

//     // Smooth zoom to selected municipality
//     if (selectedMunicipality && mapInstanceRef.current) {
//       mapInstanceRef.current.flyTo(
//         [selectedMunicipality.coordinates[0], selectedMunicipality.coordinates[1]], 
//         10,
//         {
//           duration: 1.5,
//           easeLinearity: 0.5
//         }
//       );
//     } else if (mapInstanceRef.current && !selectedMunicipality) {
//       mapInstanceRef.current.flyTo(
//         [39.8283, -98.5795], 
//         4,
//         {
//           duration: 1.0,
//           easeLinearity: 0.5
//         }
//       );
//     }

//   }, [municipalities, selectedMunicipality, onMunicipalityClick]);

//   useEffect(() => {
//     return () => {
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }
//     };
//   }, []);

//   return (
//     <>
//       <style jsx global>{`
//         .custom-popup-dark .leaflet-popup-content-wrapper {
//           background: #1e293b;
//           border-radius: 12px;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
//           border: 1px solid #334155;
//         }
        
//         .custom-popup-dark .leaflet-popup-tip {
//           background: #1e293b;
//           border-bottom: 1px solid #334155;
//           border-right: 1px solid #334155;
//         }
        
//         .custom-popup-dark .leaflet-popup-content {
//           margin: 0;
//           padding: 0;
//         }
        
//         @keyframes pulse {
//           0% {
//             transform: scale(1);
//             opacity: 0.6;
//           }
//           50% {
//             transform: scale(1.3);
//             opacity: 0.3;
//           }
//           100% {
//             transform: scale(1);
//             opacity: 0.6;
//           }
//         }
        
//         .leaflet-control-zoom {
//           border: 1px solid #334155 !important;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
//           border-radius: 8px !important;
//           overflow: hidden !important;
//           background: #1e293b !important;
//         }
        
//         .leaflet-control-zoom a {
//           background-color: #1e293b !important;
//           color: #10b981 !important;
//           border: none !important;
//           border-bottom: 1px solid #334155 !important;
//           width: 36px !important;
//           height: 36px !important;
//           line-height: 36px !important;
//           font-size: 18px !important;
//           font-weight: 500 !important;
//           transition: all 0.2s ease !important;
//         }
        
//         .leaflet-control-zoom a:hover {
//           background-color: #334155 !important;
//           color: #34d399 !important;
//         }
        
//         .leaflet-control-zoom a:last-child {
//           border-bottom: none !important;
//         }
        
//         .marker-container:hover > div:first-child {
//           transform: scale(1.15);
//           box-shadow: 0 4px 20px rgba(0,0,0,0.6), 0 0 30px var(--glow-color);
//         }
        
//         /* Dark theme for attribution */
//         .leaflet-control-attribution {
//           background: rgba(15, 23, 42, 0.8) !important;
//           color: #64748b !important;
//           padding: 4px 8px !important;
//           font-size: 11px !important;
//           border-radius: 6px !important;
//           border: 1px solid #334155 !important;
//           margin: 10px !important;
//         }
        
//         .leaflet-control-attribution a {
//           color: #10b981 !important;
//         }
        
//         /* Better ocean/land contrast */
//         .leaflet-container {
//           background: #0f172a;
//         }
        
//         /* Enhance state/county borders */
//         .leaflet-tile-pane {
//           filter: brightness(1.1) contrast(1.2);
//         }
//       `}</style>
//       <div ref={mapRef} className="w-full h-full" />
//     </>
//   );
// }
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Municipality } from '@/lib/store';

interface MapComponentProps {
  municipalities: Municipality[];
  selectedMunicipality: Municipality | null;
  onMunicipalityClick: (municipality: Municipality) => void;
}

export default function MapComponent({ 
  municipalities, 
  selectedMunicipality, 
  onMunicipalityClick 
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([39.8283, -98.5795], 4);

      L.control.zoom({
        position: 'topleft'
      }).addTo(mapInstanceRef.current);

      // Base map with dark oceans
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 18
      }).addTo(mapInstanceRef.current);

      L.control.attribution({
        position: 'bottomright',
        prefix: false
      }).addTo(mapInstanceRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }

    municipalities.forEach((municipality) => {
      if (!markersLayerRef.current) return;

      const isSelected = selectedMunicipality?.id === municipality.id;
      const markerColor = municipality.isServiced ? '#10b981' : '#f97316';
      const glowColor = municipality.isServiced ? 'rgba(16, 185, 129, 0.6)' : 'rgba(249, 115, 22, 0.6)';
      
      const customIcon = L.divIcon({
        html: `
          <div class="marker-container" style="
            position: relative;
            width: ${isSelected ? '36px' : '26px'};
            height: ${isSelected ? '36px' : '26px'};
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          ">
            <div style="
              background: ${markerColor};
              width: 100%;
              height: 100%;
              border-radius: 50%;
              border: 3px solid rgba(255, 255, 255, 0.9);
              box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 20px ${glowColor};
              position: relative;
              transition: all 0.3s ease;
            "></div>
            ${isSelected ? `
              <div style="
                position: absolute;
                width: 48px;
                height: 48px;
                border: 2px solid ${markerColor};
                border-radius: 50%;
                animation: pulse 2s infinite;
                opacity: 0.6;
              "></div>
            ` : ''}
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [isSelected ? 36 : 26, isSelected ? 36 : 26],
        iconAnchor: [isSelected ? 18 : 13, isSelected ? 18 : 13],
        popupAnchor: [0, isSelected ? -18 : -13]
      });

      const marker = L.marker([municipality.coordinates[0], municipality.coordinates[1]], {
        icon: customIcon,
        riseOnHover: true
      });

      marker.bindPopup(`
        <div style="
          padding: 20px;
          min-width: 220px;
          font-family: 'Inter', sans-serif;
          background: #1e293b;
          color: white;
          border-radius: 12px;
        ">
          <h3 style="
            font-weight: 600;
            font-size: 18px;
            margin-bottom: 12px;
            color: #f1f5f9;
            display: flex;
            align-items: center;
            gap: 8px;
          ">
            ${municipality.name}
            <span style="color: #10b981; font-size: 14px; font-weight: 500;">${municipality.state}</span>
          </h3>
          <div style="
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-size: 14px;
            padding: 12px;
            background: #0f172a;
            border-radius: 8px;
            margin-bottom: 12px;
          ">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">ZIP Code:</span>
              <span style="font-weight: 600; color: #e2e8f0;">${municipality.zipCode}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Population:</span>
              <span style="font-weight: 600; color: #e2e8f0;">${municipality.population.toLocaleString()}</span>
            </div>
          </div>
          <div style="
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 600;
            width: 100%;
            justify-content: center;
            background: ${municipality.isServiced ? '#10b981' : '#f97316'};
            color: white;
            box-shadow: 0 4px 12px ${municipality.isServiced 
              ? 'rgba(16, 185, 129, 0.3)' 
              : 'rgba(249, 115, 22, 0.3)'};
          ">
            <div style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: white;
            "></div>
            ${municipality.isServiced ? 'Available Now' : 'Coming Soon'}
          </div>
        </div>
      `, {
        closeButton: false,
        className: 'custom-popup-dark'
      });

      marker.on('click', () => {
        onMunicipalityClick(municipality);
      });

      markersLayerRef.current.addLayer(marker);
    });

    if (selectedMunicipality && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedMunicipality.coordinates[0], selectedMunicipality.coordinates[1]], 
        10,
        {
          duration: 1.5,
          easeLinearity: 0.5
        }
      );
    } else if (mapInstanceRef.current && !selectedMunicipality) {
      mapInstanceRef.current.flyTo(
        [39.8283, -98.5795], 
        4,
        {
          duration: 1.0,
          easeLinearity: 0.5
        }
      );
    }
  }, [municipalities, selectedMunicipality, onMunicipalityClick]);

  // 🔽 ADD GEOJSON LAYERS FOR BORDERS
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const getStyle = (color: string): L.PathOptions => ({
      color,
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0,
    });

    // Dark navy blue state borders
    fetch('https://cdn.jsdelivr.net/gh/PublicaMundi/MappingAPI@master/data/geojson/us-states.json')
      .then(res => res.json())
      .then(data => {
        L.geoJSON(data, {
          style: getStyle('#0f172a')
        }).addTo(map);
      });

    // Emerald green county borders
    fetch('https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json')
      .then(res => res.json())
      .then(data => {
        L.geoJSON(data, {
          style: getStyle('#10b981')
        }).addTo(map);
      });
  }, []);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        .custom-popup-dark .leaflet-popup-content-wrapper {
          background: #1e293b;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border: 1px solid #334155;
        }

        .custom-popup-dark .leaflet-popup-tip {
          background: #1e293b;
          border-bottom: 1px solid #334155;
          border-right: 1px solid #334155;
        }

        .custom-popup-dark .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.6; }
        }

        .leaflet-control-zoom {
          border: 1px solid #334155 !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
          border-radius: 8px !important;
          background: #1e293b !important;
        }

        .leaflet-control-zoom a {
          background-color: #1e293b !important;
          color: #10b981 !important;
          border-bottom: 1px solid #334155 !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
          font-weight: 500 !important;
        }

        .leaflet-control-zoom a:hover {
          background-color: #334155 !important;
          color: #34d399 !important;
        }

        .leaflet-control-attribution {
          background: rgba(15, 23, 42, 0.8) !important;
          color: #64748b !important;
          padding: 4px 8px !important;
          font-size: 11px !important;
          border-radius: 6px !important;
          border: 1px solid #334155 !important;
          margin: 10px !important;
        }

        .leaflet-control-attribution a {
          color: #10b981 !important;
        }

        /* Ocean preserved, land appears white */
        .leaflet-container {
          background: #0f172a;
        }

        .leaflet-tile-pane {
          filter: grayscale(1) brightness(2.5) contrast(0.7);
        }

        .marker-container:hover > div:first-child {
          transform: scale(1.15);
          box-shadow: 0 4px 20px rgba(0,0,0,0.6), 0 0 30px var(--glow-color);
        }
      `}</style>
      <div ref={mapRef} className="w-full h-full" />
    </>
  );
}
