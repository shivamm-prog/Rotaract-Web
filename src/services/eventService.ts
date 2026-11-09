import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  AvenueOfService,
  RotaractEvent,
  UserProfile,
  UserRole,
  ProjectItem,
  AchievementItem,
  GalleryItem,
  MembershipApplication,
  BODApprovalStatus,
  ClubMember,
} from '../types/rotaract';

export const EVENTS_COLLECTION = 'events';
export const USERS_COLLECTION = 'users';
export const PROJECTS_COLLECTION = 'projects';
export const ACHIEVEMENTS_COLLECTION = 'achievements';
export const GALLERY_COLLECTION = 'gallery';
export const APPLICATIONS_COLLECTION = 'applications';
export const TEAM_PROFILES_COLLECTION = 'team_profiles';

/**
 * Real-time subscription to all shared club events
 */
export function subscribeToEvents(
  onData: (events: RotaractEvent[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const q = query(collection(db, EVENTS_COLLECTION), orderBy('date', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const events: RotaractEvent[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();

          return {
            id: docSnap.id,
            title: data.title || '',
            avenue: data.avenue as AvenueOfService,
            status: data.status || 'upcoming',
            date: data.date || '',
            startTime: data.startTime || '',
            endTime: data.endTime || '',
            venue: data.venue || '',
            chairperson: data.chairperson || '',
            coChairperson: data.coChairperson,
            budget: Number(data.budget) || 0,
            actualExpense: data.actualExpense
              ? Number(data.actualExpense)
              : undefined,
            expectedAttendees: Number(data.expectedAttendees) || 0,
            actualAttendees: data.actualAttendees
              ? Number(data.actualAttendees)
              : undefined,
            description: data.description || '',
            objectives: data.objectives || '',
            registrationLink: data.registrationLink,
            reportSummary: data.reportSummary,
            isFlagship: Boolean(data.isFlagship),
            isPinned: Boolean(data.isPinned),
            coverImage: data.coverImage,
            createdBy: data.createdBy,
            createdAt: data.createdAt || Date.now(),
            updatedAt: data.updatedAt || Date.now(),
          };
        });

        onData(events);
      },
      (err) => {
        console.warn('Firestore events subscription notice:', err.message);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.warn('subscribeToEvents init notice:', err);
    if (onError) onError(err);
    return () => { };
  }
}

/**
 * Create a new event in Firestore with avenue permission enforcement
 */
export async function createEventFirestore(
  eventData: Omit<RotaractEvent, 'id' | 'createdAt' | 'updatedAt'>,
  userProfile: UserProfile
): Promise<string> {
  if (userProfile.role === 'member') {
    throw new Error('Permission Denied: General members cannot create events.');
  }

  if (userProfile.role === 'bod') {
    if (userProfile.bodStatus !== 'approved') {
      throw new Error(
        'Permission Denied: Your BOD account is pending Core Team approval.'
      );
    }

    if (userProfile.assignedAvenue !== eventData.avenue) {
      throw new Error(
        `Permission Denied: As a BOD member for ${userProfile.assignedAvenue}, you are only authorized to create events for your assigned avenue.`
      );
    }
  }

  const now = Date.now();

  const payload = {
    ...eventData,
    createdBy: userProfile.uid,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, EVENTS_COLLECTION), payload);

  return docRef.id;
}

/**
 * Update an existing event in Firestore with avenue permission enforcement
 */
export async function updateEventFirestore(
  eventId: string,
  eventData: Partial<RotaractEvent>,
  currentAvenue: AvenueOfService,
  userProfile: UserProfile
): Promise<void> {
  if (userProfile.role === 'member') {
    throw new Error('Permission Denied: General members cannot edit events.');
  }

  if (userProfile.role === 'bod') {
    if (userProfile.bodStatus !== 'approved') {
      throw new Error(
        'Permission Denied: Your BOD account is pending Core Team approval.'
      );
    }

    if (userProfile.assignedAvenue !== currentAvenue) {
      throw new Error(
        `Permission Denied: You cannot modify events in "${currentAvenue}". You are assigned to "${userProfile.assignedAvenue}".`
      );
    }

    if (
      eventData.avenue &&
      eventData.avenue !== userProfile.assignedAvenue
    ) {
      throw new Error(
        `Permission Denied: BOD members cannot transfer events to other avenues.`
      );
    }
  }

  const docRef = doc(db, EVENTS_COLLECTION, eventId);

  await updateDoc(docRef, {
    ...eventData,
    updatedAt: Date.now(),
  });
}

/**
 * Delete an event in Firestore with avenue permission enforcement
 */
export async function deleteEventFirestore(
  eventId: string,
  avenue: AvenueOfService,
  userProfile: UserProfile
): Promise<void> {
  if (userProfile.role === 'member') {
    throw new Error('Permission Denied: General members cannot delete events.');
  }

  if (userProfile.role === 'bod') {
    if (userProfile.bodStatus !== 'approved') {
      throw new Error(
        'Permission Denied: Your BOD account is pending Core Team approval.'
      );
    }

    if (userProfile.assignedAvenue !== avenue) {
      throw new Error(
        `Permission Denied: You cannot delete events in "${avenue}". You are only authorized for "${userProfile.assignedAvenue}".`
      );
    }
  }

  const docRef = doc(db, EVENTS_COLLECTION, eventId);

  await deleteDoc(docRef);
}

// -------------------------------------------------------------
// PROJECTS FIRESTORE SERVICES
// -------------------------------------------------------------

export function subscribeToProjects(
  onData: (projects: ProjectItem[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      orderBy('date', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const projects: ProjectItem[] = snapshot.docs.map((d) => {
          const data = d.data();

          return {
            id: d.id,
            title: data.title || '',
            description: data.description || '',
            avenue: data.avenue as AvenueOfService,
            imageUrl: data.imageUrl,
            date: data.date || '',
            impact: data.impact || '',
            details: data.details || '',
            isPinned: Boolean(data.isPinned),
            featured: Boolean(data.featured),
            createdAt: data.createdAt || Date.now(),
            updatedAt: data.updatedAt || Date.now(),
          };
        });

        onData(projects);
      },
      (err) => {
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    if (onError) onError(err);
    return () => { };
  }
}

export async function createProjectFirestore(
  projectData: Omit<ProjectItem, 'id' | 'createdAt' | 'updatedAt'>,
  userProfile: UserProfile
): Promise<string> {
  if (userProfile.role === 'member') {
    throw new Error('Permission Denied: General members cannot create projects.');
  }

  if (
    userProfile.role === 'bod' &&
    userProfile.assignedAvenue !== projectData.avenue
  ) {
    throw new Error(
      `Permission Denied: You can only create projects for ${userProfile.assignedAvenue}`
    );
  }

  const now = Date.now();

  const payload = {
    ...projectData,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), payload);

  return docRef.id;
}

export async function updateProjectFirestore(
  projectId: string,
  projectData: Partial<ProjectItem>,
  currentAvenue: AvenueOfService,
  userProfile: UserProfile
): Promise<void> {
  if (userProfile.role === 'member') {
    throw new Error('Permission Denied: General members cannot edit projects.');
  }

  if (
    userProfile.role === 'bod' &&
    userProfile.assignedAvenue !== currentAvenue
  ) {
    throw new Error(
      `Permission Denied: You can only edit projects for ${userProfile.assignedAvenue}`
    );
  }

  const docRef = doc(db, PROJECTS_COLLECTION, projectId);

  await updateDoc(docRef, {
    ...projectData,
    updatedAt: Date.now(),
  });
}

export async function deleteProjectFirestore(
  projectId: string,
  avenue: AvenueOfService,
  userProfile: UserProfile
): Promise<void> {
  if (userProfile.role === 'member') {
    throw new Error('Permission Denied: General members cannot delete projects.');
  }

  if (
    userProfile.role === 'bod' &&
    userProfile.assignedAvenue !== avenue
  ) {
    throw new Error(
      `Permission Denied: You can only delete projects in ${userProfile.assignedAvenue}`
    );
  }

  await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
}

// -------------------------------------------------------------
// ACHIEVEMENTS FIRESTORE SERVICES
// -------------------------------------------------------------

export function subscribeToAchievements(
  onData: (achievements: AchievementItem[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const q = query(
      collection(db, ACHIEVEMENTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const items: AchievementItem[] = snapshot.docs.map((d) => {
          const data = d.data();

          return {
            id: d.id,
            title: data.title || '',
            category: data.category || '',
            year: data.year || '',
            description: data.description || '',
            recognizedBy: data.recognizedBy || '',
            badge: data.badge,
            createdAt: data.createdAt || Date.now(),
          };
        });

        onData(items);
      },
      (err) => {
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    if (onError) onError(err);
    return () => { };
  }
}

export async function createAchievementFirestore(
  data: Omit<AchievementItem, 'id' | 'createdAt'>,
  userProfile: UserProfile
): Promise<string> {
  if (userProfile.role !== 'core_team') {
    throw new Error(
      'Permission Denied: Only Core Team can add official club achievements.'
    );
  }

  const payload = {
    ...data,
    createdAt: Date.now(),
  };

  const docRef = await addDoc(
    collection(db, ACHIEVEMENTS_COLLECTION),
    payload
  );

  return docRef.id;
}

export async function deleteAchievementFirestore(
  achievementId: string,
  userProfile: UserProfile
): Promise<void> {
  if (userProfile.role !== 'core_team') {
    throw new Error(
      'Permission Denied: Only Core Team can delete official achievements.'
    );
  }

  await deleteDoc(doc(db, ACHIEVEMENTS_COLLECTION, achievementId));
}

// -------------------------------------------------------------
// GALLERY FIRESTORE SERVICES
// -------------------------------------------------------------

export function subscribeToGallery(
  onData: (items: GalleryItem[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const q = query(
      collection(db, GALLERY_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const items: GalleryItem[] = snapshot.docs.map((d) => {
          const data = d.data();

          return {
            id: d.id,
            title: data.title || '',
            type: (data.type || 'photo') as 'photo' | 'video',
            category: (data.category || 'general') as
              | 'events'
              | 'projects'
              | 'general',
            mediaUrl: data.mediaUrl || '',
            thumbnailUrl: data.thumbnailUrl,
            caption: data.caption || '',
            date: data.date || '',
            createdAt: data.createdAt || Date.now(),
          };
        });

        onData(items);
      },
      (err) => {
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    if (onError) onError(err);
    return () => { };
  }
}

export async function createGalleryItemFirestore(
  data: Omit<GalleryItem, 'id' | 'createdAt'>,
  userProfile: UserProfile
): Promise<string> {
  if (userProfile.role !== 'core_team') {
    throw new Error(
      'Permission Denied: Only Core Team can add items to the official gallery.'
    );
  }

  const payload = {
    ...data,
    createdAt: Date.now(),
  };

  const docRef = await addDoc(collection(db, GALLERY_COLLECTION), payload);

  return docRef.id;
}

export async function deleteGalleryItemFirestore(
  galleryId: string,
  userProfile: UserProfile
): Promise<void> {
  if (userProfile.role !== 'core_team') {
    throw new Error(
      'Permission Denied: Only Core Team can delete gallery items.'
    );
  }

  await deleteDoc(doc(db, GALLERY_COLLECTION, galleryId));
}

// -------------------------------------------------------------
// USERS & BOD APPROVAL MANAGEMENT
// -------------------------------------------------------------

export function subscribeToUsers(
  onData: (users: UserProfile[]) => void,
  onError?: (error: Error) => void
) {
  try {
    return onSnapshot(
      collection(db, USERS_COLLECTION),
      (snapshot) => {
        const users: UserProfile[] = snapshot.docs.map((d) => {
          const data = d.data();

          return {
            uid: d.id,
            email: data.email || '',
            displayName: data.displayName || 'Club Member',
            role: data.role || 'member',
            position: data.position,
            assignedAvenue: data.assignedAvenue as
              | AvenueOfService
              | undefined,
            bodStatus: data.bodStatus as BODApprovalStatus | undefined,
            rejectionReason: data.rejectionReason,
            approvedBy: data.approvedBy,
            approvedAt: data.approvedAt,
            phone: data.phone,
            photoURL: data.photoURL,
            createdAt: data.createdAt || Date.now(),
            updatedAt: data.updatedAt || Date.now(),
          };
        });

        onData(users);
      },
      (err) => {
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    if (onError) onError(err);
    return () => { };
  }
}

export async function updateUserRoleAndAvenue(
  targetUid: string,
  newRole: UserRole,
  newAvenue: AvenueOfService | undefined,
  adminProfile?: UserProfile
): Promise<void> {
  if (adminProfile && adminProfile.role !== 'core_team') {
    throw new Error(
      'Permission Denied: Only Core Team can change user roles.'
    );
  }

  const userRef = doc(db, USERS_COLLECTION, targetUid);

  await updateDoc(userRef, {
    role: newRole,
    assignedAvenue: newAvenue || null,
    updatedAt: Date.now(),
  });
}

export async function updateBODApprovalStatus(
  userId: string,
  status: BODApprovalStatus,
  reviewerProfile: UserProfile,
  rejectionReason?: string
): Promise<void> {
  if (reviewerProfile.role !== 'core_team') {
    throw new Error(
      'Permission Denied: Only Core Team can approve or reject BOD applicants.'
    );
  }

  const userRef = doc(db, USERS_COLLECTION, userId);

  await updateDoc(userRef, {
    bodStatus: status,
    approvedBy: reviewerProfile.displayName,
    approvedAt: Date.now(),
    rejectionReason:
      status === 'rejected'
        ? rejectionReason || 'Requirements not met'
        : null,
    updatedAt: Date.now(),
  });
}

// -------------------------------------------------------------
// MEMBERSHIP / INQUIRY APPLICATIONS
// -------------------------------------------------------------

export async function submitMembershipApplication(
  appData: Omit<MembershipApplication, 'id' | 'appliedDate' | 'status'>
): Promise<string> {
  const payload = {
    ...appData,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    createdAt: Date.now(),
  };

  const docRef = await addDoc(
    collection(db, APPLICATIONS_COLLECTION),
    payload
  );

  return docRef.id;
}

export function subscribeToApplications(
  onData: (apps: MembershipApplication[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const q = query(
      collection(db, APPLICATIONS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const apps: MembershipApplication[] = snapshot.docs.map((d) => {
          const data = d.data();

          return {
            id: d.id,
            fullName: data.fullName || '',
            email: data.email || '',
            phone: data.phone || '',
            department: data.department,
            year: data.year,
            interests: data.interests || '',
            reason: data.reason || '',
            appliedDate: data.appliedDate || '',
            status: data.status || 'pending',
          };
        });

        onData(apps);
      },
      (err) => {
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    if (onError) onError(err);
    return () => { };
  }
}

export async function updateApplicationStatus(
  appId: string,
  status: 'pending' | 'reviewed' | 'contacted',
  userProfile: UserProfile
): Promise<void> {
  if (userProfile.role !== 'core_team') {
    throw new Error(
      'Permission Denied: Only Core Team can review applications.'
    );
  }

  const appRef = doc(db, APPLICATIONS_COLLECTION, appId);

  await updateDoc(appRef, {
    status,
    updatedAt: Date.now(),
  });
}

export async function migrateLocalEventsToFirestore(
  localEvents: RotaractEvent[],
  userProfile: UserProfile
): Promise<{ successCount: number; errors: string[] }> {
  let successCount = 0;
  const errors: string[] = [];

  for (const ev of localEvents) {
    try {
      const { id, createdAt, updatedAt, ...payload } = ev;

      await addDoc(collection(db, EVENTS_COLLECTION), {
        ...payload,
        createdBy: userProfile.uid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      successCount++;
    } catch (err: any) {
      errors.push(`${ev.title}: ${err.message}`);
    }
  }

  return { successCount, errors };
}

// -------------------------------------------------------------
// TEAM PROFILES & PROFILE PHOTO MANAGEMENT
// -------------------------------------------------------------

/**
 * Convert and compress profile photo to a web-safe data URL.
 *
 * Firebase Storage is not required.
 * The compressed image is stored directly in Firestore.
 */
export async function uploadProfilePhotoToStorage(
  file: File,
  memberIdOrKey: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          resolve(e.target?.result as string);
        }
      };

      img.onerror = () => {
        resolve(e.target?.result as string);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Real-time subscription to team member profiles & photos
 */
export function subscribeToTeamProfiles(
  onData: (profiles: Record<string, Partial<ClubMember>>) => void,
  onError?: (error: Error) => void
) {
  try {
    return onSnapshot(
      collection(db, TEAM_PROFILES_COLLECTION),
      (snapshot) => {
        const result: Record<string, Partial<ClubMember>> = {};

        snapshot.docs.forEach((d) => {
          result[d.id] = d.data() as Partial<ClubMember>;
        });

        onData(result);
      },
      (err) => {
        console.warn(
          'Team profiles subscription notice:',
          err.message
        );

        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    if (onError) onError(err);
    return () => { };
  }
}

/**
 * Update a team member's public profile and photo in Firestore
 * with role-based permission checks
 */
export async function updateTeamMemberProfile(
  memberKey: string,
  updates: Partial<ClubMember>,
  userProfile: UserProfile
): Promise<void> {
  // Permission checks:
  // CORE TEAM: Can edit/upload/remove photos and profiles for ALL Core Team and BOD members.
  // BOD: Can edit their OWN profile/photo. Cannot edit another BOD member's profile.
  // MEMBER: Can edit only their own member profile/photo. Cannot modify Core Team/BOD public profiles.

  if (userProfile.role !== 'core_team') {
    const isOwnBOD =
      userProfile.role === 'bod' &&
      (userProfile.position === memberKey ||
        userProfile.displayName === memberKey ||
        userProfile.email === memberKey ||
        userProfile.uid === memberKey);

    const isOwnMember =
      userProfile.role === 'member' &&
      (userProfile.uid === memberKey ||
        userProfile.email === memberKey);

    if (!isOwnBOD && !isOwnMember) {
      throw new Error(
        'Permission Denied: You are only authorized to edit your own profile and photo.'
      );
    }
  }

  const cleanDocId = memberKey.replace(/[\/\\]/g, '_');
  const docRef = doc(db, TEAM_PROFILES_COLLECTION, cleanDocId);

  await setDoc(
    docRef,
    {
      ...updates,
      updatedAt: Date.now(),
      updatedBy: userProfile.displayName,
    },
    { merge: true }
  );
}

/**
 * Remove photo from team member profile
 */
export async function removeTeamMemberPhoto(
  memberKey: string,
  userProfile: UserProfile
): Promise<void> {
  if (userProfile.role !== 'core_team') {
    const isOwnBOD =
      userProfile.role === 'bod' &&
      (userProfile.position === memberKey ||
        userProfile.displayName === memberKey ||
        userProfile.email === memberKey ||
        userProfile.uid === memberKey);

    const isOwnMember =
      userProfile.role === 'member' &&
      (userProfile.uid === memberKey ||
        userProfile.email === memberKey);

    if (!isOwnBOD && !isOwnMember) {
      throw new Error(
        'Permission Denied: You can only remove your own photo.'
      );
    }
  }

  const cleanDocId = memberKey.replace(/[\/\\]/g, '_');
  const docRef = doc(db, TEAM_PROFILES_COLLECTION, cleanDocId);

  await updateDoc(docRef, {
    photoUrl: null,
    updatedAt: Date.now(),
  });
}