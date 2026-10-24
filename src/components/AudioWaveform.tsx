import React from 'react';

interface AudioWaveformProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isPlaying,
  barCount = 28,
  className = '',
}) => {
  // Pre-generate harmonic patterns for natural audio wave heights
  const bars = Array.from({ length: barCount }, (_, i) => {
    // Generate curved heights highest near center
    const centerFactor = 1 - Math.abs(i - barCount / 2) / (barCount / 2);
    const baseHeight = 16 + Math.round(centerFactor * 32);
    // Animation delay and duration variations for natural rhythm
    const delay = (i * 0.08) % 1.2;
    const duration = 0.8 + ((i % 5) * 0.18);
    return { id: i, baseHeight, delay, duration };
  });

  return (
    <div
      className={`flex items-center justify-center gap-[3px] h-14 px-4 ${className}`}
      aria-label="موجة صوتية متحركة"
    >
      {bars.map((bar) => {
        return (
          <span
            key={bar.id}
            style={{
              height: isPlaying ? `${bar.baseHeight}px` : '4px',
              animationDuration: isPlaying ? `${bar.duration}s` : '0s',
              animationDelay: isPlaying ? `${bar.delay}s` : '0s',
            }}
            className={`w-[3px] rounded-full transition-all duration-300 ${
              isPlaying
                ? 'bg-gradient-to-t from-[#aa771c] via-[#d4af37] to-[#fef08a] shadow-[0_0_8px_rgba(212,175,55,0.4)] animate-wave-2'
                : 'bg-[#d4af37]/30'
            }`}
          />
        );
      })}
    </div>
  );
};
