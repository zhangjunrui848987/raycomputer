import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { AppId } from '../../types';
import { 
  FolderOpen, 
  Compass, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Image as ImageIcon, 
  Music, 
  FileText, 
  Terminal as TerminalIcon, 
  Calculator, 
  Settings, 
  ShoppingBag, 
  Sparkles, 
  Trash2, 
  Search,
  X
} from 'lucide-react';

interface LaunchpadItem {
  id: AppId;
  name: string;
  icon: any;
  color: string;
  gradient?: string;
}

const ALL_APPS: LaunchpadItem[] = [
  { id: 'finder', name: '訪達 (Finder)', icon: FolderOpen, color: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600' },
  { id: 'safari', name: 'Safari 瀏覽器', icon: Compass, color: 'bg-sky-500', gradient: 'from-sky-400 to-blue-600' },
  { id: 'notes', name: '備忘錄 (Notes)', icon: FileText, color: 'bg-amber-400', gradient: 'from-amber-300 to-amber-500' },
  { id: 'terminal', name: '終端機 (Terminal)', icon: TerminalIcon, color: 'bg-slate-800', gradient: 'from-slate-700 to-black' },
  { id: 'calculator', name: '計算機', icon: Calculator, color: 'bg-orange-500', gradient: 'from-orange-400 to-amber-600' },
  { id: 'settings', name: '系統設定', icon: Settings, color: 'bg-slate-500', gradient: 'from-slate-400 to-slate-600' },
  { id: 'photos', name: '照片', icon: ImageIcon, color: 'bg-pink-500', gradient: 'from-rose-400 via-fuchsia-500 to-purple-600' },
  { id: 'music', name: '音樂 (Music)', icon: Music, color: 'bg-rose-500', gradient: 'from-rose-500 to-pink-600' },
  { id: 'messages', name: '訊息 (Messages)', icon: MessageSquare, color: 'bg-emerald-500', gradient: 'from-emerald-400 to-green-600' },
  { id: 'maps', name: '地圖 (Maps)', icon: MapPin, color: 'bg-teal-500', gradient: 'from-emerald-400 to-teal-600' },
  { id: 'appstore', name: 'App Store', icon: ShoppingBag, color: 'bg-blue-600', gradient: 'from-blue-500 to-indigo-600' },
  { id: 'siri', name: 'Siri 智慧助理', icon: Sparkles, color: 'bg-purple-600', gradient: 'from-amber-400 via-pink-500 to-indigo-600' },
  { id: 'trash', name: '垃圾桶', icon: Trash2, color: 'bg-stone-500', gradient: 'from-stone-400 to-stone-600' },
];

export const Launchpad: React.FC = () => {
  const { isLaunchpadOpen, setIsLaunchpadOpen, openApp } = useOS();
  const [search, setSearch] = useState('');

  if (!isLaunchpadOpen) return null;

  const filteredApps = ALL_APPS.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      onClick={() => setIsLaunchpadOpen(false)}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xl flex flex-col items-center pt-14 select-none animate-in fade-in duration-200"
    >
      {/* Top Search bar */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-72 relative mb-12"
      >
        <Search size={15} className="absolute left-3 top-2.5 text-white/50" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋啟動台"
          autoFocus
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/15 border border-white/20 text-white placeholder-white/50 text-xs focus:outline-none focus:bg-white/20 transition-all text-center focus:text-left shadow-lg"
        />
      </div>

      {/* App Grid */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl w-full grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-y-10 gap-x-6 px-6"
      >
        {filteredApps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => {
                openApp(item.id);
                setIsLaunchpadOpen(false);
              }}
              className="flex flex-col items-center cursor-pointer group transition-transform hover:scale-105 active:scale-95"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl mb-2 transition-all ${
                  item.gradient ? `bg-gradient-to-br ${item.gradient}` : item.color
                } group-hover:shadow-2xl`}
              >
                <Icon size={32} className="drop-shadow-sm" />
              </div>
              <span className="text-xs font-medium text-white/90 text-center tracking-wide line-clamp-1">
                {item.name.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
