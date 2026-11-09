import React, { useState, useMemo } from 'react';
import { RegistrationItem } from '../../types';
import { getAssetUrl } from '../../utils/assets';
import { ClipboardList, ExternalLink, Calendar, Check, Copy } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface RegistrationsViewProps {
  registrations: RegistrationItem[];
}

export const RegistrationsView: React.FC<RegistrationsViewProps> = ({ registrations }) => {
  const { t, isRtl } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'closed'>('all');

  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredRegistrations = useMemo(() => {
    if (activeFilter === 'all') return registrations;
    return registrations.filter((item) => item.status === activeFilter);
  }, [registrations, activeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0e3c48] via-[#134e5e] to-[#0e3c48] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 rounded-full text-xs font-bold text-[#84d2ea] border border-white/20">
            <ClipboardList className="w-3.5 h-3.5 text-[#2e9e66]" />
            <span>{t('registrations_title', 'بوابة التسجيل والمشاركة الطلابية')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            {isRtl ? 'التسجيل في أنشطة عافية تُزهر' : 'Student & Community Registration'}
          </h1>
          <p className="text-[#d1e6ec] text-xs sm:text-sm leading-relaxed">
            {t('registrations_subtitle', 'بادر بالتسجيل في ورش العمل، المجموعات الرياضية، وبرامج التطوع الصحي المعتمدة بمدرسة ثانوية الشاطئ عبر روابط التسجيل الرسمية.')}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-[#122127] p-2.5 sm:p-3 rounded-2xl border border-[#dbe8ed] dark:border-[#1e3842] w-fit shadow-xs transition-colors">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#134e5e] text-white shadow-xs'
              : 'text-[#526f78] dark:text-stone-300 hover:bg-[#eaf6fa] dark:hover:bg-[#0e2730]'
          }`}
        >
          {t('registrations_tab_all', 'جميع البرامج')}
        </button>
        <button
          onClick={() => setActiveFilter('open')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeFilter === 'open'
              ? 'bg-[#134e5e] text-white shadow-xs'
              : 'text-[#526f78] dark:text-stone-300 hover:bg-[#eaf6fa] dark:hover:bg-[#0e2730]'
          }`}
        >
          {t('registrations_tab_open', 'المتاحة للتسجيل')}
        </button>
        <button
          onClick={() => setActiveFilter('closed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeFilter === 'closed'
              ? 'bg-[#134e5e] text-white shadow-xs'
              : 'text-[#526f78] dark:text-stone-300 hover:bg-[#eaf6fa] dark:hover:bg-[#0e2730]'
          }`}
        >
          {t('registrations_tab_closed', 'المكتملة / المغلقة')}
        </button>
      </div>

      {/* Registrations Grid */}
      {filteredRegistrations.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#122127] rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] p-8 transition-colors">
          <ClipboardList className="w-12 h-12 text-[#b0ced8] dark:text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0e3c48] dark:text-white">
            {t('registrations_no_items', 'لا توجد أنشطة مطروحة للتسجيل حالياً')}
          </h3>
          <p className="text-xs text-[#526f78] dark:text-stone-400 mt-1">
            {isRtl ? 'تابع هذه الصفحة باستمرار لمواكبة البرامج القادمة.' : 'Check back frequently for upcoming wellness programs.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRegistrations.map((item) => {
            const isOpen = item.status === 'open';

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-[#122127] rounded-3xl border overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group ${
                  isOpen ? 'border-[#dbe8ed] dark:border-[#1e3842]' : 'border-[#dbe8ed]/60 dark:border-[#1e3842]/60 opacity-80'
                }`}
              >
                {/* Thumbnail */}
                <div className="h-48 relative bg-[#f1f7f9] dark:bg-[#0b1519] overflow-hidden">
                  <img
                    src={getAssetUrl(item.imageUrl || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80')}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`}>
                    {isOpen ? (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#e8f7ee] dark:bg-[#0e2c22] text-[#1e784a] dark:text-[#42df98] border border-[#c4e9d2] dark:border-[#154636] flex items-center gap-1.5 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2e9e66] animate-pulse" />
                        <span>{t('card_status_open', 'التسجيل متاح')}</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#f1f7f9] dark:bg-[#0b1519] text-[#526f78] dark:text-stone-400 border border-[#d0e0e6] dark:border-[#1e3842]">
                        {t('card_status_closed', 'التسجيل مغلق')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-[#0e3c48] dark:text-white group-hover:text-[#2e9e66] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#526f78] dark:text-stone-300 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    <div className="p-3 bg-[#f7fbfc] dark:bg-[#0b1519] rounded-2xl border border-[#dbe8ed] dark:border-[#1e3842] text-xs flex items-center gap-2 text-[#526f78] dark:text-stone-300">
                      <Calendar className="w-4 h-4 text-[#2e9e66] shrink-0" />
                      <span>{t('card_deadline', 'آخر موعد للتسجيل')}: <strong className="text-[#0c2b33] dark:text-white">{item.deadline}</strong></span>
                    </div>
                  </div>

                  {/* External Link Action */}
                  <div className="pt-4 border-t border-[#edf3f5] dark:border-[#1e3842] flex items-center gap-2">
                    {isOpen ? (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-3 px-4 bg-[#2e9e66] hover:bg-[#248354] text-white text-xs font-bold rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 text-center cursor-pointer"
                      >
                        <span>{isRtl ? 'التسجيل في النشاط' : 'Register Now'}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex-1 py-3 px-4 bg-[#f1f7f9] dark:bg-[#0b1519] text-[#71919a] dark:text-stone-500 text-xs font-bold rounded-2xl cursor-not-allowed text-center"
                      >
                        {isRtl ? 'انتهت فترة التسجيل' : 'Registration Closed'}
                      </button>
                    )}

                    <button
                      onClick={() => handleCopyLink(item.id, item.externalUrl)}
                      className="p-3 bg-[#eaf6fa] dark:bg-[#0e2730] hover:bg-[#d8eff7] dark:hover:bg-[#163845] text-[#134e5e] dark:text-[#84d2ea] rounded-2xl transition-colors cursor-pointer"
                      title={isRtl ? 'نسخ رابط التسجيل' : 'Copy link'}
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-[#2e9e66]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
