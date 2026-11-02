import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppId, WindowState, FileItem, NoteItem } from '../types';
import { macAudio } from '../utils/audio';
import { WALLPAPERS } from '../utils/wallpaper';

interface OSContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  activeAppId: AppId | 'finder';
  runningAppIds: AppId[];
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  wallpaper: string;
  setWallpaper: (val: string) => void;
  volume: number;
  setVolume: (val: number) => void;
  brightness: number;
  setBrightness: (val: number) => void;
  wifiEnabled: boolean;
  setWifiEnabled: (val: boolean) => void;
  bluetoothEnabled: boolean;
  setBluetoothEnabled: (val: boolean) => void;
  airDropEnabled: boolean;
  setAirDropEnabled: (val: boolean) => void;
  stageManager: boolean;
  setStageManager: (val: boolean) => void;
  dnd: boolean;
  setDnd: (val: boolean) => void;
  soundEffects: boolean;
  setSoundEffects: (val: boolean) => void;
  isLocked: boolean;
  isSleeping: boolean;
  isLaunchpadOpen: boolean;
  setIsLaunchpadOpen: (val: boolean) => void;
  isMissionControlOpen: boolean;
  setIsMissionControlOpen: (val: boolean) => void;
  isSpotlightOpen: boolean;
  setIsSpotlightOpen: (val: boolean) => void;
  isControlCenterOpen: boolean;
  setIsControlCenterOpen: (val: boolean) => void;
  isWidgetsOpen: boolean;
  setIsWidgetsOpen: (val: boolean) => void;
  files: FileItem[];
  notes: NoteItem[];
  trash: FileItem[];
  openApp: (appId: AppId, options?: { extraState?: any; title?: string }) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowBounds: (id: string, bounds: Partial<{ x: number; y: number; width: number; height: number }>) => void;
  createFile: (file: Partial<FileItem>) => void;
  deleteFile: (id: string) => void;
  emptyTrash: () => void;
  saveNote: (note: NoteItem) => void;
  deleteNote: (id: string) => void;
  takeScreenshot: () => void;
  lockSystem: () => void;
  unlockSystem: () => void;
  sleepSystem: () => void;
  wakeSystem: () => void;
  restartSystem: () => void;
  screenshotFlash: boolean;
}

const APP_CONFIGS: Record<AppId, { title: string; width: number; height: number; minW?: number; minH?: number }> = {
  finder: { title: '訪達 (Finder)', width: 880, height: 560, minW: 550, minH: 380 },
  safari: { title: 'Safari 瀏覽器', width: 940, height: 600, minW: 600, minH: 400 },
  notes: { title: '備忘錄', width: 840, height: 540, minW: 500, minH: 360 },
  terminal: { title: '終端機 — zsh', width: 720, height: 460, minW: 460, minH: 300 },
  calculator: { title: '計算機', width: 320, height: 440, minW: 320, minH: 440 },
  settings: { title: '系統設定', width: 880, height: 580, minW: 640, minH: 450 },
  photos: { title: '照片', width: 880, height: 560, minW: 540, minH: 380 },
  music: { title: '音樂', width: 860, height: 560, minW: 560, minH: 400 },
  messages: { title: '訊息', width: 800, height: 520, minW: 520, minH: 360 },
  maps: { title: '地圖', width: 860, height: 560, minW: 560, minH: 400 },
  mail: { title: '郵件', width: 860, height: 540, minW: 560, minH: 380 },
  appstore: { title: 'App Store', width: 900, height: 580, minW: 600, minH: 420 },
  siri: { title: 'Siri', width: 440, height: 540, minW: 360, minH: 420 },
  trash: { title: '垃圾桶', width: 720, height: 480, minW: 480, minH: 340 },
};

