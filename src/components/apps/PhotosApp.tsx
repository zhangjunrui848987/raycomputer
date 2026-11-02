import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { WALLPAPERS } from '../../utils/wallpaper';
import { 
  Image as ImageIcon, 
  Heart, 
  Calendar, 
  Folder, 
  Monitor, 
  Share2, 
  ZoomIn, 
  X,
  Check
} from 'lucide-react';

export const PhotosApp: React.FC = () => {
  const { setWallpaper, wallpaper } = useOS();
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  const photos = WALLPAPERS.filter((w) => !w.url.startsWith('linear-gradient'));

  return (
    <div className="flex h-full select-none text-slate-800 dark:text-slate-100 text-xs">
      {/* Sidebar */}
      <div className="w-48 bg-slate-100/70 dark:bg-slate-800/60 border-r border-black/10 dark:border-white/10 p-3 flex flex-col gap-4 shrink-0">
        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
            圖庫
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => setSelectedAlbum('all')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                selectedAlbum === 'all'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <ImageIcon size={14} className={selectedAlbum === 'all' ? 'text-white' : 'text-pink-500'} />
              <span>所有照片</span>
            </button>
            <button
              onClick={() => setSelectedAlbum('favorites')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                selectedAlbum === 'favorites'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Heart size={14} className={selectedAlbum === 'favorites' ? 'text-white' : 'text-rose-500'} />
              <span>常用項目</span>
            </button>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
            相簿
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => setSelectedAlbum('wallpapers')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                selectedAlbum === 'wallpapers'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Folder size={14} className="text-amber-500" />
              <span>精選桌布 ({photos.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 min-w-0">
        <div className="h-10 px-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between shrink-0">
          <span className="font-semibold text-xs">照片 ({photos.length})</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">按兩下檢視大圖並設為桌布</span>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800 cursor-pointer border border-black/5 dark:border-white/5 shadow-xs"
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5 text-white">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium truncate">{photo.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setWallpaper(photo.url);
                      }}
                      className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[10px] backdrop-blur-xs flex items-center gap-1"
                    >
                      <Monitor size={10} /> 設為桌布
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden flex flex-col border border-white/20 shadow-2xl text-white"
          >
            <div className="h-10 px-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <span className="font-medium text-xs">{selectedPhoto.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setWallpaper(selectedPhoto.url);
                    alert('已成功設定為桌面桌布！');
                  }}
                  className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Monitor size={13} /> 設為桌面桌布
                </button>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex items-center justify-center p-4 bg-black/60">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
