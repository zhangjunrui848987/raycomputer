import React from 'react';
import { FileItem } from '../../types';
import { Folder, FileText, Image as ImageIcon, HardDrive } from 'lucide-react';

interface DesktopIconProps {
  file: FileItem;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  file,
  isSelected,
  onClick,
  onDoubleClick,
}) => {
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`flex flex-col items-center p-2 rounded-xl cursor-pointer group transition-all w-24 select-none ${
        isSelected
          ? 'bg-blue-600/30 border border-blue-400/50 backdrop-blur-xs'
          : 'hover:bg-white/15 dark:hover:bg-black/20 border border-transparent'
      }`}
    >
      <div className="w-14 h-14 flex items-center justify-center mb-1 transition-transform group-hover:scale-105 filter drop-shadow-md">
        {file.icon === 'hard-drive' ? (
          <div className="w-12 h-12 rounded-xl bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-100 shadow-lg border border-white/20">
            <HardDrive size={26} />
          </div>
        ) : file.type === 'folder' ? (
          <div className="w-12 h-10 rounded-lg bg-sky-400 flex items-center justify-center text-white shadow-lg">
            <Folder size={28} className="fill-sky-100 text-sky-600" />
          </div>
        ) : file.type === 'image' && file.imageSrc ? (
          <img
            src={file.imageSrc}
            alt={file.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-xl object-cover shadow-lg border border-white/20"
          />
        ) : (
          <div className="w-11 h-14 rounded-md bg-white/95 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center">
            <FileText size={22} className="text-slate-600 dark:text-slate-300" />
          </div>
        )}
      </div>

      <span
        className={`text-[11px] font-medium text-center line-clamp-2 px-1.5 py-0.5 rounded leading-tight break-all text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${
          isSelected ? 'bg-blue-600 text-white rounded' : ''
        }`}
      >
        {file.name}
      </span>
    </div>
  );
};
