import React, { useState } from 'react';
import { Shield } from 'lucide-react';

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
  const [imageError, setImageError] = useState(false);
  const isWhite = variant === 'white';
  const textColor = isWhite ? '#FFFFFF' : '#111827';
  const subTextColor = isWhite ? '#FEE2E2' : '#7F1D1D';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 1. Official Image Asset (User replaceable at /public/assets/rotaract-rscoe-logo.png) */}
      {!imageError ? (
        <img
          src="/assets/rotaract-rscoe-header-logo.png"
          alt="Rotaract Club of RSCOE Logo"
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
            title="Replaceable image path: /assets/rotaract-rscoe-logo.png"
          >
            <Shield className="h-5 w-5" />
          </div>

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
      )}
    </div>
  );
};
