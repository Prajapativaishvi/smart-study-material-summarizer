import React from 'react';
import { StudyHistoryItem } from '../../types';
import {
  History,
  FileText,
  HelpCircle,
  Layers,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface StudyHistoryViewProps {
  historyItems: StudyHistoryItem[];
}

export const StudyHistoryView: React.FC<StudyHistoryViewProps> = ({ historyItems }) => {
  // Group by dateGroup
  const grouped: Record<string, StudyHistoryItem[]> = {};
  historyItems.forEach((item) => {
    if (!grouped[item.dateGroup]) {
      grouped[item.dateGroup] = [];
    }
    grouped[item.dateGroup].push(item);
  });

  const getActivityIcon = (type: StudyHistoryItem['activityType']) => {
    switch (type) {
      case 'summary_completed':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'quiz_completed':
        return <HelpCircle className="w-4 h-4 text-purple-600" />;
      case 'flashcards_reviewed':
        return <Layers className="w-4 h-4 text-amber-600" />;
      case 'material_analyzed':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getActivityBadge = (type: StudyHistoryItem['activityType']) => {
    switch (type) {
      case 'summary_completed':
        return 'Summary';
      case 'quiz_completed':
        return 'Quiz';
      case 'flashcards_reviewed':
        return 'Flashcards';
      case 'material_analyzed':
        return 'Analyzed';
    }
  };

  return (
    <div id="study-history-view" className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <History className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Study History
          </h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          A verifiable audit timeline of study sessions, quiz diagnostics, and active recall practice.
        </p>
      </div>

      {/* Timeline Groups */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([dateGroup, items]) => (
          <div key={dateGroup} className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {dateGroup}
              </h3>
              <div className="h-px bg-slate-200 flex-1 ml-2" />
            </div>

            {/* Items under this group */}
            <div className="relative pl-6 border-l-2 border-slate-200 space-y-4 ml-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-colors"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] top-5 w-3.5 h-3.5 rounded-full bg-white border-2 border-blue-600 ring-4 ring-slate-50" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                        {getActivityIcon(item.activityType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {item.title}
                          </h4>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {getActivityBadge(item.activityType)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {item.detail}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs text-slate-400 shrink-0">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </span>
                      {item.scoreOrProgress && (
                        <span className="font-bold text-blue-600 mt-0.5">
                          {item.scoreOrProgress}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
