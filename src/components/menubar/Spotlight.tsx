import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { Search, Calculator, FileText, Folder, AppWindow, ArrowRight, CornerDownLeft } from 'lucide-react';
import { AppId } from '../../types';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: '應用' | '計算' | '檔案' | '系統設定';
  icon: any;
  action: () => void;
}

export const Spotlight: React.FC = () => {
  const {
    isSpotlightOpen,
    setIsSpotlightOpen,
    openApp,
    files,
    notes,
    setIsDarkMode,
    isDarkMode,
    emptyTrash,
    takeScreenshot
  } = useOS();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSpotlightOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isSpotlightOpen]);

  if (!isSpotlightOpen) return null;

  // Evaluate query for Math calculation
  let mathResult: number | null = null;
  if (/^[\d\s+\-*/().%^]+$/.test(query.trim()) && query.trim().length > 1) {
    try {
      // safe eval for math expression
      // eslint-disable-next-line no-new-func
      const res = Function(`'use strict'; return (${query.trim()})`)();
      if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
        mathResult = res;
      }
    } catch {
      mathResult = null;
    }
  }

  const allApps: { id: AppId; name: string; desc: string }[] = [
    { id: 'finder', name: '訪達 (Finder)', desc: '檔案管理與瀏覽' },
    { id: 'safari', name: 'Safari 瀏覽器', desc: '探索網頁世界' },
    { id: 'notes', name: '備忘錄 (Notes)', desc: '記錄靈感與待辦事項' },
    { id: 'terminal', name: '終端機 (Terminal)', desc: 'macOS 命令列環境' },
    { id: 'calculator', name: '計算機 (Calculator)', desc: '基礎與科學計算' },
    { id: 'settings', name: '系統設定 (Settings)', desc: '個人化外觀與桌布' },
    { id: 'photos', name: '照片 (Photos)', desc: '精美相簿與桌布圖庫' },
    { id: 'music', name: '音樂 (Apple Music)', desc: '沉浸式音樂播放' },
    { id: 'messages', name: '訊息 (Messages)', desc: '即時通訊交流' },
    { id: 'maps', name: '地圖 (Maps)', desc: '衛星與城市導航' },
    { id: 'appstore', name: 'App Store', desc: '發現並下載應用程式' },
    { id: 'siri', name: 'Siri 智慧助理', desc: 'Apple Intelligence' },
  ];

  const results: SearchResult[] = [];

  // 1. Math calculation result if valid
  if (mathResult !== null) {
    results.push({
      id: 'math',
      title: `${mathResult}`,
      subtitle: `計算式: ${query.trim()} = ${mathResult}`,
      category: '計算',
      icon: Calculator,
      action: () => {
        navigator.clipboard?.writeText(String(mathResult));
        openApp('calculator');
        setIsSpotlightOpen(false);
      },
    });
  }

  // 2. Apps match
  const filteredApps = allApps.filter((app) =>
    app.name.toLowerCase().includes(query.toLowerCase()) ||
    app.desc.toLowerCase().includes(query.toLowerCase()) ||
    app.id.toLowerCase().includes(query.toLowerCase())
  );

  filteredApps.forEach((app) => {
    results.push({
      id: `app-${app.id}`,
      title: app.name,
      subtitle: app.desc,
      category: '應用',
      icon: AppWindow,
      action: () => {
        openApp(app.id);
        setIsSpotlightOpen(false);
      },
    });
  });

  // 3. Files match
  if (query.trim().length > 0) {
    const matchedFiles = files.filter((f) =>
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      (f.content && f.content.toLowerCase().includes(query.toLowerCase()))
    );

    matchedFiles.slice(0, 4).forEach((file) => {
      results.push({
        id: `file-${file.id}`,
        title: file.name,
        subtitle: file.content ? file.content.slice(0, 45) + '...' : `桌面 ${file.type === 'folder' ? '資料夾' : '檔案'}`,
        category: '檔案',
        icon: file.type === 'folder' ? Folder : FileText,
        action: () => {
          if (file.type === 'folder') {
            openApp('finder');
          } else {
            openApp('notes', { title: file.name, extraState: { content: file.content } });
          }
          setIsSpotlightOpen(false);
        },
      });
    });
  }

  // 4. Quick System Action results
  if ('深色模式'.includes(query) || '淺色模式'.includes(query) || 'dark'.includes(query.toLowerCase())) {
    results.push({
      id: 'toggle-theme',
      title: `切換為${isDarkMode ? '淺色模式' : '深色模式'}`,
      subtitle: '快速切換 macOS 外觀主題',
      category: '系統設定',
      icon: AppWindow,
      action: () => {
        setIsDarkMode(!isDarkMode);
        setIsSpotlightOpen(false);
      },
    });
  }

  if ('截圖'.includes(query) || '截屏'.includes(query) || 'screenshot'.includes(query.toLowerCase())) {
    results.push({
      id: 'take-screenshot',
      title: '拍攝螢幕截圖',
      subtitle: '儲存到桌面',
      category: '系統設定',
      icon: AppWindow,
      action: () => {
        takeScreenshot();
        setIsSpotlightOpen(false);
      },
    });
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0 && results[selectedIndex]) {
        results[selectedIndex].action();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-28 bg-black/25 backdrop-blur-xs"
      onClick={() => setIsSpotlightOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[640px] max-w-[92vw] rounded-2xl mac-glass mac-window-shadow border border-white/30 dark:border-white/10 overflow-hidden shadow-2xl"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 gap-3 border-b border-black/10 dark:border-white/10">
          <Search size={22} className="text-slate-400 dark:text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="聚焦搜尋，鍵入應用、計算式 (如 48*12) 或檔案..."
            className="w-full bg-transparent text-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          <div className="flex items-center gap-1 text-[11px] text-slate-400 px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">
            <span>esc 離開</span>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              未找到與 &quot;{query}&quot; 相關的結果
            </div>
          ) : (
            results.map((res, idx) => {
              const Icon = res.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={res.id}
                  onClick={res.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold truncate leading-tight">
                        {res.title}
                      </span>
                      <span
                        className={`text-xs truncate ${
                          isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {res.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] uppercase font-medium px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'text-slate-400 bg-black/5 dark:bg-white/5'
                      }`}
                    >
                      {res.category}
                    </span>
                    {isSelected && <CornerDownLeft size={13} className="text-white/80" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
