import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { ArrowRight, Moon, RotateCcw, Power, Fingerprint } from 'lucide-react';

export const LockScreen: React.FC = () => {
  const { isLocked, unlockSystem, restartSystem, sleepSystem, isSleeping, wakeSystem } = useOS();
  const [password, setPassword] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      setDateStr(`${now.getMonth() + 1}月${now.getDate()}日 ${days[now.getDay()]}`);
      setTimeStr(now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  if (isSleeping) {
    return (
      <div
        onClick={wakeSystem}
        className="fixed inset-0 z-50 bg-black cursor-pointer flex items-center justify-center text-white/40 text-xs"
      >
        <span>按一下螢幕或任意按鍵以喚醒 Mac</span>
      </div>
    );
  }

  if (!isLocked) return null;

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    unlockSystem();
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between items-center py-12 px-6 select-none bg-black/40 backdrop-blur-3xl text-white">
      {/* Clock Top */}
      <div className="flex flex-col items-center mt-6">
        <span className="text-base font-medium opacity-90 drop-shadow-md">{dateStr}</span>
        <h1 className="text-7xl font-extralight tracking-tight font-mono drop-shadow-lg mt-1">
          {timeStr}
        </h1>
      </div>

      {/* User Login Form */}
      <div className="flex flex-col items-center gap-3">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border-2 border-white/40 shadow-2xl flex items-center justify-center text-3xl font-semibold">
          
        </div>

        <span className="text-sm font-semibold tracking-wide drop-shadow-sm">
          Zhang Junrui
        </span>

        {/* Password input */}
        <form onSubmit={handleUnlock} className="flex items-center gap-2 mt-1">
          <div className="relative flex items-center">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="輸入密碼或直接按下 Return 鍵"
              autoFocus
              className="w-52 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/30 text-xs text-white placeholder-white/50 focus:outline-none focus:bg-white/30 text-center transition-all shadow-md"
            />
            <button
              type="submit"
              className="absolute right-1 w-6 h-6 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white transition-colors"
            >
              <ArrowRight size={12} />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-1.5 text-[11px] text-white/60 mt-1">
          <Fingerprint size={14} />
          <span>支援 Touch ID 或 Return 鍵解鎖</span>
        </div>
      </div>

      {/* Power controls bottom */}
      <div className="flex items-center gap-8 text-white/70 text-xs">
        <button
          onClick={sleepSystem}
          className="flex flex-col items-center gap-1 hover:text-white transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Moon size={14} />
          </div>
          <span className="text-[10px]">睡眠</span>
        </button>

        <button
          onClick={restartSystem}
          className="flex flex-col items-center gap-1 hover:text-white transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <RotateCcw size={14} />
          </div>
          <span className="text-[10px]">重新開機</span>
        </button>

        <button
          onClick={sleepSystem}
          className="flex flex-col items-center gap-1 hover:text-white transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Power size={14} />
          </div>
          <span className="text-[10px]">關機</span>
        </button>
      </div>
    </div>
  );
};
