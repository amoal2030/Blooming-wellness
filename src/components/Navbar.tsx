import React, { useState, useRef, useEffect } from 'react';
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
  Moon,
  ChevronDown
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
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { currentUser, isSuperAdmin } = useAuth();
  const { language, toggleLanguage, t, isRtl } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  // All 8 navigation links
  const allNavLinks: { id: ActiveTab; labelKey: string; defaultLabel: string }[] = [
    { id: 'home', labelKey: 'nav_home', defaultLabel: 'الرئيسية' },
    { id: 'broadcasts', labelKey: 'nav_broadcasts', defaultLabel: 'الإذاعات الصباحية' },
    { id: 'lectures', labelKey: 'nav_lectures', defaultLabel: 'المحاضرات التوعوية' },
    { id: 'quizzes', labelKey: 'nav_quizzes', defaultLabel: 'اختبر عاداتك' },
    { id: 'events', labelKey: 'nav_events', defaultLabel: 'الفعاليات والأنشطة' },
    { id: 'interviews', labelKey: 'nav_interviews', defaultLabel: 'المقابلات' },
    { id: 'registrations', labelKey: 'nav_registrations', defaultLabel: 'التسجيل في الأنشطة' },
    { id: 'contact', labelKey: 'nav_contact', defaultLabel: 'تواصل معنا' },
  ];

  // Primary links visible on 1024px-1399px laptop screens
  const primaryLinks = allNavLinks.slice(0, 5);
  // Secondary links folded into "More" on 1024px-1399px, and rendered inline on 1400px+
  const secondaryLinks = allNavLinks.slice(5);

  const isSecondaryActive = secondaryLinks.some((l) => l.id === activeTab);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    if (moreDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [moreDropdownOpen]);

  const handleNavClick = (tab: ActiveTab) => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          
          {/* Zone 1: Initiative Brand with Official Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`flex items-center gap-2 sm:gap-3 text-start focus:outline-none group cursor-pointer min-w-0 ${
                isRtl ? 'text-right' : 'text-left'
              }`}
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-2xl bg-white dark:bg-[#12242b] p-1 border border-[#cbe0e7] dark:border-[#1e3842] shadow-xs ring-2 ring-[#389eb3]/20 group-hover:scale-105 group-hover:ring-[#389eb3]/40 transition-all shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={getAssetUrl(settings.logoUrl || '/assets/aistudio/50c0c8c4-5c4f-4db5-8ada-405779c14cc1_db926d78.png')}
                  alt={t('initiative_logo_alt', 'شعار مبادرة عافية تُزهر')}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs sm:text-base lg:text-lg font-black text-[#134e5e] dark:text-[#84d2ea] tracking-tight leading-tight group-hover:text-[#0e3c48] dark:group-hover:text-white transition-colors truncate">
                    {language === 'ar' ? (settings.initiativeName || t('initiative_name', 'مبادرة عافية تُزهر')) : t('initiative_name', 'Blooming Wellness Initiative')}
                  </span>
                  <span className="hidden md:inline-block w-2 h-2 rounded-full bg-[#ea8c38] shrink-0" title={t('tagline')} />
                </div>
                <span className="hidden xs:block text-[10px] sm:text-xs text-[#526f78] dark:text-[#8caab4] font-medium truncate">
                  {language === 'ar' ? (settings.tagline || t('tagline', 'بالتوازن تحصل العافية.. وبالعافية نَزْهَر')) : t('tagline')}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Priority+ pattern: 1024px+ displays links without collision) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs xl:text-sm font-semibold shrink-0">
            {/* Primary core links (always visible on 1024px+) */}
            {primaryLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-2 xl:px-2.5 py-1.5 xl:py-2 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-[#134e5e] dark:text-white bg-[#eaf6fa] dark:bg-[#1b3d48] font-black border border-[#cde6ee] dark:border-[#2a5b6b]'
                      : 'text-[#526f78] dark:text-[#8caab4] hover:text-[#134e5e] dark:hover:text-white hover:bg-[#f1f7f9] dark:hover:bg-[#132c35]'
                  }`}
                >
                  {t(link.labelKey, link.defaultLabel)}
                </button>
              );
            })}

            {/* Secondary links rendered directly on large screens (>= 1400px / 2xl) */}
            <div className="hidden 2xl:flex items-center gap-1 2xl:gap-1.5">
              {secondaryLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-2 2xl:px-2.5 py-1.5 2xl:py-2 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'text-[#134e5e] dark:text-white bg-[#eaf6fa] dark:bg-[#1b3d48] font-black border border-[#cde6ee] dark:border-[#2a5b6b]'
                        : 'text-[#526f78] dark:text-[#8caab4] hover:text-[#134e5e] dark:hover:text-white hover:bg-[#f1f7f9] dark:hover:bg-[#132c35]'
                    }`}
                  >
                    {t(link.labelKey, link.defaultLabel)}
                  </button>
                );
              })}
            </div>

            {/* "More / المزيد" dropdown on standard laptops (1024px to 1399px) */}
            <div className="relative 2xl:hidden" ref={dropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer text-xs font-bold ${
                  isSecondaryActive || moreDropdownOpen
                    ? 'text-[#134e5e] dark:text-white bg-[#eaf6fa] dark:bg-[#1b3d48] border border-[#cde6ee] dark:border-[#2a5b6b]'
                    : 'text-[#526f78] dark:text-[#8caab4] hover:text-[#134e5e] dark:hover:text-white hover:bg-[#f1f7f9] dark:hover:bg-[#132c35]'
                }`}
                aria-expanded={moreDropdownOpen}
                aria-label={t('section_view_all', 'المزيد من الأقسام')}
              >
                <span>{isRtl ? 'المزيد' : 'More'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div 
                  className={`absolute top-full mt-2 ${
                    isRtl ? 'left-0' : 'right-0'
                  } bg-white dark:bg-[#122127] border border-[#dbe8ed] dark:border-[#1e3842] rounded-2xl shadow-xl py-2 min-w-[190px] z-50 animate-fade-in`}
                >
                  {secondaryLinks.map((link) => {
                    const isActive = activeTab === link.id;
                    return (
                      <button
                        key={link.id}
                        onClick={() => handleNavClick(link.id)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                          isActive
                            ? 'text-[#134e5e] dark:text-white bg-[#eaf6fa] dark:bg-[#1b3d48]'
                            : 'text-[#526f78] dark:text-[#8caab4] hover:bg-[#f7fbfc] dark:hover:bg-[#132c35] hover:text-[#134e5e] dark:hover:text-white'
                        } ${isRtl ? 'text-right' : 'text-left'}`}
                      >
                        <span>{t(link.labelKey, link.defaultLabel)}</span>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#2e9e66]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Essential Controls (Language, Theme, Auth, Menu) - NEVER HIDDEN */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Language Switcher Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs font-bold text-[#134e5e] dark:text-[#84d2ea] bg-[#f1f7f9] dark:bg-[#132c35] hover:bg-[#e4eff2] dark:hover:bg-[#1a3a46] border border-[#cbe0e7] dark:border-[#1e3842] rounded-xl transition-all cursor-pointer shadow-2xs min-h-[36px] sm:min-h-[40px]"
              title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
              aria-label={t('change_language', 'تغيير اللغة')}
            >
              <Globe className="w-3.5 h-3.5 text-[#2e9e66] dark:text-[#34b374]" />
              <span className="font-sans text-[10px] sm:text-[11px] font-extrabold uppercase">
                {language === 'ar' ? 'EN' : 'عربي'}
              </span>
            </button>

            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 text-[#134e5e] dark:text-[#f29a4b] bg-[#f1f7f9] dark:bg-[#132c35] hover:bg-[#e4eff2] dark:hover:bg-[#1a3a46] border border-[#cbe0e7] dark:border-[#1e3842] rounded-xl transition-all cursor-pointer shadow-2xs min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center"
              title={isDark ? t('light_mode', 'الوضع الفاتح') : t('dark_mode', 'الوضع الداكن')}
              aria-label={t('toggle_theme', 'تبديل المظهر')}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Auth / Admin Action - Visible on ALL screen sizes (compact icon on mobile, full label on md+) */}
            {currentUser ? (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 px-2 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 shadow-xs cursor-pointer min-h-[36px] sm:min-h-[40px] ${
                  activeTab === 'admin'
                    ? 'bg-[#134e5e] text-white shadow-md'
                    : 'bg-[#2e9e66] hover:bg-[#248354] text-white hover:shadow-md'
                }`}
                title={t('nav_admin', 'لوحة التحكم')}
                aria-label={t('nav_admin', 'لوحة التحكم')}
              >
                <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden md:inline">{t('nav_admin', 'لوحة التحكم')}</span>
                {isSuperAdmin && (
                  <span className="text-[10px] bg-[#ea8c38] text-white font-extrabold px-1.5 py-0.5 rounded-md hidden sm:inline">
                    {t('admin_badge', 'المدير')}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-2 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-[#134e5e] dark:text-white bg-[#eaf6fa] dark:bg-[#1b3d48] hover:bg-[#ddf0f6] dark:hover:bg-[#244f5e] border border-[#cbe3eb] dark:border-[#2a5b6b] rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] sm:min-h-[40px]"
                title={t('nav_login', 'دخول الإدارة')}
                aria-label={t('nav_login', 'دخول الإدارة')}
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2e9e66] dark:text-[#34b374] shrink-0" />
                <span className="hidden md:inline">{t('nav_login', 'دخول الإدارة')}</span>
              </button>
            )}

            {/* Mobile / Tablet Menu Button (active on < lg, i.e., < 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-[#134e5e] dark:text-white hover:bg-[#eaf6fa] dark:hover:bg-[#1b3d48] rounded-xl transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer border border-[#cbe0e7] dark:border-[#1e3842]"
              aria-label={t('main_menu', 'القائمة الرئيسية')}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (visible on < lg when menu button is clicked) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#dbe8ed] dark:border-[#1e3842] bg-white dark:bg-[#0e1e24] px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-fade-in max-h-[calc(100dvh-5rem)] overflow-y-auto">
          
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

          {/* Navigation Links in Mobile Drawer */}
          {allNavLinks.map((link) => {
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
