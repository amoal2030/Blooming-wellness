import React, { useState, useEffect } from 'react';
import { useAuth, SUPER_ADMIN_EMAIL } from '../../context/AuthContext';
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
  X
} from 'lucide-react';

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
  const { currentUser, isSuperAdmin, isAdmin, supervisorProfile, hasPermission, logout } = useAuth();
  const [currentSection, setCurrentSection] = useState<AdminSection>('overview');

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
      if (currentSection === 'quizzes' || currentSection === 'overview') {
        const res = await getQuizResponses();
        setQuizResponses(res);
      }
      if (currentSection === 'supervisors' && isAdmin) {
        const sups = await getSupervisors();
        setSupervisors(sups);
      }
      if (currentSection === 'inquiries' || currentSection === 'overview') {
        const inqs = await getInquiries();
        setInquiries(inqs);
      }
    } catch (e) {
      console.warn('Error loading secondary admin data:', e);
    } finally {
      setLoadingData(false);
    }
  };

  // ================= Form States for Modals & Creation =================
  // Settings Form
  const [settingsForm, setSettingsForm] = useState<InitiativeSettings>(settings);

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
      title: 'تهيئة البيانات الأولية',
      message: 'هل تريد تهيئة البيانات الأولية الافتراضية للمبادرة؟',
      onConfirm: async () => {
        try {
          const success = await seedInitialContentIfEmpty();
          if (success) {
            showNotification('تمت تهيئة محتويات المبادرة بنجاح!');
            setTimeout(() => window.location.reload(), 1500);
          } else {
            showNotification('البيانات موجودة بالفعل مسبقاً.');
          }
        } catch (e) {
          showNotification('تعذر استكمال التهيئة.', true);
        }
      }
    });
  };

  // ================= CRUD Handlers =================
  // 1. Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('settings')) {
      showNotification('ليس لديك صلاحية لتعديل إعدادات الموقع.', true);
      return;
    }
    try {
      await saveInitiativeSettings(settingsForm);
      setSettings(settingsForm);
      showNotification('تم حفظ إعدادات المبادرة وبيانات الصفحة الرئيسية بنجاح!');
    } catch (e) {
      showNotification('حدث خطأ أثناء حفظ الإعدادات.', true);
    }
  };

  // 2. Broadcast Save
  const handleSaveBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('broadcasts')) {
      showNotification('ليس لديك صلاحية لإدارة الإذاعات الصباحية.', true);
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
        showNotification('تم تعديل الإذاعة الصباحية بنجاح!');
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
        showNotification('تم إضافة الإذاعة الصباحية بنجاح!');
      }
      setIsBroadcastModalOpen(false);
    } catch (e) {
      showNotification('فشلت العملية، يرجى التحقق من الصلاحيات والمدخلات.', true);
    }
  };

  const handleDeleteBroadcast = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'تأكيد الحذف',
      message: 'هل أنت متأكد من رغبتك في حذف هذه الإذاعة الصباحية؟',
      onConfirm: async () => {
        try {
          await deleteBroadcast(id);
          setBroadcasts(prev => prev.filter(b => b.id !== id));
          showNotification('تم حذف الإذاعة بنجاح.');
        } catch (e) {
          showNotification('تعذر حذف الإذاعة.', true);
        }
      }
    });
  };

  // 3. Lecture Save
  const handleSaveLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('lectures')) {
      showNotification('ليس لديك صلاحية لإدارة المحاضرات.', true);
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
        showNotification('تم تحديث المحاضرة بنجاح!');
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
        showNotification('تم إضافة المحاضرة التوعوية بنجاح!');
      }
      setIsLectureModalOpen(false);
    } catch (e) {
      showNotification('فشلت العملية، يرجى التحقق من الصلاحيات والمدخلات.', true);
    }
  };

  const handleDeleteLecture = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'تأكيد الحذف',
      message: 'هل أنت متأكد من حذف هذه المحاضرة التوعوية؟',
      onConfirm: async () => {
        try {
          await deleteLecture(id);
          setLectures(prev => prev.filter(l => l.id !== id));
          showNotification('تم حذف المحاضرة.');
        } catch (e) {
          showNotification('تعذر حذف المحاضرة.', true);
        }
      }
    });
  };

  // 4. Interview Save
  const handleSaveInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('interviews')) {
      showNotification('ليس لديك صلاحية لإدارة المقابلات.', true);
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
        showNotification('تم تحديث المقابلة بنجاح!');
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
        showNotification('تم إضافة المقابلة بنجاح!');
      }
      setIsInterviewModalOpen(false);
    } catch (e) {
      showNotification('فشلت العملية.', true);
    }
  };

  const handleDeleteInterview = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'تأكيد الحذف',
      message: 'هل تريد حذف هذه المقابلة الحوارية؟',
      onConfirm: async () => {
        try {
          await deleteInterview(id);
          setInterviews(prev => prev.filter(i => i.id !== id));
          showNotification('تم حذف المقابلة.');
        } catch (e) {
          showNotification('تعذر حذف المقابلة.', true);
        }
      }
    });
  };

  // 5. Event Save
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('events')) {
      showNotification('ليس لديك صلاحية لإدارة الفعاليات.', true);
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
        showNotification('تم تحديث الفعالية بنجاح!');
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
        showNotification('تم إضافة الفعالية بنجاح!');
      }
      setIsEventModalOpen(false);
    } catch (e) {
      showNotification('فشلت إضافة الفعالية.', true);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'تأكيد الحذف',
      message: 'هل تريد حذف هذه الفعالية من المنصة؟',
      onConfirm: async () => {
        try {
          await deleteEvent(id);
          setEvents(prev => prev.filter(ev => ev.id !== id));
          showNotification('تم حذف الفعالية.');
        } catch (e) {
          showNotification('تعذر حذف الفعالية.', true);
        }
      }
    });
  };

  // 6. Registration Save
  const handleSaveRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('registrations')) {
      showNotification('ليس لديك صلاحية لإدارة روابط التسجيل.', true);
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
        showNotification('تم تعديل رابط التسجيل بنجاح!');
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
        showNotification('تم إضافة نشاط التسجيل بنجاح!');
      }
      setIsRegistrationModalOpen(false);
    } catch (e) {
      showNotification('فشلت العملية.', true);
    }
  };

  const handleDeleteRegistration = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'تأكيد الحذف',
      message: 'هل تريد حذف رابط التسجيل هذا؟',
      onConfirm: async () => {
        try {
          await deleteRegistration(id);
          setRegistrations(prev => prev.filter(r => r.id !== id));
          showNotification('تم حذف رابط التسجيل.');
        } catch (e) {
          showNotification('تعذر الحذف.', true);
        }
      }
    });
  };

  // 7. Quiz Save
  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('quizzes')) {
      showNotification('ليس لديك صلاحية لإدارة الاستبانات والاختبارات.', true);
      return;
    }
    if (quizQuestions.length === 0) {
      showNotification('يرجى إضافة سؤال واحد على الأقل.', true);
      return;
    }
    for (const q of quizQuestions) {
      if (!q.questionText.trim()) {
        showNotification('يرجى كتابة نص السؤال لجميع الأسئلة.', true);
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
      showNotification('تم إنشاء الاستبانة التفاعلية بنجاح!');
      setIsQuizModalOpen(false);
      // Reset quiz modal fields
      setQuizTitle('');
      setQuizDescription('');
      setQuizQuestions([{
        id: 'q1',
        questionText: '',
        type: 'multiple_choice',
        options: ['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع'],
        correctAnswerIndex: 0,
        explanation: ''
      }]);
    } catch (e) {
      showNotification('تعذر حفظ الاستبانة.', true);
    }
  };

  const handleDeleteQuiz = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'تأكيد الحذف',
      message: 'هل تريد حذف هذه الاستبانة؟ ستفقد الأسئلة المرتبطة بها.',
      onConfirm: async () => {
        try {
          await deleteQuiz(id);
          setQuizzes(prev => prev.filter(q => q.id !== id));
          showNotification('تم حذف الاستبانة بنجاح.');
        } catch (e) {
          showNotification('تعذر حذف الاستبانة.', true);
        }
      }
    });
  };

  // 8. Supervisor Save (Admin only)
  const handleSaveSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showNotification('عذراً، فقط المدير الرئيسي يمتلك صلاحية إنشاء المشرفين.', true);
      return;
    }
    if (!newSupEmail.trim()) {
      showNotification('يرجى إدخال البريد الإلكتروني للمشرف.', true);
      return;
    }

    try {
      // Use clean sanitized email as supervisor ID or hash
      const supId = newSupEmail.replace(/[@.]/g, '_').toLowerCase();
      const supervisorData: Supervisor = {
        id: supId,
        email: newSupEmail.trim().toLowerCase(),
        name: newSupName.trim() || 'مشرف معتمد',
        role: newSupRole,
        permissions: newSupPermissions,
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.email || 'admin'
      };

      await saveSupervisor(supervisorData);
      setSupervisors(prev => {
        const filtered = prev.filter(s => s.id !== supId);
        return [supervisorData, ...filtered];
      });
      showNotification(`تم تسجيل المشرف (${newSupEmail}) وتعيين الصلاحيات بنجاح!`);
      setIsSupervisorModalOpen(false);
      setNewSupEmail('');
      setNewSupName('');
    } catch (e) {
      showNotification('تعذر حفظ المشرف.', true);
    }
  };

  const handleDeleteSupervisor = (id: string) => {
    if (!isAdmin) return;
    setConfirmDialog({
      isOpen: true,
      title: 'سحب الصلاحيات',
      message: 'هل تريد سحب صلاحيات هذا المشرف؟',
      onConfirm: async () => {
        try {
          await deleteSupervisor(id);
          setSupervisors(prev => prev.filter(s => s.id !== id));
          showNotification('تم سحب صلاحيات المشرف بنجاح.');
        } catch (e) {
          showNotification('تعذر حذف المشرف.', true);
        }
      }
    });
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
    <div className="min-h-screen bg-stone-100/70 text-stone-900 pb-20">
      
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#0e3c48] text-white border-b border-[#134e5e] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2e9e66] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight">لوحة التحكم المركزية - عافية تُزهر</h1>
              <span className="text-[11px] text-[#84d2ea] font-medium">
                {isSuperAdmin ? 'المدير الرئيسي (كامل الصلاحيات)' : supervisorProfile?.role === 'admin' ? 'مدير إداري' : 'مشرف محتوى'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitToPublic}
              className="px-3.5 py-1.5 bg-[#134e5e] hover:bg-[#19657b] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#84d2ea]" />
              <span>معاينة موقع الزوار</span>
            </button>

            <button
              onClick={logout}
              className="px-3.5 py-1.5 bg-rose-950/70 hover:bg-rose-900 text-rose-200 text-xs font-bold rounded-xl border border-rose-800/50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
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
          
          {/* Sidebar Menu (3 cols) */}
          <aside className="lg:col-span-3 bg-white rounded-3xl border border-stone-200 p-4 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              أقسام الإدارة
            </div>

            {[
              { id: 'overview', label: 'الإحصائيات العامة', icon: LayoutDashboard },
              { id: 'settings', label: 'إعدادات الموقع والواجهة', icon: Sliders, permission: 'settings' },
              { id: 'broadcasts', label: 'الإذاعات الصباحية', icon: Radio, permission: 'broadcasts' },
              { id: 'lectures', label: 'المحاضرات التوعوية', icon: Video, permission: 'lectures' },
              { id: 'interviews', label: 'المقابلات الحوارية', icon: Mic, permission: 'interviews' },
              { id: 'quizzes', label: 'الاستبانات والإحصائيات', icon: CheckSquare, permission: 'quizzes' },
              { id: 'events', label: 'الأنشطة والفعاليات', icon: Calendar, permission: 'events' },
              { id: 'registrations', label: 'روابط التسجيل', icon: ClipboardList, permission: 'registrations' },
              { id: 'supervisors', label: 'المشرفون والصلاحيات', icon: Users, adminOnly: true },
              { id: 'inquiries', label: 'رسائل واستفسارات الزوار', icon: Mail, adminOnly: true },
            ].map((tab: any) => {
              if (tab.adminOnly && !isAdmin) return null;
              if (tab.permission && !hasPermission(tab.permission)) return null;

              const Icon = tab.icon;
              const isActive = currentSection === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentSection(tab.id as AdminSection)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-right cursor-pointer ${
                    isActive
                      ? 'bg-[#134e5e] text-white shadow-xs border-r-4 border-[#2e9e66]'
                      : 'text-stone-700 hover:bg-[#eaf6fa]/60 hover:text-[#0e3c48]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#84d2ea]' : 'text-stone-400'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}

            <div className="pt-4 border-t border-stone-100 mt-4 px-2">
              <button
                onClick={handleSeedData}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-[11px] font-semibold transition-colors"
                title="تهيئة بيانات تجريبية حقيقية للمبادرة إذا كانت فارغة"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>تهيئة بيانات المبادرة</span>
              </button>
            </div>
          </aside>

          {/* Section Main Canvas (9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* 1. OVERVIEW SECTION */}
            {currentSection === 'overview' && (
              <div className="space-y-6">
                
                {/* Stats Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                    <span className="text-stone-500 text-xs font-medium block">عدد الإذاعات</span>
                    <span className="text-2xl font-black text-stone-900 mt-1 block">{broadcasts.length}</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                    <span className="text-stone-500 text-xs font-medium block">عدد المحاضرات</span>
                    <span className="text-2xl font-black text-stone-900 mt-1 block">{lectures.length}</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                    <span className="text-stone-500 text-xs font-medium block">عدد المقابلات</span>
                    <span className="text-2xl font-black text-stone-900 mt-1 block">{interviews.length}</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                    <span className="text-stone-500 text-xs font-medium block">عدد الاستبانات</span>
                    <span className="text-2xl font-black text-stone-900 mt-1 block">{quizzes.length}</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                    <span className="text-stone-500 text-xs font-medium block">الفعاليات الميدانية</span>
                    <span className="text-2xl font-black text-stone-900 mt-1 block">{events.length}</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                    <span className="text-stone-500 text-xs font-medium block">أنشطة التسجيل</span>
                    <span className="text-2xl font-black text-stone-900 mt-1 block">{registrations.length}</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                    <span className="text-[#2e9e66] text-xs font-bold block">إجابات الزوار المحفوظة</span>
                    <span className="text-2xl font-black text-[#134e5e] mt-1 block">{quizResponses.length}</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                    <span className="text-teal-700 text-xs font-bold block">استفسارات الزوار</span>
                    <span className="text-2xl font-black text-teal-800 mt-1 block">{inquiries.length}</span>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-stone-900">إجراءات سريعة</h3>
                  <div className="flex flex-wrap gap-3">
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
                        className="px-4 py-2.5 bg-[#2e9e66] hover:bg-[#238253] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إضافة إذاعة صباحية</span>
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
                        className="px-4 py-2.5 bg-[#2e9e66] hover:bg-[#238253] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إضافة محاضرة توعوية</span>
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
                        className="px-4 py-2.5 bg-[#2e9e66] hover:bg-[#238253] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إضافة نشاط أو فعالية</span>
                      </button>
                    )}

                    {hasPermission('quizzes') && (
                      <button
                        onClick={() => setIsQuizModalOpen(true)}
                        className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إنشاء استبانة جديدة</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Recent Content Stream */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-stone-900">أحدث المحتويات المضافة في قاعدة البيانات</h3>
                  <div className="divide-y divide-stone-100 text-xs">
                    {broadcasts.slice(0, 3).map((b) => (
                      <div key={b.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Radio className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-stone-800">{b.title}</span>
                          <span className="text-stone-400">({b.topic})</span>
                        </div>
                        <span className="text-stone-400 font-mono">{b.date}</span>
                      </div>
                    ))}
                    {lectures.slice(0, 2).map((l) => (
                      <div key={l.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-teal-600 shrink-0" />
                          <span className="font-bold text-stone-800">{l.title}</span>
                          <span className="text-stone-500">د. {l.speaker}</span>
                        </div>
                        <span className="text-stone-400 font-mono">{l.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 2. SETTINGS SECTION */}
            {currentSection === 'settings' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <h2 className="text-lg font-bold text-stone-900">إدارة بيانات وهوية المبادرة</h2>
                  <p className="text-xs text-stone-500 mt-1">
                    يمكنك تعديل اسم المبادرة، النبذة التعريفية، الرؤية، الرسالة، الأهداف والشعارات المشاركة لتظهر فوراً على الواجهة.
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">اسم المبادرة</label>
                      <input
                        type="text"
                        value={settingsForm.initiativeName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, initiativeName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">الشعار اللفظي (Tagline)</label>
                      <input
                        type="text"
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">النبذة التعريفية عن المبادرة</label>
                    <textarea
                      rows={4}
                      value={settingsForm.aboutText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">الرؤية</label>
                      <textarea
                        rows={3}
                        value={settingsForm.visionText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, visionText: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">الرسالة</label>
                      <textarea
                        rows={3}
                        value={settingsForm.missionText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, missionText: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Goals */}
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">أهداف المبادرة (كل هدف في سطر)</label>
                    <textarea
                      rows={5}
                      value={settingsForm.goals.join('\n')}
                      onChange={(e) => setSettingsForm({ ...settingsForm, goals: e.target.value.split('\n').filter(g => g.trim()) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                    />
                  </div>

                  {/* Initiative Official Logo */}
                  <div className="p-4 bg-[#eaf6fa]/60 border border-[#84d2ea]/40 rounded-2xl space-y-3">
                    <h3 className="text-xs font-bold text-[#0e3c48]">شعار المبادرة الرسمي</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-stone-200">
                        <img 
                          src={settingsForm.logoUrl || '/assets/aistudio/image_8a68eff7.png'} 
                          alt="شعار المبادرة" 
                          className="w-20 h-20 object-contain rounded-lg"
                        />
                        <span className="text-[10px] text-stone-400 mt-1">معاينة الشعار</span>
                      </div>
                      <div className="sm:col-span-9 space-y-2">
                        <label className="block font-bold text-stone-700">رابط الشعار الرسمي</label>
                        <input
                          type="text"
                          value={settingsForm.logoUrl}
                          onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                          placeholder="/assets/aistudio/image_8a68eff7.png"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none dir-ltr text-right"
                        />
                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, logoUrl: '/assets/aistudio/image_8a68eff7.png' })}
                          className="text-[11px] text-[#134e5e] font-bold hover:underline cursor-pointer"
                        >
                          استعادة الشعار الرسمي المعتمد
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Official Partners (Only 2 authorized partners: Ministry of Education & Al-Shatee High School) */}
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-[#0e3c48]">الجهات المشاركة والداعمة للمبادرة (معتمدتان حصراً)</h3>
                        <p className="text-[11px] text-stone-500">وفق التوجيه الرسمي، يقتصر هذا القسم على وزارة التعليم ومدرسة ثانوية الشاطئ فقط.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSettingsForm({
                            ...settingsForm,
                            partnerLogos: [
                              {
                                id: 'partner-moe',
                                name: 'وزارة التعليم',
                                imageUrl: '/assets/logos/ministry_of_education.svg',
                              },
                              {
                                id: 'partner-school',
                                name: 'مدرسة ثانوية الشاطئ',
                                imageUrl: '/assets/logos/alshatee_high_school.svg',
                              },
                            ]
                          });
                        }}
                        className="text-[11px] font-bold text-[#2e9e66] hover:underline cursor-pointer"
                      >
                        استعادة الشعارين الرسميين
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Partner 1: Ministry of Education */}
                      <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2">
                        <div className="flex items-center gap-3 pb-2 border-b border-stone-100">
                          <div className="w-12 h-12 bg-white rounded-lg border border-stone-100 p-1 flex items-center justify-center shrink-0">
                            <img
                              src={settingsForm.partnerLogos?.[0]?.imageUrl || '/assets/logos/ministry_of_education.svg'}
                              alt="وزارة التعليم"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#2e9e66] block">الجهة الأولى</span>
                            <span className="text-xs font-bold text-stone-800">{settingsForm.partnerLogos?.[0]?.name || 'وزارة التعليم'}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 mb-1">اسم الجهة</label>
                          <input
                            type="text"
                            value={settingsForm.partnerLogos?.[0]?.name || 'وزارة التعليم'}
                            onChange={(e) => {
                              const newPartners = [...(settingsForm.partnerLogos || [])];
                              if (!newPartners[0]) {
                                newPartners[0] = { id: 'partner-moe', name: '', imageUrl: '/assets/logos/ministry_of_education.svg' };
                              }
                              newPartners[0] = { ...newPartners[0], name: e.target.value };
                              setSettingsForm({ ...settingsForm, partnerLogos: newPartners });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 mb-1">مسار أو رابط الشعار</label>
                          <input
                            type="text"
                            value={settingsForm.partnerLogos?.[0]?.imageUrl || '/assets/logos/ministry_of_education.svg'}
                            onChange={(e) => {
                              const newPartners = [...(settingsForm.partnerLogos || [])];
                              if (!newPartners[0]) {
                                newPartners[0] = { id: 'partner-moe', name: 'وزارة التعليم', imageUrl: '' };
                              }
                              newPartners[0] = { ...newPartners[0], imageUrl: e.target.value };
                              setSettingsForm({ ...settingsForm, partnerLogos: newPartners });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none dir-ltr text-right"
                          />
                        </div>
                      </div>

                      {/* Partner 2: Al-Shatee High School */}
                      <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2">
                        <div className="flex items-center gap-3 pb-2 border-b border-stone-100">
                          <div className="w-12 h-12 bg-white rounded-lg border border-stone-100 p-1 flex items-center justify-center shrink-0">
                            <img
                              src={settingsForm.partnerLogos?.[1]?.imageUrl || '/assets/logos/alshatee_high_school.svg'}
                              alt="مدرسة ثانوية الشاطئ"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#2e9e66] block">الجهة الثانية</span>
                            <span className="text-xs font-bold text-stone-800">{settingsForm.partnerLogos?.[1]?.name || 'مدرسة ثانوية الشاطئ'}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 mb-1">اسم الجهة</label>
                          <input
                            type="text"
                            value={settingsForm.partnerLogos?.[1]?.name || 'مدرسة ثانوية الشاطئ'}
                            onChange={(e) => {
                              const newPartners = [...(settingsForm.partnerLogos || [])];
                              if (!newPartners[1]) {
                                newPartners[1] = { id: 'partner-school', name: '', imageUrl: '/assets/logos/alshatee_high_school.svg' };
                              }
                              newPartners[1] = { ...newPartners[1], name: e.target.value };
                              setSettingsForm({ ...settingsForm, partnerLogos: newPartners });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 mb-1">مسار أو رابط الشعار</label>
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
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none dir-ltr text-right"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">البريد الإلكتروني للتواصل</label>
                      <input
                        type="email"
                        value={settingsForm.contactEmail}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs dir-ltr text-right focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">رقم الهاتف</label>
                      <input
                        type="tel"
                        value={settingsForm.contactPhone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs dir-ltr text-right focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">العنوان أو المقر</label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ التعديلات في قاعدة البيانات</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 3. BROADCASTS SECTION */}
            {currentSection === 'broadcasts' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">إدارة الإذاعات الصباحية</h2>
                    <p className="text-xs text-stone-500">إضافة وتعديل وحذف الحلقات الإذاعية والروابط الصوتية والمرئية</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingBroadcastId(null);
                      setBroadcastTitle('');
                      setBroadcastDescription('');
                      setBroadcastTopic('العادات الصباحية');
                      setBroadcastImageUrl('');
                      setBroadcastAudioUrl('');
                      setBroadcastVideoUrl('');
                      setIsBroadcastModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#2e9e66] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#238253] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إذاعة جديدة</span>
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {broadcasts.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-stone-400">
                          <span className="font-bold text-[#2e9e66]">{item.topic}</span>
                          <span>·</span>
                          <span>{item.date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900">{item.title}</h4>
                        <p className="text-xs text-stone-500 line-clamp-1">{item.description}</p>
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
                          className="p-2 text-stone-600 hover:text-[#2e9e66] hover:bg-stone-100 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteBroadcast(item.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="حذف"
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
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">إدارة المحاضرات التوعوية</h2>
                    <p className="text-xs text-stone-500">إضافة المحاضرات وتحديد المتحدث والمدة وروابط الفيديو الخارجية</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingLectureId(null);
                      setLectureTitle('');
                      setLectureSpeaker('');
                      setLectureDescription('');
                      setLectureTopic('الطب الوقائي');
                      setLectureImageUrl('');
                      setLectureVideoUrl('');
                      setIsLectureModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#2e9e66] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#238253] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>محاضرة جديدة</span>
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {lectures.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-stone-400">
                          <span className="font-bold text-teal-700">{item.topic}</span>
                          <span>·</span>
                          <span>المحاضر: {item.speaker}</span>
                          <span>·</span>
                          <span>{item.date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900">{item.title}</h4>
                        <p className="text-xs text-stone-500 line-clamp-1">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingLectureId(item.id);
                            setLectureTitle(item.title);
                            setLectureSpeaker(item.speaker);
                            setLectureDescription(item.description);
                            setLectureDate(item.date);
                            setLectureDuration(item.duration || '40 دقيقة');
                            setLectureTopic(item.topic);
                            setLectureImageUrl(item.imageUrl || '');
                            setLectureVideoUrl(item.videoUrl || '');
                            setIsLectureModalOpen(true);
                          }}
                          className="p-2 text-stone-600 hover:text-[#2e9e66] hover:bg-stone-100 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteLecture(item.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="حذف"
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
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">إدارة المقابلات واللقاءات</h2>
                    <p className="text-xs text-stone-500">توثيق لقاءات الخبراء وأصحاب التجارب مع روابط الفيديو</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingInterviewId(null);
                      setInterviewTitle('');
                      setInterviewGuestName('');
                      setInterviewGuestTitle('');
                      setInterviewDescription('');
                      setInterviewTopic('الصحة واللياقة');
                      setInterviewImageUrl('');
                      setInterviewVideoUrl('');
                      setIsInterviewModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#2e9e66] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#238253] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>مقابلة جديدة</span>
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {interviews.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-stone-400">
                          <span className="font-bold text-[#2e9e66]">{item.topic}</span>
                          <span>·</span>
                          <span>الضيف: {item.guestName} ({item.guestTitle})</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900">{item.title}</h4>
                        <p className="text-xs text-stone-500 line-clamp-1">{item.description}</p>
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
                          className="p-2 text-stone-600 hover:text-[#2e9e66] hover:bg-stone-100 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteInterview(item.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="حذف"
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
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">إدارة استبانات واختبارات العادات</h2>
                      <p className="text-xs text-stone-500">إنشاء استبانات تفاعلية، تحديد الأسئلة والإجابة الصحية الصحيحة</p>
                    </div>
                    <button
                      onClick={() => setIsQuizModalOpen(true)}
                      className="px-4 py-2 bg-[#2e9e66] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#238253] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>استبانة جديدة</span>
                    </button>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {quizzes.map((quiz) => (
                      <div key={quiz.id} className="py-4 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-[#2e9e66] font-bold block">{quiz.category}</span>
                          <h4 className="text-sm font-bold text-stone-900">{quiz.title}</h4>
                          <span className="text-xs text-stone-400">{quiz.questions.length} أسئلة</span>
                        </div>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="حذف الاستبانة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visitor Responses Analytics (Supervisors & Admins only) */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-[#2e9e66]" />
                        <span>النتائج الإحصائية لإجابات الزوار المحفوظة (سري للمشرفين)</span>
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        إجمالي الاستجابات المسجلة: {quizResponses.length} استجابة
                      </p>
                    </div>
                  </div>

                  {quizResponses.length === 0 ? (
                    <p className="text-xs text-stone-400 py-6 text-center">لم تُسجل إجابات زوار حتى الآن.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-right">
                        <thead>
                          <tr className="border-b border-stone-200 text-stone-500 font-bold">
                            <th className="py-2.5 px-3">الاستبانة</th>
                            <th className="py-2.5 px-3">اسم الزائر</th>
                            <th className="py-2.5 px-3">النتيجة</th>
                            <th className="py-2.5 px-3">النسبة</th>
                            <th className="py-2.5 px-3">تاريخ الإرسال</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {quizResponses.map((res, idx) => (
                            <tr key={idx} className="hover:bg-stone-50">
                              <td className="py-2.5 px-3 font-semibold text-stone-800">{res.quizTitle}</td>
                              <td className="py-2.5 px-3 text-stone-600">{res.respondentName || 'مجهول'}</td>
                              <td className="py-2.5 px-3 font-mono font-bold text-stone-700">{res.score} / {res.totalQuestions}</td>
                              <td className="py-2.5 px-3 font-bold text-[#2e9e66]">{res.percentage}%</td>
                              <td className="py-2.5 px-3 text-stone-400 font-mono">{new Date(res.submittedAt).toLocaleDateString('ar-SA')}</td>
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
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">إدارة الأنشطة والفعاليات</h2>
                    <p className="text-xs text-stone-500">إضافة الفعاليات وتحديد حالتها (قادمة أو جارية أو سابقة) وتمييز الفعالية الأبرز</p>
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
                    className="px-4 py-2 bg-[#2e9e66] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#238253] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>فعالية جديدة</span>
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {events.map((ev) => (
                    <div key={ev.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className={`font-bold px-2 py-0.5 rounded-md ${
                            ev.status === 'upcoming' ? 'bg-[#2e9e66]/15 text-[#134e5e]' :
                            ev.status === 'ongoing' ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-700'
                          }`}>
                            {ev.status === 'upcoming' ? 'قادمة' : ev.status === 'ongoing' ? 'جارية' : 'منتهية'}
                          </span>
                          {ev.isFeatured && (
                            <span className="bg-[#eaf6fa] text-[#0e3c48] border border-[#84d2ea]/40 px-2 py-0.5 rounded-md font-bold">
                              بارزة
                            </span>
                          )}
                          <span className="text-stone-400">{ev.date} · {ev.time}</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900">{ev.title}</h4>
                        <p className="text-xs text-stone-500">{ev.location}</p>
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
                          className="p-2 text-stone-600 hover:text-[#2e9e66] hover:bg-stone-100 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="حذف"
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
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">إدارة روابط التسجيل في الأنشطة</h2>
                    <p className="text-xs text-stone-500">إضافة نماذج وروابط التسجيل وتحديد موعد الإغلاق والحالة</p>
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
                    className="px-4 py-2 bg-[#2e9e66] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#238253] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>رابط تسجيل جديد</span>
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {registrations.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className={`font-bold px-2 py-0.5 rounded-md ${
                            item.status === 'open' ? 'bg-[#2e9e66]/15 text-[#134e5e]' : 'bg-stone-200 text-stone-700'
                          }`}>
                            {item.status === 'open' ? 'مفتوح للتسجيل' : 'مغلق'}
                          </span>
                          <span className="text-stone-400">آخر موعد: {item.deadline}</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900">{item.title}</h4>
                        <a 
                          href={item.externalUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[#2e9e66] hover:underline text-[11px] flex items-center gap-1 dir-ltr text-right"
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
                          className="p-2 text-stone-600 hover:text-[#2e9e66] hover:bg-stone-100 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteRegistration(item.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="حذف"
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
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">إدارة المشرفين والصلاحيات</h2>
                    <p className="text-xs text-stone-500">
                      خاص بالمدير الرئيسي: إنشاء حسابات المشرفين وتحديد الصلاحيات الممنوحة لكل قسم
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setNewSupEmail('');
                      setNewSupName('');
                      setIsSupervisorModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#2e9e66] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#238253] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة مشرف جديد</span>
                  </button>
                </div>

                {/* Notice for Admin */}
                <div className="p-4 bg-[#eaf6fa] border border-[#84d2ea]/60 rounded-2xl text-xs text-[#0e3c48] space-y-1">
                  <p className="font-bold">حساب المدير الرئيسي المسجل بالنظام:</p>
                  <p className="font-mono text-[#134e5e] font-semibold">{SUPER_ADMIN_EMAIL}</p>
                  <p className="text-[11px] text-stone-600 mt-1">
                    المشرفون يمتلكون فقط الصلاحيات المحددة لهم أدناه ولا يمكنهم تعديل صلاحيات المدير الرئيسي.
                  </p>
                </div>

                <div className="divide-y divide-stone-100">
                  {supervisors.map((sup) => (
                    <div key={sup.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-900">{sup.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            sup.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-stone-100 text-stone-700'
                          }`}>
                            {sup.role === 'admin' ? 'مدير' : 'مشرف'}
                          </span>
                        </div>
                        <span className="text-xs text-stone-500 font-mono block mt-0.5">{sup.email}</span>
                        
                        {/* Permissions pills */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {Object.entries(sup.permissions || {}).map(([key, val]) => (
                            val && (
                              <span key={key} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                                {key}
                              </span>
                            )
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {sup.email !== SUPER_ADMIN_EMAIL && (
                          <button
                            onClick={() => handleDeleteSupervisor(sup.id)}
                            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="سحب الصلاحيات"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. INQUIRIES SECTION */}
            {currentSection === 'inquiries' && isAdmin && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <h2 className="text-lg font-bold text-stone-900">رسائل واستفسارات الزوار</h2>
                  <p className="text-xs text-stone-500">متابعة الرسائل الواردة عبر نموذج تواصل معنا بالموقع</p>
                </div>

                {inquiries.length === 0 ? (
                  <p className="text-xs text-stone-400 py-8 text-center">لا توجد رسائل واردة جديدة.</p>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className={`p-5 rounded-2xl border transition-all space-y-3 ${
                          inq.status === 'new' ? 'bg-[#eaf6fa]/40 border-[#84d2ea]/60' : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-stone-900">{inq.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              inq.status === 'new' ? 'bg-[#2e9e66] text-white' : 'bg-stone-200 text-stone-600'
                            }`}>
                              {inq.status === 'new' ? 'رسالة جديدة' : 'تم الرد'}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-400 font-mono">
                            {new Date(inq.submittedAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>

                        <div className="text-xs text-stone-600 flex flex-wrap gap-4">
                          <span>البريد: <strong className="font-mono text-stone-800">{inq.email}</strong></span>
                          {inq.phone && <span>الهاتف: <strong className="font-mono text-stone-800">{inq.phone}</strong></span>}
                        </div>

                        <p className="text-xs text-stone-800 bg-white p-3 rounded-xl border border-stone-200 leading-relaxed whitespace-pre-line">
                          {inq.message}
                        </p>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => inq.id && handleToggleInquiryStatus(inq.id, inq.status)}
                            className="px-3 py-1 bg-white hover:bg-stone-100 border border-stone-200 text-xs font-semibold rounded-lg text-stone-700"
                          >
                            {inq.status === 'new' ? 'تحديد كـ "تم الرد"' : 'تحديد كـ "رسالة جديدة"'}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">
                {editingBroadcastId ? 'تعديل الإذاعة الصباحية' : 'إضافة إذاعة صباحية جديدة'}
              </h3>
              <button onClick={() => setIsBroadcastModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">عنوان الإذاعة</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="مثال: إشراقة الصباح والنشاط اليومي"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">الموضوع / التصنيف</label>
                  <input
                    type="text"
                    required
                    value={broadcastTopic}
                    onChange={(e) => setBroadcastTopic(e.target.value)}
                    placeholder="العادات الصباحية"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">تاريخ البث</label>
                  <input
                    type="date"
                    required
                    value={broadcastDate}
                    onChange={(e) => setBroadcastDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">وصف الإذاعة</label>
                <textarea
                  rows={3}
                  required
                  value={broadcastDescription}
                  onChange={(e) => setBroadcastDescription(e.target.value)}
                  placeholder="وصف مختصر للحلقة الإذاعية ومحاورها..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#2e9e66] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">رابط الصورة الخارجية (Direct URL)</label>
                <input
                  type="url"
                  value={broadcastImageUrl}
                  onChange={(e) => setBroadcastImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs dir-ltr text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">رابط الملف الصوتي (MP3)</label>
                  <input
                    type="url"
                    value={broadcastAudioUrl}
                    onChange={(e) => setBroadcastAudioUrl(e.target.value)}
                    placeholder="https://.../audio.mp3"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs dir-ltr text-right"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">رابط الفيديو (YouTube)</label>
                  <input
                    type="url"
                    value={broadcastVideoUrl}
                    onChange={(e) => setBroadcastVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs dir-ltr text-right"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl"
                >
                  حفظ الإذاعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Lecture Modal */}
      {isLectureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">
                {editingLectureId ? 'تعديل المحاضرة التوعوية' : 'إضافة محاضرة توعوية جديدة'}
              </h3>
              <button onClick={() => setIsLectureModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLecture} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">عنوان المحاضرة</label>
                <input
                  type="text"
                  required
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">اسم المحاضر / المتحدث</label>
                  <input
                    type="text"
                    required
                    value={lectureSpeaker}
                    onChange={(e) => setLectureSpeaker(e.target.value)}
                    placeholder="د. فلان الفلاني"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">التصنيف / الموضوع</label>
                  <input
                    type="text"
                    required
                    value={lectureTopic}
                    onChange={(e) => setLectureTopic(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">تاريخ المحاضرة</label>
                  <input
                    type="date"
                    required
                    value={lectureDate}
                    onChange={(e) => setLectureDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">المدة التقديرية</label>
                  <input
                    type="text"
                    value={lectureDuration}
                    onChange={(e) => setLectureDuration(e.target.value)}
                    placeholder="مثال: 45 دقيقة"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">وصف المحاضرة</label>
                <textarea
                  rows={3}
                  required
                  value={lectureDescription}
                  onChange={(e) => setLectureDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">رابط فيديو المحاضرة (YouTube)</label>
                <input
                  type="url"
                  value={lectureVideoUrl}
                  onChange={(e) => setLectureVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">رابط الصورة المصغرة</label>
                <input
                  type="url"
                  value={lectureImageUrl}
                  onChange={(e) => setLectureImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs dir-ltr text-right"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLectureModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl"
                >
                  حفظ المحاضرة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Interview Modal */}
      {isInterviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">
                {editingInterviewId ? 'تعديل المقابلة' : 'إضافة مقابلة حوارية جديدة'}
              </h3>
              <button onClick={() => setIsInterviewModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInterview} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">عنوان المقابلة</label>
                <input
                  type="text"
                  required
                  value={interviewTitle}
                  onChange={(e) => setInterviewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">اسم الضيف</label>
                  <input
                    type="text"
                    required
                    value={interviewGuestName}
                    onChange={(e) => setInterviewGuestName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">صفة أو منصب الضيف</label>
                  <input
                    type="text"
                    required
                    value={interviewGuestTitle}
                    onChange={(e) => setInterviewGuestTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">التصنيف / الموضوع</label>
                  <input
                    type="text"
                    required
                    value={interviewTopic}
                    onChange={(e) => setInterviewTopic(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">تاريخ المقابلة</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">وصف المقابلة</label>
                <textarea
                  rows={3}
                  required
                  value={interviewDescription}
                  onChange={(e) => setInterviewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">رابط الفيديو (YouTube)</label>
                <input
                  type="url"
                  value={interviewVideoUrl}
                  onChange={(e) => setInterviewVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">رابط صورة الضيف أو اللقاء</label>
                <input
                  type="url"
                  value={interviewImageUrl}
                  onChange={(e) => setInterviewImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs dir-ltr text-right"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInterviewModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl"
                >
                  حفظ المقابلة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">
                {editingEventId ? 'تعديل الفعالية' : 'إضافة نشاط أو فعالية جديدة'}
              </h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">عنوان الفعالية</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">التاريخ</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">الوقت</label>
                  <input
                    type="text"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="04:00 م - 08:00 م"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">الموقع أو المقر</label>
                <input
                  type="text"
                  required
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="الرياض - حديقة الملك عبد الله"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">حالة الفعالية</label>
                  <select
                    value={eventStatus}
                    onChange={(e: any) => setEventStatus(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  >
                    <option value="upcoming">قادمة</option>
                    <option value="ongoing">جارية الآن</option>
                    <option value="completed">منتهية</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                    <input
                      type="checkbox"
                      checked={eventIsFeatured}
                      onChange={(e) => setEventIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>تمييز كفعالية بارزة في الرئيسية</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">وصف الفعالية</label>
                <textarea
                  rows={3}
                  required
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">رابط صورة الفعالية</label>
                <input
                  type="url"
                  value={eventImageUrl}
                  onChange={(e) => setEventImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs dir-ltr text-right"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl"
                >
                  حفظ الفعالية
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Registration Modal */}
      {isRegistrationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">
                {editingRegId ? 'تعديل نشاط التسجيل' : 'إضافة نشاط للتسجيل'}
              </h3>
              <button onClick={() => setIsRegistrationModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRegistration} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">عنوان النشاط</label>
                <input
                  type="text"
                  required
                  value={regTitle}
                  onChange={(e) => setRegTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">رابط التسجيل الخارجي (Google Form / نموذج التسجيل)</label>
                <input
                  type="url"
                  required
                  value={regExternalUrl}
                  onChange={(e) => setRegExternalUrl(e.target.value)}
                  placeholder="https://forms.gle/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs dir-ltr text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">آخر موعد للتسجيل</label>
                  <input
                    type="date"
                    required
                    value={regDeadline}
                    onChange={(e) => setRegDeadline(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">حالة التسجيل</label>
                  <select
                    value={regStatus}
                    onChange={(e: any) => setRegStatus(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  >
                    <option value="open">مفتوح</option>
                    <option value="closed">مغلق</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">وصف شروط ومتطلبات التسجيل</label>
                <textarea
                  rows={3}
                  required
                  value={regDescription}
                  onChange={(e) => setRegDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">رابط صورة النشاط (Direct URL)</label>
                <input
                  type="url"
                  value={regImageUrl}
                  onChange={(e) => setRegImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs dir-ltr text-right"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegistrationModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl"
                >
                  حفظ النشاط
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Quiz Modal with Dynamic Questions Builder */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">إنشاء استبانة / اختبار عادات جديد</h3>
              <button onClick={() => setIsQuizModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">عنوان الاستبانة</label>
                  <input
                    type="text"
                    required
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="مقياس العادات الصحية..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">التصنيف</label>
                  <input
                    type="text"
                    required
                    value={quizCategory}
                    onChange={(e) => setQuizCategory(e.target.value)}
                    placeholder="نمط الحياة / التغذية..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">وصف الاستبانة للزائر</label>
                <textarea
                  rows={2}
                  required
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              {/* Questions Builder */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900">أسئلة الاستبانة ({quizQuestions.length})</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizQuestions([
                        ...quizQuestions,
                        {
                          id: `q${quizQuestions.length + 1}`,
                          questionText: '',
                          type: 'multiple_choice',
                          options: ['خيار 1', 'خيار 2', 'خيار 3', 'خيار 4'],
                          correctAnswerIndex: 0,
                          explanation: ''
                        }
                      ]);
                    }}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg font-bold flex items-center gap-1 hover:bg-emerald-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة سؤال</span>
                  </button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {quizQuestions.map((q, qIndex) => (
                    <div key={q.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-700">السؤال #{qIndex + 1}</span>
                        {quizQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setQuizQuestions(quizQuestions.filter((_, idx) => idx !== qIndex));
                            }}
                            className="text-rose-600 hover:text-rose-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        required
                        placeholder="نص السؤال..."
                        value={q.questionText}
                        onChange={(e) => {
                          const updated = [...quizQuestions];
                          updated[qIndex].questionText = e.target.value;
                          setQuizQuestions(updated);
                        }}
                        className="w-full px-3.5 py-1.5 bg-white rounded-xl border border-stone-300 text-xs"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-stone-500 font-bold mb-1">نوع السؤال</label>
                          <select
                            value={q.type}
                            onChange={(e: any) => {
                              const updated = [...quizQuestions];
                              const newType = e.target.value;
                              updated[qIndex].type = newType;
                              if (newType === 'true_false') {
                                updated[qIndex].options = ['صح', 'خطأ'];
                                updated[qIndex].correctAnswerIndex = 0;
                              } else {
                                updated[qIndex].options = ['خيار 1', 'خيار 2', 'خيار 3', 'خيار 4'];
                                updated[qIndex].correctAnswerIndex = 0;
                              }
                              setQuizQuestions(updated);
                            }}
                            className="w-full px-2 py-1 bg-white rounded-lg border border-stone-300 text-xs"
                          >
                            <option value="multiple_choice">اختيار من متعدد</option>
                            <option value="true_false">صح أو خطأ</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-stone-500 font-bold mb-1">الإجابة الصحية الصحيحة</label>
                          <select
                            value={q.correctAnswerIndex}
                            onChange={(e) => {
                              const updated = [...quizQuestions];
                              updated[qIndex].correctAnswerIndex = Number(e.target.value);
                              setQuizQuestions(updated);
                            }}
                            className="w-full px-2 py-1 bg-white rounded-lg border border-stone-300 text-xs"
                          >
                            {q.options.map((opt, oIdx) => (
                              <option key={oIdx} value={oIdx}>
                                الخيار #{oIdx + 1}: {opt.slice(0, 20)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Options inputs */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-stone-500 font-bold">الخيارات المتاحة للزائر:</label>
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
                            placeholder={`الخيار ${optIndex + 1}`}
                            className="w-full px-3 py-1 bg-white rounded-lg border border-stone-200 text-xs"
                          />
                        ))}
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="تفسير أو معلومة صحية تظهر للزائر بعد الإجابة (اختياري)..."
                          value={q.explanation || ''}
                          onChange={(e) => {
                            const updated = [...quizQuestions];
                            updated[qIndex].explanation = e.target.value;
                            setQuizQuestions(updated);
                          }}
                          className="w-full px-3 py-1 bg-white rounded-lg border border-stone-200 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl"
                >
                  حفظ الاستبانة والأسئلة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Supervisor Modal (Admin only) */}
      {isSupervisorModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">تسجيل مشرف وتحديد صلاحياته</h3>
              <button onClick={() => setIsSupervisorModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupervisor} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">البريد الإلكتروني للمشرف (حساب Google)</label>
                <input
                  type="email"
                  required
                  value={newSupEmail}
                  onChange={(e) => setNewSupEmail(e.target.value)}
                  placeholder="supervisor@gmail.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">اسم المشرف</label>
                <input
                  type="text"
                  required
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  placeholder="أ. عبد الله السالم"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">الرتبة</label>
                <select
                  value={newSupRole}
                  onChange={(e: any) => setNewSupRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                >
                  <option value="editor">مشرف محتوى (صلاحيات مخصصة)</option>
                  <option value="admin">مدير إداري (صلاحيات كاملة)</option>
                </select>
              </div>

              {/* Granular Permissions Checkboxes */}
              {newSupRole === 'editor' && (
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <span className="font-bold text-stone-800 block text-[11px]">الصلاحيات الممنوحة للمشرف:</span>
                  <div className="grid grid-cols-2 gap-2 text-stone-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSupPermissions.broadcasts}
                        onChange={(e) => setNewSupPermissions({ ...newSupPermissions, broadcasts: e.target.checked })}
                      />
                      <span>الإذاعات الصباحية</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSupPermissions.lectures}
                        onChange={(e) => setNewSupPermissions({ ...newSupPermissions, lectures: e.target.checked })}
                      />
                      <span>المحاضرات التوعوية</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSupPermissions.interviews}
                        onChange={(e) => setNewSupPermissions({ ...newSupPermissions, interviews: e.target.checked })}
                      />
                      <span>المقابلات الحوارية</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSupPermissions.quizzes}
                        onChange={(e) => setNewSupPermissions({ ...newSupPermissions, quizzes: e.target.checked })}
                      />
                      <span>الاستبانات والإحصائيات</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSupPermissions.events}
                        onChange={(e) => setNewSupPermissions({ ...newSupPermissions, events: e.target.checked })}
                      />
                      <span>الأنشطة والفعاليات</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSupPermissions.registrations}
                        onChange={(e) => setNewSupPermissions({ ...newSupPermissions, registrations: e.target.checked })}
                      />
                      <span>روابط التسجيل</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSupervisorModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2e9e66] hover:bg-[#238253] text-white font-bold rounded-xl"
                >
                  حفظ المشرف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-app Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 text-center space-y-4">
            <h3 className="text-base font-bold text-stone-900">{confirmDialog.title}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = confirmDialog.onConfirm;
                  setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                  action();
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
