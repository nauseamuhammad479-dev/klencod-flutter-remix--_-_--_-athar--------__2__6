import React, { useState } from 'react';
import {
  Clock,
  Compass,
  MapPin,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Navigation,
  CheckCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CITIES } from '../data/prayerCalc';

function formatCountdown(totalSec: number): string {
  if (totalSec <= 0) return '00:00:00';
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const PrayerScreen: React.FC = () => {
  const {
    prayerTimes,
    selectedCity,
    setSelectedCity,
    useGPSLocation,
    isGPSActive,
    athanNotifications,
    toggleAthanNotification,
    previewAdhan,
    stopAdhanPreview,
    isAdhanPlaying,
    triggerHaptic,
  } = useApp();

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  const handleGPSClick = async () => {
    setGpsLoading(true);
    triggerHaptic(15);
    const success = await useGPSLocation();
    setGpsLoading(false);
    if (success) {
      setGpsMessage('تم تحديد موقعك بدقة عبر الأقمار الصناعية (GPS)');
    } else {
      setGpsMessage('تعذر الوصول إلى الموقع تلقائياً، يرجى تفعيل إذن الموقع أو اختيار المدينة يدوياً');
    }
    setTimeout(() => setGpsMessage(null), 4000);
  };

  return (
    <div className="space-y-6 pb-28 max-w-md mx-auto">
      {/* Title & Dates */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black gold-gradient-text">
          مواقيت الصلاة
        </h2>
        <p className="text-xs text-[#e5c07b] font-medium">
          {prayerTimes.hijriDate} · {prayerTimes.readableDate}
        </p>
        <span className="inline-block text-[10px] text-slate-400 bg-black/40 px-3 py-0.5 rounded-full border border-white/10 mt-1">
          حسب توقيت الهيئة المصرية العامة للمساحة
        </span>
      </div>

      {/* Main Countdown Hero Card */}
      <div className="glass-gold p-5 rounded-3xl relative overflow-hidden border-[#d4af37]/40 shadow-[0_12px_35px_rgba(0,0,0,0.7)] text-center">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-[#d4af37]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative space-y-2">
          <span className="text-xs font-semibold text-[#fef08a] px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/30 inline-block">
            الصلاة القادمة: صلاة {prayerTimes.nextPrayer.name}
          </span>

          <div className="pt-2">
            <span className="text-[11px] text-slate-400 block">
              الوقت المتبقي للأذان:
            </span>
            <span className="text-4xl sm:text-5xl font-black text-[#fef08a] tabular-nums tracking-wider drop-shadow-md">
              {formatCountdown(prayerTimes.remainingSeconds)}
            </span>
          </div>

          <p className="text-xs text-slate-300 pt-1">
            موعد الأذان: <span className="font-bold text-[#d4af37]">{prayerTimes.nextPrayer.timeString}</span>
          </p>
        </div>
      </div>

      {/* Location Selector Bar */}
      <div className="glass-gold-subtle p-3.5 rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs font-bold text-slate-100">
              المدينة المحددة:
            </span>
          </div>

          <button
            onClick={handleGPSClick}
            disabled={gpsLoading}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-colors ${
              isGPSActive
                ? 'bg-[#d4af37] text-black border-[#d4af37]'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-[#fef08a]'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
            <span>{gpsLoading ? 'جارِ التحديد...' : 'موقعي (GPS)'}</span>
          </button>
        </div>

        <select
          value={selectedCity.id}
          onChange={(e) => {
            const found = CITIES.find((c) => c.id === e.target.value);
            if (found) setSelectedCity(found);
            triggerHaptic(15);
          }}
          className="w-full py-2 px-3 rounded-xl bg-black/60 border border-[#d4af37]/30 text-slate-100 text-xs font-semibold focus:outline-none focus:border-[#d4af37]"
        >
          {CITIES.map((city) => (
            <option key={city.id} value={city.id} className="bg-[#121014] text-slate-100">
              {city.name} — ({city.region})
            </option>
          ))}
        </select>

        {gpsMessage && (
          <p className="text-[11px] text-[#fef08a] pt-1 text-center">
            {gpsMessage}
          </p>
        )}
      </div>

      {/* Prayer Times Grid List */}
      <div className="space-y-2">
        {prayerTimes.list.map((prayer) => {
          const isNotificationActive = athanNotifications[prayer.id] ?? true;

          return (
            <div
              key={prayer.id}
              className={`flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 ${
                prayer.isNext
                  ? 'glass-gold-active border-[#d4af37]'
                  : 'glass-gold-subtle hover:glass-gold'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                    prayer.isNext
                      ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/30'
                      : 'bg-white/5 text-slate-300 border border-white/10'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100">
                      صلاة {prayer.name}
                    </h4>
                    {prayer.isNext && (
                      <span className="text-[9px] font-bold text-black px-1.5 py-0.2 rounded-full bg-[#fef08a]">
                        الصلاة القادمة
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {prayer.englishName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-[#fef08a] tabular-nums">
                  {prayer.timeString}
                </span>

                {/* Notification Toggle for each prayer */}
                <button
                  onClick={() => {
                    toggleAthanNotification(prayer.id);
                    triggerHaptic(20);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    isNotificationActive
                      ? 'text-[#d4af37] hover:text-[#fef08a]'
                      : 'text-slate-600 hover:text-slate-400'
                  }`}
                  title={isNotificationActive ? 'إيقاف تنبيه الصلاة' : 'تفعيل تنبيه الصلاة'}
                >
                  {isNotificationActive ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Adhan Audio Preview Deck */}
      <div className="glass-gold p-4 rounded-3xl flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-100">
            أذان الحرم المكي الشريف
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">
            استمع لمعاينة صوت الأذان والتنبيهات
          </p>
        </div>

        <button
          onClick={previewAdhan}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition-all ${
            isAdhanPlaying
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-gradient-to-r from-[#d4af37] to-[#fef08a] text-black active:scale-95'
          }`}
        >
          {isAdhanPlaying ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>إيقاف الأذان</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>معاينة الأذان</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
