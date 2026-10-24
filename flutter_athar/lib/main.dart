import 'package:flutter/material.dart';
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
      home: const AtharMainScreen(),
    );
  }
}

class AtharMainScreen extends StatefulWidget {
  const AtharMainScreen({super.key});

  @override
  State<AtharMainScreen> createState() => _AtharMainScreenState();
}

class _AtharMainScreenState extends State<AtharMainScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      body: Stack(
        children: [
          // Background Gradient & Black Gold Ambience
          Container(
            decoration: const BoxDecoration(
              gradient: RadialGradient(
                center: Alignment.topCenter,
                radius: 1.2,
                colors: [Color(0xFF1A1612), Color(0xFF070709)],
              ),
            ),
          ),
          SafeArea(
            child: IndexedStack(
              index: _currentIndex,
              children: const [
                AtharHomeTab(),
                AtharQuranTab(),
                AtharFavoritesTab(),
                AtharAzkarTab(),
                AtharSettingsTab(),
              ],
            ),
          ),
        ],
      ),
      // iOS Style Glassmorphism Bottom Navigation Dock
      bottomNavigationBar: SafeArea(
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          height: 64,
          decoration: BoxDecoration(
            color: const Color(0xFF0E0C10).withOpacity(0.85),
            borderRadius: BorderRadius.circular(32),
            border: Border.all(color: const Color(0xFFD4AF37).withOpacity(0.35), width: 1),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.7),
                blurRadius: 25,
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

class AtharHomeTab extends StatelessWidget {
  const AtharHomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          const SizedBox(height: 10),
          const Text(
            'أَثَـــــر',
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.w900,
              color: Color(0xFFD4AF37),
              letterSpacing: 2,
            ),
          ),
          const Text(
            'A T H A R',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: Color(0xFFFEF08A),
              letterSpacing: 6,
            ),
          ),
          const SizedBox(height: 20),
          // Prayer times preview card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF141218).withOpacity(0.7),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFD4AF37).withOpacity(0.3)),
            ),
            child: const Column(
              children: [
                Text(
                  'مواقيت الصلاة — الغردقة (البحر الأحمر)',
                  style: TextStyle(color: Color(0xFFFEF08A), fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 8),
                Text(
                  'الصلاة القادمة: صلاة العصر',
                  style: TextStyle(color: Colors.white70, fontSize: 13),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class AtharQuranTab extends StatelessWidget {
  const AtharQuranTab({super.key});
  @override
  Widget build(BuildContext context) => const Center(child: Text("المصحف الشريف كامل الـ 114 سورة"));
}

class AtharFavoritesTab extends StatelessWidget {
  const AtharFavoritesTab({super.key});
  @override
  Widget build(BuildContext context) => const Center(child: Text("المفضلة"));
}

class AtharAzkarTab extends StatelessWidget {
  const AtharAzkarTab({super.key});
  @override
  Widget build(BuildContext context) => const Center(child: Text("الأذكار والسبحة الإلكترونية"));
}

class AtharSettingsTab extends StatelessWidget {
  const AtharSettingsTab({super.key});
  @override
  Widget build(BuildContext context) => const Center(child: Text("الإعدادات وتخصيص الخلفيات"));
}
