import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  BedDouble,
  RotateCcw,
  BookOpen,
  Check,
} from 'lucide-react';
import { AZKAR_CATEGORIES, AZKAR_DATA, ZikrItem } from '../data/azkar';
import { useApp } from '../context/AppContext';

export const AzkarScreen: React.FC = () => {
  const { triggerHaptic, fontScale } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<
    'morning' | 'evening' | 'after_prayer' | 'sleep' | 'istighfar'
  >('morning');

  // Track progress of completed counts in localStorage
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('athar_azkar_counts');
    return saved ? JSON.parse(saved) : {};
  });

  const categoryAzkar = AZKAR_DATA.filter((z) => z.category === selectedCategory);

  const handleTapZikr = (zikr: ZikrItem) => {
    const current = counts[zikr.id] ?? 0;
    if (current < zikr.count) {
      const next = current + 1;
      const updated = { ...counts, [zikr.id]: next };
      setCounts(updated);
      localStorage.setItem('athar_azkar_counts', JSON.stringify(updated));

      if (next === zikr.count) {
        // Completion haptic
        triggerHaptic([30, 50, 30]);
      } else {
        triggerHaptic(20);
      }
    }
  };

  const handleResetCategory = () => {
    const updated = { ...counts };
    categoryAzkar.forEach((z) => {
      delete updated[z.id];
    });
    setCounts(updated);
    localStorage.setItem('athar_azkar_counts', JSON.stringify(updated));
    triggerHaptic(25);
  };

  // Calculate completion percentage for the current category
  const completedCount = categoryAzkar.filter(
    (z) => (counts[z.id] ?? 0) >= z.count
  ).length;
  const progressPercent =
    categoryAzkar.length > 0
      ? Math.round((completedCount / categoryAzkar.length) * 100)
      : 0;

  return (
    <div className="space-y-6 pb-28 max-w-lg mx-auto">
      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black gold-gradient-text">
          أذكار المسلم
        </h2>
        <p className="text-xs text-slate-300">
          حصن المسلم اليومي بنصوص صحيحة وعدادات تفاعلية
        </p>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {AZKAR_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                triggerHaptic(15);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#fef08a] text-black shadow-lg shadow-[#d4af37]/25'
                  : 'bg-black/40 border border-white/10 text-slate-300 hover:border-[#d4af37]/40'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Progress & Reset Bar */}
      <div className="glass-gold p-3.5 rounded-2xl flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#fef08a]">
            نسبة الإنجاز: {progressPercent}% ({completedCount} من {categoryAzkar.length})
          </span>
          <div className="w-36 h-1.5 bg-black/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#d4af37] to-[#fef08a] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleResetCategory}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          title="إعادة ضبط العدادات لهذا القسم"
        >
          <RotateCcw className="w-3 h-3" />
          <span>إعادة الضبط</span>
        </button>
      </div>

      {/* Azkar Cards Feed */}
      <div className="space-y-4">
        {categoryAzkar.map((zikr, idx) => {
          const currentTaps = counts[zikr.id] ?? 0;
          const isFinished = currentTaps >= zikr.count;

          return (
            <div
              key={zikr.id}
              className={`p-5 rounded-3xl transition-all duration-300 ${
                isFinished
                  ? 'glass-gold-subtle border-emerald-500/40 bg-emerald-950/10'
                  : 'glass-gold'
              }`}
            >
              {/* Top Zikr Meta */}
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2 text-xs">
                <span className="text-[#d4af37] font-bold">الذكر {idx + 1}</span>
                <span className="text-slate-400 text-[11px]">{zikr.reference}</span>
              </div>

              {/* Main Arabic Text */}
              <p
                className="font-quran text-slate-100 text-justify leading-[2.3] mb-4 select-none"
                style={{ fontSize: `${1.15 * fontScale}rem` }}
              >
                {zikr.text}
              </p>

              {/* Virtue Box */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-[#d4af37]/20 text-xs text-[#e5c07b] flex items-start gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{zikr.virtue}</span>
              </div>

              {/* Bottom Interactive Tap Counter */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">
                  التكرار المطلوب: <strong className="text-slate-200">{zikr.count}</strong>
                </span>

                <button
                  onClick={() => handleTapZikr(zikr)}
                  disabled={isFinished}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm select-none transition-all duration-150 active:scale-95 ${
                    isFinished
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 cursor-default'
                      : 'bg-gradient-to-r from-[#d4af37] to-[#fef08a] text-black shadow-lg shadow-[#d4af37]/30 hover:shadow-[#d4af37]/50'
                  }`}
                >
                  {isFinished ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>اكتمل الذكر</span>
                    </>
                  ) : (
                    <>
                      <span>المتبقي:</span>
                      <span className="tabular-nums font-black text-base">
                        {zikr.count - currentTaps}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
