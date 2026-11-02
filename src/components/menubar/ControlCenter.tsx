import React from 'react';
import { useOS } from '../../context/OSContext';
import { 
  Wifi, 
  Bluetooth, 
  Radio, 
  Sun, 
  Volume2, 
  VolumeX, 
  Moon, 
  LayoutGrid, 
  BellOff, 
  Music2, 
  Play, 
  Pause,
  SkipForward,
  Laptop
} from 'lucide-react';

export const ControlCenter: React.FC = () => {
  const {
    wifiEnabled,
    setWifiEnabled,
    bluetoothEnabled,
    setBluetoothEnabled,
    airDropEnabled,
    setAirDropEnabled,
    isDarkMode,
    setIsDarkMode,
    stageManager,
    setStageManager,
    dnd,
    setDnd,
    brightness,
    setBrightness,
    volume,
    setVolume,
    setIsControlCenterOpen,
    openApp,
  } = useOS();

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute right-3 top-9 w-80 rounded-2xl p-3 mac-glass mac-window-shadow border border-white/20 dark:border-white/10 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-100 select-none"
    >
      {/* 2x2 Big Controls Grid */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {/* Left tall card: Connectivity */}
        <div className="rounded-xl p-2.5 bg-white/50 dark:bg-black/30 border border-white/30 dark:border-white/10 flex flex-col gap-2.5">
          {/* Wi-Fi */}
          <button
            onClick={() => setWifiEnabled(!wifiEnabled)}
            className="flex items-center gap-2.5 w-full text-left"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                wifiEnabled ? 'bg-blue-500 text-white shadow-sm' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Wifi size={14} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold leading-tight">Wi-Fi</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {wifiEnabled ? 'Apple-Guest-5G' : '未連接'}
              </span>
            </div>
          </button>

          {/* Bluetooth */}
          <button
            onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
            className="flex items-center gap-2.5 w-full text-left"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                bluetoothEnabled ? 'bg-blue-500 text-white shadow-sm' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Bluetooth size={14} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold leading-tight">藍牙</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {bluetoothEnabled ? 'AirPods Pro 已連線' : '關閉'}
              </span>
            </div>
          </button>

          {/* AirDrop */}
          <button
            onClick={() => setAirDropEnabled(!airDropEnabled)}
            className="flex items-center gap-2.5 w-full text-left"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                airDropEnabled ? 'bg-blue-500 text-white shadow-sm' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Radio size={14} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold leading-tight">隔空投送</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {airDropEnabled ? '只限聯絡人' : '已關閉'}
              </span>
            </div>
          </button>
        </div>

        {/* Right 2 Small Buttons */}
        <div className="flex flex-col gap-2">
          {/* Dark Mode toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left ${
              isDarkMode 
                ? 'bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-400' 
                : 'bg-white/50 dark:bg-black/30 border-white/30 dark:border-white/10'
            }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
              <Moon size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold leading-tight">深色模式</span>
              <span className="text-[10px] opacity-70">{isDarkMode ? '開啟' : '關閉'}</span>
            </div>
          </button>

          {/* Stage Manager toggle */}
          <button
            onClick={() => setStageManager(!stageManager)}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left ${
              stageManager 
                ? 'bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-400' 
                : 'bg-white/50 dark:bg-black/30 border-white/30 dark:border-white/10'
            }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${stageManager ? 'bg-blue-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
              <LayoutGrid size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold leading-tight">幕前調度</span>
              <span className="text-[10px] opacity-70">{stageManager ? '開啟' : '關閉'}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Focus / Do Not Disturb */}
      <button
        onClick={() => setDnd(!dnd)}
        className={`w-full flex items-center gap-2.5 p-2.5 mb-2 rounded-xl border transition-all text-left ${
          dnd
            ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
            : 'bg-white/50 dark:bg-black/30 border-white/30 dark:border-white/10'
        }`}
      >
        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${dnd ? 'bg-indigo-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
          <BellOff size={14} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold leading-tight">專注模式</span>
          <span className="text-[10px] opacity-70">{dnd ? '勿擾模式 — 開啟' : '關閉'}</span>
        </div>
      </button>

      {/* Sliders: Display Brightness */}
      <div className="p-2.5 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 dark:border-white/10 mb-2">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Sun size={13} className="text-amber-500" /> 顯示器
          </span>
          <span className="text-[10px] font-mono opacity-60 tabular-nums">{brightness}%</span>
        </div>
        <input
          type="range"
          min="30"
          max="100"
          value={brightness}
          onChange={(e) => setBrightness(parseInt(e.target.value))}
          className="w-full h-4 bg-slate-200/80 dark:bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Sliders: Sound Volume */}
      <div className="p-2.5 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 dark:border-white/10 mb-2">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="flex items-center gap-1.5 text-[11px]">
            {volume === 0 ? <VolumeX size={13} className="text-rose-500" /> : <Volume2 size={13} className="text-blue-500" />} 聲音
          </span>
          <span className="text-[10px] font-mono opacity-60 tabular-nums">{volume}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className="w-full h-4 bg-slate-200/80 dark:bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Mini Music Controller */}
      <div className="p-2.5 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 dark:border-white/10 flex items-center justify-between">
        <div 
          onClick={() => {
            setIsControlCenterOpen(false);
            openApp('music');
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-sm">
            <Music2 size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold leading-tight group-hover:underline">Apple Music</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Lo-Fi Coding Beats</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => openApp('music')}
            className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
          >
            <Play size={14} className="fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
