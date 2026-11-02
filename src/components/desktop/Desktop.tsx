import React, { useState, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { DesktopIcon } from './DesktopIcon';
import { FileItem } from '../../types';
import { FolderPlus, Image as ImageIcon, Sparkles, Info, RefreshCw, LayoutGrid } from 'lucide-react';

export const Desktop: React.FC = () => {
  const {
    files,
    openApp,
    createFile,
    wallpaper,
    brightness,
    stageManager,
    windows,
    activeWindowId,
    focusWindow,
    screenshotFlash,
  } = useOS();

  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Marquee selection
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  const desktopRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('.desktop-icon') || (e.target as HTMLElement).closest('.mac-glass')) {
      return;
    }
    setContextMenu(null);
    setSelectedFileId(null);

    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setSelectionBox({
        startX,
        startY,
        currentX: moveEvent.clientX,
        currentY: moveEvent.clientY,
      });
    };

    const handleMouseUp = () => {
      setSelectionBox(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleFileDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      openApp('finder');
    } else if (file.type === 'image') {
      openApp('photos');
    } else {
      openApp('notes', { title: file.name, extraState: { content: file.content } });
    }
  };

  // Only desktop files
  const desktopFiles = files.filter((f) => f.parentId === 'desktop');

  // Compute Stage Manager background apps
  const backgroundWindows = stageManager
    ? windows.filter((w) => w.id !== activeWindowId && !w.isMinimized)
    : [];

  return (
    <div
      ref={desktopRef}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      style={{
        filter: `brightness(${brightness}%)`,
      }}
      className="fixed inset-0 select-none overflow-hidden transition-[filter] duration-200"
    >
      {/* Wallpaper Layer */}
      <div className="absolute inset-0 z-0">
        {wallpaper.startsWith('linear-gradient') ? (
          <div style={{ background: wallpaper }} className="w-full h-full" />
        ) : (
          <img
            src={wallpaper}
            alt="macOS Wallpaper"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Screenshot Flash animation overlay */}
      {screenshotFlash && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-out fade-out duration-300" />
      )}

      {/* Desktop Icons Column (Right-aligned like classic macOS) */}
      <div className="absolute top-10 right-4 flex flex-col gap-3 z-10">
        {desktopFiles.map((file) => (
          <div key={file.id} className="desktop-icon">
            <DesktopIcon
              file={file}
              isSelected={selectedFileId === file.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFileId(file.id);
                setContextMenu(null);
              }}
              onDoubleClick={() => handleFileDoubleClick(file)}
            />
          </div>
        ))}
      </div>

      {/* Stage Manager Left App Thumbnails (if enabled) */}
      {stageManager && backgroundWindows.length > 0 && (
        <div className="absolute left-2 top-14 bottom-24 flex flex-col gap-3 z-20 pointer-events-auto">
          {backgroundWindows.map((win) => (
            <div
              key={win.id}
              onClick={() => focusWindow(win.id)}
              className="w-24 h-16 rounded-xl mac-glass p-1 border border-white/30 dark:border-white/10 shadow-lg cursor-pointer hover:scale-105 hover:border-blue-400 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-semibold truncate ml-1 opacity-70 group-hover:opacity-100">
                  {win.title.split(' ')[0]}
                </span>
              </div>
              <div className="h-8 bg-black/10 dark:bg-white/10 rounded flex items-center justify-center text-[10px] opacity-60">
                {win.appId}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drag Selection Box */}
      {selectionBox && (
        <div
          style={{
            left: `${Math.min(selectionBox.startX, selectionBox.currentX)}px`,
            top: `${Math.min(selectionBox.startY, selectionBox.currentY)}px`,
            width: `${Math.abs(selectionBox.currentX - selectionBox.startX)}px`,
            height: `${Math.abs(selectionBox.currentY - selectionBox.startY)}px`,
          }}
          className="absolute border border-blue-500 bg-blue-500/20 rounded-xs pointer-events-none z-30"
        />
      )}

      {/* Desktop Context Menu */}
      {contextMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            left: `${Math.min(window.innerWidth - 200, contextMenu.x)}px`,
            top: `${Math.min(window.innerHeight - 200, contextMenu.y)}px`,
          }}
          className="fixed w-48 rounded-xl p-1.5 mac-glass mac-window-shadow border border-white/20 dark:border-white/10 flex flex-col gap-0.5 z-50 text-slate-800 dark:text-slate-200 text-xs shadow-2xl"
        >
          <button
            onClick={() => {
              createFile({ name: '新增資料夾', type: 'folder' });
              setContextMenu(null);
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
          >
            <FolderPlus size={14} /> 新增資料夾
          </button>
          <button
            onClick={() => {
              openApp('notes');
              setContextMenu(null);
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
          >
            <Sparkles size={14} /> 新增備忘錄
          </button>
          <div className="h-px bg-black/10 dark:bg-white/10 my-1" />
          <button
            onClick={() => {
              openApp('settings', { extraState: { tab: 'wallpaper' } });
              setContextMenu(null);
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
          >
            <ImageIcon size={14} /> 更改背景圖片...
          </button>
          <button
            onClick={() => {
              openApp('settings', { extraState: { tab: 'about' } });
              setContextMenu(null);
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
          >
            <Info size={14} /> 關於這台 Mac
          </button>
        </div>
      )}
    </div>
  );
};
