import React, { useState } from 'react';
import {
  Mail,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Send,
  Phone,
  MessageSquare,
  ExternalLink,
  Check,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSent(true);
      setSubmitting(false);
      setInquiry({ name: '', email: '', subject: '', message: '' });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#8a0000] via-[#990000] to-[#6e0000] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-red-800">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-black uppercase tracking-widest text-red-200 bg-white/10 px-3.5 py-1 rounded-full border border-white/20 inline-block mb-3">
            Get in Touch With Leadership
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Contact RAC RSCOE
          </h1>
          <p className="mt-3 text-red-100 text-sm sm:text-base font-medium max-w-2xl mx-auto">
            Have an inquiry, collaborative partnership proposal, or wish to connect with our Core Team? Reach out directly.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Official Channels */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#990000]">
                Official Communication
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Connect With Us
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Reach out to our executive secretariat or follow our verified media channels:
              </p>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-start gap-4 hover:border-red-300 transition">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Official Email
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  <a
                    href="mailto:rscoerotaract@gmail.com"
                    className="hover:text-[#990000] transition"
                  >
                    rscoerotaract@gmail.com
                  </a>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  For formal communications, club invitations, and inquiries.
                </p>
              </div>
            </div>

            {/* Social Channels */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Official Social Channels
              </span>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/rotaract_rscoe/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-200 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-900 group-hover:text-[#990000]">
                      Instagram
                    </h5>
                    <p className="text-[11px] text-slate-500 font-medium">@rotaract_rscoe</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#990000] transition" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/rotaract-club-of-rscoe/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-200 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-900 group-hover:text-[#990000]">
                      LinkedIn
                    </h5>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Rotaract Club of RSCOE
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#990000] transition" />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@rcrscoe_official"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-200 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-900 group-hover:text-[#990000]">
                      YouTube
                    </h5>
                    <p className="text-[11px] text-slate-500 font-medium">@rcrscoe_official</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#990000] transition" />
              </a>
            </div>

            {/* Campus Headquarters Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Campus Address
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  JSPM's Rajarshi Shahu College of Engineering
                </h4>
                <p>Survey No. 80, Pune-Mumbai Bypass Highway,</p>
                <p>Tathawade, Pimpri-Chinchwad, Pune, Maharashtra 411033</p>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Inquiry Message Form */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200">
            <span className="text-xs font-black uppercase tracking-widest text-[#990000]">
              Send a Message
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Contact Secretariat
            </h2>
            <p className="text-xs text-slate-600 mt-1 mb-6">
              Drop us a line and our reporting secretary or secretariat will respond promptly.
            </p>

            {sent ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-lg font-black text-emerald-900">Message Dispatched!</h3>
                <p className="text-xs text-emerald-800">
                  Thank you for reaching out. We have received your query and will reply via email shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-2 px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs uppercase"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rtr. Amit Joshi"
                    value={inquiry.name}
                    onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000] focus:ring-1 focus:ring-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={inquiry.email}
                    onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000] focus:ring-1 focus:ring-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Collaboration Proposal / Event Inquiry"
                    value={inquiry.subject}
                    onChange={(e) => setInquiry({ ...inquiry, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000] focus:ring-1 focus:ring-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                    Message Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message here..."
                    value={inquiry.message}
                    onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000] focus:ring-1 focus:ring-[#990000]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-[#990000] hover:bg-[#800000] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md transition active:scale-98 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Sending...' : 'Transmit Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

