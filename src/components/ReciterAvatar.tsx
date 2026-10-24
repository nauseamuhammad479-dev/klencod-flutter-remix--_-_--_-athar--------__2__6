import React, { useState } from 'react';
import { User, Sparkles } from 'lucide-react';
import { Reciter } from '../data/reciters';

interface ReciterAvatarProps {
  reciter: Reciter;
  sizeClass?: string;
  className?: string;
  showGlow?: boolean;
  onPhotoClick?: () => void;
}

export const ReciterAvatar: React.FC<ReciterAvatarProps> = ({
  reciter,
  sizeClass = 'w-20 h-20',
  className = '',
  showGlow = false,
  onPhotoClick,
}) => {
  const [hasError, setHasError] = useState(false);

  // Extract Sheikh's known surname / title
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[parts.length - 1]}`;
    }
    return name;
  };

  return (
    <div
      onClick={onPhotoClick}
      className={`relative rounded-full p-[2.5px] bg-gradient-to-tr from-[#854d0e] via-[#d4af37] to-[#fef08a] shrink-0 select-none ${sizeClass} ${className} ${
        showGlow ? 'shadow-[0_0_25px_rgba(212,175,55,0.4)] ring-2 ring-[#fef08a]/50' : 'shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
      }`}
    >
      {!hasError && reciter.avatar ? (
        <img
          src={reciter.avatar}
          alt={reciter.name}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full rounded-full object-cover filter contrast-[1.03]"
        />
      ) : (
        /* Fallback Islamic Calligraphic Medallion */
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1c1917] via-[#0f0e12] to-[#050505] flex flex-col items-center justify-center p-1 text-center relative overflow-hidden border border-[#d4af37]/30">
          <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:8px_8px] opacity-20 pointer-events-none" />
          <User className="w-5 h-5 text-[#d4af37] mb-0.5" />
          <span className="text-[10px] font-bold text-[#fef08a] leading-tight line-clamp-1 px-1">
            {getInitials(reciter.name)}
          </span>
        </div>
      )}

      {/* Ambient subtle glass sheen */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
    </div>
  );
};
