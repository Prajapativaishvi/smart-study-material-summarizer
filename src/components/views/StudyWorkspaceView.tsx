import React, { useState } from 'react';
import { StudyMaterial, WorkspaceTab } from '../../types';
import {
  LayoutDashboard,
  FileText,
  KeyRound,
  Layers,
  HelpCircle,
  Network,
  RotateCcw,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import { OverviewTab } from '../workspace/OverviewTab';
import { SummaryTab } from '../workspace/SummaryTab';
import { KeyConceptsTab } from '../workspace/KeyConceptsTab';
import { FlashcardsTab } from '../workspace/FlashcardsTab';
import { QuizTab } from '../workspace/QuizTab';
import { ConceptMapTab } from '../workspace/ConceptMapTab';
import { RevisionTab } from '../workspace/RevisionTab';
import { useToast } from '../common/Toast';

interface StudyWorkspaceViewProps {
  material: StudyMaterial;
  initialTab?: WorkspaceTab;
  onBackToMaterials: () => void;
  onToggleFavorite: (id: string) => void;
  onUpdateConcepts: (materialId: string, conceptId: string) => void;
}

export const StudyWorkspaceView: React.FC<StudyWorkspaceViewProps> = ({
  material,
  initialTab = 'overview',
  onBackToMaterials,
  onToggleFavorite,
  onUpdateConcepts,
}) => {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(initialTab);

  const tabs: { id: WorkspaceTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'concepts', label: 'Key Concepts', icon: KeyRound },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'concept_map', label: 'Concept Map', icon: Network },
    { id: 'revision', label: 'Revision', icon: RotateCcw },
  ];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    success('Link Copied!', 'Study workspace link copied to clipboard.');
  };

  if (!material) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <p className="text-slate-600 text-sm font-medium">No study material selected.</p>
        <button
          onClick={onBackToMaterials}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Materials
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workspace Top Nav / Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center justify-between gap-4 mb-3">
          <button
            onClick={onBackToMaterials}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Materials</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(material.id)}
              className={`p-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                material.isFavorite
                  ? 'bg-amber-50 border-amber-200 text-amber-600'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
              title={material.isFavorite ? 'Starred material' : 'Add to favorites'}
            >
              <Bookmark className={`w-4 h-4 ${material.isFavorite ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
              title="Share workspace"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title and Subtext */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {material.subject}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">
                {material.pagesCount} Pages Analyzed
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {material.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your material has been organized into a learning workspace.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {material.progressPercentage}% Completed
            </span>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-5 -mb-5 pb-1 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`workspace-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Panels */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <OverviewTab
            material={material}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'summary' && (
          <SummaryTab
            summary={material.summary}
            topicTitle={material.topic}
          />
        )}
        {activeTab === 'concepts' && (
          <KeyConceptsTab
            concepts={material.keyConcepts}
            onToggleUnderstood={(cid) => onUpdateConcepts(material.id, cid)}
          />
        )}
        {activeTab === 'flashcards' && (
          <FlashcardsTab
            flashcards={material.flashcards}
          />
        )}
        {activeTab === 'quiz' && (
          <QuizTab
            quiz={material.quiz}
            topicTitle={material.topic}
          />
        )}
        {activeTab === 'concept_map' && (
          <ConceptMapTab
            conceptMap={material.conceptMap}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'revision' && (
          <RevisionTab
            material={material}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
      </div>
    </div>
  );
};
