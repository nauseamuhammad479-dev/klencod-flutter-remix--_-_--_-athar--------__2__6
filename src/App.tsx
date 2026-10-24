import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { APP_BACKGROUNDS } from './data/backgrounds';
import { BottomNavBar } from './components/BottomNavBar';
import { AudioPlayer } from './components/AudioPlayer';
import { HomeScreen } from './components/HomeScreen';
import { QuranScreen } from './components/QuranScreen';
import { RecitersLibrary } from './components/RecitersLibrary';
import { FavoritesScreen } from './components/FavoritesScreen';
import { AzkarScreen } from './components/AzkarScreen';
import { MasbahaScreen } from './components/MasbahaScreen';
import { PrayerScreen } from './components/PrayerScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { FlutterExportScreen } from './components/FlutterExportScreen';

const MainAppLayout: React.FC = () => {
  const { activeTab, selectedBgId, bgOpacity } = useApp();

  // Find active background asset
  const currentBg =
    APP_BACKGROUNDS.find((b) => b.id === selectedBgId) || APP_BACKGROUNDS[0];

  return (
    <div className="relative min-h-screen w-full bg-[#070709] text-slate-100 overflow-x-hidden">
      {/* 1. Global Dynamic Background Image Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={currentBg.url}
          alt={currentBg.name}
          className="w-full h-full object-cover transition-opacity duration-700 filter brightness-90"
        />

        {/* 2. Adjustable Luxury Dark & Gold Tint Overlay */}
        <div
          className="absolute inset-0 transition-all duration-300 backdrop-blur-[2px]"
          style={{
            backgroundColor: `rgba(8, 7, 10, ${bgOpacity})`,
          }}
        />

        {/* 3. Subtle Ambient Golden Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#08070a]/40 to-[#08070a]/90 pointer-events-none" />
      </div>

      {/* 4. Main Scrollable Viewport Content Container */}
      <main className="relative z-10 w-full min-h-screen px-4 pt-6 max-w-xl mx-auto">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'quran' && <QuranScreen />}
        {activeTab === 'reciters' && <RecitersLibrary />}
        {activeTab === 'favorites' && <FavoritesScreen />}
        {activeTab === 'azkar' && <AzkarScreen />}
        {activeTab === 'masbaha' && <MasbahaScreen />}
        {activeTab === 'prayer' && <PrayerScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
        {activeTab === 'flutter' && <FlutterExportScreen />}
      </main>

      {/* 5. Audio Player (Minimized Floating Bar & Expanded Fullscreen) */}
      <AudioPlayer />

      {/* 6. iOS Inspired Glassmorphism Bottom Navigation Dock */}
      <BottomNavBar />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
