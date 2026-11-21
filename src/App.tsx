/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { testConnection } from './firebase';
import {
  getTabFromSearch,
  buildRelativeUrlForTab,
  getCanonicalUrlForTab,
} from './utils/routing';
import { 
  InitiativeSettings, 
  Broadcast, 
  Lecture, 
  Interview, 
  Quiz, 
  EventItem, 
  RegistrationItem, 
  ActiveTab 
} from './types';
import { 
  getInitiativeSettings, 
  getBroadcasts, 
  getLectures, 
  getInterviews, 
  getQuizzes, 
  getEvents, 
  getRegistrations, 
  DEFAULT_SETTINGS 
} from './services/dataService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { LoginModal } from './components/LoginModal';
import { LoadingScreen } from './components/LoadingScreen';
import { HomeView } from './components/public/HomeView';
import { BroadcastsView } from './components/public/BroadcastsView';
import { LecturesView } from './components/public/LecturesView';
import { InterviewsView } from './components/public/InterviewsView';
import { HabitsQuizView } from './components/public/HabitsQuizView';
import { EventsView } from './components/public/EventsView';
import { RegistrationsView } from './components/public/RegistrationsView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AccessDeniedView } from './components/admin/AccessDeniedView';

function MainApp() {
  const { currentUser, isSuperAdmin, isAdmin, isAuthorizedStaff, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTabState] = useState<ActiveTab>(() =>
    typeof window !== 'undefined' ? getTabFromSearch(window.location.search) : 'home'
  );
  const [dataLoading, setDataLoading] = useState(true);

  const setActiveTab = useCallback((tab: ActiveTab) => {
    if (typeof window !== 'undefined' && tab !== 'admin') {
      const nextUrl = buildRelativeUrlForTab(tab, window.location.pathname, window.location.search);
      const currentUrl = window.location.pathname + window.location.search;
      if (nextUrl !== currentUrl) {
        window.history.pushState({ tab }, '', nextUrl);
      }
    }
    setActiveTabState(tab);
    if (tab === 'contact') {
      setTimeout(() => {
        const contactEl = document.getElementById('contact');
        if (contactEl) {
          contactEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Sync URL normalization on mount and handle browser Back/Forward (popstate)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const rawParams = new URLSearchParams(window.location.search);
    const sectionValues = rawParams.getAll('section');
    const resolvedTab = getTabFromSearch(window.location.search);

    if (sectionValues.length > 1 || (sectionValues.length === 1 && resolvedTab === 'home')) {
      const normalizedUrl = buildRelativeUrlForTab(resolvedTab, window.location.pathname, window.location.search);
      window.history.replaceState({ tab: resolvedTab }, '', normalizedUrl);
    } else if (!window.history.state?.tab) {
      window.history.replaceState({ tab: resolvedTab }, '', window.location.pathname + window.location.search);
    }

    const handlePopState = () => {
      const nextTab = getTabFromSearch(window.location.search);
      setActiveTabState(nextTab);
      if (nextTab === 'contact') {
        setTimeout(() => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic Bilingual SEO Synchronization
  useEffect(() => {
    if (typeof document === 'undefined') return;

    let pageTitle = t('seo_home_title');
    let pageDesc = t('seo_home_desc');

    if (activeTab === 'broadcasts') {
      pageTitle = t('seo_broadcasts_title');
      pageDesc = t('seo_broadcasts_desc');
    } else if (activeTab === 'lectures') {
      pageTitle = t('seo_lectures_title');
      pageDesc = t('seo_lectures_desc');
    } else if (activeTab === 'interviews') {
      pageTitle = t('seo_interviews_title');
      pageDesc = t('seo_interviews_desc');
    } else if (activeTab === 'quizzes') {
      pageTitle = t('seo_quizzes_title');
      pageDesc = t('seo_quizzes_desc');
    } else if (activeTab === 'events') {
      pageTitle = t('seo_events_title');
      pageDesc = t('seo_events_desc');
    } else if (activeTab === 'registrations') {
      pageTitle = t('seo_registrations_title');
      pageDesc = t('seo_registrations_desc');
    } else if (activeTab === 'contact') {
      pageTitle = t('seo_contact_title');
      pageDesc = t('seo_contact_desc');
    } else if (activeTab === 'admin') {
      pageTitle = t('seo_admin_title');
      pageDesc = language === 'ar' ? 'بوابة الإدارة والتحكم الخاصة بمبادرة عافية تُزهر.' : 'Private administrative portal for Blooming Wellness initiative.';
    }

    const canonicalUrl = getCanonicalUrlForTab(activeTab);

    // Update document title
    document.title = pageTitle;

    // Helper for meta tags
    const setMetaTag = (selector: string, attribute: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update canonical link tag
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    setMetaTag('meta[name="description"]', 'name', 'description', pageDesc);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', pageDesc);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', pageDesc);
    setMetaTag('meta[name="twitter:url"]', 'name', 'twitter:url', canonicalUrl);

    // Keep admin completely private and unindexed; allow public content
    if (activeTab === 'admin') {
      setMetaTag('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }
  }, [activeTab, language, t]);

  // Core Data
  const [settings, setSettings] = useState<InitiativeSettings>(DEFAULT_SETTINGS);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [videoModal, setVideoModal] = useState<{
    isOpen: boolean;
    title: string;
    videoUrl?: string;
    audioUrl?: string;
  }>({
    isOpen: false,
    title: '',
  });

  // Initial load (non-blocking for static shell; populates dynamic Firestore data concurrently)
  useEffect(() => {
    let mounted = true;

    async function initializePortal() {
      try {
        setDataLoading(true);
        // Run connection check concurrently so it never blocks initial query dispatch or UI render
        void testConnection();

        // Load all collections concurrently with individual resilience (Firestore as single source of truth)
        const [
          settingsData,
          broadcastsData,
          lecturesData,
          interviewsData,
          quizzesData,
          eventsData,
          registrationsData
        ] = await Promise.all([
          getInitiativeSettings().catch((e) => { console.warn('Using default settings fallback:', e); return DEFAULT_SETTINGS; }),
          getBroadcasts().catch((e) => { console.warn('Broadcasts load fallback:', e); return []; }),
          getLectures().catch((e) => { console.warn('Lectures load fallback:', e); return []; }),
          getInterviews().catch((e) => { console.warn('Interviews load fallback:', e); return []; }),
          getQuizzes().catch((e) => { console.warn('Quizzes load fallback:', e); return []; }),
          getEvents().catch((e) => { console.warn('Events load fallback:', e); return []; }),
          getRegistrations().catch((e) => { console.warn('Registrations load fallback:', e); return []; }),
        ]);

        if (mounted) {
          if (settingsData) setSettings(settingsData);
          if (broadcastsData) setBroadcasts(broadcastsData);
          if (lecturesData) setLectures(lecturesData);
          if (interviewsData) setInterviews(interviewsData);
          if (quizzesData) setQuizzes(quizzesData);
          if (eventsData) setEvents(eventsData);
          if (registrationsData) setRegistrations(registrationsData);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        if (mounted) {
          setDataLoading(false);
        }
      }
    }

    initializePortal();

    return () => {
      mounted = false;
    };
  }, []);

  const openVideoModal = (title: string, videoUrl?: string, audioUrl?: string) => {
    setVideoModal({
      isOpen: true,
      title,
      videoUrl,
      audioUrl,
    });
  };

  const closeVideoModal = () => {
    setVideoModal(prev => ({ ...prev, isOpen: false }));
  };

  // Smooth scroll to contact section when entering/loading ?section=contact (keeps URL & contact metadata)
  useEffect(() => {
    if (activeTab === 'contact') {
      const timer = setTimeout(() => {
        const contactEl = document.getElementById('contact');
        if (contactEl) {
          contactEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // Admin Dashboard Mode
  if (activeTab === 'admin') {
    // If auth state is still resolving, show smooth loading state instead of premature access denial
    if (authLoading) {
      return (
        <LoadingScreen 
          settings={settings} 
          messageAr="جارٍ التحقق من الصلاحيات الإدارية..." 
          messageEn="Verifying administrative permissions..." 
        />
      );
    }

    if (!currentUser || !isAuthorizedStaff) {
      return (
        <div className="min-h-screen bg-[#f7fbfc] flex flex-col justify-between">
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            settings={settings}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />

          <AccessDeniedView
            onReturnHome={() => setActiveTab('home')}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />

          <Footer
            settings={settings}
            setActiveTab={setActiveTab}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />

          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onSuccess={() => setIsLoginModalOpen(false)}
          />
        </div>
      );
    }

    return (
      <AdminDashboard
        settings={settings}
        setSettings={setSettings}
        broadcasts={broadcasts}
        setBroadcasts={setBroadcasts}
        lectures={lectures}
        setLectures={setLectures}
        interviews={interviews}
        setInterviews={setInterviews}
        quizzes={quizzes}
        setQuizzes={setQuizzes}
        events={events}
        setEvents={setEvents}
        registrations={registrations}
        setRegistrations={setRegistrations}
        onExitToPublic={() => setActiveTab('home')}
      />
    );
  }

  // Public Portal Mode
  return (
    <div className="min-h-screen flex flex-col justify-between bg-stone-50 dark:bg-[#0b1519] text-stone-900 dark:text-[#f0f7f9] transition-colors duration-200 selection:bg-emerald-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Public Tab Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            settings={settings}
            broadcasts={broadcasts}
            lectures={lectures}
            events={events}
            isLoading={dataLoading}
            setActiveTab={setActiveTab}
            onOpenVideoModal={openVideoModal}
          />
        )}

        {activeTab === 'broadcasts' && (
          <BroadcastsView
            broadcasts={broadcasts}
            isLoading={dataLoading}
            onOpenVideoModal={openVideoModal}
          />
        )}

        {activeTab === 'lectures' && (
          <LecturesView
            lectures={lectures}
            isLoading={dataLoading}
            onOpenVideoModal={openVideoModal}
          />
        )}

        {activeTab === 'interviews' && (
          <InterviewsView
            interviews={interviews}
            isLoading={dataLoading}
            onOpenVideoModal={openVideoModal}
          />
        )}

        {activeTab === 'quizzes' && (
          <HabitsQuizView quizzes={quizzes} isLoading={dataLoading} />
        )}

        {activeTab === 'events' && (
          <EventsView events={events} isLoading={dataLoading} />
        )}

        {activeTab === 'registrations' && (
          <RegistrationsView registrations={registrations} isLoading={dataLoading} />
        )}

        {activeTab === 'contact' && (
          <HomeView
            settings={settings}
            broadcasts={broadcasts}
            lectures={lectures}
            events={events}
            isLoading={dataLoading}
            setActiveTab={setActiveTab}
            onOpenVideoModal={openVideoModal}
          />
        )}
      </main>

      {/* Media Player Modal */}
      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        title={videoModal.title}
        videoUrl={videoModal.videoUrl}
        audioUrl={videoModal.audioUrl}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsLoginModalOpen(false)}
      />

      {/* Footer */}
      <Footer
        settings={settings}
        setActiveTab={setActiveTab}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
