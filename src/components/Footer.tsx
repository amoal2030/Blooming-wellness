import React from 'react';
import { ActiveTab, InitiativeSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getAssetUrl } from '../utils/assets';
import { Mail, Phone, MapPin, Heart, ArrowUp, BookOpen, ExternalLink } from 'lucide-react';

interface FooterProps {
  settings: InitiativeSettings;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenLoginModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  setActiveTab,
}) => {
  const { t, isRtl, language } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Restrict to ONLY the 2 authorized partners: وزارة التعليم ومدرسة ثانوية الشاطئ
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
        {
          id: 'moe',
          name: t('partner_moe', 'وزارة التعليم'),
          imageUrl: '/assets/logos/ministry_of_education.svg'
        },
        {
          id: 'shatee_high_school',
          name: t('partner_school', 'مدرسة ثانوية الشاطئ'),
          imageUrl: '/assets/logos/alshatee_high_school.svg'
        }
      ];

  return (
    <footer className="bg-[#0e3c48] dark:bg-[#06181e] text-[#d1e6ec] border-t border-[#1a5565] dark:border-[#132c35] transition-colors duration-200">
      
      {/* Partner Logos Strip */}
      <div className="border-b border-[#185363] dark:border-[#102931] bg-[#092931] dark:bg-[#041217] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-[#84d2ea] mb-5">
            {t('section_partners', 'الجهات المشاركة والداعمة للمبادرة')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            {authorizedPartners.map((partner) => (
              <div 
                key={partner.id} 
                className="flex items-center gap-3.5 bg-white/95 dark:bg-[#12242b]/95 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-sm border border-white/20 dark:border-white/10 hover:scale-102 transition-transform"
              >
                <div className="w-20 sm:w-24 h-10 sm:h-12 flex items-center justify-center overflow-hidden">
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
                <div className={`flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
                  <span className="text-xs font-extrabold text-[#0e3c48] dark:text-[#84d2ea] leading-tight">{partner.name}</span>
                  <span className="text-[10px] text-[#526f78] dark:text-[#8caab4] font-medium">
                    {isRtl ? 'جهة راعية ومشاركة' : 'Supporting Partner'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          
          {/* Col 1: Initiative Identity with Official Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#12242b] p-1 border border-white/20 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={getAssetUrl(settings.logoUrl || '/assets/aistudio/50c0c8c4-5c4f-4db5-8ada-405779c14cc1_db926d78.png')}
                  alt={t('initiative_logo_alt', 'شعار مبادرة عافية تُزهر')}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-white tracking-tight">
                  {language === 'ar' ? (settings.initiativeName || t('initiative_name', 'مبادرة عافية تُزهر')) : t('initiative_name', 'Blooming Wellness Initiative')}
                </span>
                <span className="text-[11px] text-[#84d2ea] font-medium">
                  {language === 'ar' ? (settings.tagline || t('tagline', 'بالتوازن تحصل العافية.. وبالعافية نَزْهَر')) : t('tagline')}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#a2cbcf] leading-relaxed">
              {language === 'ar' ? (settings.aboutText ? settings.aboutText.slice(0, 160) + '...' : t('default_about_text')) : t('default_about_text')}
            </p>
            {(settings.visionText || language === 'en') && (
              <div className="pt-1 text-xs">
                <span className="font-bold text-[#ea8c38] block mb-0.5">{t('section_vision', 'الرؤية')}:</span>
                <p className="line-clamp-2 text-[#b8dce0]">
                  {language === 'ar' ? (settings.visionText || t('default_vision_text')) : t('default_vision_text')}
                </p>
              </div>
            )}
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className={`text-sm font-bold text-white mb-4 ${isRtl ? 'border-r-3 pr-2.5' : 'border-l-3 pl-2.5'} border-[#2e9e66]`}>
              {t('section_about_title', 'أقسام المنصة')}
            </h4>
            <ul className="space-y-2 text-xs text-[#b8dce0]">
              <li>
                <button 
                  onClick={() => { setActiveTab('broadcasts'); scrollToTop(); }}
                  className="hover:text-white transition-all cursor-pointer"
                >
                  {t('nav_broadcasts', 'الإذاعات الصباحية')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('lectures'); scrollToTop(); }}
                  className="hover:text-white transition-all cursor-pointer"
                >
                  {t('nav_lectures', 'المحاضرات التوعوية')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('interviews'); scrollToTop(); }}
                  className="hover:text-white transition-all cursor-pointer"
                >
                  {t('nav_interviews', 'المقابلات الحوارية')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('quizzes'); scrollToTop(); }}
                  className="hover:text-white transition-all cursor-pointer"
                >
                  {t('nav_quizzes', 'اختبر مدى صحة عاداتك')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('events'); scrollToTop(); }}
                  className="hover:text-white transition-all cursor-pointer"
                >
                  {t('nav_events', 'الأنشطة والفعاليات')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('registrations'); scrollToTop(); }}
                  className="hover:text-white transition-all cursor-pointer"
                >
                  {t('nav_registrations', 'التسجيل في البرامج')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveTab('home');
                    setTimeout(() => {
                      const el = document.getElementById('contact');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 150);
                  }}
                  className="hover:text-white transition-all cursor-pointer"
                >
                  {t('nav_contact', 'تواصل معنا')}
                </button>
              </li>
              <li className="pt-1.5">
                <a
                  href="https://amoal2030.github.io/Wellness-Guide-Blossoms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2e9e66]/20 border border-[#2e9e66]/40 text-[#84d2ea] hover:text-white hover:bg-[#2e9e66]/30 transition-all font-bold cursor-pointer group"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#2e9e66] group-hover:scale-110 transition-transform" />
                  <span>{t('nav_user_guide', 'دليل المستخدم')}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div>
            <h4 className={`text-sm font-bold text-white mb-4 ${isRtl ? 'border-r-3 pr-2.5' : 'border-l-3 pl-2.5'} border-[#389eb3]`}>
              {t('nav_contact', 'معلومات التواصل')}
            </h4>
            <ul className="space-y-3.5 text-xs text-[#b8dce0]">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#84d2ea] shrink-0 mt-0.5" />
                <span className="truncate dir-ltr text-start">{settings.contactEmail || 'contact@alshatee-aafia.edu.sa'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#84d2ea] shrink-0" />
                <span className="dir-ltr text-start">{settings.contactPhone || '+966 12 600 0000'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#84d2ea] shrink-0 mt-0.5" />
                <span>{language === 'ar' ? (settings.address || t('default_address')) : t('default_address')}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Administrative Portal Access & User Guide */}
          <div className="bg-[#134e5e]/50 dark:bg-[#0e2730] p-5 rounded-2xl border border-[#23687a] dark:border-[#17414f] flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white mb-1.5">{t('admin_portal_title', 'لوحة التحكم الإدارية')}</h4>
              <p className="text-xs text-[#b8dce0] mb-4 leading-relaxed">
                {isRtl 
                  ? 'منطقة إدارية مخصصة لفريق عمل مبادرة عافية تُزهر لإدارة الإذاعات، الفعاليات، الاستبانات وتحديث المحتوى.'
                  : 'Dedicated administrative area for the Blooming Wellness team to manage broadcasts, events, quizzes and settings.'}
              </p>
              <button
                onClick={() => {
                  setActiveTab('admin');
                  scrollToTop();
                }}
                className="w-full py-2.5 px-4 bg-[#2e9e66] hover:bg-[#248354] text-white text-xs font-bold rounded-xl transition-colors shadow-xs text-center cursor-pointer"
              >
                {t('nav_admin', 'الدخول للوحة التحكم')}
              </button>
            </div>

            <div className="pt-4 border-t border-[#23687a]/60 dark:border-[#17414f]/60 mt-4">
              <a
                href="https://amoal2030.github.io/Wellness-Guide-Blossoms/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/15 border border-[#84d2ea]/30 text-[#84d2ea] hover:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#84d2ea] group-hover:scale-110 transition-transform" />
                <span>{t('user_guide_title', 'تصفح دليل المستخدم')}</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[#185363] dark:border-[#102931] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8ab6bf]">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-start">
            <span>{t('footer_rights')} {new Date().getFullYear()}</span>
            <span>·</span>
            <a
              href="https://amoal2030.github.io/Wellness-Guide-Blossoms/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#84d2ea] hover:text-white underline underline-offset-4 transition-colors font-bold cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#2e9e66]" />
              <span>{t('nav_user_guide', 'دليل المستخدم')}</span>
            </a>
            <span>·</span>
            <a
              href="https://amoal2030.github.io/a1/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#ea8c38] hover:text-[#f8b172] underline underline-offset-4 transition-colors cursor-pointer"
            >
              {t('footer_designed_by')} <Heart className="w-3.5 h-3.5 fill-[#ea8c38]" />
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#84d2ea] hover:text-white transition-colors cursor-pointer"
          >
            <span>{t('back_to_top', 'العودة للأعلى')}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
