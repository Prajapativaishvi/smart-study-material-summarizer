import React from 'react';
import {
  FileText,
  KeyRound,
  Layers,
  HelpCircle,
  Network,
  RotateCcw,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Zap,
  GraduationCap,
} from 'lucide-react';
import { StudyLensLogo } from '../common/StudyLensLogo';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const features = [
    {
      id: 'feat-summary',
      title: 'Smart Summary',
      description: 'Structured key takeaways, definitions, and code snippets in Short, Balanced, or Detailed depth.',
      icon: FileText,
      badge: 'Multi-Depth',
    },
    {
      id: 'feat-concepts',
      title: 'Key Concepts',
      description: 'Isolate crucial mental models with explicit importance and difficulty weighting for exam readiness.',
      icon: KeyRound,
      badge: 'Prioritized',
    },
    {
      id: 'feat-flashcards',
      title: 'Flashcards',
      description: 'Interactive 3D active recall cards with confidence-based spaced repetition queues.',
      icon: Layers,
      badge: 'Active Recall',
    },
    {
      id: 'feat-quiz',
      title: 'Practice Quiz',
      description: 'Diagnostic multiple-choice tests with immediate feedback, explanations, and error analysis.',
      icon: HelpCircle,
      badge: 'Diagnostic',
    },
    {
      id: 'feat-map',
      title: 'Concept Map',
      description: 'Visual relationship network illustrating how core principles link and depend on one another.',
      icon: Network,
      badge: 'Relational Graph',
    },
    {
      id: 'feat-revision',
      title: 'Revision Insights',
      description: 'Automated retention monitoring based on the forgetting curve to schedule review sessions.',
      icon: RotateCcw,
      badge: 'Retention Curve',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-100">
      {/* 1. Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <StudyLensLogo size="md" />

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
              <a href="#features" className="hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
                How It Works
              </a>
              <a href="#for-students" className="hover:text-blue-600 transition-colors">
                For Students
              </a>
            </nav>
          </div>

          {/* Right auth actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onEnterApp}
              className="text-xs font-semibold text-slate-700 hover:text-slate-950 px-3 py-1.5 transition-colors cursor-pointer"
            >
              Log In
            </button>
            <button
              id="landing-get-started-btn"
              onClick={onEnterApp}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-xs shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Intelligent Study Platform for College Students</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Turn study material into your{' '}
                <span className="text-blue-600 underline decoration-blue-200 underline-offset-4">
                  learning path.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Transform long notes and study material into clear summaries, key concepts, flashcards, quizzes, and revision insights.
              </p>

              {/* Supporting slogan */}
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Understand</span>
                <span>•</span>
                <span>Practice</span>
                <span>•</span>
                <span>Revise</span>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="hero-start-studying-btn"
                  onClick={onEnterApp}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm shadow-blue-500/25 transition-all hover:gap-2.5 cursor-pointer"
                >
                  <span>Start Studying</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#how-it-works"
                  className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors cursor-pointer text-center"
                >
                  See How It Works
                </a>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  No ChatGPT clutter
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Structured for college exams
                </span>
              </div>
            </div>

            {/* Right Side: Realistic StudyLens Product Dashboard Preview */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden p-5 sm:p-6 space-y-4">
                {/* Simulated App Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                    <span className="text-xs font-bold text-slate-800 ml-2">
                      StudyWorkspace — Data Structures: Arrays
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    Active Session
                  </span>
                </div>

                {/* Simulated Workspace Content */}
                <div className="space-y-3">
                  {/* Recommended Next Step Box */}
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                        Recommended Next Step
                      </span>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">
                        Practice 5 flashcards on Array Indexing
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-600 text-white">
                      Practice →
                    </span>
                  </div>

                  {/* 2-column feature sample inside preview */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        Smart Summary
                      </span>
                      <p className="font-bold text-slate-800">
                        O(1) Contiguous Access
                      </p>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Base + (index × ElementSize) pointer arithmetic.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        Concept Map
                      </span>
                      <p className="font-bold text-slate-800">
                        6 Interlinked Topics
                      </p>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Indexing ⇄ Traversal ⇄ Searching.
                      </p>
                    </div>
                  </div>

                  {/* Flashcard Preview Card */}
                  <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-amber-300 font-bold uppercase tracking-wide">
                        Flashcard #4
                      </span>
                      <span className="text-slate-400">Click to flip</span>
                    </div>
                    <p className="text-xs font-medium text-slate-100">
                      &ldquo;Which property makes array indexing efficient in hardware?&rdquo;
                    </p>
                  </div>
                </div>

                {/* Simulated live status footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    Quiz Accuracy: 84%
                  </span>
                  <span>12 Materials Organized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Simple 3-Step Methodology
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How StudyLens Works
            </h2>
            <p className="text-sm text-slate-600">
              Replace passive rereading with an active, structured study workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="text-3xl font-extrabold text-blue-600">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Add Material
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload notes, PDFs, or paste study content directly into your workspace.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="text-3xl font-extrabold text-blue-600">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Understand Faster
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                StudyLens organizes the material into summaries and important concepts with core ideas and definitions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="text-3xl font-extrabold text-blue-600">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Practice & Revise
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Use flashcards, quizzes, concept maps, and revision insights to test retention before exam day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section (6 Cards) */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Comprehensive Toolkit
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Six Specialized Study Tools
            </h2>
            <p className="text-sm text-slate-600">
              Engineered specifically for engineering, mathematics, science, and computer science students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {feat.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600">
                    <span>Explore in Demo →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. For Students Callout */}
      <section id="for-students" className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Built for college exams, not casual chat.
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Most AI tools give you endless walls of unstructured text. StudyLens breaks complex syllabi into verifiable components you can actually remember when looking at an exam sheet.
          </p>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="py-20 text-center bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Stop rereading. Start understanding.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto">
            Ready to experience a structured study workflow designed for college students?
          </p>

          <div>
            <button
              id="final-cta-start-studying-btn"
              onClick={onEnterApp}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all hover:gap-3 cursor-pointer"
            >
              <span>Start Studying</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <StudyLensLogo size="sm" />
            <span className="text-slate-400">| Turn study material into your learning path</span>
          </div>
          <div>© {new Date().getFullYear()} StudyLens Inc. Built for hackathon demonstration.</div>
        </div>
      </footer>
    </div>
  );
};
