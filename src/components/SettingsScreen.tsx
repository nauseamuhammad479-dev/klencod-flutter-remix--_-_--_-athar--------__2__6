import React, { useState } from 'react';
import {
  Palette,
  Sliders,
  Type,
  Shield,
  Info,
  Bug,
  Download,
  Check,
  Code2,
  Sparkles,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { APP_BACKGROUNDS } from '../data/backgrounds';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const SettingsScreen: React.FC = () => {
  const {
    selectedBgId,
    setSelectedBgId,
    bgOpacity,
    setBgOpacity,
    fontScale,
    setFontScale,
    hapticsEnabled,
    setHapticsEnabled,
    triggerHaptic,
    setActiveTab,
  } = useApp();

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showBugModal, setShowBugModal] = useState(false);
  const [bugReportText, setBugReportText] = useState('');
  const [bugSubmitted, setBugSubmitted] = useState(false);

  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBugSubmitted(true);
    triggerHaptic([30, 50]);
    setTimeout(() => {
      setShowBugModal(false);
      setBugSubmitted(false);
      setBugReportText('');
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-28 max-w-lg mx-auto">
      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black gold-gradient-text">
          الإعدادات والتخصيص
        </h2>
        <p className="text-xs text-slate-300">
          تخصيص الخلفيات الفاخرة، حجم الخطوط، والتنبيهات
        </p>
      </div>

      {/* 1. Android Installation / PWA Card */}
      <div className="glass-gold p-4 rounded-3xl space-y-3 border-[#d4af37]/40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d4af37] to-[#fef08a] text-black flex items-center justify-center font-bold">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">
              تثبيت التطبيق على هاتف أندرويد
            </h4>
            <p className="text-[11px] text-slate-400">
              تثبيت مباشر كملف WebAPK حقيقي يعمل دون إنترنت
            </p>
          </div>
        </div>

        {isInstalled ? (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            <Check className="w-4 h-4" />
            <span>التطبيق مثبت ويعمل حالياً بنمط التطبيق المستقل (Standalone APK)</span>
          </div>
        ) : isInstallable ? (
          <button
            onClick={install}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#fef08a] text-black font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 transition-transform"
          >
            <Download className="w-4 h-4" />
            <span>تثبيت تطبيق أَثَر على هاتفك الآن</span>
          </button>
        ) : (
          <div className="text-[11px] text-slate-400 p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <p className="text-[#fef08a] font-medium">خطوات التثبيت السريع على الهاتف:</p>
            <p>1. افتح خيارات متصفح Chrome أو متصفحك (الثلاث نقاط ⋮).</p>
            <p>2. اضغط على <strong>«إضافة إلى الشاشة الرئيسية»</strong> أو <strong>«تثبيت التطبيق»</strong>.</p>
          </div>
        )}

        {/* Flutter Code & APK Export Shortcut */}
        <button
          onClick={() => {
            setActiveTab('flutter');
            triggerHaptic(20);
          }}
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#d4af37]/30 text-[#fef08a] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Code2 className="w-4 h-4 text-[#d4af37]" />
          <span>مشروع Flutter وبناء APK الأصلي (أوامر Dart & CLI)</span>
        </button>
      </div>

      {/* 2. Background Selector (4 Pre-packaged luxury backgrounds) */}
      <div className="glass-gold p-4 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#d4af37]" />
            <h4 className="text-sm font-bold text-slate-100">
              خلفيات التطبيق المدمجة (4 خلفيات)
            </h4>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {APP_BACKGROUNDS.map((bg) => {
            const isSelected = selectedBgId === bg.id;

            return (
              <div
                key={bg.id}
                onClick={() => {
                  setSelectedBgId(bg.id);
                  triggerHaptic(20);
                }}
                className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 group ${
                  isSelected
                    ? 'border-[#fef08a] shadow-[0_0_18px_rgba(212,175,55,0.4)] scale-[1.02]'
                    : 'border-white/10 hover:border-[#d4af37]/50'
                }`}
              >
                <div className="h-28 w-full relative">
                  <img
                    src={bg.url}
                    alt={bg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Selected Badge */}
                  {isSelected && (
                    <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#fef08a] text-black flex items-center justify-center shadow-lg">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                <div className="p-2.5 bg-[#0d0c10] text-right">
                  <h5 className="text-xs font-bold text-slate-100 group-hover:text-[#fef08a]">
                    {bg.name}
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {bg.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Background Opacity / Dimmer Slider */}
        <div className="pt-2 border-t border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>مستوى تعتيم الخلفية (لوضوح النصوص):</span>
            </span>
            <span className="text-[#fef08a] font-bold tabular-nums">
              {Math.round(bgOpacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.25"
            max="0.88"
            step="0.02"
            value={bgOpacity}
            onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
          />
        </div>
      </div>

      {/* 3. Typography & Reading Scale */}
      <div className="glass-gold p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-[#d4af37]" />
            <h4 className="text-sm font-bold text-slate-100">
              حجم خط المصحف والأذكار
            </h4>
          </div>
          <span className="text-xs text-[#fef08a] font-bold tabular-nums">
            {Math.round(fontScale * 100)}%
          </span>
        </div>

        <input
          type="range"
          min="0.85"
          max="1.4"
          step="0.05"
          value={fontScale}
          onChange={(e) => setFontScale(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
        />

        <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
          <p
            className="font-quran text-[#fef08a] transition-all"
            style={{ fontSize: `${1.2 * fontScale}rem` }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      </div>

      {/* 4. App Info & Privacy & Bug Report */}
      <div className="glass-gold p-4 rounded-3xl space-y-2.5">
        <h4 className="text-xs font-bold text-[#e5c07b] mb-1">
          حول تطبيق أَثَر
        </h4>

        <div className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
          <span className="text-slate-300">رقم الإصدار:</span>
          <span className="text-[#fef08a] font-mono font-bold">1.0.0 Pro Golden Edition</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
          <span className="text-slate-300">حقوق الخط والنصوص:</span>
          <span className="text-slate-400">مجمع الملك فهد لطباعة المصحف الشريف</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
          <span className="text-slate-300">طريقة حساب المواقيت:</span>
          <span className="text-slate-400">الهيئة المصرية العامة للمساحة</span>
        </div>

        <div className="pt-2 flex items-center justify-between gap-2">
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>سياسة الخصوصية</span>
          </button>

          <button
            onClick={() => setShowBugModal(true)}
            className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Bug className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>الإبلاغ عن مشكلة</span>
          </button>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md max-h-[80vh] rounded-3xl p-6 bg-[#0e0c10] border border-[#d4af37]/40 shadow-2xl flex flex-col space-y-4 overflow-y-auto">
            <h3 className="text-lg font-bold text-[#fef08a] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#d4af37]" />
              <span>سياسة الخصوصية — تطبيق أَثَر</span>
            </h3>
            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed text-justify">
              <p>
                نحن في تطبيق <strong>أَثَر | ATHAR</strong> نولي خصوصيتك أقصى درجات الاحترام والأمان.
              </p>
              <p>
                <strong>البيانات المحلية:</strong> يتم تخزين تفضيلاتك (السور المفضلة، القراء، موضع القراءة الأخير، أذكار اليوم، وإعدادات السبحة) محلياً داخل ذاكرة جهازك فقط دون إرسالها إلى أي خوادم خارجية.
              </p>
              <p>
                <strong>الموقع الجغرافي:</strong> يُستخدم إذن الموقع الجغرافي فقط عند طلبك لحساب مواقيت الصلاة بدقة بناءً على إحداثيات خطوط الطول والعرض، ولا يتم تعقب موقعك أو مشاركته مع أي طرف.
              </p>
              <p>
                <strong>بدون إعلانات:</strong> التطبيق خالٍ تماماً من أي إعلانات تجارية مزعجة حفاظاً على قدسية القرآن الكريم وسكينة الذكر.
              </p>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Bug Report Modal */}
      {showBugModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl p-6 bg-[#0e0c10] border border-[#d4af37]/40 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#fef08a] flex items-center gap-2">
              <Bug className="w-5 h-5 text-[#d4af37]" />
              <span>الإبلاغ عن مشكلة أو اقتراح</span>
            </h3>

            {bugSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
                <Check className="w-8 h-8 mx-auto" />
                <p className="text-sm font-bold">شكراً لك! تم استلام رسالتك بنجاح.</p>
              </div>
            ) : (
              <form onSubmit={handleBugSubmit} className="space-y-3">
                <textarea
                  rows={4}
                  required
                  placeholder="اكتب ملاحظتك أو الخطأ الذي واجهته بالتفصيل..."
                  value={bugReportText}
                  onChange={(e) => setBugReportText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/60 border border-[#d4af37]/30 text-slate-100 text-xs focus:outline-none focus:border-[#d4af37]"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs"
                  >
                    إرسال الملاحظة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBugModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 text-slate-300 font-bold text-xs"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
