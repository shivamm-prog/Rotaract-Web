import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  Lock,
  Mail,
  User,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Shield,
  Layers,
  Info,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AvenueOfService, BODPosition, CoreTeamPosition } from '../types/rotaract';
import { BOD_POSITIONS, CORE_TEAM_POSITIONS } from '../utils/rotaractData';
import { District3131Logo } from './logos/District3131Logo';
import { RotaractRSCOELogo } from './logos/RotaractRSCOELogo';

interface LoginViewProps {
  onBackToWebsite?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBackToWebsite }) => {
  const {
    signInWithGoogle,
    signIn,
    signUpMember,
    signUpBOD,
    signUpCoreTeam,
    quickLoginDemo,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup_member' | 'signup_bod' | 'signup_core'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedBODPosition, setSelectedBODPosition] = useState<BODPosition>('Community Service Director');
  const [selectedCorePosition, setSelectedCorePosition] = useState<CoreTeamPosition>('Club President');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      if (onBackToWebsite) onBackToWebsite();
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      let msg = err.message || 'Google sign-in was cancelled or encountered an error.';
      if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Sign-in popup was closed before completing. Please try again.';
      } else if (err.code === 'auth/popup-blocked') {
        msg = 'Sign-in popup was blocked by browser. Please allow popups for this site.';
      }
      setErrorMsg(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email.trim(), password);
        if (onBackToWebsite) onBackToWebsite();
      } else if (mode === 'signup_member') {
        if (!displayName.trim()) throw new Error('Please enter your full name.');
        await signUpMember(email.trim(), password, displayName.trim(), phone.trim());
        setSuccessMsg('Account registered successfully as Club Member!');
        if (onBackToWebsite) onBackToWebsite();
      } else if (mode === 'signup_bod') {
        if (!displayName.trim()) throw new Error('Please enter your full name.');
        await signUpBOD(email.trim(), password, displayName.trim(), selectedBODPosition, phone.trim());
        setSuccessMsg('BOD Registration submitted! Your account is PENDING Core Team approval.');
      } else if (mode === 'signup_core') {
        if (!displayName.trim()) throw new Error('Please enter your full name.');
        await signUpCoreTeam(email.trim(), password, displayName.trim(), selectedCorePosition);
        setSuccessMsg(`Core Team account registered for ${selectedCorePosition}!`);
        if (onBackToWebsite) onBackToWebsite();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed. Please verify your credentials.';
      if (err.code === 'auth/operation-not-allowed' || msg.includes('disabled')) {
        msg = 'Email/Password sign-in is disabled in Firebase. Please click "Sign In with Google" above.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (roleType: 'core' | 'bod_approved' | 'bod_pending' | 'member', pos?: string) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await quickLoginDemo(roleType, pos);
      if (onBackToWebsite) onBackToWebsite();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#800000] via-[#990000] to-[#590000] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl space-y-6">
        {/* Navigation back to website */}
        {onBackToWebsite && (
          <button
            onClick={onBackToWebsite}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-200 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Return to Public Website</span>
          </button>
        )}

        {/* Brand Header */}
        <div className="text-center text-white space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#990000] shadow-lg">
            <Award className="h-8 w-8 stroke-[2.5]" />
          </div>
          <div className="text-xs font-black uppercase tracking-widest text-red-200">
            Rotaract District 3131 • RIY 2026–27
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            Rotaract Club of RSCOE
          </h1>
          <p className="text-xs text-red-100 font-semibold">
            Management Platform & Member Portal
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-red-200 space-y-6">
          {errorMsg && (
            <div className="flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-xs text-red-800 border border-red-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 mt-0.5" />
              <div className="font-medium">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 p-3.5 text-xs text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600 mt-0.5" />
              <div className="font-medium">{successMsg}</div>
            </div>
          )}

          {/* Google Sign In (Recommended & pre-configured) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="relative flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-xs hover:border-[#990000] hover:bg-slate-50 transition active:scale-98 disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google Account'}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative bg-white px-3 text-xs uppercase tracking-wider text-slate-400 font-bold">
              or credentials
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-[11px] font-bold">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(null); }}
              className={`py-1.5 rounded-lg transition ${
                mode === 'signin' ? 'bg-white text-[#990000] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup_member'); setErrorMsg(null); }}
              className={`py-1.5 rounded-lg transition ${
                mode === 'signup_member' ? 'bg-white text-[#990000] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Member
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup_bod'); setErrorMsg(null); }}
              className={`py-1.5 rounded-lg transition ${
                mode === 'signup_bod' ? 'bg-white text-[#990000] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              BOD Reg.
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup_core'); setErrorMsg(null); }}
              className={`py-1.5 rounded-lg transition ${
                mode === 'signup_core' ? 'bg-white text-[#990000] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Core Team
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode !== 'signin' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rtr. Atharva Gawte"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000]"
                  />
                </div>
              </div>
            )}

            {/* Position Picker for BOD */}
            {mode === 'signup_bod' && (
              <div className="space-y-2 p-3 bg-red-50/70 rounded-xl border border-red-200">
                <label className="block text-xs font-black uppercase text-[#990000] tracking-wider">
                  Select Desired BOD Position
                </label>
                <select
                  value={selectedBODPosition}
                  onChange={(e) => setSelectedBODPosition(e.target.value as BODPosition)}
                  className="w-full p-2 text-xs font-bold rounded-lg border border-red-300 bg-white"
                >
                  {BOD_POSITIONS.map((b) => (
                    <option key={b.title} value={b.title}>
                      {b.title} ({b.avenue}) {b.title === 'Editor' ? '— (2 active slots)' : '— (1 active slot)'}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-red-800 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#990000] flex-shrink-0" />
                  <span>Requires Core Team approval. Account will be PENDING upon registration.</span>
                </p>
              </div>
            )}

            {/* Position Picker for Core Team */}
            {mode === 'signup_core' && (
              <div className="space-y-2 p-3 bg-red-50/70 rounded-xl border border-red-200">
                <label className="block text-xs font-black uppercase text-[#990000] tracking-wider">
                  Select Official Core Team Position
                </label>
                <select
                  value={selectedCorePosition}
                  onChange={(e) => setSelectedCorePosition(e.target.value as CoreTeamPosition)}
                  className="w-full p-2 text-xs font-bold rounded-lg border border-red-300 bg-white"
                >
                  {CORE_TEAM_POSITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c} (Fixed 1 active account)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@rscoe.rotaract3131.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#990000] hover:bg-[#800000] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md transition active:scale-98 disabled:opacity-50"
            >
              {loading
                ? 'Processing...'
                : mode === 'signin'
                ? 'Sign In to Portal'
                : mode === 'signup_bod'
                ? 'Submit BOD Registration (Pending Approval)'
                : mode === 'signup_core'
                ? 'Register Core Officer Account'
                : 'Register Member Account'}
            </button>
          </form>

          {/* Quick Demo Logins for Instant Testing */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2 flex items-center justify-between">
              <span>Instant Test Logins (Role Verification)</span>
              <span className="text-[#990000]">Click to test</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleDemo('core', 'Club President')}
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-[#990000] font-bold text-left border border-red-200 transition"
              >
                <div className="font-black">Core Team</div>
                <div className="text-[10px] text-slate-600">President (Full Access)</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('bod_approved', 'Community Service Director')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-left border border-slate-200 transition"
              >
                <div className="font-black">BOD (Approved)</div>
                <div className="text-[10px] text-slate-600">Community Service Only</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('bod_pending', 'Joint Club Service Director')}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-left border border-amber-200 transition"
              >
                <div className="font-black">BOD (Pending)</div>
                <div className="text-[10px] text-amber-700">Awaiting Approval</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('member')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-left border border-slate-200 transition"
              >
                <div className="font-black">Club Member</div>
                <div className="text-[10px] text-slate-600">View Only / Profile</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
