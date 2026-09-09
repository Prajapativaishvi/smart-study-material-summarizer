import React from 'react';
import {
  StudyMaterial,
  UserProfile,
  ActivePage,
  WorkspaceTab,
} from '../../types';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Calendar,
  Sparkles,
  Layers,
  Plus,
} from 'lucide-react';

interface DashboardViewProps {
  userProfile: UserProfile;
  materials: StudyMaterial[];
  onOpenWorkspace: (material: StudyMaterial, tab?: WorkspaceTab) => void;
  onOpenAddModal: () => void;
  onNavigate: (page: ActivePage) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  materials,
  onOpenWorkspace,
  onOpenAddModal,
  onNavigate,
}) => {
  const stats = [
    {
      id: 'stat-materials',
      label: 'Materials Studied',
      value: userProfile.materialsCount,
      change: '+2 this week',
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'stat-topics',
      label: 'Topics Completed',
      value: userProfile.topicsCompleted,
      change: '8 ahead of plan',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'stat-accuracy',
      label: 'Quiz Accuracy',
      value: `${userProfile.quizAccuracy}%`,
      change: '+5% vs last week',
      icon: HelpCircle,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      id: 'stat-revision',
      label: 'Revision Progress',
      value: `${userProfile.revisionProgress}%`,
      change: 'Optimal recall rate',
      icon: RotateCcw,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  // Specific continue studying materials
  const continueMaterials = materials.slice(0, 3);

  return (
    <div id="dashboard-main-view" className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Welcome back! 👋</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Ready to continue your learning journey?
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Material</span>
        </button>
      </div>

      {/* 4 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {st.label}
                </span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${st.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {st.value}
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  <span>{st.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Studying Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Continue Studying</h2>
            <p className="text-xs text-slate-500">Pick up right where you left off</p>
          </div>
          <button
            onClick={() => onNavigate('materials')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Materials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {continueMaterials.map((mat) => (
            <div
              key={mat.id}
              id={`continue-card-${mat.id}`}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-blue-600 uppercase tracking-wider text-[11px]">
                    {mat.subject}
                  </span>
                  <span className="text-slate-400">Last: {mat.lastStudied}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {mat.title}
                </h3>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {mat.summary.quickOverview}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Progress</span>
                  <span className="font-bold text-slate-900">{mat.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${mat.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Action */}
              <button
                id={`continue-btn-${mat.id}`}
                onClick={() => onOpenWorkspace(mat)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors cursor-pointer group-hover:bg-blue-600"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Study Insights Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>Study Insights</span>
          <Sparkles className="w-4 h-4 text-blue-600" />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigate('revision')}
            className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 cursor-pointer hover:bg-amber-50 transition-colors flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Revision Queue
              </h4>
              <p className="text-xs font-semibold text-amber-900 mt-1">
                You have 3 topics waiting for revision.
              </p>
              <span className="text-[11px] text-amber-700 font-medium mt-2 inline-block">
                Open Revision Center →
              </span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('quizzes')}
            className="p-4 sm:p-5 rounded-2xl bg-purple-50/70 border border-purple-200/80 cursor-pointer hover:bg-purple-50 transition-colors flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                Performance Trend
              </h4>
              <p className="text-xs font-semibold text-purple-900 mt-1">
                Your quiz performance improved this week.
              </p>
              <span className="text-[11px] text-purple-700 font-medium mt-2 inline-block">
                See Quiz Analytics →
              </span>
            </div>
          </div>

          <div
            onClick={() => {
              const matricesMat = materials.find((m) => m.id === 'mat-math-matrices') || materials[0];
              onOpenWorkspace(matricesMat, 'revision');
            }}
            className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 cursor-pointer hover:bg-blue-50 transition-colors flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                Daily Focus
              </h4>
              <p className="text-xs font-semibold text-blue-900 mt-1">
                Consider revising Matrices today.
              </p>
              <span className="text-[11px] text-blue-700 font-medium mt-2 inline-block">
                Start Matrices Review →
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
