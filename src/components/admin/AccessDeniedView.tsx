import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAssetUrl } from '../../utils/assets';
import { Lock, ArrowRight, LogOut, ShieldAlert, RefreshCw } from 'lucide-react';

interface AccessDeniedViewProps {
  onReturnHome: () => void;
  onOpenLoginModal?: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  onReturnHome,
  onOpenLoginModal
}) => {
  const { currentUser, logout, login } = useAuth();

  const handleSwitchAccount = async () => {
    try {
      await logout();
      if (onOpenLoginModal) {
        onOpenLoginModal();
      } else {
        await login();
      }
    } catch (err) {
      console.error('Failed to switch account:', err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 my-8">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#dbe8ed] shadow-2xl p-8 sm:p-12 text-center overflow-hidden animate-fade-in">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-48 bg-[#ea8c38]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Emblem & Lock Icon Container */}
        <div className="relative mx-auto mb-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#f1f7f9] p-2 border-2 border-[#dbe8ed] shadow-md flex items-center justify-center overflow-hidden mb-3">
            <img
              src={getAssetUrl('/assets/aistudio/50c0c8c4-5c4f-4db5-8ada-405779c14cc1_db926d78.png')}
              alt="شعار مبادرة عافية تُزهر"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
        </div>

        {/* Required Headings and Copy (Verbatim) */}
        <h1 className="text-2xl sm:text-3xl font-black text-[#0e3c48] tracking-tight mb-2">
          لا يمكنك الدخول
        </h1>

        <h2 className="text-base sm:text-lg font-bold text-[#ea8c38] mb-4">
          منطقة مخصصة لإدارة المبادرة
        </h2>

        <p className="text-xs sm:text-sm text-[#526f78] leading-relaxed max-w-md mx-auto mb-8">
          يرجى تسجيل الدخول باستخدام حساب Google المعتمد للمدير الرئيسي أو المشرفين للوصول إلى لوحة التحكم الإدارية.
        </p>

        {/* Account Info Pill */}
        {currentUser && (
          <div className="mb-8 p-4 bg-[#f7fbfc] rounded-2xl border border-[#dbe8ed] text-right space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#526f78] font-medium">الحساب المسجل حالياً:</span>
              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[11px] font-bold">
                مستخدم غير مصرح له
              </span>
            </div>
            <p className="font-mono text-xs text-[#0e3c48] font-bold truncate dir-ltr text-left">
              {currentUser.email}
            </p>
            <p className="text-[11px] text-[#718b92] pt-1">
              هذا الحساب غير مسجل ضمن قائمة المشرفين المعتمدين في النظام.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onReturnHome}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-[#134e5e] hover:bg-[#0e3c48] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى الصفحة الرئيسية</span>
          </button>

          <button
            onClick={handleSwitchAccount}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-5 bg-white hover:bg-rose-50 border border-stone-300 hover:border-rose-300 text-stone-700 hover:text-rose-700 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
            title="تسجيل الخروج أو استخدام حساب آخر"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>تبديل الحساب</span>
          </button>
        </div>

      </div>
    </div>
  );
};
