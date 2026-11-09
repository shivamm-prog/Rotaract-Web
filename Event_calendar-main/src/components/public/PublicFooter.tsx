import React from 'react';
import { Mail, Instagram, Linkedin, Youtube, MapPin, Heart, ExternalLink, ShieldCheck } from 'lucide-react';

interface PublicFooterProps {
  onNavigate: (path: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  const handleNav = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#420000] text-white border-t border-red-950">
      {/* Top Banner */}
      <div className="bg-[#330000] py-6 px-4 sm:px-6 lg:px-8 border-b border-red-900/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h3 className="text-lg font-black tracking-tight text-white uppercase">
              ROTARACT CLUB OF RSCOE
            </h3>
            <p className="text-xs text-red-200 mt-0.5">
              Rotaract District 3131 • RIY 2026–27 • Theme: “कर्म • कौशलम् • कर्तव्य”
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('/join-us')}
              className="px-4 py-2 rounded-xl bg-white text-[#800000] font-bold text-xs uppercase tracking-wider hover:bg-red-50 transition shadow-sm"
            >
              Join Our Movement
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className="px-4 py-2 rounded-xl bg-red-900/60 hover:bg-red-900 text-white font-bold text-xs uppercase tracking-wider border border-red-700/60 transition"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: NOTE: NO LOGOS in footer as strictly instructed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About Institution & Club */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white tracking-wider uppercase border-b border-red-800 pb-2">
              Organization
            </h4>
            <p className="text-xs text-red-100 leading-relaxed">
              Chartered at JSPM's Rajarshi Shahu College of Engineering, Tathawade. Operating in our 9th consecutive year of humanitarian leadership, youth transformation, and community service under Rotary International District 3131.
            </p>
            <div className="pt-2 text-xs text-red-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>India Book of Records Inductee</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white tracking-wider uppercase border-b border-red-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('/')} className="text-red-200 hover:text-white transition">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/about')} className="text-red-200 hover:text-white transition">
                  About RAC RSCOE
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/team')} className="text-red-200 hover:text-white transition">
                  Core Team & BOD Roster
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/events')} className="text-red-200 hover:text-white transition">
                  Events & Calendar
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/projects')} className="text-red-200 hover:text-white transition">
                  Flagship Projects
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/achievements')} className="text-red-200 hover:text-white transition">
                  District Awards & Records
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/gallery')} className="text-red-200 hover:text-white transition">
                  Media & Albums
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Social Channels */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white tracking-wider uppercase border-b border-red-800 pb-2">
              Connect With Us
            </h4>
            <p className="text-xs text-red-200">
              Follow our official social platforms for real-time live event streaming, project stories, and announcements:
            </p>
            <div className="space-y-2 pt-1 text-xs">
              <a
                href="https://www.instagram.com/rotaract_rscoe/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-red-200 hover:text-white transition p-1.5 rounded-lg hover:bg-white/5"
              >
                <Instagram className="w-4 h-4 text-red-300" />
                <span>@rotaract_rscoe</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
              </a>
              <a
                href="https://www.linkedin.com/company/rotaract-club-of-rscoe/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-red-200 hover:text-white transition p-1.5 rounded-lg hover:bg-white/5"
              >
                <Linkedin className="w-4 h-4 text-red-300" />
                <span>Rotaract Club of RSCOE</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
              </a>
              <a
                href="https://youtube.com/@rcrscoe_official"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-red-200 hover:text-white transition p-1.5 rounded-lg hover:bg-white/5"
              >
                <Youtube className="w-4 h-4 text-red-300" />
                <span>@rcrscoe_official</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
              </a>
            </div>
          </div>

          {/* Col 4: Campus Headquarters & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white tracking-wider uppercase border-b border-red-800 pb-2">
              Headquarters
            </h4>
            <div className="space-y-2.5 text-xs text-red-100">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-300 flex-shrink-0 mt-0.5" />
                <span>
                  JSPM's Rajarshi Shahu College of Engineering,
                  Survey No. 80, Tathawade, Pune, Maharashtra 411033
                </span>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <Mail className="w-4 h-4 text-red-300 flex-shrink-0" />
                <a
                  href="mailto:rscoerotaract@gmail.com"
                  className="text-white hover:underline font-semibold"
                >
                  rscoerotaract@gmail.com
                </a>
              </div>
              <div className="pt-3">
                <button
                  onClick={() => handleNav('/login')}
                  className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-center transition border border-white/20 text-xs"
                >
                  Member & BOD Portal Login →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-red-950/80 bg-[#280000] py-4 px-4 text-center text-xs text-red-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Rotaract Club of RSCOE (RID 3131). All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Formulated with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
            <span>under the ethos “कर्म • कौशलम् • कर्तव्य”</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
