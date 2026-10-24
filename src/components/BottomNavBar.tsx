import React from 'react';
import { Home, BookOpen, Heart, Moon, Settings } from 'lucide-react';
import { useApp, TabType } from '../context/AppContext';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab, triggerHaptic } = useApp();

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'quran', label: 'القرآن', icon: BookOpen },
    { id: 'favorites', label: 'المفضلة', icon: Heart },
    { id: 'azkar', label: 'الأذكار', icon: Moon },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="التنقل الرئيسي"
        className="pointer-events-auto w-full max-w-md h-16 rounded-full px-2 py-1.5 flex items-center justify-around bg-[#0c0a0c]/85 backdrop-blur-2xl border border-[#d4af37]/35 shadow-[0_12px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(254,240,138,0.2)]"
      >
        {tabs.map((tab) => {
          const isActive =
            activeTab === tab.id ||
            (tab.id === 'home' && (activeTab === 'reciters' || activeTab === 'masbaha' || activeTab === 'prayer' || activeTab === 'flutter'));
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                triggerHaptic(20);
              }}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all duration-300 group focus:outline-none"
            >
              {/* Active Golden Ambient Glow Pill */}
              {isActive && (
                <span
                  className="absolute inset-1 rounded-full bg-gradient-to-b from-[#d4af37]/25 to-[#d4af37]/5 border border-[#d4af37]/30 shadow-[0_0_12px_rgba(212,175,55,0.35)] -z-10 transition-all duration-300"
                />
              )}

              {/* Icon with scaling & gold coloring */}
              <div
                className={`transition-all duration-200 transform ${
                  isActive ? 'scale-110 text-[#fef08a] -translate-y-0.5' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.3]' : 'stroke-[1.7]'}`} />
              </div>

              {/* Text Label */}
              <span
                className={`text-[11px] font-medium tracking-tight mt-0.5 transition-colors duration-200 ${
                  isActive ? 'text-[#fef08a] font-bold' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {tab.label}
              </span>

              {/* Active Micro-indicator dot */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#fef08a] shadow-[0_0_6px_#fef08a] mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
