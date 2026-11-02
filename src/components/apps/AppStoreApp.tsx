import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { AppId } from '../../types';
import { ShoppingBag, Search, Sparkles, Star, Download, Check, ExternalLink } from 'lucide-react';

interface StoreApp {
  id: string;
  name: string;
  category: string;
  rating: number;
  iconBg: string;
  iconText: string;
  desc: string;
  appId?: AppId;
}

const APPS: StoreApp[] = [
  { id: '1', name: 'Safari 瀏覽器', category: '效率與瀏覽', rating: 4.9, iconBg: 'bg-sky-500', iconText: '🧭', desc: '暢遊網際網路，安全私密防追蹤', appId: 'safari' },
  { id: '2', name: 'Xcode 16', category: '開發者工具', rating: 4.8, iconBg: 'bg-blue-600', iconText: '🛠️', desc: '建構下一代出色 Apple 平台的應用程式' },
  { id: '3', name: 'Apple Music', category: '音樂與沉浸聲', rating: 4.9, iconBg: 'bg-rose-500', iconText: '🎵', desc: '海量無損音訊與杜比全景聲體驗', appId: 'music' },
  { id: '4', name: '終端機 Terminal', category: '開發者工具', rating: 4.7, iconBg: 'bg-slate-900', iconText: '⌨️', desc: '高效能 Zsh 命令列環境與腳本自動化', appId: 'terminal' },
  { id: '5', name: '備忘錄 Notes', category: '生產力工具', rating: 4.9, iconBg: 'bg-amber-400', iconText: '📝', desc: '捕捉靈感、記錄清單與富文字排版', appId: 'notes' },
  { id: '6', name: 'Final Cut Pro', category: '影片創意製作', rating: 4.8, iconBg: 'bg-indigo-600', iconText: '🎬', desc: '專業級影片剪輯與色彩分級利器' },
  { id: '7', name: '計算機 Calculator', category: '實用工具', rating: 4.6, iconBg: 'bg-orange-500', iconText: '🔢', desc: '標準與科學計算機，支援歷史計算紙帶', appId: 'calculator' },
  { id: '8', name: 'Logic Pro', category: '專業音訊創作', rating: 4.9, iconBg: 'bg-stone-800', iconText: '🎹', desc: '頂尖音樂製作、合成與母帶後期工程' },
];

export const AppStoreApp: React.FC = () => {
  const { openApp } = useOS();
  const [activeCategory, setActiveCategory] = useState('all');
  const [installed, setInstalled] = useState<Record<string, boolean>>({
    '1': true,
    '3': true,
    '4': true,
    '5': true,
    '7': true,
  });

  const handleInstall = (app: StoreApp) => {
    if (app.appId) {
      openApp(app.appId);
    } else {
      setInstalled((prev) => ({ ...prev, [app.id]: true }));
      alert(`已成功取得並在系統中就緒: ${app.name}`);
    }
  };

  return (
    <div className="flex h-full select-none text-slate-800 dark:text-slate-100 text-xs">
      {/* Sidebar */}
      <div className="w-48 bg-slate-100/70 dark:bg-slate-800/60 border-r border-black/10 dark:border-white/10 p-3 flex flex-col gap-2 shrink-0">
        <div className="px-2 py-1 text-sm font-bold flex items-center gap-1.5 text-blue-600">
          <ShoppingBag size={16} /> App Store
        </div>

        <div className="space-y-0.5 mt-2">
          {['探索發現', '創作', '工作效率', '遊戲娛樂', '開發者'].map((cat, idx) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                (activeCategory === 'all' && idx === 0) || activeCategory === cat
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 min-w-0 overflow-y-auto p-6 space-y-6">
        {/* Banner Hero */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md relative overflow-hidden">
          <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">主打推薦</span>
          <h2 className="text-2xl font-bold mt-1 mb-2">macOS 生產力創作套件</h2>
          <p className="text-xs opacity-90 max-w-md">
            專為 Apple Silicon M4 Max 打造，深度融合高效鍵盤快捷鍵與純淨視覺體驗。
          </p>
        </div>

        {/* Apps Grid */}
        <div>
          <h3 className="font-bold text-sm mb-3">熱門精選應用程式</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {APPS.map((app) => {
              const isInst = installed[app.id];
              return (
                <div
                  key={app.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-black/5 dark:border-white/5 flex items-center justify-between gap-3 hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-12 h-12 rounded-xl ${app.iconBg} flex items-center justify-center text-2xl shadow-xs shrink-0`}>
                      {app.iconText}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs truncate">{app.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{app.desc}</p>
                      <div className="flex items-center gap-1 text-[10px] text-amber-500 mt-1">
                        <Star size={10} className="fill-current" />
                        <span className="font-mono text-slate-500">{app.rating}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInstall(app)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                      isInst
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    {isInst ? '打開' : '取得'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
