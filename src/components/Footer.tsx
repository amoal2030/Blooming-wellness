import React from 'react';
import { ActiveTab, InitiativeSettings } from '../types';
import { Sparkles, Mail, Phone, MapPin, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  settings: InitiativeSettings;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenLoginModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  setActiveTab,
  onOpenLoginModal,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Partner Logos Strip */}
      {settings.partnerLogos && settings.partnerLogos.length > 0 && (
        <div className="border-b border-stone-800/80 bg-stone-950/60 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-stone-400 mb-6">
              الشعارات والجهات المشاركة والداعمة للمبادرة
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-80 hover:opacity-100 transition-opacity">
              {settings.partnerLogos.map((partner) => (
                <div key={partner.id} className="flex items-center gap-3 bg-stone-800/50 px-4 py-2 rounded-xl border border-stone-700/50">
                  <img
                    src={partner.imageUrl}
                    alt={partner.name}
                    className="w-8 h-8 object-contain rounded-full bg-white p-0.5"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-xs font-semibold text-stone-300">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Col 1: Initiative Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {settings.initiativeName || 'منصة المبادرة التوعوية'}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {settings.tagline || 'مبادرة وطنية مجتمعية تعزز أنماط الحياة الصحية والوقائية لجميع أفراد الأسرة.'}
            </p>
            <div className="pt-2 text-xs text-stone-400">
              <p className="font-semibold text-emerald-400 mb-1">الرؤية:</p>
              <p className="line-clamp-2 text-stone-400">{settings.visionText}</p>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-r-2 border-emerald-500 pr-2">
              أقسام المنصة
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => { setActiveTab('broadcasts'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  الإذاعات الصباحية
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('lectures'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  المحاضرات التوعوية
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('interviews'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  المقابلات الحوارية
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('quizzes'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  اختبر مدى صحة عاداتك
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('events'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  الأنشطة والفعاليات المجتمعية
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('registrations'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  التسجيل في الأنشطة المتاحة
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-r-2 border-emerald-500 pr-2">
              معلومات التواصل
            </h4>
            <ul className="space-y-3 text-xs text-stone-300">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="truncate dir-ltr text-right">{settings.contactEmail || 'contact@initiative.org'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="dir-ltr text-right">{settings.contactPhone || '+966 11 234 5678'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.address || 'المملكة العربية السعودية'}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Administrative Portal Access */}
          <div className="bg-stone-800/40 p-5 rounded-2xl border border-stone-800">
            <h4 className="text-sm font-bold text-white mb-2">لوحة التحكم والمشرفين</h4>
            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              بوابة مخصصة للإدارة المركزية ومشرفي المحتوى لإدارة الإذاعات، المحاضرات، الاستبانات، والفعاليات.
            </p>
            <button
              onClick={() => {
                setActiveTab('admin');
                scrollToTop();
              }}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm text-center"
            >
              الدخول للوحة التحكم
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-1">
            <span>جميع الحقوق محفوظة للمبادرة التوعوية &copy; {new Date().getFullYear()}</span>
            <span className="mx-2">·</span>
            <span className="flex items-center gap-1">
              صُنعت لتعزيز صحة المجتمع <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors"
          >
            <span>العودة للأعلى</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
