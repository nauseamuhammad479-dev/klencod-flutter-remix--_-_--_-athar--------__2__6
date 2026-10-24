import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  Smartphone,
  Layers,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FlutterExportScreen: React.FC = () => {
  const { triggerHaptic } = useApp();
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [selectedFileKey, setSelectedFileKey] = useState<string>('main.dart');

  const copyToClipboard = (filename: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(filename);
    triggerHaptic(20);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const flutterFiles: Record<string, { title: string; lang: string; code: string }> = {
    'pubspec.yaml': {
      title: 'pubspec.yaml (حزم Flutter المطلوبة)',
      lang: 'yaml',
      code: `name: athar_islamic_app
description: "أَثَر | ATHAR — تطبيق إسلامي فاخر باللونين الأسود والذهبي"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  cupertino_icons: ^1.0.6
  just_audio: ^0.9.36
  audio_video_progress_bar: ^2.0.1
  shared_preferences: ^2.2.2
  vibration: ^1.8.4
  adhan: ^2.0.0+1
  geolocator: ^10.1.0
  intl: ^0.19.0
  google_fonts: ^6.1.0
  flutter_islamic_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/audio/
`,
    },
    'main.dart': {
      title: 'lib/main.dart (نقطة انطلاق تطبيق أَثَر)',
      lang: 'dart',
      code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:google_fonts/google_fonts.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.light,
    systemNavigationBarColor: Color(0xFF09080A),
    systemNavigationBarIconBrightness: Brightness.light,
  ));
  runApp(const AtharApp());
}

class AtharApp extends StatelessWidget {
  const AtharApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'أَثَر | ATHAR',
      debugShowCheckedModeBanner: false,
      locale: const Locale('ar'),
      supportedLocales: const [Locale('ar')],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF070709),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFD4AF37),
          secondary: Color(0xFFFEF08A),
          surface: Color(0xFF121014),
        ),
        textTheme: GoogleFonts.cairoTextTheme(ThemeData.dark().textTheme),
      ),
      home: const MainNavigationScreen(),
    );
  }
}

// Bottom Navigation with iOS Glassmorphism
class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreenPlaceholder(),
    QuranScreenPlaceholder(),
    FavoritesScreenPlaceholder(),
    AzkarScreenPlaceholder(),
    SettingsScreenPlaceholder(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      body: _screens[_currentIndex],
      bottomNavigationBar: SafeArea(
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          height: 64,
          decoration: BoxDecoration(
            color: const Color(0xFF0E0C10).withOpacity(0.88),
            borderRadius: BorderRadius.circular(32),
            border: Border.all(color: const Color(0xFFD4AF37).withOpacity(0.35), width: 1),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.6),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(0, Icons.home_rounded, 'الرئيسية'),
              _buildNavItem(1, Icons.menu_book_rounded, 'القرآن'),
              _buildNavItem(2, Icons.favorite_rounded, 'المفضلة'),
              _buildNavItem(3, Icons.nightlight_round, 'الأذكار'),
              _buildNavItem(4, Icons.settings_rounded, 'الإعدادات'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final bool isSelected = _currentIndex == index;
    return GestureDetector(
      onTap: () {
        HapticFeedback.lightImpact();
        setState(() => _currentIndex = index);
      },
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 22,
            color: isSelected ? const Color(0xFFFEF08A) : Colors.white54,
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              color: isSelected ? const Color(0xFFFEF08A) : Colors.white54,
            ),
          ),
        ],
      ),
    );
  }
}

class HomeScreenPlaceholder extends StatelessWidget {
  const HomeScreenPlaceholder({super.key});
  @override
  Widget build(BuildContext context) => const Center(child: Text("أَثَر — الرئيسية"));
}
class QuranScreenPlaceholder extends StatelessWidget {
  const QuranScreenPlaceholder({super.key});
  @override
  Widget build(BuildContext context) => const Center(child: Text("المصحف الشريف"));
}
class FavoritesScreenPlaceholder extends StatelessWidget {
  const FavoritesScreenPlaceholder({super.key});
  @override
  Widget build(BuildContext context) => const Center(child: Text("المفضلة"));
}
class AzkarScreenPlaceholder extends StatelessWidget {
  const AzkarScreenPlaceholder({super.key});
  @override
  Widget build(BuildContext context) => const Center(child: Text("الأذكار والسبحة"));
}
class SettingsScreenPlaceholder extends StatelessWidget {
  const SettingsScreenPlaceholder({super.key});
  @override
  Widget build(BuildContext context) => const Center(child: Text("الإعدادات"));
}
`,
    },
    'reciters_triangle.dart': {
      title: 'lib/screens/reciters_triangle.dart (المكتبة الهرمية)',
      lang: 'dart',
      code: `// Flutter implementation of the Triangular Reciter Showcase
import 'package:flutter/material.dart';

class Reciter {
  final String id;
  final String name;
  final String title;
  final String serverUrl;
  final String avatar;

  const Reciter({
    required this.id,
    required this.name,
    required this.title,
    required this.serverUrl,
    required this.avatar,
  });
}

class RecitersTriangleWidget extends StatelessWidget {
  final List<Reciter> reciters;
  final Function(Reciter) onSelect;

