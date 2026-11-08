import React, { useState, useEffect } from 'react';
import { useAuth, SUPER_ADMIN_EMAIL } from '../../context/AuthContext';
import { AccessDeniedView } from './AccessDeniedView';
import { getAssetUrl } from '../../utils/assets';
import { 
  InitiativeSettings, 
  Broadcast, 
  Lecture, 
  Interview, 
  Quiz, 
  QuizQuestion,
  QuizResponse, 
  EventItem, 
  RegistrationItem, 
  Supervisor, 
  Inquiry 
} from '../../types';
import { 
  saveInitiativeSettings, 
  createBroadcast, 
  updateBroadcast, 
  deleteBroadcast, 
  createLecture, 
  updateLecture, 
  deleteLecture, 
  createInterview, 
  updateInterview, 
  deleteInterview, 
  createQuiz, 
  deleteQuiz, 
  getQuizResponses, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  createRegistration, 
  updateRegistration, 
  deleteRegistration, 
  getSupervisors, 
  saveSupervisor, 
  deleteSupervisor, 
  getInquiries, 
  updateInquiryStatus, 
  seedInitialContentIfEmpty 
} from '../../services/dataService';
import { 
  Pencil, 
  Globe, 
  Sun, 
  Moon, 
  LayoutDashboard, 
  Sliders, 
  Radio, 
  Video, 
  Mic, 
  CheckSquare, 
  Calendar, 
  ClipboardList, 
  Users, 
  Mail, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  BarChart2, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Eye,
  BookOpen,
  X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface AdminDashboardProps {
  settings: InitiativeSettings;
  setSettings: (s: InitiativeSettings) => void;
  broadcasts: Broadcast[];
  setBroadcasts: React.Dispatch<React.SetStateAction<Broadcast[]>>;
  lectures: Lecture[];
  setLectures: React.Dispatch<React.SetStateAction<Lecture[]>>;
  interviews: Interview[];
  setInterviews: React.Dispatch<React.SetStateAction<Interview[]>>;
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  registrations: RegistrationItem[];
  setRegistrations: React.Dispatch<React.SetStateAction<RegistrationItem[]>>;
  onExitToPublic: () => void;
}

type AdminSection = 
  | 'overview' 
  | 'settings' 
  | 'broadcasts' 
  | 'lectures' 
  | 'interviews' 
  | 'quizzes' 
  | 'events' 
  | 'registrations' 
  | 'supervisors' 
  | 'inquiries';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  setSettings,
  broadcasts,
  setBroadcasts,
  lectures,
  setLectures,
  interviews,
  setInterviews,
  quizzes,
  setQuizzes,
  events,
  setEvents,
  registrations,
  setRegistrations,
  onExitToPublic,
}) => {
  const { currentUser, isSuperAdmin, isAdmin, isAuthorizedStaff, supervisorProfile, hasPermission, logout } = useAuth();
  const [currentSection, setCurrentSection] = useState<AdminSection>('overview');

  // Hardened Security Guard: if user is not Super Admin and not an Authorized Supervisor, completely deny rendering
  if (!isAuthorizedStaff) {
    return (
      <div className="min-h-screen bg-[#f7fbfc] flex items-center justify-center p-4">
        <AccessDeniedView onReturnHome={onExitToPublic} />
      </div>
    );
  }

  // Feedback notifications
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setSuccessMsg(null);
    } else {
      setSuccessMsg(msg);
      setErrorMsg(null);
    }
    setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 4000);
  };

  // Additional data for admin
  const [quizResponses, setQuizResponses] = useState<QuizResponse[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, [currentSection]);

  const loadAdminData = async () => {
    try {
      setLoadingData(true);
      // Strictly guard data loading by role & permission
      if ((currentSection === 'quizzes' || currentSection === 'overview') && (hasPermission('quizzes') || isSuperAdmin)) {
        const res = await getQuizResponses().catch(() => []);
        setQuizResponses(res);
      }
      if (currentSection === 'supervisors' && (isAdmin || isSuperAdmin)) {
        const sups = await getSupervisors().catch(() => []);
        setSupervisors(sups);
      }
      if ((currentSection === 'inquiries' || currentSection === 'overview') && (isAdmin || isSuperAdmin)) {
        const inqs = await getInquiries().catch(() => []);
        setInquiries(inqs);
      }
    } catch (e) {
      console.warn('Notice loading secondary admin data:', e);
    } finally {
      setLoadingData(false);
    }
  };

  const { t, isRtl, language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  // ================= Form States for Modals & Creation =================
  // Settings Form
  const [settingsForm, setSettingsForm] = useState<InitiativeSettings>(settings);

  // Keep settingsForm synchronized whenever settings updates from Firestore
  useEffect(() => {
    if (settings) {
      setSettingsForm(settings);
    }
  }, [settings]);

  // Broadcast Modal
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [editingBroadcastId, setEditingBroadcastId] = useState<string | null>(null);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastDescription, setBroadcastDescription] = useState('');
  const [broadcastDate, setBroadcastDate] = useState(new Date().toISOString().split('T')[0]);
  const [broadcastTopic, setBroadcastTopic] = useState('العادات الصباحية');
  const [broadcastImageUrl, setBroadcastImageUrl] = useState('');
  const [broadcastAudioUrl, setBroadcastAudioUrl] = useState('');
  const [broadcastVideoUrl, setBroadcastVideoUrl] = useState('');

  // Lecture Modal
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null);
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureSpeaker, setLectureSpeaker] = useState('');
  const [lectureDescription, setLectureDescription] = useState('');
  const [lectureDate, setLectureDate] = useState(new Date().toISOString().split('T')[0]);
  const [lectureDuration, setLectureDuration] = useState('45 دقيقة');
  const [lectureTopic, setLectureTopic] = useState('الطب الوقائي');
  const [lectureImageUrl, setLectureImageUrl] = useState('');
  const [lectureVideoUrl, setLectureVideoUrl] = useState('');

  // Interview Modal
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [editingInterviewId, setEditingInterviewId] = useState<string | null>(null);
  const [interviewTitle, setInterviewTitle] = useState('');
  const [interviewGuestName, setInterviewGuestName] = useState('');
  const [interviewGuestTitle, setInterviewGuestTitle] = useState('');
  const [interviewDescription, setInterviewDescription] = useState('');
  const [interviewDate, setInterviewDate] = useState(new Date().toISOString().split('T')[0]);
  const [interviewTopic, setInterviewTopic] = useState('اللياقة والصحة');
  const [interviewImageUrl, setInterviewImageUrl] = useState('');
  const [interviewVideoUrl, setInterviewVideoUrl] = useState('');

  // Event Modal
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('04:00 مساءً - 08:00 مساءً');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStatus, setEventStatus] = useState<EventItem['status']>('upcoming');
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [eventIsFeatured, setEventIsFeatured] = useState(false);

  // Registration Modal
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [editingRegId, setEditingRegId] = useState<string | null>(null);
  const [regTitle, setRegTitle] = useState('');
  const [regDescription, setRegDescription] = useState('');
  const [regExternalUrl, setRegExternalUrl] = useState('');
  const [regDeadline, setRegDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [regStatus, setRegStatus] = useState<'open' | 'closed'>('open');
  const [regImageUrl, setRegImageUrl] = useState('');

  // Quiz Modal
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizCategory, setQuizCategory] = useState('العادات الصحية');
  const [quizImageUrl, setQuizImageUrl] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q1',
      questionText: '',
      type: 'multiple_choice',
      options: ['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع'],
      correctAnswerIndex: 0,
      explanation: ''
    }
  ]);

  // Supervisor Form (Admin only)
  const [isSupervisorModalOpen, setIsSupervisorModalOpen] = useState(false);
  const [newSupEmail, setNewSupEmail] = useState('');
  const [newSupName, setNewSupName] = useState('');
  const [newSupRole, setNewSupRole] = useState<'admin' | 'editor'>('editor');
  const [newSupPermissions, setNewSupPermissions] = useState({
    broadcasts: true,
    lectures: true,
    interviews: true,
    quizzes: true,
    events: true,
    registrations: true,
    settings: false,
    supervisors: false
  });

  // Edit Supervisor State (Admin only - Pencil action)
  const [isEditSupervisorModalOpen, setIsEditSupervisorModalOpen] = useState(false);
  const [editingSupervisor, setEditingSupervisor] = useState<Supervisor | null>(null);

  // In-app confirmation dialog state (avoiding window.confirm iframe blocks)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Re-seed trigger
  const handleSeedData = () => {
    setConfirmDialog({
      isOpen: true,
      title: t('admin_confirm_seed_title', 'تهيئة البيانات الأولية'),
      message: t('admin_confirm_seed_msg', 'هل تريد تهيئة المحتويات النموذجية المعتمدة للمبادرة في قاعدة البيانات إذا كانت فارغة؟'),
      onConfirm: async () => {
        try {
          const success = await seedInitialContentIfEmpty();
          if (success) {
            showNotification(t('admin_notify_seed_success', 'تمت تهيئة محتويات المبادرة بنجاح!'));
            setTimeout(() => window.location.reload(), 1500);
          } else {
            showNotification(t('admin_notify_seed_exists', 'البيانات موجودة بالفعل مسبقاً.'));
          }
        } catch (e) {
          showNotification(t('admin_notify_seed_error', 'تعذر استكمال التهيئة.'), true);
        }
      }
    });
  };

  // ================= CRUD Handlers =================
  // 1. Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('settings')) {
      showNotification(t('admin_notify_perm_settings', 'ليس لديك صلاحية لتعديل إعدادات الموقع.'), true);
      return;
    }
    try {
      await saveInitiativeSettings(settingsForm);
      setSettings(settingsForm);
      showNotification(t('admin_notify_save_settings_success', 'تم حفظ إعدادات المبادرة وبيانات الصفحة الرئيسية بنجاح!'));
    } catch (e) {
      showNotification(t('admin_notify_save_settings_error', 'حدث خطأ أثناء حفظ الإعدادات.'), true);
    }
  };

  // 2. Broadcast Save
  const handleSaveBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('broadcasts')) {
      showNotification(t('admin_notify_perm_broadcasts', 'ليس لديك صلاحية لإدارة الإذاعات الصباحية.'), true);
      return;
    }
    try {
      if (editingBroadcastId) {
        await updateBroadcast(editingBroadcastId, {
          title: broadcastTitle,
          description: broadcastDescription,
          date: broadcastDate,
          topic: broadcastTopic,
          imageUrl: broadcastImageUrl || undefined,
          audioUrl: broadcastAudioUrl || undefined,
          videoUrl: broadcastVideoUrl || undefined,
        });
        setBroadcasts(prev => prev.map(b => b.id === editingBroadcastId ? {
          ...b,
          title: broadcastTitle,
          description: broadcastDescription,
          date: broadcastDate,
          topic: broadcastTopic,
          imageUrl: broadcastImageUrl || undefined,
          audioUrl: broadcastAudioUrl || undefined,
          videoUrl: broadcastVideoUrl || undefined,
        } : b));
        showNotification(t('admin_notify_broadcast_updated', 'تم تعديل الإذاعة الصباحية بنجاح!'));
      } else {
        const id = await createBroadcast({
          title: broadcastTitle,
          description: broadcastDescription,
          date: broadcastDate,
          topic: broadcastTopic,
          imageUrl: broadcastImageUrl || undefined,
          audioUrl: broadcastAudioUrl || undefined,
          videoUrl: broadcastVideoUrl || undefined,
        });
        setBroadcasts(prev => [{
          id,
          title: broadcastTitle,
          description: broadcastDescription,
          date: broadcastDate,
          topic: broadcastTopic,
          imageUrl: broadcastImageUrl || undefined,
          audioUrl: broadcastAudioUrl || undefined,
          videoUrl: broadcastVideoUrl || undefined,
          createdAt: new Date().toISOString()
        }, ...prev]);
        showNotification(t('admin_notify_broadcast_added', 'تم إضافة الإذاعة الصباحية بنجاح!'));
      }
      setIsBroadcastModalOpen(false);
    } catch (e) {
      showNotification(t('admin_notify_generic_error', 'فشلت العملية، يرجى التحقق من الصلاحيات والمدخلات.'), true);
    }
  };

  const handleDeleteBroadcast = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: t('admin_confirm_delete_title', 'تأكيد الحذف'),
      message: t('admin_confirm_delete_broadcast', 'هل أنت متأكد من رغبتك في حذف هذه الإذاعة الصباحية؟'),
      onConfirm: async () => {
        try {
          await deleteBroadcast(id);
          setBroadcasts(prev => prev.filter(b => b.id !== id));
          showNotification(t('admin_notify_broadcast_deleted', 'تم حذف الإذاعة بنجاح.'));
        } catch (e) {
          showNotification(t('admin_notify_generic_error', 'تعذر حذف الإذاعة.'), true);
        }
      }
    });
  };

  // 3. Lecture Save
  const handleSaveLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('lectures')) {
      showNotification(t('admin_notify_perm_lectures', 'ليس لديك صلاحية لإدارة المحاضرات.'), true);
      return;
    }
    try {
      if (editingLectureId) {
        await updateLecture(editingLectureId, {
          title: lectureTitle,
          speaker: lectureSpeaker,
          description: lectureDescription,
          date: lectureDate,
          duration: lectureDuration,
          topic: lectureTopic,
          imageUrl: lectureImageUrl || undefined,
          videoUrl: lectureVideoUrl || undefined,
        });
        setLectures(prev => prev.map(l => l.id === editingLectureId ? {
          ...l,
          title: lectureTitle,
          speaker: lectureSpeaker,
          description: lectureDescription,
          date: lectureDate,
          duration: lectureDuration,
          topic: lectureTopic,
          imageUrl: lectureImageUrl || undefined,
          videoUrl: lectureVideoUrl || undefined,
        } : l));
        showNotification(t('admin_notify_lecture_updated', 'تم تحديث المحاضرة بنجاح!'));
      } else {
        const id = await createLecture({
          title: lectureTitle,
          speaker: lectureSpeaker,
          description: lectureDescription,
          date: lectureDate,
          duration: lectureDuration,
          topic: lectureTopic,
          imageUrl: lectureImageUrl || undefined,
          videoUrl: lectureVideoUrl || undefined,
        });
        setLectures(prev => [{
          id,
          title: lectureTitle,
          speaker: lectureSpeaker,
          description: lectureDescription,
          date: lectureDate,
          duration: lectureDuration,
          topic: lectureTopic,
          imageUrl: lectureImageUrl || undefined,
          videoUrl: lectureVideoUrl || undefined,
          createdAt: new Date().toISOString()
        }, ...prev]);
        showNotification(t('admin_notify_lecture_added', 'تم إضافة المحاضرة التوعوية بنجاح!'));
      }
      setIsLectureModalOpen(false);
    } catch (e) {
      showNotification(t('admin_notify_generic_error', 'فشلت العملية، يرجى التحقق من الصلاحيات والمدخلات.'), true);
    }
  };

  const handleDeleteLecture = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: t('admin_confirm_delete_title', 'تأكيد الحذف'),
      message: t('admin_confirm_delete_lecture', 'هل أنت متأكد من حذف هذه المحاضرة التوعوية؟'),
      onConfirm: async () => {
        try {
          await deleteLecture(id);
          setLectures(prev => prev.filter(l => l.id !== id));
          showNotification(t('admin_notify_lecture_deleted', 'تم حذف المحاضرة.'));
        } catch (e) {
          showNotification(t('admin_notify_generic_error', 'تعذر حذف المحاضرة.'), true);
        }
      }
    });
  };

  // 4. Interview Save
  const handleSaveInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('interviews')) {
      showNotification(t('admin_notify_perm_interviews', 'ليس لديك صلاحية لإدارة المقابلات.'), true);
      return;
    }
    try {
      if (editingInterviewId) {
        await updateInterview(editingInterviewId, {
          title: interviewTitle,
          guestName: interviewGuestName,
          guestTitle: interviewGuestTitle,
          description: interviewDescription,
          date: interviewDate,
          topic: interviewTopic,
          imageUrl: interviewImageUrl || undefined,
          videoUrl: interviewVideoUrl || undefined,
        });
        setInterviews(prev => prev.map(i => i.id === editingInterviewId ? {
          ...i,
          title: interviewTitle,
          guestName: interviewGuestName,
          guestTitle: interviewGuestTitle,
          description: interviewDescription,
          date: interviewDate,
          topic: interviewTopic,
          imageUrl: interviewImageUrl || undefined,
          videoUrl: interviewVideoUrl || undefined,
        } : i));
        showNotification(t('admin_notify_interview_updated', 'تم تحديث المقابلة بنجاح!'));
      } else {
        const id = await createInterview({
          title: interviewTitle,
          guestName: interviewGuestName,
          guestTitle: interviewGuestTitle,
          description: interviewDescription,
          date: interviewDate,
          topic: interviewTopic,
          imageUrl: interviewImageUrl || undefined,
          videoUrl: interviewVideoUrl || undefined,
        });
        setInterviews(prev => [{
          id,
          title: interviewTitle,
          guestName: interviewGuestName,
          guestTitle: interviewGuestTitle,
          description: interviewDescription,
          date: interviewDate,
          topic: interviewTopic,
          imageUrl: interviewImageUrl || undefined,
          videoUrl: interviewVideoUrl || undefined,
          createdAt: new Date().toISOString()
        }, ...prev]);
        showNotification(t('admin_notify_interview_added', 'تم إضافة المقابلة بنجاح!'));
      }
      setIsInterviewModalOpen(false);
    } catch (e) {
      showNotification(t('admin_notify_generic_error', 'فشلت العملية.'), true);
    }
  };

  const handleDeleteInterview = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: t('admin_confirm_delete_title', 'تأكيد الحذف'),
      message: t('admin_confirm_delete_interview', 'هل تريد حذف هذه المقابلة الحوارية؟'),
      onConfirm: async () => {
        try {
          await deleteInterview(id);
          setInterviews(prev => prev.filter(i => i.id !== id));
          showNotification(t('admin_notify_interview_deleted', 'تم حذف المقابلة.'));
        } catch (e) {
          showNotification(t('admin_notify_generic_error', 'تعذر حذف المقابلة.'), true);
        }
      }
    });
  };

  // 5. Event Save
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('events')) {
      showNotification(t('admin_notify_perm_events', 'ليس لديك صلاحية لإدارة الفعاليات.'), true);
      return;
    }
    try {
      if (editingEventId) {
        await updateEvent(editingEventId, {
          title: eventTitle,
          description: eventDescription,
          date: eventDate,
          time: eventTime,
          location: eventLocation,
          status: eventStatus,
          imageUrl: eventImageUrl || undefined,
          isFeatured: eventIsFeatured,
        });
        setEvents(prev => prev.map(ev => ev.id === editingEventId ? {
          ...ev,
          title: eventTitle,
          description: eventDescription,
          date: eventDate,
          time: eventTime,
          location: eventLocation,
          status: eventStatus,
          imageUrl: eventImageUrl || undefined,
          isFeatured: eventIsFeatured,
        } : ev));
        showNotification(t('admin_notify_event_updated', 'تم تحديث الفعالية بنجاح!'));
      } else {
        const id = await createEvent({
          title: eventTitle,
          description: eventDescription,
          date: eventDate,
          time: eventTime,
          location: eventLocation,
          status: eventStatus,
          imageUrl: eventImageUrl || undefined,
          isFeatured: eventIsFeatured,
        });
        setEvents(prev => [{
          id,
          title: eventTitle,
          description: eventDescription,
          date: eventDate,
          time: eventTime,
          location: eventLocation,
          status: eventStatus,
          imageUrl: eventImageUrl || undefined,
          isFeatured: eventIsFeatured,
          createdAt: new Date().toISOString()
        }, ...prev]);
        showNotification(t('admin_notify_event_added', 'تم إضافة الفعالية بنجاح!'));
      }
      setIsEventModalOpen(false);
    } catch (e) {
      showNotification(t('admin_notify_generic_error', 'فشلت إضافة الفعالية.'), true);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: t('admin_confirm_delete_title', 'تأكيد الحذف'),
      message: t('admin_confirm_delete_event', 'هل تريد حذف هذه الفعالية من المنصة؟'),
      onConfirm: async () => {
        try {
          await deleteEvent(id);
          setEvents(prev => prev.filter(ev => ev.id !== id));
          showNotification(t('admin_notify_event_deleted', 'تم حذف الفعالية بنجاح.'));
        } catch (e) {
          showNotification(t('admin_notify_generic_error', 'تعذر حذف الفعالية.'), true);
        }
      }
    });
  };

  // 6. Registration Save
  const handleSaveRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('registrations')) {
      showNotification(t('admin_notify_perm_regs', 'ليس لديك صلاحية لإدارة روابط التسجيل.'), true);
      return;
    }
    try {
      if (editingRegId) {
        await updateRegistration(editingRegId, {
          title: regTitle,
          description: regDescription,
          externalUrl: regExternalUrl,
          deadline: regDeadline,
          status: regStatus,
          imageUrl: regImageUrl || undefined,
        });
        setRegistrations(prev => prev.map(r => r.id === editingRegId ? {
          ...r,
          title: regTitle,
          description: regDescription,
          externalUrl: regExternalUrl,
          deadline: regDeadline,
          status: regStatus,
          imageUrl: regImageUrl || undefined,
        } : r));
        showNotification(t('admin_notify_reg_updated', 'تم تعديل رابط التسجيل بنجاح!'));
      } else {
        const id = await createRegistration({
          title: regTitle,
          description: regDescription,
          externalUrl: regExternalUrl,
          deadline: regDeadline,
          status: regStatus,
          imageUrl: regImageUrl || undefined,
        });
        setRegistrations(prev => [{
          id,
          title: regTitle,
          description: regDescription,
          externalUrl: regExternalUrl,
          deadline: regDeadline,
          status: regStatus,
          imageUrl: regImageUrl || undefined,
          createdAt: new Date().toISOString()
        }, ...prev]);
        showNotification(t('admin_notify_reg_added', 'تم إضافة رابط التسجيل بنجاح!'));
      }
      setIsRegistrationModalOpen(false);
    } catch (e) {
      showNotification(t('admin_notify_generic_error', 'فشلت العملية.'), true);
    }
  };

  const handleDeleteRegistration = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: t('admin_confirm_delete_title', 'تأكيد الحذف'),
      message: t('admin_confirm_delete_reg', 'هل تريد حذف رابط التسجيل هذا؟'),
      onConfirm: async () => {
        try {
          await deleteRegistration(id);
          setRegistrations(prev => prev.filter(r => r.id !== id));
          showNotification(t('admin_notify_reg_deleted', 'تم حذف رابط التسجيل بنجاح.'));
        } catch (e) {
          showNotification(t('admin_notify_generic_error', 'تعذر الحذف.'), true);
        }
      }
    });
  };

  // 7. Quiz Save
  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('quizzes')) {
      showNotification(t('admin_notify_perm_quizzes', 'ليس لديك صلاحية لإدارة الاستبانات والاختبارات.'), true);
      return;
    }
    if (quizQuestions.length === 0) {
      showNotification(isRtl ? 'يرجى إضافة سؤال واحد على الأقل.' : 'Please add at least one question.', true);
      return;
    }
    for (const q of quizQuestions) {
      if (!q.questionText.trim()) {
        showNotification(isRtl ? 'يرجى كتابة نص السؤال لجميع الأسئلة.' : 'Please enter question text for all questions.', true);
        return;
      }
    }

    try {
      const id = await createQuiz({
        title: quizTitle,
        description: quizDescription,
        category: quizCategory,
        imageUrl: quizImageUrl || undefined,
        questions: quizQuestions,
      });
      setQuizzes(prev => [{
        id,
        title: quizTitle,
        description: quizDescription,
        category: quizCategory,
        imageUrl: quizImageUrl || undefined,
        questions: quizQuestions,
        createdAt: new Date().toISOString()
      }, ...prev]);
      showNotification(t('admin_notify_quiz_added', 'تم إنشاء الاستبانة ونشرها بنجاح!'));
      setIsQuizModalOpen(false);
      // Reset quiz modal fields
      setQuizTitle('');
      setQuizDescription('');
      setQuizQuestions([{
        id: 'q1',
        questionText: '',
        type: 'multiple_choice',
        options: isRtl ? ['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع'] : ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctAnswerIndex: 0,
        explanation: ''
      }]);
    } catch (e) {
      showNotification(t('admin_notify_generic_error', 'تعذر حفظ الاستبانة.'), true);
    }
  };

  const handleDeleteQuiz = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: t('admin_confirm_delete_title', 'تأكيد الحذف'),
      message: t('admin_confirm_delete_quiz', 'هل أنت متأكد من حذف هذه الاستبانة؟ ستفقد الأسئلة المرتبطة بها.'),
      onConfirm: async () => {
        try {
          await deleteQuiz(id);
          setQuizzes(prev => prev.filter(q => q.id !== id));
          showNotification(t('admin_notify_quiz_deleted', 'تم حذف الاستبانة بنجاح.'));
        } catch (e) {
          showNotification(t('admin_notify_generic_error', 'تعذر حذف الاستبانة.'), true);
        }
      }
    });
  };

  // 8. Supervisor Save (Admin only)
  const handleSaveSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showNotification(isRtl ? 'عذراً، فقط المدير الرئيسي يمتلك صلاحية إنشاء المشرفين.' : 'Unauthorized: Only the Super Admin can create supervisors.', true);
      return;
    }
    const cleanEmail = newSupEmail.trim().toLowerCase();
    if (!cleanEmail) {
      showNotification(isRtl ? 'يرجى إدخال البريد الإلكتروني للمشرف.' : 'Please enter the supervisor email.', true);
      return;
    }

    try {
      // Primary document key is the canonical lowercase email
      const supId = cleanEmail;
      const supervisorData: Supervisor = {
        id: supId,
        email: cleanEmail,
        name: newSupName.trim() || (isRtl ? 'مشرف معتمد' : 'Authorized Supervisor'),
        role: newSupRole,
        permissions: newSupPermissions,
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.email || 'admin'
      };

      await saveSupervisor(supervisorData);
      setSupervisors(prev => {
        const filtered = prev.filter(s => s.id !== supId && s.email.toLowerCase() !== cleanEmail);
        return [supervisorData, ...filtered];
      });
      showNotification(isRtl ? `تم تسجيل المشرف (${cleanEmail}) وتعيين الصلاحيات بنجاح!` : `Supervisor (${cleanEmail}) registered and permissions assigned!`);
      setIsSupervisorModalOpen(false);
      setNewSupEmail('');
      setNewSupName('');
    } catch (err: unknown) {
      console.error('Failed to save supervisor:', err);
      const msg = err instanceof Error ? err.message : (isRtl ? 'تعذر حفظ المشرف، تحقق من الصلاحيات والاتصال.' : 'Failed to save supervisor.');
      showNotification(msg, true);
    }
  };

  const handleDeleteSupervisor = (id: string) => {
    if (!isAdmin) return;
    setConfirmDialog({
      isOpen: true,
      title: t('sup_delete_confirm_title', 'سحب الصلاحيات'),
      message: t('sup_delete_confirm_msg', 'هل أنت متأكد من سحب صلاحيات هذا المشرف؟'),
      onConfirm: async () => {
        try {
          await deleteSupervisor(id);
          setSupervisors(prev => prev.filter(s => s.id !== id));
          showNotification(t('sup_delete_success', 'تم سحب صلاحيات المشرف بنجاح.'));
        } catch (err: unknown) {
          console.error('Failed to delete supervisor:', err);
          const msg = err instanceof Error ? err.message : (isRtl ? 'تعذر حذف المشرف.' : 'Failed to delete supervisor.');
          showNotification(msg, true);
        }
      }
    });
  };

  const handleOpenEditSupervisor = (sup: Supervisor) => {
    if (!isAdmin) return;
    setEditingSupervisor({
      ...sup,
      permissions: {
        broadcasts: sup.permissions?.broadcasts ?? true,
        lectures: sup.permissions?.lectures ?? true,
        interviews: sup.permissions?.interviews ?? true,
        quizzes: sup.permissions?.quizzes ?? true,
        events: sup.permissions?.events ?? true,
        registrations: sup.permissions?.registrations ?? true,
        settings: sup.permissions?.settings ?? false,
        supervisors: sup.permissions?.supervisors ?? false,
      }
    });
    setIsEditSupervisorModalOpen(true);
  };

  const handleSaveEditedSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingSupervisor) return;
    try {
      await saveSupervisor(editingSupervisor);
      setSupervisors(prev => prev.map(s => s.id === editingSupervisor.id ? editingSupervisor : s));
      showNotification(t('sup_save_success', 'تم تحديث صلاحيات المشرف بنجاح!'));
      setIsEditSupervisorModalOpen(false);
      setEditingSupervisor(null);
    } catch (err: unknown) {
      console.error('Failed to update supervisor:', err);
      const msg = err instanceof Error ? err.message : t('sup_save_error', 'تعذر حفظ صلاحيات المشرف.');
      showNotification(msg, true);
    }
  };

  // 9. Inquiry Status Toggle
  const handleToggleInquiryStatus = async (id: string, currentStatus: 'new' | 'replied') => {
    const newStatus = currentStatus === 'new' ? 'replied' : 'new';
    try {
      await updateInquiryStatus(id, newStatus);
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
      showNotification('تم تحديث حالة الرسالة.');
    } catch (e) {
      showNotification('تعذر تحديث الحالة.', true);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 dark:bg-[#0b1519] text-stone-900 dark:text-[#f0f7f9] pb-20 transition-colors">
      
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#0e3c48] text-white border-b border-[#134e5e] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2e9e66] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight">
                {t('admin_header_title', 'لوحة التحكم المركزية - عافية تُزهر')}
              </h1>
              <span className="text-[11px] text-[#84d2ea] font-medium">
                {isSuperAdmin ? t('admin_super_badge', 'المدير الرئيسي (كامل الصلاحيات)') : supervisorProfile?.role === 'admin' ? t('login_role_admin', 'مدير إداري') : t('login_role_editor', 'مشرف محتوى')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-[#134e5e] hover:bg-[#19657b] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer border border-[#20697d]"
              title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-[#84d2ea]" />
              <span className="font-sans text-[11px] font-black uppercase">
                {language === 'ar' ? 'English' : 'العربية'}
              </span>
            </button>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-1.5 bg-[#134e5e] hover:bg-[#19657b] text-white rounded-xl transition-colors cursor-pointer border border-[#20697d]"
              title={isDark ? t('light_mode', 'الوضع الفاتح') : t('dark_mode', 'الوضع الداكن')}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-200" />}
            </button>

            <button
              onClick={onExitToPublic}
              className="px-3 sm:px-3.5 py-1.5 bg-[#134e5e] hover:bg-[#19657b] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#84d2ea]" />
              <span className="hidden sm:inline">{t('admin_exit', 'معاينة موقع الزوار')}</span>
            </button>

            <button
              onClick={logout}
              className="px-3 sm:px-3.5 py-1.5 bg-rose-950/70 hover:bg-rose-900 text-rose-200 text-xs font-bold rounded-xl border border-rose-800/50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('nav_logout', 'تسجيل الخروج')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Alert Notifications */}
      {successMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-4 bg-[#eaf6fa] border border-[#84d2ea] rounded-2xl text-[#0e3c48] text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#2e9e66] shrink-0" />
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Main Admin Workspace with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Menu (3 cols desktop, responsive horizontal bar mobile/tablet) */}
          <aside className="lg:col-span-3 bg-white dark:bg-[#122127] rounded-3xl border border-stone-200 dark:border-[#1e3842] p-3 sm:p-4 shadow-xs space-y-2 transition-colors">
            <div className="px-2 py-1 text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              {t('admin_sections_nav', 'أقسام الإدارة')}
            </div>

            <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-1 lg:pb-0 scrollbar-none">
              {[
                { id: 'overview', labelKey: 'admin_tab_overview', defaultLabel: 'الإحصائيات العامة', icon: LayoutDashboard },
                { id: 'settings', labelKey: 'admin_tab_settings', defaultLabel: 'إعدادات الموقع والواجهة', icon: Sliders, permission: 'settings' },
                { id: 'broadcasts', labelKey: 'admin_tab_broadcasts', defaultLabel: 'الإذاعات الصباحية', icon: Radio, permission: 'broadcasts' },
                { id: 'lectures', labelKey: 'admin_tab_lectures', defaultLabel: 'المحاضرات التوعوية', icon: Video, permission: 'lectures' },
                { id: 'interviews', labelKey: 'admin_tab_interviews', defaultLabel: 'المقابلات الحوارية', icon: Mic, permission: 'interviews' },
                { id: 'quizzes', labelKey: 'admin_tab_quizzes', defaultLabel: 'الاستبانات والإحصائيات', icon: CheckSquare, permission: 'quizzes' },
                { id: 'events', labelKey: 'admin_tab_events', defaultLabel: 'الأنشطة والفعاليات', icon: Calendar, permission: 'events' },
                { id: 'registrations', labelKey: 'admin_tab_registrations', defaultLabel: 'روابط التسجيل', icon: ClipboardList, permission: 'registrations' },
                { id: 'supervisors', labelKey: 'admin_tab_supervisors', defaultLabel: 'المشرفون والصلاحيات', icon: Users, adminOnly: true },
                { id: 'inquiries', labelKey: 'admin_tab_inquiries', defaultLabel: 'رسائل واستفسارات الزوار', icon: Mail, adminOnly: true },
              ].map((tab: any) => {
                if (tab.adminOnly && !isAdmin) return null;
                if (tab.permission && !hasPermission(tab.permission)) return null;

                const Icon = tab.icon;
                const isActive = currentSection === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentSection(tab.id as AdminSection)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 lg:w-full cursor-pointer ${
                      isRtl ? 'text-right' : 'text-left'
                    } ${
                      isActive
                        ? `bg-[#134e5e] text-white shadow-xs ${isRtl ? 'border-r-4' : 'border-l-4'} border-[#2e9e66]`
                        : 'text-stone-700 dark:text-stone-300 hover:bg-[#eaf6fa]/60 dark:hover:bg-[#162a32] hover:text-[#0e3c48] dark:hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#84d2ea]' : 'text-stone-400'}`} />
                    <span className="truncate">{t(tab.labelKey, tab.defaultLabel)}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-[#1e3842] mt-4 px-2 space-y-2">
              <a
                href="https://amoal2030.github.io/Wellness-Guide-Blossoms/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-[#e8f7ee] dark:bg-[#0e2c22] text-[#1e784a] dark:text-[#42df98] border border-[#c4e9d2] dark:border-[#154636] hover:bg-[#d5f0e0] dark:hover:bg-[#133d2f] transition-all shadow-xs cursor-pointer group"
                title={isRtl ? 'فتح دليل المستخدم الشامل لمنصة عافية تُزهر' : 'Open Wellness Blossoms User Guide'}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#2e9e66] group-hover:scale-110 transition-transform shrink-0" />
                  <span className="truncate">{isRtl ? 'دليل المستخدم' : 'User Guide'}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 shrink-0" />
              </a>

              <button
                onClick={handleSeedData}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-stone-100 dark:bg-[#0b1519] hover:bg-stone-200 dark:hover:bg-[#162a32] text-stone-700 dark:text-stone-300 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer"
                title="تهيئة بيانات تجريبية حقيقية للمبادرة إذا كانت فارغة"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isRtl ? 'تهيئة بيانات المبادرة' : 'Seed Initial Data'}</span>
              </button>
            </div>
          </aside>

          {/* Section Main Canvas (9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* 1. OVERVIEW SECTION */}
            {currentSection === 'overview' && (
              <div className="space-y-6">
                
                {/* Stats Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-[#122127] p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-[#1e3842] shadow-xs transition-colors">
                    <span className="text-stone-500 dark:text-stone-400 text-xs font-medium block">{t('admin_metric_broadcasts', 'الإذاعات الصباحية')}</span>
                    <span className="text-2xl font-black text-stone-900 dark:text-white mt-1 block">{broadcasts.length}</span>
                  </div>

                  <div className="bg-white dark:bg-[#122127] p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-[#1e3842] shadow-xs transition-colors">
                    <span className="text-stone-500 dark:text-stone-400 text-xs font-medium block">{t('admin_metric_lectures', 'المحاضرات التوعوية')}</span>
                    <span className="text-2xl font-black text-stone-900 dark:text-white mt-1 block">{lectures.length}</span>
                  </div>

                  <div className="bg-white dark:bg-[#122127] p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-[#1e3842] shadow-xs transition-colors">
                    <span className="text-stone-500 dark:text-stone-400 text-xs font-medium block">{t('admin_metric_interviews', 'المقابلات الحوارية')}</span>
                    <span className="text-2xl font-black text-stone-900 dark:text-white mt-1 block">{interviews.length}</span>
                  </div>

                  <div className="bg-white dark:bg-[#122127] p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-[#1e3842] shadow-xs transition-colors">
                    <span className="text-stone-500 dark:text-stone-400 text-xs font-medium block">{t('admin_metric_quizzes', 'الاستبانات التفاعلية')}</span>
                    <span className="text-2xl font-black text-stone-900 dark:text-white mt-1 block">{quizzes.length}</span>
                  </div>

                  <div className="bg-white dark:bg-[#122127] p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-[#1e3842] shadow-xs transition-colors">
                    <span className="text-stone-500 dark:text-stone-400 text-xs font-medium block">{t('admin_metric_events', 'الأنشطة والفعاليات')}</span>
                    <span className="text-2xl font-black text-stone-900 dark:text-white mt-1 block">{events.length}</span>
                  </div>

                  <div className="bg-white dark:bg-[#122127] p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-[#1e3842] shadow-xs transition-colors">
                    <span className="text-stone-500 dark:text-stone-400 text-xs font-medium block">{t('admin_metric_registrations', 'برامج التسجيل')}</span>
                    <span className="text-2xl font-black text-stone-900 dark:text-white mt-1 block">{registrations.length}</span>
                  </div>

                  <div className="bg-white dark:bg-[#122127] p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-[#1e3842] shadow-xs transition-colors">
                    <span className="text-[#2e9e66] dark:text-[#42df98] text-xs font-bold block">{t('admin_metric_responses', 'استجابات الزوار للاستبانات')}</span>
                    <span className="text-2xl font-black text-[#134e5e] dark:text-[#84d2ea] mt-1 block">{quizResponses.length}</span>
                  </div>

                  <div className="bg-white dark:bg-[#122127] p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-[#1e3842] shadow-xs transition-colors">
                    <span className="text-teal-700 dark:text-teal-300 text-xs font-bold block">{t('admin_metric_inquiries', 'رسائل واستفسارات الزوار')}</span>
                    <span className="text-2xl font-black text-teal-800 dark:text-teal-200 mt-1 block">{inquiries.length}</span>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="bg-white dark:bg-[#122127] p-5 sm:p-7 rounded-3xl border border-stone-200 dark:border-[#1e3842] shadow-xs space-y-4 transition-colors">
                  <h3 className="text-base font-bold text-stone-900 dark:text-white">
                    {isRtl ? 'إجراءات سريعة' : 'Quick Actions'}
                  </h3>
                  <div className="flex flex-wrap gap-2.5 sm:gap-3">
                    {hasPermission('broadcasts') && (
                      <button
                        onClick={() => {
                          setEditingBroadcastId(null);
                          setBroadcastTitle('');
                          setBroadcastDescription('');
                          setBroadcastImageUrl('');
                          setBroadcastAudioUrl('');
                          setBroadcastVideoUrl('');
                          setIsBroadcastModalOpen(true);
                        }}
                        className="px-4 py-2.5 bg-[#2e9e66] hover:bg-[#238253] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t('admin_btn_add_broadcast', 'إضافة إذاعة صباحية')}</span>
                      </button>
                    )}

                    {hasPermission('lectures') && (
                      <button
                        onClick={() => {
                          setEditingLectureId(null);
                          setLectureTitle('');
                          setLectureSpeaker('');
                          setLectureDescription('');
                          setLectureImageUrl('');
                          setLectureVideoUrl('');
                          setIsLectureModalOpen(true);
                        }}
                        className="px-4 py-2.5 bg-[#2e9e66] hover:bg-[#238253] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t('admin_btn_add_lecture', 'إضافة محاضرة توعوية')}</span>
                      </button>
                    )}

                    {hasPermission('events') && (
                      <button
                        onClick={() => {
                          setEditingEventId(null);
                          setEventTitle('');
                          setEventDescription('');
                          setEventLocation('');
                          setEventImageUrl('');
                          setIsEventModalOpen(true);
                        }}
                        className="px-4 py-2.5 bg-[#2e9e66] hover:bg-[#238253] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t('admin_btn_add_event', 'إضافة نشاط أو فعالية')}</span>
                      </button>
                    )}

                    {hasPermission('quizzes') && (
                      <button
                        onClick={() => setIsQuizModalOpen(true)}
                        className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t('admin_btn_add_quiz', 'إنشاء استبانة جديدة')}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Recent Content Stream */}
                <div className="bg-white dark:bg-[#122127] p-5 sm:p-7 rounded-3xl border border-stone-200 dark:border-[#1e3842] shadow-xs space-y-4 transition-colors">
                  <h3 className="text-base font-bold text-stone-900 dark:text-white">
                    {isRtl ? 'أحدث المحتويات المضافة في قاعدة البيانات' : 'Recently Added Platform Content'}
                  </h3>
                  <div className="divide-y divide-stone-100 dark:divide-[#1e3842] text-xs">
                    {broadcasts.slice(0, 3).map((b) => (
                      <div key={b.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Radio className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="font-bold text-stone-800 dark:text-stone-200">{b.title}</span>
                          <span className="text-stone-400 dark:text-stone-500">({b.topic})</span>
                        </div>
                        <span className="text-stone-400 dark:text-stone-500 font-mono">{b.date}</span>
                      </div>
                    ))}
                    {lectures.slice(0, 2).map((l) => (
                      <div key={l.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                          <span className="font-bold text-stone-800 dark:text-stone-200">{l.title}</span>
                          <span className="text-stone-500 dark:text-stone-400">{l.speaker}</span>
                        </div>
                        <span className="text-stone-400 dark:text-stone-500 font-mono">{l.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 2. SETTINGS SECTION */}
            {currentSection === 'settings' && (
              <div className="bg-white dark:bg-[#122127] p-5 sm:p-8 rounded-3xl border border-stone-200 dark:border-[#1e3842] shadow-xs space-y-6 transition-colors">
                <div className="border-b border-stone-100 dark:border-[#1e3842] pb-4">
                  <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                    {t('settings_page_title', 'إدارة بيانات وهوية المبادرة')}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    {isRtl 
                      ? 'يمكنك تعديل اسم المبادرة، النبذة التعريفية، الرؤية، الرسالة، الأهداف والشعارات المشاركة لتظهر فوراً على الواجهة.' 
                      : 'Edit initiative identity, description, vision, mission, strategic goals, and logos to update live on the platform.'}
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} className={`space-y-4 text-xs ${isRtl ? 'text-right' : 'text-left'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                        {t('settings_initiative_name', 'اسم المبادرة')}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.initiativeName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, initiativeName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                        {t('settings_tagline', 'الشعار اللفظي (Tagline)')}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {t('settings_about_text', 'النبذة التعريفية عن المبادرة')}
                    </label>
                    <textarea
                      rows={4}
                      value={settingsForm.aboutText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                        {t('settings_vision_text', 'الرؤية')}
                      </label>
                      <textarea
                        rows={3}
                        value={settingsForm.visionText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, visionText: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                        {t('settings_mission_text', 'الرسالة')}
                      </label>
                      <textarea
                        rows={3}
                        value={settingsForm.missionText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, missionText: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Goals */}
                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {t('admin_goals_label', 'أهداف المبادرة (كل هدف في سطر)')}
                    </label>
                    <textarea
                      rows={5}
                      value={settingsForm.goals.join('\n')}
                      onChange={(e) => setSettingsForm({ ...settingsForm, goals: e.target.value.split('\n').filter(g => g.trim()) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                    />
                  </div>

                  {/* Initiative Official Logo */}
                  <div className="p-4 bg-[#eaf6fa]/60 dark:bg-[#0e2730] border border-[#84d2ea]/40 dark:border-[#1e3842] rounded-2xl space-y-3 transition-colors">
                    <h3 className="text-xs font-bold text-[#0e3c48] dark:text-[#84d2ea]">
                      {t('settings_initiative_logo', 'شعار مبادرة عافية تُزهر')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 bg-white dark:bg-[#122127] rounded-xl border border-stone-200 dark:border-[#1e3842]">
                        <img 
                          src={getAssetUrl(settingsForm.logoUrl || '/assets/aistudio/50c0c8c4-5c4f-4db5-8ada-405779c14cc1_db926d78.png')} 
                          alt="شعار المبادرة" 
                          className="w-20 h-20 object-contain rounded-lg"
                        />
                        <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-1">
                          {t('admin_logo_preview', 'معاينة الشعار')}
                        </span>
                      </div>
                      <div className="sm:col-span-9 space-y-2">
                        <label className="block font-bold text-stone-700 dark:text-stone-300">
                          {isRtl ? 'رابط الشعار الرسمي' : 'Official Logo URL'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.logoUrl}
                          onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                          placeholder="/assets/aistudio/50c0c8c4-5c4f-4db5-8ada-405779c14cc1_db926d78.png"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none dir-ltr text-start"
                        />
                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, logoUrl: '/assets/aistudio/50c0c8c4-5c4f-4db5-8ada-405779c14cc1_db926d78.png' })}
                          className="text-[11px] text-[#134e5e] dark:text-[#84d2ea] font-bold hover:underline cursor-pointer"
                        >
                          {t('admin_btn_restore_logo', 'استعادة الشعار الرسمي المعتمد')}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Official Partners (Only 2 authorized partners: Ministry of Education & Al-Shatee High School) */}
                  <div className="p-4 bg-stone-50 dark:bg-[#0b1519] border border-stone-200 dark:border-[#1e3842] rounded-2xl space-y-3 transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-[#0e3c48] dark:text-white">
                          {t('admin_partner_entities_title', 'الجهات المشاركة والداعمة للمبادرة (معتمدتان حصراً)')}
                        </h3>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          {t('admin_partner_entities_desc', 'وفق التوجيه الرسمي، يقتصر هذا القسم على وزارة التعليم ومدرسة ثانوية الشاطئ فقط.')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const defaultMoe = '/assets/logos/ministry_of_education.svg';
                          const defaultSchool = '/assets/logos/alshatee_high_school.svg';
                          setSettingsForm({
                            ...settingsForm,
                            moeLogoUrl: defaultMoe,
                            partnerLogos: [
                              {
                                id: 'partner-moe',
                                name: isRtl ? 'وزارة التعليم' : 'Ministry of Education',
                                imageUrl: defaultMoe,
                              },
                              {
                                id: 'partner-school',
                                name: isRtl ? 'مدرسة ثانوية الشاطئ' : 'Al-Shatee High School',
                                imageUrl: defaultSchool,
                              },
                            ]
                          });
                        }}
                        className="text-[11px] font-bold text-[#2e9e66] hover:underline cursor-pointer shrink-0"
                      >
                        {t('admin_btn_restore_logos', 'استعادة الشعارين الرسميين')}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Partner 1: Ministry of Education */}
                      <div className="p-3.5 bg-white dark:bg-[#122127] rounded-xl border border-stone-200 dark:border-[#1e3842] space-y-2">
                        <div className="flex items-center gap-3 pb-2 border-b border-stone-100 dark:border-[#1e3842]">
                          <div className="w-12 h-12 bg-white dark:bg-[#0b1519] rounded-lg border border-stone-100 dark:border-[#1e3842] p-1 flex items-center justify-center shrink-0">
                            <img
                              src={getAssetUrl(settingsForm.moeLogoUrl || settingsForm.partnerLogos?.[0]?.imageUrl || '/assets/logos/ministry_of_education.svg')}
                              alt="وزارة التعليم"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#2e9e66] block">
                              {t('admin_partner_first', 'الجهة الأولى (شاشة التحميل والترويسة)')}
                            </span>
                            <span className="text-xs font-bold text-stone-800 dark:text-white">
                              {settingsForm.partnerLogos?.[0]?.name || (isRtl ? 'وزارة التعليم' : 'Ministry of Education')}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                            {t('admin_partner_name', 'اسم الجهة')}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.partnerLogos?.[0]?.name || ''}
                            onChange={(e) => {
                              const newPartners = [...(settingsForm.partnerLogos || [])];
                              if (!newPartners[0]) {
                                newPartners[0] = { id: 'partner-moe', name: '', imageUrl: settingsForm.moeLogoUrl || '/assets/logos/ministry_of_education.svg' };
                              }
                              newPartners[0] = { ...newPartners[0], name: e.target.value };
                              setSettingsForm({ ...settingsForm, partnerLogos: newPartners });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                            {t('admin_partner_logo_path', 'مسار أو رابط الشعار')} ({isRtl ? 'شاشة التحميل' : 'Loading Screen'})
                          </label>
                          <input
                            type="text"
                            value={settingsForm.moeLogoUrl || settingsForm.partnerLogos?.[0]?.imageUrl || '/assets/logos/ministry_of_education.svg'}
                            onChange={(e) => {
                              const val = e.target.value;
                              const newPartners = [...(settingsForm.partnerLogos || [])];
                              if (!newPartners[0]) {
                                newPartners[0] = { id: 'partner-moe', name: 'وزارة التعليم', imageUrl: val };
                              } else {
                                newPartners[0] = { ...newPartners[0], imageUrl: val };
                              }
                              setSettingsForm({ ...settingsForm, moeLogoUrl: val, partnerLogos: newPartners });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none dir-ltr text-start"
                          />
                        </div>
                      </div>

                      {/* Partner 2: Al-Shatee High School */}
                      <div className="p-3.5 bg-white dark:bg-[#122127] rounded-xl border border-stone-200 dark:border-[#1e3842] space-y-2">
                        <div className="flex items-center gap-3 pb-2 border-b border-stone-100 dark:border-[#1e3842]">
                          <div className="w-12 h-12 bg-white dark:bg-[#0b1519] rounded-lg border border-stone-100 dark:border-[#1e3842] p-1 flex items-center justify-center shrink-0">
                            <img
                              src={getAssetUrl(settingsForm.partnerLogos?.[1]?.imageUrl || '/assets/logos/alshatee_high_school.svg')}
                              alt="مدرسة ثانوية الشاطئ"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#2e9e66] block">
                              {t('admin_partner_second', 'الجهة الثانية')}
                            </span>
                            <span className="text-xs font-bold text-stone-800 dark:text-white">
                              {settingsForm.partnerLogos?.[1]?.name || (isRtl ? 'مدرسة ثانوية الشاطئ' : 'Al-Shatee High School')}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                            {t('admin_partner_name', 'اسم الجهة')}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.partnerLogos?.[1]?.name || ''}
                            onChange={(e) => {
                              const newPartners = [...(settingsForm.partnerLogos || [])];
                              if (!newPartners[1]) {
                                newPartners[1] = { id: 'partner-school', name: '', imageUrl: '/assets/logos/alshatee_high_school.svg' };
                              }
                              newPartners[1] = { ...newPartners[1], name: e.target.value };
                              setSettingsForm({ ...settingsForm, partnerLogos: newPartners });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                            {t('admin_partner_logo_path', 'مسار أو رابط الشعار')}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.partnerLogos?.[1]?.imageUrl || '/assets/logos/alshatee_high_school.svg'}
                            onChange={(e) => {
                              const newPartners = [...(settingsForm.partnerLogos || [])];
                              if (!newPartners[1]) {
                                newPartners[1] = { id: 'partner-school', name: 'مدرسة ثانوية الشاطئ', imageUrl: '' };
                              }
                              newPartners[1] = { ...newPartners[1], imageUrl: e.target.value };
                              setSettingsForm({ ...settingsForm, partnerLogos: newPartners });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none dir-ltr text-start"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                        {t('settings_contact_email', 'البريد الإلكتروني للتواصل')}
                      </label>
                      <input
                        type="email"
                        value={settingsForm.contactEmail}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs dir-ltr text-start focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                        {t('settings_contact_phone', 'رقم الهاتف')}
                      </label>
                      <input
                        type="tel"
                        value={settingsForm.contactPhone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs dir-ltr text-start focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                        {t('settings_address', 'العنوان أو المقر')}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 dark:border-[#1e3842]">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{t('admin_btn_save', 'حفظ التعديلات في قاعدة البيانات')}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 3. BROADCASTS SECTION */}
            {currentSection === 'broadcasts' && (
              <div className="bg-white dark:bg-[#122127] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-[#1e3842] shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e3842] pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                      {t('admin_broadcasts_title', 'إدارة الإذاعات الصباحية')}
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {t('admin_broadcasts_desc', 'إضافة وتعديل وحذف الحلقات الإذاعية والروابط الصوتية والمرئية')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingBroadcastId(null);
                      setBroadcastTitle('');
                      setBroadcastDescription('');
                      setBroadcastTopic(language === 'ar' ? 'العادات الصباحية' : 'Morning Habits');
                      setBroadcastImageUrl('');
                      setBroadcastAudioUrl('');
                      setBroadcastVideoUrl('');
                      setIsBroadcastModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#2e9e66] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#238253] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('admin_btn_add_broadcast', 'إذاعة جديدة')}</span>
                  </button>
                </div>

                <div className="divide-y divide-stone-100 dark:divide-[#1e3842]">
                  {broadcasts.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-stone-400">
                          <span className="font-bold text-[#2e9e66]">{item.topic}</span>
                          <span>·</span>
                          <span>{item.date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-white">{item.title}</h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingBroadcastId(item.id);
                            setBroadcastTitle(item.title);
                            setBroadcastDescription(item.description);
                            setBroadcastDate(item.date);
                            setBroadcastTopic(item.topic);
                            setBroadcastImageUrl(item.imageUrl || '');
                            setBroadcastAudioUrl(item.audioUrl || '');
                            setBroadcastVideoUrl(item.videoUrl || '');
                            setIsBroadcastModalOpen(true);
                          }}
                          className="p-2 text-stone-600 dark:text-stone-300 hover:text-[#2e9e66] hover:bg-stone-100 dark:hover:bg-[#0b1519] rounded-lg transition-colors cursor-pointer"
                          title={t('admin_btn_edit', 'تعديل')}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteBroadcast(item.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title={t('admin_btn_delete', 'حذف')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. LECTURES SECTION */}
            {currentSection === 'lectures' && (
              <div className="bg-white dark:bg-[#122127] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-[#1e3842] shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e3842] pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                      {t('admin_lectures_title', 'إدارة المحاضرات التوعوية')}
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {t('admin_lectures_desc', 'إضافة المحاضرات وتحديد المتحدث والمدة وروابط الفيديو الخارجية')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingLectureId(null);
                      setLectureTitle('');
                      setLectureSpeaker('');
                      setLectureDescription('');
                      setLectureTopic(language === 'ar' ? 'الطب الوقائي' : 'Preventive Medicine');
                      setLectureImageUrl('');
                      setLectureVideoUrl('');
                      setIsLectureModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#2e9e66] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#238253] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('admin_btn_add_lecture', 'محاضرة جديدة')}</span>
                  </button>
                </div>

                <div className="divide-y divide-stone-100 dark:divide-[#1e3842]">
                  {lectures.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-stone-400">
                          <span className="font-bold text-teal-700 dark:text-teal-400">{item.topic}</span>
                          <span>·</span>
                          <span>{t('admin_speaker_prefix', 'المحاضر')}: {item.speaker}</span>
                          <span>·</span>
                          <span>{item.date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-white">{item.title}</h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingLectureId(item.id);
                            setLectureTitle(item.title);
                            setLectureSpeaker(item.speaker);
                            setLectureDescription(item.description);
                            setLectureDate(item.date);
                            setLectureDuration(item.duration || (language === 'ar' ? '40 دقيقة' : '40 mins'));
                            setLectureTopic(item.topic);
                            setLectureImageUrl(item.imageUrl || '');
                            setLectureVideoUrl(item.videoUrl || '');
                            setIsLectureModalOpen(true);
                          }}
                          className="p-2 text-stone-600 dark:text-stone-300 hover:text-[#2e9e66] hover:bg-stone-100 dark:hover:bg-[#0b1519] rounded-lg transition-colors cursor-pointer"
                          title={t('admin_btn_edit', 'تعديل')}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteLecture(item.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title={t('admin_btn_delete', 'حذف')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. INTERVIEWS SECTION */}
            {currentSection === 'interviews' && (
              <div className="bg-white dark:bg-[#122127] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-[#1e3842] shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e3842] pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                      {t('admin_interviews_title', 'إدارة المقابلات واللقاءات')}
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {t('admin_interviews_desc', 'توثيق لقاءات الخبراء وأصحاب التجارب مع روابط الفيديو')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingInterviewId(null);
                      setInterviewTitle('');
                      setInterviewGuestName('');
                      setInterviewGuestTitle('');
                      setInterviewDescription('');
                      setInterviewTopic(language === 'ar' ? 'الصحة واللياقة' : 'Health & Fitness');
                      setInterviewImageUrl('');
                      setInterviewVideoUrl('');
                      setIsInterviewModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#2e9e66] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#238253] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('admin_btn_add_interview', 'مقابلة جديدة')}</span>
                  </button>
                </div>

                <div className="divide-y divide-stone-100 dark:divide-[#1e3842]">
                  {interviews.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-stone-400">
                          <span className="font-bold text-[#2e9e66]">{item.topic}</span>
                          <span>·</span>
                          <span>{t('admin_guest_prefix', 'الضيف')}: {item.guestName} ({item.guestTitle})</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-white">{item.title}</h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingInterviewId(item.id);
                            setInterviewTitle(item.title);
                            setInterviewGuestName(item.guestName);
                            setInterviewGuestTitle(item.guestTitle);
                            setInterviewDescription(item.description);
                            setInterviewDate(item.date);
                            setInterviewTopic(item.topic);
                            setInterviewImageUrl(item.imageUrl || '');
                            setInterviewVideoUrl(item.videoUrl || '');
                            setIsInterviewModalOpen(true);
                          }}
                          className="p-2 text-stone-600 dark:text-stone-300 hover:text-[#2e9e66] hover:bg-stone-100 dark:hover:bg-[#0b1519] rounded-lg transition-colors cursor-pointer"
                          title={t('admin_btn_edit', 'تعديل')}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteInterview(item.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title={t('admin_btn_delete', 'حذف')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. QUIZZES AND STATS SECTION */}
            {currentSection === 'quizzes' && (
              <div className="space-y-8">
                {/* Quizzes Manager */}
                <div className="bg-white dark:bg-[#122127] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-[#1e3842] shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e3842] pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                        {t('admin_quizzes_title', 'إدارة استبانات واختبارات العادات')}
                      </h2>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {t('admin_quizzes_desc', 'إنشاء استبانات تفاعلية، تحديد الأسئلة والإجابة الصحية الصحيحة')}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsQuizModalOpen(true)}
                      className="px-4 py-2 bg-[#2e9e66] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#238253] transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t('admin_btn_add_quiz', 'استبانة جديدة')}</span>
                    </button>
                  </div>

                  <div className="divide-y divide-stone-100 dark:divide-[#1e3842]">
                    {quizzes.map((quiz) => (
                      <div key={quiz.id} className="py-4 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-[#2e9e66] font-bold block">{quiz.category}</span>
                          <h4 className="text-sm font-bold text-stone-900 dark:text-white">{quiz.title}</h4>
                          <span className="text-xs text-stone-400">
                            {quiz.questions.length} {t('admin_questions_count', 'أسئلة')}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title={t('admin_btn_delete', 'حذف الاستبانة')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visitor Responses Analytics (Supervisors & Admins only) */}
                <div className="bg-white dark:bg-[#122127] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-[#1e3842] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-[#2e9e66]" />
                        <span>{t('admin_quiz_stats_title', 'النتائج الإحصائية لإجابات الزوار المحفوظة (سري للمشرفين)')}</span>
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        {t('admin_quiz_total_responses', 'إجمالي الاستجابات المسجلة')}: {quizResponses.length} {t('admin_responses_suffix', 'استجابة')}
                      </p>
                    </div>
                  </div>

                  {quizResponses.length === 0 ? (
                    <p className="text-xs text-stone-400 dark:text-stone-500 py-6 text-center">
                      {t('admin_quiz_responses_empty', 'لم تُسجل إجابات زوار حتى الآن.')}
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-start">
                        <thead>
                          <tr className="border-b border-stone-200 dark:border-[#1e3842] text-stone-500 dark:text-stone-400 font-bold">
                            <th className="py-2.5 px-3 text-start">{t('admin_th_quiz', 'الاستبانة')}</th>
                            <th className="py-2.5 px-3 text-start">{t('admin_th_respondent', 'اسم الزائر')}</th>
                            <th className="py-2.5 px-3 text-start">{t('admin_th_score', 'النتيجة')}</th>
                            <th className="py-2.5 px-3 text-start">{t('admin_th_percentage', 'النسبة')}</th>
                            <th className="py-2.5 px-3 text-start">{t('admin_th_submitted_at', 'تاريخ الإرسال')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-[#1e3842]">
                          {quizResponses.map((res, idx) => (
                            <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-[#0b1519]/50 transition-colors">
                              <td className="py-2.5 px-3 font-semibold text-stone-800 dark:text-stone-200">{res.quizTitle}</td>
                              <td className="py-2.5 px-3 text-stone-600 dark:text-stone-400">{res.respondentName || t('admin_anonymous', 'مجهول')}</td>
                              <td className="py-2.5 px-3 font-mono font-bold text-stone-700 dark:text-stone-300">{res.score} / {res.totalQuestions}</td>
                              <td className="py-2.5 px-3 font-bold text-[#2e9e66]">{res.percentage}%</td>
                              <td className="py-2.5 px-3 text-stone-400 font-mono">
                                {new Date(res.submittedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 7. EVENTS SECTION */}
            {currentSection === 'events' && (
              <div className="bg-white dark:bg-[#122127] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-[#1e3842] shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e3842] pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                      {t('admin_events_title', 'إدارة الأنشطة والفعاليات')}
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {t('admin_events_desc', 'إضافة الفعاليات وتحديد حالتها (قادمة أو جارية أو سابقة) وتمييز الفعالية الأبرز')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingEventId(null);
                      setEventTitle('');
                      setEventDescription('');
                      setEventLocation('');
                      setEventImageUrl('');
                      setEventStatus('upcoming');
                      setEventIsFeatured(false);
                      setIsEventModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#2e9e66] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#238253] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('admin_btn_add_event', 'فعالية جديدة')}</span>
                  </button>
                </div>

                <div className="divide-y divide-stone-100 dark:divide-[#1e3842]">
                  {events.map((ev) => (
                    <div key={ev.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className={`font-bold px-2 py-0.5 rounded-md ${
                            ev.status === 'upcoming' ? 'bg-[#2e9e66]/15 text-[#134e5e] dark:text-[#84d2ea]' :
                            ev.status === 'ongoing' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}>
                            {ev.status === 'upcoming' ? t('admin_status_upcoming', 'قادمة') :
                             ev.status === 'ongoing' ? t('admin_status_ongoing', 'جارية') :
                             t('admin_status_completed', 'منتهية')}
                          </span>
                          {ev.isFeatured && (
                            <span className="bg-[#eaf6fa] dark:bg-[#134e5e]/40 text-[#0e3c48] dark:text-[#84d2ea] border border-[#84d2ea]/40 px-2 py-0.5 rounded-md font-bold">
                              {t('admin_status_featured', 'بارزة')}
                            </span>
                          )}
                          <span className="text-stone-400">{ev.date} · {ev.time}</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-white">{ev.title}</h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{ev.location}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingEventId(ev.id);
                            setEventTitle(ev.title);
                            setEventDescription(ev.description);
                            setEventDate(ev.date);
                            setEventTime(ev.time);
                            setEventLocation(ev.location);
                            setEventStatus(ev.status);
                            setEventImageUrl(ev.imageUrl || '');
                            setEventIsFeatured(ev.isFeatured);
                            setIsEventModalOpen(true);
                          }}
                          className="p-2 text-stone-600 dark:text-stone-300 hover:text-[#2e9e66] hover:bg-stone-100 dark:hover:bg-[#0b1519] rounded-lg transition-colors cursor-pointer"
                          title={t('admin_btn_edit', 'تعديل')}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title={t('admin_btn_delete', 'حذف')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. REGISTRATIONS SECTION */}
            {currentSection === 'registrations' && (
              <div className="bg-white dark:bg-[#122127] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-[#1e3842] shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e3842] pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                      {t('admin_registrations_title', 'إدارة روابط التسجيل في الأنشطة')}
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {t('admin_registrations_desc', 'إضافة نماذج وروابط التسجيل وتحديد موعد الإغلاق والحالة')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingRegId(null);
                      setRegTitle('');
                      setRegDescription('');
                      setRegExternalUrl('');
                      setRegStatus('open');
                      setRegImageUrl('');
                      setIsRegistrationModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#2e9e66] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#238253] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('admin_btn_add_reg', 'رابط تسجيل جديد')}</span>
                  </button>
                </div>

                <div className="divide-y divide-stone-100 dark:divide-[#1e3842]">
                  {registrations.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className={`font-bold px-2 py-0.5 rounded-md ${
                            item.status === 'open' ? 'bg-[#2e9e66]/15 text-[#134e5e] dark:text-[#84d2ea]' : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}>
                            {item.status === 'open' ? t('admin_status_open', 'مفتوح للتسجيل') : t('admin_status_closed', 'مغلق')}
                          </span>
                          <span className="text-stone-400">
                            {t('admin_deadline_prefix', 'آخر موعد')}: {item.deadline}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-white">{item.title}</h4>
                        <a 
                          href={item.externalUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[#2e9e66] hover:underline text-[11px] flex items-center gap-1 dir-ltr text-start"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{item.externalUrl}</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingRegId(item.id);
                            setRegTitle(item.title);
                            setRegDescription(item.description);
                            setRegExternalUrl(item.externalUrl);
                            setRegDeadline(item.deadline);
                            setRegStatus(item.status);
                            setRegImageUrl(item.imageUrl || '');
                            setIsRegistrationModalOpen(true);
                          }}
                          className="p-2 text-stone-600 dark:text-stone-300 hover:text-[#2e9e66] hover:bg-stone-100 dark:hover:bg-[#0b1519] rounded-lg transition-colors cursor-pointer"
                          title={t('admin_btn_edit', 'تعديل')}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteRegistration(item.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title={t('admin_btn_delete', 'حذف')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. SUPERVISORS & PERMISSIONS SECTION (Admin only) */}
            {currentSection === 'supervisors' && isAdmin && (
              <div className="bg-white dark:bg-[#122127] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-[#1e3842] shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e3842] pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                      {t('admin_supervisors_title', 'إدارة المشرفين والصلاحيات')}
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {t('admin_supervisors_desc', 'خاص بالمدير الرئيسي: إنشاء حسابات المشرفين وتحديد الصلاحيات الممنوحة لكل قسم')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setNewSupEmail('');
                      setNewSupName('');
                      setIsSupervisorModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#2e9e66] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#238253] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('admin_btn_add_sup', 'إضافة مشرف جديد')}</span>
                  </button>
                </div>

                {/* Notice for Admin */}
                <div className="p-4 bg-[#eaf6fa] dark:bg-[#0b1519]/70 border border-[#84d2ea]/60 dark:border-[#1e3842] rounded-2xl text-xs text-[#0e3c48] dark:text-[#84d2ea] space-y-1">
                  <p className="font-bold">{t('sup_super_banner', 'حساب المدير الرئيسي المعتمد بالنظام:')}</p>
                  <p className="font-mono text-[#134e5e] dark:text-emerald-400 font-semibold">{SUPER_ADMIN_EMAIL}</p>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1">
                    {t('sup_super_banner_note', 'المشرفون يمتلكون فقط الصلاحيات المحددة لهم أدناه ولا يمكنهم تعديل صلاحيات المدير الرئيسي.')}
                  </p>
                </div>

                <div className="divide-y divide-stone-100 dark:divide-[#1e3842]">
                  {supervisors
                    .filter((sup) => sup.email?.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase())
                    .map((sup) => {
                      const permissionLabels: Record<string, string> = {
                        broadcasts: t('admin_perm_broadcasts', 'الإذاعات'),
                        lectures: t('admin_perm_lectures', 'المحاضرات'),
                        interviews: t('admin_perm_interviews', 'المقابلات'),
                        quizzes: t('admin_perm_quizzes', 'الاستبانات'),
                        events: t('admin_perm_events', 'الفعاليات'),
                        registrations: t('admin_perm_registrations', 'التسجيل'),
                        settings: t('admin_perm_settings', 'الإعدادات'),
                        supervisors: t('admin_perm_supervisors', 'المشرفون'),
                      };
                      return (
                        <div key={sup.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-stone-900 dark:text-white">{sup.name}</h4>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                sup.role === 'admin' 
                                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300' 
                                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                              }`}>
                                {sup.role === 'admin' ? t('sup_role_admin', 'مدير') : t('sup_role_editor', 'مشرف')}
                              </span>
                            </div>
                            <span className="text-xs text-stone-500 dark:text-stone-400 font-mono block mt-0.5">{sup.email}</span>
                            
                            {/* Permissions pills */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {Object.entries(sup.permissions || {}).map(([key, val]) => (
                                val && (
                                  <span key={key} className="text-[10px] bg-stone-100 dark:bg-[#0b1519] text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded-md border border-stone-200 dark:border-[#1e3842]">
                                    {permissionLabels[key] || key}
                                  </span>
                                )
                              ))}
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5">
                            {sup.email !== SUPER_ADMIN_EMAIL && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditSupervisor(sup)}
                                  className="p-2 text-stone-500 hover:text-emerald-600 dark:text-stone-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
                                  title={t('sup_edit_modal_title', 'تعديل بيانات وصلاحيات المشرف')}
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSupervisor(sup.id)}
                                  className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                                  title={t('sup_delete_confirm_title', 'سحب الصلاحيات')}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}

                  {supervisors.filter((sup) => sup.email?.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()).length === 0 && (
                    <div className="py-8 text-center text-xs text-stone-400 dark:text-stone-500">
                      {t('sup_no_supervisors', 'لا يوجد مشرفون معتمدون إضافيون مسجلون حالياً. يمكنك إضافة مشرف بالضغط على زر «إضافة مشرف جديد».')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 10. INQUIRIES SECTION */}
            {currentSection === 'inquiries' && isAdmin && (
              <div className="bg-white dark:bg-[#122127] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-[#1e3842] shadow-xs space-y-6">
                <div className="border-b border-stone-100 dark:border-[#1e3842] pb-4">
                  <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                    {t('admin_inquiries_title', 'رسائل واستفسارات الزوار')}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {t('admin_inquiries_desc', 'متابعة الرسائل الواردة عبر نموذج تواصل معنا بالموقع')}
                  </p>
                </div>

                {inquiries.length === 0 ? (
                  <p className="text-xs text-stone-400 dark:text-stone-500 py-8 text-center">
                    {t('admin_inquiries_empty', 'لا توجد رسائل واردة جديدة.')}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className={`p-5 rounded-2xl border transition-all space-y-3 ${
                          inq.status === 'new' 
                            ? 'bg-[#eaf6fa]/40 dark:bg-[#0b1519] border-[#84d2ea]/60 dark:border-[#1e3842]' 
                            : 'bg-stone-50 dark:bg-[#0b1519]/40 border-stone-200 dark:border-[#1e3842]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-stone-900 dark:text-white">{inq.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              inq.status === 'new' ? 'bg-[#2e9e66] text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                            }`}>
                              {inq.status === 'new' ? t('admin_status_new', 'رسالة جديدة') : t('admin_status_replied', 'تم الرد')}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-400 font-mono">
                            {new Date(inq.submittedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                          </span>
                        </div>

                        <div className="text-xs text-stone-600 dark:text-stone-400 flex flex-wrap gap-4">
                          <span>{t('admin_inquiry_email_label', 'البريد:')} <strong className="font-mono text-stone-800 dark:text-stone-200">{inq.email}</strong></span>
                          {inq.phone && <span>{t('admin_inquiry_phone_label', 'الهاتف:')} <strong className="font-mono text-stone-800 dark:text-stone-200">{inq.phone}</strong></span>}
                        </div>

                        <p className="text-xs text-stone-800 dark:text-stone-200 bg-white dark:bg-[#122127] p-3 rounded-xl border border-stone-200 dark:border-[#1e3842] leading-relaxed whitespace-pre-line">
                          {inq.message}
                        </p>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => inq.id && handleToggleInquiryStatus(inq.id, inq.status)}
                            className="px-3 py-1 bg-white dark:bg-[#122127] hover:bg-stone-100 dark:hover:bg-[#0b1519] border border-stone-200 dark:border-[#1e3842] text-xs font-semibold rounded-lg text-stone-700 dark:text-stone-300 cursor-pointer"
                          >
                            {inq.status === 'new' ? t('admin_inquiry_mark_replied', 'تحديد كـ "تم الرد"') : t('admin_inquiry_mark_new', 'تحديد كـ "رسالة جديدة"')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ===================== MODALS FOR ADD / EDIT ===================== */}

      {/* 1. Broadcast Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#122127] rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-[#1e3842] space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e3842] pb-3">
              <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                {editingBroadcastId ? t('admin_modal_edit_broadcast', 'تعديل الإذاعة الصباحية') : t('admin_modal_add_broadcast', 'إضافة إذاعة صباحية جديدة')}
              </h3>
              <button onClick={() => setIsBroadcastModalOpen(false)} className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_title', 'عنوان الإذاعة')}
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: إشراقة الصباح والنشاط اليومي' : 'e.g. Morning Vitality and Daily Habits'}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_field_topic', 'الموضوع / التصنيف')}
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastTopic}
                    onChange={(e) => setBroadcastTopic(e.target.value)}
                    placeholder={language === 'ar' ? 'العادات الصباحية' : 'Morning Habits'}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_field_date', 'تاريخ البث')}
                  </label>
                  <input
                    type="date"
                    required
                    value={broadcastDate}
                    onChange={(e) => setBroadcastDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_desc', 'وصف الإذاعة')}
                </label>
                <textarea
                  rows={3}
                  required
                  value={broadcastDescription}
                  onChange={(e) => setBroadcastDescription(e.target.value)}
                  placeholder={language === 'ar' ? 'وصف مختصر للحلقة الإذاعية ومحاورها...' : 'Brief summary of the broadcast episode...'}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_image_url', 'رابط الصورة الخارجية (Direct URL)')}
                </label>
                <input
                  type="url"
                  value={broadcastImageUrl}
                  onChange={(e) => setBroadcastImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs dir-ltr text-start focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_field_audio_url', 'رابط الملف الصوتي (MP3)')}
                  </label>
                  <input
                    type="url"
                    value={broadcastAudioUrl}
                    onChange={(e) => setBroadcastAudioUrl(e.target.value)}
                    placeholder="https://.../audio.mp3"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs dir-ltr text-start focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_field_video_url', 'رابط الفيديو (YouTube)')}
                  </label>
                  <input
                    type="url"
                    value={broadcastVideoUrl}
                    onChange={(e) => setBroadcastVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs dir-ltr text-start focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100 dark:border-[#1e3842]">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl cursor-pointer"
                >
                  {t('admin_btn_cancel', 'إلغاء')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  {t('admin_btn_save', 'حفظ الإذاعة')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Lecture Modal */}
      {isLectureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#122127] rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-[#1e3842] space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e3842] pb-3">
              <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                {editingLectureId ? t('admin_modal_edit_lecture', 'تعديل المحاضرة التوعوية') : t('admin_modal_add_lecture', 'إضافة محاضرة توعوية جديدة')}
              </h3>
              <button onClick={() => setIsLectureModalOpen(false)} className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLecture} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_title', 'عنوان المحاضرة')}
                </label>
                <input
                  type="text"
                  required
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_field_speaker', 'اسم المحاضر / المتحدث')}
                  </label>
                  <input
                    type="text"
                    required
                    value={lectureSpeaker}
                    onChange={(e) => setLectureSpeaker(e.target.value)}
                    placeholder={language === 'ar' ? 'د. فلان الفلاني' : 'Dr. Jane Doe'}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_field_topic', 'التصنيف / الموضوع')}
                  </label>
                  <input
                    type="text"
                    required
                    value={lectureTopic}
                    onChange={(e) => setLectureTopic(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_field_date', 'تاريخ المحاضرة')}
                  </label>
                  <input
                    type="date"
                    required
                    value={lectureDate}
                    onChange={(e) => setLectureDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_field_duration', 'المدة التقديرية')}
                  </label>
                  <input
                    type="text"
                    value={lectureDuration}
                    onChange={(e) => setLectureDuration(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: 45 دقيقة' : 'e.g. 45 mins'}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_desc', 'وصف المحاضرة')}
                </label>
                <textarea
                  rows={3}
                  required
                  value={lectureDescription}
                  onChange={(e) => setLectureDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_video_url', 'رابط فيديو المحاضرة (YouTube)')}
                </label>
                <input
                  type="url"
                  value={lectureVideoUrl}
                  onChange={(e) => setLectureVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs dir-ltr text-start focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_image_url', 'رابط الصورة المصغرة')}
                </label>
                <input
                  type="url"
                  value={lectureImageUrl}
                  onChange={(e) => setLectureImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs dir-ltr text-start focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100 dark:border-[#1e3842]">
                <button
                  type="button"
                  onClick={() => setIsLectureModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl cursor-pointer"
                >
                  {t('admin_btn_cancel', 'إلغاء')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  {t('admin_btn_save', 'حفظ المحاضرة')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Interview Modal */}
      {isInterviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#122127] rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-[#1e3842] space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e3842] pb-3">
              <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                {editingInterviewId ? t('admin_modal_edit_interview', 'تعديل المقابلة') : t('admin_modal_add_interview', 'إضافة مقابلة حوارية جديدة')}
              </h3>
              <button onClick={() => setIsInterviewModalOpen(false)} className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInterview} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_title', 'عنوان المقابلة')}
                </label>
                <input
                  type="text"
                  required
                  value={interviewTitle}
                  onChange={(e) => setInterviewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_field_guest_name', 'اسم الضيف')}
                  </label>
                  <input
                    type="text"
                    required
                    value={interviewGuestName}
                    onChange={(e) => setInterviewGuestName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_field_guest_title', 'صفة أو منصب الضيف')}
                  </label>
                  <input
                    type="text"
                    required
                    value={interviewGuestTitle}
                    onChange={(e) => setInterviewGuestTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_field_topic', 'التصنيف / الموضوع')}
                  </label>
                  <input
                    type="text"
                    required
                    value={interviewTopic}
                    onChange={(e) => setInterviewTopic(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_field_date', 'تاريخ المقابلة')}
                  </label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_desc', 'وصف المقابلة')}
                </label>
                <textarea
                  rows={3}
                  required
                  value={interviewDescription}
                  onChange={(e) => setInterviewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_video_url', 'رابط الفيديو (YouTube)')}
                </label>
                <input
                  type="url"
                  value={interviewVideoUrl}
                  onChange={(e) => setInterviewVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs dir-ltr text-start focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_image_url', 'رابط صورة الضيف أو اللقاء')}
                </label>
                <input
                  type="url"
                  value={interviewImageUrl}
                  onChange={(e) => setInterviewImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs dir-ltr text-start focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100 dark:border-[#1e3842]">
                <button
                  type="button"
                  onClick={() => setIsInterviewModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl cursor-pointer"
                >
                  {t('admin_btn_cancel', 'إلغاء')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  {t('admin_btn_save', 'حفظ المقابلة')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#122127] rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-[#1e3842] space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e3842] pb-3">
              <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                {editingEventId ? t('admin_modal_edit_event', 'تعديل الفعالية') : t('admin_modal_add_event', 'إضافة نشاط أو فعالية جديدة')}
              </h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_title', 'عنوان الفعالية')}
                </label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_field_date', 'التاريخ')}
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_field_time', 'الوقت')}
                  </label>
                  <input
                    type="text"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder={language === 'ar' ? '04:00 م - 08:00 م' : '04:00 PM - 08:00 PM'}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_location', 'الموقع أو المقر')}
                </label>
                <input
                  type="text"
                  required
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder={language === 'ar' ? 'الرياض - مسرح المدرسة' : 'School Auditorium'}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_field_event_status', 'حالة الفعالية')}
                  </label>
                  <select
                    value={eventStatus}
                    onChange={(e: any) => setEventStatus(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  >
                    <option value="upcoming">{t('admin_status_upcoming', 'قادمة')}</option>
                    <option value="ongoing">{t('admin_status_ongoing', 'جارية الآن')}</option>
                    <option value="completed">{t('admin_status_completed', 'منتهية')}</option>
                  </select>
                </div>

                <div className="flex items-center pt-2 sm:pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700 dark:text-stone-300">
                    <input
                      type="checkbox"
                      checked={eventIsFeatured}
                      onChange={(e) => setEventIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>{t('admin_field_featured_checkbox', 'تمييز كفعالية بارزة في الرئيسية')}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_desc', 'وصف الفعالية')}
                </label>
                <textarea
                  rows={3}
                  required
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_image_url', 'رابط صورة الفعالية')}
                </label>
                <input
                  type="url"
                  value={eventImageUrl}
                  onChange={(e) => setEventImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs dir-ltr text-start focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100 dark:border-[#1e3842]">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl cursor-pointer"
                >
                  {t('admin_btn_cancel', 'إلغاء')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  {t('admin_btn_save', 'حفظ الفعالية')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Registration Modal */}
      {isRegistrationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#122127] rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-[#1e3842] space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e3842] pb-3">
              <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                {editingRegId ? t('admin_modal_edit_reg', 'تعديل نشاط التسجيل') : t('admin_modal_add_reg', 'إضافة نشاط للتسجيل')}
              </h3>
              <button onClick={() => setIsRegistrationModalOpen(false)} className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRegistration} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_title', 'عنوان النشاط')}
                </label>
                <input
                  type="text"
                  required
                  value={regTitle}
                  onChange={(e) => setRegTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_reg_url', 'رابط التسجيل الخارجي (Google Form / نموذج التسجيل)')}
                </label>
                <input
                  type="url"
                  required
                  value={regExternalUrl}
                  onChange={(e) => setRegExternalUrl(e.target.value)}
                  placeholder="https://forms.gle/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs dir-ltr text-start focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_deadline_prefix', 'آخر موعد للتسجيل')}
                  </label>
                  <input
                    type="date"
                    required
                    value={regDeadline}
                    onChange={(e) => setRegDeadline(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_field_reg_status', 'حالة التسجيل')}
                  </label>
                  <select
                    value={regStatus}
                    onChange={(e: any) => setRegStatus(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  >
                    <option value="open">{t('admin_status_open', 'مفتوح')}</option>
                    <option value="closed">{t('admin_status_closed', 'مغلق')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_reg_requirements', 'وصف شروط ومتطلبات التسجيل')}
                </label>
                <textarea
                  rows={3}
                  required
                  value={regDescription}
                  onChange={(e) => setRegDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_field_image_url', 'رابط صورة النشاط (Direct URL)')}
                </label>
                <input
                  type="url"
                  value={regImageUrl}
                  onChange={(e) => setRegImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs dir-ltr text-start focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100 dark:border-[#1e3842]">
                <button
                  type="button"
                  onClick={() => setIsRegistrationModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl cursor-pointer"
                >
                  {t('admin_btn_cancel', 'إلغاء')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  {t('admin_btn_save', 'حفظ النشاط')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Quiz Modal with Dynamic Questions Builder */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#122127] rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-[#1e3842] space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e3842] pb-3">
              <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                {t('admin_quiz_builder_title', 'إنشاء استبانة / اختبار عادات جديد')}
              </h3>
              <button onClick={() => setIsQuizModalOpen(false)} className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_quiz_field_title', 'عنوان الاستبانة')}
                  </label>
                  <input
                    type="text"
                    required
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder={language === 'ar' ? 'مقياس العادات الصحية...' : 'Health Habits Assessment...'}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('admin_quiz_field_category', 'التصنيف')}
                  </label>
                  <input
                    type="text"
                    required
                    value={quizCategory}
                    onChange={(e) => setQuizCategory(e.target.value)}
                    placeholder={language === 'ar' ? 'نمط الحياة / التغذية...' : 'Lifestyle / Nutrition...'}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('admin_quiz_field_desc', 'وصف الاستبانة للزائر')}
                </label>
                <textarea
                  rows={2}
                  required
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              {/* Questions Builder */}
              <div className="space-y-4 pt-2 border-t border-stone-100 dark:border-[#1e3842]">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 dark:text-white">
                    {t('admin_quiz_questions_title', 'أسئلة الاستبانة')} ({quizQuestions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizQuestions([
                        ...quizQuestions,
                        {
                          id: `q${quizQuestions.length + 1}`,
                          questionText: '',
                          type: 'multiple_choice',
                          options: language === 'ar' ? ['خيار 1', 'خيار 2', 'خيار 3', 'خيار 4'] : ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                          correctAnswerIndex: 0,
                          explanation: ''
                        }
                      ]);
                    }}
                    className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-lg font-bold flex items-center gap-1 hover:bg-emerald-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t('admin_quiz_btn_add_q', 'إضافة سؤال')}</span>
                  </button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {quizQuestions.map((q, qIndex) => (
                    <div key={q.id} className="p-4 bg-stone-50 dark:bg-[#0b1519]/70 rounded-2xl border border-stone-200 dark:border-[#1e3842] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-700 dark:text-stone-300">
                          {t('admin_quiz_question_num', 'السؤال')} #{qIndex + 1}
                        </span>
                        {quizQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setQuizQuestions(quizQuestions.filter((_, idx) => idx !== qIndex));
                            }}
                            className="text-rose-600 hover:text-rose-800 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        required
                        placeholder={language === 'ar' ? 'نص السؤال...' : 'Question prompt...'}
                        value={q.questionText}
                        onChange={(e) => {
                          const updated = [...quizQuestions];
                          updated[qIndex].questionText = e.target.value;
                          setQuizQuestions(updated);
                        }}
                        className="w-full px-3.5 py-1.5 bg-white dark:bg-[#122127] rounded-xl border border-stone-300 dark:border-[#1e3842] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-stone-500 dark:text-stone-400 font-bold mb-1">
                            {t('admin_quiz_q_type', 'نوع السؤال')}
                          </label>
                          <select
                            value={q.type}
                            onChange={(e: any) => {
                              const updated = [...quizQuestions];
                              const newType = e.target.value;
                              updated[qIndex].type = newType;
                              if (newType === 'true_false') {
                                updated[qIndex].options = language === 'ar' ? ['صح', 'خطأ'] : ['True', 'False'];
                                updated[qIndex].correctAnswerIndex = 0;
                              } else {
                                updated[qIndex].options = language === 'ar' 
                                  ? ['خيار 1', 'خيار 2', 'خيار 3', 'خيار 4'] 
                                  : ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
                                updated[qIndex].correctAnswerIndex = 0;
                              }
                              setQuizQuestions(updated);
                            }}
                            className="w-full px-2 py-1 bg-white dark:bg-[#122127] rounded-lg border border-stone-300 dark:border-[#1e3842] dark:text-white text-xs focus:outline-none"
                          >
                            <option value="multiple_choice">{t('admin_quiz_type_mcq', 'اختيار من متعدد')}</option>
                            <option value="true_false">{t('admin_quiz_type_tf', 'صح أو خطأ')}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-stone-500 dark:text-stone-400 font-bold mb-1">
                            {t('admin_quiz_correct_answer', 'الإجابة الصحية الصحيحة')}
                          </label>
                          <select
                            value={q.correctAnswerIndex}
                            onChange={(e) => {
                              const updated = [...quizQuestions];
                              updated[qIndex].correctAnswerIndex = Number(e.target.value);
                              setQuizQuestions(updated);
                            }}
                            className="w-full px-2 py-1 bg-white dark:bg-[#122127] rounded-lg border border-stone-300 dark:border-[#1e3842] dark:text-white text-xs focus:outline-none"
                          >
                            {q.options.map((opt, oIdx) => (
                              <option key={oIdx} value={oIdx}>
                                {t('admin_quiz_option_num', 'الخيار')} #{oIdx + 1}: {opt.slice(0, 20)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Options inputs */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-stone-500 dark:text-stone-400 font-bold">
                          {t('admin_quiz_available_options', 'الخيارات المتاحة للزائر:')}
                        </label>
                        {q.options.map((opt, optIndex) => (
                          <input
                            key={optIndex}
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => {
                              const updated = [...quizQuestions];
                              updated[qIndex].options[optIndex] = e.target.value;
                              setQuizQuestions(updated);
                            }}
                            placeholder={`${t('admin_quiz_option_num', 'الخيار')} ${optIndex + 1}`}
                            className="w-full px-3 py-1 bg-white dark:bg-[#122127] rounded-lg border border-stone-200 dark:border-[#1e3842] dark:text-white text-xs focus:outline-none"
                          />
                        ))}
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder={t('admin_quiz_explanation', 'تفسير أو معلومة صحية تظهر للزائر بعد الإجابة (اختياري)...')}
                          value={q.explanation || ''}
                          onChange={(e) => {
                            const updated = [...quizQuestions];
                            updated[qIndex].explanation = e.target.value;
                            setQuizQuestions(updated);
                          }}
                          className="w-full px-3 py-1 bg-white dark:bg-[#122127] rounded-lg border border-stone-200 dark:border-[#1e3842] dark:text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100 dark:border-[#1e3842]">
                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl cursor-pointer"
                >
                  {t('admin_btn_cancel', 'إلغاء')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  {t('admin_quiz_btn_save', 'حفظ الاستبانة والأسئلة')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Supervisor Modal (Admin only) */}
      {isSupervisorModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-md bg-white dark:bg-[#122127] rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-[#1e3842] space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e3842] pb-3">
              <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                {t('admin_sup_modal_add_title', 'تسجيل مشرف وتحديد صلاحياته')}
              </h3>
              <button onClick={() => setIsSupervisorModalOpen(false)} className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupervisor} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('sup_email_label', 'البريد الإلكتروني المعتمد (Google)')}
                </label>
                <input
                  type="email"
                  required
                  value={newSupEmail}
                  onChange={(e) => setNewSupEmail(e.target.value)}
                  placeholder="supervisor@gmail.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs dir-ltr text-start focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('sup_name_label', 'اسم المشرف')}
                </label>
                <input
                  type="text"
                  required
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  placeholder={language === 'ar' ? 'أ. عبد الله السالم' : 'Mr. Abdullah'}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('sup_role_label', 'الرتبة')}
                </label>
                <select
                  value={newSupRole}
                  onChange={(e: any) => setNewSupRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                >
                  <option value="editor">{t('sup_role_editor', 'مشرف محتوى (صلاحيات مخصصة)')}</option>
                  <option value="admin">{t('sup_role_admin', 'مدير إداري (صلاحيات كاملة)')}</option>
                </select>
              </div>

              {/* Granular Permissions Checkboxes */}
              {newSupRole === 'editor' && (
                <div className="p-3 bg-stone-50 dark:bg-[#0b1519]/70 rounded-2xl border border-stone-200 dark:border-[#1e3842] space-y-2">
                  <span className="font-bold text-stone-800 dark:text-stone-200 block text-[11px]">
                    {t('admin_sup_granted_perms', 'الصلاحيات الممنوحة للمشرف:')}
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-stone-700 dark:text-stone-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSupPermissions.broadcasts}
                        onChange={(e) => setNewSupPermissions({ ...newSupPermissions, broadcasts: e.target.checked })}
                        className="rounded text-[#2e9e66] focus:ring-[#2e9e66]"
                      />
                      <span>{t('admin_perm_broadcasts', 'الإذاعات الصباحية')}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSupPermissions.lectures}
                        onChange={(e) => setNewSupPermissions({ ...newSupPermissions, lectures: e.target.checked })}
                        className="rounded text-[#2e9e66] focus:ring-[#2e9e66]"
                      />
                      <span>{t('admin_perm_lectures', 'المحاضرات التوعوية')}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSupPermissions.interviews}
                        onChange={(e) => setNewSupPermissions({ ...newSupPermissions, interviews: e.target.checked })}
                        className="rounded text-[#2e9e66] focus:ring-[#2e9e66]"
                      />
                      <span>{t('admin_perm_interviews', 'المقابلات الحوارية')}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSupPermissions.quizzes}
                        onChange={(e) => setNewSupPermissions({ ...newSupPermissions, quizzes: e.target.checked })}
                        className="rounded text-[#2e9e66] focus:ring-[#2e9e66]"
                      />
                      <span>{t('admin_perm_quizzes', 'الاستبانات والإحصائيات')}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSupPermissions.events}
                        onChange={(e) => setNewSupPermissions({ ...newSupPermissions, events: e.target.checked })}
                        className="rounded text-[#2e9e66] focus:ring-[#2e9e66]"
                      />
                      <span>{t('admin_perm_events', 'الأنشطة والفعاليات')}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSupPermissions.registrations}
                        onChange={(e) => setNewSupPermissions({ ...newSupPermissions, registrations: e.target.checked })}
                        className="rounded text-[#2e9e66] focus:ring-[#2e9e66]"
                      />
                      <span>{t('admin_perm_registrations', 'روابط التسجيل')}</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100 dark:border-[#1e3842]">
                <button
                  type="button"
                  onClick={() => setIsSupervisorModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl cursor-pointer"
                >
                  {t('admin_btn_cancel', 'إلغاء')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  {t('admin_btn_save', 'حفظ المشرف')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Edit Supervisor Modal (Admin only) */}
      {isEditSupervisorModalOpen && editingSupervisor && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-md bg-white dark:bg-[#122127] rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-[#1e3842] space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e3842] pb-3">
              <div>
                <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                  {t('admin_sup_modal_edit_title', 'تعديل بيانات المشرف والصلاحيات')}
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {t('admin_sup_modal_edit_desc', 'تحديث الاسم والرتبة وصلاحيات الوصول للأقسام')}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setIsEditSupervisorModalOpen(false);
                  setEditingSupervisor(null);
                }} 
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedSupervisor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('sup_email_label', 'البريد الإلكتروني المعتمد')}
                </label>
                <input
                  type="email"
                  disabled
                  value={editingSupervisor.email}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-[#1e3842] bg-stone-100 dark:bg-[#0b1519] text-stone-500 dark:text-stone-400 text-xs font-mono dir-ltr text-start cursor-not-allowed"
                />
                <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5 block">
                  {t('admin_sup_field_email_help', 'البريد الإلكتروني مرتبط بحساب Google المعتمد للمشرف.')}
                </span>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('sup_name_label', 'اسم المشرف')}
                </label>
                <input
                  type="text"
                  required
                  value={editingSupervisor.name}
                  onChange={(e) => setEditingSupervisor({ ...editingSupervisor, name: e.target.value })}
                  placeholder={t('sup_name_label', 'اسم المشرف')}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('sup_role_label', 'الرتبة')}
                </label>
                <select
                  value={editingSupervisor.role}
                  onChange={(e) => setEditingSupervisor({ ...editingSupervisor, role: e.target.value as 'admin' | 'editor' })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                >
                  <option value="editor">{t('sup_role_editor', 'مشرف محتوى (صلاحيات مخصصة للأقسام)')}</option>
                  <option value="admin">{t('sup_role_admin', 'مدير إداري (صلاحيات كاملة لكافة الأقسام)')}</option>
                </select>
              </div>

              {/* Granular Permissions Checkboxes */}
              {editingSupervisor.role === 'editor' && (
                <div className="p-3.5 bg-stone-50 dark:bg-[#0b1519]/70 rounded-2xl border border-stone-200 dark:border-[#1e3842] space-y-2.5">
                  <span className="font-bold text-stone-800 dark:text-stone-200 block text-[11px]">
                    {t('admin_sup_granted_perms', 'الأقسام المصرّح للمشرف إدارتها:')}
                  </span>
                  <div className="grid grid-cols-2 gap-2.5 text-stone-700 dark:text-stone-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingSupervisor.permissions?.broadcasts ?? true}
                        onChange={(e) => setEditingSupervisor({
                          ...editingSupervisor,
                          permissions: { ...editingSupervisor.permissions, broadcasts: e.target.checked }
                        })}
                        className="rounded text-[#2e9e66] focus:ring-[#2e9e66]"
                      />
                      <span>{t('admin_perm_broadcasts', 'الإذاعات الصباحية')}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingSupervisor.permissions?.lectures ?? true}
                        onChange={(e) => setEditingSupervisor({
                          ...editingSupervisor,
                          permissions: { ...editingSupervisor.permissions, lectures: e.target.checked }
                        })}
                        className="rounded text-[#2e9e66] focus:ring-[#2e9e66]"
                      />
                      <span>{t('admin_perm_lectures', 'المحاضرات التوعوية')}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingSupervisor.permissions?.interviews ?? true}
                        onChange={(e) => setEditingSupervisor({
                          ...editingSupervisor,
                          permissions: { ...editingSupervisor.permissions, interviews: e.target.checked }
                        })}
                        className="rounded text-[#2e9e66] focus:ring-[#2e9e66]"
                      />
                      <span>{t('admin_perm_interviews', 'المقابلات الحوارية')}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingSupervisor.permissions?.quizzes ?? true}
                        onChange={(e) => setEditingSupervisor({
                          ...editingSupervisor,
                          permissions: { ...editingSupervisor.permissions, quizzes: e.target.checked }
                        })}
                        className="rounded text-[#2e9e66] focus:ring-[#2e9e66]"
                      />
                      <span>{t('admin_perm_quizzes', 'الاستبانات والإحصائيات')}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingSupervisor.permissions?.events ?? true}
                        onChange={(e) => setEditingSupervisor({
                          ...editingSupervisor,
                          permissions: { ...editingSupervisor.permissions, events: e.target.checked }
                        })}
                        className="rounded text-[#2e9e66] focus:ring-[#2e9e66]"
                      />
                      <span>{t('admin_perm_events', 'الأنشطة والفعاليات')}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingSupervisor.permissions?.registrations ?? true}
                        onChange={(e) => setEditingSupervisor({
                          ...editingSupervisor,
                          permissions: { ...editingSupervisor.permissions, registrations: e.target.checked }
                        })}
                        className="rounded text-[#2e9e66] focus:ring-[#2e9e66]"
                      />
                      <span>{t('admin_perm_registrations', 'روابط التسجيل')}</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100 dark:border-[#1e3842]">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditSupervisorModalOpen(false);
                    setEditingSupervisor(null);
                  }}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl cursor-pointer"
                >
                  {t('admin_btn_cancel', 'إلغاء')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  {t('admin_btn_save', 'حفظ التعديلات')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-app Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-sm bg-white dark:bg-[#122127] rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-[#1e3842] text-center space-y-4 my-auto">
            <h3 className="text-base font-bold text-stone-900 dark:text-white">{confirmDialog.title}</h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                {t('admin_btn_cancel', 'إلغاء')}
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = confirmDialog.onConfirm;
                  setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                  action();
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
              >
                {t('admin_btn_confirm', 'تأكيد')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
