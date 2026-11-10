import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  InitiativeSettings, 
  Broadcast, 
  Lecture, 
  Interview, 
  Quiz, 
  QuizResponse, 
  EventItem, 
  RegistrationItem, 
  Supervisor, 
  Inquiry 
} from '../types';

export const DEFAULT_SETTINGS: InitiativeSettings = {
  initiativeName: 'مبادرة عافية تُزهر',
  tagline: 'بالتوازن تحصل العافية.. وبالعافية نَزْهَر',
  aboutText: 'مبادرة مدرسية ومجتمعية توعوية رائدة تحت إشراف وزارة التعليم وتنظيم مدرسة ثانوية الشاطئ، تهدف إلى ترسيخ الركائز الأربع لنمط الحياة المتوازن: التغذية الصحية الطبيعية، والنشاط البدني المستمر، وجودة النوم والراحة، والعافية النفسية، لتمكين الطلاب والمجتمع من بناء حياة صحية ملهمة ومزدهرة.',
  visionText: 'أن نكون النموذج التوعوي المدرسي والمجتمعي الرائد في صناعة أجيال واعية تحقق التوازن الصحي وتزهر بالعافية وجودة الحياة.',
  missionText: 'نشر الوعي الصحي المتكامل من خلال برامج إذاعية تفاعلية، ومحاضرات متخصصة، ومقابلات ملهمة، واستبانات ذكية تدعم التوازن بين العقل والجسد والروح.',
  goals: [
    'ترسيخ ثقافة الغذاء الصحي المتوازن والابتعاد عن الأنماط الغذائية الضارة.',
    'تحفيز النشاط البدني والحركي اليومي لدى الطلاب وأفراد المجتمع.',
    'التوعية بأهمية النوم الصحي المنتظم وأثره المباشر على التركيز والتحصيل الدراسي.',
    'تعزيز الصحة النفسية والتوازن الوجداني وجودة الحياة في البيئة المدرسية والمجتمعية.',
    'تفعيل الشراكة الإيجابية والتكامل البناء بين وزارة التعليم ومدرسة ثانوية الشاطئ والمجتمع.'
  ],
  logoUrl: '/assets/aistudio/50c0c8c4-5c4f-4db5-8ada-405779c14cc1_db926d78.png',
  moeLogoUrl: '/assets/logos/ministry_of_education.svg',
  partnerLogos: [
    { 
      id: 'moe', 
      name: 'وزارة التعليم', 
      imageUrl: '/assets/logos/ministry_of_education.svg' 
    },
    { 
      id: 'shatee_high_school', 
      name: 'مدرسة ثانوية الشاطئ', 
      imageUrl: '/assets/logos/alshatee_high_school.svg' 
    }
  ],
  contactEmail: 'contact@alshatee-aafia.edu.sa',
  contactPhone: '+966 12 600 0000',
  address: 'المملكة العربية السعودية - مدرسة ثانوية الشاطئ',
  heroImageUrl: '/assets/images/hero_awareness_banner_1793901820998.jpg'
};

function isOfflineOrNetworkError(error: unknown): boolean {
  if (!error) return false;
  const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();
  const code = (error as any)?.code;
  return (
    code === 'unavailable' ||
    msg.includes('offline') ||
    msg.includes('network') ||
    msg.includes('failed to get document because the client is offline')
  );
}

