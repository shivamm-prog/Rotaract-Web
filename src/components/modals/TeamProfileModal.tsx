import React, { useEffect, useState } from 'react';
import {
  X,
  Save,
  Upload,
  Instagram,
  Linkedin,
  User,
} from 'lucide-react';

import { ClubMember } from '../../types/rotaract';

interface TeamProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: ClubMember | null;

  onSaveProfile: (
    memberKey: string,
    updates: Partial<ClubMember>
  ) => Promise<void>;
}

export const TeamProfileModal: React.FC<
  TeamProfileModalProps
> = ({
  isOpen,
  onClose,
  member,
  onSaveProfile,
}) => {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [instagramUrl, setInstagramUrl] =
      useState('');
    const [linkedinUrl, setLinkedinUrl] =
      useState('');
    const [photoUrl, setPhotoUrl] =
      useState<string | undefined>();

    const [saving, setSaving] = useState(false);
    const [error, setError] =
      useState<string | null>(null);

    /* -----------------------------------------
       LOAD MEMBER DATA
    ----------------------------------------- */

    useEffect(() => {
      if (!member) {
        return;
      }

      setName(member.name || '');
      setBio(member.bio || '');
      setInstagramUrl(
        member.instagramUrl || ''
      );
      setLinkedinUrl(
        member.linkedinUrl || ''
      );
      setPhotoUrl(
        member.photoUrl
      );

      setError(null);
    }, [member]);

    /* -----------------------------------------
       IMAGE UPLOAD
    ----------------------------------------- */

    const handlePhotoChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError(
          'Please select a valid image file.'
        );
        return;
      }

      /*
       * Limit file size to 5 MB
       */
      if (file.size > 5 * 1024 * 1024) {
        setError(
          'Image size must be less than 5 MB.'
        );
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const result =
          reader.result;

        if (typeof result === 'string') {
          setPhotoUrl(result);
          setError(null);
        }
      };

      reader.onerror = () => {
        setError(
          'Failed to read the selected image.'
        );
      };

      reader.readAsDataURL(file);
    };

    /* -----------------------------------------
       SAVE
    ----------------------------------------- */

    const handleSave = async () => {
      if (!member) {
        return;
      }

      if (!name.trim()) {
        setError(
          'Name cannot be empty.'
        );
        return;
      }

      /*
       * CRITICAL:
       *
       * Use member.id.
       *
       * DO NOT use:
       * member.positionKey
       * member.role
       * member.name
       *
       * member.id is the Firebase UID
       * supplied by TeamView.
       */
      const memberKey = member.id;

      if (!memberKey) {
        setError(
          'Unable to identify this Firebase account.'
        );
        return;
      }

      /*
       * Extra protection against the
       * previous "Club Vice President"
       * bug.
       */
      if (
        memberKey === member.positionKey ||
        memberKey === member.role ||
        memberKey === member.name
      ) {
        setError(
          'Invalid Firebase account ID. Please refresh the page and try again.'
        );
        return;
      }

      setSaving(true);
      setError(null);

      try {
        await onSaveProfile(
          memberKey,
          {
            name: name.trim(),
            bio: bio.trim(),
            instagramUrl:
              instagramUrl.trim(),
            linkedinUrl:
              linkedinUrl.trim(),
            photoUrl,
          }
        );

        onClose();
      } catch (err) {
        console.error(
          'Profile save error:',
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to save profile.'
        );
      } finally {
        setSaving(false);
      }
    };

    if (!isOpen || !member) {
      return null;
    }

    /* -----------------------------------------
       UI
    ----------------------------------------- */

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

        <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">

          {/* HEADER */}

          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-white border-b border-slate-200">

            <div>

              <h2 className="text-xl font-black text-slate-900">
                Update Profile
              </h2>

              <p className="text-xs font-medium text-slate-500 mt-1">
                Update your public team profile
              </p>

            </div>

            <button
              onClick={onClose}
              disabled={saving}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

          {/* BODY */}

          <div className="p-6 space-y-5">

            {/* PHOTO */}

            <div className="flex flex-col items-center">

              <div className="relative">

                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Profile"
                    className="w-28 h-28 rounded-3xl object-cover border-4 border-red-100 shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-3xl bg-red-50 border-4 border-red-100 flex items-center justify-center text-[#990000]">
                    <User className="w-10 h-10" />
                  </div>
                )}

              </div>

              <label className="mt-3 cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-[#990000] border border-red-200 text-xs font-black uppercase tracking-wider hover:bg-[#990000] hover:text-white transition">

                <Upload className="w-4 h-4" />

                Change Photo

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handlePhotoChange
                  }
                  className="hidden"
                />

              </label>

            </div>

            {/* NAME */}

            <div>

              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 text-sm font-semibold"
                placeholder="Enter your name"
              />

            </div>

            {/* ROLE - READ ONLY */}

            <div>

              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
                Position
              </label>

              <input
                type="text"
                value={member.role}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm font-semibold"
              />

            </div>

            {/* BIO */}

            <div>

              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
                Bio
              </label>

              <textarea
                value={bio}
                onChange={(e) =>
                  setBio(e.target.value)
                }
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 text-sm resize-none"
                placeholder="Tell people a little about yourself..."
              />

            </div>

            {/* INSTAGRAM */}

            <div>

              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
                Instagram
              </label>

              <div className="relative">

                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) =>
                    setInstagramUrl(
                      e.target.value
                    )
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 text-sm"
                  placeholder="https://instagram.com/username"
                />

              </div>

            </div>

            {/* LINKEDIN */}

            <div>

              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
                LinkedIn
              </label>

              <div className="relative">

                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) =>
                    setLinkedinUrl(
                      e.target.value
                    )
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 text-sm"
                  placeholder="https://linkedin.com/in/username"
                />

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

          </div>

          {/* FOOTER */}

          <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 bg-white border-t border-slate-200">

            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-wider text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#990000] text-white text-xs font-black uppercase tracking-wider hover:bg-[#730000] disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md"
            >

              <Save className="w-4 h-4" />

              {saving
                ? 'Saving...'
                : 'Save Profile'}

            </button>

          </div>

        </div>
      </div>
    );
  };