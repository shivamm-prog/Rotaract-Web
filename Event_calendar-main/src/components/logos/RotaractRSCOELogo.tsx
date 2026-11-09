import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'white';
  showSubtext?: boolean;
}

export const RotaractRSCOELogo: React.FC<LogoProps> = ({
  className = 'h-11',
  variant = 'white',
  showSubtext = true,
}) => {
  const isWhite = variant === 'white';
  const primaryColor = isWhite ? '#FFFFFF' : '#990000';
  const textColor = isWhite ? '#FFFFFF' : '#111827';
  const subTextColor = isWhite ? '#FEE2E2' : '#7F1D1D';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Rotaract Emblem / Gear with RSCOE Shield Badge */}
      <div className="relative flex-shrink-0 h-full aspect-square flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill={isWhite ? 'rgba(255,255,255,0.15)' : 'rgba(153,0,0,0.08)'} />
          {/* Wheel teeth */}
          {[...Array(12)].map((_, i) => (
            <rect
              key={i}
              x="47"
              y="2"
              width="6"
              height="8"
              rx="1.5"
              fill={primaryColor}
              transform={`rotate(${i * 30} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="42" stroke={primaryColor} strokeWidth="5" />
          <circle cx="50" cy="50" r="28" fill={primaryColor} />
          {/* Stylized 'R' for Rotaract / RSCOE in inner core */}
          <path
            d="M44 38 H52 C56 38 58 40 58 44 C58 47.5 56 49.5 52 50 L58 62 H52.5 L47.5 50.5 H44 V62 H39 V38 H44 Z M44 42 V47 H51 C52.5 47 53.5 46 53.5 44.5 C53.5 43 52.5 42 51 42 H44 Z"
            fill={isWhite ? '#990000' : '#FFFFFF'}
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col text-left leading-tight">
        <span
          className="font-black uppercase tracking-tight text-sm sm:text-base"
          style={{
            color: textColor,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '-0.02em',
          }}
        >
          Rotaract Club of RSCOE
        </span>
        {showSubtext && (
          <span
            className="text-[10px] sm:text-[11px] font-semibold tracking-normal mt-0.5"
            style={{ color: subTextColor }}
          >
            Rajarshi Shahu College of Engineering • Tathawade
          </span>
        )}
      </div>
    </div>
  );
};
