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
import { 
  Radio, 
  Video, 
  Calendar, 
  CheckSquare, 
  Target, 
  Compass, 
  Eye, 
  ArrowLeft, 
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
      setInquiryError('يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، والرسالة).');
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
      setInquiryError('حدث خطأ أثناء إرسال استفسارك، يرجى المحاولة لاحقاً.');
    } finally {
      setInquirySubmitting(false);
    }
  };

  const featuredEvent = events.find((e) => e.isFeatured) || events[0];
  const recentBroadcasts = broadcasts.slice(0, 3);
  const recentLectures = lectures.slice(0, 2);

  // Exactly two authorized partners
  const authorizedPartners = (settings.partnerLogos && settings.partnerLogos.length === 2)
    ? settings.partnerLogos
    : [
        { id: 'moe', name: 'وزارة التعليم', imageUrl: '/assets/logos/ministry_of_education.svg' },
        { id: 'shatee_high_school', name: 'مدرسة ثانوية الشاطئ', imageUrl: '/assets/logos/alshatee_high_school.svg' }
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
            
            {/* Right Column: Text & CTAs (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-right">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#84d2ea]/30 text-[#84d2ea] text-xs font-bold backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#ea8c38] animate-pulse" />
                <span>برعاية وزارة التعليم وتنظيم ثانوية الشاطئ</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-sm text-balance">
                  {settings.initiativeName || 'مبادرة عافية تُزهر'}
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-[#84d2ea] leading-snug">
                  {settings.tagline || 'بالتوازن تحصل العافية.. وبالعافية نَزْهَر'}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#d1e6ec] leading-relaxed font-normal max-w-2xl">
                منصة توعوية رائدة لترسيخ عادات الحياة المتوازنة: الغذاء الصحي، النشاط البدني، جودة النوم، والعافية النفسية لطلاب ثانوية الشاطئ والمجتمع.
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
                  <span>اختبر مدى صحة عاداتك الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setActiveTab('events');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2.5 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-2xl border border-white/25 backdrop-blur-md transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Calendar className="w-5 h-5 text-[#84d2ea]" />
                  <span>استكشف الفعاليات والأنشطة</span>
                </button>
              </div>
            </div>

            {/* Left Column: Official Emblem Display (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#2e9e66] via-[#389eb3] to-[#ea8c38] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-white p-3.5 shadow-2xl border-4 border-white/40 flex items-center justify-center overflow-hidden">
                  <img
                    src={getAssetUrl(settings.logoUrl || '/assets/aistudio/image_8a68eff7.png')}
                    alt="شعار مبادرة عافية تُزهر الرسمي"
                    className="w-full h-full object-contain transform group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Partner & Supporting Logos - Exactly 2 Entities: وزارة التعليم وثانوية الشاطئ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-[#dbe8ed] p-6 sm:p-8">
          <p className="text-xs font-extrabold text-[#134e5e] uppercase tracking-wider text-center mb-6">
            الشعارات والجهات المشاركة والداعمة للمبادرة
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {authorizedPartners.map((partner) => (
              <div 
                key={partner.id} 
                className="flex items-center justify-center gap-5 p-4 rounded-2xl bg-[#f7fbfc] hover:bg-[#eaf6fa] transition-colors border border-[#d8e7ec]"
              >
                <div className="w-32 h-16 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={getAssetUrl(partner.imageUrl)}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-sm font-extrabold text-[#0e3c48]">{partner.name}</span>
                  <span className="text-xs text-[#526f78]">شريك وراعي معتمد للمبادرة</span>
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
            ركائز التوازن في الشعار
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0e3c48]">
            أركان العافية الأربعة المتكاملة
          </h2>
          <p className="text-xs sm:text-sm text-[#526f78]">
            ترتكز مبادرة "عافية تُزهر" على أربعة عناصر حيوية مستوحاة من تفاصيل شعارنا الرسمي لتحقيق التوازن التام.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <div className="bg-white p-6 rounded-3xl border border-[#dbe8ed] shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#e8f7ee] text-[#2e9e66] flex items-center justify-center">
              <Apple className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0e3c48]">التغذية السليمة</h3>
            <p className="text-xs text-[#526f78] leading-relaxed">
              رمز الورقة والسنبلة: اعتماد الأغذية الطبيعية الغنية بالألياف وشرب الماء النقي والابتعاد عن السكريات المصنعة.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-6 rounded-3xl border border-[#dbe8ed] shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#eaf6fa] text-[#134e5e] flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0e3c48]">النشاط والحركة</h3>
            <p className="text-xs text-[#526f78] leading-relaxed">
              رمز العدّاء النشط: تحفيز الحركة اليومية وممارسة المشي والتمارين الرياضية لمكافحة الخمول البدني.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-6 rounded-3xl border border-[#dbe8ed] shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#eaf6fa] text-[#389eb3] flex items-center justify-center">
              <Moon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0e3c48]">النوم الصحي والراحة</h3>
            <p className="text-xs text-[#526f78] leading-relaxed">
              رمز الهلال والنجوم: تنظيم ساعات النوم الكافية ليلاً لدعم تجديد الخلايا ورفع التحصيل الدراسي والتركيز الذهني.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white p-6 rounded-3xl border border-[#dbe8ed] shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#fef4ea] text-[#ea8c38] flex items-center justify-center">
              <Flower2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0e3c48]">الصحة النفسية والازدهار</h3>
            <p className="text-xs text-[#526f78] leading-relaxed">
              رمز الزهرة المتفتحة: التوازن الوجداني والتعامل الإيجابي مع الضغوط المدرسية ليزهر الطالب والمجتمع بالعافية.
            </p>
          </div>

        </div>
      </section>

      {/* 4. About, Vision, Mission & Goals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* About Box (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-[#dbe8ed] space-y-6">
            <div className="inline-flex items-center gap-2 text-[#134e5e] text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4 text-[#2e9e66]" />
              <span>نبذة تعريفية عن مبادرة عافية تُزهر</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0e3c48] leading-snug">
              بيئة مدرسية ومجتمعية تتوازن صحياً وتزهر بالعافية
            </h2>
            <p className="text-[#526f78] text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {settings.aboutText}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#edf3f5]">
              <div className="p-4 bg-[#eaf6fa] rounded-2xl border border-[#cde6ee]">
                <div className="flex items-center gap-2 text-[#134e5e] font-bold text-sm mb-2">
                  <Eye className="w-4 h-4 text-[#389eb3]" />
                  <span>الرؤية</span>
                </div>
                <p className="text-xs text-[#0c2b33] leading-relaxed">{settings.visionText}</p>
              </div>

              <div className="p-4 bg-[#e8f7ee] rounded-2xl border border-[#c4e9d2]">
                <div className="flex items-center gap-2 text-[#248354] font-bold text-sm mb-2">
                  <Target className="w-4 h-4 text-[#2e9e66]" />
                  <span>الرسالة</span>
                </div>
                <p className="text-xs text-[#0c2b33] leading-relaxed">{settings.missionText}</p>
              </div>
            </div>
          </div>

          {/* Goals Box (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0e3c48] to-[#134e5e] text-white p-8 sm:p-10 rounded-3xl shadow-md space-y-6">
            <div className="inline-flex items-center gap-2 text-[#84d2ea] text-xs font-bold uppercase tracking-wider">
              <Target className="w-4 h-4 text-[#ea8c38]" />
              <span>أهداف المبادرة</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold leading-tight">
              أهداف استراتيجية لتعزيز جودة الحياة
            </h3>
            <ul className="space-y-4">
              {settings.goals.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white/10 text-[#84d2ea] font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                    0{idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-[#d1e6ec] leading-relaxed">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Interactive Habits Quiz Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#134e5e] via-[#1b6375] to-[#2e9e66] text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-block bg-white/15 px-3 py-1 rounded-full text-xs font-extrabold text-[#fef4ea] border border-white/20">
                مقياس عافية التفاعلي
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                هل تسير على نمط حياة متوازن وصحي؟
              </h2>
              <p className="text-[#e2f1f5] text-sm sm:text-base leading-relaxed max-w-2xl">
                أجب عن بضعة أسئلة تفاعلية سريعة لقياس مؤشر عاداتك في شرب الماء، الغذاء، ساعات النوم، والحركة البدنية، واحصل على تقريرك الصحي فوراً.
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
                  <span>بدء اختبار التوازن الآن</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-52 h-52 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/30 bg-white p-2">
                <img
                  src={getAssetUrl(settings.logoUrl || '/assets/aistudio/image_8a68eff7.png')}
                  alt="شعار عافية تُزهر"
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
              <div className="flex items-center gap-2 text-[#134e5e] text-xs font-extrabold mb-1">
                <Radio className="w-4 h-4 text-[#2e9e66]" />
                <span>الإذاعات الصباحية</span>
              </div>
              <h2 className="text-2xl font-black text-[#0e3c48]">أحدث الحلقات الإذاعية</h2>
            </div>
            <button
              onClick={() => {
                setActiveTab('broadcasts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-bold text-[#134e5e] hover:text-[#2e9e66] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>عرض جميع الإذاعات</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentBroadcasts.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl border border-[#dbe8ed] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                <div className="h-44 relative bg-[#f1f7f9] overflow-hidden">
                  <img
                    src={getAssetUrl(item.imageUrl || '/src/assets/images/morning_broadcast_mic_1793901821444.jpg')}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-[#0e3c48]/85 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-lg">
                    {item.topic}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-[#526f78] font-medium block mb-1">{item.date}</span>
                    <h3 className="text-base font-bold text-[#0e3c48] group-hover:text-[#134e5e] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#526f78] mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#edf3f5] flex items-center justify-between">
                    <button
                      onClick={() => onOpenVideoModal(item.title, item.videoUrl, item.audioUrl)}
                      className="text-xs font-bold text-[#2e9e66] hover:text-[#248354] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#2e9e66]" />
                      <span>استماع / مشاهدة</span>
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
              <div className="flex items-center gap-2 text-[#134e5e] text-xs font-extrabold mb-1">
                <Video className="w-4 h-4 text-[#389eb3]" />
                <span>المحاضرات التوعوية</span>
              </div>
              <h2 className="text-2xl font-black text-[#0e3c48]">محاضرات تثقيفية موجهة</h2>
            </div>
            <button
              onClick={() => {
                setActiveTab('lectures');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-bold text-[#134e5e] hover:text-[#2e9e66] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>عرض جميع المحاضرات</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentLectures.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-3xl border border-[#dbe8ed] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row group"
              >
                <div className="sm:w-2/5 h-48 sm:h-auto relative bg-[#f1f7f9] overflow-hidden shrink-0">
                  <img
                    src={getAssetUrl(item.imageUrl || '/src/assets/images/awareness_lecture_hall_1793901820498.jpg')}
                    alt={item.title}
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
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#526f78] mb-2">
                      <span className="font-bold text-[#134e5e]">{item.topic}</span>
                      <span>·</span>
                      <span>{item.duration || '40 دقيقة'}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#0e3c48] group-hover:text-[#134e5e] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#526f78] font-medium mt-1">
                      المحاضر: {item.speaker}
                    </p>
                    <p className="text-xs text-[#526f78] mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#edf3f5]">
                    <button
                      onClick={() => onOpenVideoModal(item.title, item.videoUrl)}
                      className="w-full py-2 bg-[#eaf6fa] hover:bg-[#d8eff7] text-[#134e5e] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>مشاهدة المحاضرة</span>
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
              <div className="lg:col-span-7 p-8 sm:p-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ea8c38]/20 text-[#ea8c38] border border-[#ea8c38]/30 rounded-full text-xs font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>الفعالية القادمة الأبرز</span>
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
                    <span>التاريخ: {featuredEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#84d2ea] shrink-0" />
                    <span>الوقت: {featuredEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-[#84d2ea] shrink-0" />
                    <span>الموقع: {featuredEvent.location}</span>
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
                    تفاصيل كافة الفعاليات
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('registrations');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl border border-white/20 transition-colors cursor-pointer"
                  >
                    التسجيل في الأنشطة
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden bg-[#134e5e]">
                <img
                  src={getAssetUrl(featuredEvent.imageUrl || '/src/assets/images/hero_awareness_banner_1793901820998.jpg')}
                  alt={featuredEvent.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 7. Contact and Inquiries Section */}
      <section id="contact-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#dbe8ed] p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
            <span className="text-xs font-extrabold text-[#134e5e] uppercase tracking-wider">
              تواصل واستفسارات
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0e3c48]">
              يسعدنا استقبال مقترحاتكم واستفساراتكم
            </h2>
            <p className="text-[#526f78] text-xs sm:text-sm">
              فريق عمل مبادرة عافية تُزهر بمدرسة ثانوية الشاطئ جاهز للرد على استفسارات الطلاب وأولياء الأمور والمجتمع.
            </p>
          </div>

          <form onSubmit={handleInquirySubmit} className="max-w-2xl mx-auto space-y-4">
            {inquirySuccess && (
              <div className="p-4 bg-[#e8f7ee] border border-[#c4e9d2] rounded-2xl text-[#185644] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2e9e66] shrink-0" />
                <span>تم إرسال استفسارك بنجاح! سيقوم فريق المبادرة بمراجعته والتواصل معك.</span>
              </div>
            )}

            {inquiryError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs">
                {inquiryError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0c2b33] mb-1.5">
                  الاسم الكريم <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="محمد عبد الله"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d0e0e6] focus:outline-none focus:ring-2 focus:ring-[#2e9e66] text-xs text-[#0c2b33]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0c2b33] mb-1.5">
                  البريد الإلكتروني <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d0e0e6] focus:outline-none focus:ring-2 focus:ring-[#2e9e66] text-xs text-[#0c2b33] dir-ltr text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0c2b33] mb-1.5">
                رقم الجوال (اختياري)
              </label>
              <input
                type="tel"
                value={inquiryPhone}
                onChange={(e) => setInquiryPhone(e.target.value)}
                placeholder="+966 5X XXX XXXX"
                className="w-full px-4 py-2.5 rounded-xl border border-[#d0e0e6] focus:outline-none focus:ring-2 focus:ring-[#2e9e66] text-xs text-[#0c2b33] dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0c2b33] mb-1.5">
                نص الرسالة أو الاستفسار <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="اكتب استفسارك أو مقترحك هنا بكل وضوح..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#d0e0e6] focus:outline-none focus:ring-2 focus:ring-[#2e9e66] text-xs text-[#0c2b33] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={inquirySubmitting}
              className="w-full py-3.5 bg-[#2e9e66] hover:bg-[#248354] text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{inquirySubmitting ? 'جارٍ الإرسال...' : 'إرسال الرسالة إلى إدارة المبادرة'}</span>
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};
