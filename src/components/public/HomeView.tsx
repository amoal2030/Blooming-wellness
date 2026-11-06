import React, { useState } from 'react';
import { 
  InitiativeSettings, 
  Broadcast, 
  Lecture, 
  EventItem, 
  ActiveTab 
} from '../../types';
import { submitInquiry } from '../../services/dataService';
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
  ExternalLink
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

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-stone-900 to-stone-900 text-white">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={settings.heroImageUrl || '/src/assets/images/hero_awareness_banner_1793901820998.jpg'}
            alt="شعار وخلفية المبادرة"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-3xl space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>منصة رسمية متكاملة لخدمة المجتمع والصحة العامة</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-sm text-balance">
              {settings.initiativeName || 'منصة المبادرة التوعوية'}
            </h1>

            <p className="text-base sm:text-xl text-stone-200 leading-relaxed font-normal">
              {settings.tagline || 'نحو مجتمع صحي واعٍ يتبنى العادات الإيجابية ويمتلك ثقافة الوقاية وجودة الحياة.'}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => {
                  setActiveTab('quizzes');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <CheckSquare className="w-5 h-5" />
                <span>اختبر مدى صحة عاداتك الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('events');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl border border-white/20 backdrop-blur-md transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>استكشف الفعاليات والأنشطة</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Partner & Supporting Logos */}
      {settings.partnerLogos && settings.partnerLogos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200/80 p-6">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider text-center mb-4">
              الشعارات والجهات المشاركة والداعمة
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
              {settings.partnerLogos.map((partner) => (
                <div 
                  key={partner.id}
                  className="flex items-center justify-center gap-3 p-3 rounded-xl bg-stone-50 hover:bg-stone-100/80 transition-colors border border-stone-100"
                >
                  <img
                    src={partner.imageUrl}
                    alt={partner.name}
                    className="w-10 h-10 object-contain rounded-full shadow-xs bg-white p-0.5"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-xs font-bold text-stone-800 text-center">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. About, Vision, Mission & Goals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* About Box (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-stone-200 space-y-6">
            <div className="inline-flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>نبذة تعريفية عن المبادرة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-snug">
              نحو بناء ثقافة وقائية راسخة لكل فرد وأسرة
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {settings.aboutText}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>الرؤية</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">{settings.visionText}</p>
              </div>

              <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-sm mb-2">
                  <Target className="w-4 h-4 text-teal-600" />
                  <span>الرسالة</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">{settings.missionText}</p>
              </div>
            </div>
          </div>

          {/* Goals Box (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-stone-900 to-stone-800 text-white p-8 sm:p-10 rounded-3xl shadow-md space-y-6">
            <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>أهداف المبادرة التوعوية</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold leading-tight">
              أهداف استراتيجية لتعزيز جودة الحياة
            </h3>
            <ul className="space-y-4">
              {settings.goals.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                    0{idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-stone-300 leading-relaxed">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Interactive Habits Quiz Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-emerald-200">
                قسم تفاعلي للزوار
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                هل تسير على نمط حياة صحي ومتوازن؟
              </h2>
              <p className="text-stone-200 text-sm sm:text-base leading-relaxed max-w-2xl">
                أجب عن بضعة أسئلة بسيطة وسريعة لتقييم عاداتك في شرب الماء، النوم، التغذية، والنشاط البدني، واحصل على تقرير فوري بنتيجتك ونصائح صحية موجهة.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveTab('quizzes');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-white text-emerald-900 hover:bg-stone-100 font-bold text-sm rounded-xl shadow-md transition-all hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
                >
                  <CheckSquare className="w-5 h-5 text-emerald-700" />
                  <span>بدء الاختبار التفاعلي الآن</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/20">
                <img
                  src="/src/assets/images/healthy_habits_quiz_1793901821855.jpg"
                  alt="اختبار العادات الصحية"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Highlights of Recent Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Morning Broadcasts Highlights */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-1">
                <Radio className="w-4 h-4" />
                <span>الإذاعات الصباحية</span>
              </div>
              <h2 className="text-2xl font-black text-stone-900">أحدث الحلقات الإذاعية</h2>
            </div>
            <button
              onClick={() => {
                setActiveTab('broadcasts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 transition-colors"
            >
              <span>عرض جميع الإذاعات</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentBroadcasts.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                <div className="h-44 relative bg-stone-100 overflow-hidden">
                  <img
                    src={item.imageUrl || '/src/assets/images/morning_broadcast_mic_1793901821444.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                    {item.topic}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-stone-400 font-medium block mb-1">{item.date}</span>
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => onOpenVideoModal(item.title, item.videoUrl, item.audioUrl)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-emerald-700" />
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
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-1">
                <Video className="w-4 h-4" />
                <span>المحاضرات التوعوية</span>
              </div>
              <h2 className="text-2xl font-black text-stone-900">محاضرات تثقيفية موجهة</h2>
            </div>
            <button
              onClick={() => {
                setActiveTab('lectures');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 transition-colors"
            >
              <span>عرض جميع المحاضرات</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentLectures.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row group"
              >
                <div className="sm:w-2/5 h-48 sm:h-auto relative bg-stone-100 overflow-hidden shrink-0">
                  <img
                    src={item.imageUrl || '/src/assets/images/awareness_lecture_hall_1793901820498.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white text-emerald-800 flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-emerald-800 mr-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-2">
                      <span className="font-semibold text-emerald-700">{item.topic}</span>
                      <span>·</span>
                      <span>{item.duration || '40 دقيقة'}</span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium mt-1">
                      المحاضر: {item.speaker}
                    </p>
                    <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100">
                    <button
                      onClick={() => onOpenVideoModal(item.title, item.videoUrl)}
                      className="w-full py-2 bg-stone-100 hover:bg-emerald-50 text-stone-800 hover:text-emerald-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
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
          <div className="bg-stone-900 text-white rounded-3xl overflow-hidden shadow-xl border border-stone-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
              <div className="lg:col-span-7 p-8 sm:p-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>الفعالية القادمة الأبرز</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                  {featuredEvent.title}
                </h3>
                <p className="text-stone-300 text-sm leading-relaxed">
                  {featuredEvent.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>التاريخ: {featuredEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>الوقت: {featuredEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>الموقع: {featuredEvent.location}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      setActiveTab('events');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    تفاصيل كافة الفعاليات
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('registrations');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 transition-colors"
                  >
                    التسجيل في الأنشطة
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden bg-stone-800">
                <img
                  src={featuredEvent.imageUrl || '/src/assets/images/hero_awareness_banner_1793901820998.jpg'}
                  alt={featuredEvent.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 6. Contact and Inquiries Section */}
      <section id="contact-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              تواصل واستفسارات
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              يسعدنا استقبال مقترحاتكم واستفساراتكم
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm">
              فريق المبادرة التوعوية جاهز للإجابة على استفساراتكم والتعاون مع المؤسسات المجتمعية.
            </p>
          </div>

          <form onSubmit={handleInquirySubmit} className="max-w-2xl mx-auto space-y-4">
            {inquirySuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>تم إرسال رسالتك بنجاح! سيقوم فريق المبادرة بمراجعتها والتواصل معك قريباً.</span>
              </div>
            )}

            {inquiryError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs">
                {inquiryError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  الاسم الكريم <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="محمد عبد الله"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  البريد الإلكتروني <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-stone-800 dir-ltr text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                رقم الجوال (اختياري)
              </label>
              <input
                type="tel"
                value={inquiryPhone}
                onChange={(e) => setInquiryPhone(e.target.value)}
                placeholder="+966 5X XXX XXXX"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-stone-800 dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                نص الرسالة أو الاستفسار <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="اكتب استفسارك أو مقترحك هنا بكل وضوح..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-stone-800 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={inquirySubmitting}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
