import React, { useState } from 'react';
import { 
  InitiativeSettings, 
  Broadcast, 
  Lecture, 
  EventItem, 
  ActiveTab 
} from '../../types';
import { submitInquiry } from '../../services/dataService';
import { getAssetUrl } from '../../utils/assets';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Radio, 
  Video, 
  Calendar, 
  CheckSquare, 
  Target, 
  Compass, 
  Eye, 
  ArrowLeft, 
  ArrowRight,
  Send, 
  CheckCircle2, 
  Play, 
  Clock, 
  MapPin,
  Sparkles,
  Apple,
  Activity,
  Moon,
  Flower2
} from 'lucide-react';

interface HomeViewProps {
  settings: InitiativeSettings;
  broadcasts: Broadcast[];
  lectures: Lecture[];
  events: EventItem[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenVideoModal: (title: string, videoUrl?: string, audioUrl?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  settings,
  broadcasts,
  lectures,
  events,
  setActiveTab,
  onOpenVideoModal,
}) => {
  const { t, isRtl, language } = useLanguage();

  // Contact Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryMessage.trim()) {
      setInquiryError(t('contact_error_fill', 'يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، والرسالة).'));
      return;
    }

    try {
      setInquirySubmitting(true);
      setInquiryError(null);
      await submitInquiry({
        name: inquiryName.trim(),
        email: inquiryEmail.trim(),
        phone: inquiryPhone.trim(),
        message: inquiryMessage.trim(),
      });
      setInquirySuccess(true);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryPhone('');
      setInquiryMessage('');
      setTimeout(() => setInquirySuccess(false), 6000);
    } catch (err) {
      console.error(err);
      setInquiryError(t('contact_error_generic', 'حدث خطأ أثناء إرسال استفسارك، يرجى المحاولة لاحقاً.'));
    } finally {
      setInquirySubmitting(false);
    }
  };

  const featuredEvent = events.find((e) => e.isFeatured) || events[0];
  const recentBroadcasts = broadcasts.slice(0, 3);
  const recentLectures = lectures.slice(0, 2);

  // Exactly two authorized partners
  const authorizedPartners = (settings.partnerLogos && settings.partnerLogos.length === 2)
    ? settings.partnerLogos.map(p => ({
        ...p,
        name: p.id === 'moe' 
          ? t('partner_moe', p.name) 
          : p.id === 'shatee_high_school' 
          ? t('partner_school', p.name) 
          : p.name
      }))
    : [
        { id: 'moe', name: t('partner_moe', 'وزارة التعليم'), imageUrl: '/assets/logos/ministry_of_education.svg' },
        { id: 'shatee_high_school', name: t('partner_school', 'مدرسة ثانوية الشاطئ'), imageUrl: '/assets/logos/alshatee_high_school.svg' }
      ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section - Styled with Official Brand Teal & Turquoise */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0e3c48] via-[#134e5e] to-[#0e3c48] text-white">
        
        {/* Soft background glow matching logo colors */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#389eb3]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#2e9e66]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text & CTAs (7 cols) */}
            <div className={`lg:col-span-7 space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#84d2ea]/30 text-[#84d2ea] text-xs font-bold backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#ea8c38] animate-pulse" />
                <span>{t('hero_sponsor_badge', 'برعاية وزارة التعليم وتنظيم ثانوية الشاطئ')}</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-sm text-balance">
                  {language === 'ar' ? (settings.initiativeName || t('initiative_name', 'مبادرة عافية تُزهر')) : t('initiative_name', 'Blooming Wellness Initiative')}
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-[#84d2ea] leading-snug">
                  {language === 'ar' ? (settings.tagline || t('tagline', 'بالتوازن تحصل العافية.. وبالعافية نَزْهَر')) : t('tagline')}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#d1e6ec] leading-relaxed font-normal max-w-2xl">
                {t('hero_desc', 'منصة توعوية رائدة لترسيخ عادات الحياة المتوازنة: الغذاء الصحي، النشاط البدني، جودة النوم، والعافية النفسية لطلاب ثانوية الشاطئ والمجتمع.')}
              </p>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => {
                    setActiveTab('quizzes');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2.5 px-6 py-3.5 bg-[#2e9e66] hover:bg-[#248354] text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-[#2e9e66]/30 hover:shadow-[#2e9e66]/50 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <CheckSquare className="w-5 h-5 text-white" />
                  <span>{t('hero_btn_quiz', 'اختبر مدى صحة عاداتك الآن')}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    setActiveTab('events');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2.5 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-2xl border border-white/25 backdrop-blur-md transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Calendar className="w-5 h-5 text-[#84d2ea]" />
                  <span>{t('hero_btn_events', 'استكشف الفعاليات والأنشطة')}</span>
                </button>
              </div>
            </div>

            {/* Emblem Display (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#2e9e66] via-[#389eb3] to-[#ea8c38] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-white p-3.5 shadow-2xl border-4 border-white/40 flex items-center justify-center overflow-hidden">
                  <img
                    src={getAssetUrl(settings.logoUrl || '/assets/aistudio/50c0c8c4-5c4f-4db5-8ada-405779c14cc1_db926d78.png')}
                    alt={isRtl ? 'شعار مبادرة عافية تُزهر الرسمي للتوعية بالصحة والعادات الصحية' : 'Official Blooming Wellness Health Awareness Logo'}
                    className="w-full h-full object-contain transform group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Partner & Supporting Logos - Exactly 2 Entities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white dark:bg-[#122127] rounded-3xl shadow-xl border border-[#dbe8ed] dark:border-[#1e3842] p-6 sm:p-8 transition-colors">
          <p className="text-xs font-extrabold text-[#134e5e] dark:text-[#84d2ea] uppercase tracking-wider text-center mb-6">
            {t('section_partners', 'الجهات المشاركة والداعمة للمبادرة')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {authorizedPartners.map((partner) => (
              <div 
                key={partner.id} 
                className="flex items-center justify-center gap-5 p-4 rounded-2xl bg-[#f7fbfc] dark:bg-[#0b1519] hover:bg-[#eaf6fa] dark:hover:bg-[#162a32] transition-colors border border-[#d8e7ec] dark:border-[#1e3842]"
              >
                <div className="w-32 h-16 flex items-center justify-center overflow-hidden shrink-0 bg-white dark:bg-white/10 rounded-xl p-1">
                  <img
                    src={getAssetUrl(partner.imageUrl)}
                    alt={`${partner.name} - ${isRtl ? 'شريك وراعي معتمد لمبادرة عافية تُزهر' : 'Official Supporting Partner of Blooming Wellness'}`}
                    className="max-h-full max-w-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className={`flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
                  <span className="text-sm font-extrabold text-[#0e3c48] dark:text-white">{partner.name}</span>
                  <span className="text-xs text-[#526f78] dark:text-stone-400">
                    {isRtl ? 'شريك وراعي معتمد للمبادرة' : 'Official Supporting Partner'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The 4 Wellness Pillars of the Logo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-extrabold text-[#2e9e66] uppercase tracking-wider">
            {t('pillars_title', 'الركائز الأربع لنمط الحياة المتوازن')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0e3c48] dark:text-white">
            {t('pillars_title', 'أركان العافية الأربعة المتكاملة')}
          </h2>
          <p className="text-xs sm:text-sm text-[#526f78] dark:text-stone-300">
            {t('pillars_subtitle', 'ترتكز مبادرة "عافية تُزهر" على أربعة عناصر حيوية مستوحاة من تفاصيل شعارنا الرسمي لتحقيق التوازن التام.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <div className={`bg-white dark:bg-[#122127] p-6 rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] shadow-xs hover:shadow-md transition-shadow space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="w-12 h-12 rounded-2xl bg-[#e8f7ee] dark:bg-[#0e2c22] text-[#2e9e66] flex items-center justify-center">
              <Apple className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0e3c48] dark:text-white">
              {t('pillar_nutrition', 'التغذية السليمة')}
            </h3>
            <p className="text-xs text-[#526f78] dark:text-stone-300 leading-relaxed">
              {t('pillar_nutrition_desc', 'رمز الورقة والسنبلة: اعتماد الأغذية الطبيعية الغنية بالألياف وشرب الماء النقي والابتعاد عن السكريات المصنعة.')}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className={`bg-white dark:bg-[#122127] p-6 rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] shadow-xs hover:shadow-md transition-shadow space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="w-12 h-12 rounded-2xl bg-[#eaf6fa] dark:bg-[#0e2730] text-[#134e5e] dark:text-[#84d2ea] flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0e3c48] dark:text-white">
              {t('pillar_activity', 'النشاط والحركة')}
            </h3>
            <p className="text-xs text-[#526f78] dark:text-stone-300 leading-relaxed">
              {t('pillar_activity_desc', 'رمز العدّاء النشط: تحفيز الحركة اليومية وممارسة المشي والتمارين الرياضية لمكافحة الخمول البدني.')}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className={`bg-white dark:bg-[#122127] p-6 rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] shadow-xs hover:shadow-md transition-shadow space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="w-12 h-12 rounded-2xl bg-[#eaf6fa] dark:bg-[#0e2730] text-[#389eb3] flex items-center justify-center">
              <Moon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0e3c48] dark:text-white">
              {t('pillar_sleep', 'النوم الصحي والراحة')}
            </h3>
            <p className="text-xs text-[#526f78] dark:text-stone-300 leading-relaxed">
              {t('pillar_sleep_desc', 'رمز الهلال والنجوم: تنظيم ساعات النوم الكافية ليلاً لدعم تجديد الخلايا ورفع التحصيل الدراسي والتركيز الذهني.')}
            </p>
          </div>

          {/* Pillar 4 */}
          <div className={`bg-white dark:bg-[#122127] p-6 rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] shadow-xs hover:shadow-md transition-shadow space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="w-12 h-12 rounded-2xl bg-[#fef4ea] dark:bg-[#2d1e11] text-[#ea8c38] flex items-center justify-center">
              <Flower2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0e3c48] dark:text-white">
              {t('pillar_mental', 'الصحة النفسية والازدهار')}
            </h3>
            <p className="text-xs text-[#526f78] dark:text-stone-300 leading-relaxed">
              {t('pillar_mental_desc', 'رمز الزهرة المتفتحة: التوازن الوجداني والتعامل الإيجابي مع الضغوط المدرسية ليزهر الطالب والمجتمع بالعافية.')}
            </p>
          </div>

        </div>
      </section>

      {/* 4. About, Vision, Mission & Goals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* About Box (7 cols) */}
          <div className={`lg:col-span-7 bg-white dark:bg-[#122127] p-8 sm:p-10 rounded-3xl shadow-sm border border-[#dbe8ed] dark:border-[#1e3842] space-y-6 transition-colors ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="inline-flex items-center gap-2 text-[#134e5e] dark:text-[#84d2ea] text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4 text-[#2e9e66]" />
              <span>{t('section_about_title', 'نبذة تعريفية عن مبادرة عافية تُزهر')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0e3c48] dark:text-white leading-snug">
              {t('home_balanced_banner_title', 'بيئة مدرسية ومجتمعية تتوازن صحياً وتزهر بالعافية')}
            </h2>
            <p className="text-[#526f78] dark:text-stone-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {language === 'ar' ? (settings.aboutText || t('default_about_text')) : t('default_about_text')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#edf3f5] dark:border-[#1e3842]">
              <div className="p-4 bg-[#eaf6fa] dark:bg-[#0e2730] rounded-2xl border border-[#cde6ee] dark:border-[#1e3842]">
                <div className="flex items-center gap-2 text-[#134e5e] dark:text-[#84d2ea] font-bold text-sm mb-2">
                  <Eye className="w-4 h-4 text-[#389eb3]" />
                  <span>{t('section_vision', 'الرؤية')}</span>
                </div>
                <p className="text-xs text-[#0c2b33] dark:text-stone-200 leading-relaxed">
                  {language === 'ar' ? (settings.visionText || t('default_vision_text')) : t('default_vision_text')}
                </p>
              </div>

              <div className="p-4 bg-[#e8f7ee] dark:bg-[#0e2c22] rounded-2xl border border-[#c4e9d2] dark:border-[#154636]">
                <div className="flex items-center gap-2 text-[#248354] dark:text-[#42df98] font-bold text-sm mb-2">
                  <Target className="w-4 h-4 text-[#2e9e66]" />
                  <span>{t('section_mission', 'الرسالة')}</span>
                </div>
                <p className="text-xs text-[#0c2b33] dark:text-stone-200 leading-relaxed">
                  {language === 'ar' ? (settings.missionText || t('default_mission_text')) : t('default_mission_text')}
                </p>
              </div>
            </div>
          </div>

          {/* Goals Box (5 cols) */}
          <div className={`lg:col-span-5 bg-gradient-to-br from-[#0e3c48] to-[#134e5e] text-white p-8 sm:p-10 rounded-3xl shadow-md space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="inline-flex items-center gap-2 text-[#84d2ea] text-xs font-bold uppercase tracking-wider">
              <Target className="w-4 h-4 text-[#ea8c38]" />
              <span>{t('section_goals', 'أهداف المبادرة')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold leading-tight">
              {t('home_goals_title', 'أهداف استراتيجية لتعزيز جودة الحياة')}
            </h3>
            <ul className="space-y-4">
              {settings.goals.map((goal, idx) => {
                const goalKey = `default_goal_${idx + 1}`;
                const displayGoal = language === 'ar' ? goal : t(goalKey, goal);
                return (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white/10 text-[#84d2ea] font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                      0{idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-[#d1e6ec] leading-relaxed">{displayGoal}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Interactive Habits Quiz Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#134e5e] via-[#1b6375] to-[#2e9e66] text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className={`lg:col-span-8 space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="inline-block bg-white/15 px-3 py-1 rounded-full text-xs font-extrabold text-[#fef4ea] border border-white/20">
                {t('quiz_badge', 'مقياس عافية التفاعلي')}
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {t('home_quiz_callout_title', 'هل تسير على نمط حياة متوازن وصحي؟')}
              </h2>
              <p className="text-[#e2f1f5] text-sm sm:text-base leading-relaxed max-w-2xl">
                {t('home_quiz_callout_desc', 'أجب عن بضعة أسئلة تفاعلية سريعة لقياس مؤشر عاداتك في شرب الماء، الغذاء، ساعات النوم، والحركة البدنية، واحصل على تقريرك الصحي فوراً.')}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveTab('quizzes');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-white text-[#134e5e] hover:bg-[#f7fbfc] font-extrabold text-sm rounded-2xl shadow-md transition-all hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
                >
                  <CheckSquare className="w-5 h-5 text-[#2e9e66]" />
                  <span>{t('home_quiz_callout_btn', 'بدء اختبار التوازن الآن')}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-52 h-52 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/30 bg-white p-2">
                <img
                  src={getAssetUrl(settings.logoUrl || '/assets/aistudio/50c0c8c4-5c4f-4db5-8ada-405779c14cc1_db926d78.png')}
                  alt={isRtl ? 'شعار مبادرة عافية تُزهر - مقياس العادات الصحية ونمط الحياة المتوازن' : 'Blooming Wellness Initiative Logo - Healthy Habits Assessment'}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Highlights of Recent Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Morning Broadcasts Highlights */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-[#134e5e] dark:text-[#84d2ea] text-xs font-extrabold mb-1">
                <Radio className="w-4 h-4 text-[#2e9e66]" />
                <span>{t('nav_broadcasts', 'الإذاعات الصباحية')}</span>
              </div>
              <h2 className="text-2xl font-black text-[#0e3c48] dark:text-white">
                {t('section_latest_broadcasts', 'أحدث الإذاعات الصباحية')}
              </h2>
            </div>
            <button
              onClick={() => {
                setActiveTab('broadcasts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-bold text-[#134e5e] dark:text-[#84d2ea] hover:text-[#2e9e66] dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t('section_view_all', 'عرض الكل')}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentBroadcasts.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-[#122127] rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                <div className="h-44 relative bg-[#f1f7f9] dark:bg-[#0b1519] overflow-hidden">
                  <img
                    src={getAssetUrl(item.imageUrl || '/assets/images/morning_broadcast_mic_1793901821444.jpg')}
                    alt={`${item.title} - ${isRtl ? 'إذاعة مدرسية صباحية مبادرة عافية تُزهر' : 'Morning School Broadcast Blooming Wellness'}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} bg-[#0e3c48]/85 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-lg`}>
                    {item.topic}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className={isRtl ? 'text-right' : 'text-left'}>
                    <span className="text-[11px] text-[#526f78] dark:text-stone-400 font-medium block mb-1">{item.date}</span>
                    <h3 className="text-base font-bold text-[#0e3c48] dark:text-white group-hover:text-[#134e5e] dark:group-hover:text-[#84d2ea] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#526f78] dark:text-stone-300 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#edf3f5] dark:border-[#1e3842] flex items-center justify-between">
                    <button
                      onClick={() => onOpenVideoModal(item.title, item.videoUrl, item.audioUrl)}
                      className="text-xs font-bold text-[#2e9e66] hover:text-[#248354] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#2e9e66]" />
                      <span>{t('action_listen', 'استماع / مشاهدة')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lectures Highlights */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-[#134e5e] dark:text-[#84d2ea] text-xs font-extrabold mb-1">
                <Video className="w-4 h-4 text-[#389eb3]" />
                <span>{t('nav_lectures', 'المحاضرات التوعوية')}</span>
              </div>
              <h2 className="text-2xl font-black text-[#0e3c48] dark:text-white">
                {t('section_latest_lectures', 'المحاضرات التوعوية المميزة')}
              </h2>
            </div>
            <button
              onClick={() => {
                setActiveTab('lectures');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-bold text-[#134e5e] dark:text-[#84d2ea] hover:text-[#2e9e66] dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t('section_view_all', 'عرض الكل')}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentLectures.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-[#122127] rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row group"
              >
                <div className="sm:w-2/5 h-48 sm:h-auto relative bg-[#f1f7f9] dark:bg-[#0b1519] overflow-hidden shrink-0">
                  <img
                    src={getAssetUrl(item.imageUrl || '/assets/images/awareness_lecture_hall_1793901820498.jpg')}
                    alt={`${item.title} - ${isRtl ? 'محاضرة توعوية تثقيفية مبادرة عافية تُزهر' : 'Awareness Lecture Blooming Wellness'}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#0e3c48]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white text-[#134e5e] flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-[#134e5e] mr-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className={isRtl ? 'text-right' : 'text-left'}>
                    <div className="flex items-center gap-2 text-[11px] text-[#526f78] dark:text-stone-400 mb-2">
                      <span className="font-bold text-[#134e5e] dark:text-[#84d2ea]">{item.topic}</span>
                      <span>·</span>
                      <span>{item.duration || '40 min'}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#0e3c48] dark:text-white group-hover:text-[#134e5e] dark:group-hover:text-[#84d2ea] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#526f78] dark:text-stone-300 font-medium mt-1">
                      {t('card_speaker', 'المحاضر')}: {item.speaker}
                    </p>
                    <p className="text-xs text-[#526f78] dark:text-stone-300 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#edf3f5] dark:border-[#1e3842]">
                    <button
                      onClick={() => onOpenVideoModal(item.title, item.videoUrl)}
                      className="w-full py-2 bg-[#eaf6fa] dark:bg-[#1b3d48] hover:bg-[#d8eff7] dark:hover:bg-[#234c5a] text-[#134e5e] dark:text-[#84d2ea] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{t('action_watch', 'مشاهدة المحاضرة')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Upcoming Event */}
        {featuredEvent && (
          <div className="bg-[#0e3c48] text-white rounded-3xl overflow-hidden shadow-xl border border-[#1a5565]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
              <div className={`lg:col-span-7 p-8 sm:p-12 space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ea8c38]/20 text-[#ea8c38] border border-[#ea8c38]/30 rounded-full text-xs font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('card_featured_badge', 'الفعالية القادمة الأبرز')}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                  {featuredEvent.title}
                </h3>
                <p className="text-[#d1e6ec] text-sm leading-relaxed">
                  {featuredEvent.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#d1e6ec]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#84d2ea] shrink-0" />
                    <span>{t('card_date', 'التاريخ')}: {featuredEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#84d2ea] shrink-0" />
                    <span>{t('card_time', 'الوقت')}: {featuredEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-[#84d2ea] shrink-0" />
                    <span>{t('card_location', 'الموقع')}: {featuredEvent.location}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      setActiveTab('events');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-3 bg-[#2e9e66] hover:bg-[#248354] text-white text-xs font-bold rounded-2xl transition-colors cursor-pointer"
                  >
                    {t('hero_btn_events', 'تفاصيل كافة الفعاليات')}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('registrations');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl border border-white/20 transition-colors cursor-pointer"
                  >
                    {t('nav_registrations', 'التسجيل في الأنشطة')}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden bg-[#134e5e]">
                <img
                  src={getAssetUrl(featuredEvent.imageUrl || '/assets/images/hero_awareness_banner_1793901820998.jpg')}
                  alt={`${featuredEvent.title} - ${isRtl ? 'فعالية صحية مجتمعية مبادرة عافية تُزهر' : 'Community Health Event Blooming Wellness'}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 7. Contact and Inquiries Section */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 sm:scroll-mt-28">
        <div className="bg-white dark:bg-[#122127] rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] p-8 sm:p-12 shadow-sm transition-colors">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
            <span className="text-xs font-extrabold text-[#134e5e] dark:text-[#84d2ea] uppercase tracking-wider">
              {t('nav_contact', 'تواصل واستفسارات')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0e3c48] dark:text-white">
              {t('contact_title', 'يسعدنا استقبال مقترحاتكم واستفساراتكم')}
            </h2>
            <p className="text-[#526f78] dark:text-stone-300 text-xs sm:text-sm">
              {t('contact_subtitle', 'فريق عمل مبادرة عافية تُزهر بمدرسة ثانوية الشاطئ جاهز للرد على استفسارات الطلاب وأولياء الأمور والمجتمع.')}
            </p>
          </div>

          <form onSubmit={handleInquirySubmit} className={`max-w-2xl mx-auto space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
            {inquirySuccess && (
              <div className="p-4 bg-[#e8f7ee] dark:bg-[#0e2c22] border border-[#c4e9d2] dark:border-[#154636] rounded-2xl text-[#185644] dark:text-[#42df98] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2e9e66] shrink-0" />
                <span>{t('contact_success', 'تم إرسال استفسارك بنجاح! سيقوم فريق المبادرة بمراجعته والتواصل معك.')}</span>
              </div>
            )}

            {inquiryError && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-rose-800 dark:text-rose-300 text-xs">
                {inquiryError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0c2b33] dark:text-stone-200 mb-1.5">
                  {t('contact_name', 'الاسم الكريم')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder={isRtl ? 'محمد عبد الله' : 'Mohammed Abdullah'}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d0e0e6] dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2e9e66] text-xs text-[#0c2b33]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0c2b33] dark:text-stone-200 mb-1.5">
                  {t('contact_email', 'البريد الإلكتروني')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d0e0e6] dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2e9e66] text-xs text-[#0c2b33] dir-ltr text-start"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0c2b33] dark:text-stone-200 mb-1.5">
                {t('contact_phone', 'رقم الجوال (اختياري)')}
              </label>
              <input
                type="tel"
                value={inquiryPhone}
                onChange={(e) => setInquiryPhone(e.target.value)}
                placeholder="+966 5X XXX XXXX"
                className="w-full px-4 py-2.5 rounded-xl border border-[#d0e0e6] dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2e9e66] text-xs text-[#0c2b33] dir-ltr text-start"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0c2b33] dark:text-stone-200 mb-1.5">
                {t('contact_message', 'نص الرسالة أو الاستفسار')} <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder={isRtl ? 'اكتب استفسارك أو مقترحك هنا بكل وضوح...' : 'Write your inquiry or feedback clearly here...'}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d0e0e6] dark:border-[#1e3842] dark:bg-[#0b1519] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2e9e66] text-xs text-[#0c2b33] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={inquirySubmitting}
              className="w-full py-3.5 bg-[#2e9e66] hover:bg-[#248354] text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{inquirySubmitting ? t('contact_sending_btn', 'جارٍ الإرسال...') : t('contact_send_btn', 'إرسال الرسالة إلى إدارة المبادرة')}</span>
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};
