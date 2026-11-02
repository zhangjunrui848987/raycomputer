import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { FileItem, AppId } from '../../types';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  HardDrive, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  LayoutGrid, 
  List, 
  Columns3, 
  Search, 
  Plus, 
  Download, 
  Laptop, 
  FileCode,
  Tag,
  Eye
} from 'lucide-react';

export const FinderApp: React.FC = () => {
  const { files, createFile, deleteFile, openApp, trash } = useOS();
  const [currentFolder, setCurrentFolder] = useState<string>('desktop');
  const [folderHistory, setFolderHistory] = useState<string[]>(['desktop']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  // Navigate folder
  const navigateTo = (folderId: string) => {
    const newHistory = folderHistory.slice(0, historyIndex + 1);
    newHistory.push(folderId);
    setFolderHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentFolder(folderId);
    setSelectedFileId(null);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentFolder(folderHistory[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < folderHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentFolder(folderHistory[historyIndex + 1]);
    }
  };

  // Filter files
  const displayFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (searchQuery) return matchesSearch;
    return f.parentId === currentFolder;
  });

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      navigateTo(file.id);
    } else if (file.type === 'image') {
      openApp('photos');
    } else {
      openApp('notes', { title: file.name, extraState: { content: file.content } });
    }
  };

  const handleCreateFolder = () => {
    const count = files.filter((f) => f.name.startsWith('未命名資料夾')).length;
    const name = count === 0 ? '未命名資料夾' : `未命名資料夾 ${count + 1}`;
    createFile({
      name,
      type: 'folder',
      parentId: currentFolder,
      icon: 'folder',
    });
  };

  const handleCreateDoc = () => {
    const count = files.filter((f) => f.name.startsWith('未命名文件')).length;
    const name = count === 0 ? '未命名文件.txt' : `未命名文件 ${count + 1}.txt`;
    createFile({
      name,
      type: 'file',
      parentId: currentFolder,
      content: '在此輸入文字內容...',
      icon: 'file-text',
    });
  };

  return (
    <div className="flex h-full select-none text-slate-800 dark:text-slate-100 text-xs">
      {/* Left Sidebar */}
      <div className="w-48 bg-slate-100/70 dark:bg-slate-800/60 border-r border-black/10 dark:border-white/10 p-3 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          {/* Favorites */}
          <div>
            <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              常用項目
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => navigateTo('desktop')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  currentFolder === 'desktop'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Laptop size={14} className={currentFolder === 'desktop' ? 'text-white' : 'text-blue-500'} />
                <span>桌面</span>
              </button>
              <button
                onClick={() => navigateTo('f3')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  currentFolder === 'f3'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <FileText size={14} className={currentFolder === 'f3' ? 'text-white' : 'text-blue-500'} />
                <span>文件</span>
              </button>
              <button
                onClick={() => openApp('photos')}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <ImageIcon size={14} className="text-pink-500" />
                <span>照片圖庫</span>
              </button>
              <button
                onClick={() => openApp('trash')}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <Trash2 size={14} className="text-slate-400" />
                <span>垃圾桶 ({trash.length})</span>
              </button>
            </div>
          </div>

          {/* Locations */}
          <div>
            <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              位置
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => navigateTo('root')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  currentFolder === 'root'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <HardDrive size={14} className={currentFolder === 'root' ? 'text-white' : 'text-slate-500'} />
                <span>Macintosh HD</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              標籤
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 px-2.5 py-1 text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>工作</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>個人</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>重要</span>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Bar */}
        <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>儲存空間</span>
            <span className="font-mono">688 GB 可用</span>
          </div>
          <div className="w-full bg-slate-300 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[32%]" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900">
        {/* Finder Toolbar */}
        <div className="h-10 px-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between gap-3 bg-white/70 dark:bg-slate-900/70 shrink-0">
          {/* Navigation Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={goBack}
              disabled={historyIndex === 0}
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={goForward}
              disabled={historyIndex >= folderHistory.length - 1}
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ArrowRight size={14} />
            </button>
            <span className="text-xs font-semibold ml-2">
              {currentFolder === 'desktop' ? '桌面' : currentFolder === 'root' ? 'Macintosh HD' : '文件目錄'}
            </span>
          </div>

          {/* View mode & Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-black/5 dark:border-white/5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-xs' : 'text-slate-500'}`}
                title="圖像顯示"
              >
                <LayoutGrid size={13} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-xs' : 'text-slate-500'}`}
                title="列表顯示"
              >
                <List size={13} />
              </button>
            </div>

            <button
              onClick={handleCreateFolder}
              className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-black/5 dark:border-white/5 font-medium flex items-center gap-1 transition-colors"
              title="新增資料夾"
            >
              <Plus size={13} /> 新資料夾
            </button>

            <button
              onClick={handleCreateDoc}
              className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-black/5 dark:border-white/5 font-medium flex items-center gap-1 transition-colors"
              title="新增文件"
            >
              <FileCode size={13} /> 新建文件
            </button>

            {selectedFileId && (
              <button
                onClick={() => deleteFile(selectedFileId)}
                className="px-2 py-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 font-medium flex items-center gap-1 transition-colors"
                title="移至垃圾桶"
              >
                <Trash2 size={13} /> 刪除
              </button>
            )}

            {/* Search Input */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="搜尋"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-36 pl-7 pr-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-black/5 dark:border-white/5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Files View */}
        <div 
          onClick={() => setSelectedFileId(null)}
          className="flex-1 p-4 overflow-y-auto"
        >
          {displayFiles.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Folder size={44} className="stroke-1 opacity-40 mb-2" />
              <span>資料夾為空</span>
              <span className="text-[11px] text-slate-500 mt-1">點擊上方「新資料夾」或「新建文件」新增內容</span>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
              {displayFiles.map((file) => {
                const isSelected = selectedFileId === file.id;
                return (
                  <div
                    key={file.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFileId(file.id);
                    }}
                    onDoubleClick={() => handleDoubleClick(file)}
                    className={`flex flex-col items-center p-2 rounded-xl cursor-pointer group transition-all ${
                      isSelected
                        ? 'bg-blue-600/15 border border-blue-500/40'
                        : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="w-14 h-14 flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105">
                      {file.type === 'folder' ? (
                        <div className="w-12 h-10 rounded-lg bg-sky-400 flex items-center justify-center text-white shadow-sm">
                          <Folder size={26} className="fill-sky-100 text-sky-600" />
                        </div>
                      ) : file.type === 'image' ? (
                        file.imageSrc ? (
                          <img
                            src={file.imageSrc}
                            alt={file.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover shadow-sm border border-black/10"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-pink-500 flex items-center justify-center text-white shadow-sm">
                            <ImageIcon size={24} />
                          </div>
                        )
                      ) : (
                        <div className="w-10 h-12 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-sm flex items-center justify-center">
                          <FileText size={22} className="text-slate-600 dark:text-slate-300" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-center line-clamp-2 px-1 break-all leading-tight">
                      {file.name}
                    </span>
                    {file.size && (
                      <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {file.size}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10 text-slate-400">
                  <th className="pb-2 font-medium">名稱</th>
                  <th className="pb-2 font-medium">修改日期</th>
                  <th className="pb-2 font-medium">大小</th>
                  <th className="pb-2 font-medium">種類</th>
                </tr>
              </thead>
              <tbody>
                {displayFiles.map((file) => {
                  const isSelected = selectedFileId === file.id;
                  return (
                    <tr
                      key={file.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFileId(file.id);
                      }}
                      onDoubleClick={() => handleDoubleClick(file)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <td className="py-2 px-2 flex items-center gap-2 font-medium">
                        {file.type === 'folder' ? (
                          <Folder size={15} className={isSelected ? 'text-white' : 'text-sky-500'} />
                        ) : file.type === 'image' ? (
                          <ImageIcon size={15} className={isSelected ? 'text-white' : 'text-pink-500'} />
                        ) : (
                          <FileText size={15} className={isSelected ? 'text-white' : 'text-slate-500'} />
                        )}
                        <span>{file.name}</span>
                      </td>
                      <td className="py-2 px-2 text-slate-500 dark:text-slate-400">{file.updatedAt}</td>
                      <td className="py-2 px-2 font-mono text-slate-500 dark:text-slate-400">{file.size || '--'}</td>
                      <td className="py-2 px-2 text-slate-500 dark:text-slate-400">
                        {file.type === 'folder' ? '資料夾' : file.type === 'image' ? '影像' : '文件'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer status bar */}
        <div className="h-6 px-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 shrink-0">
          <span>{displayFiles.length} 個項目</span>
          <span>Macintosh HD · 688.2 GB 可用</span>
        </div>
      </div>
    </div>
  );
};
