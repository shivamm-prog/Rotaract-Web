/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveNavTab,
  ClubMember,
  EventStatus,
  RotaractEvent,
  ProjectItem,
  AchievementItem,
  GalleryItem,
  UserProfile,
  BODApprovalStatus,
  AvenueOfService,
} from './types/rotaract';

import {
  loadStoredEvents,
  saveStoredEvents,
  loadStoredMembers,
  saveStoredMembers,
  loadStoredProjects,
  saveStoredProjects,
  loadStoredAchievements,
  saveStoredAchievements,
  loadStoredGallery,
  saveStoredGallery,
  getSampleDemoEvents,
} from './utils/rotaractData';

import { getTodayString } from './utils/dateHelpers';
import { useAuth } from './context/AuthContext';

import {
  subscribeToEvents,
  createEventFirestore,
  updateEventFirestore,
  deleteEventFirestore,
  subscribeToProjects,
  createProjectFirestore,
  updateProjectFirestore,
  deleteProjectFirestore,
  subscribeToAchievements,
  createAchievementFirestore,
  deleteAchievementFirestore,
  subscribeToGallery,
  createGalleryItemFirestore,
  deleteGalleryItemFirestore,
  subscribeToUsers,
  updateBODApprovalStatus,
} from './services/eventService';

// Public Components
import { SplashScreen } from './components/SplashScreen';
import { PublicHeader } from './components/public/PublicHeader';
import { PublicFooter } from './components/public/PublicFooter';
import { HomeView } from './components/public/HomeView';
import { AboutView } from './components/public/AboutView';
import { TeamView } from './components/public/TeamView';
import { PublicEventsView } from './components/public/PublicEventsView';
import { ProjectsView } from './components/public/ProjectsView';
import { AchievementsView } from './components/public/AchievementsView';
import { GalleryView } from './components/public/GalleryView';
import { JoinUsView } from './components/public/JoinUsView';
import { ContactView } from './components/public/ContactView';
import { LoginView } from './components/LoginView';

// Management Portal Components
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { EventsView } from './components/EventsView';
import { CreateEventView } from './components/CreateEventView';
import { CalendarView } from './components/CalendarView';
import { MembersView } from './components/MembersView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { BODApprovalsView } from './components/BODApprovalsView';

// Modals
import { EventDetailsModal } from './components/EventDetailsModal';
import { EventFormModal } from './components/EventFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ProjectModal } from './components/modals/ProjectModal';
import { AchievementModal } from './components/modals/AchievementModal';
import { GalleryModal } from './components/modals/GalleryModal';

import { Award, AlertTriangle } from 'lucide-react';

