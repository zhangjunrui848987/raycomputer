import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { AppId } from '../../types';

interface OutputLine {
  id: string;
  type: 'prompt' | 'output' | 'error' | 'ascii';
  text: string;
}

export const TerminalApp: React.FC = () => {
  const { files, openApp, closeWindow, activeWindowId } = useOS();
  const [lines, setLines] = useState<OutputLine[]>([
    { id: '1', type: 'output', text: 'Last login: Mon Nov  2 09:14:22 on ttys001' },
    { id: '2', type: 'output', text: 'Welcome to macOS Sequoia (Darwin Kernel Version 24.1.0)' },
    { id: '3', type: 'output', text: '輸入 "help" 查看終端機可用指令，或輸入 "neofetch" 檢視系統配置。' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [isPythonMode, setIsPythonMode] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) {
      setLines((prev) => [
        ...prev,
        { id: String(Date.now()), type: 'prompt', text: `user@MacBook-Pro ~ % ` },
      ]);
      return;
    }

    // Add to history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    const promptText = isPythonMode ? `>>> ${trimmed}` : `user@MacBook-Pro ~ % ${trimmed}`;
    const newLines: OutputLine[] = [
      { id: String(Date.now()), type: 'prompt', text: promptText },
    ];

    if (isPythonMode) {
      if (trimmed === 'exit()' || trimmed === 'quit()') {
        setIsPythonMode(false);
        newLines.push({ id: String(Date.now() + 1), type: 'output', text: 'Exited Python 3.12.2 environment.' });
      } else {
        try {
          // safe eval for python/js expressions like 2+2 or Math.sqrt(16)
          // eslint-disable-next-line no-new-func
          const result = Function(`'use strict'; return (${trimmed})`)();
          newLines.push({ id: String(Date.now() + 1), type: 'output', text: String(result) });
        } catch (err: any) {
          newLines.push({ id: String(Date.now() + 1), type: 'error', text: `SyntaxError: ${err.message}` });
        }
      }
      setLines((prev) => [...prev, ...newLines]);
      return;
    }

    const [cmd, ...args] = trimmed.split(' ');
    const argStr = args.join(' ');

    switch (cmd.toLowerCase()) {
      case 'help':
        newLines.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: `macOS Sequoia 終端機支援的指令:
  neofetch       顯示系統硬體配置與 Apple ASCII 標誌
  ls             列出目前目錄中的檔案
  pwd            印出目前工作目錄
  cat <file>     檢視指定檔案內容
  echo <text>    印出文字內容
  clear          清空終端機畫面
  date           查看目前系統時間
  whoami         查看目前登入使用者
  uname -a       查看系統核心版本
  python3        進入互動式 Python / JS 直譯器
  cowsay <text>  ASCII 小牛說話
  open <app>     開啟應用程式 (例如: open safari, open notes, open calc)
  exit           退出終端機`,
        });
        break;

      case 'clear':
        setLines([]);
        return;

      case 'pwd':
        newLines.push({ id: String(Date.now() + 1), type: 'output', text: '/Users/user/Desktop' });
        break;

      case 'whoami':
        newLines.push({ id: String(Date.now() + 1), type: 'output', text: 'user (Apple Administrator)' });
        break;

      case 'date':
        newLines.push({ id: String(Date.now() + 1), type: 'output', text: new Date().toString() });
        break;

      case 'uname':
        newLines.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: 'Darwin MacBook-Pro.local 24.1.0 Darwin Kernel Version 24.1.0: arm64',
        });
        break;

      case 'ls':
        const fileNames = files.map((f) => f.name).join('   ');
        newLines.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: fileNames || 'Desktop is currently empty.',
        });
        break;

      case 'cat':
        if (!argStr) {
          newLines.push({ id: String(Date.now() + 1), type: 'error', text: '用法: cat <檔案名稱>' });
        } else {
          const target = files.find((f) => f.name.toLowerCase() === argStr.toLowerCase());
          if (target && target.content) {
            newLines.push({ id: String(Date.now() + 1), type: 'output', text: target.content });
          } else if (target) {
            newLines.push({ id: String(Date.now() + 1), type: 'output', text: `[二進位檔案 / ${target.type}: ${target.name}]` });
          } else {
            newLines.push({ id: String(Date.now() + 1), type: 'error', text: `cat: ${argStr}: No such file or directory` });
          }
        }
        break;

      case 'echo':
        newLines.push({ id: String(Date.now() + 1), type: 'output', text: argStr });
        break;

      case 'python':
      case 'python3':
        setIsPythonMode(true);
        newLines.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: `Python 3.12.2 (tags/v3.12.2:6abddd9, Oct 2026, Apple M4 Max)\n[Clang 16.0.0 (clang-1600.0.26.4)] on darwin\nType "help", "copyright", "credits" or "license" for more information.\nType "exit()" to quit.`,
        });
        break;

      case 'cowsay':
        const message = argStr || 'macOS on Web is amazing!';
        const cow = `
  < ${message} >
         \\   ^__^
          \\  (oo)\\_______
             (__)\\       )\\/\\
                 ||----w |
                 ||     ||`;
        newLines.push({ id: String(Date.now() + 1), type: 'ascii', text: cow });
        break;

      case 'neofetch':
        const neofetchArt = `
                    'c.          user@MacBook-Pro
                 ,xNMM.          ----------------
               .OMMMMo           OS: macOS Sequoia 15.2 arm64
               OMMM0,            Host: MacBook Pro (16-inch, Nov 2026)
     .;loddo:' loolloddol;.      Kernel: Darwin 24.1.0
   cKMMMMMMMMMMNWMMMMMMMMMM0:    Uptime: 4 hours, 28 mins
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.    Packages: 142 (brew)
 XMMMMMMMMMMMMMMMMMMMMMMMX.      Shell: zsh 5.9
;MMMMMMMMMMMMMMMMMMMMMMMM:       Resolution: 3456x2234 Retina Display
:MMMMMMMMMMMMMMMMMMMMMMMM:       DE: Aqua
.MMMMMMMMMMMMMMMMMMMMMMMMX.      WM: Quartz Compositor
 kMMMMMMMMMMMMMMMMMMMMMMMMWd.    Terminal: Apple Terminal
 .XMMMMMMMMMMMMMMMMMMMMMMMMMMk   CPU: Apple M4 Max (16 cores)
  .XMMMMMMMMMMMMMMMMMMMMMMMMK.   GPU: Apple M4 Max (40 cores)
    kMMMMMMMMMMMMMMMMMMMMMMd     Memory: 11420MiB / 36864MiB
     ;KMMMMMMMWXXWMMMMMMMk.
       .cooc,.    .,coo:.`;
        newLines.push({ id: String(Date.now() + 1), type: 'ascii', text: neofetchArt });
        break;

      case 'open':
        const appMap: Record<string, AppId> = {
          safari: 'safari',
          finder: 'finder',
          notes: 'notes',
          calc: 'calculator',
          calculator: 'calculator',
          settings: 'settings',
          photos: 'photos',
          music: 'music',
          messages: 'messages',
          maps: 'maps',
          siri: 'siri',
          appstore: 'appstore',
        };
        const targetApp = appMap[argStr.toLowerCase()];
        if (targetApp) {
          openApp(targetApp);
          newLines.push({ id: String(Date.now() + 1), type: 'output', text: `Opening ${targetApp}...` });
        } else {
          newLines.push({
            id: String(Date.now() + 1),
            type: 'error',
            text: `The application /Applications/${argStr}.app cannot be opened. Try 'open safari', 'open notes', etc.`,
          });
        }
        break;

      case 'exit':
        if (activeWindowId) closeWindow(activeWindowId);
        return;

      default:
        newLines.push({
          id: String(Date.now() + 1),
          type: 'error',
          text: `zsh: command not found: ${cmd}. Type "help" for a list of commands.`,
        });
    }

    setLines((prev) => [...prev, ...newLines]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0) {
        const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < history.length) {
          setHistoryIdx(nextIdx);
          setInputVal(history[nextIdx]);
        } else {
          setHistoryIdx(-1);
          setInputVal('');
        }
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] font-mono p-3 text-xs overflow-y-auto select-text leading-relaxed"
    >
      {lines.map((line) => (
        <div key={line.id} className="whitespace-pre-wrap break-all mb-1">
          {line.type === 'prompt' ? (
            <span className="text-emerald-400 font-semibold">{line.text}</span>
          ) : line.type === 'error' ? (
            <span className="text-rose-400">{line.text}</span>
          ) : line.type === 'ascii' ? (
            <span className="text-cyan-400 leading-none block font-mono text-[11px]">{line.text}</span>
          ) : (
            <span className="text-slate-300">{line.text}</span>
          )}
        </div>
      ))}

      {/* Active Input Line */}
      <div className="flex items-center gap-1">
        <span className="text-emerald-400 font-semibold shrink-0">
          {isPythonMode ? '>>>' : 'user@MacBook-Pro ~ %'}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 bg-transparent border-none outline-hidden text-[#d4d4d4] font-mono text-xs focus:ring-0 p-0"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
