import React from 'react';
import { StudyMaterial, WorkspaceTab } from '../../types';
import {
  RotateCcw,
  Calendar,
  Sparkles,
  TrendingUp,
  Clock,
  Layers,
  HelpCircle,
  Brain,
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface RevisionTabProps {
  material: StudyMaterial;
  onNavigateTab: (tab: WorkspaceTab) => void;
}

export const RevisionTab: React.FC<RevisionTabProps> = ({
  material,
  onNavigateTab,
}) => {
  const { success } = useToast();

  const handleSchedulePrompt = () => {
    success(
      'Revision Scheduled',
      'StudyLens will notify you in 24 hours for spaced recall practice.'
    );
  };

  return (
    <div id="workspace-revision-view" className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Revision Insights</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
              Spaced Repetition
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Retention decay modeling based on Ebbinghaus forgetting curve and your quiz diagnostics.
          </p>
        </div>

        <button
          onClick={handleSchedulePrompt}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Schedule Spacing Alert</span>
        </button>
      </div>

      {/* Retention Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Estimated Memory Retention
            </span>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
            Optimal Review Window
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-4xl font-extrabold tracking-tight">
              78% <span className="text-sm font-normal text-slate-400">Recall Probability</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-md">
              Without active practice, retention for <strong className="text-white">{material.title}</strong> will decay to 45% over the next 4 days.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('flashcards')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Review Flashcards Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Revision Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended Review Actions */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Targeted Focus Points
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <span>
                <strong>Multi-dimensional row-major offsets:</strong> Scored lowest during diagnostic quiz.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>
                <strong>Amortized dynamic array resizing:</strong> Review geometric 2x capacity doubling proof.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>
                <strong>Contiguous indexing formula:</strong> High mastery confirmed (100% correct).
              </span>
            </li>
          </ul>
        </div>

        {/* Spacing Timeline */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Spaced Repetition Schedule
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-800">Interval 1 (Today)</span>
              <span className="text-emerald-700 font-bold">Completed ✓</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/70 border border-blue-200/80">
              <span className="font-semibold text-blue-900">Interval 2 (In 24 Hours)</span>
              <span className="text-blue-700 font-bold">Scheduled</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-400">
              <span>Interval 3 (In 4 Days)</span>
              <span>Upcoming</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
