import React, { useState } from 'react';
import { Award } from 'lucide-react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'white';
}

export const District3131Logo: React.FC<LogoProps> = ({ className = 'h-11', variant = 'light' }) => {
  const [imageError, setImageError] = useState(false);
  const isWhite = variant === 'white';
  const subTextColor = isWhite ? '#FEE2E2' : '#990000';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* 1. Official Image Asset (User replaceable at /public/assets/rotaract-district-3131-logo.png) */}
      {!imageError ? (
        <img
          src="/assets/rotaract-district-3131-logo.png"
          alt="Rotaract District 3131 Logo"
          onError={() => setImageError(true)}
          className="h-full w-auto max-h-12 object-contain"
        />
      ) : (
        /* 2. Clean Fallback Placeholder when image file has not yet been placed */
        <div className="flex items-center gap-2.5">
          <div
            className={`h-9 w-9 flex items-center justify-center rounded-xl border border-dashed ${
              isWhite ? 'border-white/50 bg-white/10 text-white' : 'border-red-400 bg-red-50 text-[#990000]'
            }`}
            title="Replaceable image path: /assets/rotaract-district-3131-logo.png"
          >
            <Award className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="font-black tracking-tight uppercase text-base"
              style={{
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
      )}
    </div>
  );
};
