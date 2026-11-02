import React, { useState } from 'react';
import { Send, Phone, Video, Info, User } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  messages: { id: string; sender: 'me' | 'them'; text: string; time: string }[];
}

const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'tim',
    name: 'Tim Cook',
    avatar: '👨‍💼',
    lastMessage: '歡迎體驗全新的 macOS Sequoia 網頁端！',
    time: '09:20',
    messages: [
      { id: '1', sender: 'them', text: 'Good morning! Welcome to the new macOS experience.', time: '09:18' },
      { id: '2', sender: 'them', text: '歡迎體驗全新的 macOS Sequoia 網頁端！這是軟硬體協同的全新篇章。', time: '09:20' },
    ],
  },
  {
    id: 'craig',
    name: 'Craig Federighi',
    avatar: '🏄‍♂️',
    lastMessage: '試試看幕前調度 (Stage Manager) 和終端機裡的 neofetch！',
    time: '昨天',
    messages: [
      { id: '1', sender: 'them', text: '嗨！試試看幕前調度 (Stage Manager) 和終端機裡的 neofetch！動畫極其流暢。', time: '昨天' },
    ],
  },
  {
    id: 'apple_support',
    name: 'Apple 支援小組',
    avatar: '',
    lastMessage: '您的裝置已享有官方技術支援保障。',
    time: '週一',
    messages: [
      { id: '1', sender: 'them', text: '您的裝置已享有官方技術支援保障。如有任何問題請隨時諮詢。', time: '週一' },
    ],
  },
];

export const MessagesApp: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [activeContactId, setActiveContactId] = useState<string>('tim');
  const [inputText, setInputText] = useState('');

  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0];

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: String(Date.now()),
      sender: 'me' as const,
      text: inputText,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeContactId
          ? {
              ...c,
              lastMessage: inputText,
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );
    setInputText('');

    // Simulated quick reply from Apple contacts
    setTimeout(() => {
      const reply = {
        id: String(Date.now() + 1),
        sender: 'them' as const,
        text: `收到你的訊息：「${inputText}」。蘋果 macOS 帶來無縫的跨裝置體驗與卓越效能！`,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };
      setContacts((prev) =>
        prev.map((c) =>
          c.id === activeContactId
            ? {
                ...c,
                lastMessage: reply.text,
                messages: [...c.messages, reply],
              }
            : c
        )
      );
    }, 1200);
  };

  return (
    <div className="flex h-full select-none text-slate-800 dark:text-slate-100 text-xs">
      {/* Contact list */}
      <div className="w-56 bg-slate-100/70 dark:bg-slate-800/60 border-r border-black/10 dark:border-white/10 flex flex-col shrink-0">
        <div className="p-3 border-b border-black/10 dark:border-white/10">
          <span className="font-semibold text-xs">訊息對話</span>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
          {contacts.map((contact) => {
            const isSelected = contact.id === activeContactId;
            return (
              <div
                key={contact.id}
                onClick={() => setActiveContactId(contact.id)}
                className={`p-3 cursor-pointer flex items-center gap-3 transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg shrink-0">
                  {contact.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-semibold truncate">{contact.name}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                      {contact.time}
                    </span>
                  </div>
                  <p className={`text-[11px] truncate ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                    {contact.lastMessage}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 min-w-0">
        {/* Header */}
        <div className="h-10 px-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between shrink-0 bg-white/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs">{activeContact.name}</span>
            <span className="text-[10px] text-emerald-500">iMessage</span>
          </div>
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
            <button className="hover:opacity-80"><Phone size={14} /></button>
            <button className="hover:opacity-80"><Video size={14} /></button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {activeContact.messages.map((m) => {
            const isMe = m.sender === 'me';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[75%] text-xs leading-relaxed select-text ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1 font-mono">{m.time}</span>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-1.5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="iMessage 信息"
              className="flex-1 bg-transparent text-xs focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors shrink-0"
            >
              <Send size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
