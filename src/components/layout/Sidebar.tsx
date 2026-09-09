import React from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Layers,
  HelpCircle,
  Network,
  RotateCcw,
  History,
  Settings,
  Plus,
  Compass,
  BookOpen,
  FileText,
  Award,
  AlertTriangle,
  BarChart3,
  Clock,
  ShieldCheck,
  GraduationCap,
  Building2,
  Activity,
  Heart,
  Sparkles,
  Upload,
} from 'lucide-react';
import { ActivePage, UserProfile, PortalRole } from '../../types';
import { StudyLensLogo } from '../common/StudyLensLogo';
import { RoleSwitcher } from '../common/RoleSwitcher';
import {
  MOCK_TEACHER_PROFILE,
  MOCK_ADMIN_PROFILE,
  MOCK_PARENT_PROFILE,
} from '../../data/portalMockData';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenAddModal: () => void;
  userProfile?: UserProfile;
  currentRole?: PortalRole;
  onSelectRole?: (role: PortalRole) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  onOpenAddModal,
  userProfile,
  currentRole = 'student',
  onSelectRole,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  // Determine profile details based on active role
  const activeProfile =
    currentRole === 'teacher'
      ? MOCK_TEACHER_PROFILE
      : currentRole === 'admin'
      ? MOCK_ADMIN_PROFILE
      : currentRole === 'parent'
      ? MOCK_PARENT_PROFILE
      : userProfile || {
          name: 'Alex Chen',
          major: 'Computer Science',
          semester: 'Semester 4',
        };

  const displayName = activeProfile.name || 'Alex Chen';
  const displayInitials =
    displayName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'AC';

  const displaySubtitle =
    currentRole === 'teacher'
      ? 'Faculty • CSE Dept'
      : currentRole === 'admin'
      ? 'System Administrator'
      : currentRole === 'parent'
      ? 'Parent of Alex Chen'
      : `${activeProfile.major ? activeProfile.major.split(' ')[0] : 'Engineering'} • ${
          activeProfile.semester || 'Semester 4'
        }`;

  // Role Badge config
  const roleBadgeConfig = {
    student: { text: 'Student', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    teacher: { text: 'Teacher Portal', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    admin: { text: 'Admin Portal', bg: 'bg-violet-50 text-violet-800 border-violet-200' },
    parent: { text: 'Parent Portal', bg: 'bg-amber-50 text-amber-900 border-amber-200' },
  }[currentRole];

  // Navigation Items per role
  const getNavItems = () => {
    switch (currentRole) {
      case 'teacher':
        return [
          { id: 'teacher_overview' as ActivePage, label: 'Teacher Overview', icon: BookOpen },
          { id: 'teacher_materials' as ActivePage, label: 'Manage Materials', icon: FileText },
          { id: 'teacher_quizzes' as ActivePage, label: 'Quizzes & Tests', icon: HelpCircle },
          { id: 'teacher_assignments' as ActivePage, label: 'Assignments', icon: Layers },
          { id: 'teacher_performance' as ActivePage, label: 'Student Performance', icon: Award },
          { id: 'teacher_weak_topics' as ActivePage, label: 'Weak Topic Analysis', icon: AlertTriangle, badge: '4' },
          { id: 'teacher_progress' as ActivePage, label: 'Course Progress', icon: BarChart3 },
          { id: 'teacher_activity' as ActivePage, label: 'Student Activity', icon: Clock },
        ];
      case 'admin':
        return [
          { id: 'admin_overview' as ActivePage, label: 'Admin Overview', icon: ShieldCheck },
          { id: 'admin_stats' as ActivePage, label: 'Platform Statistics', icon: BarChart3 },
          { id: 'admin_students' as ActivePage, label: 'Student Management', icon: GraduationCap },
          { id: 'admin_teachers' as ActivePage, label: 'Teacher Management', icon: BookOpen },
          { id: 'admin_courses' as ActivePage, label: 'Course Management', icon: Building2 },
          { id: 'admin_materials' as ActivePage, label: 'Study Materials', icon: FolderOpen },
          { id: 'admin_activity' as ActivePage, label: 'User Activity Log', icon: Clock },
          { id: 'admin_analytics' as ActivePage, label: 'Institution Analytics', icon: Activity },
        ];
      case 'parent':
        return [
          { id: 'parent_overview' as ActivePage, label: 'Student Overview', icon: GraduationCap },
          { id: 'parent_progress' as ActivePage, label: 'Learning Progress', icon: BarChart3 },
          { id: 'parent_quizzes' as ActivePage, label: 'Quiz Performance', icon: Award },
          { id: 'parent_activity' as ActivePage, label: 'Study Activity', icon: Clock },
          { id: 'parent_weak_topics' as ActivePage, label: 'Weak Topics', icon: AlertTriangle, badge: '2' },
          { id: 'parent_revision' as ActivePage, label: 'Recommended Revision', icon: Sparkles, badge: '3' },
        ];
      case 'student':
      default:
        return [
          { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: LayoutDashboard },
          { id: 'materials' as ActivePage, label: 'My Materials', icon: FolderOpen },
          { id: 'flashcards' as ActivePage, label: 'Flashcards', icon: Layers },
          { id: 'quizzes' as ActivePage, label: 'Quizzes', icon: HelpCircle },
          { id: 'concept_maps' as ActivePage, label: 'Concept Maps', icon: Network },
          { id: 'revision' as ActivePage, label: 'Revision Center', icon: RotateCcw, badge: '3' },
          { id: 'history' as ActivePage, label: 'Study History', icon: History },
        ];
    }
  };

  const navItems = getNavItems();

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="sidebar-navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:inset-auto lg:translate-x-0 shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-slate-100">
          <button
            onClick={() => {
              if (currentRole === 'teacher') handleNavClick('teacher_overview');
              else if (currentRole === 'admin') handleNavClick('admin_overview');
              else if (currentRole === 'parent') handleNavClick('parent_overview');
              else handleNavClick('dashboard');
            }}
            className="flex items-center gap-2 text-left hover:opacity-90 transition-opacity"
          >
            <StudyLensLogo size="sm" />
          </button>

          {/* Role Badge Indicator */}
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadgeConfig.bg} whitespace-nowrap`}
          >
            {roleBadgeConfig.text}
          </span>
        </div>

        {/* Quick Action Button */}
        <div className="p-3 pb-2">
          {currentRole === 'teacher' ? (
            <button
              onClick={() => handleNavClick('teacher_materials')}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-xs shadow-emerald-500/20 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Upload Class Material</span>
            </button>
          ) : currentRole === 'admin' ? (
            <button
              onClick={() => handleNavClick('admin_students')}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-violet-700 hover:bg-violet-800 active:bg-violet-900 text-white text-xs font-bold shadow-xs shadow-violet-500/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Enroll New Student</span>
            </button>
          ) : currentRole === 'parent' ? (
            <button
              onClick={() => handleNavClick('parent_revision')}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold shadow-xs shadow-amber-500/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Recommended Revision</span>
            </button>
          ) : (
            <button
              id="sidebar-add-material-btn"
              onClick={onOpenAddModal}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-xs shadow-blue-500/20 transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Study Material</span>
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            {currentRole === 'teacher'
              ? 'Instructor Modules'
              : currentRole === 'admin'
              ? 'Administration Hub'
              : currentRole === 'parent'
              ? 'Parent Monitoring'
              : 'Workspace'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? currentRole === 'teacher'
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-2xs'
                      : currentRole === 'admin'
                      ? 'bg-violet-50 text-violet-800 font-bold border border-violet-200/80 shadow-2xs'
                      : currentRole === 'parent'
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200/80 shadow-2xs'
                      : 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? currentRole === 'teacher'
                          ? 'text-emerald-600'
                          : currentRole === 'admin'
                          ? 'text-violet-600'
                          : currentRole === 'parent'
                          ? 'text-amber-600'
                          : 'text-blue-600'
                        : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Platform Links
          </div>

          <button
            id="sidebar-landing-preview"
            onClick={() => handleNavClick('landing')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            <span>Landing Page</span>
            <span className="ml-auto text-[10px] uppercase font-bold tracking-wide bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
              Web
            </span>
          </button>
        </nav>

        {/* Bottom Section with Role Switcher & Profile */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {/* Quick Portal Switcher in Sidebar */}
          {onSelectRole && (
            <div className="pb-1">
              <RoleSwitcher
                currentRole={currentRole}
                onSelectRole={onSelectRole}
                variant="sidebar"
              />
            </div>
          )}

          <button
            id="sidebar-nav-settings"
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activePage === 'settings'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings & Preferences</span>
          </button>

          {/* Active User Profile Card */}
          <div
            onClick={() => handleNavClick('settings')}
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                currentRole === 'teacher'
                  ? 'bg-emerald-100 text-emerald-800'
                  : currentRole === 'admin'
                  ? 'bg-violet-100 text-violet-800'
                  : currentRole === 'parent'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {displayInitials}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 truncate">
                {displayName}
              </span>
              <span className="text-[11px] text-slate-500 truncate">
                {displaySubtitle}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

