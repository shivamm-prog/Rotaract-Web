import React, { useEffect, useState } from 'react';
import { Award, ChevronRight, Sparkles } from 'lucide-react';
import { District3131Logo } from './logos/District3131Logo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 40);

    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        onComplete();
      }, 600);
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setFading(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-br from-[#7f0000] via-[#990000] to-[#590000] text-white p-6 transition-opacity duration-700 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top subtle district banner */}
      <div className="w-full flex justify-between items-center max-w-6xl pt-4">
        <District3131Logo variant="white" className="h-10" />
        <span className="text-xs uppercase tracking-widest px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 font-bold text-red-100">
          RIY 2026–27
        </span>
      </div>

      {/* Main Hero Creative Red + White Emblem */}
      <div className="flex flex-col items-center text-center max-w-2xl px-4 my-auto">
        {/* Animated Rotaract Crest */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-white/20 blur-xl animate-pulse" />
          <div className="relative flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center rounded-3xl bg-white text-[#990000] shadow-2xl p-5 border-4 border-red-100">
            {/* Spinning Rotary Gear */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full animate-[spin_12s_linear_infinite]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="46" stroke="#990000" strokeWidth="6" />
              {[...Array(12)].map((_, i) => (
                <rect
                  key={i}
                  x="47"
                  y="2"
                  width="6"
                  height="8"
                  rx="1.5"
                  fill="#990000"
                  transform={`rotate(${i * 30} 50 50)`}
                />
              ))}
              <circle cx="50" cy="50" r="22" stroke="#990000" strokeWidth="5" fill="none" />
              <circle cx="50" cy="50" r="10" fill="#990000" />
              <rect x="47" y="38" width="6" height="5" fill="#990000" />
              {[...Array(6)].map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="28"
                  x2="50"
                  y2="38"
                  stroke="#990000"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  transform={`rotate(${i * 60} 50 50)`}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-extrabold tracking-widest text-red-200 uppercase">
            JSPM's Rajarshi Shahu College of Engineering, Tathawade
          </p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase drop-shadow-md">
            ROTARACT CLUB OF RSCOE
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-red-100 uppercase">
            Rotaract District 3131 • 9th Year of Youth Service
          </p>
        </div>

        {/* Theme Badge: कर्म • कौशलम् • कर्तव्य */}
        <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-[#990000] font-black text-lg sm:text-2xl shadow-xl tracking-wider border-2 border-red-200 transform hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5 text-[#990000]" />
          <span>“कर्म • कौशलम् • कर्तव्य”</span>
          <Sparkles className="w-5 h-5 text-[#990000]" />
        </div>
      </div>

      {/* Bottom Progress Bar & Enter Button */}
      <div className="w-full max-w-md pb-6 flex flex-col items-center gap-4">
        <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden p-0.5 border border-white/20">
          <div
            className="bg-white h-full rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          onClick={handleSkip}
          className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition border border-white/20"
        >
          <span>Enter Website</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
