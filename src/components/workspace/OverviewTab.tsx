import React from 'react';
import {
  StudyMaterial,
  WorkspaceTab,
} from '../../types';
import {
  FileText,
  KeyRound,
  Layers,
  HelpCircle,
  Network,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  Clock,
  BookOpen,
} from 'lucide-react';

interface OverviewTabProps {
  material: StudyMaterial;
  onSelectTab: (tab: WorkspaceTab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  material,
  onSelectTab,
}) => {
  const tools = [
    {
      id: 'summary' as WorkspaceTab,
      title: 'Smart Summary',
      description: 'Structured breakdown with core ideas, definitions, code examples, and exam callouts.',
      icon: FileText,
      badge: '3 Depth Modes',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'concepts' as WorkspaceTab,
      title: 'Key Concepts',
      description: `${material.keyConcepts.length} core concepts mapped with difficulty and understanding trackers.`,
      icon: KeyRound,
      badge: `${material.keyConcepts.filter((c) => c.isUnderstood).length}/${material.keyConcepts.length} Mastered`,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'flashcards' as WorkspaceTab,
      title: 'Flashcards',
      description: `${material.flashcards.length} active recall cards with 3D flip and spaced confidence rating.`,
      icon: Layers,
      badge: `${material.flashcards.length} Cards Ready`,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'quiz' as WorkspaceTab,
      title: 'Practice Quiz',
      description: `${material.quiz.length} test questions with step-by-step reasoning and performance analysis.`,
      icon: HelpCircle,
      badge: '10 Questions',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'concept_map' as WorkspaceTab,
      title: 'Concept Map',
      description: 'Interactive visual node network displaying relational dependencies between subtopics.',
      icon: Network,
      badge: 'Visual Graph',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'revision' as WorkspaceTab,
      title: 'Revision Insights',
      description: 'Recall retention tracker and spaced repetition schedule tailored to your weak areas.',
      icon: RotateCcw,
      badge: 'Optimal Spacing',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Recommended Next Step Hero Banner */}
      <div
        id="recommended-next-step-card"
        className="rounded-2xl border border-blue-200/90 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white p-5 sm:p-6 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-[11px] font-bold tracking-wide uppercase">
              <span>Recommended Next Step</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {material.recommendedNextStep}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Based on your study history, active recall flashcards will solidify memory allocation concepts before taking the quiz.
            </p>
          </div>

          <button
            id="start-practice-btn"
            onClick={() => onSelectTab('flashcards')}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm shadow-blue-500/20 transition-all hover:gap-2.5 cursor-pointer"
          >
            <span>Start Practice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Metric Cards: Study Progress, Topic Breakdown, Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Study Progress */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Study Progress
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {material.progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-3">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${material.progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              Ahead of schedule
            </span>
            <span>{material.pagesCount} pages indexed</span>
          </div>
        </div>

        {/* Topic Breakdown */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Topic Breakdown
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {material.keyConcepts.length} subtopics
            </span>
          </div>
          <div className="space-y-1.5 mt-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">Memory Architecture</span>
              <span className="text-emerald-600 font-semibold">100% understood</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">Element Shifting & Resizing</span>
              <span className="text-amber-600 font-semibold">Needs review</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">Multi-dimensional Offsets</span>
              <span className="text-blue-600 font-semibold">In progress</span>
            </div>
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Difficulty Distribution
            </span>
            <span className="text-xs text-slate-400 font-medium">Weighted</span>
          </div>
          <div className="flex items-center gap-1 h-3 rounded-full overflow-hidden my-3">
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${material.difficultyDistribution.easy}%` }}
              title={`Easy: ${material.difficultyDistribution.easy}%`}
            />
            <div
              className="bg-amber-500 h-full"
              style={{ width: `${material.difficultyDistribution.medium}%` }}
              title={`Medium: ${material.difficultyDistribution.medium}%`}
            />
            <div
              className="bg-rose-500 h-full"
              style={{ width: `${material.difficultyDistribution.hard}%` }}
              title={`Hard: ${material.difficultyDistribution.hard}%`}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Easy ({material.difficultyDistribution.easy}%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Med ({material.difficultyDistribution.medium}%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Hard ({material.difficultyDistribution.hard}%)
            </span>
          </div>
        </div>
      </div>

      {/* Material Overview Statement */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Material Overview
          </h3>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          {material.summary.quickOverview}
        </p>
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Last studied: {material.lastStudied}
          </span>
          <span>•</span>
          <span>Subject: {material.subject}</span>
          <span>•</span>
          <span>Curriculum: Standard ABET / Computer Science Engineering</span>
        </div>
      </div>

      {/* 6 Tool Cards Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Interactive Study Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                id={`workspace-tool-card-${tool.id}`}
                onClick={() => onSelectTab(tool.id)}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${tool.color}`}
                    >
                      {tool.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
