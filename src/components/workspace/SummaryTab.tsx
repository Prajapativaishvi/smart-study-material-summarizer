import React, { useState } from 'react';
import { SmartSummary } from '../../types';
import {
  Check,
  Bookmark,
  Sparkles,
  Lightbulb,
  BookOpen,
  Code2,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface SummaryTabProps {
  summary: SmartSummary;
  topicTitle: string;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ summary, topicTitle }) => {
  const { success, info } = useToast();
  const [depth, setDepth] = useState<'short' | 'balanced' | 'detailed'>('balanced');
  const [isUnderstood, setIsUnderstood] = useState(false);
  const [isSavedForRevision, setIsSavedForRevision] = useState(false);

  const handleMarkUnderstood = () => {
    setIsUnderstood(!isUnderstood);
    if (!isUnderstood) {
      success('Marked as Understood', `${topicTitle} summary marked as mastered!`);
    } else {
      info('Status updated', 'Removed from understood');
    }
  };

  const handleSaveForRevision = () => {
    setIsSavedForRevision(!isSavedForRevision);
    if (!isSavedForRevision) {
      success('Saved for Revision', `Added ${topicTitle} to your Revision Center schedule.`);
    } else {
      info('Revision updated', 'Removed from active revision list');
    }
  };

  return (
    <div id="smart-summary-view" className="space-y-6 max-w-4xl mx-auto">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Smart Summary</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
              AI Synthesized
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured high-retention notes generated from your study material.
          </p>
        </div>

        {/* Depth Selector Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
            {(['short', 'balanced', 'detailed'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setDepth(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  depth === mode
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Action Buttons: Mark as Understood & Save for Revision */}
          <button
            id="summary-mark-understood-btn"
            onClick={handleMarkUnderstood}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isUnderstood
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${isUnderstood ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{isUnderstood ? 'Understood ✓' : 'Mark Understood'}</span>
          </button>

          <button
            id="summary-save-revision-btn"
            onClick={handleSaveForRevision}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isSavedForRevision
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSavedForRevision ? 'fill-amber-500 text-amber-600' : 'text-slate-400'}`} />
            <span>{isSavedForRevision ? 'In Revision' : 'Save for Revision'}</span>
          </button>
        </div>
      </div>

      {/* 1. Quick Overview */}
      <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            Quick Overview
          </h3>
        </div>
        <p className="text-sm text-slate-800 leading-relaxed">
          {depth === 'short'
            ? summary.shortVersion
            : depth === 'detailed'
            ? summary.detailedVersion
            : summary.quickOverview}
        </p>
      </div>

      {/* 2. Core Ideas (Separate Visual Cards) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Core Ideas
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {summary.coreIdeas.map((idea) => (
            <div
              key={idea.id}
              className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {idea.title}
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {idea.description}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-blue-700 font-medium">
                <span className="font-bold shrink-0">Key Takeaway:</span>
                <span>{idea.keyTakeaway}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Important Definitions (Definition Cards) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Important Definitions
          </h3>
        </div>

        <div className="space-y-2.5">
          {summary.importantDefinitions.map((def) => (
            <div
              key={def.id}
              className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {def.term}
                </span>
                {def.context && (
                  <span className="text-[11px] text-slate-400 font-medium">
                    {def.context}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                {def.definition}
              </p>
              {def.formulaOrSyntax && (
                <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 font-mono text-xs text-slate-800">
                  {def.formulaOrSyntax}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Examples (Clean Example Blocks) */}
      {summary.examples && summary.examples.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Implementation & Scenarios
            </h3>
          </div>

          <div className="space-y-3">
            {summary.examples.map((ex) => (
              <div
                key={ex.id}
                className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs"
              >
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{ex.title}</span>
                  {ex.language && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                      {ex.language}
                    </span>
                  )}
                </div>
                {ex.codeSnippet && (
                  <pre className="p-4 bg-slate-900 text-slate-100 text-xs overflow-x-auto font-mono leading-relaxed">
                    <code>{ex.codeSnippet}</code>
                  </pre>
                )}
                <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-600">
                  {ex.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Remember This (Exam-Oriented Callout) */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-amber-100/30 border border-amber-200 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
            Remember This — Exam & Interview Prep
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-800">
          <div className="space-y-1.5">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Key Exam Points:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
              {summary.rememberThis.keyExamPoints.map((pt, i) => (
                <li key={i} className="leading-snug">
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Common Pitfalls:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
              {summary.rememberThis.commonPitfalls.map((pf, i) => (
                <li key={i} className="leading-snug">
                  {pf}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
