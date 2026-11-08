/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { testConnection } from './firebase';
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
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [loading, setLoading] = useState(true);

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

  // Initial load
  useEffect(() => {
    let mounted = true;

    async function initializePortal() {
      try {
        setLoading(true);
        // 1. Test connection as mandated by skill
        await testConnection();

        // 2. Load all collections concurrently with individual resilience (Firestore as single source of truth)
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
          setLoading(false);
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

  // Smooth scroll to contact section if activeTab is 'contact'
  useEffect(() => {
    if (activeTab === 'contact') {
      setActiveTab('home');
      setTimeout(() => {
        const contactEl = document.getElementById('contact');
        if (contactEl) {
          contactEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [activeTab]);

  // If loading initially
  if (loading) {
    return <LoadingScreen settings={settings} />;
  }

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
            setActiveTab={setActiveTab}
            onOpenVideoModal={openVideoModal}
          />
        )}

        {activeTab === 'broadcasts' && (
          <BroadcastsView
            broadcasts={broadcasts}
            onOpenVideoModal={openVideoModal}
          />
        )}

        {activeTab === 'lectures' && (
          <LecturesView
            lectures={lectures}
            onOpenVideoModal={openVideoModal}
          />
        )}

        {activeTab === 'interviews' && (
          <InterviewsView
            interviews={interviews}
            onOpenVideoModal={openVideoModal}
          />
        )}

        {activeTab === 'quizzes' && (
          <HabitsQuizView quizzes={quizzes} />
        )}

        {activeTab === 'events' && (
          <EventsView events={events} />
        )}

        {activeTab === 'registrations' && (
          <RegistrationsView registrations={registrations} />
        )}

        {activeTab === 'contact' && (
          <div className="py-8">
            <HomeView
              settings={settings}
              broadcasts={broadcasts}
              lectures={lectures}
              events={events}
              setActiveTab={setActiveTab}
              onOpenVideoModal={openVideoModal}
            />
          </div>
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
