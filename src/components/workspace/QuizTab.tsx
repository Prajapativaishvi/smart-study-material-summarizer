import React, { useState } from 'react';
import { QuizQuestion, QuizResult } from '../../types';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface QuizTabProps {
  quiz: QuizQuestion[];
  topicTitle: string;
  onRetakeOrNavigate?: () => void;
}

export const QuizTab: React.FC<QuizTabProps> = ({ quiz, topicTitle }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [reviewMistakesOnly, setReviewMistakesOnly] = useState(false);

  const currentQ = quiz[currentQuestionIndex];
  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return; // Already locked in for this question
    setSelectedOption(index);
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: index }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(answers[currentQuestionIndex + 1] ?? null);
    } else {
      setIsComplete(true);
    }
  };

  const calculateResult = (): QuizResult => {
    let score = 0;
    const strongAreas: string[] = [];
    const needsRevision: string[] = [];

    quiz.forEach((q, idx) => {
      const userAns = answers[idx];
      if (userAns === q.correctOptionIndex) {
        score += 1;
        if (!strongAreas.includes(q.conceptRef)) {
          strongAreas.push(q.conceptRef);
        }
      } else {
        if (!needsRevision.includes(q.conceptRef)) {
          needsRevision.push(q.conceptRef);
        }
      }
    });

    const accuracy = Math.round((score / quiz.length) * 100);
    return {
      score,
      total: quiz.length,
      accuracy,
      strongAreas: strongAreas.length ? strongAreas : ['Contiguous Memory'],
      needsRevision: needsRevision.length
        ? needsRevision
        : ['Multi-dimensional Offsets', 'Amortized Capacity'],
      recommendedTopics: [
        'Dynamic Array Capacity Doubling proof',
        'Cache Line Prefetching & Matrix Row-Major Order',
      ],
      userAnswers: answers,
    };
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers({});
    setIsComplete(false);
    setReviewMistakesOnly(false);
  };

  const handleReviewMistakes = () => {
    // Find first incorrect question
    const firstWrongIndex = quiz.findIndex(
      (q, idx) => answers[idx] !== q.correctOptionIndex
    );
    if (firstWrongIndex !== -1) {
      setCurrentQuestionIndex(firstWrongIndex);
      setSelectedOption(answers[firstWrongIndex]);
      setIsComplete(false);
      setReviewMistakesOnly(true);
    }
  };

  // Completion View
  if (isComplete) {
    const result = calculateResult();
    return (
      <div id="quiz-complete-view" className="space-y-6 max-w-2xl mx-auto py-4">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Quiz Complete 🎉
          </h2>
          <p className="text-xs text-slate-500">
            Here is your diagnostic breakdown for {topicTitle}.
          </p>
        </div>

        {/* Score & Accuracy Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Score
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {result.score} <span className="text-sm font-semibold text-slate-400">/ {result.total}</span>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Accuracy
            </span>
            <div className="text-3xl font-extrabold text-blue-600 mt-1">
              {result.accuracy}%
            </div>
          </div>
        </div>

        {/* Diagnostic Breakdown */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          {/* Strong Areas */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Strong Areas</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.strongAreas.map((area, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200/70"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Needs Revision */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Needs Revision</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.needsRevision.map((area, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200/70"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Topics */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span>Recommended Follow-Up Topics</span>
            </div>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
              {result.recommendedTopics.map((topic, i) => (
                <li key={i}>{topic}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {result.score < result.total && (
            <button
              id="quiz-review-mistakes-btn"
              onClick={handleReviewMistakes}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Review Mistakes
            </button>
          )}

          <button
            id="quiz-retake-btn"
            onClick={handleRestart}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Full Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  // Active Question View
  return (
    <div id="practice-quiz-view" className="space-y-6 max-w-3xl mx-auto">
      {/* Quiz Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Practice Quiz</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-200">
              Diagnostic
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test and diagnose your comprehension with instant conceptual feedback.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-600 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
          Question {currentQuestionIndex + 1} of {quiz.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-purple-600 h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.round(((currentQuestionIndex + 1) / quiz.length) * 100)}%`,
          }}
        />
      </div>

      {/* Question Box */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            {currentQ.conceptRef}
          </span>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            {currentQ.difficulty}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
          {currentQ.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isAnswered = selectedOption !== null;
            const isCorrect = optIdx === currentQ.correctOptionIndex;

            let optionStyle =
              'border-slate-200 bg-white hover:border-slate-300 text-slate-800';

            if (isAnswered) {
              if (isCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-semibold';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'border-rose-500 bg-rose-50/50 text-rose-950';
              } else {
                optionStyle = 'border-slate-200 opacity-60 text-slate-500';
              }
            }

            return (
              <button
                key={optIdx}
                id={`quiz-option-${optIdx}`}
                disabled={isAnswered}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isAnswered && isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isAnswered && isSelected && !isCorrect
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {optionLetters[optIdx]}
                  </span>
                  <span className="leading-snug">{option}</span>
                </div>

                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Explanation (Shown Immediately upon Selection) */}
        {selectedOption !== null && (
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
              selectedOption === currentQ.correctOptionIndex
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/70 border-rose-200 text-rose-950'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              {selectedOption === currentQ.correctOptionIndex ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>
                    Incorrect. Option {optionLetters[currentQ.correctOptionIndex]} is correct.
                  </span>
                </>
              )}
            </div>
            <p className="text-slate-700">{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => {
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex((prev) => prev - 1);
              setSelectedOption(answers[currentQuestionIndex - 1] ?? null);
            }
          }}
          disabled={currentQuestionIndex === 0}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          ← Previous
        </button>

        <button
          id="quiz-next-question-btn"
          onClick={handleNext}
          disabled={selectedOption === null}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <span>
            {currentQuestionIndex === quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
