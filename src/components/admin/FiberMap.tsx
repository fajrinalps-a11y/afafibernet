import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Layers, Radio, Search, Plus, Filter, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import { useISP } from '../../context/ISPContext';
import { MAP_API_KEY } from '../../data/defaultData';
import { Customer, ODC, ODP } from '../../types/isp';

export const FiberMap: React.FC = () => {
  const { customers, odcs, odps } = useISP();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'odc' | 'odp' | 'customer' | 'isolated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<{ type: string; data: any } | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default centered on Kebon Jeruk / West Jakarta area
      const map = L.map(mapContainerRef.current, {
        center: [-6.1950, 106.7740],
        zoom: 14,
        zoomControl: true
      });

      // Standard OSM Tile layer with custom key query parameter as requested
      const tileUrl = `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?apikey=${MAP_API_KEY}`;
      L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap contributors | AFAFIBER GIS Core',
        maxZoom: 19
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Clean up map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers and Lines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Custom Icon Creators
    const createDivIcon = (type: 'odc' | 'odp' | 'active' | 'isolated', label: string) => {
      const bgColors = {
        odc: 'bg-purple-600 border-purple-900',
        odp: 'bg-amber-500 border-amber-800',
        active: 'bg-emerald-500 border-emerald-800',
        isolated: 'bg-red-500 border-red-800'
      };

      const shapes = {
        odc: 'w-7 h-7 rounded-lg',
        odp: 'w-6 h-6 rounded-md',
        active: 'w-5 h-5 rounded-full',
        isolated: 'w-5 h-5 rounded-full'
      };

      return L.divIcon({
        className: 'custom-fiber-icon',
        html: `
          <div class="${shapes[type]} ${bgColors[type]} border-2 flex items-center justify-center text-white font-bold text-[9px] shadow-md ring-2 ring-white/80">
            ${label}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
    };

    // 1. Render ODCs
    if (selectedFilter === 'all' || selectedFilter === 'odc') {
      odcs.forEach(odc => {
        const marker = L.marker(odc.coordinates, {
          icon: createDivIcon('odc', 'ODC')
        });

        marker.bindPopup(`
          <div class="p-2 text-xs font-sans">
            <p class="font-bold text-purple-700 text-sm">${odc.name}</p>
            <p class="text-slate-600 mt-1">ID: <strong>${odc.id}</strong></p>
            <p class="text-slate-600">Alamat: ${odc.locationName}</p>
            <p class="text-slate-600">Kapasitas: <strong>${odc.usedPorts}/${odc.capacityPorts} Port</strong></p>
            <p class="text-slate-500 font-mono text-[10px] mt-1">[${odc.coordinates.join(', ')}]</p>
          </div>
        `);

        marker.on('click', () => setSelectedNode({ type: 'ODC', data: odc }));
        layerGroup.addLayer(marker);
      });
    }

    // 2. Render ODPs & Fiber feeder lines (ODC -> ODP)
    if (selectedFilter === 'all' || selectedFilter === 'odp') {
      odps.forEach(odp => {
        const marker = L.marker(odp.coordinates, {
          icon: createDivIcon('odp', 'ODP')
        });

        marker.bindPopup(`
          <div class="p-2 text-xs font-sans">
            <p class="font-bold text-amber-700 text-sm">${odp.name}</p>
            <p class="text-slate-600 mt-1">ID: <strong>${odp.id}</strong></p>
            <p class="text-slate-600">Induk: <strong>${odp.odcId}</strong></p>
            <p class="text-slate-600">Alamat: ${odp.locationName}</p>
            <p class="text-slate-600">Penggunaan: <strong>${odp.usedPorts}/${odp.capacityPorts} Core</strong></p>
          </div>
        `);

        marker.on('click', () => setSelectedNode({ type: 'ODP', data: odp }));
        layerGroup.addLayer(marker);

        // Draw line from parent ODC to this ODP
        const parentODC = odcs.find(o => o.id === odp.odcId);
        if (parentODC) {
          const polyline = L.polyline([parentODC.coordinates, odp.coordinates], {
            color: '#a855f7',
            weight: 3,
            opacity: 0.65,
            dashArray: '4, 4'
          });
          layerGroup.addLayer(polyline);
        }
      });
    }

    // 3. Render Customers & Drop cables (ODP -> Customer)
    customers.forEach(cust => {
      const isIsolated = cust.status === 'isolated';

      if (
        selectedFilter === 'all' ||
        (selectedFilter === 'customer' && !isIsolated) ||
        (selectedFilter === 'isolated' && isIsolated)
      ) {
        const marker = L.marker(cust.coordinates, {
          icon: createDivIcon(isIsolated ? 'isolated' : 'active', isIsolated ? '✕' : '●')
        });

        marker.bindPopup(`
          <div class="p-2 text-xs font-sans">
            <p class="font-bold text-slate-900 text-sm">${cust.name}</p>
            <p class="text-slate-600 mt-0.5">ID: <strong>${cust.id}</strong> | NIK: <strong>${cust.nikKtp}</strong></p>
            <p class="text-slate-600">Status: <strong class="${isIsolated ? 'text-red-600' : 'text-emerald-600'}">${isIsolated ? 'TERISOLIR' : 'AKTIF'}</strong></p>
            <p class="text-slate-600">Optical Rx: <strong>${cust.opticalRxPower} dBm</strong></p>
            <p class="text-slate-600">ODP Terhubung: <strong>${cust.odpId}</strong></p>
            <p class="text-slate-500 mt-1">${cust.address}</p>
          </div>
        `);

        marker.on('click', () => setSelectedNode({ type: 'Pelanggan', data: cust }));
        layerGroup.addLayer(marker);

        // Draw drop fiber cable line to parent ODP
        const parentODP = odps.find(p => p.id === cust.odpId);
        if (parentODP) {
          const dropLine = L.polyline([parentODP.coordinates, cust.coordinates], {
            color: isIsolated ? '#ef4444' : '#10b981',
            weight: 1.5,
            opacity: 0.7
          });
          layerGroup.addLayer(dropLine);
        }
      }
    });

  }, [customers, odcs, odps, selectedFilter]);

  // Handle Search Zoom
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    const query = searchQuery.toLowerCase().trim();
    // Search in customers
    const foundCust = customers.find(c => 
      c.name.toLowerCase().includes(query) || 
      c.id.toLowerCase().includes(query) ||
      c.nikKtp.includes(query)
    );

    if (foundCust) {
      mapInstanceRef.current.setView(foundCust.coordinates, 17, { animate: true });
      setSelectedNode({ type: 'Pelanggan', data: foundCust });
      return;
    }

    // Search in ODPs
    const foundODP = odps.find(o => o.name.toLowerCase().includes(query) || o.id.toLowerCase().includes(query));
    if (foundODP) {
      mapInstanceRef.current.setView(foundODP.coordinates, 17, { animate: true });
      setSelectedNode({ type: 'ODP', data: foundODP });
      return;
    }

    // Search in ODCs
    const foundODC = odcs.find(o => o.name.toLowerCase().includes(query) || o.id.toLowerCase().includes(query));
    if (foundODC) {
      mapInstanceRef.current.setView(foundODC.coordinates, 16, { animate: true });
      setSelectedNode({ type: 'ODC', data: foundODC });
      return;
    }

    alert('Titik tidak ditemukan untuk kata kunci: ' + searchQuery);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Controls Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              selectedFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Titik ({odcs.length + odps.length + customers.length})
          </button>
          <button
            onClick={() => setSelectedFilter('odc')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              selectedFilter === 'odc'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ODC ({odcs.length})
          </button>
          <button
            onClick={() => setSelectedFilter('odp')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              selectedFilter === 'odp'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ODP ({odps.length})
          </button>
          <button
            onClick={() => setSelectedFilter('customer')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              selectedFilter === 'customer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pelanggan Aktif ({customers.filter(c => c.status === 'active').length})
          </button>
          <button
            onClick={() => setSelectedFilter('isolated')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              selectedFilter === 'isolated'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Terisolir ({customers.filter(c => c.status === 'isolated').length})
          </button>
        </div>

        {/* Right: Search Box & Key Indicator */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari ID, Nama, NIK, ODP..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
          </form>

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600">
            <Radio className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
            <span>Map Key:</span>
            <code className="font-mono text-cyan-700 font-bold">{MAP_API_KEY.slice(0, 10)}...</code>
          </div>
        </div>

      </div>

      {/* Map Canvas and Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[580px]">
        
        {/* Leaflet Container (3 Cols) */}
        <div className="lg:col-span-3 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative shadow-xs">
          <div ref={mapContainerRef} className="w-full h-full min-h-[400px]"></div>

          {/* Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-slate-200 shadow-md text-xs space-y-1.5">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block mb-1">Legenda Jaringan Fiber:</span>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-purple-600 rounded"></span>
              <span className="text-slate-700">ODC (Core Distribution)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-amber-500 rounded"></span>
              <span className="text-slate-700">ODP (Tiang Distribusi)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full"></span>
              <span className="text-slate-700">Pelanggan Aktif</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-red-500 rounded-full"></span>
              <span className="text-slate-700">Pelanggan Terisolir</span>
            </div>
          </div>
        </div>

        {/* Selected Node Inspector (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Detail Node Terpilih</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {selectedNode ? selectedNode.type : 'Pilih di Peta'}
              </span>
            </div>

            {selectedNode ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Nama Titik / Pelanggan:</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedNode.data.name}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Identifikasi ID:</span>
                  <p className="font-mono font-semibold text-cyan-700">{selectedNode.data.id}</p>
                </div>
                {selectedNode.data.nikKtp && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">NIK KTP:</span>
                    <p className="font-mono text-slate-800">{selectedNode.data.nikKtp}</p>
                  </div>
                )}
                {selectedNode.data.status && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">Status Operasional:</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 ${
                      selectedNode.data.status === 'active' || selectedNode.data.status === 'normal'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {selectedNode.data.status.toUpperCase()}
                    </span>
                  </div>
                )}
                {selectedNode.data.opticalRxPower !== undefined && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">Optical Power (Rx):</span>
                    <p className="font-mono font-bold text-slate-900">{selectedNode.data.opticalRxPower} dBm</p>
                    <span className="text-[10px] text-emerald-600 font-medium">Standar Redaman Bagus (&lt; -24 dBm)</span>
                  </div>
                )}
                {selectedNode.data.capacityPorts && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">Port Kapasitas:</span>
                    <p className="font-mono font-semibold text-slate-800">
                      {selectedNode.data.usedPorts} / {selectedNode.data.capacityPorts} Port Terpakai
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 block text-[11px]">Lokasi / Alamat:</span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {selectedNode.data.address || selectedNode.data.locationName}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Koordinat GPS:</span>
                  <p className="font-mono text-[10px] text-slate-500">
                    {selectedNode.data.coordinates ? selectedNode.data.coordinates.join(', ') : '-'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">Klik salah satu pin ODC, ODP, atau Pelanggan pada peta untuk memeriksa rincian teknis.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            GIS Telemetry Real-time · Map Key Active
          </div>
        </div>

      </div>

    </div>
  );
};
