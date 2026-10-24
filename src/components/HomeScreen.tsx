import React, { useState, useEffect } from 'react';
import {
  Clock,
  BookOpen,
  Users,
  Moon,
  Sparkles,
  Compass,
  Play,
  Volume2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Layers,
  Heart,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RECITERS } from '../data/reciters';
import { SURAHS } from '../data/surahs';
import { ReciterAvatar } from './ReciterAvatar';

function formatCountdown(sec: number): string {
  if (sec <= 0) return '00:00:00';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const HomeScreen: React.FC = () => {
  const {
    setActiveTab,
    prayerTimes,
    selectedCity,
    lastRead,
    currentReciter,
    currentSurah,
    isPlaying,
    playReciterSurah,
    togglePlay,
    favoriteReciters,
    setSelectedSurahForReading,
    triggerHaptic,
  } = useApp();

  // Real-time digital clock (hours:minutes:seconds)
  const [clockString, setClockString] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClockString(
        now.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const favoriteReciterObj =
    RECITERS.find((r) => favoriteReciters[0] === r.id) || RECITERS[0];

  return (
    <div className="space-y-6 pb-28 max-w-lg mx-auto">
      {/* 1. Header with Golden Brand ATHAR & Digital Clock / Hijri Date */}
      <div className="text-center space-y-2 pt-2">
        <div className="flex flex-col items-center justify-center">
          {/* Subtle Golden Emblem */}
          <div className="w-10 h-10 rounded-2xl p-[1px] bg-gradient-to-tr from-[#854d0e] via-[#d4af37] to-[#fef08a] flex items-center justify-center mb-1 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <span className="font-display font-bold text-lg text-black bg-gradient-to-tr from-[#d4af37] to-[#fef08a] w-full h-full rounded-2xl flex items-center justify-center">
              أ
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-wide gold-gradient-text">
            أَثَـــــر
          </h1>
          <span className="text-[11px] font-display font-bold tracking-[0.35em] text-[#e5c07b] uppercase opacity-90 -mt-1">
            A T H A R
          </span>
        </div>

        {/* Clock & Dates Pill */}
        <div className="inline-flex flex-col items-center gap-1 px-4 py-2 rounded-2xl bg-black/45 border border-[#d4af37]/25 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-bold text-[#fef08a] tabular-nums">
            <Clock className="w-4 h-4 text-[#d4af37]" />
            <span>{clockString}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span>{prayerTimes.hijriDate}</span>
            <span>·</span>
            <span>{prayerTimes.readableDate}</span>
          </div>
        </div>
      </div>

      {/* 2. Prayer Times Card with Live Countdown (Hurghada / Red Sea) */}
      <div
        onClick={() => {
          setActiveTab('prayer');
          triggerHaptic(15);
        }}
        role="button"
        tabIndex={0}
        className="glass-gold p-4 sm:p-5 rounded-3xl cursor-pointer relative overflow-hidden group hover:border-[#d4af37]/60 transition-all shadow-[0_12px_35px_rgba(0,0,0,0.65)]"
      >
        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#d4af37]/20 flex items-center justify-center text-[#fef08a]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-100 block">
                مواقيت الصلاة — {selectedCity.name}
              </span>
              <span className="text-[10px] text-slate-400">
                الهيئة المصرية العامة للمساحة
              </span>
            </div>
          </div>

          <span className="text-[11px] text-[#fef08a] font-semibold flex items-center gap-1 group-hover:translate-x-[-2px] transition-transform">
            <span>عرض الكل</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Live Countdown Row */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[11px] text-slate-400 block">
              الصلاة القادمة:
            </span>
            <h3 className="text-xl font-black text-[#fef08a] flex items-center gap-2 mt-0.5">
              <span>صلاة {prayerTimes.nextPrayer.name}</span>
              <span className="text-xs font-medium text-[#d4af37] px-2 py-0.5 rounded-full bg-[#d4af37]/15">
                {prayerTimes.nextPrayer.timeString}
              </span>
            </h3>
          </div>

          <div className="text-left">
            <span className="text-[10px] text-slate-400 block">
              الوقت المتبقي:
            </span>
            <span className="text-2xl font-black text-[#fef08a] tabular-nums tracking-wider">
              {formatCountdown(prayerTimes.remainingSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Last Read Bookmark Card */}
      <div
        onClick={() => {
          const s = SURAHS.find((item) => item.number === lastRead.surahNumber) || SURAHS[0];
          setSelectedSurahForReading(s);
          setActiveTab('quran');
          triggerHaptic(20);
        }}
        role="button"
        tabIndex={0}
        className="glass-gold p-4 rounded-3xl cursor-pointer group hover:border-[#d4af37]/60 transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#854d0e] to-[#d4af37] flex items-center justify-center text-black shadow-lg shadow-[#d4af37]/20 shrink-0">
            <Bookmark className="w-6 h-6 fill-current" />
          </div>

          <div>
            <span className="text-[11px] text-[#e5c07b] font-medium block">
              متابعة التلاوة والقراءة
            </span>
            <h4 className="text-base font-bold text-slate-100 group-hover:text-[#fef08a] transition-colors">
              سورة {lastRead.surahName} (الآية {lastRead.ayahNumber})
            </h4>
            <span className="text-[10px] text-slate-400">
              المصحف الشريف بالنص العثماني
            </span>
          </div>
        </div>

        <button className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#fef08a] text-black font-bold text-xs shadow-md group-hover:scale-105 active:scale-95 transition-all">
          متابعة القراءة
        </button>
      </div>

      {/* 4. Quick Shortcuts Grid (مكتبة القراء، المصحف، السبحة، الأذكار) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-[#e5c07b] px-1">
          الأقسام والخدمات السريعة
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Reciters Library Shortcut */}
          <div
            onClick={() => {
              setActiveTab('reciters');
              triggerHaptic(15);
            }}
            role="button"
            tabIndex={0}
            className="glass-gold p-4 rounded-3xl cursor-pointer hover:border-[#d4af37]/60 transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 text-[#fef08a] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-[#fef08a]">
                كبار القراء
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                تصميم مثلثي متدرج (30 قارئاً)
              </p>
            </div>
          </div>

          {/* Electronic Masbaha Shortcut */}
          <div
            onClick={() => {
              setActiveTab('masbaha');
              triggerHaptic(15);
            }}
            role="button"
            tabIndex={0}
            className="glass-gold p-4 rounded-3xl cursor-pointer hover:border-[#d4af37]/60 transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 text-[#fef08a] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-[#fef08a]">
                السبحة الإلكترونية
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                عداد لمسي بالاهتزاز وحفظ الدورات
              </p>
            </div>
          </div>

          {/* Quran Screen Shortcut */}
          <div
            onClick={() => {
              setActiveTab('quran');
              triggerHaptic(15);
            }}
            role="button"
            tabIndex={0}
            className="glass-gold p-4 rounded-3xl cursor-pointer hover:border-[#d4af37]/60 transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 text-[#fef08a] flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-[#fef08a]">
                المصحف الشريف
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                السور الـ114 كاملة والأجزاء
              </p>
            </div>
          </div>

          {/* Azkar Shortcut */}
          <div
            onClick={() => {
              setActiveTab('azkar');
              triggerHaptic(15);
            }}
            role="button"
            tabIndex={0}
            className="glass-gold p-4 rounded-3xl cursor-pointer hover:border-[#d4af37]/60 transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 text-[#fef08a] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-[#fef08a]">
                أذكار المسلم
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                الصباح والمساء والنوم
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Featured Reciter & Today's Recitation */}
      <div className="glass-gold p-4 sm:p-5 rounded-3xl space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <h4 className="text-xs font-bold text-slate-100">
              تلاوة مختارة اليوم بصوت الشيخ
            </h4>
          </div>
          <button
            onClick={() => {
              setActiveTab('reciters');
              triggerHaptic(15);
            }}
            className="text-xs text-[#d4af37] hover:underline"
          >
            المزيد من القراء ←
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ReciterAvatar
              reciter={favoriteReciterObj}
              sizeClass="w-14 h-14"
              showGlow={isPlaying && currentReciter.id === favoriteReciterObj.id}
            />
            <div>
              <h4 className="text-sm font-bold text-slate-100">
                القارئ {favoriteReciterObj.name}
              </h4>
              <p className="text-xs text-[#e5c07b] mt-0.5">
                سورة {currentSurah.name}
              </p>
              <p className="text-[10px] text-slate-400">
                {favoriteReciterObj.rewayah}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playReciterSurah(favoriteReciterObj, currentSurah);
              triggerHaptic(20);
            }}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#d4af37] to-[#fef08a] text-black shadow-lg active:scale-95 transition-transform"
          >
            {isPlaying && currentReciter.id === favoriteReciterObj.id ? (
              <Volume2 className="w-5 h-5 animate-pulse" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
