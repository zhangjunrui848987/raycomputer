/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { OSProvider, useOS } from './context/OSContext';
import { MenuBar } from './components/menubar/MenuBar';
import { Dock } from './components/dock/Dock';
import { Desktop } from './components/desktop/Desktop';
import { Window } from './components/window/Window';
import { Launchpad } from './components/system/Launchpad';
import { LockScreen } from './components/system/LockScreen';

// Applications
import { FinderApp } from './components/apps/FinderApp';
import { SafariApp } from './components/apps/SafariApp';
import { NotesApp } from './components/apps/NotesApp';
import { TerminalApp } from './components/apps/TerminalApp';
import { CalculatorApp } from './components/apps/CalculatorApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { PhotosApp } from './components/apps/PhotosApp';
import { MusicApp } from './components/apps/MusicApp';
import { MessagesApp } from './components/apps/MessagesApp';
import { MapsApp } from './components/apps/MapsApp';
import { AppStoreApp } from './components/apps/AppStoreApp';
import { SiriApp } from './components/apps/SiriApp';
import { TrashApp } from './components/apps/TrashApp';

const DesktopWorkspace: React.FC = () => {
  const { windows } = useOS();

  const renderAppContent = (win: any) => {
    switch (win.appId) {
      case 'finder':
        return <FinderApp />;
      case 'safari':
        return <SafariApp />;
      case 'notes':
        return <NotesApp />;
      case 'terminal':
        return <TerminalApp />;
      case 'calculator':
        return <CalculatorApp />;
      case 'settings':
        return <SettingsApp initialTab={win.extraState?.tab} />;
      case 'photos':
        return <PhotosApp />;
      case 'music':
        return <MusicApp />;
      case 'messages':
        return <MessagesApp />;
      case 'maps':
        return <MapsApp />;
      case 'appstore':
        return <AppStoreApp />;
      case 'siri':
        return <SiriApp />;
      case 'trash':
        return <TrashApp />;
      default:
        return <FinderApp />;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans">
      {/* Desktop Background & Icons */}
      <Desktop />

      {/* Floating System Windows */}
      {windows.map((win) => (
        <Window key={win.id} win={win}>
          {renderAppContent(win)}
        </Window>
      ))}

      {/* Top Menu Bar */}
      <MenuBar />

      {/* Bottom Dock */}
      <Dock />

      {/* Launchpad Overlay */}
      <Launchpad />

      {/* Lock Screen & Sleep State */}
      <LockScreen />
    </div>
  );
};

export default function App() {
  return (
    <OSProvider>
      <DesktopWorkspace />
    </OSProvider>
  );
}
