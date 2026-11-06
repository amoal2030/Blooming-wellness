import React, { useState } from 'react';
import { Quiz, QuizQuestion } from '../../types';
import { submitQuizResponse } from '../../services/dataService';
import confetti from 'canvas-confetti';
import { 
  CheckSquare, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Sparkles, 
  Info,
  ListOrdered
} from 'lucide-react';

interface HabitsQuizViewProps {
  quizzes: Quiz[];
}

export const HabitsQuizView: React.FC<HabitsQuizViewProps> = ({ quizzes }) => {
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
          particleCount: 80,
          spread: 70,
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
        respondentName: respondentName.trim() || 'زائر مجهول',
        score,
        totalQuestions: selectedQuiz.questions.length,
        percentage,
        answers: userAnswers,
      });
    } catch (err) {
      console.error('Error saving quiz response to Firebase:', err);
      setSubmissionError('تم احتساب النتيجة، ولكن تعذر حفظ السجل في قاعدة البيانات.');
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
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-stone-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-emerald-300">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>استبانات تقييم العادات الصحية</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">اختبر مدى صحة عاداتك اليومية</h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              اختر أحد الاختبارات التفاعلية أدناه وأجب عن الأسئلة لتقييم سلوكك الصحي والحصول على إرشادات مبسطة لحياة أكثر عافية ونشاطاً.
            </p>
          </div>
        </div>

        {/* Quizzes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div className="h-44 relative bg-stone-100 overflow-hidden">
                <img
                  src={quiz.imageUrl || '/src/assets/images/healthy_habits_quiz_1793901821855.jpg'}
                  alt={quiz.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-lg">
                  {quiz.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                    <ListOrdered className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{quiz.questions?.length || 0} أسئلة تفاعلية</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {quiz.description}
                  </p>
                </div>

                <button
                  onClick={() => startQuiz(quiz)}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>بدء الاختبار التفاعلي الآن</span>
                </button>
              </div>
            </div>
          ))}
        </div>
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
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لقائمة الاختبارات</span>
        </button>

        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          {selectedQuiz.category}
        </span>
      </div>

      {!quizFinished ? (
        /* Questionnaire in progress */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-10 space-y-8">
          
          {/* Progress Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500 font-bold">
              <span>السؤال {currentQuestionIdx + 1} من {selectedQuiz.questions.length}</span>
              <span>نسبة الإنجاز: {progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / selectedQuiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Respondent Name (Optional) */}
          {currentQuestionIdx === 0 && (
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                اسمك الكريم (اختياري - لتسجيل النتيجة):
              </label>
              <input
                type="text"
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
                placeholder="أدخل اسمك أو اتركه فارغاً"
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Question Text */}
          {currentQ && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  {currentQ.type === 'true_false' ? 'سؤال: صح أو خطأ' : 'سؤال: اختيار من متعدد'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
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
                      className={`w-full text-right p-4 sm:p-5 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-2 ring-emerald-500/20'
                          : 'border-stone-200 bg-stone-50 hover:bg-stone-100/80 text-stone-700'
                      }`}
                    >
                      <span>{opt}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mr-3 ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-300 bg-white'
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
          <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIdx === 0}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            <button
              onClick={handleNext}
              disabled={userAnswers[currentQuestionIdx] === -1}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-xs font-bold text-white shadow-xs transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
            >
              <span>{currentQuestionIdx === selectedQuiz.questions.length - 1 ? 'إنهاء وحساب النتيجة' : 'السؤال التالي'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-12 space-y-10 text-center animate-fade-in">
          
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-inner">
              <Award className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              {respondentName ? `أحسنت يا ${respondentName}! لقد أتممت الاختبار` : 'لقد أتممت الاختبار بنجاح!'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              تم تسجيل إجاباتك بنجاح في قاعدة بيانات المبادرة التوعوية.
            </p>
          </div>

          {/* Score Card */}
          <div className="max-w-md mx-auto p-6 rounded-3xl bg-stone-900 text-white shadow-lg space-y-3">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
              مؤشر صحة العادات
            </span>
            <div className="text-5xl font-black text-white">
              {finalPercentage}%
            </div>
            <p className="text-xs text-stone-300">
              أجبت على {finalScore} من أصل {selectedQuiz.questions.length} أسئلة بشكل متوافق مع الإرشادات الصحية.
            </p>

            <div className="pt-2 text-xs font-bold">
              {finalPercentage >= 80 ? (
                <span className="text-emerald-400">ممتاز! نمط حياتك واعٍ وصحي للغاية، استمر على هذا النهج.</span>
              ) : finalPercentage >= 50 ? (
                <span className="text-amber-400">جيد! لديك عادات إيجابية ولكن هناك جوانب تتطلب عناية أكثر.</span>
              ) : (
                <span className="text-rose-400">بحاجة إلى اهتمام! ننصحك بتبني تغييرات تدريجية في النوم والماء والنشاط.</span>
              )}
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="text-right space-y-4 pt-6 border-t border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              مراجعة الإجابات والتوصيات الصحية:
            </h3>

            <div className="space-y-4">
              {selectedQuiz.questions.map((q, qIdx) => {
                const userChoice = userAnswers[qIdx];
                const isCorrect = userChoice === q.correctAnswerIndex;
                return (
                  <div
                    key={qIdx}
                    className={`p-5 rounded-2xl border text-xs space-y-2 ${
                      isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start gap-2 font-bold text-stone-900">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <span>{q.questionText}</span>
                    </div>

                    <div className="mr-6 space-y-1 text-stone-600">
                      <p>
                        إجابتك: <span className="font-semibold text-stone-800">{q.options[userChoice] || 'لم تجب'}</span>
                      </p>
                      {!isCorrect && (
                        <p className="text-emerald-800 font-semibold">
                          الإجابة الصحية الموصى بها: {q.options[q.correctAnswerIndex]}
                        </p>
                      )}
                      {q.explanation && (
                        <p className="text-stone-500 bg-white/80 p-2 rounded-xl mt-1 border border-stone-100 flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
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
              className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار مرة أخرى</span>
            </button>

            <button
              onClick={() => setSelectedQuiz(null)}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>اختيار استبانة صحية أخرى</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
