import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getAssetUrl } from '../utils/assets';
import { Sparkles, Loader2, Clock } from 'lucide-react';
import { InitiativeSettings } from '../types';

interface LoadingScreenProps {
  settings?: InitiativeSettings;
  subtitleKey?: string;
  defaultSubtitle?: string;
  messageAr?: string;
  messageEn?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  settings,
  subtitleKey,
  defaultSubtitle,
  messageAr,
  messageEn,
}) => {
  const { t, isRtl, language } = useLanguage();
  const { isDark } = useTheme();
  const [isSlowLoading, setIsSlowLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSlowLoading(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Initiative Logo
  const initiativeLogo = 
    settings?.logoUrl ||
    (typeof window !== 'undefined' ? localStorage.getItem('aafia_initiative_logo') : null) ||
    '/assets/aistudio/50c0c8c4-5c4f-4db5-8ada-405779c14cc1_db926d78.png';

  // Ministry of Education Logo
  const moeLogo = 
    settings?.moeLogoUrl ||
    (typeof window !== 'undefined' ? localStorage.getItem('aafia_moe_logo') : null) ||
    settings?.partnerLogos?.find(p => p.id === 'moe' || p.name.includes('التعليم'))?.imageUrl ||
    '/assets/logos/ministry_of_education.svg';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
      isDark ? 'bg-[#0b1519] text-[#f0f7f9]' : 'bg-[#f7fbfc] text-[#0c2b33]'
    }`}>
      {/* Decorative backdrop glow */}
      <div className="absolute w-72 h-72 rounded-full bg-[#2e9e66]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full space-y-6 animate-fade-in">
        
        {/* Double Logos Display: Initiative + Ministry of Education */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 p-4 rounded-3xl bg-white/80 dark:bg-[#122127]/90 border border-[#dbe8ed] dark:border-[#1e3842] shadow-xl backdrop-blur-md">
          {/* Initiative Logo */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-2 bg-[#f1f7f9] dark:bg-[#102830] border border-[#dbe8ed] dark:border-[#1e3842] flex items-center justify-center shadow-xs overflow-hidden">
            <img
              src={getAssetUrl(initiativeLogo)}
              alt={t('initiative_logo_alt', 'شعار مبادرة عافية تُزهر')}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback to default asset
                (e.target as HTMLImageElement).src = getAssetUrl('/assets/aistudio/50c0c8c4-5c4f-4db5-8ada-405779c14cc1_db926d78.png');
              }}
            />
          </div>

          {/* Divider */}
          <div className="h-10 w-[1.5px] bg-[#dbe8ed] dark:bg-[#1e3842]" />

          {/* Ministry of Education Logo */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-2 bg-[#f1f7f9] dark:bg-[#102830] border border-[#dbe8ed] dark:border-[#1e3842] flex items-center justify-center shadow-xs overflow-hidden">
            <img
              src={getAssetUrl(moeLogo)}
              alt={t('moe_logo_alt', 'شعار وزارة التعليم')}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getAssetUrl('/assets/logos/ministry_of_education.svg');
              }}
            />
          </div>
        </div>

        {/* Brand Titles */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-[#0e3c48] dark:text-[#84d2ea] tracking-tight">
            {language === 'ar' ? (settings?.initiativeName || t('initiative_name', 'مبادرة عافية تُزهر')) : t('initiative_name', 'Blooming Wellness Initiative')}
          </h1>
          <p className="text-xs sm:text-sm text-[#526f78] dark:text-[#8caab4]">
            {language === 'ar' ? (settings?.tagline || t('tagline', 'بالتوازن تحصل العافية.. وبالعافية نَزْهَر')) : t('tagline')}
          </p>
        </div>

        {/* Loading Spinner & Status Texts */}
        <div className="flex flex-col items-center space-y-3 pt-2">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-3 border-[#2e9e66]/20 border-t-[#2e9e66] animate-spin" />
            <Sparkles className="w-5 h-5 text-[#2e9e66] absolute animate-pulse" />
          </div>

          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-[#0e3c48] dark:text-stone-100">
              {t('please_wait', 'يرجى الانتظار')}
            </h2>
            <p className="text-xs sm:text-sm text-[#2e9e66] dark:text-[#34b374] font-semibold animate-pulse">
              {messageAr 
                ? (language === 'en' && messageEn ? messageEn : messageAr)
                : subtitleKey ? t(subtitleKey, defaultSubtitle || t('loading')) : t('loading', 'جاري التحميل...')}
            </p>
          </div>
        </div>

        {/* Long Loading Warning */}
        {isSlowLoading && (
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2 max-w-sm animate-fade-in shadow-xs">
            <Clock className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="leading-relaxed">
              {t('loading_long', 'يستغرق الاتصال بقاعدة البيانات وقتاً أطول من المعتاد، يرجى الانتظار...')}
            </span>
          </div>
        )}

      </div>
    </div>
  );
};
