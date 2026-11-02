import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { WALLPAPERS } from '../../utils/wallpaper';
import { 
  User, 
  Sun, 
  Moon, 
  Image as ImageIcon, 
  Monitor, 
  Volume2, 
  HardDrive, 
  BatteryCharging, 
  Lock, 
  Info, 
  Wifi, 
  Bluetooth, 
  Check,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const SettingsApp: React.FC<{ initialTab?: string }> = ({ initialTab }) => {
  const {
    isDarkMode,
    setIsDarkMode,
    wallpaper,
    setWallpaper,
    volume,
    setVolume,
    brightness,
    setBrightness,
    soundEffects,
    setSoundEffects,
    wifiEnabled,
    setWifiEnabled,
    bluetoothEnabled,
    setBluetoothEnabled,
    stageManager,
    setStageManager,
  } = useOS();

  const [activeTab, setActiveTab] = useState<string>(initialTab || 'appearance');

  return (
    <div className="flex h-full select-none text-slate-800 dark:text-slate-100 text-xs">
      {/* Sidebar Navigation */}
      <div className="w-56 bg-slate-100/70 dark:bg-slate-800/60 border-r border-black/10 dark:border-white/10 p-3 flex flex-col gap-1 shrink-0 overflow-y-auto">
        {/* Apple Account Profile */}
        <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800 border border-black/5 dark:border-white/5 flex items-center gap-3 mb-2 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-base font-semibold shadow-xs">
            
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-xs truncate">Apple 帳戶</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">zhangjunrui@icloud.com</span>
          </div>
        </div>

        {/* Tab Items */}
        <button
          onClick={() => setActiveTab('appearance')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
            activeTab === 'appearance'
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Sun size={15} className={activeTab === 'appearance' ? 'text-white' : 'text-blue-500'} />
          <span>外觀 (Appearance)</span>
        </button>

        <button
          onClick={() => setActiveTab('wallpaper')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
            activeTab === 'wallpaper'
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <ImageIcon size={15} className={activeTab === 'wallpaper' ? 'text-white' : 'text-cyan-500'} />
          <span>桌面與桌布 (Wallpapers)</span>
        </button>

        <button
          onClick={() => setActiveTab('displays')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
            activeTab === 'displays'
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Monitor size={15} className={activeTab === 'displays' ? 'text-white' : 'text-blue-400'} />
          <span>顯示器 (Displays)</span>
        </button>

        <button
          onClick={() => setActiveTab('sound')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
            activeTab === 'sound'
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Volume2 size={15} className={activeTab === 'sound' ? 'text-white' : 'text-pink-500'} />
          <span>聲音 (Sound)</span>
        </button>

        <button
          onClick={() => setActiveTab('storage')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
            activeTab === 'storage'
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <HardDrive size={15} className={activeTab === 'storage' ? 'text-white' : 'text-amber-500'} />
          <span>一般與儲存空間</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
            activeTab === 'about'
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Info size={15} className={activeTab === 'about' ? 'text-white' : 'text-slate-500'} />
          <span>關於這台 Mac (About)</span>
        </button>
      </div>

      {/* Main Settings Panel */}
      <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-slate-900">
        {activeTab === 'appearance' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h2 className="text-base font-bold mb-1">外觀</h2>
              <p className="text-xs text-slate-500">選擇系統的顯示主題與強調色</p>
            </div>

            {/* Light / Dark Mode selector */}
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setIsDarkMode(false)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${
                  !isDarkMode ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-900/20' : 'border-black/10 dark:border-white/10 hover:border-slate-300'
                }`}
              >
                <div className="w-full h-20 rounded-lg bg-slate-100 border border-black/10 flex items-center justify-center text-slate-800 shadow-xs">
                  <Sun size={24} className="text-amber-500" />
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span>淺色外觀</span>
                  {!isDarkMode && <CheckCircle2 size={13} className="text-blue-500" />}
                </div>
              </div>

              <div
                onClick={() => setIsDarkMode(true)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${
                  isDarkMode ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-900/20' : 'border-black/10 dark:border-white/10 hover:border-slate-300'
                }`}
              >
                <div className="w-full h-20 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-white shadow-xs">
                  <Moon size={24} className="text-blue-400" />
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span>深色外觀</span>
                  {isDarkMode && <CheckCircle2 size={13} className="text-blue-500" />}
                </div>
              </div>
            </div>

            {/* Stage Manager toggle */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-black/5 dark:border-white/5 flex items-center justify-between">
              <div>
                <span className="font-semibold block text-xs">幕前調度 (Stage Manager)</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  將目前工作視窗置中，其他應用程式整齊停靠在左側邊緣
                </span>
              </div>
              <input
                type="checkbox"
                checked={stageManager}
                onChange={(e) => setStageManager(e.target.checked)}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === 'wallpaper' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h2 className="text-base font-bold mb-1">桌布設定</h2>
              <p className="text-xs text-slate-500">挑選精美高解析度 Apple 官方風格桌布</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {WALLPAPERS.map((wp) => {
                const isSelected = wallpaper === wp.url;
                return (
                  <div
                    key={wp.id}
                    onClick={() => setWallpaper(wp.url)}
                    className={`rounded-xl overflow-hidden border-2 cursor-pointer transition-all group ${
                      isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-black/10 dark:border-white/10 hover:border-slate-400'
                    }`}
                  >
                    <div className="h-28 w-full overflow-hidden relative">
                      {wp.url.startsWith('linear-gradient') ? (
                        <div style={{ background: wp.url }} className="w-full h-full" />
                      ) : (
                        <img
                          src={wp.url}
                          alt={wp.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
                      <span className="font-medium text-xs truncate">{wp.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{wp.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'displays' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h2 className="text-base font-bold mb-1">顯示器</h2>
              <p className="text-xs text-slate-500">內建 Liquid 視網膜 XDR 顯示器 (16 吋)</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-black/5 dark:border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">螢幕亮度</span>
                <span className="font-mono text-slate-500">{brightness}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-black/5 dark:border-white/5 space-y-2">
              <span className="font-semibold block text-xs">色彩描述檔</span>
              <p className="text-[11px] text-slate-500">Apple Display (P3-1600 nits) · ProMotion 自適應 120Hz 更新率</p>
            </div>
          </div>
        )}

        {activeTab === 'sound' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h2 className="text-base font-bold mb-1">聲音</h2>
              <p className="text-xs text-slate-500">輸出裝置與系統音效控制</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-black/5 dark:border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">主音量</span>
                <span className="font-mono text-slate-500">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-black/5 dark:border-white/5 flex items-center justify-between">
              <div>
                <span className="font-semibold block text-xs">播放使用者介面音效</span>
                <span className="text-[11px] text-slate-500">包含開機啟動音、移動檔案至垃圾桶及螢幕截圖快門音</span>
              </div>
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h2 className="text-base font-bold mb-1">儲存空間</h2>
              <p className="text-xs text-slate-500">1 TB 高速 PCIe 固態硬碟</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-black/5 dark:border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold">Macintosh HD</span>
                <span className="font-mono text-slate-500">688.2 GB 可用 / 1000 GB</span>
              </div>

              {/* Segmented bar */}
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full w-[14%]" title="應用程式 140 GB" />
                <div className="bg-amber-500 h-full w-[8%]" title="照片與媒體 80 GB" />
                <div className="bg-purple-500 h-full w-[6%]" title="文件 60 GB" />
                <div className="bg-emerald-500 h-full w-[4%]" title="macOS 系統 40 GB" />
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>應用程式 (140 GB)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>照片與媒體 (80 GB)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>文件 (60 GB)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>macOS 系統 (40 GB)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-xl space-y-6 text-center py-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-700 mx-auto flex items-center justify-center text-white text-5xl shadow-xl">
              
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">MacBook Pro</h1>
              <p className="text-xs text-slate-500 mt-1">16 吋，2026 年機型</p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-black/5 dark:border-white/5 text-left text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">晶片</span>
                <span className="font-semibold">Apple M4 Max (16核心CPU / 40核心GPU)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">記憶體</span>
                <span className="font-semibold">36 GB 統一記憶體</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">作業系統</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">macOS Sequoia 15.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">序號</span>
                <span className="font-mono font-semibold">C02FX918MD6X</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                macOS 已是最新版本
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
