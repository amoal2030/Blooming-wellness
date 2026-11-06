import React from 'react';
import { ActiveTab, InitiativeSettings } from '../types';
import { getAssetUrl } from '../utils/assets';
import { Mail, Phone, MapPin, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  settings: InitiativeSettings;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenLoginModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  setActiveTab,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Restrict to ONLY the 2 authorized partners: وزارة التعليم ومدرسة ثانوية الشاطئ
  const authorizedPartners = (settings.partnerLogos && settings.partnerLogos.length === 2)
    ? settings.partnerLogos
    : [
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
      ];

  return (
    <footer className="bg-[#0e3c48] text-[#d1e6ec] border-t border-[#1a5565]">
      
      {/* Partner Logos Strip: Exactly Two Authorized Partners */}
      <div className="border-b border-[#185363] bg-[#092931] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-[#84d2ea] mb-6">
            الجهات المشاركة والداعمة للمبادرة
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
            {authorizedPartners.map((partner) => (
              <div 
                key={partner.id} 
                className="flex items-center gap-4 bg-white/95 px-5 py-3 rounded-2xl shadow-sm border border-white/20 hover:scale-102 transition-transform"
              >
                <div className="w-24 h-12 flex items-center justify-center overflow-hidden">
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
                  <span className="text-xs font-extrabold text-[#0e3c48] leading-tight">{partner.name}</span>
                  <span className="text-[10px] text-[#526f78] font-medium">جهة راعية ومشاركة</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Col 1: Initiative Identity with Official Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-white/20 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={getAssetUrl(settings.logoUrl || '/assets/aistudio/50c0c8c4-5c4f-4db5-8ada-405779c14cc1_db926d78.png')}
                  alt="شعار مبادرة عافية تُزهر"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-white tracking-tight">
                  {settings.initiativeName || 'مبادرة عافية تُزهر'}
                </span>
                <span className="text-[11px] text-[#84d2ea] font-medium">
                  {settings.tagline || 'بالتوازن تحصل العافية.. وبالعافية نَزْهَر'}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#a2cbcf] leading-relaxed">
              {settings.aboutText ? settings.aboutText.slice(0, 160) + '...' : 'مبادرة مدرسية ومجتمعية توعوية لتعزيز نمط الحياة الصحي المتوازن لطلاب ثانوية الشاطئ والمجتمع.'}
            </p>
            <div className="pt-2 text-xs">
              <span className="font-bold text-[#ea8c38] block mb-0.5">الرؤية:</span>
              <p className="line-clamp-2 text-[#b8dce0]">{settings.visionText}</p>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-r-3 border-[#2e9e66] pr-2.5">
              أقسام المنصة التوعوية
            </h4>
            <ul className="space-y-2.5 text-xs text-[#b8dce0]">
              <li>
                <button 
                  onClick={() => { setActiveTab('broadcasts'); scrollToTop(); }}
                  className="hover:text-white hover:pr-1 transition-all cursor-pointer"
                >
                  الإذاعات الصباحية
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('lectures'); scrollToTop(); }}
                  className="hover:text-white hover:pr-1 transition-all cursor-pointer"
                >
                  المحاضرات التوعوية
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('interviews'); scrollToTop(); }}
                  className="hover:text-white hover:pr-1 transition-all cursor-pointer"
                >
                  المقابلات الحوارية
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('quizzes'); scrollToTop(); }}
                  className="hover:text-white hover:pr-1 transition-all cursor-pointer"
                >
                  اختبر مدى صحة عاداتك
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('events'); scrollToTop(); }}
                  className="hover:text-white hover:pr-1 transition-all cursor-pointer"
                >
                  الأنشطة والفعاليات المدرسية والمجتمعية
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('registrations'); scrollToTop(); }}
                  className="hover:text-white hover:pr-1 transition-all cursor-pointer"
                >
                  التسجيل في الأنشطة المتاحة
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-r-3 border-[#389eb3] pr-2.5">
              معلومات التواصل
            </h4>
            <ul className="space-y-3.5 text-xs text-[#b8dce0]">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#84d2ea] shrink-0 mt-0.5" />
                <span className="truncate dir-ltr text-right">{settings.contactEmail || 'contact@alshatee-aafia.edu.sa'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#84d2ea] shrink-0" />
                <span className="dir-ltr text-right">{settings.contactPhone || '+966 12 600 0000'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#84d2ea] shrink-0 mt-0.5" />
                <span>{settings.address || 'المملكة العربية السعودية - مدرسة ثانوية الشاطئ'}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Administrative Portal Access */}
          <div className="bg-[#134e5e]/50 p-5 rounded-2xl border border-[#23687a]">
            <h4 className="text-sm font-bold text-white mb-1.5">بوابة المشرفين والإدارة</h4>
            <p className="text-xs text-[#b8dce0] mb-4 leading-relaxed">
              منطقة إدارية مخصصة لفريق عمل مبادرة عافية تُزهر لإدارة الإذاعات، الفعاليات، الاستبانات وتحديث المحتوى.
            </p>
            <button
              onClick={() => {
                setActiveTab('admin');
                scrollToTop();
              }}
              className="w-full py-2.5 px-4 bg-[#2e9e66] hover:bg-[#248354] text-white text-xs font-bold rounded-xl transition-colors shadow-sm text-center cursor-pointer"
            >
              الدخول للوحة التحكم
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#185363] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8ab6bf]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span>جميع الحقوق محفوظة لمبادرة <strong>عافية تُزهر</strong> &copy; {new Date().getFullYear()}</span>
            <span>·</span>
            <span>تحت إشراف وزارة التعليم وتنظيم ثانوية الشاطئ</span>
            <span>·</span>
            <a
              href="https://amoal2030.github.io/a1/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#ea8c38] hover:text-[#f8b172] underline underline-offset-4 transition-colors cursor-pointer"
            >
              صمم بعناية في خدماتي البرمجية <Heart className="w-3.5 h-3.5 fill-[#ea8c38]" />
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#84d2ea] hover:text-white transition-colors cursor-pointer"
          >
            <span>العودة للأعلى</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
