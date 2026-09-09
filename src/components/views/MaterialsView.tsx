import React, { useState } from 'react';
import { StudyMaterial, WorkspaceTab } from '../../types';
import {
  Search,
  Plus,
  Bookmark,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileText,
  Filter,
} from 'lucide-react';

interface MaterialsViewProps {
  materials: StudyMaterial[];
  onOpenWorkspace: (material: StudyMaterial, tab?: WorkspaceTab) => void;
  onOpenAddModal: () => void;
  onToggleFavorite: (id: string) => void;
}

type MaterialFilter = 'all' | 'recent' | 'favorites' | 'completed';

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  onOpenWorkspace,
  onOpenAddModal,
  onToggleFavorite,
}) => {
  const [filter, setFilter] = useState<MaterialFilter>('all');
  const [search, setSearch] = useState('');

  const filteredMaterials = materials.filter((m) => {
    // Filter type
    if (filter === 'favorites' && !m.isFavorite) return false;
    if (filter === 'completed' && !m.isCompleted && m.progressPercentage < 80) return false;
    if (filter === 'recent' && !m.lastStudied.toLowerCase().includes('today') && !m.lastStudied.toLowerCase().includes('yesterday')) return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.topic.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="materials-library-view" className="space-y-6 max-w-6xl mx-auto">
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Materials
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Your personal digital library of parsed notes, textbooks, and interactive workspaces.
          </p>
        </div>

        <button
          id="materials-add-btn"
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Study Material</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by subject, topic or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'recent', 'favorites', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                filter === f
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f === 'all'
                ? `All (${materials.length})`
                : f === 'favorites'
                ? 'Favorites'
                : f === 'recent'
                ? 'Recent'
                : 'Completed'}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Cards Grid */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              id={`material-card-${mat.id}`}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Subject & Favorite */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    {mat.subject}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(mat.id);
                    }}
                    className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                    title={mat.isFavorite ? 'Unfavorite' : 'Favorite'}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${mat.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`}
                    />
                  </button>
                </div>

                {/* Title */}
                <h3
                  onClick={() => onOpenWorkspace(mat)}
                  className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {mat.title}
                </h3>

                {/* Subtopic */}
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  Topic: {mat.topic}
                </p>
              </div>

              {/* Middle metadata: Pages & Last Studied */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  {mat.pagesCount} Pages
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {mat.lastStudied}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-bold text-slate-900">{mat.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${mat.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Open Workspace Button */}
              <button
                onClick={() => onOpenWorkspace(mat)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-bold transition-all cursor-pointer group-hover:bg-blue-600 group-hover:text-white"
              >
                <span>Open Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-slate-900">
              Your study workspace is waiting.
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Add your first study material and turn it into an interactive learning experience.
            </p>
          </div>
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study Material</span>
          </button>
        </div>
      )}
    </div>
  );
};
