import React, { useEffect, useMemo, useState } from 'react';
import {
  Shield,
  Users,
  Mail,
  Pencil,
} from 'lucide-react';

import {
  OFFICIAL_CORE_TEAM,
  OFFICIAL_BOD,
} from '../../utils/rotaractData';

import {
  AvenueOfService,
  ClubMember,
  UserProfile,
} from '../../types/rotaract';

import { subscribeToUsers } from '../../services/eventService';
import { TeamProfileModal } from '../modals/TeamProfileModal';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const TeamView: React.FC = () => {
  const {
    currentUser,
    userProfile,
    isCoreTeam,
  } = useAuth();

  const [activeFilter, setActiveFilter] =
    useState<'all' | 'core' | 'bod'>('all');

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedMember, setSelectedMember] =
    useState<ClubMember | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] =
    useState(false);

  const [loadingUsers, setLoadingUsers] = useState(true);

  /* -----------------------------------------
     LOAD FIRESTORE USERS
  ----------------------------------------- */

  useEffect(() => {
    const unsubscribe = subscribeToUsers(
      (loadedUsers) => {
        setUsers(loadedUsers);
        setLoadingUsers(false);
      },
      (error) => {
        console.error(
          'Error loading team profiles:',
          error
        );
        setLoadingUsers(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* -----------------------------------------
     FIND FIRESTORE USER
  ----------------------------------------- */

  const findMatchingUser = (
    email: string,
    position: string
  ): UserProfile | undefined => {
    return users.find(
      (user) =>
        user.email?.toLowerCase() ===
        email.toLowerCase() ||
        user.position === position
    );
  };

  /* -----------------------------------------
     CORE TEAM MEMBERS
  ----------------------------------------- */

  const coreMembers: ClubMember[] = useMemo(() => {
    return OFFICIAL_CORE_TEAM.map((member) => {
      const firestoreUser = findMatchingUser(
        member.email,
        member.position
      );

      const isCurrentUser =
        userProfile?.email?.toLowerCase() ===
        member.email.toLowerCase();

      const displayName =
        firestoreUser?.displayName ||
        (isCurrentUser
          ? userProfile?.displayName
          : undefined) ||
        member.name;

      return {
        /*
         * VERY IMPORTANT:
         * If this is the logged-in user,
         * always use the real Firebase UID.
         */
        id:
          isCurrentUser && currentUser
            ? currentUser.uid
            : firestoreUser?.uid ||
            `core-${member.position}`,

        name: displayName,

        role: member.position,

        category: 'core',

        positionKey: member.position,

        email:
          firestoreUser?.email ||
          (isCurrentUser
            ? userProfile?.email
            : undefined) ||
          member.email,

        avatarInitials: displayName
          .replace('Rtr.', '')
          .trim()
          .split(' ')
          .filter(Boolean)
          .map((word) => word[0])
          .join('')
          .toUpperCase(),

        photoUrl:
          firestoreUser?.photoURL ||
          (isCurrentUser
            ? userProfile?.photoURL
            : undefined),

        linkedinUrl: undefined,
        instagramUrl: undefined,
      };
    });
  }, [
    users,
    userProfile,
    currentUser,
  ]);

  /* -----------------------------------------
     BOD MEMBERS
  ----------------------------------------- */

  const bodMembers: ClubMember[] = useMemo(() => {
    return OFFICIAL_BOD.map((member) => {
      const firestoreUser = findMatchingUser(
        member.email,
        member.position
      );

      const isCurrentUser =
        userProfile?.email?.toLowerCase() ===
        member.email.toLowerCase();

      const displayName =
        firestoreUser?.displayName ||
        (isCurrentUser
          ? userProfile?.displayName
          : undefined) ||
        member.name;

      return {
        id:
          isCurrentUser && currentUser
            ? currentUser.uid
            : firestoreUser?.uid ||
            `bod-${member.email}`,

        name: displayName,

        role: member.position,

        category: 'bod',

        positionKey: member.position,

        avenue:
          member.avenue as AvenueOfService,

        email:
          firestoreUser?.email ||
          (isCurrentUser
            ? userProfile?.email
            : undefined) ||
          member.email,

        avatarInitials: displayName
          .replace('Rtr.', '')
          .trim()
          .split(' ')
          .filter(Boolean)
          .map((word) => word[0])
          .join('')
          .toUpperCase(),

        photoUrl:
          firestoreUser?.photoURL ||
          (isCurrentUser
            ? userProfile?.photoURL
            : undefined),

        linkedinUrl: undefined,
        instagramUrl: undefined,
      };
    });
  }, [
    users,
    userProfile,
    currentUser,
  ]);

  /* -----------------------------------------
     CURRENT USER TEAM MEMBER
  ----------------------------------------- */

  const currentUserMember = useMemo(() => {
    if (!userProfile || !currentUser) {
      return null;
    }

    const allMembers = [
      ...coreMembers,
      ...bodMembers,
    ];

    /*
     * First priority: Firebase UID
     */
    const byUid = allMembers.find(
      (member) =>
        member.id === currentUser.uid
    );

    if (byUid) {
      return byUid;
    }

    /*
     * Second priority: email
     */
    const byEmail = allMembers.find(
      (member) =>
        member.email?.toLowerCase() ===
        userProfile.email?.toLowerCase()
    );

    if (byEmail) {
      return {
        ...byEmail,
        id: currentUser.uid,
      };
    }

    /*
     * Third priority: position
     */
    if (userProfile.position) {
      const byPosition = allMembers.find(
        (member) =>
          member.positionKey ===
          userProfile.position
      );

      if (byPosition) {
        return {
          ...byPosition,
          id: currentUser.uid,
          name:
            userProfile.displayName ||
            byPosition.name,
          email:
            userProfile.email ||
            byPosition.email,
          photoUrl:
            userProfile.photoURL ||
            byPosition.photoUrl,
        };
      }
    }

    return null;
  }, [
    userProfile,
    currentUser,
    coreMembers,
    bodMembers,
  ]);

  /* -----------------------------------------
     EDIT MY PROFILE
  ----------------------------------------- */

  const handleEditMyProfile = () => {
    if (!currentUser || !userProfile) {
      alert(
        'Please log in again to edit your profile.'
      );
      return;
    }

    if (!currentUserMember) {
      alert(
        'Your account could not be matched with the official team roster.'
      );
      return;
    }

    /*
     * FORCE the actual Firebase UID.
     */
    const profileMember: ClubMember = {
      ...currentUserMember,

      id: currentUser.uid,

      name:
        userProfile.displayName ||
        currentUserMember.name,

      email:
        userProfile.email ||
        currentUserMember.email,

      photoUrl:
        userProfile.photoURL ||
        currentUserMember.photoUrl,
    };

    setSelectedMember(profileMember);
    setIsProfileModalOpen(true);
  };

  /* -----------------------------------------
     EDIT MEMBER
  ----------------------------------------- */

  const handleEditMember = (
    member: ClubMember
  ) => {
    const isOwnProfile =
      currentUser?.uid === member.id ||
      userProfile?.email?.toLowerCase() ===
      member.email?.toLowerCase();

    if (!isCoreTeam && !isOwnProfile) {
      return;
    }

    /*
     * If editing own profile, force Firebase UID.
     */
    const memberToEdit =
      isOwnProfile && currentUser
        ? {
          ...member,
          id: currentUser.uid,
        }
        : member;

    setSelectedMember(memberToEdit);
    setIsProfileModalOpen(true);
  };

  /* -----------------------------------------
     SAVE PROFILE
  ----------------------------------------- */

  const handleSaveProfile = async (
    memberKey: string,
    updates: Partial<ClubMember>
  ) => {
    if (!currentUser || !userProfile) {
      throw new Error(
        'You must be logged in to update a profile.'
      );
    }

    /*
     * Determine whether this is the
     * currently logged-in user's profile.
     */
    const editingOwnProfile =
      selectedMember?.id === currentUser.uid ||
      selectedMember?.email?.toLowerCase() ===
      currentUser.email?.toLowerCase();

    let targetUid: string;

    if (editingOwnProfile) {
      /*
       * NEVER use positionKey, role or name.
       * Always use Firebase Authentication UID.
       */
      targetUid = currentUser.uid;
    } else if (
      isCoreTeam &&
      selectedMember?.id
    ) {
      /*
       * Core Team can edit another user's
       * profile using that user's Firebase UID.
       */
      targetUid = selectedMember.id;
    } else {
      throw new Error(
        'Permission Denied: You are not authorized to edit this profile.'
      );
    }

    /*
     * Safety check:
     * prevent position/name from being used
     * as Firestore document ID.
     */
    if (
      targetUid ===
      selectedMember?.positionKey ||
      targetUid === selectedMember?.role ||
      targetUid === selectedMember?.name
    ) {
      throw new Error(
        'Invalid Firebase UID detected. Please refresh the page and try again.'
      );
    }

    if (!targetUid) {
      throw new Error(
        'Unable to identify the Firebase account.'
      );
    }

    console.log(
      'Updating Firebase user:',
      targetUid
    );

    const userRef = doc(
      db,
      'users',
      targetUid
    );

    /*
     * Update Firestore user document.
     */
    await updateDoc(userRef, {
      displayName:
        updates.name?.trim() ||
        userProfile.displayName,

      photoURL:
        updates.photoUrl ?? null,

      bio:
        updates.bio?.trim() || null,

      instagramUrl:
        updates.instagramUrl?.trim() ||
        null,

      linkedinUrl:
        updates.linkedinUrl?.trim() ||
        null,

      updatedAt: Date.now(),
    });

    /*
     * Update modal state immediately.
     */
    setSelectedMember((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,

        id: targetUid,

        name:
          updates.name?.trim() ||
          previous.name,

        photoUrl:
          updates.photoUrl ??
          previous.photoUrl,

        linkedinUrl:
          updates.linkedinUrl ??
          previous.linkedinUrl,

        instagramUrl:
          updates.instagramUrl ??
          previous.instagramUrl,
      };
    });
  };

  /* -----------------------------------------
     INITIALS
  ----------------------------------------- */

  const getInitials = (
    name: string
  ) =>
    name
      .replace('Rtr.', '')
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .toUpperCase();

  /* -----------------------------------------
     PHOTO
  ----------------------------------------- */

  const renderMemberPhoto = (
    member: ClubMember,
    size: 'large' | 'small'
  ) => {
    const sizeClass =
      size === 'large'
        ? 'w-16 h-16 text-xl'
        : 'w-14 h-14 text-lg';

    if (member.photoUrl) {
      return (
        <img
          src={member.photoUrl}
          alt={member.name}
          className={`${sizeClass} rounded-2xl object-cover shadow-md border-2 border-red-100 flex-shrink-0`}
        />
      );
    }

    return (
      <div
        className={`${sizeClass} rounded-2xl bg-gradient-to-br from-[#990000] to-[#730000] text-white flex items-center justify-center font-black shadow-md border-2 border-red-100 flex-shrink-0`}
      >
        {getInitials(member.name)}
      </div>
    );
  };

  /* -----------------------------------------
     UI
  ----------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">

      {/* HERO */}

      <section className="bg-gradient-to-r from-[#8a0000] via-[#990000] to-[#6e0000] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-red-800">

        <div className="max-w-5xl mx-auto text-center">

          <span className="text-xs font-black uppercase tracking-widest text-red-200 bg-white/10 px-3.5 py-1 rounded-full border border-white/20 inline-block mb-3">
            RIY 2026–27 Leadership Roster
          </span>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Meet Our Leadership Team
          </h1>

          <p className="mt-3 text-red-100 text-sm sm:text-base font-medium max-w-2xl mx-auto">
            Dedicated youth leaders guiding Rotaract Club of RSCOE under the theme “कर्म • कौशलम् • कर्तव्य”.
          </p>

          {/* EDIT MY PROFILE */}

          {userProfile &&
            currentUserMember && (
              <div className="mt-6 flex justify-center">

                <button
                  onClick={
                    handleEditMyProfile
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#990000] font-black text-xs uppercase tracking-wider hover:bg-red-50 transition shadow-lg"
                >
                  <Pencil className="w-4 h-4" />
                  Edit My Profile
                </button>

              </div>
            )}

          {/* FILTER */}

          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20">

            <button
              onClick={() =>
                setActiveFilter('all')
              }
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${activeFilter === 'all'
                  ? 'bg-white text-[#990000] shadow-md'
                  : 'text-white hover:text-red-100'
                }`}
            >
              All Leadership (
              {coreMembers.length +
                bodMembers.length}
              )
            </button>

            <button
              onClick={() =>
                setActiveFilter('core')
              }
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${activeFilter === 'core'
                  ? 'bg-white text-[#990000] shadow-md'
                  : 'text-white hover:text-red-100'
                }`}
            >
              Core Team (
              {coreMembers.length}
              )
            </button>

            <button
              onClick={() =>
                setActiveFilter('bod')
              }
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${activeFilter === 'bod'
                  ? 'bg-white text-[#990000] shadow-md'
                  : 'text-white hover:text-red-100'
                }`}
            >
              Board of Directors (
              {bodMembers.length}
              )
            </button>

          </div>
        </div>
      </section>

      {/* LOADING */}

      {loadingUsers && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

          <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-500 text-center">
            Loading team profiles...
          </div>

        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">

        {/* CORE TEAM */}

        {(activeFilter === 'all' ||
          activeFilter === 'core') && (

            <section>

              <div className="flex items-center gap-3 mb-8 pb-3 border-b-2 border-red-200">

                <div className="w-10 h-10 rounded-xl bg-[#990000] text-white flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>

                <div>

                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Core Team 2026–27
                  </h2>

                  <p className="text-xs text-slate-500 font-semibold">
                    Executive governance & strategic club administration
                  </p>

                </div>

                <span className="ml-auto text-xs font-black uppercase text-[#990000] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  {coreMembers.length} Officers
                </span>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {coreMembers.map(
                  (member) => {

                    const isTopOfficer =
                      member.role ===
                      'Club President' ||
                      member.role ===
                      'Club Secretary' ||
                      member.role ===
                      'Club Vice President';

                    const canEdit =
                      isCoreTeam ||
                      currentUser?.uid ===
                      member.id ||
                      userProfile?.email?.toLowerCase() ===
                      member.email?.toLowerCase();

                    return (
                      <div
                        key={member.id}
                        className={`rounded-2xl p-6 bg-white border ${isTopOfficer
                            ? 'border-red-300 shadow-md ring-1 ring-red-200'
                            : 'border-slate-200 shadow-xs'
                          } flex flex-col justify-between hover:shadow-lg transition group`}
                      >

                        <div>

                          <div className="flex items-center gap-4 mb-4">

                            {renderMemberPhoto(
                              member,
                              'large'
                            )}

                            <div className="min-w-0">

                              <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#990000] bg-red-50 px-2 py-0.5 rounded border border-red-200 mb-1">
                                Core Team
                              </span>

                              <h3 className="text-base font-black text-slate-900 group-hover:text-[#990000] transition">
                                {member.name}
                              </h3>

                              <p className="text-xs font-bold text-slate-600 mt-0.5">
                                {member.role}
                              </p>

                            </div>

                          </div>

                          {canEdit && (
                            <button
                              onClick={() =>
                                handleEditMember(
                                  member
                                )
                              }
                              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-[#990000] border border-red-200 text-[11px] font-black uppercase tracking-wider hover:bg-[#990000] hover:text-white transition"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Edit Profile
                            </button>
                          )}

                        </div>

                        <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">

                          <div className="flex items-center gap-1.5 truncate">

                            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />

                            <span className="truncate">
                              {member.email}
                            </span>

                          </div>

                          <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded ml-2 flex-shrink-0">
                            Active
                          </span>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            </section>
          )}

        {/* BOD */}

        {(activeFilter === 'all' ||
          activeFilter === 'bod') && (

            <section>

              <div className="flex items-center gap-3 mb-8 pb-3 border-b-2 border-red-200">

                <div className="w-10 h-10 rounded-xl bg-[#990000] text-white flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>

                <div>

                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Board of Directors (BOD) 2026–27
                  </h2>

                  <p className="text-xs text-slate-500 font-semibold">
                    Avenue leadership, project execution & committee coordinators
                  </p>

                </div>

                <span className="ml-auto text-xs font-black uppercase text-[#990000] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  {bodMembers.length} Directors
                </span>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

                {bodMembers.map(
                  (member) => {

                    const canEdit =
                      isCoreTeam ||
                      currentUser?.uid ===
                      member.id ||
                      userProfile?.email?.toLowerCase() ===
                      member.email?.toLowerCase();

                    return (
                      <div
                        key={member.id}
                        className="rounded-2xl p-5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-red-300 transition group"
                      >

                        <div>

                          <div className="flex items-center gap-3.5 mb-3.5">

                            {renderMemberPhoto(
                              member,
                              'small'
                            )}

                            <div className="overflow-hidden">

                              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#990000] bg-red-50 px-2 py-0.5 rounded border border-red-200 mb-0.5 truncate max-w-full">
                                {member.avenue}
                              </span>

                              <h3 className="text-sm font-black text-slate-900 truncate group-hover:text-[#990000] transition">
                                {member.name}
                              </h3>

                              <p className="text-[11px] font-bold text-slate-600 line-clamp-1 mt-0.5">
                                {member.role}
                              </p>

                            </div>

                          </div>

                          {canEdit && (
                            <button
                              onClick={() =>
                                handleEditMember(
                                  member
                                )
                              }
                              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-[#990000] border border-red-200 text-[11px] font-black uppercase tracking-wider hover:bg-[#990000] hover:text-white transition"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Edit Profile
                            </button>
                          )}

                        </div>

                        <div className="pt-2.5 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">

                          <div className="flex items-center gap-1.5 truncate">

                            <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />

                            <span className="truncate">
                              {member.email}
                            </span>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            </section>
          )}

      </div>

      {/* PROFILE MODAL */}

      <TeamProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onSaveProfile={handleSaveProfile}
      />

    </div>
  );
};