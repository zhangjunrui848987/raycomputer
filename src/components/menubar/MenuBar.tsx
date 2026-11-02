import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { 
  Wifi, 
  WifiOff, 
  BatteryMedium, 
  Search, 
  SlidersHorizontal, 
  Sparkles,
  Command,
  Moon,
  Sun,
  Camera
} from 'lucide-react';
import { ControlCenter } from './ControlCenter';
import { Spotlight } from './Spotlight';
import { WidgetsDrawer } from './WidgetsDrawer';

export const MenuBar: React.FC = () => {
  const {
    activeAppId,
    activeWindowId,
    windows,
    openApp,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    emptyTrash,
    createFile,
    takeScreenshot,
    lockSystem,
    sleepSystem,
    restartSystem,
    isDarkMode,
    setIsDarkMode,
    wifiEnabled,
    isControlCenterOpen,
    setIsControlCenterOpen,
    isSpotlightOpen,
    setIsSpotlightOpen,
    isWidgetsOpen,
    setIsWidgetsOpen,
  } = useOS();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const day = days[now.getDay()];
      const m = now.getMonth() + 1;
      const d = now.getDate();
      const h = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');

      setDateStr(`${day} ${m}月${d}日`);
      setTimeStr(`${h}:${min}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Get localized app name
  const getAppDisplayName = () => {
    switch (activeAppId) {
      case 'finder': return '訪達';
      case 'safari': return 'Safari 瀏覽器';
      case 'terminal': return '終端機';
      case 'notes': return '備忘錄';
      case 'calculator': return '計算機';
      case 'settings': return '系統設定';
      case 'photos': return '照片';
      case 'music': return '音樂';
      case 'messages': return '訊息';
      case 'maps': return '地圖';
      case 'appstore': return 'App Store';
      case 'siri': return 'Siri';
      case 'trash': return '垃圾桶';
      default: return '訪達';
    }
  };

  const handleAppleMenu = (action: string) => {
    setActiveMenu(null);
    switch (action) {
      case 'about':
        openApp('settings', { extraState: { tab: 'about' } });
        break;
      case 'settings':
        openApp('settings');
        break;
      case 'appstore':
        openApp('appstore');
        break;
      case 'sleep':
        sleepSystem();
        break;
      case 'restart':
        restartSystem();
        break;
      case 'lock':
        lockSystem();
        break;
    }
  };

  const handleAction = (cb: () => void) => {
    setActiveMenu(null);
    cb();
  };

  return (
    <header 
      ref={menuRef}
      className="fixed top-0 left-0 right-0 h-7 z-50 mac-glass border-b border-black/10 dark:border-white/10 px-3.5 flex items-center justify-between text-xs text-slate-800 dark:text-slate-100 select-none shadow-xs font-medium"
    >
      {/* Left Menu Items */}
      <div className="flex items-center gap-4">
        {/* Apple  Logo */}
        <div className="relative">
          <button
            onClick={() => setActiveMenu(activeMenu === 'apple' ? null : 'apple')}
            className={`px-1.5 py-0.5 rounded transition-colors text-sm ${
              activeMenu === 'apple' ? 'bg-black/10 dark:bg-white/20' : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            
          </button>

          {activeMenu === 'apple' && (
            <div className="absolute left-0 top-7 w-56 rounded-xl p-1.5 mac-glass mac-window-shadow border border-white/20 dark:border-white/10 flex flex-col gap-0.5 z-50 text-slate-800 dark:text-slate-200 shadow-xl">
              <button
                onClick={() => handleAppleMenu('about')}
                className="w-full text-left px-2.5 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition-colors"
              >
                關於這台 Mac (About This Mac)
              </button>
              <div className="h-px bg-black/10 dark:bg-white/10 my-1" />
              <button
                onClick={() => handleAppleMenu('settings')}
                className="w-full text-left px-2.5 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition-colors flex justify-between"
              >
                <span>系統設定...</span>
                <span className="opacity-50 text-[10px]">⌘,</span>
              </button>
              <button
                onClick={() => handleAppleMenu('appstore')}
                className="w-full text-left px-2.5 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition-colors"
              >
                App Store...
              </button>
              <div className="h-px bg-black/10 dark:bg-white/10 my-1" />
              <button
                onClick={() => handleAppleMenu('sleep')}
                className="w-full text-left px-2.5 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition-colors"
              >
                睡眠
              </button>
              <button
                onClick={() => handleAppleMenu('restart')}
                className="w-full text-left px-2.5 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition-colors"
              >
                重新開機...
              </button>
              <div className="h-px bg-black/10 dark:bg-white/10 my-1" />
              <button
                onClick={() => handleAppleMenu('lock')}
                className="w-full text-left px-2.5 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition-colors flex justify-between"
              >
                <span>鎖定螢幕</span>
                <span className="opacity-50 text-[10px]">⌃⌘Q</span>
              </button>
            </div>
          )}
        </div>

        {/* Active Application Name */}
        <span className="font-semibold text-slate-900 dark:text-white cursor-default">
          {getAppDisplayName()}
        </span>

        {/* Dynamic Menu Dropdowns */}
        {/* File Menu */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
            className={`px-2 py-0.5 rounded transition-colors ${
              activeMenu === 'file' ? 'bg-black/10 dark:bg-white/20' : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            檔案
          </button>
          {activeMenu === 'file' && (
            <div className="absolute left-0 top-7 w-52 rounded-xl p-1.5 mac-glass mac-window-shadow border border-white/20 dark:border-white/10 flex flex-col gap-0.5 z-50 text-slate-800 dark:text-slate-200 shadow-xl">
              <button
                onClick={() => handleAction(() => createFile({ name: '未命名資料夾', type: 'folder' }))}
                className="w-full text-left px-2.5 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition-colors flex justify-between"
              >
                <span>新增資料夾</span>
                <span className="opacity-50 text-[10px]">⇧⌘N</span>
              </button>
              <button
                onClick={() => handleAction(() => openApp('notes'))}
                className="w-full text-left px-2.5 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition-colors flex justify-between"
              >
                <span>新增便籤</span>
                <span className="opacity-50 text-[10px]">⌘N</span>
              </button>
              <button
                onClick={() => handleAction(takeScreenshot)}
                className="w-full text-left px-2.5 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition-colors flex justify-between"
              >
                <span>拍攝螢幕截圖</span>
                <span className="opacity-50 text-[10px]">⇧⌘3</span>
              </button>
              <div className="h-px bg-black/10 dark:bg-white/10 my-1" />
              <button
                onClick={() => handleAction(() => {
                  if (activeWindowId) closeWindow(activeWindowId);
                })}
                className="w-full text-left px-2.5 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition-colors flex justify-between"
              >
                <span>關閉視窗</span>
                <span className="opacity-50 text-[10px]">⌘W</span>
              </button>
            </div>
          )}
        </div>

        {/* Edit Menu */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
            className={`px-2 py-0.5 rounded transition-colors ${
              activeMenu === 'edit' ? 'bg-black/10 dark:bg-white/20' : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            編輯
          </button>
          {activeMenu === 'edit' && (
            <div className="absolute left-0 top-7 w-48 rounded-xl p-1.5 mac-glass mac-window-shadow border border-white/20 dark:border-white/10 flex flex-col gap-0.5 z-50 text-slate-800 dark:text-slate-200 shadow-xl">
              <button
                onClick={() => handleAction(emptyTrash)}
                className="w-full text-left px-2.5 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition-colors"
              >
                清空垃圾桶...
              </button>
            </div>
          )}
        </div>

        {/* Window Menu */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => setActiveMenu(activeMenu === 'window' ? null : 'window')}
            className={`px-2 py-0.5 rounded transition-colors ${
              activeMenu === 'window' ? 'bg-black/10 dark:bg-white/20' : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            視窗
          </button>
          {activeMenu === 'window' && (
            <div className="absolute left-0 top-7 w-52 rounded-xl p-1.5 mac-glass mac-window-shadow border border-white/20 dark:border-white/10 flex flex-col gap-0.5 z-50 text-slate-800 dark:text-slate-200 shadow-xl">
              <button
                onClick={() => handleAction(() => {
                  if (activeWindowId) minimizeWindow(activeWindowId);
                })}
                className="w-full text-left px-2.5 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition-colors flex justify-between"
              >
                <span>最小化</span>
                <span className="opacity-50 text-[10px]">⌘M</span>
              </button>
              <button
                onClick={() => handleAction(() => {
                  if (activeWindowId) maximizeWindow(activeWindowId);
                })}
                className="w-full text-left px-2.5 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition-colors flex justify-between"
              >
                <span>縮放全螢幕</span>
                <span className="opacity-50 text-[10px]">⌃⌘F</span>
              </button>
              <div className="h-px bg-black/10 dark:bg-white/10 my-1" />
              <button
                onClick={() => handleAction(() => {
                  windows.forEach((w) => minimizeWindow(w.id));
                })}
                className="w-full text-left px-2.5 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition-colors"
              >
                最小化全部視窗
              </button>
            </div>
          )}
        </div>

        {/* Help Menu */}
        <div className="relative hidden xl:block">
          <button
            onClick={() => handleAction(() => openApp('siri'))}
            className="px-2 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            輔助說明
          </button>
        </div>
      </div>

      {/* Right Status Zone */}
      <div className="flex items-center gap-3">
        {/* Quick Screenshot action */}
        <button
          onClick={takeScreenshot}
          title="拍攝螢幕截圖"
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <Camera size={14} />
        </button>

        {/* Wi-Fi */}
        <button
          onClick={() => setIsControlCenterOpen(!isControlCenterOpen)}
          title="Wi-Fi 無線網路"
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          {wifiEnabled ? <Wifi size={14} /> : <WifiOff size={14} className="opacity-50" />}
        </button>

        {/* Battery */}
        <div className="flex items-center gap-1 cursor-default" title="電池電量: 98% 已接通電源">
          <span className="text-[11px] font-mono tabular-nums">98%</span>
          <BatteryMedium size={16} className="text-emerald-600 dark:text-emerald-400" />
        </div>

        {/* Siri / Apple Intelligence Icon */}
        <button
          onClick={() => openApp('siri')}
          title="Siri / Apple Intelligence 智慧助理"
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors relative group"
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 flex items-center justify-center p-[1px] shadow-xs">
            <Sparkles size={10} className="text-white" />
          </div>
        </button>

        {/* Spotlight Search Icon */}
        <button
          onClick={() => setIsSpotlightOpen(!isSpotlightOpen)}
          title="聚焦搜尋 (Cmd+Space)"
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <Search size={14} />
        </button>

        {/* Control Center Toggle */}
        <button
          onClick={() => setIsControlCenterOpen(!isControlCenterOpen)}
          title="控制中心"
          className={`p-1 rounded transition-colors ${
            isControlCenterOpen ? 'bg-black/15 dark:bg-white/20' : 'hover:bg-black/10 dark:hover:bg-white/10'
          }`}
        >
          <SlidersHorizontal size={14} />
        </button>

        {/* Date and Time */}
        <button
          onClick={() => setIsWidgetsOpen(!isWidgetsOpen)}
          title="通知中心與小工具"
          className={`px-1.5 py-0.5 rounded transition-colors flex items-center gap-1.5 font-medium ${
            isWidgetsOpen ? 'bg-black/15 dark:bg-white/20' : 'hover:bg-black/10 dark:hover:bg-white/10'
          }`}
        >
          <span className="hidden sm:inline text-[11px]">{dateStr}</span>
          <span className="font-mono text-xs tabular-nums">{timeStr}</span>
        </button>
      </div>

      {/* Popovers */}
      {isControlCenterOpen && <ControlCenter />}
      <Spotlight />
      <WidgetsDrawer />
    </header>
  );
};
