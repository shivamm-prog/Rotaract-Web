import React, { useState } from 'react';
import {
  UserCheck,
  UserX,
  Clock,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  Phone,
  Search,
} from 'lucide-react';
import { UserProfile, BODApprovalStatus } from '../types/rotaract';
import { useAuth } from '../context/AuthContext';

interface BODApprovalsViewProps {
  users: UserProfile[];
  onUpdateStatus: (userId: string, status: BODApprovalStatus, reason?: string) => Promise<void>;
}

export const BODApprovalsView: React.FC<BODApprovalsViewProps> = ({ users, onUpdateStatus }) => {
  const { userProfile, isCoreTeam } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionModal, setRejectionModal] = useState<{ userId: string; name: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Position limit reached or credentials unverified.');

  const bodUsers = users.filter((u) => u.role === 'bod');

  const filteredUsers = bodUsers.filter((u) => {
    if (filter === 'all') return true;
    return (u.bodStatus || 'pending') === filter;
  });

  const handleApprove = async (userId: string) => {
    setProcessingId(userId);
    try {
      await onUpdateStatus(userId, 'approved');
    } catch (err: any) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectionModal) return;
    setProcessingId(rejectionModal.userId);
    try {
      await onUpdateStatus(rejectionModal.userId, 'rejected', rejectionReason);
      setRejectionModal(null);
    } catch (err: any) {
      alert(`Rejection error: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = bodUsers.filter((u) => (u.bodStatus || 'pending') === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-red-200 bg-white p-6 shadow-xs">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#990000]">
            Core Team Administration
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Board of Directors (BOD) Approvals
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review applicant registrations. Approved directors gain edit access only to their assigned avenue.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setFilter('pending')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'pending'
                ? 'bg-[#990000] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pending</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white text-[#990000] text-[10px] font-black">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'approved'
                ? 'bg-[#990000] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'rejected'
                ? 'bg-[#990000] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rejected
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'all'
                ? 'bg-[#990000] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All BOD ({bodUsers.length})
          </button>
        </div>
      </div>

      {/* List of Applications */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100">
          {filteredUsers.map((user) => {
            const status = user.bodStatus || 'pending';
            const isProcessing = processingId === user.uid;

            return (
              <div
                key={user.uid}
                className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#990000] to-[#700000] text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-xs">
                    {user.displayName
                      .replace('Rtr.', '')
                      .trim()
                      .split(' ')
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase() || 'BD'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-black text-slate-900">{user.displayName}</h4>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#990000]">
                      {user.position || 'BOD Applicant'} • Avenue: {user.assignedAvenue || 'General'}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-0.5 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{user.email}</span>
                      </span>
                      {user.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{user.phone}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Registered: {new Date(user.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>

                    {status === 'approved' && user.approvedBy && (
                      <p className="text-[11px] text-emerald-700 font-semibold pt-1">
                        Approved by: {user.approvedBy} on {new Date(user.approvedAt || 0).toLocaleDateString()}
                      </p>
                    )}

                    {status === 'rejected' && user.rejectionReason && (
                      <p className="text-[11px] text-red-700 font-semibold pt-1">
                        Reason: {user.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions: Approve / Reject (Only Core Team) */}
                {isCoreTeam && (
                  <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
                    {status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(user.uid)}
                        disabled={isProcessing}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition shadow-xs active:scale-95 disabled:opacity-50"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                    )}

                    {status !== 'rejected' && (
                      <button
                        onClick={() => setRejectionModal({ userId: user.uid, name: user.displayName })}
                        disabled={isProcessing}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs uppercase tracking-wider transition active:scale-95 disabled:opacity-50"
                      >
                        <UserX className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No {filter} BOD applications found</p>
              <p className="text-xs text-slate-400 mt-1">All registrations are up to date.</p>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {rejectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900">
              Reject BOD Applicant: {rejectionModal.name}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Please specify the reason for rejection (e.g. position limit reached):
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-3 w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000]"
            />

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setRejectionModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
