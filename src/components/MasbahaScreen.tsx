import React, { useState } from 'react';
import { RotateCcw, Volume2, Sparkles, Check, ChevronDown, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MasbahaScreen: React.FC = () => {
  const {
    tasbeehCount,
    tasbeehPhrase,
    setTasbeehPhrase,
    tasbeehLaps,
    tasbeehTotal,
    incrementTasbeeh,
    resetTasbeeh,
    hapticsEnabled,
    setHapticsEnabled,
    triggerHaptic,
  } = useApp();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [targetCount, setTargetCount] = useState<33 | 99 | 100>(33);
  const [isPressing, setIsPressing] = useState(false);

  const popularPhrases = [
    'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
    'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    'اللَّهُ أَكْبَرُ كَبِيراً',
    'لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    'سُبْحَانَ اللَّهِ',
  ];

  const handleDialPress = () => {
    setIsPressing(true);
    incrementTasbeeh();
    setTimeout(() => setIsPressing(false), 150);
  };

  const progressPercent = Math.min((tasbeehCount / targetCount) * 100, 100);

  return (
    <div className="space-y-6 pb-28 max-w-md mx-auto">
      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black gold-gradient-text">
          السبحة الإلكترونية
        </h2>
        <p className="text-xs text-slate-300">
          تسبيح وذكر الله بتجربة لمسية فاخرة مع حفظ تلقائي واهتزاز تفاعلي
        </p>
      </div>

      {/* Phrase Selector */}
      <div className="glass-gold p-4 rounded-3xl space-y-3">
        <label className="text-xs font-bold text-[#fef08a] block">
          صيغة الذكر المختارة:
        </label>
        <div className="relative">
          <select
            value={tasbeehPhrase}
            onChange={(e) => {
              setTasbeehPhrase(e.target.value);
              triggerHaptic(15);
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-black/60 border border-[#d4af37]/30 text-slate-100 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#d4af37] appearance-none"
          >
            {popularPhrases.map((phrase, idx) => (
              <option key={idx} value={phrase} className="bg-[#121014] text-slate-100">
                {phrase}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Target limit tabs: 33 / 99 / 100 */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-slate-400">دورة التسبيح:</span>
          <div className="flex items-center gap-1.5">
            {[33, 99, 100].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTargetCount(t as 33 | 99 | 100);
                  triggerHaptic(15);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  targetCount === t
                    ? 'bg-[#d4af37] text-black'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Big Circular Tactile Dial */}
      <div className="flex flex-col items-center justify-center py-4">
        <div
          onClick={handleDialPress}
          role="button"
          tabIndex={0}
          className={`relative w-64 h-64 sm:w-72 sm:h-72 rounded-full cursor-pointer select-none transition-all duration-150 p-3 flex flex-col items-center justify-center ${
            isPressing ? 'scale-[0.96]' : 'hover:scale-[1.01]'
          }`}
          style={{
            background:
              'radial-gradient(circle, rgba(28,24,20,0.95) 0%, rgba(12,10,12,0.98) 70%, rgba(5,5,5,1) 100%)',
            boxShadow: isPressing
              ? '0 0 45px rgba(212,175,55,0.4), inset 0 0 30px rgba(0,0,0,0.9)'
              : '0 15px 45px rgba(0,0,0,0.85), inset 0 2px 4px rgba(254,240,138,0.2), 0 0 25px rgba(212,175,55,0.18)',
            border: '2px solid rgba(212,175,55,0.4)',
          }}
        >
          {/* Circular SVG Progress Ring */}
          <svg className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] -rotate-90 pointer-events-none">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-white/5"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              stroke="url(#dialGold)"
              strokeWidth="4"
              strokeDasharray="276"
              strokeDashoffset={276 - (276 * progressPercent) / 100}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-300"
            />
            <defs>
              <linearGradient id="dialGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner Golden Concentric Ring */}
          <div className="absolute inset-5 rounded-full border border-[#d4af37]/20 pointer-events-none" />

          {/* Current Count Display */}
          <span className="text-[11px] text-[#e5c07b] font-medium tracking-widest uppercase mb-1">
            العدد الحالي
          </span>
          <span className="text-6xl sm:text-7xl font-black text-[#fef08a] tabular-nums drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)]">
            {tasbeehCount}
          </span>
          <span className="text-xs text-slate-400 mt-1">
            من أصل <span className="text-[#d4af37] font-bold">{targetCount}</span>
          </span>

          {/* Tap Prompt */}
          <span className="mt-3 text-[10px] text-[#d4af37]/80 tracking-wide font-medium bg-[#d4af37]/10 px-3 py-0.5 rounded-full border border-[#d4af37]/20">
            المس للزيادة
          </span>
        </div>
      </div>

      {/* Stats Strip: Laps & Lifetime Total */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-gold p-3 rounded-2xl text-center">
          <span className="text-[11px] text-slate-400 block">الدورات المكتملة</span>
          <span className="text-2xl font-bold text-[#fef08a] tabular-nums">
            {tasbeehLaps}
          </span>
        </div>

        <div className="glass-gold p-3 rounded-2xl text-center">
          <span className="text-[11px] text-slate-400 block">إجمالي التسبيحات</span>
          <span className="text-2xl font-bold text-[#d4af37] tabular-nums">
            {tasbeehTotal}
          </span>
        </div>
      </div>

      {/* Actions: Vibration toggle & Reset */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => {
            setHapticsEnabled(!hapticsEnabled);
            triggerHaptic(20);
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
            hapticsEnabled
              ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#fef08a]'
              : 'bg-white/5 border-white/10 text-slate-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>الاهتزاز اللمسي: {hapticsEnabled ? 'مفعّل' : 'معطّل'}</span>
        </button>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/30 border border-rose-900/40 hover:bg-rose-900/40 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>تصفير العداد</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl p-5 bg-[#0e0c10] border border-[#d4af37]/40 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              تصفير عداد السبحة؟
            </h3>
            <p className="text-xs text-slate-300">
              هل أنت متأكد من تصفير العداد الحالي؟ لن يتم مسح إجمالي التسبيحات الكلي المحفوظ.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  resetTasbeeh();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
              >
                نعم، تصفير
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
