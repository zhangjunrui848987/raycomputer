import React, { useRef, useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { WindowState } from '../../types';
import { X, Minus, Plus } from 'lucide-react';

interface WindowProps {
  win: WindowState;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ win, children }) => {
  const {
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    updateWindowBounds,
    stageManager,
  } = useOS();

  const isActive = activeWindowId === win.id;
  const [trafficLightsHover, setTrafficLightsHover] = useState(false);

  // Dragging state
  const isDraggingRef = useRef(false);
  const dragStartPos = useRef({ mouseX: 0, mouseY: 0, winX: 0, winY: 0 });

  // Resizing state
  const isResizingRef = useRef(false);
  const resizeDirectionRef = useRef<'se' | 's' | 'e'>('se');
  const resizeStartPos = useRef({ mouseX: 0, mouseY: 0, width: 0, height: 0 });

  // Header drag handlers
  const handleTitleMouseDown = (e: React.MouseEvent) => {
    // Only drag with left mouse button and not on buttons
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('.traffic-lights')) return;
    if (win.isMaximized) return; // Don't drag when maximized

    focusWindow(win.id);
    isDraggingRef.current = true;
    dragStartPos.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winX: win.x,
      winY: win.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartPos.current.mouseX;
      const dy = moveEvent.clientY - dragStartPos.current.mouseY;

      // Keep within bounds: at least top >= 30 (menubar height)
      const newX = Math.max(-win.width + 100, Math.min(window.innerWidth - 100, dragStartPos.current.winX + dx));
      const newY = Math.max(30, Math.min(window.innerHeight - 80, dragStartPos.current.winY + dy));

      updateWindowBounds(win.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Resize handler
  const handleResizeMouseDown = (e: React.MouseEvent, direction: 'se' | 's' | 'e') => {
    e.stopPropagation();
    if (win.isMaximized) return;

    focusWindow(win.id);
    isResizingRef.current = true;
    resizeDirectionRef.current = direction;
    resizeStartPos.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: win.width,
      height: win.height,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizingRef.current) return;
      const dx = moveEvent.clientX - resizeStartPos.current.mouseX;
      const dy = moveEvent.clientY - resizeStartPos.current.mouseY;

      const newWidth = Math.max(win.minWidth, resizeStartPos.current.width + dx);
      const newHeight = Math.max(win.minHeight, resizeStartPos.current.height + dy);

      if (resizeDirectionRef.current === 'se') {
        updateWindowBounds(win.id, { width: newWidth, height: newHeight });
      } else if (resizeDirectionRef.current === 'e') {
        updateWindowBounds(win.id, { width: newWidth });
      } else if (resizeDirectionRef.current === 's') {
        updateWindowBounds(win.id, { height: newHeight });
      }
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (win.isMinimized) return null;

  return (
    <div
      onMouseDown={() => focusWindow(win.id)}
      style={{
        transform: `translate3d(${win.x}px, ${win.y}px, 0)`,
        width: `${win.width}px`,
        height: `${win.height}px`,
        zIndex: win.zIndex,
      }}
      className={`absolute top-0 left-0 rounded-xl overflow-hidden flex flex-col mac-window-shadow border border-black/15 dark:border-white/15 transition-shadow duration-150 ${
        isActive ? 'ring-1 ring-black/5 dark:ring-white/10' : 'opacity-95'
      }`}
    >
      {/* Window Title Bar */}
      <div
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={() => maximizeWindow(win.id)}
        className={`h-10 px-4 flex items-center justify-between mac-glass border-b border-black/10 dark:border-white/10 select-none cursor-default shrink-0 ${
          isActive ? 'bg-white/80 dark:bg-slate-900/80' : 'bg-white/50 dark:bg-slate-900/50'
        }`}
      >
        {/* Left: Traffic Lights (🔴 🟡 🟢) */}
        <div
          onMouseEnter={() => setTrafficLightsHover(true)}
          onMouseLeave={() => setTrafficLightsHover(false)}
          className="traffic-lights flex items-center gap-2 group w-20"
        >
          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
            className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center text-[#4C0000] active:brightness-90 transition-transform hover:scale-105"
            title="關閉 (Close)"
          >
            {trafficLightsHover && <X size={8} strokeWidth={3} />}
          </button>

          {/* Minimize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
            className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center text-[#995700] active:brightness-90 transition-transform hover:scale-105"
            title="最小化 (Minimize)"
          >
            {trafficLightsHover && <Minus size={8} strokeWidth={3} />}
          </button>

          {/* Maximize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(win.id);
            }}
            className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center text-[#006500] active:brightness-90 transition-transform hover:scale-105"
            title="縮放 (Zoom / Fullscreen)"
          >
            {trafficLightsHover && <Plus size={8} strokeWidth={3} />}
          </button>
        </div>

        {/* Center: Title */}
        <div className="flex-1 text-center text-xs font-semibold text-slate-800 dark:text-slate-200 truncate px-2">
          {win.title}
        </div>

        {/* Right dummy space to balance traffic lights */}
        <div className="w-20" />
      </div>

      {/* Window Body */}
      <div className="flex-1 bg-white/95 dark:bg-slate-900/95 overflow-hidden flex flex-col relative text-slate-800 dark:text-slate-100">
        {children}
      </div>

      {/* Resize corner and edges handles */}
      {!win.isMaximized && (
        <>
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-30"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
            className="absolute top-10 right-0 bottom-4 w-1.5 cursor-e-resize z-20"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 's')}
            className="absolute bottom-0 left-4 right-4 h-1.5 cursor-s-resize z-20"
          />
        </>
      )}
    </div>
  );
};
