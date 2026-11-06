import React, { useState } from 'react';
import { ActiveTab, InitiativeSettings } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  LogIn, 
  Menu, 
  X, 
  Sparkles,
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
  const { currentUser, isSuperAdmin, isAdmin } = useAuth();

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Zone 1: Initiative Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 text-right focus:outline-none group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-stone-900 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                  {settings.initiativeName || 'منصة المبادرة التوعوية'}
                </span>
                <span className="text-xs text-stone-500 font-medium truncate max-w-[200px] sm:max-w-xs">
                  {settings.tagline ? settings.tagline.slice(0, 45) + '...' : 'صحتنا أمانة وعافيتنا مسؤولية'}
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
                  className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs 2xl:text-sm ${
                    isActive
                      ? 'text-emerald-800 bg-emerald-50 font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Auth */}
          <div className="flex items-center gap-2 shrink-0">
            {currentUser ? (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 shadow-xs ${
                  activeTab === 'admin'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>لوحة التحكم</span>
                {isSuperAdmin && (
                  <span className="text-[10px] bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded-full">
                    المدير
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200/80 rounded-xl transition-colors whitespace-nowrap shrink-0"
              >
                <LogIn className="w-4 h-4 text-emerald-700" />
                <span>دخول الإدارة</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-stone-100 mt-2">
            {currentUser ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-emerald-700 rounded-xl"
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
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-stone-800 bg-stone-100 rounded-xl"
              >
                <LogIn className="w-4 h-4 text-emerald-700" />
                <span>تسجيل دخول المشرفين والمدير</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
