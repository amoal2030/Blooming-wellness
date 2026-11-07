import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  direction: 'rtl' | 'ltr';
  isRtl: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<string, { ar: string; en: string }> = {
  // Brand & General
  'initiative_name': { ar: 'مبادرة عافية تُزهر', en: 'Blooming Wellness Initiative' },
  'tagline': { ar: 'بالتوازن تحصل العافية.. وبالعافية نَزْهَر', en: 'With balance comes wellness.. and with wellness we bloom' },
  'please_wait': { ar: 'يرجى الانتظار', en: 'Please wait' },
  'loading': { ar: 'جاري التحميل...', en: 'Loading...' },
  'loading_long': { ar: 'يستغرق الاتصال بقاعدة البيانات وقتاً أطول من المعتاد، يرجى الانتظار...', en: 'Connecting to the database is taking a bit longer than usual, please wait...' },
  'language': { ar: 'اللغة', en: 'Language' },
  'theme': { ar: 'المظهر', en: 'Theme' },
  'light_mode': { ar: 'الوضع الفاتح', en: 'Light Mode' },
  'dark_mode': { ar: 'الوضع الداكن', en: 'Dark Mode' },

  // Navigation
  'nav_home': { ar: 'الرئيسية', en: 'Home' },
  'nav_broadcasts': { ar: 'الإذاعات الصباحية', en: 'Morning Broadcasts' },
  'nav_lectures': { ar: 'المحاضرات التوعوية', en: 'Awareness Lectures' },
  'nav_interviews': { ar: 'المقابلات الحوارية', en: 'Dialogue Interviews' },
  'nav_quizzes': { ar: 'استبانة العادات', en: 'Habits Quiz' },
  'nav_events': { ar: 'الأنشطة والفعاليات', en: 'Events & Activities' },
  'nav_registrations': { ar: 'التسجيل في البرامج', en: 'Program Registrations' },
  'nav_contact': { ar: 'تواصل معنا', en: 'Contact Us' },
  'nav_admin': { ar: 'لوحة التحكم', en: 'Admin Portal' },
  'nav_login': { ar: 'تسجيل الدخول', en: 'Sign In' },
  'nav_logout': { ar: 'تسجيل الخروج', en: 'Sign Out' },

  // Actions
  'action_save': { ar: 'حفظ التعديلات', en: 'Save Changes' },
  'action_cancel': { ar: 'إلغاء', en: 'Cancel' },
  'action_edit': { ar: 'تعديل', en: 'Edit' },
  'action_delete': { ar: 'حذف', en: 'Delete' },
  'action_add': { ar: 'إضافة جديد', en: 'Add New' },
  'action_confirm': { ar: 'تأكيد', en: 'Confirm' },
  'action_watch': { ar: 'مشاهدة الآن', en: 'Watch Now' },
  'action_listen': { ar: 'استماع صوتي', en: 'Listen Audio' },
  'action_read_more': { ar: 'قراءة المزيد', en: 'Read More' },
  'action_register_now': { ar: 'سجل الآن', en: 'Register Now' },
  'action_submit_quiz': { ar: 'إنهاء الاختبار وعرض النتيجة', en: 'Submit & View Results' },
  'action_restart_quiz': { ar: 'إعادة الاختبار', en: 'Retake Quiz' },
  'action_send_message': { ar: 'إرسال الرسالة', en: 'Send Message' },
  'action_sending': { ar: 'جارٍ الإرسال...', en: 'Sending...' },
  'action_return_home': { ar: 'العودة إلى الصفحة الرئيسية', en: 'Return to Homepage' },
  'action_switch_account': { ar: 'تبديل الحساب', en: 'Switch Account' },

  // Home Hero & Sections
  'hero_badge': { ar: 'مبادرة مدرسية ومجتمعية رائدة', en: 'A Pioneering School & Community Initiative' },
  'hero_cta_explore': { ar: 'استكشف برامج المبادرة', en: 'Explore Programs' },
  'hero_cta_quiz': { ar: 'اختبر مدى صحة عاداتك', en: 'Test Your Health Habits' },
  'section_about_title': { ar: 'عن مبادرة عافية تُزهر', en: 'About Blooming Wellness' },
  'section_vision': { ar: 'رؤيتنا', en: 'Our Vision' },
  'section_mission': { ar: 'رسالتنا', en: 'Our Mission' },
  'section_goals': { ar: 'أهداف المبادرة الاستراتيجية', en: 'Strategic Goals' },
  'section_partners': { ar: 'الشراكات والمؤسسات الداعمة', en: 'Supporting Partners' },
  'section_latest_broadcasts': { ar: 'أحدث الإذاعات الصباحية', en: 'Latest Morning Broadcasts' },
  'section_latest_lectures': { ar: 'المحاضرات التوعوية المميزة', en: 'Featured Awareness Lectures' },
  'section_upcoming_events': { ar: 'الأنشطة والفعاليات القادمة', en: 'Upcoming Activities & Events' },
  'section_view_all': { ar: 'عرض الكل', en: 'View All' },

  // Media & Cards
  'card_speaker': { ar: 'المحاضر / المتحدث', en: 'Speaker' },
  'card_guest': { ar: 'ضيف اللقاء', en: 'Guest' },
  'card_duration': { ar: 'المدة', en: 'Duration' },
  'card_date': { ar: 'التاريخ', en: 'Date' },
  'card_time': { ar: 'الوقت', en: 'Time' },
  'card_location': { ar: 'المقر / الموقع', en: 'Location' },
  'card_status_open': { ar: 'متاح للتسجيل', en: 'Open for Registration' },
  'card_status_closed': { ar: 'مغلق', en: 'Closed' },
  'card_status_upcoming': { ar: 'قادم', en: 'Upcoming' },
  'card_status_ongoing': { ar: 'جارٍ الآن', en: 'Ongoing' },
  'card_status_completed': { ar: 'منتهي', en: 'Completed' },
  'card_deadline': { ar: 'آخر موعد للتسجيل', en: 'Registration Deadline' },

  // Quiz
  'quiz_badge': { ar: 'مقياس الوعي الصحي السريع', en: 'Rapid Health Awareness Index' },
  'quiz_score_prefix': { ar: 'نتيجتك:', en: 'Your Score:' },
  'quiz_out_of': { ar: 'من أصل', en: 'out of' },
  'quiz_points': { ar: 'درجة', en: 'points' },
  'quiz_excellent': { ar: 'ممتاز! عاداتك الصحية متوازنة جداً ورائعة.', en: 'Excellent! Your health habits are very balanced and inspiring.' },
  'quiz_good': { ar: 'جيد جداً! لديك أساس صحي قوي وتحتاج إلى بعض التحسينات البسيطة.', en: 'Very Good! You have a solid health foundation with room for minor improvements.' },
  'quiz_needs_care': { ar: 'تحتاج عاداتك إلى مزيد من العناية والتنظيم لتحقيق العافية المثالية.', en: 'Your daily habits need more care and balance to achieve optimal wellness.' },

  // Contact
  'contact_title': { ar: 'يسعدنا تواصلكم واستفساراتكم', en: 'We Welcome Your Inquiries' },
  'contact_subtitle': { ar: 'فريق مبادرة عافية تُزهر مستعد للإجابة على جميع الأسئلة والمقترحات المجتمعية', en: 'The Blooming Wellness team is ready to answer questions and community suggestions' },
  'contact_name': { ar: 'الاسم الكريم', en: 'Full Name' },
  'contact_email': { ar: 'البريد الإلكتروني', en: 'Email Address' },
  'contact_phone': { ar: 'رقم الهاتف (اختياري)', en: 'Phone Number (Optional)' },
  'contact_message': { ar: 'نص الرسالة أو الاستفسار', en: 'Message or Inquiry' },
  'contact_success': { ar: 'تم استلام رسالتكم بنجاح! شكراً لتواصلكم مع مبادرة عافية تُزهر.', en: 'Your message was received successfully! Thank you for connecting with Blooming Wellness.' },

  // Admin Dashboard
  'admin_portal_title': { ar: 'لوحة التحكم الإدارية', en: 'Admin Management Portal' },
  'admin_logged_as': { ar: 'مسجل كـ:', en: 'Signed in as:' },
  'admin_super_badge': { ar: 'المدير الرئيسي (كامل الصلاحيات)', en: 'Super Admin (Full Privileges)' },
  'admin_supervisor_badge': { ar: 'مشرف معتمد', en: 'Authorized Supervisor' },
  'admin_exit': { ar: 'الخروج للموقع العام', en: 'Exit to Public Site' },
  'admin_tab_overview': { ar: 'نظرة عامة وإحصائيات', en: 'Overview & Statistics' },
  'admin_tab_settings': { ar: 'إعدادات المنصة والشعارات', en: 'Settings & Branding' },
  'admin_tab_broadcasts': { ar: 'إدارة الإذاعات', en: 'Broadcasts' },
  'admin_tab_lectures': { ar: 'إدارة المحاضرات', en: 'Lectures' },
  'admin_tab_interviews': { ar: 'إدارة المقابلات', en: 'Interviews' },
  'admin_tab_quizzes': { ar: 'الاستبانات والنتائج', en: 'Quizzes & Responses' },
  'admin_tab_events': { ar: 'الأنشطة والفعاليات', en: 'Events & Activities' },
  'admin_tab_registrations': { ar: 'روابط التسجيل', en: 'Registrations' },
  'admin_tab_supervisors': { ar: 'المشرفون والصلاحيات', en: 'Supervisors & Permissions' },
  'admin_tab_inquiries': { ar: 'رسائل واستفسارات الزوار', en: 'Visitor Inquiries' },

  // Supervisor Management
  'sup_management_title': { ar: 'إدارة المشرفين والصلاحيات', en: 'Supervisors & Permissions Management' },
  'sup_management_desc': { ar: 'خاص بالمدير الرئيسي: إنشاء حسابات المشرفين، تعديل الصلاحيات وسحبها', en: 'Super Admin Only: Create supervisor accounts, edit and revoke section permissions' },
  'sup_super_banner': { ar: 'حساب المدير الرئيسي المعتمد بالنظام:', en: 'Official Super Admin Account:' },
  'sup_super_banner_note': { ar: 'يمتلك المدير الرئيسي الحصري كامل الصلاحيات ولا يمكن تعديلها أو حذفها.', en: 'The Super Admin exclusively possesses all privileges and cannot be modified or deleted.' },
  'sup_add_btn': { ar: 'إضافة مشرف جديد', en: 'Add New Supervisor' },
  'sup_edit_modal_title': { ar: 'تعديل صلاحيات المشرف', en: 'Edit Supervisor Permissions' },
  'sup_name_label': { ar: 'اسم المشرف', en: 'Supervisor Name' },
  'sup_email_label': { ar: 'البريد الإلكتروني المعتمد (Google)', en: 'Authorized Google Email' },
  'sup_role_label': { ar: 'الرتبة الإدارية', en: 'Administrative Role' },
  'sup_role_editor': { ar: 'مشرف محتوى (صلاحيات مخصصة للأقسام)', en: 'Content Supervisor (Custom Section Permissions)' },
  'sup_role_admin': { ar: 'مدير إداري (صلاحيات كاملة للأقسام)', en: 'Administrative Manager (Full Section Permissions)' },
  'sup_perms_header': { ar: 'الصلاحيات الممنوحة للأقسام:', en: 'Granted Section Permissions:' },
  'sup_save_success': { ar: 'تم تحديث صلاحيات المشرف بنجاح!', en: 'Supervisor permissions updated successfully!' },
  'sup_save_error': { ar: 'تعذر حفظ صلاحيات المشرف.', en: 'Failed to update supervisor permissions.' },
  'sup_delete_confirm_title': { ar: 'سحب الصلاحيات', en: 'Revoke Permissions' },
  'sup_delete_confirm_msg': { ar: 'هل أنت متأكد من سحب صلاحيات هذا المشرف؟', en: 'Are you sure you want to revoke this supervisor’s permissions?' },
  'sup_delete_success': { ar: 'تم سحب صلاحيات المشرف بنجاح.', en: 'Supervisor permissions revoked successfully.' },
  'sup_no_supervisors': { ar: 'لا يوجد مشرفون إضافيون مسجلون حالياً.', en: 'No additional supervisors registered yet.' },

  // Access Denied
  'access_denied_title': { ar: 'لا يمكنك الدخول', en: 'Access Restricted' },
  'access_denied_subtitle': { ar: 'منطقة مخصصة لإدارة المبادرة', en: 'Dedicated Initiative Management Area' },
  'access_denied_msg': { ar: 'يرجى تسجيل الدخول باستخدام حساب Google المعتمد للمدير الرئيسي أو المشرفين للوصول إلى لوحة التحكم الإدارية.', en: 'Please sign in with the authorized Google account for the Super Admin or approved Supervisors to access the Admin Portal.' },
  'access_denied_unauthorized': { ar: 'مستخدم غير مصرح له', en: 'Unauthorized User' },
  'access_denied_hint': { ar: 'هذا الحساب غير مسجل ضمن قائمة المشرفين المعتمدين في النظام.', en: 'This account is not registered in the system’s authorized staff directory.' },

  // Footer
  'footer_tagline': { ar: 'مبادرة مدرسية ومجتمعية تحت إشراف وزارة التعليم وتنظيم مدرسة ثانوية الشاطئ', en: 'A school and community initiative supervised by the Ministry of Education and organized by Al-Shatee High School' },
  'footer_rights': { ar: 'جميع الحقوق محفوظة لمبادرة عافية تُزهر ©', en: 'All rights reserved to Blooming Wellness Initiative ©' },
  'footer_designed_by': { ar: 'صمم بعناية في خدماتي البرمجية', en: 'Crafted with care at My Software Services' }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  direction: 'rtl',
  isRtl: true,
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aafia_language');
      if (saved === 'en' || saved === 'ar') return saved;
    }
    return 'ar';
  });

  const isRtl = language === 'ar';
  const direction: 'rtl' | 'ltr' = isRtl ? 'rtl' : 'ltr';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = direction;
      document.documentElement.lang = language;
      if (isRtl) {
        document.documentElement.classList.add('font-arabic');
        document.documentElement.classList.remove('font-english');
      } else {
        document.documentElement.classList.add('font-english');
        document.documentElement.classList.remove('font-arabic');
      }
    }
    try {
      localStorage.setItem('aafia_language', language);
    } catch {
      // Ignored in storage-restricted environments
    }
  }, [language, direction, isRtl]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string, fallback?: string): string => {
    const entry = translations[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    if (fallback) return fallback;
    if (entry && entry.ar) return entry.ar;
    return key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isRtl,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
