/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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
  seedInitialContentIfEmpty,
  DEFAULT_SETTINGS 
} from './services/dataService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { LoginModal } from './components/LoginModal';
import { HomeView } from './components/public/HomeView';
import { BroadcastsView } from './components/public/BroadcastsView';
import { LecturesView } from './components/public/LecturesView';
import { InterviewsView } from './components/public/InterviewsView';
import { HabitsQuizView } from './components/public/HabitsQuizView';
import { EventsView } from './components/public/EventsView';
import { RegistrationsView } from './components/public/RegistrationsView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Sparkles, Loader2, ShieldAlert } from 'lucide-react';

function MainApp() {
  const { currentUser, isSuperAdmin, isAdmin } = useAuth();
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

        // 2. Seed initial data if empty
        await seedInitialContentIfEmpty();

        // 3. Load all collections concurrently
        const [
          settingsData,
          broadcastsData,
          lecturesData,
          interviewsData,
          quizzesData,
          eventsData,
          registrationsData
        ] = await Promise.all([
          getInitiativeSettings(),
          getBroadcasts(),
          getLectures(),
          getInterviews(),
          getQuizzes(),
          getEvents(),
          getRegistrations(),
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

  // If loading initially
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-600 flex items-center justify-center text-white shadow-xl mb-4 animate-bounce">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
          <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
          <span>جارٍ الاتصال بقاعدة البيانات وتهيئة منصة المبادرة التوعوية...</span>
        </div>
      </div>
    );
  }

  // Admin Dashboard Mode
  if (activeTab === 'admin') {
    if (!currentUser) {
      return (
        <div className="min-h-screen bg-stone-100 flex flex-col justify-between">
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            settings={settings}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />

          <div className="max-w-md mx-auto p-8 my-16 bg-white rounded-3xl border border-stone-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">منطقة مخصصة لإدارة المبادرة</h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              يرجى تسجيل الدخول باستخدام حساب Google المعتمد للمدير الرئيسي أو المشرفين للوصول إلى لوحة التحكم الإدارية.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                تسجيل الدخول للمسؤولين
              </button>
            </div>
          </div>

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
    <div className="min-h-screen flex flex-col justify-between bg-stone-50 text-stone-900 selection:bg-emerald-600 selection:text-white">
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
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
