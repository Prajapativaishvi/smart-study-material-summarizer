import React from 'react';
import { RevisionItem, StudyMaterial, WorkspaceTab } from '../../types';
import {
  RotateCcw,
  Calendar,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface RevisionCenterViewProps {
  revisionItems: RevisionItem[];
  materials: StudyMaterial[];
  onOpenWorkspace: (material: StudyMaterial, tab?: WorkspaceTab) => void;
}

export const RevisionCenterView: React.FC<RevisionCenterViewProps> = ({
  revisionItems,
  materials,
  onOpenWorkspace,
}) => {
  const { success } = useToast();

  const reviseToday = revisionItems.filter((item) => item.priority === 'revise_today');
  const dueForReview = revisionItems.filter((item) => item.priority === 'due_for_review');
  const strongTopics = revisionItems.filter((item) => item.priority === 'strong');
  const needsAttention = revisionItems.filter((item) => item.priority === 'needs_attention');

  const handleStartReview = (item: RevisionItem) => {
    const mat = materials.find((m) => m.id === item.materialId) || materials[0];
    onOpenWorkspace(mat, 'revision');
    success('Revision Session Started', `Opening ${item.topic} study tools.`);
  };

  const renderSection = (
    title: string,
    badgeText: string,
    badgeColor: string,
    items: RevisionItem[],
    emptyMessage: string
  ) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {title}
          </h3>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
            {badgeText} ({items.length})
          </span>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                    {item.subject}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    Last reviewed: {item.lastReviewed}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900">
                  {item.topic}
                </h4>

                {item.subtopicNotes && (
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.subtopicNotes}
                  </p>
                )}
              </div>

              {/* Confidence Meter */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Confidence Score</span>
                  <span
                    className={`font-bold ${
                      item.confidence >= 75
                        ? 'text-emerald-600'
                        : item.confidence >= 50
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {item.confidence}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      item.confidence >= 75
                        ? 'bg-emerald-500'
                        : item.confidence >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.confidence}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleStartReview(item)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500 text-center">
          {emptyMessage}
        </div>
      )}
    </div>
  );

  return (
    <div id="revision-center-view" className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Revision Center
          </h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Intelligent spaced repetition schedules prioritized by diagnostic error rates and forgetting curves.
        </p>
      </div>

      {/* 1. Revise Today (Topics requiring attention) */}
      {renderSection(
        'Revise Today',
        'Urgent',
        'bg-rose-50 text-rose-700 border-rose-200',
        reviseToday,
        'No urgent topics scheduled for today!'
      )}

      {/* 2. Due for Review (Topics not reviewed recently) */}
      {renderSection(
        'Due for Review',
        'Spaced Interval',
        'bg-amber-50 text-amber-700 border-amber-200',
        dueForReview,
        'All spaced intervals are up to date.'
      )}

      {/* 3. Needs Attention (Lower quiz performance) */}
      {renderSection(
        'Needs Attention',
        'Diagnostics',
        'bg-purple-50 text-purple-700 border-purple-200',
        needsAttention,
        'No weak areas flagged in recent quizzes.'
      )}

      {/* 4. Strong Topics (Student performs well) */}
      {renderSection(
        'Strong Topics',
        'Mastered',
        'bg-emerald-50 text-emerald-700 border-emerald-200',
        strongTopics,
        'Complete more practice quizzes to record strong topics.'
      )}
    </div>
  );
};