const INITIAL_FILES: FileItem[] = [
  {
    id: 'f1',
    name: 'Macintosh HD',
    type: 'folder',
    parentId: 'desktop',
    updatedAt: '2026-11-02',
    icon: 'hard-drive',
  },
  {
    id: 'f2',
    name: '歡迎使用 macOS.md',
    type: 'file',
    parentId: 'desktop',
    content: `# 歡迎使用網頁版 macOS Sequoia 🍎\n\n這是一個高保真的蘋果電腦線上桌面作業系統。\n\n### 特色亮點一覽：\n- **Dock 欄**：支援物理放大與運作指示器\n- **訪達 (Finder)**：多層級目錄、檔案新增與拖曳刪除\n- **Safari 瀏覽器**：多標籤頁與真實模擬瀏覽\n- **終端機 (Terminal)**：支援 ls, cat, python, cowsay, neofetch\n- **備忘錄 (Notes)**：Markdown 與清單記錄，資料自動本機儲存\n- **Siri / 智慧助理**：內建 AI 智慧問答與自然語言指令\n- **控制中心**：Wi-Fi、藍牙、幕前調度、聲音與顯示器亮度調節\n- **系統設定**：自由切換 Apple 官方高畫質動態桌布與深淺色模式！`,
    size: '1.2 KB',
    updatedAt: '2026-11-02',
    icon: 'file-text',
  },
  {
    id: 'f3',
    name: '專案文件',
    type: 'folder',
    parentId: 'desktop',
    updatedAt: '2026-11-02',
    icon: 'folder',
  },
  {
    id: 'f4',
    name: 'Sequoia 4K超高畫質桌布.jpg',
    type: 'image',
    parentId: 'desktop',
    imageSrc: '/src/assets/images/macos_sequoia_wallpaper_1793607566170.jpg',
    size: '4.8 MB',
    updatedAt: '2026-11-02',
    icon: 'image',
  },
];

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'n1',
    folderId: 'notes',
    title: '今日待辦事項',
    content: '1. 測試線上蘋果電腦系統所有視窗功能 ✅\n2. 體驗幕前調度 (Stage Manager) 與聚焦搜尋\n3. 在系統設定中嘗試 Sequoia 與 Sonoma 桌布\n4. 嘗試在終端機執行 neofetch 與 python',
    updatedAt: '今天 09:30',
    isPinned: true,
  },
  {
    id: 'n2',
    folderId: 'notes',
    title: '靈感便籤',
    content: '設計如同思考的藝術，極致的細節與流暢的互動帶給人們愉悅的數位體驗。',
    updatedAt: '昨天 18:24',
  },
  {
    id: 'n3',
    folderId: 'work',
    title: '架構設計筆記',
    content: '前端使用 React 19 + Tailwind CSS，搭配 Web Audio 物理聲學引擎與全螢幕多視窗管理員。',
    updatedAt: '2026-10-28',
  }
];

const OSContext = createContext<OSContextType | undefined>(undefined);

