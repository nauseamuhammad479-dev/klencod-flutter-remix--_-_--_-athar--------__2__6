import React, { useState } from 'react';
import { Heart, User, BookOpen, Bookmark, Play, Volume2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RECITERS } from '../data/reciters';
import { SURAHS } from '../data/surahs';
import { ReciterAvatar } from './ReciterAvatar';

export const FavoritesScreen: React.FC = () => {
  const {
    favoriteReciters,
    toggleFavoriteReciter,
    favoriteSurahs,
    toggleFavoriteSurah,
    bookmarkedAyahs,
    toggleBookmarkAyah,
    playReciterSurah,
    currentReciter,
    currentSurah,
    setSelectedSurahForReading,
    setActiveTab,
    triggerHaptic,
  } = useApp();

  const [activeTab, setActiveTabState] = useState<'reciters' | 'surahs' | 'ayahs'>('reciters');

  const recitersList = RECITERS.filter((r) => favoriteReciters.includes(r.id));
  const surahsList = SURAHS.filter((s) => favoriteSurahs.includes(s.number));

  return (
    <div className="space-y-6 pb-28 max-w-lg mx-auto">
      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black gold-gradient-text">
          المفضلة والمحفوظات
        </h2>
        <p className="text-xs text-slate-300">
          قراؤك وسورك وآياتك المفضلة محفوظة للوصول السريع
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-around p-1 rounded-2xl bg-black/40 border border-white/10">
        <button
          onClick={() => {
            setActiveTabState('reciters');
            triggerHaptic(15);
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'reciters'
              ? 'bg-[#d4af37] text-black shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          القراء ({recitersList.length})
        </button>
        <button
          onClick={() => {
            setActiveTabState('surahs');
            triggerHaptic(15);
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'surahs'
              ? 'bg-[#d4af37] text-black shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          السور ({surahsList.length})
        </button>
        <button
          onClick={() => {
            setActiveTabState('ayahs');
            triggerHaptic(15);
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'ayahs'
              ? 'bg-[#d4af37] text-black shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          الآيات ({bookmarkedAyahs.length})
        </button>
      </div>

      {/* 1. Favorite Reciters List */}
      {activeTab === 'reciters' && (
        <div className="space-y-2.5">
          {recitersList.map((reciter) => (
            <div
              key={reciter.id}
              className="glass-gold p-3 rounded-2xl flex items-center justify-between group hover:border-[#d4af37]/60 transition-all"
            >
              <div className="flex items-center gap-3">
                <ReciterAvatar reciter={reciter} sizeClass="w-12 h-12" />
                <div>
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-[#fef08a]">
                    الشيخ {reciter.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {reciter.title} · {reciter.rewayah}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playReciterSurah(reciter, currentSurah);
                    triggerHaptic(20);
                  }}
                  className="p-2 rounded-full bg-[#d4af37]/20 hover:bg-[#d4af37] text-[#fef08a] hover:text-black transition-colors"
                  title="استماع"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
                <button
                  onClick={() => {
                    toggleFavoriteReciter(reciter.id);
                    triggerHaptic(20);
                  }}
                  className="p-2 text-rose-400 hover:text-rose-300 transition-colors"
                  title="حذف من المفضلة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {recitersList.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              لم تقم بإضافة أي قارئ إلى المفضلة بعد.
            </div>
          )}
        </div>
      )}

      {/* 2. Favorite Surahs List */}
      {activeTab === 'surahs' && (
        <div className="space-y-2.5">
          {surahsList.map((surah) => (
            <div
              key={surah.number}
              className="glass-gold p-3 rounded-2xl flex items-center justify-between group hover:border-[#d4af37]/60 transition-all"
            >
              <div
                onClick={() => {
                  setSelectedSurahForReading(surah);
                  setActiveTab('quran');
                  triggerHaptic(15);
                }}
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                <div className="w-9 h-9 rounded-xl border border-[#d4af37]/30 bg-black/40 flex items-center justify-center text-xs font-bold text-[#fef08a] tabular-nums">
                  {surah.number}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-[#fef08a]">
                    سورة {surah.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {surah.revelationTypeName} · {surah.numberOfAyahs} آية · الجزء {surah.startJuz}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playReciterSurah(currentReciter, surah);
                    triggerHaptic(20);
                  }}
                  className="p-2 rounded-full bg-[#d4af37]/20 hover:bg-[#d4af37] text-[#fef08a] hover:text-black transition-colors"
                  title="استماع"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    toggleFavoriteSurah(surah.number);
                    triggerHaptic(20);
                  }}
                  className="p-2 text-rose-400 hover:text-rose-300 transition-colors"
                  title="حذف من المفضلة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {surahsList.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              لم تقم بإضافة أي سورة إلى المفضلة بعد.
            </div>
          )}
        </div>
      )}

      {/* 3. Bookmarked Ayahs */}
      {activeTab === 'ayahs' && (
        <div className="space-y-3">
          {bookmarkedAyahs.map((item, idx) => {
            const surah = SURAHS.find((s) => s.number === item.surah);

            return (
              <div
                key={idx}
                className="glass-gold p-4 rounded-3xl space-y-2 border-[#d4af37]/30"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-[#fef08a]">
                    سورة {surah?.name || item.surah} (الآية {item.ayah})
                  </span>
                  <button
                    onClick={() => {
                      toggleBookmarkAyah(item.surah, item.ayah, item.text);
                      triggerHaptic(20);
                    }}
                    className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>إزالة</span>
                  </button>
                </div>

                <p className="font-quran text-slate-100 text-base leading-relaxed pt-1">
                  {item.text}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      if (surah) {
                        setSelectedSurahForReading(surah);
                        setActiveTab('quran');
                        triggerHaptic(15);
                      }
                    }}
                    className="text-xs text-[#d4af37] hover:underline"
                  >
                    فتح السورة الكاملة ←
                  </button>
                </div>
              </div>
            );
          })}

          {bookmarkedAyahs.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              لم تقم بحفظ أي آية بعد. يمكنك حفظ الآيات أثناء قراءة المصحف بالضغط على رقم الآية.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
