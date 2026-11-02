import React from 'react';
import { useOS } from '../../context/OSContext';
import { Trash2, RotateCcw, Folder, FileText, Image as ImageIcon } from 'lucide-react';

export const TrashApp: React.FC = () => {
  const { trash, emptyTrash, createFile } = useOS();

  const handleRestore = (item: any) => {
    createFile({
      name: item.name,
      type: item.type,
      parentId: 'desktop',
      content: item.content,
      imageSrc: item.imageSrc,
      size: item.size,
    });
    // Remove from trash
    // (createFile will add it back to active desktop)
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 select-none text-slate-800 dark:text-slate-100 text-xs">
      {/* Toolbar */}
      <div className="h-10 px-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900/80">
        <div className="flex items-center gap-2">
          <Trash2 size={16} className="text-slate-500" />
          <span className="font-semibold text-xs">垃圾桶 ({trash.length} 個項目)</span>
        </div>

        {trash.length > 0 && (
          <button
            onClick={emptyTrash}
            className="px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors shadow-xs"
          >
            清空垃圾桶
          </button>
        )}
      </div>

      {/* Main View */}
      <div className="flex-1 p-6 overflow-y-auto">
        {trash.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Trash2 size={48} className="stroke-1 opacity-30 mb-2" />
            <span className="font-medium text-sm">垃圾桶為空</span>
            <span className="text-[11px] text-slate-500 mt-1">從「訪達」中刪除的項目將會顯示在這裡</span>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
            {trash.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-black/5 dark:border-white/5 group hover:border-blue-500/30"
              >
                <div className="w-12 h-12 flex items-center justify-center mb-2">
                  {item.type === 'folder' ? (
                    <Folder size={32} className="text-sky-400" />
                  ) : item.type === 'image' ? (
                    <ImageIcon size={30} className="text-pink-400" />
                  ) : (
                    <FileText size={30} className="text-slate-400" />
                  )}
                </div>
                <span className="text-[11px] font-medium text-center truncate max-w-full">
                  {item.name}
                </span>
                <span className="text-[9px] text-slate-400 font-mono mt-0.5">{item.size || '--'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