export const OSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(10);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('mac_dark') === 'true';
  });
  const [wallpaper, setWallpaper] = useState<string>(() => {
    return localStorage.getItem('mac_wallpaper') || WALLPAPERS[0].url;
  });
  const [volume, setVolume] = useState<number>(75);
  const [brightness, setBrightness] = useState<number>(100);
  const [wifiEnabled, setWifiEnabled] = useState<boolean>(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState<boolean>(true);
  const [airDropEnabled, setAirDropEnabled] = useState<boolean>(true);
  const [stageManager, setStageManager] = useState<boolean>(false);
  const [dnd, setDnd] = useState<boolean>(false);
  const [soundEffects, setSoundEffects] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isSleeping, setIsSleeping] = useState<boolean>(false);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState<boolean>(false);
  const [isMissionControlOpen, setIsMissionControlOpen] = useState<boolean>(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState<boolean>(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState<boolean>(false);
  const [isWidgetsOpen, setIsWidgetsOpen] = useState<boolean>(false);
  const [screenshotFlash, setScreenshotFlash] = useState<boolean>(false);

  // File system and Notes state with localStorage persistence
  const [files, setFiles] = useState<FileItem[]>(() => {
    const saved = localStorage.getItem('mac_files');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('mac_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [trash, setTrash] = useState<FileItem[]>(() => {
    const saved = localStorage.getItem('mac_trash');
    return saved ? JSON.parse(saved) : [];
  });

  // Keep dark class synced
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mac_dark', String(isDarkMode));
  }, [isDarkMode]);

  // Sync wallpaper
  useEffect(() => {
    localStorage.setItem('mac_wallpaper', wallpaper);
  }, [wallpaper]);

  // Sync files and notes
  useEffect(() => {
    localStorage.setItem('mac_files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('mac_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('mac_trash', JSON.stringify(trash));
  }, [trash]);

  // Audio enable sync
  useEffect(() => {
    macAudio.enabled = soundEffects;
  }, [soundEffects]);

  // Compute active app and running apps
  const activeWindow = windows.find((w) => w.id === activeWindowId && !w.isMinimized);
  const activeAppId: AppId | 'finder' = activeWindow ? activeWindow.appId : 'finder';
  const runningAppIds = Array.from(new Set(windows.map((w) => w.appId)));

  // Open App logic
  const openApp = (appId: AppId, options?: { extraState?: any; title?: string }) => {
    macAudio.playClick();
    setIsLaunchpadOpen(false);

    // If already exists and minimized, restore it
    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      if (existing.isMinimized) {
        setWindows((prev) =>
          prev.map((w) => (w.id === existing.id ? { ...w, isMinimized: false, zIndex: zIndexCounter + 1 } : w))
        );
      }
      setZIndexCounter((z) => z + 1);
      setActiveWindowId(existing.id);
      return;
    }

    const cfg = APP_CONFIGS[appId] || { title: appId, width: 800, height: 500 };
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Center with slight cascade offset based on existing windows
    const offset = (windows.length % 6) * 26;
    const initialX = Math.max(40, Math.floor((screenW - cfg.width) / 2) + offset);
    const initialY = Math.max(50, Math.floor((screenH - cfg.height) / 2 - 20) + offset);

    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      title: options?.title || cfg.title,
      x: initialX,
      y: initialY,
      width: cfg.width,
      height: cfg.height,
      minWidth: cfg.minW || 400,
      minHeight: cfg.minH || 300,
      isMinimized: false,
      isMaximized: false,
      zIndex: zIndexCounter + 1,
      extraState: options?.extraState,
    };

    setZIndexCounter((z) => z + 1);
    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
  };

  const closeWindow = (id: string) => {
    macAudio.playClick();
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id && !w.isMinimized);
      if (remaining.length > 0) {
        const topWindow = remaining.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), remaining[0]);
        setActiveWindowId(topWindow.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const minimizeWindow = (id: string) => {
    macAudio.playClick();
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id && !w.isMinimized);
      if (remaining.length > 0) {
        const top = remaining.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), remaining[0]);
        setActiveWindowId(top.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const maximizeWindow = (id: string) => {
    macAudio.playClick();
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          // Restore previous
          return {
            ...w,
            isMaximized: false,
            x: w.prevBounds?.x ?? 80,
            y: w.prevBounds?.y ?? 80,
            width: w.prevBounds?.width ?? 800,
            height: w.prevBounds?.height ?? 500,
          };
        } else {
          // Maximize below menubar and above dock
          return {
            ...w,
            isMaximized: true,
            prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
            x: 0,
            y: 32,
            width: screenW,
            height: screenH - 32 - 76,
          };
        }
      })
    );
  };

  const focusWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: zIndexCounter + 1, isMinimized: false } : w))
    );
    setZIndexCounter((z) => z + 1);
    setActiveWindowId(id);
  };

  const updateWindowBounds = (
    id: string,
    bounds: Partial<{ x: number; y: number; width: number; height: number }>
  ) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...bounds, isMaximized: false } : w))
    );
  };

  const createFile = (fileData: Partial<FileItem>) => {
    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      name: fileData.name || '未命名資料夾',
      type: fileData.type || 'folder',
      parentId: fileData.parentId || 'desktop',
      updatedAt: new Date().toISOString().split('T')[0],
      size: fileData.size || '--',
      content: fileData.content || '',
      icon: fileData.icon || (fileData.type === 'folder' ? 'folder' : 'file-text'),
    };
    setFiles((prev) => [...prev, newFile]);
    macAudio.playClick();
  };

  const deleteFile = (id: string) => {
    const item = files.find((f) => f.id === id);
    if (!item) return;
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setTrash((prev) => [...prev, item]);
    macAudio.playTrash();
  };

  const emptyTrash = () => {
    setTrash([]);
    macAudio.playTrash();
  };

  const saveNote = (updatedNote: NoteItem) => {
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === updatedNote.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedNote;
        return copy;
      }
      return [updatedNote, ...prev];
    });
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    macAudio.playClick();
  };

  const takeScreenshot = () => {
    macAudio.playScreenshot();
    setScreenshotFlash(true);
    setTimeout(() => setScreenshotFlash(false), 240);

    // Add screenshot file to desktop
    const stamp = new Date().toTimeString().split(' ')[0].replace(/:/g, '.');
    const screenshotName = `螢幕截圖 ${new Date().toISOString().split('T')[0]} ${stamp}.jpg`;
    createFile({
      name: screenshotName,
      type: 'image',
      parentId: 'desktop',
      imageSrc: '/src/assets/images/macos_sequoia_wallpaper_1793607566170.jpg',
      size: '3.4 MB',
      icon: 'image',
    });
  };

  const lockSystem = () => {
    macAudio.playClick();
    setIsLocked(true);
    setIsSleeping(false);
  };

  const unlockSystem = () => {
    macAudio.playClick();
    setIsLocked(false);
    setIsSleeping(false);
  };

  const sleepSystem = () => {
    setIsSleeping(true);
  };

  const wakeSystem = () => {
    setIsSleeping(false);
    macAudio.playStartupChime();
  };

  const restartSystem = () => {
    setWindows([]);
    setIsSleeping(true);
    setTimeout(() => {
      setIsSleeping(false);
      macAudio.playStartupChime();
    }, 1200);
  };

  // Keyboard shortcut for Spotlight (Cmd+Space, Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.code === 'Space' || e.key === 'k')) {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSpotlightOpen(false);
        setIsControlCenterOpen(false);
        setIsWidgetsOpen(false);
        setIsLaunchpadOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial boot: open Finder and Notes or Welcome window
  useEffect(() => {
    if (windows.length === 0) {
      openApp('finder');
    }
  }, []);

  return (
    <OSContext.Provider
      value={{
        windows,
        activeWindowId,
        activeAppId,
        runningAppIds,
        isDarkMode,
        setIsDarkMode,
        wallpaper,
        setWallpaper,
        volume,
        setVolume,
        brightness,
        setBrightness,
        wifiEnabled,
        setWifiEnabled,
        bluetoothEnabled,
        setBluetoothEnabled,
        airDropEnabled,
        setAirDropEnabled,
        stageManager,
        setStageManager,
        dnd,
        setDnd,
        soundEffects,
        setSoundEffects,
        isLocked,
        isSleeping,
        isLaunchpadOpen,
        setIsLaunchpadOpen,
        isMissionControlOpen,
        setIsMissionControlOpen,
        isSpotlightOpen,
        setIsSpotlightOpen,
        isControlCenterOpen,
        setIsControlCenterOpen,
        isWidgetsOpen,
        setIsWidgetsOpen,
        files,
        notes,
        trash,
        openApp,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        updateWindowBounds,
        createFile,
        deleteFile,
        emptyTrash,
        saveNote,
        deleteNote,
        takeScreenshot,
        lockSystem,
        unlockSystem,
        sleepSystem,
        wakeSystem,
        restartSystem,
        screenshotFlash,
      }}
    >
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
};