export default function App() {
  const {
    currentUser,
    userProfile,
    loading,
    isCoreTeam,
    isBOD,
    isApprovedBOD,
    canManageAvenue,
  } = useAuth();

  // -------------------------------------------------------------
  // 1. Navigation & Routing State
  // -------------------------------------------------------------

  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname;
    return p && p !== '' ? p : '/';
  });

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // -------------------------------------------------------------
  // 2. Splash Screen State
  // -------------------------------------------------------------

  const [showSplash, setShowSplash] = useState<boolean>(() => {
    return !sessionStorage.getItem('rscoe_splash_seen_v1');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('rscoe_splash_seen_v1', 'true');
    setShowSplash(false);
  };

  // -------------------------------------------------------------
  // 3. Dashboard Internal State
  // -------------------------------------------------------------

  const [activeTab, setActiveTab] =
    useState<ActiveNavTab>('dashboard');

  const [isOpenMobileSidebar, setIsOpenMobileSidebar] =
    useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedDateStr, setSelectedDateStr] =
    useState<string>(getTodayString());

  // -------------------------------------------------------------
  // 4. Data States
  // -------------------------------------------------------------

  const [events, setEvents] = useState<RotaractEvent[]>(
    () => loadStoredEvents()
  );

  const [projects, setProjects] = useState<ProjectItem[]>(
    () => loadStoredProjects()
  );

  const [achievements, setAchievements] =
    useState<AchievementItem[]>(
      () => loadStoredAchievements()
    );

  const [galleryItems, setGalleryItems] =
    useState<GalleryItem[]>(
      () => loadStoredGallery()
    );

  const [members, setMembers] = useState<ClubMember[]>(
    () => loadStoredMembers()
  );

  const [registeredUsers, setRegisteredUsers] =
    useState<UserProfile[]>([]);

  const [cloudError, setCloudError] =
    useState<string | null>(null);

  // -------------------------------------------------------------
  // 5. Modal State
  // -------------------------------------------------------------

  const [detailsEvent, setDetailsEvent] =
    useState<RotaractEvent | null>(null);

  const [editingEvent, setEditingEvent] =
    useState<RotaractEvent | null>(null);

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    id: string;
    title: string;
  }>({
    isOpen: false,
    id: '',
    title: '',
  });

  const [isProjectModalOpen, setIsProjectModalOpen] =
    useState(false);

  const [editingProject, setEditingProject] =
    useState<ProjectItem | null>(null);

  const [isAchievementModalOpen, setIsAchievementModalOpen] =
    useState(false);

  const [isGalleryModalOpen, setIsGalleryModalOpen] =
    useState(false);

  // -------------------------------------------------------------
  // Real-Time Firestore Subscriptions
  // -------------------------------------------------------------

  useEffect(() => {
    // -----------------------------------------------------------
    // 1. Events
    // -----------------------------------------------------------

    const unsubEvents = subscribeToEvents(
      (cloudEvents) => {
        /*
         * IMPORTANT:
         * Firestore is the source of truth.
         *
         * Previously this code only updated the UI when
         * cloudEvents.length > 0.
         *
         * That caused old local/demo events such as "evt-1"
         * to remain visible when the Firestore collection was
         * actually empty.
         *
         * Now an empty Firestore collection correctly clears
         * stale local/demo events.
         */
        setEvents(cloudEvents || []);
        saveStoredEvents(cloudEvents || []);
      },
      (err) => {
        console.warn(
          'Events sync notice:',
          err.message
        );
      }
    );

    // -----------------------------------------------------------
    // 2. Projects
    // -----------------------------------------------------------

    const unsubProjects = subscribeToProjects(
      (cloudProjects) => {
        /*
         * Firestore is the source of truth.
         * Do not keep stale local demo projects when
         * Firestore returns an empty collection.
         */
        setProjects(cloudProjects || []);
        saveStoredProjects(cloudProjects || []);
      },
      (err) => {
        console.warn(
          'Projects sync notice:',
          err.message
        );
      }
    );

    // -----------------------------------------------------------
    // 3. Achievements
    // -----------------------------------------------------------

    const unsubAchievements = subscribeToAchievements(
      (cloudAchievements) => {
        setAchievements(cloudAchievements || []);
        saveStoredAchievements(cloudAchievements || []);
      },
      (err) => {
        console.warn(
          'Achievements sync notice:',
          err.message
        );
      }
    );

    // -----------------------------------------------------------
    // 4. Gallery
    // -----------------------------------------------------------

    const unsubGallery = subscribeToGallery(
      (cloudGallery) => {
        setGalleryItems(cloudGallery || []);
        saveStoredGallery(cloudGallery || []);
      },
      (err) => {
        console.warn(
          'Gallery sync notice:',
          err.message
        );
      }
    );

    // -----------------------------------------------------------
    // 5. Users
    // -----------------------------------------------------------

    let unsubUsers = () => { };

    if (currentUser) {
      unsubUsers = subscribeToUsers((users) => {
        setRegisteredUsers(users);
      });
    }

    return () => {
      unsubEvents();
      unsubProjects();
      unsubAchievements();
      unsubGallery();
      unsubUsers();
    };
  }, [currentUser]);

  // -------------------------------------------------------------
  // Keep Members Saved Locally
  // -------------------------------------------------------------

  useEffect(() => {
    saveStoredMembers(members);
  }, [members]);

  // -------------------------------------------------------------
  // Event Handlers
  // -------------------------------------------------------------

  const handleSaveEvent = async (
    eventData: Omit<
      RotaractEvent,
      'id' | 'createdAt' | 'updatedAt'
    >,
    existingId?: string
  ) => {
    if (!userProfile) {
      alert(
        'Please log in with appropriate permissions to save events.'
      );
      return;
    }

    try {
      /*
       * IMPORTANT:
       *
       * Demo/local events can have IDs like:
       *   evt-1
       *   evt-2
       *   demo-1
       *
       * These IDs do NOT necessarily exist in Firestore.
       *
       * Therefore, if an old demo event is being edited,
       * we create a real Firestore document instead of
       * calling updateDoc() on a non-existent document.
       */

      const isLocalDemoEvent =
        !!existingId &&
        (
          existingId.startsWith('evt-') ||
          existingId.startsWith('demo-')
        );

      // ---------------------------------------------------------
      // UPDATE REAL FIRESTORE EVENT
      // ---------------------------------------------------------

      if (existingId && !isLocalDemoEvent) {
        const existing = events.find(
          (ev) => ev.id === existingId
        );

        const currentAvenue = existing
          ? existing.avenue
          : eventData.avenue;

        await updateEventFirestore(
          existingId,
          eventData,
          currentAvenue,
          userProfile
        );

        setEvents((prev) =>
          prev.map((e) =>
            e.id === existingId
              ? {
                ...e,
                ...eventData,
                updatedAt: Date.now(),
              }
              : e
          )
        );
      }

      // ---------------------------------------------------------
      // CREATE NEW FIRESTORE EVENT
      // ---------------------------------------------------------

      else {
        const newId = await createEventFirestore(
          eventData,
          userProfile
        );

        const newEv: RotaractEvent = {
          ...eventData,
          id: newId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        /*
         * If this was an old local/demo event being edited,
         * remove that stale local event and replace it with
         * the newly-created Firestore event.
         */
        setEvents((prev) => [
          newEv,
          ...prev.filter(
            (e) => e.id !== existingId
          ),
        ]);
      }
    } catch (err: any) {
      console.error('Save failed:', err);

      alert(
        `Error saving event: ${err.message}`
      );
    }
  };

  // -------------------------------------------------------------
  // Delete Event
  // -------------------------------------------------------------

  const handleDeleteEvent = (
    id: string,
    title: string
  ) => {
    setDeleteDialog({
      isOpen: true,
      id,
      title,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id || !userProfile) {
      return;
    }

    const target = events.find(
      (ev) => ev.id === deleteDialog.id
    );

    if (!target) {
      return;
    }

    try {
      await deleteEventFirestore(
        target.id,
        target.avenue,
        userProfile
      );

      setEvents((prev) =>
        prev.filter(
          (e) => e.id !== target.id
        )
      );

      if (
        detailsEvent?.id === target.id
      ) {
        setDetailsEvent(null);
      }

      if (
        editingEvent?.id === target.id
      ) {
        setEditingEvent(null);
      }
    } catch (err: any) {
      console.error(
        'Delete failed:',
        err
      );

      alert(
        `Delete Error: ${err.message}`
      );
    } finally {
      setDeleteDialog({
        isOpen: false,
        id: '',
        title: '',
      });
    }
  };

  // -------------------------------------------------------------
  // Event Status Change
  // -------------------------------------------------------------

  const handleStatusChange = async (
    id: string,
    newStatus: EventStatus
  ) => {
    if (!userProfile) {
      return;
    }

    const target = events.find(
      (ev) => ev.id === id
    );

    if (!target) {
      return;
    }

    try {
      await updateEventFirestore(
        id,
        {
          status: newStatus,
        },
        target.avenue,
        userProfile
      );

      setEvents((prev) =>
        prev.map((e) =>
          e.id === id
            ? {
              ...e,
              status: newStatus,
              updatedAt: Date.now(),
            }
            : e
        )
      );

      if (
        detailsEvent &&
        detailsEvent.id === id
      ) {
        setDetailsEvent((prev) =>
          prev
            ? {
              ...prev,
              status: newStatus,
            }
            : null
        );
      }
    } catch (err: any) {
      console.error(
        'Status change failed:',
        err
      );

      alert(
        `Status Update Error: ${err.message}`
      );
    }
  };

  // -------------------------------------------------------------
  // Project Handlers
  // -------------------------------------------------------------

  const handleSaveProject = async (
    projectData: Omit<
      ProjectItem,
      'id' | 'createdAt' | 'updatedAt'
    >,
    existingId?: string
  ) => {
    if (!userProfile) {
      alert(
        'Please log in with appropriate permissions to save projects.'
      );
      return;
    }

    try {
      if (existingId) {
        await updateProjectFirestore(
          existingId,
          projectData,
          projectData.avenue,
          userProfile
        );

        setProjects((prev) =>
          prev.map((p) =>
            p.id === existingId
              ? {
                ...p,
                ...projectData,
                updatedAt: Date.now(),
              }
              : p
          )
        );
      } else {
        const newId =
          await createProjectFirestore(
            projectData,
            userProfile
          );

        const newProj: ProjectItem = {
          ...projectData,
          id: newId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        setProjects((prev) => [
          newProj,
          ...prev,
        ]);
      }
    } catch (err: any) {
      alert(
        `Project save error: ${err.message}`
      );
    }
  };

  const handleDeleteProject = async (
    id: string,
    title: string,
    avenue: AvenueOfService
  ) => {
    if (!userProfile) {
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete project "${title}"?`
      )
    ) {
      return;
    }

    try {
      await deleteProjectFirestore(
        id,
        avenue,
        userProfile
      );

      setProjects((prev) =>
        prev.filter(
          (p) => p.id !== id
        )
      );
    } catch (err: any) {
      alert(
        `Delete error: ${err.message}`
      );
    }
  };

  // -------------------------------------------------------------
  // Achievement Handlers
  // -------------------------------------------------------------

  const handleSaveAchievement = async (
    data: Omit<
      AchievementItem,
      'id' | 'createdAt'
    >
  ) => {
    if (!userProfile || !isCoreTeam) {
      alert(
        'Only Core Team members can add official achievements.'
      );
      return;
    }

    try {
      const newId =
        await createAchievementFirestore(
          data,
          userProfile
        );

      setAchievements((prev) => [
        {
          ...data,
          id: newId,
          createdAt: Date.now(),
        },
        ...prev,
      ]);
    } catch (err: any) {
      alert(
        `Achievement save error: ${err.message}`
      );
    }
  };

  const handleDeleteAchievement = async (
    id: string
  ) => {
    if (!userProfile || !isCoreTeam) {
      return;
    }

    if (
      !window.confirm(
        'Are you sure you want to delete this achievement record?'
      )
    ) {
      return;
    }

    try {
      await deleteAchievementFirestore(
        id,
        userProfile
      );

      setAchievements((prev) =>
        prev.filter(
          (a) => a.id !== id
        )
      );
    } catch (err: any) {
      alert(
        `Delete error: ${err.message}`
      );
    }
  };

  // -------------------------------------------------------------
  // Gallery Handlers
  // -------------------------------------------------------------

  const handleSaveGalleryItem = async (
    data: Omit<
      GalleryItem,
      'id' | 'createdAt'
    >
  ) => {
    if (!userProfile || !isCoreTeam) {
      alert(
        'Only Core Team members can upload gallery items.'
      );
      return;
    }

    try {
      const newId =
        await createGalleryItemFirestore(
          data,
          userProfile
        );

      setGalleryItems((prev) => [
        {
          ...data,
          id: newId,
          createdAt: Date.now(),
        },
        ...prev,
      ]);
    } catch (err: any) {
      alert(
        `Gallery upload error: ${err.message}`
      );
    }
  };

  const handleDeleteGalleryItem = async (
    id: string
  ) => {
    if (!userProfile || !isCoreTeam) {
      return;
    }

    if (
      !window.confirm(
        'Are you sure you want to delete this media item?'
      )
    ) {
      return;
    }

    try {
      await deleteGalleryItemFirestore(
        id,
        userProfile
      );

      setGalleryItems((prev) =>
        prev.filter(
          (g) => g.id !== id
        )
      );
    } catch (err: any) {
      alert(
        `Delete error: ${err.message}`
      );
    }
  };

  // -------------------------------------------------------------
  // BOD Approval Handlers
  // -------------------------------------------------------------

  const handleUpdateBODStatus = async (
    userId: string,
    status: BODApprovalStatus,
    reason?: string
  ) => {
    if (
      !userProfile ||
      !isCoreTeam
    ) {
      return;
    }

    await updateBODApprovalStatus(
      userId,
      status,
      userProfile,
      reason
    );

    setRegisteredUsers((prev) =>
      prev.map((u) =>
        u.uid === userId
          ? {
            ...u,
            bodStatus: status,
            approvedBy:
              userProfile.displayName,
            approvedAt: Date.now(),
            rejectionReason:
              reason,
          }
          : u
      )
    );
  };

  // -------------------------------------------------------------
  // Member Handlers
  // -------------------------------------------------------------

  const handleAddMember = (
    memberData: Omit<
      ClubMember,
      'id' | 'avatarInitials' | 'joinedDate'
    >
  ) => {
    const initials =
      memberData.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const newMember: ClubMember = {
      ...memberData,
      id: 'mem-' + Date.now(),
      avatarInitials:
        initials || 'RT',
      joinedDate:
        getTodayString(),
    };

    setMembers((prev) => [
      newMember,
      ...prev,
    ]);
  };

  const handleDeleteMember = (
    id: string
  ) => {
    setMembers((prev) =>
      prev.filter(
        (m) => m.id !== id
      )
    );
  };

  // -------------------------------------------------------------
  // Dashboard Search
  // -------------------------------------------------------------

  const handleSearchChange = (
    q: string
  ) => {
    setSearchQuery(q);

    if (
      q.trim() &&
      activeTab !== 'events' &&
      activeTab !== 'members'
    ) {
      setActiveTab('events');
    }
  };

  // -------------------------------------------------------------
  // Sidebar Counts
  // -------------------------------------------------------------

  const liveCount =
    events.filter(
      (e) =>
        e.date === getTodayString() ||
        e.status === 'live'
    ).length;

  const upcomingCount =
    events.filter(
      (e) =>
        e.date >
        getTodayString()
    ).length;

  const pendingApprovalsCount =
    registeredUsers.filter(
      (u) =>
        u.role === 'bod' &&
        (u.bodStatus || 'pending') ===
        'pending'
    ).length;

  // -------------------------------------------------------------
  // Initial Loading Gate
  // -------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#800000] text-white">
        <div className="flex flex-col items-center gap-4 text-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#800000] shadow-2xl animate-pulse">
            <Award className="h-9 w-9 stroke-[2.5]" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Rotaract Club of RSCOE
            </h2>

            <p className="text-xs text-red-200 mt-1 font-medium">
              Connecting to Cloud Firestore & Authenticating Portal...
            </p>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Splash Screen
  // -------------------------------------------------------------

  if (showSplash) {
    return (
      <SplashScreen
        onComplete={
          handleSplashComplete
        }
      />
    );
  }

  // -------------------------------------------------------------
  // Routing
  // -------------------------------------------------------------

  const isDashboardRoute =
    currentPath === '/dashboard';

  const isLoginRoute =
    currentPath === '/login';

  // -------------------------------------------------------------
  // LOGIN ROUTE
  // -------------------------------------------------------------

  if (isLoginRoute) {
    return (
      <LoginView
        onBackToWebsite={() => {
          navigate(
            currentUser
              ? '/dashboard'
              : '/'
          );
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // DASHBOARD ROUTE
  // -------------------------------------------------------------

  if (isDashboardRoute) {

    // If not signed in, show login
    if (!currentUser) {
      return (
        <LoginView
          onBackToWebsite={() =>
            navigate('/')
          }
        />
      );
    }

    return (
      <div className="flex h-screen w-full overflow-hidden bg-[#780000] font-sans antialiased selection:bg-white selection:text-[#780000]">

        {/* Sidebar */}

        <Sidebar
          activeTab={activeTab}

          onSelectTab={(tab) => {
            setActiveTab(tab);
            setSearchQuery('');
          }}

          isOpenMobile={
            isOpenMobileSidebar
          }

          onCloseMobile={() =>
            setIsOpenMobileSidebar(false)
          }

          upcomingCount={
            upcomingCount
          }

          liveCount={liveCount}

          pendingApprovalsCount={
            pendingApprovalsCount
          }

          onReturnToWebsite={() =>
            navigate('/')
          }
        />

        {/* Main Content */}

        <div className="flex flex-1 flex-col overflow-hidden">

          <TopHeader
            activeTab={activeTab}

            onOpenMobileMenu={() =>
              setIsOpenMobileSidebar(true)
            }

            onOpenCreateEvent={() =>
              setActiveTab(
                'create_event'
              )
            }

            searchQuery={
              searchQuery
            }

            onSearchChange={
              handleSearchChange
            }

            onReturnToWebsite={() =>
              navigate('/')
            }
          />

          {/* Cloud Error */}

          {cloudError && (
            <div className="bg-[#520000] px-4 py-2 text-xs text-red-200 border-b border-red-400/30 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <AlertTriangle className="h-4 w-4 text-red-300 shrink-0" />

                <span>
                  {cloudError}
                </span>

              </div>

              <button
                type="button"
                onClick={() =>
                  setCloudError(null)
                }
                className="text-white hover:underline text-[11px]"
              >
                Dismiss
              </button>

            </div>
          )}

          {/* Main Dashboard */}

          <main className="flex-1 overflow-y-auto bg-[#780000] p-4 sm:p-6 lg:p-8">

            <div className="mx-auto max-w-7xl">

              {/* Dashboard */}

              {activeTab === 'dashboard' && (
                <DashboardView
                  events={events}

                  onNavigateToTab={(tab) =>
                    setActiveTab(tab)
                  }

                  onOpenEventDetails={(ev) =>
                    setDetailsEvent(ev)
                  }

                  onSelectEventDateInCalendar={(dStr) => {
                    setSelectedDateStr(
                      dStr
                    );

                    setActiveTab(
                      'calendar'
                    );
                  }}
                />
              )}

              {/* Events */}

              {activeTab === 'events' && (
                <EventsView
                  events={events}

                  onOpenEventDetails={(ev) =>
                    setDetailsEvent(ev)
                  }

                  onEditEvent={(ev) =>
                    setEditingEvent(ev)
                  }

                  onDeleteEvent={
                    handleDeleteEvent
                  }

                  onStatusChange={
                    handleStatusChange
                  }

                  onOpenCreateEvent={() =>
                    setActiveTab(
                      'create_event'
                    )
                  }
                />
              )}

              {/* Create Event */}

              {activeTab === 'create_event' && (
                <CreateEventView
                  onSaveEvent={(evData) =>
                    handleSaveEvent(
                      evData
                    )
                  }

                  onNavigateToEvents={() =>
                    setActiveTab(
                      'events'
                    )
                  }
                />
              )}

              {/* Calendar */}

              {activeTab === 'calendar' && (
                <CalendarView
                  events={events}

                  selectedDateStr={
                    selectedDateStr
                  }

                  onSelectDate={(dStr) =>
                    setSelectedDateStr(
                      dStr
                    )
                  }

                  onOpenEventDetails={(ev) =>
                    setDetailsEvent(ev)
                  }

                  onOpenCreateEventOnDate={(dStr) => {
                    setSelectedDateStr(
                      dStr
                    );

                    setActiveTab(
                      'create_event'
                    );
                  }}
                />
              )}

              {/* Projects */}

              {activeTab === 'projects' && (
                <ProjectsView
                  projects={projects}

                  onOpenCreateProject={() => {
                    setEditingProject(
                      null
                    );

                    setIsProjectModalOpen(
                      true
                    );
                  }}

                  onEditProject={(p) => {
                    setEditingProject(
                      p
                    );

                    setIsProjectModalOpen(
                      true
                    );
                  }}

                  onDeleteProject={
                    handleDeleteProject
                  }
                />
              )}

              {/* Achievements */}

              {activeTab === 'achievements' && (
                <AchievementsView
                  achievements={
                    achievements
                  }

                  onOpenCreateAchievement={() =>
                    setIsAchievementModalOpen(
                      true
                    )
                  }

                  onDeleteAchievement={
                    handleDeleteAchievement
                  }
                />
              )}

              {/* Gallery */}

              {activeTab === 'gallery' && (
                <GalleryView
                  galleryItems={
                    galleryItems
                  }

                  onOpenCreateItem={() =>
                    setIsGalleryModalOpen(
                      true
                    )
                  }

                  onDeleteItem={
                    handleDeleteGalleryItem
                  }
                />
              )}

              {/* BOD Approvals */}

              {activeTab === 'approvals' && (
                <BODApprovalsView
                  users={
                    registeredUsers
                  }

                  onUpdateStatus={
                    handleUpdateBODStatus
                  }
                />
              )}

              {/* Members */}

              {activeTab === 'members' && (
                <MembersView
                  members={members}

                  onAddMember={
                    handleAddMember
                  }

                  onDeleteMember={
                    handleDeleteMember
                  }
                />
              )}

              {/* Reports */}

              {activeTab === 'reports' && (
                <ReportsView
                  events={events}
                />
              )}

              {/* Settings */}

              {activeTab === 'settings' && (
                <SettingsView
                  events={events}
                  members={members}

                  onImportData={(
                    newEvents,
                    newMembers
                  ) => {
                    setEvents(
                      newEvents
                    );

                    if (
                      newMembers
                    ) {
                      setMembers(
                        newMembers
                      );
                    }
                  }}

                  onClearAllEvents={() =>
                    setEvents([])
                  }

                  onLoadDemoEvents={() =>
                    setEvents(
                      getSampleDemoEvents()
                    )
                  }
                />
              )}

            </div>

          </main>

        </div>

        {/* -------------------------------------------------------
            Dashboard Modals
        ------------------------------------------------------- */}

        <EventDetailsModal
          isOpen={
            !!detailsEvent
          }

          event={
            detailsEvent
          }

          onClose={() =>
            setDetailsEvent(null)
          }

          onEdit={(ev) => {
            setDetailsEvent(
              null
            );

            setEditingEvent(
              ev
            );
          }}

          onDelete={(
            id,
            title
          ) =>
            handleDeleteEvent(
              id,
              title
            )
          }

          onStatusChange={
            handleStatusChange
          }
        />

        <EventFormModal
          isOpen={
            !!editingEvent
          }

          event={
            editingEvent
          }

          onClose={() =>
            setEditingEvent(null)
          }

          onSave={
            handleSaveEvent
          }
        />

        <DeleteConfirmModal
          isOpen={
            deleteDialog.isOpen
          }

          eventTitle={
            deleteDialog.title
          }

          onConfirm={
            handleConfirmDelete
          }

          onCancel={() =>
            setDeleteDialog({
              isOpen: false,
              id: '',
              title: '',
            })
          }
        />

        <ProjectModal
          isOpen={
            isProjectModalOpen
          }

          editingProject={
            editingProject
          }

          onClose={() => {
            setIsProjectModalOpen(
              false
            );

            setEditingProject(
              null
            );
          }}

          onSave={
            handleSaveProject
          }
        />

        <AchievementModal
          isOpen={
            isAchievementModalOpen
          }

          onClose={() =>
            setIsAchievementModalOpen(
              false
            )
          }

          onSave={
            handleSaveAchievement
          }
        />

        <GalleryModal
          isOpen={
            isGalleryModalOpen
          }

          onClose={() =>
            setIsGalleryModalOpen(
              false
            )
          }

          onSave={
            handleSaveGalleryItem
          }
        />

      </div>
    );
  }

  // -------------------------------------------------------------
  // PUBLIC WEBSITE ROUTES
  // -------------------------------------------------------------

  const renderPublicPage = () => {

    switch (currentPath) {

      // ---------------------------------------------------------
      // ABOUT
      // ---------------------------------------------------------

      case '/about':
        return <AboutView />;

      // ---------------------------------------------------------
      // TEAM
      // ---------------------------------------------------------

      case '/team':
        return <TeamView />;

      // ---------------------------------------------------------
      // EVENTS
      // ---------------------------------------------------------

      case '/events':
        return (
          <PublicEventsView
            events={events}

            selectedDateStr={
              selectedDateStr
            }

            onSelectDate={(dStr) =>
              setSelectedDateStr(
                dStr
              )
            }

            onOpenEventDetails={(ev) =>
              setDetailsEvent(ev)
            }

            onOpenCreateEvent={(dStr) => {

              if (dStr) {
                setSelectedDateStr(
                  dStr
                );
              }

              setEditingEvent(
                null
              );

              navigate(
                '/dashboard'
              );

              setActiveTab(
                'create_event'
              );
            }}

            onEditEvent={(ev) => {
              setEditingEvent(
                ev
              );
            }}

            onDeleteEvent={
              handleDeleteEvent
            }

            onStatusChange={
              handleStatusChange
            }
          />
        );

      // ---------------------------------------------------------
      // PROJECTS
      // ---------------------------------------------------------

      case '/projects':
        return (
          <ProjectsView
            projects={projects}

            onOpenCreateProject={() => {
              setEditingProject(
                null
              );

              setIsProjectModalOpen(
                true
              );
            }}

            onEditProject={(p) => {
              setEditingProject(
                p
              );

              setIsProjectModalOpen(
                true
              );
            }}

            onDeleteProject={
              handleDeleteProject
            }
          />
        );

      // ---------------------------------------------------------
      // ACHIEVEMENTS
      // ---------------------------------------------------------

      case '/achievements':
        return (
          <AchievementsView
            achievements={
              achievements
            }

            onOpenCreateAchievement={() =>
              setIsAchievementModalOpen(
                true
              )
            }

            onDeleteAchievement={
              handleDeleteAchievement
            }
          />
        );

      // ---------------------------------------------------------
      // GALLERY
      // ---------------------------------------------------------

      case '/gallery':
        return (
          <GalleryView
            galleryItems={
              galleryItems
            }

            onOpenCreateItem={() =>
              setIsGalleryModalOpen(
                true
              )
            }

            onDeleteItem={
              handleDeleteGalleryItem
            }
          />
        );

      // ---------------------------------------------------------
      // JOIN US
      // ---------------------------------------------------------

      case '/join-us':
        return <JoinUsView />;

      // ---------------------------------------------------------
      // CONTACT
      // ---------------------------------------------------------

      case '/contact':
        return <ContactView />;

      // ---------------------------------------------------------
      // HOME
      // ---------------------------------------------------------

      case '/':
      default:
        return (
          <HomeView
            events={events}
            projects={projects}
            achievements={
              achievements
            }

            onNavigate={
              navigate
            }

            onSelectEvent={(ev) =>
              setDetailsEvent(ev)
            }
          />
        );
    }
  };

  // -------------------------------------------------------------
  // PUBLIC WEBSITE LAYOUT
  // -------------------------------------------------------------

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-[#990000] selection:text-white">

      {/* Public Header */}

      <PublicHeader
        currentPath={
          currentPath
        }

        onNavigate={
          navigate
        }
      />

      {/* Main Page */}

      <main className="flex-1">
        {renderPublicPage()}
      </main>

      {/* Public Footer */}

      <PublicFooter
        onNavigate={
          navigate
        }
      />

      {/* ---------------------------------------------------------
          Global Event Modal
      --------------------------------------------------------- */}

      <EventDetailsModal
        isOpen={
          !!detailsEvent
        }

        event={
          detailsEvent
        }

        onClose={() =>
          setDetailsEvent(null)
        }

        onEdit={(ev) => {
          setDetailsEvent(
            null
          );

          setEditingEvent(
            ev
          );
        }}

        onDelete={(
          id,
          title
        ) =>
          handleDeleteEvent(
            id,
            title
          )
        }

        onStatusChange={
          handleStatusChange
        }
      />

      {/* ---------------------------------------------------------
          Global Event Form Modal
      --------------------------------------------------------- */}

      <EventFormModal
        isOpen={
          !!editingEvent
        }

        event={
          editingEvent
        }

        onClose={() =>
          setEditingEvent(null)
        }

        onSave={
          handleSaveEvent
        }
      />

      {/* ---------------------------------------------------------
          Global Delete Modal
      --------------------------------------------------------- */}

      <DeleteConfirmModal
        isOpen={
          deleteDialog.isOpen
        }

        eventTitle={
          deleteDialog.title
        }

        onConfirm={
          handleConfirmDelete
        }

        onCancel={() =>
          setDeleteDialog({
            isOpen: false,
            id: '',
            title: '',
          })
        }
      />

      {/* ---------------------------------------------------------
          Project Modal
      --------------------------------------------------------- */}

      <ProjectModal
        isOpen={
          isProjectModalOpen
        }

        editingProject={
          editingProject
        }

        onClose={() => {
          setIsProjectModalOpen(
            false
          );

          setEditingProject(
            null
          );
        }}

        onSave={
          handleSaveProject
        }
      />

      {/* ---------------------------------------------------------
          Achievement Modal
      --------------------------------------------------------- */}

      <AchievementModal
        isOpen={
          isAchievementModalOpen
        }

        onClose={() =>
          setIsAchievementModalOpen(
            false
          )
        }

        onSave={
          handleSaveAchievement
        }
      />

      {/* ---------------------------------------------------------
          Gallery Modal
      --------------------------------------------------------- */}

      <GalleryModal
        isOpen={
          isGalleryModalOpen
        }

        onClose={() =>
          setIsGalleryModalOpen(
            false
          )
        }

        onSave={
          handleSaveGalleryItem
        }
      />

    </div>
  );
}