export type AppId = 
  | 'finder'
  | 'safari'
  | 'messages'
  | 'mail'
  | 'maps'
  | 'photos'
  | 'music'
  | 'notes'
  | 'terminal'
  | 'calculator'
  | 'settings'
  | 'appstore'
  | 'siri'
  | 'trash';

export interface AppDefinition {
  id: AppId;
  name: string;
  icon: string; // Lucide icon or custom SVG
  defaultWidth: number;
  defaultHeight: number;
  minWidth?: number;
  minHeight?: number;
  isDockPinned?: boolean;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMinimized: boolean;
  isMaximized: boolean;
  prevBounds?: { x: number; y: number; width: number; height: number };
  zIndex: number;
  extraState?: any;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'image' | 'app';
  content?: string;
  size?: string;
  updatedAt: string;
  parentId?: string; // root desktop is 'desktop', or folder id
  icon?: string;
  appId?: AppId;
  imageSrc?: string;
}

export interface NoteItem {
  id: string;
  folderId: string;
  title: string;
  content: string;
  updatedAt: string;
  isPinned?: boolean;
}

export interface WallpaperItem {
  id: string;
  name: string;
  category: 'Abstract' | 'Landscape' | 'Dark' | 'Dynamic';
  url: string;
  thumbnail: string;
}
