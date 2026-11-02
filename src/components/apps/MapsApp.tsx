import React, { useState } from 'react';
import { Search, MapPin, Compass, Navigation, Layers, ZoomIn, ZoomOut } from 'lucide-react';

interface Landmark {
  id: string;
  name: string;
  city: string;
  desc: string;
  coords: string;
  color: string;
}

const LANDMARKS: Landmark[] = [
  { id: 'apple-park', name: 'Apple Park (蘋果總部)', city: 'Cupertino, CA', desc: '1 Apple Park Way, 環形太空船建築', coords: '37.3346° N, 122.0090° W', color: 'bg-blue-600' },
  { id: 'taipei-101', name: '台北 101 與信義商圈', city: '台灣 · 台北', desc: '標誌性摩天大樓與現代都會天際線', coords: '25.0330° N, 121.5654° E', color: 'bg-emerald-600' },
  { id: 'tokyo', name: '東京澀谷十字路口', city: '日本 · 東京', desc: 'Shibuya Crossing, 標誌性繁華街區', coords: '35.6595° N, 139.7005° E', color: 'bg-purple-600' },
  { id: 'paris', name: '巴黎艾菲爾鐵塔', city: '法國 · 巴黎', desc: 'Champ de Mars, 浪漫之都地標', coords: '48.8584° N, 2.2945° E', color: 'bg-amber-600' },
  { id: 'nyc', name: '紐約時代廣場', city: '美國 · 紐約', desc: 'Times Square, 百老匯劇院區', coords: '40.7580° N, 73.9855° W', color: 'bg-rose-600' },
];

export const MapsApp: React.FC = () => {
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark>(LANDMARKS[0]);
  const [isSatellite, setIsSatellite] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(14);

  return (
    <div className="flex h-full select-none text-slate-800 dark:text-slate-100 text-xs">
      {/* Sidebar Places */}
      <div className="w-56 bg-slate-100/70 dark:bg-slate-800/60 border-r border-black/10 dark:border-white/10 flex flex-col shrink-0 p-3">
        <div className="mb-3">
          <span className="font-semibold text-xs block mb-1">精選地標</span>
          <span className="text-[10px] text-slate-400">點擊探索世界城市與蘋果園區</span>
        </div>

        <div className="space-y-1 overflow-y-auto flex-1">
          {LANDMARKS.map((item) => {
            const isSelected = item.id === selectedLandmark.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedLandmark(item)}
                className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <MapPin size={13} className={isSelected ? 'text-white' : 'text-blue-500'} />
                  <span className="font-semibold truncate">{item.name}</span>
                </div>
                <div className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                  {item.city}
                </div>
              </div>
            );
          })}
        </div>

        {/* View Toggle */}
        <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">衛星檢視</span>
          <button
            onClick={() => setIsSatellite(!isSatellite)}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              isSatellite ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            {isSatellite ? '開啟' : '標準'}
          </button>
        </div>
      </div>

      {/* Map Canvas Simulation */}
      <div className="flex-1 flex flex-col bg-slate-200 dark:bg-slate-950 relative overflow-hidden">
        {/* Top Floating Search & Controls */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto p-2 rounded-xl mac-glass mac-window-shadow border border-white/20 dark:border-white/10 flex items-center gap-2">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              readOnly
              value={`${selectedLandmark.name} · ${selectedLandmark.city}`}
              className="bg-transparent text-xs w-48 font-medium focus:outline-none"
            />
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-xl mac-glass mac-window-shadow border border-white/20 dark:border-white/10">
            <button
              onClick={() => setZoomLevel((z) => Math.min(18, z + 1))}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              title="放大"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(10, z - 1))}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              title="縮小"
            >
              <ZoomOut size={14} />
            </button>
          </div>
        </div>

        {/* Render Map Terrain */}
        <div 
          className={`flex-1 flex items-center justify-center p-8 transition-colors duration-500 relative ${
            isSatellite
              ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-stone-900'
              : 'bg-gradient-to-br from-blue-100 via-emerald-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950'
          }`}
        >
          {/* Subtle Grid Roads */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Pin Location Card */}
          <div className="relative flex flex-col items-center animate-in zoom-in-90 duration-300">
            <div className="p-4 rounded-2xl mac-glass mac-window-shadow border border-white/30 dark:border-white/10 flex flex-col items-center gap-2 max-w-xs text-center shadow-2xl">
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                <MapPin size={20} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{selectedLandmark.name}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{selectedLandmark.desc}</p>
              <div className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono text-[10px] text-slate-500">
                {selectedLandmark.coords} · 縮放層級 {zoomLevel}x
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
