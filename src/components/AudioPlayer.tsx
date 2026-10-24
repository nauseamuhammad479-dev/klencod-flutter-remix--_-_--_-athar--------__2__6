import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  ChevronDown,
  ChevronUp,
  Heart,
  ListMusic,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AudioWaveform } from './AudioWaveform';
import { SURAHS } from '../data/surahs';
import { ReciterAvatar } from './ReciterAvatar';

function formatDuration(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const AudioPlayer: React.FC = () => {
  const {
    currentReciter,
    currentSurah,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    volume,
    isLooping,
    isPlayerExpanded,
    setIsPlayerExpanded,
    togglePlay,
    seekTo,
    setVolume,
    toggleLoop,
    nextSurah,
    prevSurah,
    playReciterSurah,
    favoriteSurahs,
    toggleFavoriteSurah,
    triggerHaptic,
    saveLastRead,
  } = useApp();

  const [showSurahDrawer, setShowSurahDrawer] = useState(false);
  const isSurahFavorited = favoriteSurahs.includes(currentSurah.number);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercent = parseFloat(e.target.value);
    const newTime = (newPercent / 100) * duration;
    seekTo(newTime);
  };

  return (
    <>
      {/* 1. Minimized Floating Audio Bar (Just Above iOS Dock) */}
      {!isPlayerExpanded && (
        <div className="fixed bottom-22 left-3 right-3 max-w-md mx-auto z-30 transition-all duration-300">
          <div
            onClick={() => setIsPlayerExpanded(true)}
            role="button"
            tabIndex={0}
            className="w-full h-16 rounded-2xl px-3 py-2 flex items-center justify-between cursor-pointer bg-[#0f0e12]/92 backdrop-blur-2xl border border-[#d4af37]/30 shadow-[0_8px_30px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(254,240,138,0.15)] group hover:border-[#d4af37]/50"
          >
            {/* Progress bar line top */}
            <div className="absolute top-0 left-3 right-3 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#aa771c] via-[#d4af37] to-[#fef08a] transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Reciter Avatar with Golden Ring */}
            <div className="flex items-center gap-3">
              <ReciterAvatar
                reciter={currentReciter}
                sizeClass="w-11 h-11"
                showGlow={isPlaying}
              />

              {/* Title & Reciter Info */}
              <div className="text-right overflow-hidden pr-1">
                <h4 className="text-sm font-bold text-slate-100 truncate group-hover:text-[#fef08a] transition-colors">
                  سورة {currentSurah.name}
                </h4>
                <p className="text-[11px] text-[#e5c07b] truncate mt-0.5">
                  القارئ {currentReciter.name}
                </p>
              </div>
            </div>

            {/* Mini Waveform & Controls */}
            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              <div className="hidden sm:block">
                <AudioWaveform isPlaying={isPlaying} barCount={12} className="h-8 px-1" />
              </div>

              {/* Play / Pause Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#d4af37] to-[#fef08a] text-[#0a0a0c] shadow-[0_0_12px_rgba(212,175,55,0.4)] active:scale-95 transition-transform"
                title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                {isBuffering ? (
                  <span className="w-4 h-4 border-2 border-[#0a0a0c] border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Expand Chevron */}
              <button
                onClick={() => setIsPlayerExpanded(true)}
                className="p-2 text-slate-400 hover:text-[#fef08a] transition-colors"
                title="توسيع المشغل"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Expanded Luxury Player Modal */}
      {isPlayerExpanded && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#070709]/95 backdrop-blur-3xl overflow-y-auto px-5 py-6 transition-all duration-300">
          {/* Ambient Golden Background Glow Orb */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#d4af37]/15 rounded-full blur-[100px] pointer-events-none -z-10" />

          {/* Top Header Bar */}
          <div className="flex items-center justify-between w-full max-w-md mx-auto pt-2">
            <button
              onClick={() => {
                setIsPlayerExpanded(false);
                triggerHaptic(15);
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-slate-300 hover:text-[#fef08a] transition-colors"
              title="تصغير المشغل"
            >
              <ChevronDown className="w-6 h-6" />
            </button>

            <div className="text-center">
              <span className="text-[11px] font-medium tracking-widest text-[#d4af37] uppercase">
                مشغل القرآن الكريم
              </span>
              <h3 className="text-base font-bold text-slate-100 mt-0.5">
                سورة {currentSurah.name}
              </h3>
            </div>

            <button
              onClick={() => {
                toggleFavoriteSurah(currentSurah.number);
                triggerHaptic(25);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                isSurahFavorited
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#fef08a]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-[#fef08a]'
              }`}
              title="إضافة إلى المفضلة"
            >
              <Heart className={`w-5 h-5 ${isSurahFavorited ? 'fill-current text-[#fef08a]' : ''}`} />
            </button>
          </div>

          {/* Centerpiece: Reciter Oval Portrait with Glowing Golden Bezel */}
          <div className="flex flex-col items-center justify-center my-auto py-6">
            <div className="relative group">
              {/* Golden Outer Decorative Star Ring */}
              <div
                className={`absolute -inset-4 rounded-full border border-[#d4af37]/30 transition-all duration-700 pointer-events-none ${
                  isPlaying ? 'rotate-180 scale-105 shadow-[0_0_30px_rgba(212,175,55,0.25)]' : ''
                }`}
              />

              {/* Main Avatar Container */}
              <ReciterAvatar
                reciter={currentReciter}
                sizeClass="w-48 h-48 sm:w-56 sm:h-56"
                showGlow={isPlaying}
              />
            </div>

            {/* Reciter & Surah Details */}
            <div className="text-center mt-6">
              <h2 className="text-2xl font-black text-slate-100 flex items-center justify-center gap-2">
                <span>سورة {currentSurah.name}</span>
                <span className="text-xs font-normal text-[#d4af37] px-2 py-0.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10">
                  {currentSurah.revelationTypeName}
                </span>
              </h2>
              <p className="text-base text-[#e5c07b] font-medium mt-1">
                القارئ الشيخ {currentReciter.name}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {currentReciter.rewayah} · {currentSurah.numberOfAyahs} آية · الجزء {currentSurah.startJuz}
              </p>
            </div>

            {/* Golden Animated Audio Waveform */}
            <div className="w-full max-w-sm mt-4">
              <AudioWaveform isPlaying={isPlaying} barCount={32} className="h-12" />
            </div>
          </div>

          {/* Bottom Control Deck */}
          <div className="w-full max-w-md mx-auto space-y-4 pb-4">
            {/* Draggable Timeline Seek Bar */}
            <div className="space-y-1.5">
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progressPercent || 0}
                  onChange={handleSeekChange}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#fef08a]"
                />
              </div>

              {/* Time displays */}
              <div className="flex justify-between text-xs text-slate-400 tabular-nums">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>

            {/* Playback Controls Row */}
            <div className="flex items-center justify-between px-2">
              {/* Loop Button */}
              <button
                onClick={toggleLoop}
                className={`p-3 rounded-full transition-colors ${
                  isLooping ? 'text-[#fef08a] bg-[#d4af37]/20 border border-[#d4af37]/40' : 'text-slate-400 hover:text-slate-200'
                }`}
                title={isLooping ? 'تكرار التلاوة مفعّل' : 'تفعيل تكرار التلاوة'}
              >
                <Repeat className="w-5 h-5" />
              </button>

              {/* Previous Surah */}
              <button
                onClick={() => {
                  prevSurah();
                  triggerHaptic(20);
                }}
                className="p-3 text-slate-300 hover:text-[#fef08a] active:scale-95 transition-all"
                title="السورة السابقة"
              >
                <SkipForward className="w-6 h-6" />
              </button>

              {/* Main Play / Pause Giant Button */}
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#d4af37] to-[#fef08a] text-[#08080a] shadow-[0_0_25px_rgba(212,175,55,0.5)] active:scale-90 transition-all"
                title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                {isBuffering ? (
                  <span className="w-6 h-6 border-3 border-[#08080a] border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current ml-1" />
                )}
              </button>

              {/* Next Surah */}
              <button
                onClick={() => {
                  nextSurah();
                  triggerHaptic(20);
                }}
                className="p-3 text-slate-300 hover:text-[#fef08a] active:scale-95 transition-all"
                title="السورة التالية"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              {/* Surah List Drawer Trigger */}
              <button
                onClick={() => setShowSurahDrawer(!showSurahDrawer)}
                className={`p-3 rounded-full transition-colors ${
                  showSurahDrawer ? 'text-[#fef08a] bg-[#d4af37]/20 border border-[#d4af37]/40' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="قائمة السور"
              >
                <ListMusic className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Control Row */}
            <div className="flex items-center justify-center gap-3 pt-2 text-slate-400 px-4">
              <button
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                className="hover:text-[#fef08a] transition-colors"
                title={volume === 0 ? 'كتم الصوت' : 'تشغيل الصوت'}
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-32 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              />
              <button
                onClick={() => {
                  saveLastRead(currentSurah.number, currentSurah.name, 1);
                }}
                className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 mr-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>حفظ موضع الاستماع</span>
              </button>
            </div>

            {/* Surah Picker Drawer */}
            {showSurahDrawer && (
              <div className="mt-4 p-3 rounded-2xl bg-black/70 border border-[#d4af37]/25 max-h-52 overflow-y-auto">
                <div className="text-xs font-bold text-[#fef08a] mb-2 px-1">
                  اختر السورة للاستماع:
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {SURAHS.map((s) => (
                    <button
                      key={s.number}
                      onClick={() => {
                        playReciterSurah(currentReciter, s);
                        setShowSurahDrawer(false);
                      }}
                      className={`text-right px-2.5 py-1.5 rounded-lg text-xs truncate transition-colors ${
                        s.number === currentSurah.number
                          ? 'bg-[#d4af37] text-black font-bold'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {s.number}. سورة {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
