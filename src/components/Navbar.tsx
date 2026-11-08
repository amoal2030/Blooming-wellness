import React, { useState } from 'react';
import { ActiveTab, InitiativeSettings } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getAssetUrl } from '../utils/assets';
import { 
  LogIn, 
  Menu, 
  X, 
  LayoutDashboard,
  Globe,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  settings: InitiativeSettings;
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onOpenLoginModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, isSuperAdmin } = useAuth();
  const { language, toggleLanguage, t, isRtl } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const navLinks: { id: ActiveTab; labelKey: string; defaultLabel: string }[] = [
    { id: 'home', labelKey: 'nav_home', defaultLabel: 'الرئيسية' },
    { id: 'broadcasts', labelKey: 'nav_broadcasts', defaultLabel: 'الإذاعات الصباحية' },
    { id: 'lectures', labelKey: 'nav_lectures', defaultLabel: 'المحاضرات التوعوية' },
    { id: 'interviews', labelKey: 'nav_interviews', defaultLabel: 'المقابلات' },
    { id: 'quizzes', labelKey: 'nav_quizzes', defaultLabel: 'اختبر عاداتك' },
    { id: 'events', labelKey: 'nav_events', defaultLabel: 'الفعاليات والأنشطة' },
    { id: 'registrations', labelKey: 'nav_registrations', defaultLabel: 'التسجيل في الأنشطة' },
    { id: 'contact', labelKey: 'nav_contact', defaultLabel: 'تواصل معنا' },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setMobileMenuOpen(false);
    if (tab === 'contact') {
      if (activeTab !== 'home') {
        setActiveTab('home');
      }
      setTimeout(() => {
        const contactEl = document.getElementById('contact');
        if (contactEl) {
          contactEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0e1e24]/95 backdrop-blur-md border-b border-[#dbe8ed] dark:border-[#1e3842] shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-4">
          
          {/* Zone 1: Initiative Brand with Official Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className={`flex items-center gap-3 text-start focus:outline-none group cursor-pointer ${
                isRtl ? 'text-right' : 'text-left'
              }`}
            >
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-white dark:bg-[#12242b] p-1 border border-[#cbe0e7] dark:border-[#1e3842] shadow-xs ring-2 ring-[#389eb3]/20 group-hover:scale-105 group-hover:ring-[#389eb3]/40 transition-all shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={getAssetUrl(settings.logoUrl || '/assets/aistudio/50c0c8c4-5c4f-4db5-8ada-405779c14cc1_db926d78.png')}
                  alt="شعار مبادرة عافية تُزهر"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black text-[#134e5e] dark:text-[#84d2ea] tracking-tight leading-tight group-hover:text-[#0e3c48] dark:group-hover:text-white transition-colors whitespace-nowrap">
                    {settings.initiativeName || t('initiative_name', 'مبادرة عافية تُزهر')}
                  </span>
                  <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-[#ea8c38]" title="بالتوازن تحصل العافية" />
                </div>
                <span className="text-[11px] sm:text-xs text-[#526f78] dark:text-[#8caab4] font-medium truncate max-w-[180px] sm:max-w-xs">
                  {settings.tagline || t('tagline', 'بالتوازن تحصل العافية.. وبالعافية نَزْهَر')}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-2.5 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 text-xs 2xl:text-sm cursor-pointer ${
                    isActive
                      ? 'text-[#134e5e] dark:text-white bg-[#eaf6fa] dark:bg-[#1b3d48] font-black border border-[#cde6ee] dark:border-[#2a5b6b]'
                      : 'text-[#526f78] dark:text-[#8caab4] hover:text-[#134e5e] dark:hover:text-white hover:bg-[#f1f7f9] dark:hover:bg-[#132c35]'
                  }`}
                >
                  {t(link.labelKey, link.defaultLabel)}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Controls (Language, Theme, Auth) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Language Switcher Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-bold text-[#134e5e] dark:text-[#84d2ea] bg-[#f1f7f9] dark:bg-[#132c35] hover:bg-[#e4eff2] dark:hover:bg-[#1a3a46] border border-[#cbe0e7] dark:border-[#1e3842] rounded-xl transition-all cursor-pointer shadow-2xs"
              title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
              aria-label="تغيير اللغة"
            >
              <Globe className="w-3.5 h-3.5 text-[#2e9e66] dark:text-[#34b374]" />
              <span className="font-sans text-[11px] font-extrabold uppercase">
                {language === 'ar' ? 'English' : 'العربية'}
              </span>
            </button>

            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-[#134e5e] dark:text-[#f29a4b] bg-[#f1f7f9] dark:bg-[#132c35] hover:bg-[#e4eff2] dark:hover:bg-[#1a3a46] border border-[#cbe0e7] dark:border-[#1e3842] rounded-xl transition-all cursor-pointer shadow-2xs"
              title={isDark ? t('light_mode', 'الوضع الفاتح') : t('dark_mode', 'الوضع الداكن')}
              aria-label="تبديل المظهر"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Auth / Admin Action */}
            {currentUser ? (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 shadow-xs cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-[#134e5e] text-white shadow-md'
                    : 'bg-[#2e9e66] hover:bg-[#248354] text-white hover:shadow-md'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('nav_admin', 'لوحة التحكم')}</span>
                {isSuperAdmin && (
                  <span className="text-[10px] bg-[#ea8c38] text-white font-extrabold px-1.5 py-0.5 rounded-md">
                    {isRtl ? 'المدير' : 'Admin'}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-[#134e5e] dark:text-white bg-[#eaf6fa] dark:bg-[#1b3d48] hover:bg-[#ddf0f6] dark:hover:bg-[#244f5e] border border-[#cbe3eb] dark:border-[#2a5b6b] rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2e9e66] dark:text-[#34b374]" />
                <span className="hidden sm:inline">{t('nav_login', 'دخول الإدارة')}</span>
              </button>
            )}

            {/* Mobile menu hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#134e5e] dark:text-white hover:bg-[#eaf6fa] dark:hover:bg-[#1b3d48] rounded-xl transition-colors"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#dbe8ed] dark:border-[#1e3842] bg-white dark:bg-[#0e1e24] px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-fade-in">
          
          {/* Mobile Top Controls: Language & Theme */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#edf3f5] dark:border-[#1a333d]">
            <span className="text-xs font-bold text-[#526f78] dark:text-[#8caab4]">
              {t('theme', 'المظهر')} / {t('language', 'اللغة')}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#134e5e] dark:text-[#84d2ea] bg-[#f1f7f9] dark:bg-[#132c35] border border-[#cbe0e7] dark:border-[#1e3842] rounded-lg"
              >
                <Globe className="w-3.5 h-3.5 text-[#2e9e66]" />
                <span className="font-sans uppercase text-[11px] font-black">
                  {language === 'ar' ? 'English' : 'العربية'}
                </span>
              </button>
              <button
                onClick={toggleTheme}
                className="p-1.5 text-[#134e5e] dark:text-amber-400 bg-[#f1f7f9] dark:bg-[#132c35] border border-[#cbe0e7] dark:border-[#1e3842] rounded-lg"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-[#eaf6fa] dark:bg-[#1b3d48] text-[#134e5e] dark:text-white border border-[#cde6ee] dark:border-[#2a5b6b]'
                    : 'text-[#526f78] dark:text-[#8caab4] hover:bg-[#f7fbfc] dark:hover:bg-[#132c35] hover:text-[#134e5e] dark:hover:text-white'
                }`}
              >
                <span>{t(link.labelKey, link.defaultLabel)}</span>
                {isActive && <div className="w-2 h-2 rounded-full bg-[#2e9e66]" />}
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-[#edf3f5] dark:border-[#1a333d] mt-2">
            {currentUser ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-[#134e5e] hover:bg-[#0e3c48] rounded-xl shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t('admin_portal_title', 'الانتقال إلى لوحة التحكم الإدارية')}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLoginModal();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-[#134e5e] dark:text-white bg-[#eaf6fa] dark:bg-[#1b3d48] border border-[#cbe3eb] dark:border-[#2a5b6b] rounded-xl"
              >
                <LogIn className="w-4 h-4 text-[#2e9e66]" />
                <span>{t('nav_login', 'تسجيل دخول المشرفين والمدير')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
