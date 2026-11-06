import React, { useState } from 'react';
import { ActiveTab, InitiativeSettings } from '../types';
import { useAuth } from '../context/AuthContext';
import { getAssetUrl } from '../utils/assets';
import { 
  LogIn, 
  Menu, 
  X, 
  LayoutDashboard
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

  const navLinks: { id: ActiveTab; label: string }[] = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'broadcasts', label: 'الإذاعات الصباحية' },
    { id: 'lectures', label: 'المحاضرات التوعوية' },
    { id: 'interviews', label: 'المقابلات' },
    { id: 'quizzes', label: 'اختبر عاداتك' },
    { id: 'events', label: 'الفعاليات والأنشطة' },
    { id: 'registrations', label: 'التسجيل في الأنشطة' },
    { id: 'contact', label: 'تواصل معنا' },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#dbe8ed] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Zone 1: Initiative Brand with Official Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3.5 text-right focus:outline-none group cursor-pointer"
            >
              <div className="w-13 h-13 rounded-2xl bg-white p-1 border border-[#cbe0e7] shadow-xs ring-2 ring-[#389eb3]/20 group-hover:scale-105 group-hover:ring-[#389eb3]/40 transition-all shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={getAssetUrl(settings.logoUrl || '/assets/aistudio/50c0c8c4-5c4f-4db5-8ada-405779c14cc1_db926d78.png')}
                  alt="شعار مبادرة عافية تُزهر"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-[#134e5e] tracking-tight leading-tight group-hover:text-[#0e3c48] transition-colors whitespace-nowrap">
                    {settings.initiativeName || 'مبادرة عافية تُزهر'}
                  </span>
                  <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-[#ea8c38]" title="بالتوازن تحصل العافية" />
                </div>
                <span className="text-xs text-[#526f78] font-medium truncate max-w-[220px] sm:max-w-xs">
                  {settings.tagline || 'بالتوازن تحصل العافية.. وبالعافية نَزْهَر'}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1.5 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 text-xs 2xl:text-sm cursor-pointer ${
                    isActive
                      ? 'text-[#134e5e] bg-[#eaf6fa] font-black border border-[#cde6ee]'
                      : 'text-[#526f78] hover:text-[#134e5e] hover:bg-[#f1f7f9]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Auth */}
          <div className="flex items-center gap-2.5 shrink-0">
            {currentUser ? (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 shadow-xs cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-[#134e5e] text-white shadow-md'
                    : 'bg-[#2e9e66] hover:bg-[#248354] text-white hover:shadow-md'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>لوحة التحكم</span>
                {isSuperAdmin && (
                  <span className="text-[10px] bg-[#ea8c38] text-white font-extrabold px-1.5 py-0.5 rounded-md">
                    المدير
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-[#134e5e] bg-[#eaf6fa] hover:bg-[#ddf0f6] border border-[#cbe3eb] rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#2e9e66]" />
                <span>دخول الإدارة</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#134e5e] hover:bg-[#eaf6fa] rounded-xl transition-colors"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#dbe8ed] bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-fade-in">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-[#eaf6fa] text-[#134e5e] border border-[#cde6ee]'
                    : 'text-[#526f78] hover:bg-[#f7fbfc] hover:text-[#134e5e]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <div className="w-2 h-2 rounded-full bg-[#2e9e66]" />}
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-[#edf3f5] mt-2">
            {currentUser ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-[#134e5e] rounded-xl shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>الانتقال إلى لوحة التحكم الإدارية</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLoginModal();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-[#134e5e] bg-[#eaf6fa] border border-[#cbe3eb] rounded-xl"
              >
                <LogIn className="w-4 h-4 text-[#2e9e66]" />
                <span>تسجيل دخول المشرفين والمدير</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