// ======================= Settings =======================
export async function getInitiativeSettings(): Promise<InitiativeSettings> {
  const path = 'settings/general';
  try {
    const docRef = doc(db, 'settings', 'general');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as InitiativeSettings;
      const moeLogo = data.moeLogoUrl || data.partnerLogos?.[0]?.imageUrl || DEFAULT_SETTINGS.moeLogoUrl;
      const initiativeLogo = data.logoUrl || DEFAULT_SETTINGS.logoUrl;
      if (typeof window !== 'undefined') {
        if (moeLogo) localStorage.setItem('aafia_moe_logo', moeLogo);
        if (initiativeLogo) localStorage.setItem('aafia_initiative_logo', initiativeLogo);
      }
      return { 
        id: docSnap.id, 
        ...data,
        moeLogoUrl: moeLogo,
        logoUrl: initiativeLogo
      };
    }
    // Return default settings only if none stored in Firestore yet
    return DEFAULT_SETTINGS;
  } catch (error) {
    if (isOfflineOrNetworkError(error)) {
      console.warn('[Firestore] Client is offline; providing default initiative settings fallback.');
      return DEFAULT_SETTINGS;
    }
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveInitiativeSettings(settings: Partial<InitiativeSettings>): Promise<void> {
  const path = 'settings/general';
  try {
    const docRef = doc(db, 'settings', 'general');
    await setDoc(docRef, { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
    if (typeof window !== 'undefined') {
      if (settings.moeLogoUrl) {
        localStorage.setItem('aafia_moe_logo', settings.moeLogoUrl);
      }
      if (settings.logoUrl) {
        localStorage.setItem('aafia_initiative_logo', settings.logoUrl);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ======================= Broadcasts =======================
export async function getBroadcasts(): Promise<Broadcast[]> {
  const path = 'broadcasts';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Broadcast));
  } catch (error) {
    if (isOfflineOrNetworkError(error)) {
      console.warn('[Firestore] Client is offline; providing empty broadcasts fallback.');
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function createBroadcast(data: Omit<Broadcast, 'id' | 'createdAt'>): Promise<string> {
  const path = 'broadcasts';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateBroadcast(id: string, data: Partial<Broadcast>): Promise<void> {
  const path = `broadcasts/${id}`;
  try {
    await updateDoc(doc(db, 'broadcasts', id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteBroadcast(id: string): Promise<void> {
  const path = `broadcasts/${id}`;
  try {
    await deleteDoc(doc(db, 'broadcasts', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ======================= Lectures =======================
export async function getLectures(): Promise<Lecture[]> {
  const path = 'lectures';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lecture));
  } catch (error) {
    if (isOfflineOrNetworkError(error)) {
      console.warn('[Firestore] Client is offline; providing empty lectures fallback.');
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function createLecture(data: Omit<Lecture, 'id' | 'createdAt'>): Promise<string> {
  const path = 'lectures';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateLecture(id: string, data: Partial<Lecture>): Promise<void> {
  const path = `lectures/${id}`;
  try {
    await updateDoc(doc(db, 'lectures', id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteLecture(id: string): Promise<void> {
  const path = `lectures/${id}`;
  try {
    await deleteDoc(doc(db, 'lectures', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ======================= Interviews =======================
export async function getInterviews(): Promise<Interview[]> {
  const path = 'interviews';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Interview));
  } catch (error) {
    if (isOfflineOrNetworkError(error)) {
      console.warn('[Firestore] Client is offline; providing empty interviews fallback.');
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function createInterview(data: Omit<Interview, 'id' | 'createdAt'>): Promise<string> {
  const path = 'interviews';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateInterview(id: string, data: Partial<Interview>): Promise<void> {
  const path = `interviews/${id}`;
  try {
    await updateDoc(doc(db, 'interviews', id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteInterview(id: string): Promise<void> {
  const path = `interviews/${id}`;
  try {
    await deleteDoc(doc(db, 'interviews', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ======================= Quizzes =======================
export async function getQuizzes(): Promise<Quiz[]> {
  const path = 'quizzes';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
  } catch (error) {
    if (isOfflineOrNetworkError(error)) {
      console.warn('[Firestore] Client is offline; providing empty quizzes fallback.');
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function createQuiz(data: Omit<Quiz, 'id' | 'createdAt'>): Promise<string> {
  const path = 'quizzes';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateQuiz(id: string, data: Partial<Quiz>): Promise<void> {
  const path = `quizzes/${id}`;
  try {
    await updateDoc(doc(db, 'quizzes', id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteQuiz(id: string): Promise<void> {
  const path = `quizzes/${id}`;
  try {
    await deleteDoc(doc(db, 'quizzes', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ======================= Quiz Responses =======================
export async function submitQuizResponse(response: Omit<QuizResponse, 'id' | 'submittedAt'>): Promise<string> {
  const path = 'quiz_responses';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...response,
      submittedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getQuizResponses(quizId?: string): Promise<QuizResponse[]> {
  const path = 'quiz_responses';
  try {
    const q = query(collection(db, path), orderBy('submittedAt', 'desc'), limit(100));
    const snapshot = await getDocs(q);
    const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizResponse));
    if (quizId) {
      return all.filter(r => r.quizId === quizId);
    }
    return all;
  } catch (error) {
    if (isOfflineOrNetworkError(error)) {
      console.warn('[Firestore] Client is offline; providing empty quiz responses fallback.');
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// ======================= Events =======================
export async function getEvents(): Promise<EventItem[]> {
  const path = 'events';
  try {
    const q = query(collection(db, path), orderBy('date', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventItem));
  } catch (error) {
    if (isOfflineOrNetworkError(error)) {
      console.warn('[Firestore] Client is offline; providing empty events fallback.');
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function createEvent(data: Omit<EventItem, 'id' | 'createdAt'>): Promise<string> {
  const path = 'events';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateEvent(id: string, data: Partial<EventItem>): Promise<void> {
  const path = `events/${id}`;
  try {
    await updateDoc(doc(db, 'events', id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteEvent(id: string): Promise<void> {
  const path = `events/${id}`;
  try {
    await deleteDoc(doc(db, 'events', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ======================= Registrations =======================
export async function getRegistrations(): Promise<RegistrationItem[]> {
  const path = 'registrations';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RegistrationItem));
  } catch (error) {
    if (isOfflineOrNetworkError(error)) {
      console.warn('[Firestore] Client is offline; providing empty registrations fallback.');
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function createRegistration(data: Omit<RegistrationItem, 'id' | 'createdAt'>): Promise<string> {
  const path = 'registrations';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateRegistration(id: string, data: Partial<RegistrationItem>): Promise<void> {
  const path = `registrations/${id}`;
  try {
    await updateDoc(doc(db, 'registrations', id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteRegistration(id: string): Promise<void> {
  const path = `registrations/${id}`;
  try {
    await deleteDoc(doc(db, 'registrations', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ======================= Supervisors =======================
export async function getSupervisors(): Promise<Supervisor[]> {
  const path = 'supervisors';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supervisor));
  } catch (error) {
    if (isOfflineOrNetworkError(error)) {
      console.warn('[Firestore] Client is offline; providing empty supervisors fallback.');
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveSupervisor(supervisor: Supervisor): Promise<void> {
  const path = `supervisors/${supervisor.id}`;
  try {
    await setDoc(doc(db, 'supervisors', supervisor.id), supervisor);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSupervisor(id: string): Promise<void> {
  const path = `supervisors/${id}`;
  try {
    await deleteDoc(doc(db, 'supervisors', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ======================= Inquiries =======================
export async function submitInquiry(inquiry: Omit<Inquiry, 'id' | 'submittedAt' | 'status'>): Promise<string> {
  const path = 'inquiries';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...inquiry,
      submittedAt: new Date().toISOString(),
      status: 'new'
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getInquiries(): Promise<Inquiry[]> {
  const path = 'inquiries';
  try {
    const q = query(collection(db, path), orderBy('submittedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry));
  } catch (error) {
    if (isOfflineOrNetworkError(error)) {
      console.warn('[Firestore] Client is offline; providing empty inquiries fallback.');
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function updateInquiryStatus(id: string, status: 'new' | 'replied'): Promise<void> {
  const path = `inquiries/${id}`;
  try {
    await updateDoc(doc(db, 'inquiries', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ======================= Seeding Initial Data =======================
export async function seedInitialContentIfEmpty(): Promise<boolean> {
  try {
    // Check if settings or broadcasts already exist. If so, system is initialized; do not overwrite!
    const settingsSnap = await getDoc(doc(db, 'settings', 'general'));
    if (settingsSnap.exists()) {
      return false; // Already initialized, never overwrite!
    }

    const broadcastsSnap = await getDocs(collection(db, 'broadcasts'));
    if (!broadcastsSnap.empty) {
      return false; // already has data
    }

    // 1. Seed default settings only if empty
    await setDoc(doc(db, 'settings', 'general'), DEFAULT_SETTINGS);

    // 2. Seed broadcasts
    const sampleBroadcasts: Omit<Broadcast, 'id' | 'createdAt'>[] = [
      {
        title: 'إشراقة الصباح: أسرار الطاقة والنشاط في أول ساعة بعد الاستيقاظ',
        description: 'حلقة إذاعية ملهمة تتناول الخطوات الذهبية لبدء يوم مفعم بالحيوية، بدءاً من شرب الماء، والتعرض لضوء الشمس الطبيعي، وممارسة تمارين التمدد الصباحية.',
        date: '2026-11-01',
        topic: 'العادات الصباحية',
        imageUrl: '/assets/images/morning_broadcast_mic_1793901821444.jpg',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        title: 'صوت العافية: دليلك الذكي للتغذية المتوازنة في بيئة العمل والمدرسة',
        description: 'نصائح عملية لاختيار الوجبات الخفيفة الصحية خلال الدوام المدرسي والوظيفي، وكيفية تجنب خمول ما بعد الظهيرة والاعتماد المفرط على السكريات والمنبهات.',
        date: '2026-11-03',
        topic: 'التغذية السليمة',
        imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      },
      {
        title: 'نبضات ذهنية: كيف تحمي صحتك النفسية من ضغوط الشاشات الرقمية؟',
        description: 'إرشادات نفسية سلوكية للتعامل مع الإرهاق الرقمي، وتنظيم ساعات استخدام الهواتف الذكية قبل النوم لضمان نوم عميق ومريح.',
        date: '2026-11-05',
        topic: 'الصحة النفسية',
        imageUrl: 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&w=800&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      }
    ];

    for (const item of sampleBroadcasts) {
      await addDoc(collection(db, 'broadcasts'), { ...item, createdAt: new Date().toISOString() });
    }

    // 3. Seed Lectures
    const sampleLectures: Omit<Lecture, 'id' | 'createdAt'>[] = [
      {
        title: 'الوقاية من الأمراض المزمنة: خارطة طريق لعمر مديد بصحة مثالية',
        speaker: 'د. خالد عبد الرحمن السبيعي (استشاري طب الأسرة والمجتمع)',
        description: 'محاضرة شاملة توضح العوامل الرئيسية المسببة لارتفاع ضغط الدم والسكري، وكيف يمكن لتعديلات نمط الحياة البسيطة أن تقلل من مخاطر الإصابة بنسبة تتجاوز 70%.',
        date: '2026-10-25',
        duration: '45 دقيقة',
        topic: 'الطب الوقائي',
        imageUrl: '/assets/images/awareness_lecture_hall_1793901820498.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4'
      },
      {
        title: 'الأمن الدوائي والاستخدام الرشيد للمضادات الحيوية',
        speaker: 'د. مريم بنت صالح الفهد (أستاذة الصيدلة السريرية)',
        description: 'محاضرة توعوية تحذر من مخاطر الاستخدام العشوائي للمضادات الحيوية وأثرها على مناعة الجسم ومقاومة البكتيريا، مع إرشادات تخزين الأدوية في المنزل بأمان.',
        date: '2026-10-28',
        duration: '35 دقيقة',
        topic: 'التثقيف الدوائي',
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U'
      },
      {
        title: 'صحة الأطفال وبناء المناعة في المراحل العمرية المبكرة',
        speaker: 'د. سلطان بن ناصر الدوسري (استشاري طب أطفال ورعاية أولية)',
        description: 'دليل شامل للأمهات والآباء حول التطعيمات الأساسية، وبناء العادات الغذائية الصحية السليمة للأطفال، وتفادي السمنة المبكرة.',
        date: '2026-11-02',
        duration: '50 دقيقة',
        topic: 'صحة الطفل والأسرة',
        imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw'
      }
    ];

    for (const item of sampleLectures) {
      await addDoc(collection(db, 'lectures'), { ...item, createdAt: new Date().toISOString() });
    }

    // 4. Seed Interviews
    const sampleInterviews: Omit<Interview, 'id' | 'createdAt'>[] = [
      {
        title: 'حوار الصميم: رحلة التعافي من السمنة وتغيير نمط الحياة',
        guestName: 'الكابتن عبد العزيز المنصور',
        guestTitle: 'أخصائي تأهيل حركي ومبتكر برنامج "خطوات للحياة"',
        description: 'حوار ملهم وممتع يتناول العوامل النفسية للدافع الذاتي، وكيف بدأ برنامجه الرياضي الذي غيّر حياة الآلاف بمجرد المشي اليومي والوعي بالحصة الغذائية.',
        date: '2026-10-20',
        topic: 'اللياقة والنشاط البدني',
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4'
      },
      {
        title: 'لقاء خاص: النوم الصحي وأثره الخفي على الإنتاجية والمناعة',
        guestName: 'د. هند بنت إبراهيم القحطاني',
        guestTitle: 'استشارية طب اضطرابات النوم بمركز الأبحاث الطبية',
        description: 'مقابلة علمية تكشف أسرار الساعة البيولوجية ومراحل النوم، وأهم النصائح للتخلص من الأرق دون الحاجة للمهدئات الطبية.',
        date: '2026-11-04',
        topic: 'جودة النوم والصحة',
        imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U'
      }
    ];

    for (const item of sampleInterviews) {
      await addDoc(collection(db, 'interviews'), { ...item, createdAt: new Date().toISOString() });
    }

    // 5. Seed Quizzes
    const sampleQuizzes: Omit<Quiz, 'id' | 'createdAt'>[] = [
      {
        title: 'اختبار مؤشر نمط الحياة اليومي والعادات الصحية',
        description: 'استبانة تفاعلية سريعة مكونة من 6 أسئلة دقيقة لقياس مدى توافق يومك مع الإرشادات الصحية المعتمدة لمنظمة الصحة العالمية ووزارة الصحة.',
        category: 'نمط الحياة العام',
        imageUrl: '/assets/images/healthy_habits_quiz_1793901821855.jpg',
        questions: [
          {
            id: 'q1',
            questionText: 'كم لتراً من الماء النقي تشرب يومياً في المتوسط؟',
            type: 'multiple_choice',
            options: ['أقل من لتر واحد', 'بين 1 إلى 2 لتر', 'أكثر من 2 إلى 3 لترات (المعدل الموصى به)', 'لا أهتم وأشرب فقط عند العطش الشديد'],
            correctAnswerIndex: 2,
            explanation: 'شرب 2 إلى 3 لترات يومياً يضمن كفاءة ترطيب الخلايا ووظائف الكلى والنشاط الذهني.'
          },
          {
            id: 'q2',
            questionText: 'هل تمارس نشاطاً بدنياً معتدلاً (كالمشي السريع) لمدة 150 دقيقة على الأقل أسبوعياً؟',
            type: 'true_false',
            options: ['نعم، ملتزم بممارسة الرياضة أسبوعياً', 'لا، نمط حياتي يغلب عليه الجلوس والخمول'],
            correctAnswerIndex: 0,
            explanation: 'توصي الإرشادات الطبية بـ 150 دقيقة أسبوعياً من النشاط المعتدل للحفاظ على كفاءة القلب والشرايين.'
          },
          {
            id: 'q3',
            questionText: 'كم ساعة نوم منتظمة تنالها في اليوم والليلة؟',
            type: 'multiple_choice',
            options: ['أقل من 5 ساعات', 'بين 5 إلى 6 ساعات', 'بين 7 إلى 8 ساعات نوم متصل (المعدل المثالي)', 'أكثر من 10 ساعات مع تقطع مستمر'],
            correctAnswerIndex: 2,
            explanation: 'النوم من 7 إلى 8 ساعات يومياً يعزز تجديد الخلايا واستقرار مستويات هرمون الكورتيزول.'
          },
          {
            id: 'q4',
            questionText: 'تناول الخضار والفواكه الطازجة جزء أساسي من وجباتي اليومية الرئيسية.',
            type: 'true_false',
            options: ['صح، أحرص على حصتين إلى 3 حصص يومياً', 'خطأ، نادراً ما أتناول الخضار والفواكه الطازجة'],
            correctAnswerIndex: 0,
            explanation: 'الألياف ومضادات الأكسدة في الخضار والفواكه هي حائط الصد الأساسي ضد الالتهابات ومشاكل الجهاز الهضمي.'
          },
          {
            id: 'q5',
            questionText: 'كيف تتعامل مع استخدام الشاشات والأجهزة الذكية قبل الخلود للنوم؟',
            type: 'multiple_choice',
            options: ['أستخدم الهاتف حتى أغفو في السرير', 'أوقف الشاشات قبل 30 إلى 60 دقيقة من النوم', 'أشاهد التلفاز في غرفة النوم بانتظام', 'أستخدم الوضع الليلي وأتابع التصفح لساعات'],
            correctAnswerIndex: 1,
            explanation: 'الضوء الأزرق يثبط إفراز هرمون الميلاتونين المسؤول عن الدخول في النوم العميق.'
          },
          {
            id: 'q6',
            questionText: 'هل تحرص على إجراء الفحص الطبي الدوري الشامل مرة كل عام على الأقل؟',
            type: 'true_false',
            options: ['نعم، ألتزم بالفحص الاستباقي سنوياً', 'لا، أذهب فقط للطبيب عند الشعور بألم حاد'],
            correctAnswerIndex: 0,
            explanation: 'الفحص الدوري الاستباقي يكشف بوادر الاضطرابات الصحية قبل تفاقمها بزمن كافٍ للعلاج المبكر.'
          }
        ]
      },
      {
        title: 'مقياس جودة التغذية والحد من السكريات المضافة',
        description: 'هل تعرف مقدار السكر والدهون المتحولة التي تتناولها خفية؟ هذا المقياس يمنحك مؤشراً حقيقياً حول نقاء نظامك الغذائي.',
        category: 'التغذية والوزن',
        imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
        questions: [
          {
            id: 'nut1',
            questionText: 'كم مرة تتناول المشروبات الغازية أو مشروبات الطاقة أو العصائر المحلاة أسبوعياً؟',
            type: 'multiple_choice',
            options: ['يومياً (أكثر من علبة)', '3 إلى 5 مرات أسبوعياً', 'مرة واحدة أو في المناسبات فقط', 'لا أتناولها إطلاقاً وأفضل الماء والعصائر الطبيعية دون سكر'],
            correctAnswerIndex: 3,
            explanation: 'المشروبات المحلاة هي أكبر مصدر مفاجئ للسكريات السريعة التي ترفع مقاومة الإنسولين.'
          },
          {
            id: 'nut2',
            questionText: 'قراءة الملصق الغذائي وحساب السعرات ونسبة الدهون والسكر قبل شراء المنتجات المعلبة عادة ثابتة لدي.',
            type: 'true_false',
            options: ['صح، أقرأ جدول الحقائق الغذائية والمكونات', 'خطأ، أشتري بناءً على المذاق والشكل فقط'],
            correctAnswerIndex: 0,
            explanation: 'الوعي بقراءة البطاقة الغذائية يحميك من الزيوت المهدرجة ومسميات السكر المستترة.'
          },
          {
            id: 'nut3',
            questionText: 'أي من التالي يصف نمط تناولك للوجبات السريعة والمقليات؟',
            type: 'multiple_choice',
            options: ['أكثر من 3 مرات بالأسبوع', 'مرة إلى مرتين بالأسبوع', 'مرة شهرياً عند الضرورة', 'أعتمد على الطهي المنزلي الصحي وزيت الزيتون بالكامل'],
            correctAnswerIndex: 3,
            explanation: 'التقليل من الأطعمة المقلية يقلل من دهون الأحشاء ومستويات الكوليسترول الضار (LDL).'
          }
        ]
      }
    ];

    for (const item of sampleQuizzes) {
      await addDoc(collection(db, 'quizzes'), { ...item, createdAt: new Date().toISOString() });
    }

    // 6. Seed Events
    const sampleEvents: Omit<EventItem, 'id' | 'createdAt'>[] = [
      {
        title: 'ماراثون المشي المجتمعي: "خطوة لصحتك"',
        description: 'فعالية مشي عائلية مفتوحة في ممشى حديقة الملك عبد الله بمشاركة مئات المتطوعين، تتخللها محطات قياس الضغط والسكر واستشارات رياضية مجانية.',
        date: '2026-11-20',
        time: '04:00 مساءً - 08:00 مساءً',
        location: 'الرياض - ممشى حديقة الملك عبد الله',
        status: 'upcoming',
        imageUrl: '/assets/images/hero_awareness_banner_1793901820998.jpg',
        isFeatured: true
      },
      {
        title: 'الملتقى التوعوي السنوي لصحة المرأة والطفل',
        description: 'سلسلة جلسات حوارية وورش عمل تفاعلية بمشاركة نخبة من الطبيبات والاستشاريات لمناقشة التغذية السليمة، والرضاعة الطبيعية، وصحة الأم النفسية.',
        date: '2026-11-28',
        time: '09:00 صباحاً - 02:00 ظهراً',
        location: 'مركز الملك سلمان الاجتماعي - القاعة الكبرى',
        status: 'upcoming',
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
        isFeatured: false
      },
      {
        title: 'ورشة تدريبية: الإسعافات الأولية وإنقاذ الحياة في البيئة المدرسية',
        description: 'تدريب عملي للمعلمين والكوادر الإدارية على الإنعاش القلبي الرئوي (CPR) والتعامل مع حالات الغصة والحروق والإغماءات الطارئة.',
        date: '2026-10-15',
        time: '10:00 صباحاً - 01:00 ظهراً',
        location: 'قاعة التدريب الصحي المجتمعي',
        status: 'completed',
        imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
        isFeatured: false
      }
    ];

    for (const item of sampleEvents) {
      await addDoc(collection(db, 'events'), { ...item, createdAt: new Date().toISOString() });
    }

    // 7. Seed Registrations
    const sampleRegistrations: Omit<RegistrationItem, 'id' | 'createdAt'>[] = [
      {
        title: 'التسجيل في برنامج سفراء الصحة المجتمعية (الدفعة الرابعة)',
        description: 'برنامج تدريبي مكثف لمدة أسبوعين يؤهل المتطوعين لنشر الثقافة الصحية في أحيائهم ومقرات عملهم مع منح شهادات معتمدة وساعات تطوعية موثقة.',
        externalUrl: 'https://forms.gle/sampleAwarenessForm2026',
        deadline: '2026-11-18',
        status: 'open',
        imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'حجز موعد للفحص المجاني المبكر لكتلة الجسم ومعدل الأيض',
        description: 'احجز موعدك المجاني في العيادة المتنقلة للمبادرة للحصول على فحص دقيق لمؤشر كتلة الجسم (BMI)، ونسبة الدهون العضلية، وتحليل ضغط الدم مع أخصائي التغذية.',
        externalUrl: 'https://forms.gle/sampleHealthCheckup2026',
        deadline: '2026-11-25',
        status: 'open',
        imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'التسجيل في ورشة تحضير الوجبات الصحية العائلية الذكية',
        description: 'ورشة طهي حية بقيادة خبير تغذية لتعليم الأمهات والآباء أسرار إعداد وجبات صحية شهية وسريعة بتكلفة اقتصادية مناسبة.',
        externalUrl: 'https://forms.gle/sampleCookingWorkshopClosed',
        deadline: '2026-10-30',
        status: 'closed',
        imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80'
      }
    ];

    for (const item of sampleRegistrations) {
      await addDoc(collection(db, 'registrations'), { ...item, createdAt: new Date().toISOString() });
    }

    return true;
  } catch (error) {
    console.warn('Initial data seeding deferred or skipped (requires administrator write privileges):', error);
    return false;
  }
}
