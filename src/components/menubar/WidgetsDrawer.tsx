import React from 'react';
import { useOS } from '../../context/OSContext';
import { CloudSun, BatteryCharging, Clock, Calendar as CalendarIcon, Cpu, HardDrive } from 'lucide-react';

export const WidgetsDrawer: React.FC = () => {
  const { isWidgetsOpen, setIsWidgetsOpen, openApp, volume, brightness } = useOS();

  if (!isWidgetsOpen) return null;

  const now = new Date();
  const dateString = now.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  const timeString = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className="fixed inset-0 z-40"
      onClick={() => setIsWidgetsOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-2 top-9 bottom-20 w-80 p-3 mac-glass mac-window-shadow rounded-2xl border border-white/20 dark:border-white/10 flex flex-col gap-3 overflow-y-auto animate-in slide-in-from-right duration-200 text-slate-800 dark:text-slate-100 select-none"
      >
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">小工具中心</span>
          <span className="text-[10px] text-slate-400">macOS Sequoia</span>
        </div>

        {/* Clock & Calendar Widget */}
        <div 
          onClick={() => openApp('settings')}
          className="p-3.5 rounded-xl bg-white/60 dark:bg-black/40 border border-white/40 dark:border-white/10 shadow-xs cursor-pointer hover:bg-white/80 dark:hover:bg-black/60 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-500 flex items-center gap-1.5">
              <CalendarIcon size={14} /> 日曆
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{timeString}</span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {now.getDate()}日
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {dateString}
          </div>
        </div>

        {/* Weather Widget */}
        <div 
          onClick={() => openApp('maps')}
          className="p-3.5 rounded-xl bg-gradient-to-br from-blue-400/80 to-blue-600/80 text-white shadow-xs cursor-pointer hover:opacity-95 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium opacity-90">加利福尼亞 · 庫比蒂諾</div>
              <div className="text-3xl font-light tracking-tight mt-1 font-mono">22°</div>
            </div>
            <CloudSun size={38} className="text-amber-200" />
          </div>
          <div className="mt-2 text-xs opacity-90 flex justify-between">
            <span>晴時多雲</span>
            <span className="font-mono">最高 25° 最低 16°</span>
          </div>
        </div>

        {/* System Performance & Battery */}
        <div className="p-3.5 rounded-xl bg-white/60 dark:bg-black/40 border border-white/40 dark:border-white/10 shadow-xs">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            <BatteryCharging size={14} className="text-emerald-500" /> 電量與硬體
          </div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-500 dark:text-slate-400">MacBook Pro 電量</span>
            <span className="font-mono font-semibold text-emerald-500">98% 已連接電源</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-3">
            <div className="bg-emerald-500 h-full w-[98%] rounded-full" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/5 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-purple-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400">CPU 負載</span>
                <span className="text-xs font-semibold font-mono">14% 正常</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive size={14} className="text-blue-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400">可用空間</span>
                <span className="text-xs font-semibold font-mono">688 GB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200">
          <div className="text-xs font-semibold mb-1">快捷鍵提示</div>
          <div className="text-[11px] leading-relaxed opacity-90">
            按 <kbd className="px-1 py-0.5 bg-black/10 dark:bg-white/10 rounded font-mono">Ctrl + Space</kbd> 或 <kbd className="px-1 py-0.5 bg-black/10 dark:bg-white/10 rounded font-mono">Cmd + K</kbd> 隨時呼叫聚焦搜尋。
          </div>
        </div>
      </div>
    </div>
  );
};
