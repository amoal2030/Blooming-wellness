import React, { useState } from 'react';
import { useAuth, SUPER_ADMIN_EMAIL } from '../context/AuthContext';
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
  const { login, currentUser, isSuperAdmin, supervisorProfile } = useAuth();
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
          `النطاق الحالي (${domain}) غير مصرّح به في مشروع Firebase.\n` +
          `الحل: توجه إلى Firebase Console > Authentication > Settings > Authorized domains وأضف النطاق: ${domain} (رمز الخطأ: ${code})`
        );
      } else if (code === 'auth/popup-blocked') {
        setErrorMsg(
          `تم حظر نافذة تسجيل الدخول المنبثقة من قبل المتصفح.\n` +
          `يرجى النقر على أيقونة النوافذ المنبثقة في شريط العنوان بالأعلى والسماح بها. (رمز الخطأ: ${code})`
        );
      } else if (code === 'auth/operation-not-allowed') {
        setErrorMsg(
          `تسجيل الدخول باستخدام Google غير مفعّل في مشروع Firebase.\n` +
          `يرجى تفعيله من Firebase Console > Authentication > Sign-in method > Google. (رمز الخطأ: ${code})`
        );
      } else if (code === 'auth/popup-closed-by-user') {
        setErrorMsg(
          `تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية. يرجى إعادة المحاولة. (رمز الخطأ: ${code})`
        );
      } else if (code === 'auth/cancelled-popup-request') {
        setErrorMsg(
          `تم إلغاء المحاولة لوجود نافذة تسجيل دخول أخرى قيد التشغيل. (رمز الخطأ: ${code})`
        );
      } else if (code === 'auth/network-request-failed') {
        setErrorMsg(
          `فشل الاتصال بالشبكة أثناء محاولة المصادقة. يرجى التحقق من اتصال الإنترنت. (رمز الخطأ: ${code})`
        );
      } else {
        const detail = err?.message || 'تعذر استكمال المصادقة';
        setErrorMsg(`فشل تسجيل الدخول: ${detail}${code ? ` (${code})` : ''}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0e3c48]/75 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#dbe8ed]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-[#526f78] hover:text-[#0e3c48] hover:bg-[#f1f7f9] rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-18 h-18 mx-auto mb-3 rounded-full bg-white p-1.5 border-2 border-[#dbe8ed] shadow-md flex items-center justify-center overflow-hidden">
            <img
              src={getAssetUrl('/assets/aistudio/image_8a68eff7.png')}
              alt="شعار مبادرة عافية تُزهر"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="text-xl font-black text-[#0e3c48]">تسجيل الدخول للمسؤولين</h3>
          <p className="text-xs text-[#526f78] mt-1">
            بوابة الإدارة للمدير الرئيسي ومشرفي مبادرة "عافية تُزهر"
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-start gap-2.5 whitespace-pre-line leading-relaxed text-right">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="flex-1 font-medium">{errorMsg}</span>
          </div>
        )}

        {currentUser ? (
          <div className="p-4 bg-[#e8f7ee] border border-[#c4e9d2] rounded-2xl mb-6 text-right">
            <div className="flex items-center gap-2 text-[#185644] font-bold text-sm mb-1">
              <CheckCircle2 className="w-4 h-4 text-[#2e9e66]" />
              <span>أنت مسجل الدخول حالياً:</span>
            </div>
            <p className="text-xs text-[#0c2b33] font-mono truncate">{currentUser.email}</p>
            <div className="mt-2 text-xs flex items-center gap-2">
              <span className="text-[#526f78]">الرتبة:</span>
              <span className="font-extrabold text-[#134e5e]">
                {isSuperAdmin
                  ? 'المدير الرئيسي (صلاحيات كاملة)'
                  : supervisorProfile?.role === 'admin'
                  ? 'مدير إداري'
                  : supervisorProfile?.role === 'editor'
                  ? 'مشرف محتوى'
                  : 'زائر مسجل (بانتظار تفويض الإدارة)'}
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onSuccess();
              }}
              className="mt-4 w-full py-2.5 bg-[#134e5e] hover:bg-[#0e3c48] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              متابعة إلى لوحة التحكم
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-[#f7fbfc] border border-[#d0e0e6] rounded-2xl text-[#0c2b33] font-bold text-sm shadow-xs transition-colors hover:border-[#2e9e66] disabled:opacity-50 cursor-pointer"
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
              <span>{loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول باستخدام Google'}</span>
            </button>

            <div className="p-3.5 bg-[#f7fbfc] rounded-2xl border border-[#dbe8ed] text-[11px] text-[#526f78] space-y-1.5">
              <p className="font-bold text-[#0e3c48]">تنويه الأمان والصلاحيات:</p>
              <p>• حساب المدير الرئيسي التلقائي: <code className="text-[#134e5e] font-mono font-bold">{SUPER_ADMIN_EMAIL}</code></p>
              <p>• المشرفون يتم اعتماد حساباتهم وتعيين صلاحياتهم حصرياً من قِبل المدير الرئيسي عبر لوحة التحكم.</p>
              <p>• الزائر العادي لا يمتلك صلاحية الدخول أو تعديل المحتوى.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
