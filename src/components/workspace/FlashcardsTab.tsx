import React, { useState, useEffect } from 'react';
import { Flashcard } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  CheckCircle2,
  HelpCircle,
  Shuffle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface FlashcardsTabProps {
  flashcards: Flashcard[];
  onComplete?: () => void;
}

export const FlashcardsTab: React.FC<FlashcardsTabProps> = ({ flashcards }) => {
  const { success } = useToast();
  const [cards, setCards] = useState<Flashcard[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(
    flashcards.filter((f) => f.isKnown).length
  );
  const [reviewAgainCount, setReviewAgainCount] = useState(0);

  // Sync if prop updates
  useEffect(() => {
    setCards(flashcards);
    setKnownCount(flashcards.filter((f) => f.isKnown).length);
  }, [flashcards]);

  const currentCard = cards[currentIndex] || cards[0];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrevious();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleIKnowThis = () => {
    const updated = [...cards];
    if (!updated[currentIndex].isKnown) {
      updated[currentIndex].isKnown = true;
      setKnownCount((prev) => prev + 1);
      setCards(updated);
      success('Great Recall!', 'Marked as known.');
    }
    handleNext();
  };

  const handleReviewAgain = () => {
    const updated = [...cards];
    updated[currentIndex].isKnown = false;
    setReviewAgainCount((prev) => prev + 1);
    setCards(updated);
    handleNext();
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCurrentIndex(0);
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const handleReset = () => {
    setIsFlipped(false);
    setCurrentIndex(0);
    setCards(flashcards.map((c) => ({ ...c, isKnown: false })));
    setKnownCount(0);
    setReviewAgainCount(0);
  };

  const progressPercentage = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div id="flashcards-view" className="space-y-6 max-w-3xl mx-auto">
      {/* Header & Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Flashcards</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
              Active Recall
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test retention before taking the graded quiz. Click card or press Space to flip.
          </p>
        </div>

        {/* Counter and Utility Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
            title="Shuffle cards"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
            title="Reset progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Progress & Stats Strip */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
        <span className="text-slate-900 font-bold">
          Card {currentIndex + 1} of {cards.length}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {knownCount} Mastered
          </span>
          {reviewAgainCount > 0 && (
            <span className="text-amber-700">
              {reviewAgainCount} Due Review
            </span>
          )}
        </div>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Large 3D Flip Card Container */}
      <div className="relative perspective-1000 w-full min-h-[340px] select-none">
        <div
          id="active-flashcard"
          onClick={handleFlip}
          className={`w-full min-h-[340px] rounded-3xl p-8 sm:p-10 cursor-pointer shadow-sm hover:shadow-md transition-all duration-500 transform-style-3d border ${
            isFlipped
              ? 'rotate-y-180 bg-slate-900 text-white border-slate-800'
              : 'bg-white text-slate-900 border-slate-200'
          }`}
        >
          {/* FRONT FACE */}
          <div
            className={`absolute inset-0 p-8 sm:p-10 flex flex-col justify-between backface-hidden ${
              isFlipped ? 'hidden' : 'flex'
            }`}
          >
            {/* Top metadata */}
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold tracking-wide uppercase text-[11px]">
                {currentCard.category}
              </span>
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <RotateCw className="w-3.5 h-3.5" />
                Click to flip
              </span>
            </div>

            {/* Front Question Prompt */}
            <div className="py-6 my-auto text-center">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2 block">
                Question
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {currentCard.frontQuestion}
              </h3>
              {currentCard.hint && (
                <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Hint: {currentCard.hint}
                </p>
              )}
            </div>

            {/* Card Footer */}
            <div className="text-center text-xs text-slate-400 font-medium">
              Spacebar or click anywhere to reveal answer
            </div>
          </div>

          {/* BACK FACE (Answer) */}
          <div
            className={`absolute inset-0 p-8 sm:p-10 flex flex-col justify-between backface-hidden rotate-y-180 ${
              isFlipped ? 'flex' : 'hidden'
            }`}
          >
            {/* Top metadata */}
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 font-bold tracking-wide uppercase text-[11px] border border-emerald-800">
                Answer
              </span>
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <RotateCw className="w-3.5 h-3.5" />
                Click to flip back
              </span>
            </div>

            {/* Back Answer text */}
            <div className="py-6 my-auto text-center">
              <p className="text-lg sm:text-xl font-medium text-slate-100 leading-relaxed max-w-xl mx-auto">
                {currentCard.backAnswer}
              </p>
            </div>

            {/* Back footer */}
            <div className="text-center text-xs text-slate-400">
              Rate your recall using the buttons below
            </div>
          </div>
        </div>
      </div>

      {/* Action Rating Buttons: Review Again & I Know This */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {/* Navigation Left / Right */}
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold text-slate-500 px-1">
            {currentIndex + 1} / {cards.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Next card"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Rating Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
          <button
            id="flashcard-review-again-btn"
            onClick={handleReviewAgain}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            <span>Review Again</span>
          </button>

          <button
            id="flashcard-i-know-this-btn"
            onClick={handleIKnowThis}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>I Know This</span>
          </button>
        </div>
      </div>
    </div>
  );
};
