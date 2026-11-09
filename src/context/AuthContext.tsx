import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  AvenueOfService,
  UserProfile,
  UserRole,
  BODApprovalStatus,
  CoreTeamPosition,
  BODPosition,
} from '../types/rotaract';
import { BOD_POSITIONS, OFFICIAL_CORE_TEAM, OFFICIAL_BOD } from '../utils/rotaractData';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isCoreTeam: boolean;
  isBOD: boolean;
  isApprovedBOD: boolean;
  isMember: boolean;
  assignedAvenue?: AvenueOfService;
  canManageAvenue: (avenue: AvenueOfService) => boolean;
  canManageWebsite: () => boolean;
  signInWithGoogle: () => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  signUpMember: (email: string, pass: string, displayName: string, phone?: string) => Promise<void>;
  signUpBOD: (
    email: string,
    pass: string,
    displayName: string,
    position: BODPosition,
    phone?: string
  ) => Promise<void>;
  signUpCoreTeam: (
    email: string,
    pass: string,
    displayName: string,
    position: CoreTeamPosition
  ) => Promise<void>;
  signOut: () => Promise<void>;
  quickLoginDemo: (role: 'core' | 'bod_approved' | 'bod_pending' | 'member', positionKey?: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  simulatedRole: UserRole | null;
  simulatedAvenue: AvenueOfService | null;
  setSimulatedRole: (role: UserRole | null, avenue?: AvenueOfService | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulatedRole, setSimulatedRoleState] = useState<UserRole | null>(null);
  const [simulatedAvenue, setSimulatedAvenueState] = useState<AvenueOfService | null>(null);

  const setSimulatedRole = (role: UserRole | null, avenue?: AvenueOfService | null) => {
    setSimulatedRoleState(role);
    setSimulatedAvenueState(avenue || null);
  };

  // Helper to map BOD position to its Avenue
  const getAvenueForBODPosition = (position: BODPosition): AvenueOfService => {
    const found = BOD_POSITIONS.find((b) => b.title === position);
    return found ? found.avenue : 'Club Service';
  };

  // Check how many active accounts currently exist for a position
  const checkPositionOccupancy = async (
    position: string,
    maxAllowed: number
  ): Promise<boolean> => {
    try {
      const q = query(
        collection(db, 'users'),
        where('position', '==', position),
        where('bodStatus', 'in', ['approved', 'pending'])
      );
      const snap = await getDocs(q);
      return snap.size < maxAllowed;
    } catch {
      return true; // allow if offline or security rules restrict query
    }
  };

  // Load or initialize user profile in Firestore
  const fetchOrInitProfile = async (user: User): Promise<UserProfile | null> => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email || data.email || '',
          displayName: user.displayName || data.displayName || 'Club Member',
          role: (data.role as UserRole) || 'member',
          position: data.position,
          assignedAvenue: data.assignedAvenue as AvenueOfService | undefined,
          bodStatus: data.bodStatus as BODApprovalStatus | undefined,
          rejectionReason: data.rejectionReason,
          approvedBy: data.approvedBy,
          approvedAt: data.approvedAt,
          phone: data.phone,
          photoURL: user.photoURL || data.photoURL,
          createdAt: data.createdAt || Date.now(),
          updatedAt: data.updatedAt || Date.now(),
        };
        setUserProfile(profile);
        return profile;
      }

      // Check if designated Core email
      const emailLower = (user.email || '').toLowerCase();
      const matchedCore = OFFICIAL_CORE_TEAM.find(
        (c) => c.email.toLowerCase() === emailLower
      );
      const matchedBOD = OFFICIAL_BOD.find(
        (b) => b.email.toLowerCase() === emailLower
      );

      let initialRole: UserRole = 'member';
      let position: string | undefined = undefined;
      let assignedAvenue: AvenueOfService | undefined = undefined;
      let bodStatus: BODApprovalStatus | undefined = undefined;

      if (matchedCore || emailLower === 'shivamlabhshetwar0@gmail.com') {
        initialRole = 'core_team';
        position = matchedCore ? matchedCore.position : 'Club Vice President';
        assignedAvenue = 'Club Service';
      } else if (matchedBOD) {
        initialRole = 'bod';
        position = matchedBOD.position;
        assignedAvenue = matchedBOD.avenue;
        bodStatus = 'approved';
      } else {
        // Default is member (DO NOT automatically assign first registered user as Core Team)
        initialRole = 'member';
      }

      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Club Member',
        role: initialRole,
        position,
        assignedAvenue,
        bodStatus,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await setDoc(userRef, newProfile);
      setUserProfile(newProfile);
      return newProfile;
    } catch (err) {
      console.warn('Notice loading user profile from Firestore:', err);
      // Fallback in-memory profile
      const fallback: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Club Member',
        role: 'member',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setUserProfile(fallback);
      return fallback;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchOrInitProfile(user);
      } else {
        setUserProfile(null);
        setSimulatedRoleState(null);
        setSimulatedAvenueState(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    await fetchOrInitProfile(cred.user);
  };

  const signIn = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      await fetchOrInitProfile(cred.user);
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        throw new Error(
          'Email/Password sign-in is disabled in your Firebase console. Please click "Sign In with Google", which is pre-configured and active.'
        );
      }
      throw err;
    }
  };

  // General Member registration (Default role: member)
  const signUpMember = async (
    email: string,
    pass: string,
    displayName: string,
    phone?: string
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const userRef = doc(db, 'users', cred.user.uid);
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      displayName,
      role: 'member',
      phone,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await setDoc(userRef, newProfile);
    setUserProfile(newProfile);
  };

  // BOD registration (Requires Core Team approval -> bodStatus: pending)
  const signUpBOD = async (
    email: string,
    pass: string,
    displayName: string,
    position: BODPosition,
    phone?: string
  ) => {
    // Check occupancy
    const maxActive = position === 'Editor' ? 2 : 1;
    const canRegister = await checkPositionOccupancy(position, maxActive);
    if (!canRegister) {
      throw new Error(
        `Registration limit reached: All ${maxActive} active account(s) for "${position}" are already occupied.`
      );
    }

    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const avenue = getAvenueForBODPosition(position);
    const userRef = doc(db, 'users', cred.user.uid);
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      displayName,
      role: 'bod',
      position,
      assignedAvenue: avenue,
      bodStatus: 'pending', // PENDING Core Team approval
      phone,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await setDoc(userRef, newProfile);
    setUserProfile(newProfile);
  };

  // Core Team Registration (Only 1 active account per position)
  const signUpCoreTeam = async (
    email: string,
    pass: string,
    displayName: string,
    position: CoreTeamPosition
  ) => {
    const canRegister = await checkPositionOccupancy(position, 1);
    if (!canRegister) {
      throw new Error(
        `Position already occupied: The position "${position}" already has an active Core Team account.`
      );
    }

    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const userRef = doc(db, 'users', cred.user.uid);
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      displayName,
      role: 'core_team',
      position,
      assignedAvenue: 'Club Service',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await setDoc(userRef, newProfile);
    setUserProfile(newProfile);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    setSimulatedRoleState(null);
    setSimulatedAvenueState(null);
  };

  const refreshProfile = async () => {
    if (currentUser) {
      await fetchOrInitProfile(currentUser);
    }
  };

  // Quick demo login helper
  const quickLoginDemo = async (
    roleType: 'core' | 'bod_approved' | 'bod_pending' | 'member',
    positionKey?: string
  ) => {
    // In-memory instant demo simulation or Firestore user
    if (roleType === 'core') {
      const pos = (positionKey as CoreTeamPosition) || 'Club President';
      const mockProfile: UserProfile = {
        uid: 'demo-core-' + Date.now(),
        email: 'president@rscoe.rotaract3131.org',
        displayName: 'Rtr. Shrishail Chavan',
        role: 'core_team',
        position: pos,
        assignedAvenue: 'Club Service',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setUserProfile(mockProfile);
      setSimulatedRoleState('core_team');
    } else if (roleType === 'bod_approved') {
      const pos = (positionKey as BODPosition) || 'Community Service Director';
      const avenue = getAvenueForBODPosition(pos);
      const mockProfile: UserProfile = {
        uid: 'demo-bod-' + Date.now(),
        email: 'community@rscoe.rotaract3131.org',
        displayName: 'Rtr. Atharva Gawte',
        role: 'bod',
        position: pos,
        assignedAvenue: avenue,
        bodStatus: 'approved',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setUserProfile(mockProfile);
      setSimulatedRole('bod', avenue);
    } else if (roleType === 'bod_pending') {
      const pos = (positionKey as BODPosition) || 'Joint Club Service Director';
      const avenue = getAvenueForBODPosition(pos);
      const mockProfile: UserProfile = {
        uid: 'demo-bod-pending-' + Date.now(),
        email: 'applicant.bod@rscoe.rotaract3131.org',
        displayName: 'Rtr. Harsh Kantayan (Pending)',
        role: 'bod',
        position: pos,
        assignedAvenue: avenue,
        bodStatus: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setUserProfile(mockProfile);
      setSimulatedRole('bod', avenue);
    } else {
      const mockProfile: UserProfile = {
        uid: 'demo-member-' + Date.now(),
        email: 'member@rscoe.rotaract3131.org',
        displayName: 'Rtr. General Member',
        role: 'member',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setUserProfile(mockProfile);
      setSimulatedRoleState('member');
    }
  };

  const activeRole = simulatedRole || userProfile?.role || 'member';
  const isCoreTeam = activeRole === 'core_team';
  const isBOD = activeRole === 'bod';
  const isApprovedBOD = isBOD && (userProfile?.bodStatus === 'approved' || simulatedRole === 'bod');
  const isMember = activeRole === 'member';

  const assignedAvenue =
    simulatedRole === 'bod'
      ? (simulatedAvenue || userProfile?.assignedAvenue || 'Community Service')
      : userProfile?.assignedAvenue;

  // Check avenue permissions
  const canManageAvenue = (avenue: AvenueOfService): boolean => {
    if (isCoreTeam) return true;
    if (isApprovedBOD && assignedAvenue === avenue) return true;
    return false;
  };

  // Check website management permission (Only Core Team)
  const canManageWebsite = (): boolean => {
    return isCoreTeam;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isCoreTeam,
        isBOD,
        isApprovedBOD,
        isMember,
        assignedAvenue,
        canManageAvenue,
        canManageWebsite,
        signInWithGoogle,
        signIn,
        signUpMember,
        signUpBOD,
        signUpCoreTeam,
        signOut,
        quickLoginDemo,
        refreshProfile,
        simulatedRole,
        simulatedAvenue,
        setSimulatedRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
