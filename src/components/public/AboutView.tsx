import React from 'react';
import { Award, ShieldCheck, Quote, Sparkles, CheckCircle2, User } from 'lucide-react';
import { LEADERSHIP_MESSAGES } from '../../utils/rotaractData';

export const AboutView: React.FC = () => {
  const { president, secretary } = LEADERSHIP_MESSAGES;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#8a0000] via-[#990000] to-[#6e0000] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-red-800">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-black uppercase tracking-widest text-red-200 bg-white/10 px-3.5 py-1 rounded-full border border-white/20 inline-block mb-3">
            Rotaract District 3131 • RIY 2026–27
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            About Rotaract Club of RSCOE
          </h1>
          <p className="mt-3 text-red-100 text-sm sm:text-base font-medium max-w-2xl mx-auto">
            Entering our 9th glorious year of transformative leadership, civic responsibility, and community impact at JSPM's Rajarshi Shahu College of Engineering, Tathawade.
          </p>
        </div>
      </section>

      {/* Main Content: Club Introduction with Integrated Achievements */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 space-y-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#990000]">
              The RSCOE Rotaract Legacy
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              An Enduring Commitment to Service Above Self
            </h2>
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
            <p>
              The <strong>Rotaract Club of RSCOE</strong> stands as one of the premier collegiate youth bodies under <strong>Rotaract District 3131</strong>. Chartered at JSPM's Rajarshi Shahu College of Engineering in Tathawade, Pune, the club is currently in its <strong>9th year of impactful service</strong>. Guided by the Rotary motto of <em>“Service Above Self”</em> and our dynamic RIY 2026–27 theme <strong>“कर्म • कौशलम् • कर्तव्य”</strong>, our fellowship of over 100 enthusiastic Rotaractors actively bridges collegiate energy with tangible social good.
            </p>

            <p>
              Over nearly a decade of unwavering dedication, RAC RSCOE has etched an indelible mark of excellence across the district and nation. In <strong>RIY 2024–25</strong>, the club achieved historic national recognition with our induction into the prestigious <strong>India Book of Records</strong> for organizing an unprecedented synchronized multi-domain community outreach drive. Continuing this golden streak in <strong>RIY 2025–26</strong>, our club was honored with a staggering tally of <strong>13 District 3131 Awards</strong>, celebrating best-in-class achievements across Club Service, Community Development, Professional Advancement, and Media Publication.
            </p>

            <p>
              This extraordinary heritage is brought to life every day through our signature multi-avenue projects. From <strong>Project Saptarishi</strong>—our 7-day flagship addressing preventive healthcare, literacy, environmental sustainability, and women empowerment—to <strong>Rotaract ki Pathshala</strong>, providing continuous STEM coaching and digital tools to underprivileged children, our members lead from the front. Our high-impact state-level leadership conclave <strong>Avahan</strong> sparks entrepreneurship in young engineers, while healthcare interventions like <strong>Drishti 1.0 & 2.0</strong> have delivered comprehensive ophthalmic screenings and free corrective spectacles to more than 1,500 beneficiaries.
            </p>

            <p>
              Our empathy extends unconditionally across every facet of civic life. Through the <strong>Paw Care Drive</strong>, Rotaractors install reflective luminous collars and administer rabies vaccinations for community strays; through <strong>Mauli Seva</strong>, our teams serve over 12,000 Warkari pilgrims during the annual Pandharpur Palkhi Yatra; and through <strong>Project Rahat</strong>, we deliver vital thermal blankets and crisis care kits to vulnerable pavement dwellers in peak winter nights.
            </p>
          </div>

          {/* Integrated Highlights Pill Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-4">
            <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#990000] flex-shrink-0" />
              <span className="text-xs font-bold text-slate-800">India Book of Records (RIY 2024–25)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 flex items-center gap-3">
              <Award className="w-5 h-5 text-[#990000] flex-shrink-0" />
              <span className="text-xs font-bold text-slate-800">13 District Awards (RIY 2025–26)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#990000] flex-shrink-0" />
              <span className="text-xs font-bold text-slate-800">Flagship Project Saptarishi</span>
            </div>
            <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#990000] flex-shrink-0" />
              <span className="text-xs font-bold text-slate-800">Rotaract ki Pathshala & Avahan</span>
            </div>
            <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#990000] flex-shrink-0" />
              <span className="text-xs font-bold text-slate-800">Drishti 1.0 & 2.0 Vision Camps</span>
            </div>
            <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#990000] flex-shrink-0" />
              <span className="text-xs font-bold text-slate-800">Paw Care, Mauli Seva & Rahat</span>
            </div>
          </div>
        </div>

        {/* Leadership Messages: President & Secretary (Fixed and NOT editable from dashboard) */}
        <div className="mt-12 space-y-10">
          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-widest text-[#990000]">
              Club Leadership RIY 2026–27
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Messages from the President & Secretary
            </h2>
            <div className="mt-2 h-1 w-20 bg-[#990000] mx-auto rounded-full" />
          </div>

          {/* President Profile & Message */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border-2 border-red-100 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center text-center flex-shrink-0 w-full md:w-56">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#990000] to-[#660000] text-white flex items-center justify-center font-black text-3xl shadow-lg border-4 border-red-100 mb-3">
                SC
              </div>
              <h3 className="text-lg font-black text-slate-900">{president.name}</h3>
              <p className="text-xs font-extrabold text-[#990000] uppercase tracking-wider">{president.title}</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{president.term}</p>
              <div className="mt-2 px-2.5 py-1 bg-red-50 rounded-md text-[10px] font-bold text-[#990000] border border-red-200">
                {president.theme}
              </div>
            </div>

            <div className="flex-1 space-y-4 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8">
              <div className="flex items-center gap-2 text-[#990000]">
                <Quote className="w-5 h-5 opacity-40 rotate-180" />
                <span className="text-xs font-bold uppercase tracking-wider">Presidential Address</span>
              </div>
              <blockquote className="text-sm font-semibold text-slate-800 italic bg-red-50/60 p-3.5 rounded-xl border-l-4 border-[#990000]">
                “{president.quote}”
              </blockquote>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 whitespace-pre-line">
                {president.message}
              </div>
            </div>
          </div>

          {/* Secretary Profile & Message */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border-2 border-red-100 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center text-center flex-shrink-0 w-full md:w-56">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#990000] to-[#660000] text-white flex items-center justify-center font-black text-3xl shadow-lg border-4 border-red-100 mb-3">
                SS
              </div>
              <h3 className="text-lg font-black text-slate-900">{secretary.name}</h3>
              <p className="text-xs font-extrabold text-[#990000] uppercase tracking-wider">{secretary.title}</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{secretary.term}</p>
              <div className="mt-2 px-2.5 py-1 bg-red-50 rounded-md text-[10px] font-bold text-[#990000] border border-red-200">
                Administration & Secretariate
              </div>
            </div>

            <div className="flex-1 space-y-4 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8">
              <div className="flex items-center gap-2 text-[#990000]">
                <Quote className="w-5 h-5 opacity-40 rotate-180" />
                <span className="text-xs font-bold uppercase tracking-wider">Secretariat Report & Vision</span>
              </div>
              <blockquote className="text-sm font-semibold text-slate-800 italic bg-red-50/60 p-3.5 rounded-xl border-l-4 border-[#990000]">
                “{secretary.quote}”
              </blockquote>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 whitespace-pre-line">
                {secretary.message}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

