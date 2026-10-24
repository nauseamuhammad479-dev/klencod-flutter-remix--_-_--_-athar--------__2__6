import React, { useState } from 'react';
import { Search, Play, Heart, ChevronLeft, Award, Sparkles, Filter, X, Volume2, Eye, Info } from 'lucide-react';
import { RECITERS, Reciter } from '../data/reciters';
import { SURAHS, SurahMeta } from '../data/surahs';
import { useApp } from '../context/AppContext';
import { ReciterAvatar } from './ReciterAvatar';

export const RecitersLibrary: React.FC = () => {
  const {
    currentReciter,
    isPlaying,
    playReciterSurah,
    favoriteReciters,
    toggleFavoriteReciter,
    triggerHaptic,
    currentSurah,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeReciterForModal, setActiveReciterForModal] = useState<Reciter | null>(null);
  const [viewMode, setViewMode] = useState<'triangle' | 'grid'>('triangle');
  const [previewPhotoSheikh, setPreviewPhotoSheikh] = useState<Reciter | null>(null);

  const categories = [
    { id: 'all', label: 'كافة القراء (30)' },
    { id: 'الرعيل الأول', label: 'الرعيل الأول' },
    { id: 'أئمة الحرمين', label: 'أئمة الحرمين' },
    { id: 'كبار القراء', label: 'مشاهير القراء' },
    { id: 'تلاوات خاشعة', label: 'تلاوات خاشعة' },
  ];

  const filteredReciters = RECITERS.filter((reciter) => {
    const matchesSearch =
      reciter.name.includes(searchQuery) ||
      reciter.englishName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || reciter.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Slices for the Triangular Pyramid layout:
  const tier1 = filteredReciters.slice(0, 1);
  const tier2 = filteredReciters.slice(1, 3);
  const tier3 = filteredReciters.slice(3, 6);
  const tier4 = filteredReciters.slice(6, 10);
  const tier5 = filteredReciters.slice(10, 15);
  const remainingReciters = filteredReciters.slice(15);

  const renderCard = (reciter: Reciter, size: 'large' | 'normal' | 'compact' = 'normal') => {
    const isCurrentPlaying = currentReciter.id === reciter.id && isPlaying;
    const isFav = favoriteReciters.includes(reciter.id);

    return (
      <div
        key={reciter.id}
        onClick={() => {
          setActiveReciterForModal(reciter);
          triggerHaptic(15);
        }}
        className={`group relative rounded-2xl p-3 flex flex-col items-center text-center cursor-pointer transition-all duration-300 ${
          isCurrentPlaying
            ? 'glass-gold-active scale-[1.02]'
            : 'glass-gold hover:border-[#d4af37]/60 hover:shadow-[0_8px_25px_rgba(212,175,55,0.2)]'
        }`}
      >
        {/* Top bar: Favorite & Category */}
        <div className="w-full flex items-center justify-between mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteReciter(reciter.id);
            }}
            className={`p-1.5 rounded-full border transition-colors ${
              isFav
                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#fef08a]'
                : 'bg-black/40 border-white/10 text-slate-400 hover:text-[#fef08a]'
            }`}
            title="إضافة للمفضلة"
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current text-[#fef08a]' : ''}`} />
          </button>

          <span className="text-[10px] text-[#e5c07b] font-medium px-2 py-0.5 rounded-md bg-[#d4af37]/10 border border-[#d4af37]/20">
            {reciter.category}
          </span>
        </div>

        {/* Reciter Avatar with Gold Bezel & Quick Photo View */}
        <div className="relative mb-2.5">
          <ReciterAvatar
            reciter={reciter}
            sizeClass={
              size === 'large'
                ? 'w-24 h-24 sm:w-28 sm:h-28'
                : size === 'compact'
                ? 'w-16 h-16'
                : 'w-20 h-20 sm:w-22 sm:h-22'
            }
            showGlow={isCurrentPlaying}
          />

          {/* Quick Play Floating Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playReciterSurah(reciter, currentSurah);
            }}
            className="absolute bottom-0 left-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#d4af37] to-[#fef08a] text-[#08080a] shadow-lg active:scale-90 transition-transform"
            title="تشغيل التلاوة فوراً"
          >
            {isCurrentPlaying ? (
              <Volume2 className="w-4 h-4 animate-pulse" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Reciter Name & Title */}
        <h4 className="text-sm font-bold text-slate-100 group-hover:text-[#fef08a] transition-colors leading-tight line-clamp-1">
          {reciter.name}
        </h4>
        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
          {reciter.title}
        </p>

        {/* Rewayah & Surahs Count */}
        <div className="mt-2 pt-2 w-full border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
          <span>{reciter.surahsCount} سورة</span>
          <span className="text-[#d4af37]">{reciter.rewayah.split(' ')[0]}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Top Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#fef08a] text-xs">
          <Award className="w-3.5 h-3.5" />
          <span>مكتبة أعلام التلاوة (30 قارئاً بصورهم الحقيقية)</span>
        </div>
        <h2 className="text-2xl font-black gold-gradient-text">
          كبار القراء بالترتيب الهرمي
        </h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          صور كبار القراء وأعلام دولة التلاوة في العالم الإسلامي مع الاستماع المباشر
        </p>
      </div>

      {/* Search & Layout View Toggles */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث عن اسم القارئ (مثلاً: الحصري، المنشاوي، العفاسي، المعيقلي)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-black/40 border border-[#d4af37]/30 text-slate-100 text-sm focus:outline-none focus:border-[#d4af37] placeholder-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filters and View Toggle */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCategory(c.id);
                  triggerHaptic(15);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-[#d4af37] text-[#08080a] font-bold shadow-md'
                    : 'bg-black/30 border border-white/10 text-slate-300 hover:border-[#d4af37]/40'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setViewMode(viewMode === 'triangle' ? 'grid' : 'triangle');
              triggerHaptic(20);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#fef08a] hover:bg-[#d4af37]/25 transition-colors shrink-0"
          >
            {viewMode === 'triangle' ? 'عرض الشبكة' : 'العرض الهرمي المثلث'}
          </button>
        </div>
      </div>

      {/* 1. Triangular Staggered Layout (الترتيب الهرمي المتدرج) */}
      {viewMode === 'triangle' && !searchQuery && selectedCategory === 'all' ? (
        <div className="space-y-6 pt-2">
          {/* Tier 1: Apex (1 reciter centered) */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#fef08a] font-bold tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              قمة الهرم — شيخ عموم المقارئ
            </span>
            <div className="w-full max-w-[240px]">
              {tier1.map((r) => renderCard(r, 'large'))}
            </div>
          </div>

          {/* Tier 2: 2 reciters */}
          <div className="space-y-2">
            <span className="text-[10px] text-[#d4af37] block text-center">المستوى الثاني — أعلام الترتيل والتجويد</span>
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {tier2.map((r) => renderCard(r, 'normal'))}
            </div>
          </div>

          {/* Tier 3: 3 reciters */}
          <div className="space-y-2">
            <span className="text-[10px] text-[#d4af37] block text-center">المستوى الثالث — أئمة الحرم والمسجد الكبير</span>
            <div className="grid grid-cols-3 gap-2.5 max-w-lg mx-auto">
              {tier3.map((r) => renderCard(r, 'compact'))}
            </div>
          </div>

          {/* Tier 4: 4 reciters */}
          <div className="space-y-2">
            <span className="text-[10px] text-[#d4af37] block text-center">المستوى الرابع — قراء الحرمين الشريفين</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {tier4.map((r) => renderCard(r, 'compact'))}
            </div>
          </div>

          {/* Tier 5: 5 reciters */}
          <div className="space-y-2">
            <span className="text-[10px] text-[#d4af37] block text-center">المستوى الخامس — رواد العصر الذهبي</span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {tier5.map((r) => renderCard(r, 'compact'))}
            </div>
          </div>

          {/* Remaining Reciters Cascading Section */}
          <div className="pt-4 border-t border-[#d4af37]/20">
            <h3 className="text-sm font-bold text-[#fef08a] mb-3 text-center">
              بقية نخبة القراء المعتمدين ({remainingReciters.length} قارئاً)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {remainingReciters.map((r) => renderCard(r, 'normal'))}
            </div>
          </div>
        </div>
      ) : (
        /* 2. Full Luxury Grid Layout */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {filteredReciters.map((r) => renderCard(r, 'normal'))}
          {filteredReciters.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400">
              لم يتم العثور على قراء يطابقون بحثك.
            </div>
          )}
        </div>
      )}

      {/* Reciter Detail & Surahs Modal */}
      {activeReciterForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md max-h-[85vh] rounded-3xl p-5 bg-[#0e0c10] border border-[#d4af37]/40 shadow-2xl flex flex-col overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setActiveReciterForModal(null)}
              className="absolute top-4 left-4 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Reciter Header Profile with Big Portrait */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <div
                onClick={() => setPreviewPhotoSheikh(activeReciterForModal)}
                className="cursor-pointer group relative"
                title="اضغط لتكبير صورة الشيخ"
              >
                <ReciterAvatar
                  reciter={activeReciterForModal}
                  sizeClass="w-16 h-16 sm:w-18 sm:h-18"
                />
                <span className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <Eye className="w-4 h-4 text-[#fef08a]" />
                </span>
              </div>

              <div className="text-right flex-1">
                <h3 className="text-lg font-bold text-slate-100">
                  {activeReciterForModal.name}
                </h3>
                <p className="text-xs text-[#e5c07b] mt-0.5">
                  {activeReciterForModal.title}
                </p>
                {activeReciterForModal.birthYear && (
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                    ({activeReciterForModal.birthYear})
                  </span>
                )}
              </div>
            </div>

            {/* Bio summary */}
            {activeReciterForModal.bio && (
              <div className="py-2.5 px-3 my-2 rounded-xl bg-black/50 border border-[#d4af37]/20 text-xs text-slate-300 leading-relaxed">
                {activeReciterForModal.bio}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-xs font-bold text-[#fef08a]">
                اختر سورة للاستماع بصوت الشيخ:
              </span>
              <button
                onClick={() => toggleFavoriteReciter(activeReciterForModal.id)}
                className="text-xs text-[#d4af37] hover:underline flex items-center gap-1"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    favoriteReciters.includes(activeReciterForModal.id)
                      ? 'fill-current text-[#fef08a]'
                      : ''
                  }`}
                />
                <span>
                  {favoriteReciters.includes(activeReciterForModal.id)
                    ? 'في المفضلة'
                    : 'إضافة للمفضلة'}
                </span>
              </button>
            </div>

            {/* Surahs Scrollable List */}
            <div className="overflow-y-auto space-y-1.5 pr-1 flex-1">
              {SURAHS.map((surah) => {
                const isThisPlaying =
                  currentReciter.id === activeReciterForModal.id &&
                  currentSurah.number === surah.number &&
                  isPlaying;

                return (
                  <div
                    key={surah.number}
                    onClick={() => {
                      playReciterSurah(activeReciterForModal, surah);
                      triggerHaptic(20);
                      setActiveReciterForModal(null);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                      isThisPlaying
                        ? 'bg-[#d4af37]/25 border border-[#d4af37]'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#d4af37] tabular-nums w-6 text-center">
                        {surah.number}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100">
                          سورة {surah.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {surah.revelationTypeName} · {surah.numberOfAyahs} آية
                        </span>
                      </div>
                    </div>

                    <button className="w-8 h-8 rounded-full flex items-center justify-center bg-[#d4af37]/20 text-[#fef08a] hover:bg-[#d4af37] hover:text-black transition-colors">
                      {isThisPlaying ? (
                        <Volume2 className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Full Photo Preview Modal */}
      {previewPhotoSheikh && (
        <div
          onClick={() => setPreviewPhotoSheikh(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm w-full rounded-3xl p-5 bg-[#0e0c10] border border-[#d4af37]/50 text-center space-y-4"
          >
            <button
              onClick={() => setPreviewPhotoSheikh(null)}
              className="absolute top-4 left-4 p-2 rounded-full bg-white/10 text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-3xl overflow-hidden border-2 border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              <img
                src={previewPhotoSheikh.avatar}
                alt={previewPhotoSheikh.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#fef08a]">
                الشيخ {previewPhotoSheikh.name}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {previewPhotoSheikh.title}
              </p>
              {previewPhotoSheikh.bio && (
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5">
                  {previewPhotoSheikh.bio}
                </p>
              )}
            </div>

            <button
              onClick={() => {
                playReciterSurah(previewPhotoSheikh, currentSurah);
                setPreviewPhotoSheikh(null);
                triggerHaptic(20);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#fef08a] text-black font-bold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>الاستماع لتلاوة الشيخ الآن</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
