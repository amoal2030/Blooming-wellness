import React, { useState } from 'react';
import { useAuth, SUPER_ADMIN_EMAIL } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getAssetUrl } from '../utils/assets';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { login, logout, currentUser, isSuperAdmin, isAuthorizedStaff, supervisorProfile } = useAuth();
  const { t, isRtl, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await login();
      onSuccess();
    } catch (err: any) {
      console.error('[LoginModal] Google login failed:', err);
      const code = err?.code || '';
      const domain = typeof window !== 'undefined' ? window.location.hostname : 'amoal2030.github.io';
      
      if (code === 'auth/unauthorized-domain') {
        setErrorMsg(
          `${t('auth_err_domain', 'النطاق الحالي غير مصرّح به في مشروع Firebase.')} (${domain})`
        );
      } else if (code === 'auth/popup-blocked') {
        setErrorMsg(
          t('auth_err_popup_blocked', 'تم حظر نافذة تسجيل الدخول المنبثقة من قبل المتصفح. يرجى السماح بالنوافذ المنبثقة.')
        );
      } else if (code === 'auth/operation-not-allowed') {
        setErrorMsg(
          t('auth_err_operation_not_allowed', 'تسجيل الدخول باستخدام Google غير مفعّل في مشروع Firebase.')
        );
      } else if (code === 'auth/popup-closed-by-user') {
        setErrorMsg(
          t('auth_err_popup_closed', 'تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية. يرجى إعادة المحاولة.')
        );
      } else if (code === 'auth/cancelled-popup-request') {
        setErrorMsg(
          t('auth_err_cancelled_popup', 'تم إلغاء المحاولة لوجود نافذة تسجيل دخول أخرى قيد التشغيل.')
        );
      } else if (code === 'auth/network-request-failed') {
        setErrorMsg(
          t('auth_err_network', 'فشل الاتصال بالشبكة أثناء محاولة المصادقة. يرجى التحقق من اتصال الإنترنت.')
        );
      } else {
        const detail = err?.message || (isRtl ? 'تعذر استكمال المصادقة' : 'Authentication failed');
        setErrorMsg(`${t('auth_err_generic', 'فشل تسجيل الدخول')}: ${detail}${code ? ` (${code})` : ''}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAndRetry = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#122127] rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#dbe8ed] dark:border-[#1e3842] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-2 text-[#526f78] dark:text-stone-400 hover:text-[#0e3c48] dark:hover:white hover:bg-[#f1f7f9] dark:hover:bg-[#1e3842] rounded-xl transition-colors cursor-pointer`}
          title={t('action_close', 'إغلاق')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-18 h-18 mx-auto mb-3 rounded-full bg-white dark:bg-[#0b1519] p-1.5 border-2 border-[#dbe8ed] dark:border-[#1e3842] shadow-md flex items-center justify-center overflow-hidden">
            <img
              src={getAssetUrl('/assets/aistudio/50c0c8c4-5c4f-4db5-8ada-405779c14cc1_db926d78.png')}
              alt={t('initiative_logo_alt', 'شعار مبادرة عافية تُزهر')}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="text-xl font-black text-[#0e3c48] dark:text-white">
            {t('login_modal_title', 'تسجيل الدخول للمسؤولين')}
          </h3>
          <p className="text-xs text-[#526f78] dark:text-stone-400 mt-1">
            {t('login_modal_subtitle', 'بوابة الإدارة للمدير الرئيسي ومشرفي مبادرة "عافية تُزهر"')}
          </p>
        </div>

        {errorMsg && (
          <div className={`mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-start gap-2.5 whitespace-pre-line leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="flex-1 font-medium">{errorMsg}</span>
          </div>
        )}

        {currentUser ? (
          isAuthorizedStaff ? (
            /* Authorized Super Admin or Supervisor */
            <div className={`p-4 bg-[#e8f7ee] border border-[#c4e9d2] rounded-2xl mb-6 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-2 text-[#185644] font-bold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#2e9e66]" />
                <span>{t('login_current_account', 'أنت مسجل الدخول بحساب معتمد:')}</span>
              </div>
              <p className="text-xs text-[#0c2b33] font-mono truncate">{currentUser.email}</p>
              <div className="mt-2 text-xs flex items-center gap-2">
                <span className="text-[#526f78]">{t('login_role', 'الرتبة:')}</span>
                <span className="font-extrabold text-[#134e5e]">
                  {isSuperAdmin
                    ? t('login_role_super', 'المدير الرئيسي (صلاحيات كاملة)')
                    : supervisorProfile?.role === 'admin'
                    ? t('login_role_admin', 'مدير إداري')
                    : t('login_role_editor', 'مشرف محتوى')}
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onSuccess();
                }}
                className="mt-4 w-full py-2.5 bg-[#134e5e] hover:bg-[#0e3c48] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                {t('login_continue_admin', 'متابعة إلى لوحة التحكم')}
              </button>
            </div>
          ) : (
            /* Regular visitor with unauthorized Google account */
            <div className={`p-4 bg-rose-50 border border-rose-200 rounded-2xl mb-6 space-y-2.5 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>{t('login_unauthorized_title', 'حساب غير مصرح له بالإدارة:')}</span>
              </div>
              <p className="text-xs text-stone-700 font-mono truncate">{currentUser.email}</p>
              <p className="text-[11px] text-rose-700 leading-relaxed">
                {t('login_unauthorized_desc', 'هذا الحساب مسجل كمستخدم عادي وليس لديه صلاحية الدخول للوحة التحكم الإدارية.')}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleLogoutAndRetry}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  {t('login_switch_account', 'تسجيل الخروج / تبديل الحساب')}
                </button>
                <button
                  onClick={onClose}
                  className="py-2 px-4 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  {t('action_close', 'إغلاق')}
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-[#0b1519] hover:bg-[#f7fbfc] dark:hover:bg-[#162a32] border border-[#d0e0e6] dark:border-[#1e3842] rounded-2xl text-[#0c2b33] dark:text-white font-bold text-sm shadow-xs transition-colors hover:border-[#2e9e66] disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? t('login_google_loading', 'جارٍ تسجيل الدخول...') : t('login_google_btn', 'تسجيل الدخول باستخدام Google')}</span>
            </button>

            <div className={`p-3.5 bg-[#f7fbfc] dark:bg-[#0b1519] rounded-2xl border border-[#dbe8ed] dark:border-[#1e3842] text-[11px] text-[#526f78] dark:text-stone-300 space-y-1.5 ${isRtl ? 'text-right' : 'text-left'}`}>
              <p className="font-bold text-[#0e3c48] dark:text-white">{t('login_security_notice', 'تنويه الأمان والصلاحيات:')}</p>
              <p>• {t('login_security_admin_email', 'حساب المدير الرئيسي التلقائي:')} <code className="text-[#134e5e] dark:text-[#84d2ea] font-mono font-bold">{SUPER_ADMIN_EMAIL}</code></p>
              <p>• {t('login_security_supervisors_notice', 'المشرفون يتم اعتماد حساباتهم وتعيين صلاحياتهم حصرياً من قِبل المدير الرئيسي عبر لوحة التحكم.')}</p>
              <p>• {t('login_security_visitor_notice', 'الزائر العادي لا يمتلك صلاحية الدخول أو تعديل المحتوى.')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
