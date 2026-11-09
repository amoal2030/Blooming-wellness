import React, { useState } from 'react';
import { Quiz, QuizQuestion } from '../../types';
import { submitQuizResponse } from '../../services/dataService';
import { getAssetUrl } from '../../utils/assets';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import { 
  CheckSquare, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Info,
  ListOrdered
} from 'lucide-react';

interface HabitsQuizViewProps {
  quizzes: Quiz[];
}

export const HabitsQuizView: React.FC<HabitsQuizViewProps> = ({ quizzes }) => {
  const { t, isRtl } = useLanguage();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [respondentName, setRespondentName] = useState('');
  const [quizFinished, setQuizFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIdx(0);
    setUserAnswers(new Array(quiz.questions.length).fill(-1));
    setQuizFinished(false);
    setSubmissionError(null);
  };

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...userAnswers];
    updated[currentQuestionIdx] = optionIndex;
    setUserAnswers(updated);
  };

  const handleNext = () => {
    if (!selectedQuiz) return;
    if (currentQuestionIdx < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const finishQuiz = async () => {
    if (!selectedQuiz) return;
    setQuizFinished(true);

    // Calculate score
    let score = 0;
    selectedQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        score += 1;
      }
    });

    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);

    // Trigger celebration if percentage >= 70
    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          colors: ['#2e9e66', '#389eb3', '#ea8c38', '#134e5e'],
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }

    // Save results permanently to Firebase Firestore
    try {
      setIsSubmitting(true);
      await submitQuizResponse({
        quizId: selectedQuiz.id,
        quizTitle: selectedQuiz.title,
        respondentName: respondentName.trim() || t('quiz_anonymous_respondent', 'طالب / زائر مجهول'),
        score,
        totalQuestions: selectedQuiz.questions.length,
        percentage,
        answers: userAnswers,
      });
    } catch (err) {
      console.error('Error saving quiz response to Firebase:', err);
      setSubmissionError(t('quiz_save_error', 'تم احتساب النتيجة، ولكن تعذر حفظ السجل في قاعدة البيانات.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    if (!selectedQuiz) return;
    setCurrentQuestionIdx(0);
    setUserAnswers(new Array(selectedQuiz.questions.length).fill(-1));
    setQuizFinished(false);
    setSubmissionError(null);
  };

  // If no quiz selected, show list of available quizzes
  if (!selectedQuiz) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0e3c48] via-[#134e5e] to-[#0e3c48] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
          <div className={`relative z-10 max-w-2xl space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 rounded-full text-xs font-bold text-[#84d2ea] border border-white/20">
              <CheckSquare className="w-3.5 h-3.5 text-[#2e9e66]" />
              <span>{t('quiz_badge', 'مقياس التوازن والعادات الصحية')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              {t('quiz_main_title', 'اختبر مدى صحة عاداتك اليومية')}
            </h1>
            <p className="text-[#d1e6ec] text-xs sm:text-sm leading-relaxed">
              {t('quiz_main_desc', 'اختر أحد المقاييس التفاعلية لتقييم سلوكك اليومي في التغذية والنشاط البدني وساعات النوم، واحصل على تقرير فوري بنتيجتك وإرشادات صحية موجهة.')}
            </p>
          </div>
        </div>

        {/* Quizzes List */}
        {quizzes.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#122127] rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] p-8">
            <CheckSquare className="w-12 h-12 text-[#b0ced8] dark:text-stone-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0e3c48] dark:text-white">{t('quiz_no_quizzes', 'لا توجد استبانات مفعلة حالياً.')}</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white dark:bg-[#122127] rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="h-44 relative bg-[#f1f7f9] dark:bg-[#0b1519] overflow-hidden">
                  <img
                    src={getAssetUrl(quiz.imageUrl || '/assets/images/healthy_habits_quiz_1793901821855.jpg')}
                    alt={quiz.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} bg-[#0e3c48]/85 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-lg`}>
                    {quiz.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className={`space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-2 text-xs text-[#526f78] dark:text-stone-400 font-medium">
                      <ListOrdered className="w-3.5 h-3.5 text-[#2e9e66]" />
                      <span>{quiz.questions?.length || 0} {t('quiz_count_questions', 'أسئلة تفاعلية')}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0e3c48] dark:text-white group-hover:text-[#2e9e66] transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-[#526f78] dark:text-stone-300 leading-relaxed line-clamp-3">
                      {quiz.description}
                    </p>
                  </div>

                  <button
                    onClick={() => startQuiz(quiz)}
                    className="w-full py-3 bg-[#2e9e66] hover:bg-[#248354] text-white font-bold text-xs rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckSquare className="w-4 h-4 text-white" />
                    <span>{t('quiz_start_now', 'بدء الاختبار التفاعلي الآن')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Active Quiz View or Finished Result
  const currentQ: QuizQuestion | undefined = selectedQuiz.questions[currentQuestionIdx];
  const answeredCount = userAnswers.filter((a) => a !== -1).length;
  const progressPercent = Math.round((answeredCount / selectedQuiz.questions.length) * 100);

  // Score calculation
  let finalScore = 0;
  if (quizFinished) {
    selectedQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        finalScore += 1;
      }
    });
  }
  const finalPercentage = Math.round((finalScore / selectedQuiz.questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedQuiz(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#134e5e] dark:text-[#84d2ea] hover:text-[#0e3c48] dark:hover:text-white transition-colors cursor-pointer"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t('quiz_back_to_list', 'العودة لقائمة الاختبارات')}</span>
        </button>

        <span className="text-xs font-bold text-[#134e5e] dark:text-[#84d2ea] bg-[#eaf6fa] dark:bg-[#0e2730] px-3.5 py-1.5 rounded-full border border-[#cde6ee] dark:border-[#1e3842]">
          {selectedQuiz.category}
        </span>
      </div>

      {!quizFinished ? (
        /* Questionnaire in progress */
        <div className="bg-white dark:bg-[#122127] rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] shadow-md p-6 sm:p-10 space-y-8 transition-colors">
          
          {/* Progress Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#526f78] dark:text-stone-400 font-bold">
              <span>{t('quiz_question_num', 'السؤال')} {currentQuestionIdx + 1} {t('quiz_out_of', 'من')} {selectedQuiz.questions.length}</span>
              <span>{t('quiz_progress', 'نسبة الإنجاز:')} {progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#f1f7f9] dark:bg-[#0b1519] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#2e9e66] transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / selectedQuiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Respondent Name (Optional) */}
          {currentQuestionIdx === 0 && (
            <div className={`p-4 bg-[#f7fbfc] dark:bg-[#0b1519] rounded-2xl border border-[#dbe8ed] dark:border-[#1e3842] ${isRtl ? 'text-right' : 'text-left'}`}>
              <label className="block text-xs font-bold text-[#0c2b33] dark:text-white mb-1">
                {t('quiz_name_label', 'اسم الطالب / المشارك (اختياري - لحفظ النتيجة في السجل):')}
              </label>
              <input
                type="text"
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
                placeholder={t('quiz_name_placeholder', 'أدخل اسمك أو اتركه فارغاً')}
                className="w-full px-3.5 py-2 bg-white dark:bg-[#122127] border border-[#d0e0e6] dark:border-[#1e3842] rounded-xl text-xs text-[#0c2b33] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2e9e66]"
              />
            </div>
          )}

          {/* Question Text */}
          {currentQ && (
            <div className="space-y-6">
              <div className={`space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
                <span className="text-[11px] font-extrabold text-[#2e9e66] uppercase tracking-wider">
                  {currentQ.type === 'true_false' 
                    ? t('quiz_type_tf', 'سؤال: صح أو خطأ') 
                    : t('quiz_type_mcq', 'سؤال: اختيار من متعدد')}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0e3c48] dark:text-white leading-snug">
                  {currentQ.questionText}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full ${isRtl ? 'text-right' : 'text-left'} p-4 sm:p-5 rounded-2xl border text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#2e9e66] bg-[#e8f7ee] dark:bg-[#0e2c22] text-[#134e5e] dark:text-[#42df98] shadow-xs ring-2 ring-[#2e9e66]/20'
                          : 'border-[#dbe8ed] dark:border-[#1e3842] bg-[#f7fbfc] dark:bg-[#0b1519] hover:bg-[#eaf6fa] dark:hover:bg-[#162a32] text-[#0c2b33] dark:text-white'
                      }`}
                    >
                      <span>{opt}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isRtl ? 'mr-3' : 'ml-3'} ${
                        isSelected ? 'border-[#2e9e66] bg-[#2e9e66] text-white' : 'border-[#b8d5de] dark:border-[#1e3842] bg-white dark:bg-[#0b1519]'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-6 border-t border-[#edf3f5] dark:border-[#1e3842] flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIdx === 0}
              className="px-5 py-2.5 rounded-xl border border-[#dbe8ed] dark:border-[#1e3842] text-xs font-bold text-[#526f78] dark:text-stone-300 hover:bg-[#f7fbfc] dark:hover:bg-[#162a32] transition-colors disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
            >
              {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{t('quiz_prev_q', 'السابق')}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={userAnswers[currentQuestionIdx] === -1}
              className="px-6 py-2.5 rounded-2xl bg-[#2e9e66] hover:bg-[#248354] text-xs font-bold text-white shadow-xs transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
            >
              <span>{currentQuestionIdx === selectedQuiz.questions.length - 1 ? t('quiz_submit_btn', 'إنهاء الاختبار وعرض النتيجة') : t('quiz_next_q', 'السؤال التالي')}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="bg-white dark:bg-[#122127] rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] shadow-xl p-8 sm:p-12 space-y-10 text-center animate-fade-in transition-colors">
          
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-white dark:bg-[#0b1519] p-2 border-2 border-[#dbe8ed] dark:border-[#1e3842] shadow-md flex items-center justify-center overflow-hidden">
              <img
                src={getAssetUrl('/assets/aistudio/50c0c8c4-5c4f-4db5-8ada-405779c14cc1_db926d78.png')}
                alt={t('initiative_logo_alt', 'شعار عافية تُزهر')}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#0e3c48] dark:text-white">
              {respondentName ? `${isRtl ? 'أحسنت يا' : 'Well done,'} ${respondentName}! ${t('quiz_completed_title', 'لقد أتممت مقياس التوازن')}` : t('quiz_result_congrats', 'لقد أتممت الاختبار بنجاح!')}
            </h2>
            <p className="text-xs sm:text-sm text-[#526f78] dark:text-stone-300">
              {t('quiz_recorded_note', 'تم تسجيل إجاباتك بنجاح في قاعدة بيانات مبادرة "عافية تُزهر".')}
            </p>
          </div>

          {/* Score Card */}
          <div className="max-w-md mx-auto p-7 rounded-3xl bg-gradient-to-br from-[#0e3c48] to-[#134e5e] text-white shadow-lg space-y-3">
            <span className="text-xs uppercase tracking-wider text-[#84d2ea] font-extrabold">
              {t('quiz_index_title', 'مؤشر التوازن والعافية')}
            </span>
            <div className="text-5xl font-black text-white">
              {finalPercentage}%
            </div>
            <p className="text-xs text-[#d1e6ec]">
              {isRtl 
                ? `حققت ${finalScore} من أصل ${selectedQuiz.questions.length} ${t('quiz_score_ratio', 'إجابة متوافقة مع الإرشادات الصحية المعتمدة.')}`
                : `You scored ${finalScore} out of ${selectedQuiz.questions.length} ${t('quiz_score_ratio', 'answers compliant with certified health guidelines.')}`}
            </p>

            <div className="pt-2 text-xs font-bold">
              {finalPercentage >= 80 ? (
                <span className="text-[#2e9e66] bg-white/10 px-3 py-1 rounded-full border border-[#2e9e66]/40 inline-block">
                  {t('quiz_excellent', 'ممتاز! عاداتك الصحية متوازنة جداً ورائعة وتستحق الاقتداء.')}
                </span>
              ) : finalPercentage >= 50 ? (
                <span className="text-[#ea8c38] bg-white/10 px-3 py-1 rounded-full border border-[#ea8c38]/40 inline-block">
                  {t('quiz_good', 'جيد جداً! لديك أساس صحي قوي وتحتاج إلى بعض التحسينات البسيطة.')}
                </span>
              ) : (
                <span className="text-[#84d2ea] bg-white/10 px-3 py-1 rounded-full border border-[#84d2ea]/40 inline-block">
                  {t('quiz_needs_care', 'تحتاج عاداتك إلى مزيد من العناية والتنظيم لتحقيق العافية المثالية.')}
                </span>
              )}
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className={`${isRtl ? 'text-right' : 'text-left'} space-y-4 pt-6 border-t border-[#edf3f5] dark:border-[#1e3842]`}>
            <h3 className="text-base font-bold text-[#0e3c48] dark:text-white">
              {t('quiz_review_title', 'مراجعة الإجابات والتوصيات الصحية:')}
            </h3>

            <div className="space-y-4">
              {selectedQuiz.questions.map((q, qIdx) => {
                const userChoice = userAnswers[qIdx];
                const isCorrect = userChoice === q.correctAnswerIndex;
                return (
                  <div
                    key={qIdx}
                    className={`p-5 rounded-2xl border text-xs space-y-2 ${
                      isCorrect 
                        ? 'bg-[#e8f7ee]/60 dark:bg-[#0e2c22]/50 border-[#c4e9d2] dark:border-[#154636]' 
                        : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
                    }`}
                  >
                    <div className="flex items-start gap-2 font-bold text-[#0c2b33] dark:text-white">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-[#2e9e66] shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <span>{q.questionText}</span>
                    </div>

                    <div className={`${isRtl ? 'mr-6' : 'ml-6'} space-y-1 text-[#526f78] dark:text-stone-300`}>
                      <p>
                        {t('quiz_your_answer', 'إجابتك:')} <span className="font-semibold text-[#0c2b33] dark:text-white">{q.options[userChoice] || t('quiz_unanswered', 'لم تجب')}</span>
                      </p>
                      {!isCorrect && (
                        <p className="text-[#134e5e] dark:text-[#84d2ea] font-bold">
                          {t('quiz_recommended_answer', 'الإجابة الصحية الموصى بها:')} {q.options[q.correctAnswerIndex]}
                        </p>
                      )}
                      {q.explanation && (
                        <p className="text-[#526f78] dark:text-stone-300 bg-white/90 dark:bg-[#0b1519] p-2.5 rounded-xl mt-1 border border-[#dbe8ed] dark:border-[#1e3842] flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-[#389eb3] shrink-0 mt-0.5" />
                          <span>{q.explanation}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-[#eaf6fa] dark:bg-[#0e2730] hover:bg-[#dbeef5] dark:hover:bg-[#163845] text-[#134e5e] dark:text-[#84d2ea] font-bold text-xs rounded-2xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('quiz_restart_btn', 'إعادة الاختبار مرة أخرى')}</span>
            </button>

            <button
              onClick={() => setSelectedQuiz(null)}
              className="px-6 py-3 bg-[#2e9e66] hover:bg-[#248354] text-white font-bold text-xs rounded-2xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>{t('quiz_choose_another', 'اختيار استبانة صحية أخرى')}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
