import React, { useState } from 'react';
import { KeyConcept } from '../../types';
import { Check, Bookmark, CheckCircle2, Circle } from 'lucide-react';
import { useToast } from '../common/Toast';

interface KeyConceptsTabProps {
  concepts: KeyConcept[];
  onToggleUnderstood: (id: string) => void;
  onToggleSavedRevision?: (id: string) => void;
}

type ConceptFilter = 'all' | 'important' | 'difficult' | 'completed';

export const KeyConceptsTab: React.FC<KeyConceptsTabProps> = ({
  concepts,
  onToggleUnderstood,
  onToggleSavedRevision,
}) => {
  const { success, info } = useToast();
  const [filter, setFilter] = useState<ConceptFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConcepts = concepts.filter((c) => {
    // Filter type
    if (filter === 'important' && c.importance !== 'High') return false;
    if (filter === 'difficult' && c.difficulty !== 'Hard') return false;
    if (filter === 'completed' && !c.isUnderstood) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.explanation.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const understoodCount = concepts.filter((c) => c.isUnderstood).length;
  const progressPercent = Math.round((understoodCount / concepts.length) * 100);

  const handleToggle = (c: KeyConcept) => {
    onToggleUnderstood(c.id);
    if (!c.isUnderstood) {
      success('Concept Mastered!', `Marked "${c.name}" as understood.`);
    } else {
      info('Concept Updated', `Marked "${c.name}" as needing review.`);
    }
  };

  return (
    <div id="key-concepts-view" className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Progress Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Key Concepts</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              {understoodCount}/{concepts.length} Mastered ({progressPercent}%)
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Essential principles, definitions, and mental models identified by StudyLens.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All ({concepts.length})
          </button>
          <button
            onClick={() => setFilter('important')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'important'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Important (High)
          </button>
          <button
            onClick={() => setFilter('difficult')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'difficult'
                ? 'bg-rose-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Difficult (Hard)
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Understood ({understoodCount})
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Concept Cards Grid */}
      {filteredConcepts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConcepts.map((concept) => {
            const isDone = concept.isUnderstood;
            return (
              <div
                key={concept.id}
                id={`concept-card-${concept.id}`}
                className={`p-5 rounded-2xl border transition-all duration-150 flex flex-col justify-between ${
                  isDone
                    ? 'bg-emerald-50/20 border-emerald-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  {/* Category & Badges Header */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {concept.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Importance Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          concept.importance === 'High'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : concept.importance === 'Medium'
                            ? 'bg-slate-50 text-slate-700 border-slate-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}
                      >
                        {concept.importance} Imp
                      </span>

                      {/* Difficulty Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          concept.difficulty === 'Hard'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : concept.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {concept.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Concept Title & Explanation */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {concept.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    &ldquo;{concept.explanation}&rdquo;
                  </p>
                </div>

                {/* Card Actions: Mark as Understood & Save for Revision */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggle(concept)}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400" />
                    )}
                    <span>{isDone ? 'Understood' : 'Mark Understood'}</span>
                  </button>

                  {onToggleSavedRevision && (
                    <button
                      onClick={() => onToggleSavedRevision(concept.id)}
                      className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
                      title={concept.isSavedForRevision ? 'In Revision' : 'Save for Revision'}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          concept.isSavedForRevision ? 'fill-amber-500 text-amber-600' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 text-center rounded-2xl bg-white border border-slate-200 text-slate-500">
          No concepts match the selected filter.
        </div>
      )}
    </div>
  );
};
