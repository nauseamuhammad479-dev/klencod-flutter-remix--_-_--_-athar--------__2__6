import { Coordinates, CalculationMethod, PrayerTimes, Madhab, Prayer } from 'adhan';

export interface CityLocation {
  id: string;
  name: string;
  nameEn: string;
  latitude: number;
  longitude: number;
  timezone: string; // IANA timezone e.g. 'Africa/Cairo'
  region: string;
}

export const CITIES: CityLocation[] = [
  {
    id: 'hurghada',
    name: 'الغردقة (البحر الأحمر)',
    nameEn: 'Hurghada (Red Sea)',
    latitude: 27.2579,
    longitude: 33.8116,
    timezone: 'Africa/Cairo',
    region: 'البحر الأحمر',
  },
  {
    id: 'sharm',
    name: 'شرم الشيخ (جنوب سيناء)',
    nameEn: 'Sharm El-Sheikh',
    latitude: 27.9158,
    longitude: 34.3299,
    timezone: 'Africa/Cairo',
    region: 'جنوب سيناء',
  },
  {
    id: 'marsa_alam',
    name: 'مرسى علم (البحر الأحمر)',
    nameEn: 'Marsa Alam',
    latitude: 25.0747,
    longitude: 34.8943,
    timezone: 'Africa/Cairo',
    region: 'البحر الأحمر',
  },
  {
    id: 'safaga',
    name: 'سفاجا (البحر الأحمر)',
    nameEn: 'Safaga',
    latitude: 26.7454,
    longitude: 33.9380,
    timezone: 'Africa/Cairo',
    region: 'البحر الأحمر',
  },
  {
    id: 'cairo',
    name: 'القاهرة',
    nameEn: 'Cairo',
    latitude: 30.0444,
    longitude: 31.2357,
    timezone: 'Africa/Cairo',
    region: 'محافظة القاهرة',
  },
  {
    id: 'alexandria',
    name: 'الإسكندرية',
    nameEn: 'Alexandria',
    latitude: 31.2001,
    longitude: 29.9187,
    timezone: 'Africa/Cairo',
    region: 'محافظة الإسكندرية',
  },
  {
    id: 'luxor',
    name: 'الأقصر',
    nameEn: 'Luxor',
    latitude: 25.6872,
    longitude: 32.6396,
    timezone: 'Africa/Cairo',
    region: 'صعيد مصر',
  },
  {
    id: 'aswan',
    name: 'أسوان',
    nameEn: 'Aswan',
    latitude: 24.0889,
    longitude: 32.8998,
    timezone: 'Africa/Cairo',
    region: 'صعيد مصر',
  },
  {
    id: 'mansoura',
    name: 'المنصورة (الدقهلية)',
    nameEn: 'Mansoura',
    latitude: 31.0409,
    longitude: 31.3785,
    timezone: 'Africa/Cairo',
    region: 'الدلتا',
  },
  {
    id: 'makkah',
    name: 'مكة المكرمة',
    nameEn: 'Makkah',
    latitude: 21.3891,
    longitude: 39.8579,
    timezone: 'Asia/Riyadh',
    region: 'المملكة العربية السعودية',
  },
  {
    id: 'madinah',
    name: 'المدينة المنورة',
    nameEn: 'Madinah',
    latitude: 24.5247,
    longitude: 39.5692,
    timezone: 'Asia/Riyadh',
    region: 'المملكة العربية السعودية',
  },
];

export interface PrayerTimeItem {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  name: string;
  englishName: string;
  timeString: string;
  date: Date;
  isNext?: boolean;
}

export interface PrayerTimesResult {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayer: PrayerTimeItem;
  remainingSeconds: number;
  hijriDate: string;
  readableDate: string;
  list: PrayerTimeItem[];
}

export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  timeZoneStr?: string
): PrayerTimesResult {
  const coords = new Coordinates(lat, lng);
  // Egyptian General Authority of Survey parameters (Fajr 19.5°, Isha 17.5°)
  const params = CalculationMethod.Egyptian();
  params.madhab = Madhab.Shafi;

  const pt = new PrayerTimes(coords, date, params);

  // Determine timezone to display accurately
  const activeTz =
    timeZoneStr ||
    (typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'Africa/Cairo');

  const formatTime = (d: Date): string => {
    try {
      return d.toLocaleTimeString('ar-EG', {
        timeZone: activeTz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      const h = d.getHours();
      const m = d.getMinutes();
      const period = h >= 12 ? 'م' : 'ص';
      const dh = h % 12 === 0 ? 12 : h % 12;
      return `${String(dh).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
    }
  };

  const now = date.getTime();

  const list: PrayerTimeItem[] = [
    { id: 'fajr', name: 'الفجر', englishName: 'Fajr', timeString: formatTime(pt.fajr), date: pt.fajr },
    { id: 'sunrise', name: 'الشروق', englishName: 'Sunrise', timeString: formatTime(pt.sunrise), date: pt.sunrise },
    { id: 'dhuhr', name: 'الظهر', englishName: 'Dhuhr', timeString: formatTime(pt.dhuhr), date: pt.dhuhr },
    { id: 'asr', name: 'العصر', englishName: 'Asr', timeString: formatTime(pt.asr), date: pt.asr },
    { id: 'maghrib', name: 'المغرب', englishName: 'Maghrib', timeString: formatTime(pt.maghrib), date: pt.maghrib },
    { id: 'isha', name: 'العشاء', englishName: 'Isha', timeString: formatTime(pt.isha), date: pt.isha },
  ];

  // Find next upcoming prayer
  let nextPrayer = list.find((p) => p.date.getTime() > now && p.id !== 'sunrise');
  let remainingSeconds = 0;

  if (nextPrayer) {
    nextPrayer.isNext = true;
    remainingSeconds = Math.max(0, Math.floor((nextPrayer.date.getTime() - now) / 1000));
  } else {
    // Tomorrow's Fajr
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowPt = new PrayerTimes(coords, tomorrow, params);
    nextPrayer = {
      id: 'fajr',
      name: 'الفجر (غداً)',
      englishName: 'Fajr (Tomorrow)',
      timeString: formatTime(tomorrowPt.fajr),
      date: tomorrowPt.fajr,
      isNext: true,
    };
    remainingSeconds = Math.max(0, Math.floor((tomorrowPt.fajr.getTime() - now) / 1000));
  }

  // Hijri date calculation
  const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
    'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  let hijriDate = '١١ ذو القعدة ١٤٤٧ هـ';
  try {
    const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    hijriDate = hijriFormatter.format(date);
  } catch {
    // fallback
  }

  const readableDate = date.toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: activeTz,
  });

  return {
    fajr: formatTime(pt.fajr),
    sunrise: formatTime(pt.sunrise),
    dhuhr: formatTime(pt.dhuhr),
    asr: formatTime(pt.asr),
    maghrib: formatTime(pt.maghrib),
    isha: formatTime(pt.isha),
    nextPrayer,
    remainingSeconds,
    hijriDate,
    readableDate,
    list,
  };
}
