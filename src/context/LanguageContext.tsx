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

  // Navigation & User Guide
  'nav_home': { ar: 'الرئيسية', en: 'Home' },
  'nav_broadcasts': { ar: 'الإذاعات الصباحية', en: 'Morning Broadcasts' },
  'nav_lectures': { ar: 'المحاضرات التوعوية', en: 'Awareness Lectures' },
  'nav_interviews': { ar: 'المقابلات الحوارية', en: 'Dialogue Interviews' },
  'nav_quizzes': { ar: 'اختبر عاداتك', en: 'Habits Quiz' },
  'nav_events': { ar: 'الأنشطة والفعاليات', en: 'Events & Activities' },
  'nav_registrations': { ar: 'التسجيل في البرامج', en: 'Program Registrations' },
  'nav_contact': { ar: 'تواصل معنا', en: 'Contact Us' },
  'nav_admin': { ar: 'لوحة التحكم', en: 'Admin Portal' },
  'nav_login': { ar: 'دخول الإدارة', en: 'Sign In' },
  'nav_logout': { ar: 'تسجيل الخروج', en: 'Sign Out' },
  'nav_user_guide': { ar: 'دليل المستخدم', en: 'User Guide' },
  'user_guide_title': { ar: 'تصفح دليل المستخدم التفاعلي', en: 'Explore Interactive User Guide' },

  // Common Actions
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
  'action_search': { ar: 'بحث...', en: 'Search...' },
  'action_filter_all': { ar: 'الكل', en: 'All' },
  'action_back': { ar: 'رجوع', en: 'Back' },
  'action_close': { ar: 'إغلاق', en: 'Close' },

  // Home Hero & Pillars
  'hero_sponsor_badge': { ar: 'برعاية وزارة التعليم وتنظيم مدرسة ثانوية الشاطئ', en: 'Supervised by the Ministry of Education & Organized by Al-Shatee High School' },
  'hero_desc': { ar: 'منصة توعوية رائدة لترسيخ عادات الحياة المتوازنة: الغذاء الصحي، النشاط البدني، جودة النوم، والعافية النفسية لطلاب ثانوية الشاطئ والمجتمع.', en: 'A leading educational platform fostering balanced lifestyle habits: healthy nutrition, physical activity, sleep quality, and psychological wellness.' },
  'hero_btn_quiz': { ar: 'اختبر مدى صحة عاداتك الآن', en: 'Test Your Habits Now' },
  'hero_btn_events': { ar: 'استكشف الفعاليات والأنشطة', en: 'Explore Events & Activities' },
  'pillars_title': { ar: 'الركائز الأربع لنمط الحياة المتوازن', en: 'Four Pillars of a Balanced Lifestyle' },
  'pillars_subtitle': { ar: 'تعتمد مبادرة عافية تُزهر على تكامل الركائز الصحية الأربع لبناء صحة مستدامة وجودة حياة مزدهرة.', en: 'Blooming Wellness relies on integrating four core health pillars to build sustainable wellness and vibrant life quality.' },
  'pillar_nutrition': { ar: 'التغذية الصحية الطبيعية', en: 'Natural Healthy Nutrition' },
  'pillar_nutrition_desc': { ar: 'اعتماد الغذاء المتوازن غير المعالج، والحد من السكريات والمشروبات الغازية لدعم الطاقة اليومية والتركيز الذهني.', en: 'Emphasizing whole foods, balanced nutrition, and minimizing refined sugars for sustained daily focus.' },
  'pillar_activity': { ar: 'النشاط البدني والحركي', en: 'Physical & Active Movement' },
  'pillar_activity_desc': { ar: 'ممارسة الحركة اليومية والرياضة المنتظمة لتعزيز صحة القلب والشرايين والنشاط الذهني ومكافحة الخمول.', en: 'Promoting daily workouts and regular exercises to boost cardiovascular health and mental vitality.' },
  'pillar_sleep': { ar: 'جودة النوم والراحة', en: 'Sleep Quality & Recovery' },
  'pillar_sleep_desc': { ar: 'الالتزام بساعات نوم منتظمة وعميقة تدعم ترميم الخلايا واستقرار مستويات الطاقة والمناعة.', en: 'Maintaining regular restorative sleep cycles that optimize cellular repair, immunity, and alertness.' },
  'pillar_mental': { ar: 'العافية النفسية والتوازن', en: 'Mental & Emotional Wellness' },
  'pillar_mental_desc': { ar: 'إدارة الضغوط الحياتية والرقمية، وبناء التفكير الإيجابي والوعي الذاتي في البيئة المدرسية والمجتمعية.', en: 'Managing digital and life stressors, cultivating positive mindset and emotional balance.' },

  // About, Vision, Mission, Goals
  'section_about_title': { ar: 'عن مبادرة عافية تُزهر', en: 'About Blooming Wellness Initiative' },
  'section_vision': { ar: 'رؤيتنا', en: 'Our Vision' },
  'section_mission': { ar: 'رسالتنا', en: 'Our Mission' },
  'section_goals': { ar: 'أهداف المبادرة الاستراتيجية', en: 'Strategic Goals' },
  'section_partners': { ar: 'الجهات المشاركة والداعمة للمبادرة', en: 'Supporting Partners & Organizers' },
  'section_latest_broadcasts': { ar: 'أحدث الإذاعات الصباحية', en: 'Latest Morning Broadcasts' },
  'section_latest_lectures': { ar: 'المحاضرات التوعوية المميزة', en: 'Featured Awareness Lectures' },
  'section_upcoming_events': { ar: 'الأنشطة والفعاليات القادمة', en: 'Upcoming Activities & Events' },
  'section_view_all': { ar: 'عرض الكل', en: 'View All' },

  // Public Views
  'broadcasts_title': { ar: 'الإذاعات الصباحية المدرسية', en: 'Morning School Broadcasts' },
  'broadcasts_subtitle': { ar: 'فقرات إذاعية صباحية تفاعلية وملهمة تبث الوعي الصحي بين الطلاب ومنسوبي التعليم', en: 'Interactive morning school radio episodes promoting healthy living among students and educators' },
  'broadcasts_search_placeholder': { ar: 'ابحث في موضوعات الإذاعات المدرسية...', en: 'Search broadcast topics and titles...' },
  'broadcasts_no_items': { ar: 'لم يتم العثور على إذاعات مطابقة لبحثك.', en: 'No broadcasts matched your search criteria.' },

  'lectures_title': { ar: 'المحاضرات والندوات التوعوية', en: 'Awareness Lectures & Webinars' },
  'lectures_subtitle': { ar: 'محاضرات طبية وتثقيفية متخصصة يلقيها نخبة من الأطباء واستشاريي الرعاية الصحية', en: 'Specialized medical and wellness lectures delivered by distinguished physicians and health consultants' },
  'lectures_search_placeholder': { ar: 'ابحث عن محاضرة أو طبيب...', en: 'Search lectures or physicians...' },
  'lectures_no_items': { ar: 'لم يتم العثور على محاضرات مطابقة لبحثك.', en: 'No lectures matched your search criteria.' },

  'interviews_title': { ar: 'المقابلات والحوارات الملهمة', en: 'Inspiring Dialogue Interviews' },
  'interviews_subtitle': { ar: 'حوارات مرئية شيقة مع خبراء الصحة ورياضيين ملهمين حول تغيير نمط الحياة', en: 'Engaging video discussions with healthcare professionals and fitness role models on wellness transformations' },
  'interviews_search_placeholder': { ar: 'ابحث في المقابلات أو أسماء الضيوف...', en: 'Search interviews or guest speakers...' },
  'interviews_no_items': { ar: 'لم يتم العثور على مقابلات حوارية مطابقة.', en: 'No dialogue interviews found matching your criteria.' },

  'events_title': { ar: 'الأنشطة والفعاليات المجتمعية', en: 'Activities & Community Events' },
  'events_subtitle': { ar: 'شارك في ماراثونات المشي، ورش العمل التطبيقية، والملتقيات الصحية المنظمة للجميع', en: 'Participate in walking marathons, interactive workshops, and community health meetups' },
  'events_tab_all': { ar: 'جميع الفعاليات', en: 'All Events' },
  'events_tab_upcoming': { ar: 'الفعاليات القادمة', en: 'Upcoming Events' },
  'events_tab_ongoing': { ar: 'الجارية الآن', en: 'Ongoing' },
  'events_tab_completed': { ar: 'الفعاليات السابقة', en: 'Completed Events' },
  'events_no_items': { ar: 'لا توجد فعاليات في هذا القسم حالياً.', en: 'No events currently listed in this category.' },

  'registrations_title': { ar: 'التسجيل في البرامج والفرص', en: 'Program Registrations & Opportunities' },
  'registrations_subtitle': { ar: 'سجل في الدورات التدريبية المعتمدة، الفحوصات الطبية الاستباقية، وبرامج التطوع الصحي', en: 'Register for certified health training programs, proactive medical screenings, and wellness volunteering' },
  'registrations_tab_all': { ar: 'جميع البرامج', en: 'All Programs' },
  'registrations_tab_open': { ar: 'المتاحة للتسجيل', en: 'Open for Registration' },
  'registrations_tab_closed': { ar: 'المكتملة / المغلقة', en: 'Closed / Completed' },
  'registrations_no_items': { ar: 'لا توجد برامج تسجيل حالياً.', en: 'No registration programs available at the moment.' },

  // Media & Cards
  'card_speaker': { ar: 'المحاضر / المتحدث', en: 'Speaker' },
  'card_guest': { ar: 'ضيف اللقاء', en: 'Guest Speaker' },
  'card_duration': { ar: 'المدة', en: 'Duration' },
  'card_date': { ar: 'التاريخ', en: 'Date' },
  'card_time': { ar: 'الوقت', en: 'Time' },
  'card_location': { ar: 'المقر / الموقع', en: 'Location' },
  'card_status_open': { ar: 'متاح للتسجيل', en: 'Open for Registration' },
  'card_status_closed': { ar: 'مغلق', en: 'Registration Closed' },
  'card_status_upcoming': { ar: 'قادم', en: 'Upcoming' },
  'card_status_ongoing': { ar: 'جارٍ الآن', en: 'Ongoing' },
  'card_status_completed': { ar: 'منتهي', en: 'Completed' },
  'card_deadline': { ar: 'آخر موعد للتسجيل', en: 'Registration Deadline' },
  'card_featured_badge': { ar: 'فعالية مميزة', en: 'Featured Event' },

  // Habits Quiz
  'quiz_badge': { ar: 'مقياس الوعي الصحي السريع', en: 'Rapid Health Awareness Index' },
  'quiz_main_title': { ar: 'اختبر مدى صحة عاداتك اليومية', en: 'Test Your Daily Lifestyle Habits' },
  'quiz_main_desc': { ar: 'أجب على الأسئلة الدقيقة المعتمدة لتقييم توازنك في التغذية، النشاط، النوم، والحالة الذهنية.', en: 'Answer validated lifestyle questions to assess your balance in nutrition, exercise, sleep, and mental wellness.' },
  'quiz_select_quiz': { ar: 'اختر المقياس المناسب لك:', en: 'Choose an assessment tool:' },
  'quiz_score_prefix': { ar: 'نتيجتك:', en: 'Your Score:' },
  'quiz_out_of': { ar: 'من أصل', en: 'out of' },
  'quiz_points': { ar: 'درجة', en: 'points' },
  'quiz_question_num': { ar: 'السؤال', en: 'Question' },
  'quiz_submit_btn': { ar: 'إنهاء الاختبار وعرض النتيجة', en: 'Finish & View Score' },
  'quiz_restart_btn': { ar: 'إعادة الاختبار', en: 'Retake Assessment' },
  'quiz_result_congrats': { ar: 'تم إنهاء المقياس بنجاح!', en: 'Assessment Completed Successfully!' },
  'quiz_excellent': { ar: 'ممتاز! عاداتك الصحية متوازنة جداً ورائعة وتستحق الاقتداء.', en: 'Excellent! Your health habits are remarkably balanced, disciplined, and inspiring.' },
  'quiz_good': { ar: 'جيد جداً! لديك أساس صحي قوي وتحتاج إلى بعض التحسينات البسيطة.', en: 'Very Good! You have a solid health foundation with room for minor lifestyle optimizations.' },
  'quiz_needs_care': { ar: 'تحتاج عاداتك إلى مزيد من العناية والتنظيم لتحقيق العافية المثالية.', en: 'Your daily habits need more care and balance to achieve optimal wellness.' },
  'quiz_no_quizzes': { ar: 'لا توجد استبانات مفعلة حالياً.', en: 'No active quizzes or assessments at this moment.' },

  // Contact
  'contact_title': { ar: 'يسعدنا تواصلكم واستفساراتكم', en: 'We Welcome Your Inquiries' },
  'contact_subtitle': { ar: 'فريق مبادرة عافية تُزهر مستعد للإجابة على جميع الأسئلة والمقترحات المجتمعية', en: 'The Blooming Wellness team is ready to answer questions and community suggestions' },
  'contact_name': { ar: 'الاسم الكريم', en: 'Full Name' },
  'contact_email': { ar: 'البريد الإلكتروني', en: 'Email Address' },
  'contact_phone': { ar: 'رقم الهاتف (اختياري)', en: 'Phone Number (Optional)' },
  'contact_message': { ar: 'نص الرسالة أو الاستفسار', en: 'Message or Inquiry' },
  'contact_send_btn': { ar: 'إرسال الرسالة', en: 'Send Message' },
  'contact_sending_btn': { ar: 'جارٍ الإرسال...', en: 'Sending...' },
  'contact_success': { ar: 'تم استلام رسالتكم بنجاح! شكراً لتواصلكم مع مبادرة عافية تُزهر.', en: 'Your message was received successfully! Thank you for connecting with Blooming Wellness.' },
  'contact_error_fill': { ar: 'يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، والرسالة).', en: 'Please fill in all required fields (Name, Email, and Message).' },
  'contact_error_generic': { ar: 'حدث خطأ أثناء إرسال استفسارك، يرجى المحاولة لاحقاً.', en: 'An error occurred while sending your message. Please try again later.' },

  // Login Modal
  'login_modal_title': { ar: 'تسجيل الدخول للمسؤولين', en: 'Staff & Administration Sign In' },
  'login_modal_subtitle': { ar: 'بوابة الإدارة للمدير الرئيسي ومشرفي مبادرة "عافية تُزهر"', en: 'Administrative portal for the Super Admin and authorized initiative supervisors' },
  'login_google_btn': { ar: 'تسجيل الدخول باستخدام Google', en: 'Sign in with Google' },
  'login_google_loading': { ar: 'جارٍ تسجيل الدخول...', en: 'Signing in...' },
  'login_current_account': { ar: 'أنت مسجل الدخول بحساب معتمد:', en: 'You are signed in with an authorized account:' },
  'login_role': { ar: 'الرتبة:', en: 'Role:' },
  'login_role_super': { ar: 'المدير الرئيسي (صلاحيات كاملة)', en: 'Super Admin (Full Access)' },
  'login_role_admin': { ar: 'مدير إداري', en: 'Administrative Manager' },
  'login_role_editor': { ar: 'مشرف محتوى', en: 'Content Supervisor' },
  'login_continue_admin': { ar: 'متابعة إلى لوحة التحكم', en: 'Continue to Admin Portal' },
  'login_unauthorized_title': { ar: 'حساب غير مصرح له بالإدارة:', en: 'Unauthorized Administrative Account:' },
  'login_unauthorized_desc': { ar: 'هذا الحساب مسجل كمستخدم عادي وليس لديه صلاحية الدخول للوحة التحكم الإدارية.', en: 'This Google account is signed in as a standard visitor and lacks administrative access.' },
  'login_switch_account': { ar: 'تسجيل الخروج / تبديل الحساب', en: 'Sign Out / Switch Account' },
  'login_security_notice': { ar: 'تنويه الأمان والصلاحيات:', en: 'Security & Access Control Notice:' },
  'login_security_admin_email': { ar: 'حساب المدير الرئيسي التلقائي:', en: 'Designated Super Admin Account:' },
  'login_security_supervisors_notice': { ar: 'المشرفون يتم اعتماد حساباتهم وتعيين صلاحياتهم حصرياً من قِبل المدير الرئيسي عبر لوحة التحكم.', en: 'Supervisors are granted section permissions exclusively by the Super Admin in the portal.' },
  'login_security_visitor_notice': { ar: 'الزائر العادي لا يمتلك صلاحية الدخول أو تعديل المحتوى.', en: 'Standard visitors cannot view or modify administrative contents.' },

  // Access Denied
  'access_denied_title': { ar: 'لا يمكنك الدخول', en: 'Access Restricted' },
  'access_denied_subtitle': { ar: 'منطقة مخصصة لإدارة المبادرة', en: 'Dedicated Initiative Management Area' },
  'access_denied_msg': { ar: 'يرجى تسجيل الدخول باستخدام حساب Google المعتمد للمدير الرئيسي أو المشرفين للوصول إلى لوحة التحكم الإدارية.', en: 'Please sign in with the authorized Google account for the Super Admin or approved Supervisors to access the Admin Portal.' },
  'access_denied_unauthorized': { ar: 'مستخدم غير مصرح له', en: 'Unauthorized User' },
  'access_denied_hint': { ar: 'هذا الحساب غير مسجل ضمن قائمة المشرفين المعتمدين في النظام.', en: 'This account is not registered in the system’s authorized staff directory.' },
  'access_denied_return_home': { ar: 'العودة إلى الصفحة الرئيسية', en: 'Return to Homepage' },
  'access_denied_current_account': { ar: 'الحساب المسجل حالياً:', en: 'Current Signed-in Account:' },

  // Admin Dashboard
  'admin_portal_title': { ar: 'لوحة التحكم الإدارية', en: 'Admin Management Portal' },
  'admin_logged_as': { ar: 'مسجل كـ:', en: 'Signed in as:' },
  'admin_super_badge': { ar: 'المدير الرئيسي (كامل الصلاحيات)', en: 'Super Admin (Full Privileges)' },
  'admin_supervisor_badge': { ar: 'مشرف معتمد', en: 'Authorized Supervisor' },
  'admin_exit': { ar: 'الخروج للموقع العام', en: 'Exit to Public Site' },
  'admin_tab_overview': { ar: 'الإحصائيات العامة', en: 'Overview & Analytics' },
  'admin_tab_settings': { ar: 'إعدادات الموقع والشعارات', en: 'Site Settings & Branding' },
  'admin_tab_broadcasts': { ar: 'الإذاعات الصباحية', en: 'Broadcasts' },
  'admin_tab_lectures': { ar: 'المحاضرات التوعوية', en: 'Lectures' },
  'admin_tab_interviews': { ar: 'المقابلات الحوارية', en: 'Interviews' },
  'admin_tab_quizzes': { ar: 'الاستبانات والإحصائيات', en: 'Quizzes & Responses' },
  'admin_tab_events': { ar: 'الأنشطة والفعاليات', en: 'Events & Activities' },
  'admin_tab_registrations': { ar: 'روابط التسجيل', en: 'Registrations' },
  'admin_tab_supervisors': { ar: 'المشرفون والصلاحيات', en: 'Supervisors & Permissions' },
  'admin_tab_inquiries': { ar: 'رسائل واستفسارات الزوار', en: 'Visitor Inquiries' },
  'admin_seed_btn': { ar: 'تهيئة بيانات المبادرة', en: 'Seed Initiative Content' },

  // Admin Settings Section
  'settings_page_title': { ar: 'إعدادات هوية المبادرة والشعارات', en: 'Initiative Identity & Logos Settings' },
  'settings_initiative_name': { ar: 'اسم المبادرة', en: 'Initiative Name' },
  'settings_tagline': { ar: 'الشعار اللفظي', en: 'Tagline' },
  'settings_initiative_logo': { ar: 'شعار مبادرة عافية تُزهر', en: 'Blooming Wellness Logo' },
  'settings_moe_logo': { ar: 'شعار وزارة التعليم', en: 'Ministry of Education Logo' },
  'settings_school_logo': { ar: 'شعار مدرسة ثانوية الشاطئ', en: 'Al-Shatee High School Logo' },
  'settings_about_text': { ar: 'نبذة عن المبادرة', en: 'About the Initiative' },
  'settings_vision_text': { ar: 'الرؤية', en: 'Vision' },
  'settings_mission_text': { ar: 'الرسالة', en: 'Mission' },
  'settings_contact_email': { ar: 'البريد الإلكتروني للتواصل', en: 'Contact Email' },
  'settings_contact_phone': { ar: 'رقم هاتف التواصل', en: 'Contact Phone' },
  'settings_address': { ar: 'العنوان الرسمي', en: 'Official Address' },

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
