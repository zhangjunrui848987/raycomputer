import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { NoteItem } from '../../types';
import { 
  Plus, 
  Trash2, 
  Search, 
  Folder, 
  FolderPlus, 
  Pin, 
  Bold, 
  Italic, 
  List, 
  CheckSquare, 
  Heading1, 
  Heading2,
  Share2,
  FileDown
} from 'lucide-react';

export const NotesApp: React.FC = () => {
  const { notes, saveNote, deleteNote } = useOS();
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const filteredNotes = notes.filter((n) => {
    const matchesFolder = selectedFolder === 'all' || n.folderId === selectedFolder;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleCreateNote = () => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      folderId: selectedFolder === 'all' ? 'notes' : selectedFolder,
      title: '未命名備忘錄',
      content: '',
      updatedAt: '剛剛',
      isPinned: false,
    };
    saveNote(newNote);
    setActiveNoteId(newNote.id);
  };

  const handleContentChange = (content: string) => {
    if (!activeNote) return;
    const lines = content.split('\n');
    const title = lines[0]?.trim() || '未命名備忘錄';
    saveNote({
      ...activeNote,
      title: title.slice(0, 30),
      content,
      updatedAt: '剛剛',
    });
  };

  const togglePin = () => {
    if (!activeNote) return;
    saveNote({
      ...activeNote,
      isPinned: !activeNote.isPinned,
    });
  };

  const insertText = (prefix: string, suffix: string = '') => {
    if (!activeNote) return;
    const textarea = document.getElementById('note-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = prefix + selected + suffix;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    handleContentChange(newContent);
  };

  return (
    <div className="flex h-full select-none text-slate-800 dark:text-slate-100 text-xs">
      {/* Folder sidebar */}
      <div className="w-44 bg-slate-100/80 dark:bg-slate-800/60 border-r border-black/10 dark:border-white/10 p-3 flex flex-col justify-between shrink-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            <span>iCloud 資料夾</span>
          </div>

          <div className="space-y-0.5">
            <button
              onClick={() => setSelectedFolder('all')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                selectedFolder === 'all'
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 font-medium'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <Folder size={14} className="text-amber-500" /> 所有備忘錄
              </span>
              <span className="text-[10px] opacity-60 font-mono">{notes.length}</span>
            </button>

            <button
              onClick={() => setSelectedFolder('notes')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                selectedFolder === 'notes'
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 font-medium'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <Folder size={14} className="text-amber-500" /> 預設便籤
              </span>
              <span className="text-[10px] opacity-60 font-mono">
                {notes.filter((n) => n.folderId === 'notes').length}
              </span>
            </button>

            <button
              onClick={() => setSelectedFolder('work')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                selectedFolder === 'work'
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 font-medium'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <Folder size={14} className="text-amber-500" /> 工作與專案
              </span>
              <span className="text-[10px] opacity-60 font-mono">
                {notes.filter((n) => n.folderId === 'work').length}
              </span>
            </button>
          </div>
        </div>

        <button
          onClick={handleCreateNote}
          className="flex items-center gap-2 p-2 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-medium transition-colors"
        >
          <Plus size={14} /> 新增便籤
        </button>
      </div>

      {/* Notes list middle column */}
      <div className="w-56 bg-slate-50 dark:bg-slate-900/60 border-r border-black/10 dark:border-white/10 flex flex-col shrink-0">
        {/* Search header */}
        <div className="p-2 border-b border-black/10 dark:border-white/10">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋備忘錄"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-black/5 dark:border-white/5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* List items */}
        <div className="flex-1 overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
          {filteredNotes.map((note) => {
            const isSelected = note.id === activeNote?.id;
            return (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-amber-500/20 text-slate-900 dark:text-white'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-semibold truncate text-xs">{note.title || '無標題'}</span>
                  {note.isPinned && <Pin size={11} className="text-amber-500 shrink-0 fill-current" />}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1 font-mono">
                  <span>{note.updatedAt}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed break-all">
                  {note.content || '無附加文字'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor right column */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 min-w-0">
        {/* Editor Toolbar */}
        <div className="h-10 px-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between gap-2 shrink-0 bg-white/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-1">
            <button
              onClick={() => insertText('**', '**')}
              className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
              title="粗體"
            >
              <Bold size={13} />
            </button>
            <button
              onClick={() => insertText('*', '*')}
              className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
              title="斜體"
            >
              <Italic size={13} />
            </button>
            <button
              onClick={() => insertText('# ')}
              className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
              title="大標題"
            >
              <Heading1 size={13} />
            </button>
            <button
              onClick={() => insertText('## ')}
              className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
              title="次標題"
            >
              <Heading2 size={13} />
            </button>
            <button
              onClick={() => insertText('- [ ] ')}
              className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
              title="待辦核取方塊"
            >
              <CheckSquare size={13} />
            </button>
            <button
              onClick={() => insertText('- ')}
              className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
              title="項目符號"
            >
              <List size={13} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePin}
              className={`p-1.5 rounded transition-colors ${
                activeNote?.isPinned ? 'text-amber-500 bg-amber-500/15' : 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-500'
              }`}
              title="置頂備忘錄"
            >
              <Pin size={13} />
            </button>
            {activeNote && (
              <button
                onClick={() => deleteNote(activeNote.id)}
                className="p-1.5 rounded text-rose-500 hover:bg-rose-500/15 transition-colors"
                title="刪除備忘錄"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Text Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeNote ? (
            <textarea
              id="note-textarea"
              value={activeNote.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="在此開始記錄..."
              className="w-full h-full bg-transparent resize-none border-none outline-hidden text-sm leading-relaxed text-slate-800 dark:text-slate-100 font-sans focus:ring-0 select-text"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              請選擇或新增備忘錄
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
