import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { Sparkles, Send, Mic, Bot, User, CornerDownLeft } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'siri';
  text: string;
}

export const SiriApp: React.FC = () => {
  const { openApp, setIsDarkMode, isDarkMode, takeScreenshot, emptyTrash } = useOS();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'siri',
      text: '你好！我是 Siri (Apple Intelligence)。我可以幫您啟動應用程式、回答問題、提供靈感，或者協助管理您的 Mac。今天有什麼可以為您服務的？',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isThinking) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsThinking(true);

    // Check for direct Mac OS control commands
    const lower = text.toLowerCase();
    if (lower.includes('開啟終端機') || lower.includes('打開終端') || lower.includes('terminal')) {
      setTimeout(() => {
        openApp('terminal');
        setMessages((prev) => [
          ...prev,
          { id: String(Date.now() + 1), sender: 'siri', text: '已為您開啟「終端機」。' },
        ]);
        setIsThinking(false);
      }, 500);
      return;
    }

    if (lower.includes('深色模式') || lower.includes('暗色模式') || lower.includes('dark mode')) {
      setTimeout(() => {
        setIsDarkMode(true);
        setMessages((prev) => [
          ...prev,
          { id: String(Date.now() + 1), sender: 'siri', text: '已為您切換至深色外觀。' },
        ]);
        setIsThinking(false);
      }, 500);
      return;
    }

    if (lower.includes('淺色模式') || lower.includes('亮色模式') || lower.includes('light mode')) {
      setTimeout(() => {
        setIsDarkMode(false);
        setMessages((prev) => [
          ...prev,
          { id: String(Date.now() + 1), sender: 'siri', text: '已為您切換至淺色外觀。' },
        ]);
        setIsThinking(false);
      }, 500);
      return;
    }

    if (lower.includes('截圖') || lower.includes('螢幕快照') || lower.includes('截屏')) {
      setTimeout(() => {
        takeScreenshot();
        setMessages((prev) => [
          ...prev,
          { id: String(Date.now() + 1), sender: 'siri', text: '已為您拍攝螢幕截圖並儲存在桌面上。' },
        ]);
        setIsThinking(false);
      }, 500);
      return;
    }

    if (lower.includes('清空垃圾桶') || lower.includes('倒垃圾')) {
      setTimeout(() => {
        emptyTrash();
        setMessages((prev) => [
          ...prev,
          { id: String(Date.now() + 1), sender: 'siri', text: '已清空垃圾桶中的全部項目。' },
        ]);
        setIsThinking(false);
      }, 500);
      return;
    }

    // Call server AI endpoint
    try {
      const res = await fetch('/api/siri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      const reply = data.reply || '我已經為您記錄下來了。請問還有其他需要協助的嗎？';
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now() + 1), sender: 'siri', text: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'siri',
          text: `收到！我已為您查詢了關於「${text}」的資訊。macOS Sequoia 搭載了全方位的本機智慧體系，隨時為您提供支援。`,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 select-none text-slate-800 dark:text-slate-100 text-xs">
      {/* Siri Rainbow Glow Header */}
      <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-white dark:bg-slate-900/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 p-[2px] shadow-md animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
              <Sparkles size={14} className="text-amber-300" />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-sm">Apple Intelligence / Siri 智慧助理</h2>
            <p className="text-[10px] text-slate-500">隨時回應您的指令與提問</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 text-white shadow-xs'
                }`}
              >
                {isUser ? <User size={12} /> : ''}
              </div>

              <div
                className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed select-text ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-white dark:bg-slate-800 border border-black/5 dark:border-white/5 rounded-tl-xs shadow-xs text-slate-800 dark:text-slate-100'
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-500 animate-spin flex items-center justify-center p-[2px]">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-900" />
            </div>
            <span className="text-xs">Siri 正在思考...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-3 py-1 flex items-center gap-2 overflow-x-auto shrink-0 border-t border-black/5 dark:border-white/5">
        <button
          onClick={() => handleSend('開啟終端機')}
          className="px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[11px] whitespace-nowrap transition-colors"
        >
          開啟終端機
        </button>
        <button
          onClick={() => handleSend('拍攝螢幕截圖')}
          className="px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[11px] whitespace-nowrap transition-colors"
        >
          拍攝螢幕截圖
        </button>
        <button
          onClick={() => handleSend('切換至深色模式')}
          className="px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[11px] whitespace-nowrap transition-colors"
        >
          切換深色外觀
        </button>
        <button
          onClick={() => handleSend('介紹一下這台 Mac 的硬體配置')}
          className="px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[11px] whitespace-nowrap transition-colors"
        >
          檢視本機硬體配置
        </button>
      </div>

      {/* Input bar */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-black/10 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1.5 border border-black/5 dark:border-white/5">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="詢問 Siri 或輸入系統控制指令..."
            className="flex-1 bg-transparent text-xs focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim()}
            className="p-1 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors"
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
