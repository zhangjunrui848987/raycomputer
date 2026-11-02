import React, { useState, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { AppId } from '../../types';
import { 
  Compass, 
  Terminal as TerminalIcon, 
  FileText, 
  Calculator as CalcIcon, 
  Settings as SettingsIcon, 
  Image as ImageIcon, 
  Music, 
  MessageSquare, 
  MapPin, 
  ShoppingBag, 
  Sparkles, 
  Trash2,
  FolderOpen,
  LayoutGrid,
  Mail
} from 'lucide-react';

interface DockItemDef {
  id: AppId | 'launchpad';
  name: string;
  icon: any;
  color: string;
  gradient?: string;
  badge?: number;
}

const DOCK_ITEMS: DockItemDef[] = [
  { id: 'finder', name: '訪達 (Finder)', icon: FolderOpen, color: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600' },
  { id: 'launchpad', name: '啟動台 (Launchpad)', icon: LayoutGrid, color: 'bg-slate-600', gradient: 'from-slate-500 to-slate-700' },
  { id: 'safari', name: 'Safari 瀏覽器', icon: Compass, color: 'bg-sky-500', gradient: 'from-sky-400 to-blue-600' },
  { id: 'messages', name: '訊息', icon: MessageSquare, color: 'bg-emerald-500', gradient: 'from-emerald-400 to-green-600', badge: 1 },
  { id: 'mail', name: '郵件', icon: Mail, color: 'bg-blue-400', gradient: 'from-sky-400 to-indigo-500' },
  { id: 'maps', name: '地圖', icon: MapPin, color: 'bg-teal-500', gradient: 'from-emerald-400 to-teal-600' },
  { id: 'photos', name: '照片', icon: ImageIcon, color: 'bg-pink-500', gradient: 'from-rose-400 via-fuchsia-500 to-purple-600' },
  { id: 'music', name: '音樂', icon: Music, color: 'bg-rose-500', gradient: 'from-rose-500 to-pink-600' },
  { id: 'notes', name: '備忘錄', icon: FileText, color: 'bg-amber-400', gradient: 'from-amber-300 to-amber-500' },
  { id: 'terminal', name: '終端機', icon: TerminalIcon, color: 'bg-slate-800', gradient: 'from-slate-700 to-black' },
  { id: 'calculator', name: '計算機', icon: CalcIcon, color: 'bg-orange-500', gradient: 'from-orange-400 to-amber-600' },
  { id: 'settings', name: '系統設定', icon: SettingsIcon, color: 'bg-slate-500', gradient: 'from-slate-400 to-slate-600' },
  { id: 'appstore', name: 'App Store', icon: ShoppingBag, color: 'bg-blue-600', gradient: 'from-blue-500 to-indigo-600' },
  { id: 'siri', name: 'Siri 智慧助理', icon: Sparkles, color: 'bg-purple-600', gradient: 'from-amber-400 via-pink-500 to-indigo-600' },
];

export const Dock: React.FC = () => {
  const {
    openApp,
    runningAppIds,
    activeAppId,
    trash,
    emptyTrash,
    isLaunchpadOpen,
    setIsLaunchpadOpen,
  } = useOS();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [bouncingApp, setBouncingApp] = useState<string | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const handleAppClick = (item: DockItemDef) => {
    if (item.id === 'launchpad') {
      setIsLaunchpadOpen(!isLaunchpadOpen);
      return;
    }

    // Trigger bounce
    setBouncingApp(item.id);
    setTimeout(() => setBouncingApp(null), 1000);
    openApp(item.id as AppId);
  };

  // Magnification calculation based on mouse distance
  const getScale = (index: number) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.4;
    if (distance === 1) return 1.22;
    if (distance === 2) return 1.08;
    return 1;
  };

  return (
    <div className="fixed bottom-2 left-0 right-0 z-40 flex justify-center pointer-events-none select-none">
      <div
        ref={dockRef}
        onMouseLeave={() => setHoveredIndex(null)}
        className="pointer-events-auto flex items-end gap-2 px-3 py-2 rounded-2xl mac-glass mac-dock-shadow border border-white/30 dark:border-white/10 backdrop-blur-2xl transition-all duration-150"
      >
        {/* Main Applications */}
        {DOCK_ITEMS.map((item, index) => {
          const isRunning = runningAppIds.includes(item.id as AppId);
          const isActive = activeAppId === item.id;
          const scale = getScale(index);
          const isBouncing = bouncingApp === item.id;
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="relative flex flex-col items-center group"
              onMouseEnter={() => setHoveredIndex(index)}
            >
              {/* Tooltip Label */}
              <div
                className={`absolute -top-9 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap bg-black/75 text-white backdrop-blur-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md ${
                  hoveredIndex === index ? 'opacity-100' : ''
                }`}
              >
                {item.name}
              </div>

              {/* App Icon Button */}
              <button
                onClick={() => handleAppClick(item)}
                style={{
                  transform: `scale(${scale}) translateY(${scale > 1 ? -(scale - 1) * 20 : 0}px)`,
                  transformOrigin: 'bottom center',
                }}
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md transition-transform duration-100 ease-out relative ${
                  item.gradient ? `bg-gradient-to-br ${item.gradient}` : item.color
                } ${isBouncing ? 'animate-bounce' : ''}`}
              >
                <Icon size={24} className="drop-shadow-xs" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Running Indicator Dot */}
              <div className="h-1.5 flex items-center justify-center mt-0.5">
                {isRunning && (
                  <div
                    className={`w-1 h-1 rounded-full ${
                      isActive ? 'bg-slate-900 dark:bg-white w-1.5' : 'bg-slate-700/60 dark:bg-slate-300/60'
                    }`}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Divider */}
        <div className="w-px h-10 bg-black/15 dark:bg-white/15 mx-1 self-center" />

        {/* Trash Can */}
        <div
          className="relative flex flex-col items-center group"
          onMouseEnter={() => setHoveredIndex(DOCK_ITEMS.length)}
        >
          <div className="absolute -top-9 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap bg-black/75 text-white backdrop-blur-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md">
            垃圾桶 {trash.length > 0 ? `(${trash.length} 個項目)` : '(空)'}
          </div>

          <button
            onClick={() => openApp('trash')}
            style={{
              transform: `scale(${getScale(DOCK_ITEMS.length)}) translateY(${
                getScale(DOCK_ITEMS.length) > 1 ? -(getScale(DOCK_ITEMS.length) - 1) * 20 : 0
              }px)`,
              transformOrigin: 'bottom center',
            }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-md transition-transform duration-100 ease-out bg-white/70 dark:bg-slate-800/80 border border-black/10 dark:border-white/10 ${
              trash.length > 0 ? 'text-amber-600 dark:text-amber-400' : ''
            }`}
          >
            <Trash2 size={23} />
            {trash.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                {trash.length}
              </span>
            )}
          </button>

          <div className="h-1.5 flex items-center justify-center mt-0.5">
            {runningAppIds.includes('trash') && (
              <div className="w-1 h-1 rounded-full bg-slate-900 dark:bg-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
