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
  'initiative_name': { ar: 'مبادرة عافية تُزهر', en: 'Blooming Wellness Initiative' },
  'tagline': { ar: 'بالتوازن تحصل العافية.. وبالعافية نَزْهَر', en: 'With balance comes wellness.. and with wellness we bloom' },
  'initiative_logo_alt': { ar: 'شعار مبادرة عافية تُزهر الرسمي', en: 'Official Blooming Wellness Initiative Logo' },
  'moe_logo_alt': { ar: 'شعار وزارة التعليم', en: 'Ministry of Education Logo' },
  'school_logo_alt': { ar: 'شعار مدرسة ثانوية الشاطئ', en: 'Al-Shatee High School Logo' },
  'general_director': { ar: 'المدير العام', en: 'General Director' },
  'admin_badge': { ar: 'المدير', en: 'Admin' },
  'main_menu': { ar: 'القائمة الرئيسية', en: 'Main Menu' },
  'change_language': { ar: 'تغيير اللغة', en: 'Change Language' },
  'toggle_theme': { ar: 'تبديل المظهر', en: 'Toggle Theme' },
  'back_to_top': { ar: 'العودة للأعلى', en: 'Back to Top' },
  'please_wait': { ar: 'يرجى الانتظار', en: 'Please wait' },
  'loading': { ar: 'جاري التحميل...', en: 'Loading...' },
  'loading_long': { ar: 'يستغرق الاتصال بقاعدة البيانات وقتاً أطول من المعتاد، يرجى الانتظار...', en: 'Connecting to the database is taking a bit longer than usual, please wait...' },
  'language': { ar: 'اللغة', en: 'Language' },
  'theme': { ar: 'المظهر', en: 'Theme' },
  'light_mode': { ar: 'الوضع الفاتح', en: 'Light Mode' },
  'dark_mode': { ar: 'الوضع الداكن', en: 'Dark Mode' },

  // Default Initiative Content (Bilingual for Home, About, Goals, Partners)
  'default_about_text': {
    ar: 'مبادرة مدرسية ومجتمعية توعوية رائدة تحت إشراف وزارة التعليم وتنظيم مدرسة ثانوية الشاطئ، تهدف إلى ترسيخ الركائز الأربع لنمط الحياة المتوازن: التغذية الصحية الطبيعية، والنشاط البدني المستمر، وجودة النوم والراحة، والعافية النفسية، لتمكين الطلاب والمجتمع من بناء حياة صحية ملهمة ومزدهرة.',
    en: 'A leading school and community educational initiative supervised by the Ministry of Education and organized by Al-Shatee High School, aiming to establish the four pillars of a balanced lifestyle: natural healthy nutrition, continuous physical activity, quality sleep and recovery, and mental wellbeing, empowering students and the community to build an inspiring, flourishing life.'
  },
  'default_vision_text': {
    ar: 'أن نكون النموذج التوعوي المدرسي والمجتمعي الرائد في صناعة أجيال واعية تحقق التوازن الصحي وتزهر بالعافية وجودة الحياة.',
    en: 'To be the leading school and community educational model nurturing conscious generations that achieve wellness balance and flourish with high life quality.'
  },
  'default_mission_text': {
    ar: 'نشر الوعي الصحي المتكامل من خلال برامج إذاعية تفاعلية، ومحاضرات متخصصة، ومقابلات ملهمة، واستبانات ذكية تدعم التوازن بين العقل والجسد والروح.',
    en: 'Promoting holistic health awareness through interactive radio broadcasts, specialized lectures, inspiring dialogues, and smart assessments supporting balance across mind, body, and spirit.'
  },
  'default_goal_1': {
    ar: 'ترسيخ ثقافة الغذاء الصحي المتوازن والابتعاد عن الأنماط الغذائية الضارة.',
    en: 'Fostering a culture of balanced nutritious food and avoiding harmful dietary patterns.'
  },
  'default_goal_2': {
    ar: 'تحفيز النشاط البدني والحركي اليومي لدى الطلاب وأفراد المجتمع.',
    en: 'Encouraging daily physical movement and sports workouts among students and community members.'
  },
  'default_goal_3': {
    ar: 'التوعية بأهمية النوم الصحي المنتظم وأثره المباشر على التركيز والتحصيل الدراسي.',
    en: 'Raising awareness of regular restorative sleep and its direct impact on academic focus.'
  },
  'default_goal_4': {
    ar: 'تعزيز الصحة النفسية والتوازن الوجداني وجودة الحياة في البيئة المدرسية والمجتمعية.',
    en: 'Strengthening mental wellbeing, emotional balance, and quality of life in school and community.'
  },
  'default_goal_5': {
    ar: 'تفعيل الشراكة الإيجابية والتكامل البناء بين وزارة التعليم ومدرسة ثانوية الشاطئ والمجتمع.',
    en: 'Enabling positive partnership and constructive collaboration between the Ministry of Education, Al-Shatee High School, and the community.'
  },
  'default_address': {
    ar: 'المملكة العربية السعودية - مدرسة ثانوية الشاطئ',
    en: 'Kingdom of Saudi Arabia - Al-Shatee High School'
  },
  'partner_moe': { ar: 'وزارة التعليم', en: 'Ministry of Education' },
  'partner_school': { ar: 'مدرسة ثانوية الشاطئ', en: 'Al-Shatee High School' },
  'partner_supporting_role': { ar: 'شريك وراعي معتمد للمبادرة', en: 'Official Supporting Partner' },

  // Home Page Additional Texts
  'home_balanced_banner_title': { ar: 'بيئة مدرسية ومجتمعية تتوازن صحياً وتزهر بالعافية', en: 'A school & community environment blooming with wellness' },
  'home_goals_title': { ar: 'أهداف استراتيجية لتعزيز جودة الحياة', en: 'Strategic Goals to Enhance Quality of Life' },
  'home_quiz_callout_title': { ar: 'هل تسير على نمط حياة متوازن وصحي؟', en: 'Are You Following a Balanced Healthy Lifestyle?' },
  'home_quiz_callout_desc': { ar: 'أجب عن بضعة أسئلة تفاعلية سريعة لقياس مؤشر عاداتك في شرب الماء، الغذاء، ساعات النوم، والحركة البدنية، واحصل على تقريرك الصحي فوراً.', en: 'Answer a few quick interactive questions to measure your habits index in hydration, diet, sleep, and physical movement.' },
  'home_quiz_callout_btn': { ar: 'بدء اختبار التوازن الآن', en: 'Start Balance Assessment Now' },

  // Media Player & Video Modal
  'video_modal_close': { ar: 'إغلاق النافذة', en: 'Close Window' },
  'video_modal_unsupported_video': { ar: 'متصفحك لا يدعم تشغيل هذا الفيديو.', en: 'Your browser does not support playing this video.' },
  'video_modal_audio_recording': { ar: 'تسجيل البث الصوتي:', en: 'Audio Broadcast Recording:' },
  'video_modal_unsupported_audio': { ar: 'متصفحك لا يدعم تشغيل الملف الصوتي.', en: 'Your browser does not support playing audio files.' },
  'video_modal_open_external': { ar: 'فتح الرابط الخارجي مباشرة', en: 'Open External Link Directly' },

  // Error Boundary
  'error_boundary_title': { ar: 'مبادرة عافية تُزهر', en: 'Blooming Wellness Initiative' },
  'error_boundary_desc': { ar: 'حدث خطأ أثناء تحميل بعض عناصر الصفحة. اضغط على الزر أدناه لإعادة تنشيط الصفحة.', en: 'An error occurred while loading some page elements. Click below to reload the page.' },
  'error_boundary_reload': { ar: 'إعادة تحميل الصفحة', en: 'Reload Page' },

  // Authentication & Errors
  'auth_err_domain': { ar: 'النطاق الحالي غير مصرّح به في مشروع Firebase. يرجى إضافته إلى النطاقات المعتمدة.', en: 'The current domain is not authorized in Firebase. Please add it to Authorized Domains.' },
  'auth_err_popup_blocked': { ar: 'تم حظر نافذة تسجيل الدخول المنبثقة من قبل المتصفح. يرجى السماح بالنوافذ المنبثقة.', en: 'The sign-in popup was blocked by your browser. Please allow popups.' },
  'auth_err_operation_not_allowed': { ar: 'تسجيل الدخول باستخدام Google غير مفعّل في مشروع Firebase.', en: 'Google Sign-In is not enabled in the Firebase project.' },
  'auth_err_popup_closed': { ar: 'تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية. يرجى إعادة المحاولة.', en: 'Sign-in popup was closed before completing. Please try again.' },
  'auth_err_cancelled_popup': { ar: 'تم إلغاء المحاولة لوجود نافذة تسجيل دخول أخرى قيد التشغيل.', en: 'Sign-in cancelled because another request is already in progress.' },
  'auth_err_network': { ar: 'فشل الاتصال بالشبكة أثناء محاولة المصادقة. يرجى التحقق من اتصال الإنترنت.', en: 'Network connection failed during authentication. Please check internet connection.' },
  'auth_err_generic': { ar: 'فشل تسجيل الدخول. يرجى المحاولة لاحقاً.', en: 'Sign-in failed. Please try again later.' },

  // Habits Quiz Extended
  'quiz_anonymous_respondent': { ar: 'طالب / زائر مجهول', en: 'Anonymous Student / Visitor' },
  'quiz_save_error': { ar: 'تم احتساب النتيجة، ولكن تعذر حفظ السجل في قاعدة البيانات.', en: 'Score calculated, but failed to save record in database.' },
  'quiz_count_questions': { ar: 'أسئلة تفاعلية', en: 'Interactive Questions' },
  'quiz_start_now': { ar: 'بدء الاختبار التفاعلي الآن', en: 'Start Assessment Now' },
  'quiz_back_to_list': { ar: 'العودة لقائمة الاختبارات', en: 'Back to Assessments List' },
  'quiz_progress': { ar: 'نسبة الإنجاز:', en: 'Progress:' },
  'quiz_name_label': { ar: 'اسم الطالب / المشارك (اختياري - لحفظ النتيجة في السجل):', en: 'Participant / Student Name (Optional - to save record):' },
  'quiz_name_placeholder': { ar: 'أدخل اسمك أو اتركه فارغاً', en: 'Enter your name or leave blank' },
  'quiz_type_tf': { ar: 'سؤال: صح أو خطأ', en: 'Question: True or False' },
  'quiz_type_mcq': { ar: 'سؤال: اختيار من متعدد', en: 'Question: Multiple Choice' },
  'quiz_next_q': { ar: 'السؤال التالي', en: 'Next Question' },
  'quiz_prev_q': { ar: 'السابق', en: 'Previous' },
  'quiz_completed_title': { ar: 'لقد أتممت مقياس التوازن بنجاح!', en: 'You have completed the wellness assessment!' },
  'quiz_recorded_note': { ar: 'تم تسجيل إجاباتك بنجاح في قاعدة بيانات مبادرة "عافية تُزهر".', en: 'Your responses have been recorded in the Blooming Wellness database.' },
  'quiz_index_title': { ar: 'مؤشر التوازن والعافية', en: 'Wellness & Balance Index' },
  'quiz_score_ratio': { ar: 'إجابة متوافقة مع الإرشادات الصحية المعتمدة من أصل', en: 'guideline-compliant answers out of' },
  'quiz_review_title': { ar: 'مراجعة الإجابات والتوصيات الصحية:', en: 'Review Answers & Recommendations:' },
  'quiz_your_answer': { ar: 'إجابتك:', en: 'Your Answer:' },
  'quiz_unanswered': { ar: 'لم تجب', en: 'Unanswered' },
  'quiz_recommended_answer': { ar: 'الإجابة الصحية الموصى بها:', en: 'Recommended Health Answer:' },
  'quiz_choose_another': { ar: 'اختيار استبانة صحية أخرى', en: 'Choose Another Assessment' },

  // Public Section Subtitles & Hints
  'broadcasts_header_subtitle': { ar: 'صوت الصباح: طاقة ووعي يومي', en: 'Morning Voice: Daily Energy & Vitality' },
  'broadcasts_search_hint': { ar: 'جرب تغيير كلمات البحث أو اختيار موضوع آخر.', en: 'Try adjusting your search terms or selecting another topic.' },
  'lectures_header_subtitle': { ar: 'محاضرات ولقاءات إثرائية', en: 'Enriching Lectures & Sessions' },
  'lectures_search_hint': { ar: 'جرب كلمات بحث مختلفة أو حدد موضوعاً آخر.', en: 'Try adjusting search terms or choosing another topic.' },
  'interviews_header_subtitle': { ar: 'حوارات وتجارب ملهمة', en: 'Inspiring Talks & Journeys' },
  'interviews_search_hint': { ar: 'يرجى تعديل مصطلحات البحث.', en: 'Please adjust your search terms.' },
  'sort_by_date': { ar: 'ترتيب حسب التاريخ', en: 'Sort by Date' },
  'sort_newest': { ar: 'الأحدث تاريخاً', en: 'Newest First' },
  'sort_oldest': { ar: 'الأقدم تاريخاً', en: 'Oldest First' },
  'events_header_subtitle': { ar: 'فعاليات عافية: نشاط وازدهار', en: 'Wellness Events: Vitality & Flourishing' },
  'events_search_placeholder': { ar: 'ابحث في الفعاليات أو الموقع...', en: 'Search events or location...' },
  'events_search_hint': { ar: 'يرجى اختيار تبويب آخر أو مسح حقل البحث.', en: 'Please select another tab or clear search filter.' },
  'registrations_search_hint': { ar: 'تابع هذه الصفحة باستمرار لمواكبة البرامج القادمة.', en: 'Check back frequently for upcoming wellness programs.' },
  'registrations_copy_link': { ar: 'نسخ رابط التسجيل', en: 'Copy Link' },
  'registrations_copied': { ar: 'تم النسخ!', en: 'Copied!' },
  'registrations_register_now': { ar: 'التسجيل في النشاط', en: 'Register Now' },
  'registrations_ended': { ar: 'انتهت فترة التسجيل', en: 'Registration Closed' },

  // Admin Dashboard Extended
  'admin_overview_desc': { ar: 'يمكنك تعديل اسم المبادرة، النبذة التعريفية، الرؤية، الرسالة، الأهداف والشعارات المشاركة لتظهر فوراً على الواجهة.', en: 'You can update the initiative name, about text, vision, mission, strategic goals, and partner logos to reflect immediately.' },
  'admin_seed_tooltip': { ar: 'تهيئة بيانات تجريبية حقيقية للمبادرة إذا كانت فارغة', en: 'Initialize approved starter content for the initiative if empty' },
  'admin_inquiry_status_updated': { ar: 'تم تحديث حالة الرسالة.', en: 'Inquiry status updated successfully.' },
  'admin_inquiry_status_failed': { ar: 'تعذر تحديث الحالة.', en: 'Failed to update status.' },
  'admin_th_actions': { ar: 'الإجراءات', en: 'Actions' },
  'admin_th_details': { ar: 'التفاصيل', en: 'Details' },
  'admin_th_title': { ar: 'العنوان', en: 'Title' },
  'admin_th_status': { ar: 'الحالة', en: 'Status' },
  'admin_th_date': { ar: 'التاريخ', en: 'Date' },
  'admin_th_topic': { ar: 'الموضوع', en: 'Topic' },
  'admin_th_speaker': { ar: 'المحاضر', en: 'Speaker' },
  'admin_th_guest': { ar: 'الضيف', en: 'Guest' },
  'admin_th_email': { ar: 'البريد الإلكتروني', en: 'Email' },
  'admin_th_name': { ar: 'الاسم', en: 'Name' },
  'admin_th_role': { ar: 'الرتبة', en: 'Role' },
  'admin_th_permissions': { ar: 'الصلاحيات', en: 'Permissions' },
  'admin_th_message': { ar: 'نص الرسالة', en: 'Message' },
  'admin_th_phone': { ar: 'الهاتف', en: 'Phone' },

  // SEO Dynamic Titles & Meta Descriptions
  'seo_home_title': { ar: 'عافية تُزهر | مبادرة التوعية بالصحة والعادات الصحية', en: 'Blooming Wellness | Health Awareness Initiative' },
  'seo_home_desc': { ar: 'مبادرة عافية تُزهر لتعزيز الوعي الصحي ونشر العادات الصحية السليمة من خلال التغذية المتوازنة والنشاط البدني والنوم الصحي والصحة النفسية والبرامج التوعوية والفعاليات المجتمعية.', en: 'Blooming Wellness is a health awareness initiative promoting healthy habits through balanced nutrition, physical activity, healthy sleep, mental well-being, educational programs, and community events.' },
  'seo_broadcasts_title': { ar: 'الإذاعات الصباحية المدرسية | مبادرة عافية تُزهر', en: 'Morning School Broadcasts | Blooming Wellness' },
  'seo_broadcasts_desc': { ar: 'استمع وشاهد حلقات الإذاعة الصباحية المدرسية لمبادرة عافية تُزهر حول التغذية السليمة، والنشاط الحركي، والنوم الصحي، والعادات اليومية الإيجابية.', en: 'Listen to and watch Blooming Wellness morning school broadcasts covering balanced nutrition, active movement, restorative sleep, and positive daily habits.' },
  'seo_lectures_title': { ar: 'المحاضرات والندوات التوعوية | مبادرة عافية تُزهر', en: 'Awareness Lectures & Webinars | Blooming Wellness' },
  'seo_lectures_desc': { ar: 'محاضرات طبية وتثقيفية متخصصة يلقيها نخبة من الأطباء واستشاريي الرعاية الصحية لتعزيز نمط الحياة الصحي والوقاية من الأمراض.', en: 'Specialized medical and educational lectures presented by leading physicians and health consultants to promote healthy lifestyles and disease prevention.' },
  'seo_interviews_title': { ar: 'المقابلات والحوارات الملهمة | مبادرة عافية تُزهر', en: 'Inspiring Dialogue Interviews | Blooming Wellness' },
  'seo_interviews_desc': { ar: 'لقاءات وحوارات حصرية مع خبراء الصحة والرياضة وأصحاب التجارب الملهمة في تحسين نمط الحياة والعافية البدنية والنفسية.', en: 'Exclusive interviews with health and fitness experts sharing inspiring transformations and sustainable lifestyle practices.' },
  'seo_quizzes_title': { ar: 'مقياس عادات الحياة واختبار العافية | مبادرة عافية تُزهر', en: 'Lifestyle Habits Quiz & Wellness Assessment | Blooming Wellness' },
  'seo_quizzes_desc': { ar: 'اختبر نمط حياتك اليومي عبر مقياس عافية التفاعلي لتقييم عادات التغذية وشرب الماء وساعات النوم والنشاط البدني واحصل على نتيجتك فوراً.', en: 'Assess your daily routine with the interactive Blooming Wellness quiz evaluating nutrition, hydration, sleep duration, and physical exercise.' },
  'seo_events_title': { ar: 'الأنشطة والفعاليات المجتمعية | مبادرة عافية تُزهر', en: 'Community Activities & Health Events | Blooming Wellness' },
  'seo_events_desc': { ar: 'جدول الفعاليات والأنشطة الصحية وماراثونات المشي والورش التفاعلية المقامة بإشراف وزارة التعليم وتنظيم ثانوية الشاطئ.', en: 'Schedule of upcoming health events, walking marathons, and wellness workshops organized by Al-Shatee High School under the Ministry of Education.' },
  'seo_registrations_title': { ar: 'التسجيل في البرامج والفرص الصحية | مبادرة عافية تُزهر', en: 'Health Program Registrations | Blooming Wellness' },
  'seo_registrations_desc': { ar: 'روابط التسجيل في المبادرات والبرامج التدريبية المعتمدة والفحوصات الطبية وفرص التطوع الصحي الخاصة بمبادرة عافية تُزهر.', en: 'Registration links for certified wellness workshops, medical checkups, and volunteer health opportunities with Blooming Wellness.' },
  'seo_contact_title': { ar: 'تواصل معنا واستفسارات الزوار | مبادرة عافية تُزهر', en: 'Contact Us & Inquiries | Blooming Wellness' },
  'seo_contact_desc': { ar: 'تواصل مع فريق مبادرة عافية تُزهر لطرح استفساراتكم ومقترحاتكم حول برامج التوعية الصحية والأنشطة المدرسية والمجتمعية.', en: 'Get in touch with the Blooming Wellness initiative team for inquiries and feedback regarding health awareness programs.' },
  'seo_admin_title': { ar: 'بوابة الإدارة المركزية | مبادرة عافية تُزهر', en: 'Admin Management Portal | Blooming Wellness' },

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
  'footer_designed_by': { ar: 'صمم بعناية في خدماتي البرمجية', en: 'Crafted with care at My Software Services' },

  // Admin Dashboard Extended Localization
  'admin_header_title': { ar: 'لوحة التحكم المركزية - عافية تُزهر', en: 'Central Admin Portal - Blooming Wellness' },
  'admin_sections_nav': { ar: 'أقسام الإدارة', en: 'Management Sections' },
  'admin_user_guide': { ar: 'دليل المستخدم', en: 'User Guide' },
  'admin_open_guide_desc': { ar: 'فتح دليل المستخدم الشامل لمنصة عافية تُزهر', en: 'Open Wellness Blossoms User Guide' },
  'admin_overview_metrics_title': { ar: 'مؤشرات الأداء ومحتويات المبادرة', en: 'Performance Indicators & Initiative Content' },
  'admin_metric_broadcasts': { ar: 'الإذاعات الصباحية المعتمدة', en: 'Approved Morning Broadcasts' },
  'admin_metric_lectures': { ar: 'المحاضرات التثقيفية', en: 'Awareness Lectures' },
  'admin_metric_interviews': { ar: 'المقابلات الحوارية', en: 'Dialogue Interviews' },
  'admin_metric_quizzes': { ar: 'الاستبانات التفاعلية', en: 'Interactive Quizzes' },
  'admin_metric_events': { ar: 'الأنشطة والفعاليات', en: 'Events & Activities' },
  'admin_metric_registrations': { ar: 'برامج التسجيل المفتوحة', en: 'Open Registrations' },
  'admin_metric_inquiries': { ar: 'رسائل واستفسارات الزوار', en: 'Visitor Inquiries' },
  'admin_metric_supervisors': { ar: 'المشرفون المعتمدون', en: 'Authorized Supervisors' },
  'admin_metric_responses': { ar: 'استجابات الزوار للاستبانات', en: 'Visitor Quiz Responses' },
  'admin_pending_inquiries': { ar: 'رسائل جديدة بانتظار المراجعة', en: 'New Inquiries Pending Review' },
  'admin_btn_add_broadcast': { ar: 'إضافة إذاعة جديدة', en: 'Add New Broadcast' },
  'admin_btn_add_lecture': { ar: 'إضافة محاضرة جديدة', en: 'Add New Lecture' },
  'admin_btn_add_interview': { ar: 'إضافة مقابلة جديدة', en: 'Add New Interview' },
  'admin_btn_add_quiz': { ar: 'إنشاء استبانة جديدة', en: 'Create New Quiz' },
  'admin_btn_add_event': { ar: 'إضافة فعالية جديدة', en: 'Add New Event' },
  'admin_btn_add_reg': { ar: 'إضافة رابط تسجيل جديد', en: 'Add New Registration' },
  'admin_btn_add_sup': { ar: 'إضافة مشرف جديد', en: 'Add New Supervisor' },
  'admin_btn_save': { ar: 'حفظ', en: 'Save' },
  'admin_btn_cancel': { ar: 'إلغاء', en: 'Cancel' },
  'admin_btn_delete': { ar: 'حذف', en: 'Delete' },
  'admin_btn_edit': { ar: 'تعديل', en: 'Edit' },
  'admin_btn_close': { ar: 'إغلاق', en: 'Close' },
  'admin_btn_confirm': { ar: 'تأكيد', en: 'Confirm' },
  'admin_btn_preview': { ar: 'معاينة', en: 'Preview' },
  'admin_btn_restore_logos': { ar: 'استعادة الشعارين الرسميين', en: 'Restore Official Logos' },
  'admin_btn_restore_logo': { ar: 'استعادة الشعار الرسمي المعتمد', en: 'Restore Official Initiative Logo' },
  'admin_btn_restore_moe': { ar: 'استعادة شعار الوزارة الرسمي', en: 'Restore Official Ministry Logo' },
  'admin_btn_seed_content': { ar: 'تهيئة بيانات المبادرة', en: 'Seed Initial Content' },
  'admin_partner_entities_title': { ar: 'الجهات المشاركة والداعمة للمبادرة (معتمدتان حصراً)', en: 'Supporting Entities (Exclusively 2 Authorized)' },
  'admin_partner_entities_desc': { ar: 'وفق التوجيه الرسمي، يقتصر هذا القسم على وزارة التعليم ومدرسة ثانوية الشاطئ فقط.', en: 'Per official directive, strictly comprises the Ministry of Education and Al-Shatee High School.' },
  'admin_partner_first': { ar: 'الجهة الأولى (شاشة التحميل والترويسة)', en: 'First Entity (Loading Screen & Header)' },
  'admin_partner_second': { ar: 'الجهة الثانية', en: 'Second Entity' },
  'admin_partner_name': { ar: 'اسم الجهة', en: 'Entity Name' },
  'admin_partner_logo_path': { ar: 'مسار أو رابط الشعار', en: 'Logo URL or Path' },
  'admin_logo_preview': { ar: 'معاينة الشعار', en: 'Logo Preview' },
  'admin_goals_label': { ar: 'أهداف المبادرة (كل هدف في سطر)', en: 'Initiative Goals (One per line)' },
  'admin_contact_info_title': { ar: 'بيانات التواصل الرسمية', en: 'Official Contact Information' },
  'admin_confirm_delete_title': { ar: 'تأكيد الحذف', en: 'Confirm Deletion' },
  'admin_confirm_delete_broadcast': { ar: 'هل أنت متأكد من رغبتك في حذف هذه الإذاعة الصباحية؟', en: 'Are you sure you want to delete this morning broadcast?' },
  'admin_confirm_delete_lecture': { ar: 'هل أنت متأكد من حذف هذه المحاضرة التوعوية؟', en: 'Are you sure you want to delete this awareness lecture?' },
  'admin_confirm_delete_interview': { ar: 'هل تريد حذف هذه المقابلة الحوارية؟', en: 'Are you sure you want to delete this dialogue interview?' },
  'admin_confirm_delete_quiz': { ar: 'هل أنت متأكد من حذف هذه الاستبانة؟', en: 'Are you sure you want to delete this quiz?' },
  'admin_confirm_delete_event': { ar: 'هل تريد حذف هذه الفعالية من المنصة؟', en: 'Are you sure you want to delete this event from the platform?' },
  'admin_confirm_delete_reg': { ar: 'هل تريد حذف رابط التسجيل هذا؟', en: 'Are you sure you want to delete this registration link?' },
  'admin_confirm_delete_sup': { ar: 'هل أنت متأكد من سحب صلاحيات هذا المشرف؟', en: 'Are you sure you want to revoke this supervisor’s permissions?' },
  'admin_confirm_seed_title': { ar: 'تهيئة البيانات الأولية', en: 'Initialize Sample Initiative Content' },
  'admin_confirm_seed_msg': { ar: 'هل تريد تهيئة المحتويات النموذجية المعتمدة للمبادرة في قاعدة البيانات إذا كانت فارغة؟', en: 'Do you want to initialize approved sample contents in the database if empty?' },
  'admin_notify_seed_success': { ar: 'تمت تهيئة محتويات المبادرة بنجاح!', en: 'Initiative contents initialized successfully!' },
  'admin_notify_seed_exists': { ar: 'البيانات موجودة بالفعل مسبقاً.', en: 'Data already exists in database.' },
  'admin_notify_seed_error': { ar: 'تعذر استكمال التهيئة.', en: 'Failed to complete initialization.' },
  'admin_notify_perm_settings': { ar: 'ليس لديك صلاحية لتعديل إعدادات الموقع.', en: 'You do not have permission to modify site settings.' },
  'admin_notify_save_settings_success': { ar: 'تم حفظ إعدادات المبادرة وبيانات الصفحة الرئيسية بنجاح!', en: 'Initiative settings and homepage content saved successfully!' },
  'admin_notify_save_settings_error': { ar: 'حدث خطأ أثناء حفظ الإعدادات.', en: 'An error occurred while saving settings.' },
  'admin_notify_perm_broadcasts': { ar: 'ليس لديك صلاحية لإدارة الإذاعات الصباحية.', en: 'You do not have permission to manage morning broadcasts.' },
  'admin_notify_broadcast_updated': { ar: 'تم تعديل الإذاعة الصباحية بنجاح!', en: 'Morning broadcast updated successfully!' },
  'admin_notify_broadcast_added': { ar: 'تم إضافة الإذاعة الصباحية بنجاح!', en: 'Morning broadcast added successfully!' },
  'admin_notify_broadcast_deleted': { ar: 'تم حذف الإذاعة بنجاح.', en: 'Morning broadcast deleted successfully.' },
  'admin_notify_perm_lectures': { ar: 'ليس لديك صلاحية لإدارة المحاضرات.', en: 'You do not have permission to manage lectures.' },
  'admin_notify_lecture_updated': { ar: 'تم تحديث المحاضرة بنجاح!', en: 'Lecture updated successfully!' },
  'admin_notify_lecture_added': { ar: 'تم إضافة المحاضرة التوعوية بنجاح!', en: 'Awareness lecture added successfully!' },
  'admin_notify_lecture_deleted': { ar: 'تم حذف المحاضرة.', en: 'Lecture deleted successfully.' },
  'admin_notify_perm_interviews': { ar: 'ليس لديك صلاحية لإدارة المقابلات.', en: 'You do not have permission to manage interviews.' },
  'admin_notify_interview_updated': { ar: 'تم تحديث المقابلة بنجاح!', en: 'Interview updated successfully!' },
  'admin_notify_interview_added': { ar: 'تم إضافة المقابلة بنجاح!', en: 'Interview added successfully!' },
  'admin_notify_interview_deleted': { ar: 'تم حذف المقابلة.', en: 'Interview deleted successfully.' },
  'admin_notify_perm_quizzes': { ar: 'ليس لديك صلاحية لإدارة الاستبانات.', en: 'You do not have permission to manage quizzes.' },
  'admin_notify_quiz_added': { ar: 'تم إنشاء الاستبانة ونشرها بنجاح!', en: 'Quiz created and published successfully!' },
  'admin_notify_quiz_deleted': { ar: 'تم حذف الاستبانة بنجاح.', en: 'Quiz deleted successfully.' },
  'admin_notify_perm_events': { ar: 'ليس لديك صلاحية لإدارة الفعاليات.', en: 'You do not have permission to manage events.' },
  'admin_notify_event_updated': { ar: 'تم تحديث الفعالية بنجاح!', en: 'Event updated successfully!' },
  'admin_notify_event_added': { ar: 'تم إضافة الفعالية بنجاح!', en: 'Event added successfully!' },
  'admin_notify_event_deleted': { ar: 'تم حذف الفعالية بنجاح.', en: 'Event deleted successfully.' },
  'admin_notify_perm_regs': { ar: 'ليس لديك صلاحية لإدارة روابط التسجيل.', en: 'You do not have permission to manage registrations.' },
  'admin_notify_reg_updated': { ar: 'تم تحديث رابط التسجيل بنجاح!', en: 'Registration link updated successfully!' },
  'admin_notify_reg_added': { ar: 'تم إضافة رابط التسجيل بنجاح!', en: 'Registration link added successfully!' },
  'admin_notify_reg_deleted': { ar: 'تم حذف رابط التسجيل بنجاح.', en: 'Registration link deleted successfully.' },
  'admin_notify_inquiry_updated': { ar: 'تم تحديث حالة الاستفسار بنجاح.', en: 'Inquiry status updated successfully.' },
  'admin_notify_generic_error': { ar: 'فشلت العملية، يرجى التحقق من الصلاحيات والمدخلات.', en: 'Operation failed. Please verify permissions and input fields.' },
  'admin_quiz_responses_title': { ar: 'النتائج الإحصائية لإجابات الزوار المحفوظة (سري للمشرفين)', en: 'Statistical Visitor Survey Responses (Confidential)' },
  'admin_quiz_responses_total': { ar: 'إجمالي الاستجابات المسجلة:', en: 'Total Recorded Responses:' },
  'admin_quiz_responses_empty': { ar: 'لم تُسجل إجابات زوار حتى الآن.', en: 'No visitor responses recorded yet.' },
  'admin_th_quiz': { ar: 'الاستبانة', en: 'Quiz' },
  'admin_th_respondent': { ar: 'اسم الزائر', en: 'Visitor Name' },
  'admin_th_score': { ar: 'النتيجة', en: 'Score' },
  'admin_th_percentage': { ar: 'النسبة', en: 'Percentage' },
  'admin_th_submitted_at': { ar: 'تاريخ الإرسال', en: 'Submitted At' },
  'admin_inquiries_title': { ar: 'رسائل واستفسارات الزوار', en: 'Visitor Messages & Inquiries' },
  'admin_inquiries_desc': { ar: 'متابعة رسائل واستفسارات الطلاب وأولياء الأمور والمجتمع المرسلة عبر نموذج الموقع', en: 'Monitor messages and questions submitted by students, parents, and community members' },
  'admin_inquiries_empty': { ar: 'لا توجد رسائل أو استفسارات حالياً.', en: 'No inquiries recorded at the moment.' },
  'admin_status_new': { ar: 'جديدة', en: 'New' },
  'admin_status_read': { ar: 'تمت القراءة', en: 'Read' },
  'admin_status_replied': { ar: 'تم الرد', en: 'Replied' },
  'admin_mark_as_read': { ar: 'تحديد كمقروء', en: 'Mark as Read' },
  'admin_mark_as_replied': { ar: 'تحديد كتم الرد', en: 'Mark as Replied' },
  'admin_perm_broadcasts': { ar: 'الإذاعات الصباحية', en: 'Morning Broadcasts' },
  'admin_perm_lectures': { ar: 'المحاضرات التوعوية', en: 'Awareness Lectures' },
  'admin_perm_interviews': { ar: 'المقابلات الحوارية', en: 'Dialogue Interviews' },
  'admin_perm_quizzes': { ar: 'الاستبانات والإحصائيات', en: 'Quizzes & Responses' },
  'admin_perm_events': { ar: 'الأنشطة والفعاليات', en: 'Events & Activities' },
  'admin_perm_registrations': { ar: 'روابط التسجيل', en: 'Registrations' },
  'admin_perm_settings': { ar: 'إعدادات الموقع والشعارات', en: 'Site Settings & Logos' },
  'admin_perm_supervisors': { ar: 'المشرفون والصلاحيات', en: 'Supervisors & Permissions' },
  'admin_modal_add_broadcast': { ar: 'إضافة إذاعة صباحية جديدة', en: 'Add New Morning Broadcast' },
  'admin_modal_edit_broadcast': { ar: 'تعديل الإذاعة الصباحية', en: 'Edit Morning Broadcast' },
  'admin_modal_add_lecture': { ar: 'إضافة محاضرة توعوية جديدة', en: 'Add New Awareness Lecture' },
  'admin_modal_edit_lecture': { ar: 'تعديل المحاضرة التوعوية', en: 'Edit Awareness Lecture' },
  'admin_modal_add_interview': { ar: 'إضافة مقابلة حوارية جديدة', en: 'Add New Dialogue Interview' },
  'admin_modal_edit_interview': { ar: 'تعديل المقابلة الحوارية', en: 'Edit Dialogue Interview' },
  'admin_modal_add_quiz': { ar: 'إنشاء مقياس أو استبانة جديدة', en: 'Create New Assessment / Quiz' },
  'admin_modal_add_event': { ar: 'إضافة نشاط أو فعالية جديدة', en: 'Add New Activity or Event' },
  'admin_modal_edit_event': { ar: 'تعديل الفعالية أو النشاط', en: 'Edit Activity or Event' },
  'admin_modal_add_reg': { ar: 'إضافة فرصة أو برنامج تسجيل جديد', en: 'Add New Registration Opportunity' },
  'admin_modal_edit_reg': { ar: 'تعديل برنامج التسجيل', en: 'Edit Registration Program' },
  'admin_broadcasts_title': { ar: 'إدارة الإذاعات الصباحية', en: 'Morning Broadcasts Management' },
  'admin_broadcasts_desc': { ar: 'إضافة وتعديل وحذف الحلقات الإذاعية والروابط الصوتية والمرئية', en: 'Add, edit, and delete audio & video morning broadcast episodes' },
  'admin_lectures_title': { ar: 'إدارة المحاضرات التوعوية', en: 'Awareness Lectures Management' },
  'admin_lectures_desc': { ar: 'إضافة المحاضرات وتحديد المتحدث والمدة وروابط الفيديو الخارجية', en: 'Manage lectures, speakers, durations, and external media links' },
  'admin_interviews_title': { ar: 'إدارة المقابلات واللقاءات', en: 'Interviews & Dialogues Management' },
  'admin_interviews_desc': { ar: 'توثيق لقاءات الخبراء وأصحاب التجارب مع روابط الفيديو', en: 'Document expert interviews and success stories with video embeds' },
  'admin_quizzes_title': { ar: 'إدارة استبانات واختبارات العادات', en: 'Health Habits Quizzes & Surveys' },
  'admin_quizzes_desc': { ar: 'إنشاء استبانات تفاعلية، تحديد الأسئلة والإجابة الصحية الصحيحة', en: 'Create interactive surveys, configure question sets and verified answers' },
  'admin_events_title': { ar: 'إدارة الأنشطة والفعاليات', en: 'Initiative Events & Activities' },
  'admin_events_desc': { ar: 'إضافة الفعاليات وتحديد حالتها (قادمة أو جارية أو سابقة) وتمييز الفعالية الأبرز', en: 'Manage events, upcoming/ongoing status, and featured spotlight' },
  'admin_registrations_title': { ar: 'إدارة روابط التسجيل في الأنشطة', en: 'Activity Registration Links' },
  'admin_registrations_desc': { ar: 'إضافة نماذج وروابط التسجيل وتحديد موعد الإغلاق والحالة', en: 'Manage registration forms, deadlines, and application status' },
  'admin_supervisors_title': { ar: 'إدارة المشرفين والصلاحيات', en: 'Supervisors & Permissions Management' },
  'admin_supervisors_desc': { ar: 'خاص بالمدير الرئيسي: إنشاء حسابات المشرفين وتحديد الصلاحيات الممنوحة لكل قسم', en: 'Super Admin only: Register staff members and configure access levels' },
  'admin_status_upcoming': { ar: 'قادمة', en: 'Upcoming' },
  'admin_status_ongoing': { ar: 'جارية', en: 'Ongoing' },
  'admin_status_completed': { ar: 'منتهية', en: 'Completed' },
  'admin_status_featured': { ar: 'بارزة', en: 'Featured' },
  'admin_status_open': { ar: 'مفتوح للتسجيل', en: 'Open for Registration' },
  'admin_status_closed': { ar: 'مغلق', en: 'Closed' },
  'admin_speaker_prefix': { ar: 'المحاضر', en: 'Speaker' },
  'admin_guest_prefix': { ar: 'الضيف', en: 'Guest' },
  'admin_deadline_prefix': { ar: 'آخر موعد', en: 'Deadline' },
  'admin_anonymous': { ar: 'مجهول', en: 'Anonymous' },
  'admin_questions_count': { ar: 'أسئلة', en: 'questions' },
  'admin_responses_suffix': { ar: 'استجابة', en: 'responses' },
  'admin_field_title': { ar: 'العنوان', en: 'Title' },
  'admin_field_topic': { ar: 'الموضوع / التصنيف', en: 'Topic / Category' },
  'admin_field_date': { ar: 'التاريخ', en: 'Date' },
  'admin_field_time': { ar: 'الوقت', en: 'Time' },
  'admin_field_duration': { ar: 'المدة التقديرية', en: 'Estimated Duration' },
  'admin_field_speaker': { ar: 'اسم المحاضر / المتحدث', en: 'Speaker Name' },
  'admin_field_guest_name': { ar: 'اسم الضيف', en: 'Guest Name' },
  'admin_field_guest_title': { ar: 'صفة أو منصب الضيف', en: 'Guest Title / Affiliation' },
  'admin_field_desc': { ar: 'الوصف', en: 'Description' },
  'admin_field_image_url': { ar: 'رابط الصورة الخارجية (Direct URL)', en: 'Image Direct URL' },
  'admin_field_audio_url': { ar: 'رابط الملف الصوتي (MP3)', en: 'Audio File URL (MP3)' },
  'admin_field_video_url': { ar: 'رابط الفيديو (YouTube)', en: 'Video URL (YouTube)' },
  'admin_field_reg_url': { ar: 'رابط التسجيل الخارجي (Google Form / نموذج التسجيل)', en: 'Registration Form URL (Google Form)' },
  'admin_field_reg_status': { ar: 'حالة التسجيل', en: 'Registration Status' },
  'admin_field_location': { ar: 'الموقع أو المقر', en: 'Location / Venue' },
  'admin_field_event_status': { ar: 'حالة الفعالية', en: 'Event Status' },
  'admin_field_featured_checkbox': { ar: 'تمييز كفعالية بارزة في الرئيسية', en: 'Feature prominently on homepage' },
  'admin_field_reg_requirements': { ar: 'وصف شروط ومتطلبات التسجيل', en: 'Requirements & Registration Terms' },
  'admin_field_email': { ar: 'البريد الإلكتروني المعتمد (Google)', en: 'Authorized Google Email' },
  'admin_field_name': { ar: 'الاسم', en: 'Full Name' },
  'admin_field_role': { ar: 'الرتبة', en: 'Role' },
  'admin_quiz_builder_title': { ar: 'إنشاء استبانة / اختبار عادات جديد', en: 'Create New Survey / Habit Assessment' },
  'admin_quiz_field_title': { ar: 'عنوان الاستبانة', en: 'Quiz Title' },
  'admin_quiz_field_category': { ar: 'التصنيف', en: 'Category' },
  'admin_quiz_field_desc': { ar: 'وصف الاستبانة للزائر', en: 'Quiz Description for Visitors' },
  'admin_quiz_questions_title': { ar: 'أسئلة الاستبانة', en: 'Quiz Questions' },
  'admin_quiz_btn_add_q': { ar: 'إضافة سؤال', en: 'Add Question' },
  'admin_quiz_question_num': { ar: 'السؤال', en: 'Question' },
  'admin_quiz_q_type': { ar: 'نوع السؤال', en: 'Question Type' },
  'admin_quiz_type_mcq': { ar: 'اختيار من متعدد', en: 'Multiple Choice' },
  'admin_quiz_type_tf': { ar: 'صح أو خطأ', en: 'True / False' },
  'admin_quiz_tf_true': { ar: 'صح', en: 'True' },
  'admin_quiz_tf_false': { ar: 'خطأ', en: 'False' },
  'admin_quiz_correct_answer': { ar: 'الإجابة الصحية الصحيحة', en: 'Correct Health Answer' },
  'admin_quiz_option_num': { ar: 'الخيار', en: 'Option' },
  'admin_quiz_available_options': { ar: 'الخيارات المتاحة للزائر:', en: 'Available Options for Visitors:' },
  'admin_quiz_explanation': { ar: 'تفسير أو معلومة صحية تظهر للزائر بعد الإجابة (اختياري)...', en: 'Health explanation shown to visitor after answer (optional)...' },
  'admin_quiz_btn_save': { ar: 'حفظ الاستبانة والأسئلة', en: 'Save Quiz & Questions' },
  'admin_sup_modal_add_title': { ar: 'تسجيل مشرف وتحديد صلاحياته', en: 'Register Supervisor & Set Privileges' },
  'admin_sup_modal_edit_title': { ar: 'تعديل بيانات المشرف والصلاحيات', en: 'Edit Supervisor Details & Privileges' },
  'admin_sup_modal_edit_desc': { ar: 'تحديث الاسم والرتبة وصلاحيات الوصول للأقسام', en: 'Update name, administrative rank, and module permissions' },
  'admin_sup_field_email_help': { ar: 'البريد الإلكتروني مرتبط بحساب Google المعتمد للمشرف.', en: 'Email is permanently linked to the supervisor’s authorized Google account.' },
  'admin_sup_granted_perms': { ar: 'الأقسام المصرّح للمشرف إدارتها:', en: 'Authorized Sections for this Supervisor:' },
  'admin_inquiry_phone_label': { ar: 'الهاتف:', en: 'Phone:' },
  'admin_inquiry_email_label': { ar: 'البريد:', en: 'Email:' },
  'admin_inquiry_mark_replied': { ar: 'تحديد كـ "تم الرد"', en: 'Mark as "Replied"' },
  'admin_inquiry_mark_new': { ar: 'تحديد كـ "رسالة جديدة"', en: 'Mark as "New"' }
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
