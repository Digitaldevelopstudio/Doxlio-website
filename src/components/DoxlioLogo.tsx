import React from 'react';

interface DoxlioLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  iconOnly?: boolean;
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
  inverted?: boolean;
}

/**
 * High-definition vector SVG representation of the Doxlio document icon.
 * Features:
 * - Back foundation card in deep navy
 * - Front rounded document sheet with royal-blue-to-violet gradient (#2563EB -> #7C3AED)
 * - Precision top-right folded corner flap
 * - Three horizontal white content indicators
 * - Dynamic orbital swoosh wrapping from lower-left around the document
 */
export const DoxlioIcon: React.FC<{ sizeClass?: string; className?: string }> = ({
  sizeClass = 'w-9 h-9',
  className = '',
}) => {
  return (
    <div className={`relative shrink-0 flex items-center justify-center ${sizeClass} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        <defs>
          {/* Main Document Body Gradient */}
          <linearGradient id="doxlio-body-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="55%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>

          {/* Dynamic Orbital Swoosh Gradient */}
          <linearGradient id="doxlio-swoosh-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="45%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>

          {/* Folded Flap Gradient */}
          <linearGradient id="doxlio-fold-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#BFDBFE" />
            <stop offset="100%" stopColor="#EFF6FF" />
          </linearGradient>

          {/* Back Card Gradient */}
          <linearGradient id="doxlio-back-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* Back Card Silhouette */}
        <rect
          x="14"
          y="26"
          width="44"
          height="54"
          rx="12"
          fill="url(#doxlio-back-gradient)"
          opacity="0.85"
        />

        {/* Front Sheet with Folded Top-Right Corner */}
        <path
          d="M 33 14 H 53 L 73 34 V 74 C 73 80.6 67.6 86 61 86 H 35 C 28.4 86 23 80.6 23 74 V 24 C 23 18.5 27.5 14 33 14 Z"
          fill="url(#doxlio-body-gradient)"
        />

        {/* Folded Corner Flap */}
        <path
          d="M 53 14 V 27 C 53 30.8 56.2 34 60 34 H 73 Z"
          fill="url(#doxlio-fold-gradient)"
        />

        {/* 3 Horizontal Content Stripes */}
        <rect x="33" y="44" width="27" height="4.5" rx="2.25" fill="#FFFFFF" />
        <rect x="33" y="54" width="27" height="4.5" rx="2.25" fill="#FFFFFF" />
        <rect x="33" y="64" width="16" height="4.5" rx="2.25" fill="#FFFFFF" />

        {/* Dynamic Orbital Swoosh wrapping around lower portion */}
        <path
          d="M 10 74 C 10 84.5 23 89.5 39 85.5 C 57 81 74 70 89.5 54.5 C 90.6 53.4 89.8 52 88.2 52.8 C 72.5 64.5 53.5 73.8 37 75.8 C 24.5 77.3 16.5 74.5 16.5 68 C 16.5 64.2 21 59.5 28 55 C 28 57.2 26.8 58.8 24.8 60.8 C 16 65.5 10 69.8 10 74 Z"
          fill="url(#doxlio-swoosh-gradient)"
        />
      </svg>
    </div>
  );
};

export const DoxlioLogo: React.FC<DoxlioLogoProps> = ({
  size = 'md',
  iconOnly = false,
  showSubtitle = false,
  subtitleText = 'Workspace',
  className = '',
  inverted = false,
}) => {
  // Sizing matrix for icon & text
  const sizeStyles = {
    xs: {
      icon: 'w-6 h-6',
      text: 'text-base',
      sub: 'text-[8px]',
      gap: 'gap-1.5',
    },
    sm: {
      icon: 'w-7 h-7',
      text: 'text-lg',
      sub: 'text-[9px]',
      gap: 'gap-2',
    },
    md: {
      icon: 'w-9 h-9',
      text: 'text-2xl',
      sub: 'text-[10px]',
      gap: 'gap-2.5',
    },
    lg: {
      icon: 'w-11 h-11',
      text: 'text-3xl',
      sub: 'text-xs',
      gap: 'gap-3',
    },
    xl: {
      icon: 'w-14 h-14',
      text: 'text-4xl',
      sub: 'text-sm',
      gap: 'gap-3.5',
    },
  }[size];

  return (
    <div className={`inline-flex items-center ${sizeStyles.gap} ${className}`}>
      {/* Icon Mark */}
      <DoxlioIcon sizeClass={sizeStyles.icon} />

      {/* Wordmark: "Doxlio" with exact two-tone brand coloring */}
      {!iconOnly && (
        <div className="flex flex-col justify-center leading-none select-none">
          <div className="flex items-center leading-none">
            {/* "Dox" in deep navy (#101828) in light mode, crisp white (#FFFFFF) in dark mode */}
            <span
              className={`font-black tracking-tight ${sizeStyles.text} ${
                inverted
                  ? 'text-white'
                  : 'text-[#101828] dark:text-white'
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              Dox
            </span>

            {/* "lio" in royal blue to violet gradient (#2563EB -> #7C3AED) */}
            <span
              className={`font-black tracking-tight bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent ${sizeStyles.text}`}
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              lio
            </span>
          </div>

          {showSubtitle && subtitleText && (
            <span
              className={`font-semibold tracking-wider uppercase mt-0.5 ${sizeStyles.sub} ${
                inverted
                  ? 'text-slate-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {subtitleText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
