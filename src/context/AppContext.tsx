import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { RECITERS, Reciter, getAudioUrl } from '../data/reciters';
import { SURAHS, SurahMeta } from '../data/surahs';
import { calculatePrayerTimes, PrayerTimesResult, CITIES, CityLocation } from '../data/prayerCalc';
import { APP_BACKGROUNDS } from '../data/backgrounds';

export type TabType = 'home' | 'quran' | 'reciters' | 'favorites' | 'azkar' | 'masbaha' | 'prayer' | 'settings' | 'flutter';

interface Bookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  timestamp: number;
}

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  // Background
  selectedBgId: string;
  setSelectedBgId: (id: string) => void;
  bgOpacity: number;
  setBgOpacity: (val: number) => void;
  // Font scale
  fontScale: number; // 0.85 to 1.3
  setFontScale: (val: number) => void;
  // Haptics
  hapticsEnabled: boolean;
  setHapticsEnabled: (val: boolean) => void;
  triggerHaptic: (pattern?: number | number[]) => void;
  // Audio Player
  currentReciter: Reciter;
  currentSurah: SurahMeta;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLooping: boolean;
  isPlayerExpanded: boolean;
  setIsPlayerExpanded: (val: boolean) => void;
  playReciterSurah: (reciter: Reciter, surah: SurahMeta) => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
  setVolume: (val: number) => void;
  toggleLoop: () => void;
  nextSurah: () => void;
  prevSurah: () => void;
  // Quran reader navigation
  selectedSurahForReading: SurahMeta | null;
  setSelectedSurahForReading: (s: SurahMeta | null) => void;
  // Bookmarks & Favorites
  lastRead: Bookmark;
  saveLastRead: (surahNumber: number, surahName: string, ayahNumber?: number) => void;
  favoriteReciters: string[];
  toggleFavoriteReciter: (id: string) => void;
  favoriteSurahs: number[];
  toggleFavoriteSurah: (num: number) => void;
  bookmarkedAyahs: { surah: number; ayah: number; text: string }[];
  toggleBookmarkAyah: (surah: number, ayah: number, text: string) => void;
  // Electronic Masbaha
  tasbeehCount: number;
  tasbeehPhrase: string;
  setTasbeehPhrase: (phrase: string) => void;
  tasbeehLaps: number;
  tasbeehTotal: number;
  incrementTasbeeh: () => void;
  resetTasbeeh: () => void;
  // Prayer Times
  prayerTimes: PrayerTimesResult;
  selectedCity: CityLocation;
  setSelectedCity: (c: CityLocation) => void;
  useGPSLocation: () => Promise<boolean>;
  isGPSActive: boolean;
  athanNotifications: Record<string, boolean>;
  toggleAthanNotification: (prayerId: string) => void;
  previewAdhan: () => void;
  stopAdhanPreview: () => void;
  isAdhanPlaying: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedSurahForReading, setSelectedSurahForReading] = useState<SurahMeta | null>(null);

  // Background
  const [selectedBgId, setSelectedBgId] = useState<string>(() => {
    return localStorage.getItem('athar_bg') || 'black_gold';
  });
  const [bgOpacity, setBgOpacity] = useState<number>(() => {
    const saved = localStorage.getItem('athar_bg_opacity');
    return saved ? parseFloat(saved) : 0.65;
  });

  // Font Scale
  const [fontScale, setFontScale] = useState<number>(() => {
    const saved = localStorage.getItem('athar_font_scale');
    return saved ? parseFloat(saved) : 1;
  });

  // Haptics
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('athar_haptics');
    return saved !== null ? saved === 'true' : true;
  });

  const triggerHaptic = (pattern: number | number[] = 25) => {
    if (hapticsEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore
      }
    }
  };

  // Audio Player State
  const [currentReciter, setCurrentReciter] = useState<Reciter>(() => {
    const saved = localStorage.getItem('athar_last_reciter');
    if (saved) {
      const found = RECITERS.find((r) => r.id === saved);
      if (found) return found;
    }
    return RECITERS[0]; // Al-Hussary
  });

  const [currentSurah, setCurrentSurah] = useState<SurahMeta>(() => {
    const saved = localStorage.getItem('athar_last_surah');
    if (saved) {
      const num = parseInt(saved, 10);
      const found = SURAHS.find((s) => s.number === num);
      if (found) return found;
    }
    return SURAHS[0]; // Al-Fatihah
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and bind single authoritative HTMLAudioElement
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsBuffering(false);
    };

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        // Automatically play next surah
        nextSurah();
      }
    };
    const handleError = () => {
      setIsBuffering(false);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [isLooping]);

  const playReciterSurah = (reciter: Reciter, surah: SurahMeta) => {
    setCurrentReciter(reciter);
    setCurrentSurah(surah);
    localStorage.setItem('athar_last_reciter', reciter.id);
    localStorage.setItem('athar_last_surah', String(surah.number));

    const audio = audioRef.current;
    if (audio) {
      const url = getAudioUrl(reciter, surah.number);
      audio.src = url;
      setIsBuffering(true);
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          triggerHaptic(20);
        })
        .catch(() => {
          setIsBuffering(false);
          setIsPlaying(false);
        });
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      triggerHaptic(15);
    } else {
      if (!audio.src || audio.src === '' || audio.src.endsWith('/')) {
        playReciterSurah(currentReciter, currentSurah);
      } else {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            triggerHaptic(20);
          })
          .catch(() => {});
      }
    }
  };

  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(time)) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  };

  const toggleLoop = () => {
    setIsLooping((prev) => !prev);
    triggerHaptic(20);
  };

  const nextSurah = () => {
    const nextNum = currentSurah.number >= 114 ? 1 : currentSurah.number + 1;
    const nextS = SURAHS.find((s) => s.number === nextNum) || SURAHS[0];
    playReciterSurah(currentReciter, nextS);
  };

  const prevSurah = () => {
    const prevNum = currentSurah.number <= 1 ? 114 : currentSurah.number - 1;
    const prevS = SURAHS.find((s) => s.number === prevNum) || SURAHS[0];
    playReciterSurah(currentReciter, prevS);
  };

  // Last Read Bookmark
  const [lastRead, setLastRead] = useState<Bookmark>(() => {
    const saved = localStorage.getItem('athar_bookmark');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      surahNumber: 1,
      surahName: 'الفَاتِحَة',
      ayahNumber: 1,
      timestamp: Date.now(),
    };
  });

  const saveLastRead = (surahNumber: number, surahName: string, ayahNumber: number = 1) => {
    const bookmark: Bookmark = {
      surahNumber,
      surahName,
      ayahNumber,
      timestamp: Date.now(),
    };
    setLastRead(bookmark);
    localStorage.setItem('athar_bookmark', JSON.stringify(bookmark));
    triggerHaptic([15, 30]);
  };

  // Favorites System
  const [favoriteReciters, setFavoriteReciters] = useState<string[]>(() => {
    const saved = localStorage.getItem('athar_fav_reciters');
    return saved ? JSON.parse(saved) : ['husr', 'minsh', 'basit', 'afs'];
  });

  const toggleFavoriteReciter = (id: string) => {
    setFavoriteReciters((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((r) => r !== id) : [...prev, id];
      localStorage.setItem('athar_fav_reciters', JSON.stringify(updated));
      triggerHaptic(30);
      return updated;
    });
  };

  const [favoriteSurahs, setFavoriteSurahs] = useState<number[]>(() => {
    const saved = localStorage.getItem('athar_fav_surahs');
    return saved ? JSON.parse(saved) : [1, 18, 36, 55, 67];
  });

  const toggleFavoriteSurah = (num: number) => {
    setFavoriteSurahs((prev) => {
      const exists = prev.includes(num);
      const updated = exists ? prev.filter((s) => s !== num) : [...prev, num];
      localStorage.setItem('athar_fav_surahs', JSON.stringify(updated));
      triggerHaptic(30);
      return updated;
    });
  };

  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<
    { surah: number; ayah: number; text: string }[]
  >(() => {
    const saved = localStorage.getItem('athar_fav_ayahs');
    return saved
      ? JSON.parse(saved)
      : [
          {
            surah: 2,
            ayah: 255,
            text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ (آية الكرسي)',
          },
        ];
  });

  const toggleBookmarkAyah = (surah: number, ayah: number, text: string) => {
    setBookmarkedAyahs((prev) => {
      const exists = prev.some((a) => a.surah === surah && a.ayah === ayah);
      const updated = exists
        ? prev.filter((a) => !(a.surah === surah && a.ayah === ayah))
        : [...prev, { surah, ayah, text }];
      localStorage.setItem('athar_fav_ayahs', JSON.stringify(updated));
      triggerHaptic(30);
      return updated;
    });
  };

  // Electronic Masbaha State
  const [tasbeehCount, setTasbeehCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('athar_tasbeeh_count') || '0', 10);
  });
  const [tasbeehPhrase, setTasbeehPhrase] = useState<string>(() => {
    return localStorage.getItem('athar_tasbeeh_phrase') || 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ';
  });
  const [tasbeehLaps, setTasbeehLaps] = useState<number>(() => {
    return parseInt(localStorage.getItem('athar_tasbeeh_laps') || '0', 10);
  });
  const [tasbeehTotal, setTasbeehTotal] = useState<number>(() => {
    return parseInt(localStorage.getItem('athar_tasbeeh_total') || '0', 10);
  });

  const incrementTasbeeh = () => {
    setTasbeehCount((prev) => {
      const next = prev + 1;
      let nextLaps = tasbeehLaps;
      if (next >= 33) {
        nextLaps += 1;
        setTasbeehLaps(nextLaps);
        localStorage.setItem('athar_tasbeeh_laps', String(nextLaps));
        // Special lap completion vibration
        triggerHaptic([40, 60, 40]);
        localStorage.setItem('athar_tasbeeh_count', '0');
        return 0;
      }
      triggerHaptic(18);
      localStorage.setItem('athar_tasbeeh_count', String(next));
      return next;
    });

    setTasbeehTotal((prev) => {
      const next = prev + 1;
      localStorage.setItem('athar_tasbeeh_total', String(next));
      return next;
    });
  };

  const resetTasbeeh = () => {
    setTasbeehCount(0);
    setTasbeehLaps(0);
    localStorage.setItem('athar_tasbeeh_count', '0');
    localStorage.setItem('athar_tasbeeh_laps', '0');
    triggerHaptic([30, 30]);
  };

  // Prayer Calculation State
  const [selectedCity, setSelectedCityState] = useState<CityLocation>(() => {
    const saved = localStorage.getItem('athar_city');
    if (saved) {
      const found = CITIES.find((c) => c.id === saved);
      if (found) return found;
    }
    // Default to Hurghada (Red Sea) as requested!
    return CITIES[0];
  });

  const [isGPSActive, setIsGPSActive] = useState(false);

  const setSelectedCity = (c: CityLocation) => {
    setSelectedCityState(c);
    setIsGPSActive(false);
    localStorage.setItem('athar_city', c.id);
  };

  const useGPSLocation = async (): Promise<boolean> => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return false;
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const gpsLocation: CityLocation = {
            id: 'gps',
            name: 'موقعي الحالي (GPS)',
            nameEn: 'Current Location (GPS)',
            latitude: lat,
            longitude: lng,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Cairo',
            region: 'تحديد دقيق عبر الأقمار الصناعية',
          };
          setSelectedCityState(gpsLocation);
          setIsGPSActive(true);
          resolve(true);
        },
        () => {
          resolve(false);
        },
        { timeout: 8000 }
      );
    });
  };

  const [athanNotifications, setAthanNotifications] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('athar_athan_notifs');
    return saved
      ? JSON.parse(saved)
      : {
          fajr: true,
          dhuhr: true,
          asr: true,
          maghrib: true,
          isha: true,
        };
  });

  const toggleAthanNotification = (prayerId: string) => {
    setAthanNotifications((prev) => {
      const updated = { ...prev, [prayerId]: !prev[prayerId] };
      localStorage.setItem('athar_athan_notifs', JSON.stringify(updated));
      return updated;
    });
  };

  // Live updating Prayer Times every second for precise countdown
  const [nowDate, setNowDate] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setNowDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const prayerTimes = calculatePrayerTimes(
    nowDate,
    selectedCity.latitude,
    selectedCity.longitude,
    selectedCity.timezone
  );

  // Adhan sound preview with local offline audio files
  const [isAdhanPlaying, setIsAdhanPlaying] = useState(false);
  const [selectedAdhanVoice, setSelectedAdhanVoice] = useState<'makkah' | 'abdulbasit'>('makkah');
  const adhanAudioRef = useRef<HTMLAudioElement | null>(null);

  const previewAdhan = (voice?: 'makkah' | 'abdulbasit') => {
    if (isAdhanPlaying && adhanAudioRef.current) {
      stopAdhanPreview();
      return;
    }
    const targetVoice = voice || selectedAdhanVoice;
    const audioSrc = targetVoice === 'abdulbasit' ? '/audio/adhan_abdulbasit.mp3' : '/audio/adhan_makkah.mp3';
    const audio = new Audio(audioSrc);
    audio.volume = 0.9;
    adhanAudioRef.current = audio;
    audio.play().then(() => setIsAdhanPlaying(true)).catch(() => setIsAdhanPlaying(false));
    audio.onended = () => setIsAdhanPlaying(false);
  };

  const stopAdhanPreview = () => {
    if (adhanAudioRef.current) {
      adhanAudioRef.current.pause();
      adhanAudioRef.current.currentTime = 0;
    }
    setIsAdhanPlaying(false);
  };

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('athar_bg', selectedBgId);
  }, [selectedBgId]);

  useEffect(() => {
    localStorage.setItem('athar_bg_opacity', String(bgOpacity));
  }, [bgOpacity]);

  useEffect(() => {
    localStorage.setItem('athar_font_scale', String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem('athar_haptics', String(hapticsEnabled));
  }, [hapticsEnabled]);

  useEffect(() => {
    localStorage.setItem('athar_tasbeeh_phrase', tasbeehPhrase);
  }, [tasbeehPhrase]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedBgId,
        setSelectedBgId,
        bgOpacity,
        setBgOpacity,
        fontScale,
        setFontScale,
        hapticsEnabled,
        setHapticsEnabled,
        triggerHaptic,
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
        playReciterSurah,
        togglePlay,
        seekTo,
        setVolume,
        toggleLoop,
        nextSurah,
        prevSurah,
        selectedSurahForReading,
        setSelectedSurahForReading,
        lastRead,
        saveLastRead,
        favoriteReciters,
        toggleFavoriteReciter,
        favoriteSurahs,
        toggleFavoriteSurah,
        bookmarkedAyahs,
        toggleBookmarkAyah,
        tasbeehCount,
        tasbeehPhrase,
        setTasbeehPhrase,
        tasbeehLaps,
        tasbeehTotal,
        incrementTasbeeh,
        resetTasbeeh,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
