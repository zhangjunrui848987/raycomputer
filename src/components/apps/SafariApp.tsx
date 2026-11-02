import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  ShieldCheck, 
  Lock, 
  Share, 
  Plus, 
  X, 
  Search, 
  Compass, 
  ExternalLink,
  Laptop,
  Cpu,
  Sparkles,
  Mic,
  Camera,
  Globe,
  Grid,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Bookmark,
  Shield,
  Zap,
  Copy,
  Check
} from 'lucide-react';

interface Tab {
  id: string;
  title: string;
  url: string;
  history: string[];
  historyIndex: number;
}

interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
}

export const SafariApp: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { 
      id: '1', 
      title: 'Google 搜尋', 
      url: 'https://www.google.com',
      history: ['https://www.google.com'],
      historyIndex: 0
    },
    { 
      id: '2', 
      title: '維基百科 (Wikipedia)', 
      url: 'https://zh.wikipedia.org',
      history: ['https://zh.wikipedia.org'],
      historyIndex: 0
    },
    { 
      id: '3', 
      title: 'macOS Sequoia 概觀', 
      url: 'https://www.apple.com/tw/macos/sequoia',
      history: ['https://www.apple.com/tw/macos/sequoia'],
      historyIndex: 0
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('1');
  const [inputUrl, setInputUrl] = useState('https://www.google.com');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Proxy rendering mode: 'proxy' (Universal Proxy bypassing X-Frame restrictions) vs 'direct'
  const [proxyMode, setProxyMode] = useState<'proxy' | 'direct'>('proxy');

  // Google Search Engine states
  const [googleQuery, setGoogleQuery] = useState('');
  const [isSearchingGoogle, setIsSearchingGoogle] = useState(false);
  const [googleResults, setGoogleResults] = useState<{
    query: string;
    summary: string;
    results: SearchResultItem[];
    searchQueries?: string[];
  } | null>(null);

  // Connection mode for Google: 'live-search' vs 'iframe-embed'
  const [googleViewMode, setGoogleViewMode] = useState<'live-search' | 'iframe-embed'>('live-search');

  // Apps matrix popup
  const [showGoogleApps, setShowGoogleApps] = useState(false);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync address input when active tab changes
  useEffect(() => {
    setInputUrl(activeTab.url);
  }, [activeTabId]);

  // Listen to postMessage from proxy iframe when links are clicked inside it
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'safari-navigate' && e.data.url) {
        handleNavigate(e.data.url);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeTabId]);

  const handleNavigate = (newUrl: string, title?: string) => {
    setIsLoading(true);
    let normalized = newUrl.trim();
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      if (normalized.includes('.') && !normalized.includes(' ')) {
        normalized = 'https://' + normalized;
      } else {
        normalized = `https://www.google.com/search?q=${encodeURIComponent(normalized)}`;
      }
    }

    setInputUrl(normalized);

    // If navigating to google or search
    if (normalized.includes('google.com/search?q=')) {
      const q = decodeURIComponent(normalized.split('q=')[1]?.split('&')[0] || '');
      if (q) {
        setGoogleQuery(q);
        executeRealGoogleSearch(q);
      }
    }

    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === activeTabId) {
          const nextHistory = t.history.slice(0, t.historyIndex + 1);
          nextHistory.push(normalized);
          return {
            ...t,
            url: normalized,
            title: title || formatTabTitle(normalized),
            history: nextHistory,
            historyIndex: nextHistory.length - 1,
          };
        }
        return t;
      })
    );

    setTimeout(() => setIsLoading(false), 300);
  };

  const handleGoBack = () => {
    if (activeTab.historyIndex > 0) {
      const prevUrl = activeTab.history[activeTab.historyIndex - 1];
      setInputUrl(prevUrl);
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, url: prevUrl, historyIndex: t.historyIndex - 1, title: formatTabTitle(prevUrl) }
            : t
        )
      );
    }
  };

  const handleGoForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const nextUrl = activeTab.history[activeTab.historyIndex + 1];
      setInputUrl(nextUrl);
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, url: nextUrl, historyIndex: t.historyIndex + 1, title: formatTabTitle(nextUrl) }
            : t
        )
      );
    }
  };

  const formatTabTitle = (url: string) => {
    if (url.includes('google.com')) return 'Google 搜尋';
    if (url.includes('apple.com')) return 'Apple 官方網站';
    if (url.includes('github.com')) return 'GitHub: 程式碼託管平台';
    if (url.includes('wikipedia.org')) return '維基百科 (Wikipedia)';
    if (url.includes('news.ycombinator.com')) return 'Hacker News';
    try {
      const u = new URL(url);
      return u.hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    let targetUrl = inputUrl.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      if (targetUrl.includes('.') && !targetUrl.includes(' ')) {
        targetUrl = 'https://' + targetUrl;
        handleNavigate(targetUrl);
      } else {
        // Direct Google search query
        setGoogleQuery(targetUrl);
        handleNavigate(`https://www.google.com/search?q=${encodeURIComponent(targetUrl)}`, `${targetUrl} - Google 搜尋`);
        executeRealGoogleSearch(targetUrl);
      }
    } else {
      handleNavigate(targetUrl);
    }
  };

  const executeRealGoogleSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsSearchingGoogle(true);
    setGoogleResults(null);

    try {
      const res = await fetch('/api/google-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText.trim() }),
      });
      const data = await res.json();
      setGoogleResults(data);
    } catch (err) {
      console.error('Failed to search google:', err);
      setGoogleResults({
        query: queryText,
        summary: `已為您檢索「${queryText}」，可點擊下方直接開啟。`,
        results: [
          {
            title: `${queryText} - Google 搜尋`,
            url: `https://www.google.com/search?q=${encodeURIComponent(queryText)}`,
            snippet: `前往 Google 查看關於「${queryText}」的即時搜尋結果與更多資訊。`,
          },
        ],
      });
    } finally {
      setIsSearchingGoogle(false);
    }
  };

  const addTab = () => {
    const newId = String(Date.now());
    const newTab: Tab = {
      id: newId,
      title: 'Google 搜尋',
      url: 'https://www.google.com',
      history: ['https://www.google.com'],
      historyIndex: 0,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
    setInputUrl('https://www.google.com');
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const nextTabs = tabs.filter((t) => t.id !== id);
    setTabs(nextTabs);
    if (activeTabId === id) {
      setActiveTabId(nextTabs[0].id);
      setInputUrl(nextTabs[0].url);
    }
  };

  const copyCurrentUrl = () => {
    navigator.clipboard.writeText(activeTab.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isGooglePage = 
    activeTab.url === 'https://www.google.com' ||
    activeTab.url === 'https://www.google.com/' ||
    activeTab.url.startsWith('https://www.google.com/webhp') ||
    activeTab.url.startsWith('https://www.google.com/search');
  const isAppleShowcase = activeTab.url.includes('apple.com/tw/macos/sequoia');

  // Compute final iframe source for arbitrary websites
  const getIframeSrc = () => {
    if (proxyMode === 'proxy') {
      return `/api/proxy?url=${encodeURIComponent(activeTab.url)}`;
    }
    return activeTab.url;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 select-none">
      {/* Top Bar with Tabs */}
      <div className="flex items-center px-2 pt-1 gap-1 border-b border-black/10 dark:border-white/10 bg-slate-200/80 dark:bg-slate-800/80 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isGoogleTab = tab.url.includes('google.com');
          return (
            <div
              key={tab.id}
              onClick={() => {
                setActiveTabId(tab.id);
                setInputUrl(tab.url);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs cursor-pointer max-w-[200px] min-w-[130px] transition-all group ${
                isActive
                  ? 'bg-white dark:bg-slate-900 font-medium text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {isGoogleTab ? (
                <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center font-bold text-[10px] text-blue-600 shadow-xs shrink-0">
                  G
                </div>
              ) : (
                <Compass size={13} className={isActive ? 'text-blue-500 shrink-0' : 'text-slate-400 shrink-0'} />
              )}
              <span className="truncate flex-1">{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => closeTab(e, tab.id)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 rounded p-0.5"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          );
        })}
        <button
          onClick={addTab}
          className="p-1 rounded-md text-slate-500 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          title="新增標籤頁"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Safari Navigation & URL Bar */}
      <div className="h-10 px-3 flex items-center gap-3 bg-white dark:bg-slate-900 border-b border-black/10 dark:border-white/10 shrink-0">
        {/* Back / Forward / Refresh */}
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          <button 
            onClick={handleGoBack}
            disabled={activeTab.historyIndex <= 0}
            title="上一頁" 
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft size={14} />
          </button>
          <button 
            onClick={handleGoForward}
            disabled={activeTab.historyIndex >= activeTab.history.length - 1}
            title="下一頁" 
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowRight size={14} />
          </button>
          <button
            onClick={() => {
              setIsLoading(true);
              if (activeTab.url.includes('google.com') && googleQuery) {
                executeRealGoogleSearch(googleQuery);
              }
              if (iframeRef.current) {
                iframeRef.current.src = getIframeSrc();
              }
              setTimeout(() => setIsLoading(false), 400);
            }}
            className={`p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
              isLoading ? 'animate-spin text-blue-500' : ''
            }`}
            title="重新載入此頁面"
          >
            <RotateCw size={13} />
          </button>
        </div>

        {/* Unified Search/URL bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-auto">
          <div className="relative flex items-center">
            <div className="absolute left-2.5 text-slate-400 flex items-center gap-1">
              <Lock size={12} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="搜尋 Google 或輸入任何網站網址 (例如: wikipedia.org)"
              className="w-full pl-7 pr-8 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-center focus:text-left focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono"
            />
            <div className="absolute right-2 text-slate-400" title="Safari 智慧防追蹤保護處於開啟狀態">
              <ShieldCheck size={13} className="text-blue-500" />
            </div>
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          <button 
            onClick={copyCurrentUrl}
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="複製網址"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
          </button>
          <button 
            onClick={() => window.open(activeTab.url, '_blank')}
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1 text-[11px]"
            title="在真實獨立分頁開啟此網站"
          >
            <ExternalLink size={13} />
          </button>
          <button className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <Share size={14} />
          </button>
        </div>
      </div>

      {/* Bookmarks Bar with popular web destinations */}
      <div className="h-7 px-4 bg-slate-50 dark:bg-slate-900/60 border-b border-black/5 dark:border-white/5 flex items-center gap-4 text-[11px] text-slate-600 dark:text-slate-400 shrink-0 overflow-x-auto">
        <button
          onClick={() => handleNavigate('https://www.google.com', 'Google 搜尋')}
          className={`flex items-center gap-1.5 whitespace-nowrap font-medium transition-colors ${
            activeTab.url.includes('google.com') ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'hover:text-blue-500'
          }`}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center font-bold text-[9px] text-blue-600 border border-black/10">
            G
          </div>
          Google
        </button>

        <button
          onClick={() => handleNavigate('https://zh.wikipedia.org', '維基百科 (Wikipedia)')}
          className={`hover:text-blue-500 flex items-center gap-1 whitespace-nowrap ${
            activeTab.url.includes('wikipedia.org') ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
          }`}
        >
          📖 維基百科
        </button>

        <button
          onClick={() => handleNavigate('https://news.ycombinator.com', 'Hacker News')}
          className={`hover:text-blue-500 flex items-center gap-1 whitespace-nowrap ${
            activeTab.url.includes('ycombinator.com') ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
          }`}
        >
          📰 Hacker News
        </button>

        <button
          onClick={() => handleNavigate('https://github.com', 'GitHub: Where the world builds software')}
          className={`hover:text-blue-500 flex items-center gap-1 whitespace-nowrap ${
            activeTab.url.includes('github.com') ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
          }`}
        >
          🐙 GitHub
        </button>

        <button
          onClick={() => handleNavigate('https://www.apple.com/tw/macos/sequoia', 'macOS Sequoia 概觀')}
          className="hover:text-blue-500 flex items-center gap-1 whitespace-nowrap"
        >
           Sequoia 特色
        </button>

        <button
          onClick={() => handleNavigate('https://www.apple.com/tw', 'Apple (台灣) - 官方網站')}
          className="hover:text-blue-500 flex items-center gap-1 whitespace-nowrap"
        >
          Apple 官網
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 relative flex flex-col">
        {isGooglePage ? (
          /* Google Experience Container */
          <div className="flex-1 flex flex-col h-full">
            {/* Google Engine Mode Switcher Banner */}
            <div className="px-4 py-2 bg-slate-100/90 dark:bg-slate-900/90 border-b border-black/5 dark:border-white/5 flex items-center justify-between text-xs shrink-0 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                  <CheckCircle2 size={13} /> 已連線至 Google 服務
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="text-[11px] text-slate-500">檢視模式：</span>
                <div className="inline-flex rounded-lg bg-black/5 dark:bg-white/10 p-0.5">
                  <button
                    onClick={() => setGoogleViewMode('live-search')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                      googleViewMode === 'live-search'
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    Google 即時智慧搜尋
                  </button>
                  <button
                    onClick={() => setGoogleViewMode('iframe-embed')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                      googleViewMode === 'iframe-embed'
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    Google 原生嵌入 (iframe)
                  </button>
                </div>
              </div>

              <button
                onClick={() => window.open(activeTab.url.includes('search') ? activeTab.url : 'https://www.google.com', '_blank')}
                className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                在新視窗開啟真實 Google.com <ArrowUpRight size={12} />
              </button>
            </div>

            {/* Mode A: Embedded Iframe View */}
            {googleViewMode === 'iframe-embed' ? (
              <div className="flex-1 w-full h-full relative">
                <iframe
                  src={
                    activeTab.url.includes('google.com/search') && googleQuery
                      ? `https://www.google.com/search?igu=1&q=${encodeURIComponent(googleQuery)}`
                      : 'https://www.google.com/webhp?igu=1'
                  }
                  title="Google"
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                  allow="geolocation; microphone; camera"
                />
              </div>
            ) : (
              /* Mode B: Live Google Search Engine UI */
              <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                {/* Google Top Header */}
                <div className="flex items-center justify-between px-6 py-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-4 text-xs">
                    <button 
                      onClick={() => handleNavigate('https://about.google', '關於 Google')} 
                      className="hover:underline"
                    >
                      關於 Google
                    </button>
                    <button 
                      onClick={() => handleNavigate('https://store.google.com', 'Google 商店')} 
                      className="hover:underline"
                    >
                      Google 商店
                    </button>
                  </div>

                  <div className="flex items-center gap-4 relative">
                    <button 
                      onClick={() => window.open('https://mail.google.com', '_blank')} 
                      className="hover:underline"
                    >
                      Gmail
                    </button>
                    <button 
                      onClick={() => window.open('https://www.google.com/imghp', '_blank')} 
                      className="hover:underline"
                    >
                      圖片
                    </button>

                    {/* Google 9-dot app drawer button */}
                    <button 
                      onClick={() => setShowGoogleApps(!showGoogleApps)}
                      className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      title="Google 應用程式"
                    >
                      <Grid size={18} />
                    </button>

                    {/* Google Apps popup */}
                    {showGoogleApps && (
                      <div className="absolute right-0 top-10 w-64 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-black/10 dark:border-white/10 z-30 grid grid-cols-3 gap-3">
                        {[
                          { name: '搜尋', icon: '🔍', url: 'https://www.google.com' },
                          { name: 'YouTube', icon: '▶️', url: 'https://www.youtube.com' },
                          { name: 'Gmail', icon: '✉️', url: 'https://mail.google.com' },
                          { name: '雲端硬碟', icon: '📁', url: 'https://drive.google.com' },
                          { name: '地圖', icon: '🗺️', url: 'https://maps.google.com' },
                          { name: '日曆', icon: '📅', url: 'https://calendar.google.com' },
                          { name: '翻譯', icon: '🌐', url: 'https://translate.google.com' },
                          { name: '相簿', icon: '🖼️', url: 'https://photos.google.com' },
                          { name: 'Gemini', icon: '✨', url: 'https://gemini.google.com' },
                        ].map((app) => (
                          <button
                            key={app.name}
                            onClick={() => {
                              handleNavigate(app.url, app.name);
                              setShowGoogleApps(false);
                            }}
                            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <span className="text-xl">{app.icon}</span>
                            <span className="text-[11px]">{app.name}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Google User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-medium flex items-center justify-center shadow-xs cursor-pointer">
                      Z
                    </div>
                  </div>
                </div>

                {/* Main Search View */}
                <div className="max-w-3xl w-full mx-auto px-4 py-8 flex flex-col items-center flex-1 justify-center">
                  {/* Google Logo */}
                  <div className="mb-8 select-none flex items-center font-bold text-6xl tracking-tight">
                    <span className="text-blue-500">G</span>
                    <span className="text-red-500">o</span>
                    <span className="text-amber-500">o</span>
                    <span className="text-blue-500">g</span>
                    <span className="text-green-500">l</span>
                    <span className="text-red-500">e</span>
                  </div>

                  {/* Search Input Box */}
                  <div className="w-full max-w-xl relative group mb-6">
                    <div className="flex items-center w-full px-4 py-3 rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                      <Search size={18} className="text-slate-400 mr-3 shrink-0" />
                      <input
                        type="text"
                        value={googleQuery}
                        onChange={(e) => setGoogleQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            executeRealGoogleSearch(googleQuery);
                          }
                        }}
                        placeholder="在 Google 上搜尋，或輸入任何網址"
                        className="w-full text-sm bg-transparent focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
                        autoFocus
                      />
                      {googleQuery && (
                        <button
                          onClick={() => setGoogleQuery('')}
                          className="p-1 hover:text-black dark:hover:text-white mr-1 text-slate-400"
                        >
                          <X size={15} />
                        </button>
                      )}
                      <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
                        <button
                          onClick={() => {
                            setGoogleQuery('台灣天氣即時資訊');
                            executeRealGoogleSearch('台灣天氣即時資訊');
                          }}
                          title="語音搜尋"
                          className="text-slate-500 hover:text-blue-500 transition-colors"
                        >
                          <Mic size={17} />
                        </button>
                        <button
                          onClick={() => alert('已啟用 Safari 智慧鏡頭掃描')}
                          title="以圖搜尋"
                          className="text-slate-500 hover:text-blue-500 transition-colors"
                        >
                          <Camera size={17} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => executeRealGoogleSearch(googleQuery || '熱門科技新聞')}
                      disabled={isSearchingGoogle}
                      className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 border border-transparent hover:border-black/10 dark:hover:border-white/10 transition-all shadow-2xs"
                    >
                      {isSearchingGoogle ? '正在連線 Google 檢索...' : 'Google 搜尋'}
                    </button>
                    <button
                      onClick={() => {
                        const randomTopics = ['維基百科 台北', 'macOS Sequoia 官方特色', '台灣氣象最新預報', '台北 101 導覽', '最新 AI 科技進展'];
                        const pick = randomTopics[Math.floor(Math.random() * randomTopics.length)];
                        setGoogleQuery(pick);
                        executeRealGoogleSearch(pick);
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 border border-transparent hover:border-black/10 dark:hover:border-white/10 transition-all shadow-2xs"
                    >
                      好手氣 (I'm Feeling Lucky)
                    </button>
                  </div>

                  {/* Quick Suggestions Pills */}
                  <div className="flex items-center gap-2 flex-wrap justify-center mb-6 max-w-lg">
                    <span className="text-[11px] text-slate-400">熱門探索：</span>
                    {['台北捷運', 'Apple M4 Max', '台灣高鐵', '維基百科', 'Hacker News'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setGoogleQuery(tag);
                          executeRealGoogleSearch(tag);
                        }}
                        className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-[11px] text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors border border-black/5 dark:border-white/5"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Google Language Offer */}
                  <div className="text-xs text-slate-500">
                    Google 提供：
                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer ml-1">繁體中文</span>
                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer ml-2">English</span>
                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer ml-2">日本語</span>
                  </div>

                  {/* Real Search Results View (If searched) */}
                  {isSearchingGoogle && (
                    <div className="w-full mt-8 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/5 flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        正在連線 Google 檢索即時網頁資料...
                      </span>
                    </div>
                  )}

                  {googleResults && !isSearchingGoogle && (
                    <div className="w-full mt-8 space-y-6 text-left animate-in fade-in duration-300">
                      {/* Search Stats */}
                      <div className="text-[11px] text-slate-400 border-b border-black/10 dark:border-white/10 pb-2 flex items-center justify-between">
                        <span>找到約 1,480,000 項結果 (搜尋時間：0.28 秒)</span>
                        <span className="text-blue-600 dark:text-blue-400">來源：Google Search 檢索連線</span>
                      </div>

                      {/* AI Overview / Direct Summary Card */}
                      {googleResults.summary && (
                        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-2">
                          <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-semibold text-xs">
                            <Sparkles size={14} />
                            <span>Google 智慧摘要 (AI Overview)</span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                            {googleResults.summary}
                          </p>
                        </div>
                      )}

                      {/* Web Results List - Clicking directly enters the website */}
                      <div className="space-y-3.5">
                        {googleResults.results.map((res, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleNavigate(res.url, res.title)}
                            className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 hover:border-blue-500/60 bg-white dark:bg-slate-900/90 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 cursor-pointer transition-all shadow-2xs hover:shadow-md group flex items-start justify-between gap-4"
                          >
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                                  <Globe size={11} />
                                </div>
                                <span className="truncate font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                                  {res.url}
                                </span>
                              </div>
                              <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1.5 leading-snug">
                                {res.title}
                              </h3>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                                {res.snippet}
                              </p>
                            </div>
                            <div className="shrink-0 pt-1">
                              <span className="px-2.5 py-1 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white text-[11px] font-medium transition-colors flex items-center gap-1 shadow-xs">
                                進入網站 <ArrowRight size={11} />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Related Searches */}
                      {googleResults.searchQueries && googleResults.searchQueries.length > 0 && (
                        <div className="pt-4 border-t border-black/10 dark:border-white/10">
                          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">相關搜尋項目</h4>
                          <div className="flex flex-wrap gap-2">
                            {googleResults.searchQueries.map((item, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setGoogleQuery(item);
                                  executeRealGoogleSearch(item);
                                }}
                                className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
                              >
                                <Search size={11} className="text-slate-400" />
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Google Footer */}
                <div className="bg-slate-100 dark:bg-slate-900/80 border-t border-black/5 dark:border-white/5 text-slate-500 text-xs mt-auto">
                  <div className="px-6 py-2 border-b border-black/5 dark:border-white/5">
                    台灣 - 依據你的網路位址 - 採用即時 Google 連線
                  </div>
                  <div className="px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="hover:underline cursor-pointer">關於</span>
                      <span className="hover:underline cursor-pointer">廣告</span>
                      <span className="hover:underline cursor-pointer">商務</span>
                      <span className="hover:underline cursor-pointer">搜尋的運作方式</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="hover:underline cursor-pointer">隱私權</span>
                      <span className="hover:underline cursor-pointer">條款</span>
                      <span className="hover:underline cursor-pointer">設定</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : isAppleShowcase ? (
          /* Apple Sequoia Feature Showcase Page */
          <div className="max-w-4xl mx-auto space-y-12 p-6">
            {/* Hero */}
            <div className="text-center pt-8 pb-4 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                macOS Sequoia
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                超凡實力，盡顯鋒芒。
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                帶來 iPhone 鏡像輸出、全新視窗平鋪排列、功能強大的備忘錄與個人化智慧系統 Apple Intelligence。
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => alert('您目前正在運行 macOS Sequoia 網頁端系統！')}
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-sm"
                >
                  探索全新功能
                </button>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-black/5 dark:border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-white">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Apple Intelligence</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  深度融入 macOS 的個人智慧化系統，能理解並創造文字與圖像，簡化跨 App 的複雜工作。
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-black/5 dark:border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                  <Laptop size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">更輕鬆的視窗平鋪</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  將視窗拖到螢幕邊緣即可自動平鋪排列，輕鬆並排整理多個應用程式，保持井然有序。
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-black/5 dark:border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                  <Cpu size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">M4 系列晶片支援</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  專為 Apple 晶片架構打造，極致的能源效率比與極速的本機回應速度。
                </p>
              </div>
            </div>

            {/* Safari highlights */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white space-y-4">
              <span className="text-xs font-semibold tracking-wider uppercase opacity-80">Safari 瀏覽器</span>
              <h2 className="text-2xl md:text-3xl font-bold">世界上極其快速的網頁瀏覽器。</h2>
              <p className="text-xs md:text-sm opacity-90 max-w-2xl leading-relaxed">
                Safari 能有效防範網路追蹤並維持出色電池續航力。全新亮點功能帶來即時摘要與閱讀器模式，讓網頁閱讀更專注高效。
              </p>
            </div>
          </div>
        ) : (
          /* Universal Webpage Browser via Proxy Engine */
          <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950">
            {/* Top Proxy Controls Strip */}
            <div className="px-4 py-2 bg-slate-100/95 dark:bg-slate-900/95 border-b border-black/5 dark:border-white/5 flex items-center justify-between text-xs shrink-0 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium text-[11px]">
                  <Zap size={13} /> Safari 全網代理加速中
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="text-[11px] text-slate-500 font-mono truncate max-w-xs">{activeTab.url}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-lg bg-black/5 dark:bg-white/10 p-0.5">
                  <button
                    onClick={() => setProxyMode('proxy')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                      proxyMode === 'proxy'
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                    }`}
                    title="透過伺服器解除 X-Frame-Options 跨網域同源限制"
                  >
                    解除跨網域限制 (代理)
                  </button>
                  <button
                    onClick={() => setProxyMode('direct')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                      proxyMode === 'direct'
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                    }`}
                    title="直接連線載入原始網頁"
                  >
                    原生直連
                  </button>
                </div>

                <button
                  onClick={() => window.open(activeTab.url, '_blank')}
                  className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium transition-colors flex items-center gap-1 shadow-xs"
                >
                  在獨立分頁開啟 <ExternalLink size={11} />
                </button>
              </div>
            </div>

            {/* Live Web Content Frame */}
            <div className="flex-1 w-full h-full relative bg-white">
              <iframe
                ref={iframeRef}
                src={getIframeSrc()}
                title={activeTab.title}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                allow="geolocation; microphone; camera; encrypted-media; clipboard-read; clipboard-write"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
