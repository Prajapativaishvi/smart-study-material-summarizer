import React, { useState } from 'react';
import { StudyMaterial, WorkspaceTab } from '../../types';
import { FlashcardsTab } from '../workspace/FlashcardsTab';
import { Layers, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';

interface FlashcardsPageViewProps {
  materials: StudyMaterial[];
  onOpenWorkspace: (material: StudyMaterial, tab?: WorkspaceTab) => void;
}

export const FlashcardsPageView: React.FC<FlashcardsPageViewProps> = ({
  materials,
  onOpenWorkspace,
}) => {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(
    materials[0]?.id || ''
  );

  const currentMaterial =
    materials.find((m) => m.id === selectedMaterialId) || materials[0];

  return (
    <div id="flashcards-page-view" className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Flashcard Decks
          </h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Active recall practice across your syllabus. Flip cards to test your retention.
        </p>
      </div>

      {/* Deck Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {materials.map((mat) => (
          <button
            key={mat.id}
            onClick={() => setSelectedMaterialId(mat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedMaterialId === mat.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {mat.title} ({mat.flashcards.length} cards)
          </button>
        ))}
      </div>

      {/* Flashcards Player */}
      {currentMaterial ? (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {currentMaterial.subject}
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {currentMaterial.topic}
              </h3>
            </div>

            <button
              onClick={() => onOpenWorkspace(currentMaterial, 'flashcards')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Open in Study Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <FlashcardsTab flashcards={currentMaterial.flashcards} />
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          No flashcards available.
        </div>
      )}
    </div>
  );
};