  const RecitersTriangleWidget({
    super.key,
    required this.reciters,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    if (reciters.isEmpty) return const SizedBox.shrink();

    return Column(
      children: [
        // Apex (Tier 1: 1 card)
        Center(child: _buildReciterCard(reciters[0], isApex: true)),
        const SizedBox(height: 12),

        // Tier 2: 2 cards
        if (reciters.length >= 3)
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Expanded(child: _buildReciterCard(reciters[1])),
              const SizedBox(width: 10),
              Expanded(child: _buildReciterCard(reciters[2])),
            ],
          ),
        const SizedBox(height: 12),

        // Tier 3: 3 cards
        if (reciters.length >= 6)
          Row(
            children: [
              Expanded(child: _buildReciterCard(reciters[3])),
              const SizedBox(width: 8),
              Expanded(child: _buildReciterCard(reciters[4])),
              const SizedBox(width: 8),
              Expanded(child: _buildReciterCard(reciters[5])),
            ],
          ),
      ],
    );
  }

  Widget _buildReciterCard(Reciter r, {bool isApex = false}) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF141218).withOpacity(0.7),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFD4AF37).withOpacity(0.3), width: 1),
      ),
      child: Column(
        children: [
          CircleAvatar(
            radius: isApex ? 40 : 28,
            backgroundColor: const Color(0xFFD4AF37),
            child: CircleAvatar(
              radius: isApex ? 38 : 26,
              backgroundImage: NetworkImage(r.avatar),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            r.name,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}
`,
    },
    'audio_player_service.dart': {
      title: 'lib/services/audio_player_service.dart (مشغل الصوت بالخلفية)',
      lang: 'dart',
      code: `import 'package:just_audio/just_audio.dart';

class AtharAudioService {
  static final AtharAudioService _instance = AtharAudioService._internal();
  factory AtharAudioService() => _instance;
  AtharAudioService._internal();

  final AudioPlayer _player = AudioPlayer();

  AudioPlayer get player => _player;

  Future<void> playSurah({required String serverUrl, required int surahNumber}) async {
    final String padded = surahNumber.toString().padLeft(3, '0');
    final String fullUrl = serverUrl.endsWith('/') ? "\$serverUrl\$padded.mp3" : "\$serverUrl/\$padded.mp3";
    
    try {
      await _player.setUrl(fullUrl);
      await _player.play();
    } catch (e) {
      print("Audio load error: \$e");
    }
  }

  Future<void> pause() => _player.pause();
  Future<void> resume() => _player.play();
  Future<void> stop() => _player.stop();
  Future<void> seek(Duration position) => _player.seek(position);

  void dispose() {
    _player.dispose();
  }
}
`,
    },
  };

  return (
    <div className="space-y-6 pb-28 max-w-lg mx-auto">
      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black gold-gradient-text">
          تصدير كود Flutter & بناء APK
        </h2>
        <p className="text-xs text-slate-300">
          المشروع الأصلي الكامل بلغة Dart مع أوامر بناء ملف APK حقيقي للأندرويد
        </p>
      </div>

      {/* APK Terminal Build Guide Card */}
      <div className="glass-gold p-4 rounded-3xl space-y-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#d4af37]" />
          <h4 className="text-sm font-bold text-slate-100">
            أوامر إنشاء وبناء ملف APK على حاسوبك (Flutter CLI)
          </h4>
        </div>

        <div className="p-3 rounded-2xl bg-black/70 border border-white/10 font-mono text-xs text-slate-200 space-y-2 overflow-x-auto text-left" dir="ltr">
          <p className="text-slate-400"># 1. إنشاء مجلد مشروع Flutter الجديد</p>
          <p className="text-[#fef08a]">flutter create --org com.athar.app --platforms android athar_app</p>
          <p className="text-slate-400 pt-1"># 2. الانتقال لمجلد المشروع</p>
          <p className="text-[#fef08a]">cd athar_app</p>
          <p className="text-slate-400 pt-1"># 3. تثبيت الحزم المطلوبة</p>
          <p className="text-[#fef08a]">flutter pub add just_audio audio_video_progress_bar shared_preferences google_fonts adhan</p>
          <p className="text-slate-400 pt-1"># 4. بناء ملف APK بصيغة Release نهائية للتحميل على الهاتف</p>
          <p className="text-emerald-400 font-bold">flutter build apk --release</p>
          <p className="text-slate-400 text-[11px] pt-1">
            ستجد ملف الـ APK الجاهز داخل المسار:<br />
            build/app/outputs/flutter-apk/app-release.apk
          </p>
        </div>
      </div>

      {/* File Viewer Tabs */}
      <div className="glass-gold p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#fef08a]">
            ملفات الكود المصدري (Dart & Yaml):
          </span>
          <button
            onClick={() =>
              copyToClipboard(selectedFileKey, flutterFiles[selectedFileKey].code)
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#fef08a] text-black text-xs font-bold shadow active:scale-95 transition-transform"
          >
            {copiedFile === selectedFileKey ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الكود</span>
              </>
            )}
          </button>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {Object.keys(flutterFiles).map((key) => (
            <button
              key={key}
              onClick={() => {
                setSelectedFileKey(key);
                triggerHaptic(15);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-colors ${
                selectedFileKey === key
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:border-[#d4af37]/40'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Code display */}
        <div className="p-3 rounded-2xl bg-black/80 border border-[#d4af37]/20 max-h-80 overflow-y-auto text-left" dir="ltr">
          <pre className="text-xs font-mono text-[#fef08a]/90 whitespace-pre leading-relaxed">
            {flutterFiles[selectedFileKey].code}
          </pre>
        </div>
      </div>
    </div>
  );
};
