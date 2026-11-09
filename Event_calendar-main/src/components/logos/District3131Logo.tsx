import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'white';
}

export const District3131Logo: React.FC<LogoProps> = ({ className = 'h-11', variant = 'light' }) => {
  const isWhite = variant === 'white';
  const primaryColor = isWhite ? '#FFFFFF' : '#990000';
  const textColor = isWhite ? '#FFFFFF' : '#1F2937';
  const subTextColor = isWhite ? '#FEE2E2' : '#990000';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Rotary / Rotaract Gear Wheel Vector */}
      <svg
        viewBox="0 0 100 100"
        className="h-full aspect-square flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="46" fill={isWhite ? 'rgba(255,255,255,0.12)' : 'rgba(153,0,0,0.06)'} />
        {/* Outer cogs / gear rim */}
        <path
          d="M50 4 A46 46 0 1 0 50 96 A46 46 0 1 0 50 4"
          stroke={primaryColor}
          strokeWidth="6"
        />
        {/* 24 cogs around circumference */}
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
        {/* Inner Hub & Keyway */}
        <circle cx="50" cy="50" r="22" stroke={primaryColor} strokeWidth="5" fill="none" />
        <circle cx="50" cy="50" r="10" fill={primaryColor} />
        <rect x="47" y="38" width="6" height="5" fill={primaryColor} />
        {/* 6 Spokes */}
        {[...Array(6)].map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="28"
            x2="50"
            y2="38"
            stroke={primaryColor}
            strokeWidth="4.5"
            strokeLinecap="round"
            transform={`rotate(${i * 60} 50 50)`}
          />
        ))}
      </svg>

      {/* Typography for District 3131 */}
      <div className="flex flex-col leading-none">
        <span
          className="font-black tracking-tight uppercase"
          style={{
            fontSize: '1.15rem',
            color: isWhite ? '#FFFFFF' : '#990000',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '-0.02em',
          }}
        >
          Rotaract
        </span>
        <span
          className="font-extrabold uppercase tracking-widest text-[9px] mt-0.5"
          style={{ color: subTextColor }}
        >
          District 3131
        </span>
      </div>
    </div>
  );
};
