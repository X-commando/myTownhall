'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Municipality } from '@/lib/store';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '',
  iconUrl: '',
  shadowUrl: '',
});

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
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on NJ-NY-PA region where our municipalities are located
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true
    }).setView([40.5, -74.5], 8); // Center on NJ-NY-PA region

    // Add zoom control
    L.control.zoom({
      position: 'topleft'
    }).addTo(map);

    // Add base layer - using a custom style for better water/land contrast
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri',
      maxZoom: 16
    }).addTo(map);

    // Add attribution
    L.control.attribution({
      position: 'bottomright',
      prefix: false
    }).addTo(map);

    // Create markers layer
    markersLayerRef.current = L.layerGroup().addTo(map);
    
    mapInstanceRef.current = map;
    setMapReady(true);

    // Load GeoJSON for US borders
    Promise.all([
      // US States
      fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
        .then(res => res.json()),
      // US Counties - alternative source
      fetch('https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json')
        .then(res => res.json())
        .catch(() => null) // Counties might fail, that's okay
    ]).then(([statesData, countiesData]) => {
      if (statesData) {
        L.geoJSON(statesData, {
          style: {
            color: '#10b981',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0,
            dashArray: '0'
          }
        }).addTo(map);
      }

      if (countiesData) {
        L.geoJSON(countiesData, {
          style: {
            color: '#065f46', // Darker emerald green
            weight: 1,        // Thicker line
            opacity: 0.7,     // More opaque
            fillOpacity: 0,
            dashArray: '3 3'  // Dashed pattern
          }
        }).addTo(map);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapReady(false);
      }
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapReady || !markersLayerRef.current) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    // Add markers for each municipality
    municipalities.forEach((municipality) => {
      if (!markersLayerRef.current) return;

      const isSelected = selectedMunicipality?.id === municipality.id;
      const markerColor = municipality.isServiced ? '#10b981' : '#f97316';
      const glowColor = municipality.isServiced ? 'rgba(16, 185, 129, 0.6)' : 'rgba(249, 115, 22, 0.6)';
      
      const customIcon = L.divIcon({
        html: `
          <div class="leaflet-marker-icon" style="
            position: relative;
            width: ${isSelected ? '36px' : '26px'};
            height: ${isSelected ? '36px' : '26px'};
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
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
        popupAnchor: [0, isSelected ? -24 : -18]
      });

      const marker = L.marker([municipality.coordinates[0], municipality.coordinates[1]], {
        icon: customIcon,
        riseOnHover: true
      });

      // Bind popup
      const popupContent = L.DomUtil.create('div');
      popupContent.innerHTML = `
        <div style="
          padding: 16px;
          min-width: 200px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        ">
          <h3 style="
            font-weight: 600;
            font-size: 16px;
            margin: 0 0 12px 0;
            color: #f1f5f9;
          ">
            ${municipality.name}, ${municipality.state}
          </h3>
          <div style="
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-size: 14px;
            margin-bottom: 12px;
          ">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Population:</span>
              <span style="font-weight: 500; color: #e2e8f0;">${municipality.population.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">ZIP Code:</span>
              <span style="font-weight: 500; color: #e2e8f0;">${municipality.zipCode}</span>
            </div>
          </div>
          <div style="
            text-align: center;
            padding: 6px 12px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 600;
            background: ${municipality.isServiced ? '#10b981' : '#f97316'};
            color: white;
          ">
            ${municipality.isServiced ? 'In Service' : 'Coming Soon'}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: true,
        className: 'custom-popup-dark',
        autoPan: true,
        autoPanPaddingTopLeft: L.point(50, 50),
        autoPanPaddingBottomRight: L.point(50, 50),
        maxWidth: 300
      });

      // Handle marker click
      marker.on('click', function() {
        onMunicipalityClick(municipality);
      });

      markersLayerRef.current.addLayer(marker);
    });
  }, [municipalities, selectedMunicipality, onMunicipalityClick, mapReady]);

  // Handle zoom to selected municipality
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedMunicipality) return;

    mapInstanceRef.current.flyTo(
      [selectedMunicipality.coordinates[0], selectedMunicipality.coordinates[1]], 
      10,
      {
        duration: 1.5,
        easeLinearity: 0.5
      }
    );
  }, [selectedMunicipality]);

  return (
    <>
      <style jsx global>{`
        /* Custom popup styles */
        .custom-popup-dark .leaflet-popup-content-wrapper {
          background: #1e293b !important;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border: 1px solid #334155;
          padding: 0;
        }

        .custom-popup-dark .leaflet-popup-tip {
          background: #1e293b !important;
          border: 1px solid #334155;
        }

        .custom-popup-dark .leaflet-popup-content {
          margin: 0 !important;
          padding: 0 !important;
          color: white !important;
        }

        .custom-popup-dark .leaflet-popup-close-button {
          color: #94a3b8 !important;
          font-size: 20px !important;
          padding: 8px !important;
          top: 8px !important;
          right: 8px !important;
        }

        .custom-popup-dark .leaflet-popup-close-button:hover {
          color: #f1f5f9 !important;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.6; }
        }

        /* Zoom controls */
        .leaflet-control-zoom {
          border: 1px solid #334155 !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
          border-radius: 8px !important;
          background: #1e293b !important;
          overflow: hidden !important;
        }

        .leaflet-control-zoom a {
          background-color: #1e293b !important;
          color: #10b981 !important;
          border: none !important;
          border-bottom: 1px solid #334155 !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
          font-weight: 500 !important;
          transition: all 0.2s ease !important;
        }

        .leaflet-control-zoom a:hover {
          background-color: #334155 !important;
          color: #34d399 !important;
        }

        .leaflet-control-zoom a:last-child {
          border-bottom: none !important;
        }

        /* Attribution */
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

        /* Map container */
        .leaflet-container {
          background: #0c1220 !important;
        }

        /* Marker hover effect */
        .leaflet-marker-icon:hover > div:first-child {
          transform: scale(1.15);
          filter: brightness(1.2);
        }

        .custom-div-icon {
          background: transparent !important;
          border: none !important;
        }

        /* Better land/water contrast */
        .leaflet-tile-pane {
          filter: brightness(1.1) contrast(1.1) saturate(1.2);
        }
      `}</style>
      <div ref={mapRef} className="w-full h-full" />
    </>
  );
}