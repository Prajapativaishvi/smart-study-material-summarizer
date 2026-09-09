import React, { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  Plus,
  Flame,
  Check,
  Calendar,
  Layers,
} from 'lucide-react';
import { UserProfile, StudyMaterial, PortalRole } from '../../types';
import { RoleSwitcher } from '../common/RoleSwitcher';
import {
  MOCK_TEACHER_PROFILE,
  MOCK_ADMIN_PROFILE,
  MOCK_PARENT_PROFILE,
} from '../../data/portalMockData';

interface TopBarProps {
  userProfile?: UserProfile;
  materials?: StudyMaterial[];
  currentRole?: PortalRole;
  onSelectRole?: (role: PortalRole) => void;
  onOpenMobileNav?: () => void;
  onOpenAddModal: () => void;
  onSelectMaterial: (material: StudyMaterial) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigate?: (page: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  userProfile,
  materials = [],
  currentRole = 'student',
  onSelectRole,
  onOpenMobileNav,
  onOpenAddModal,
  onSelectMaterial,
  searchQuery,
  setSearchQuery,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Active role profile
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

  const avatarBgColor =
    currentRole === 'teacher'
      ? 'bg-emerald-700 text-white'
      : currentRole === 'admin'
      ? 'bg-violet-700 text-white'
      : currentRole === 'parent'
      ? 'bg-amber-600 text-white'
      : 'bg-slate-900 text-white';

  const streakDays = userProfile?.streakDays ?? 6;
  const safeMaterials = materials || [];

  const filteredMaterials = searchQuery.trim()
    ? safeMaterials.filter(
        (m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.topic.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const notifications = [
    {
      id: 'notif-1',
      title: 'Matrices revision due',
      desc: 'Scheduled spaced-repetition review for Eigenvalues is waiting.',
      time: '1h ago',
      unread: true,
      icon: Calendar,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'notif-2',
      title: 'Quiz score high',
      desc: 'You scored 9/10 in C++ Functions practice quiz!',
      time: '3h ago',
      unread: true,
      icon: Check,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'notif-3',
      title: '12 new flashcards indexed',
      desc: 'Data Structures — Arrays flashcards are ready for review.',
      time: 'Yesterday',
      unread: false,
      icon: Layers,
      color: 'text-blue-600 bg-blue-50',
    },
  ];

  return (
    <header
      id="app-topbar"
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6"
    >
      {/* Left side: Hamburger on mobile + Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          id="mobile-nav-toggle"
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar with live autocomplete */}
        <div className="relative w-full">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 w-4 h-4 text-slate-400" />
            <input
              id="topbar-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              placeholder={
                currentRole === 'teacher'
                  ? 'Search student rosters, quizzes, materials...'
                  : currentRole === 'admin'
                  ? 'Search faculty, departments, audits...'
                  : currentRole === 'parent'
                  ? 'Search Alex’s assignments, test scores...'
                  : 'Search study materials, concepts, topics...'
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchDropdown && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 max-h-72 overflow-y-auto">
              {filteredMaterials.length > 0 ? (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase px-2 py-1">
                    Matching Materials ({filteredMaterials.length})
                  </div>
                  {filteredMaterials.map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => {
                        onSelectMaterial(mat);
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2 hover:bg-blue-50/60 rounded-lg flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">
                          {mat.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {mat.subject} • {mat.pagesCount} pages
                        </div>
                      </div>
                      <span className="text-xs font-medium text-blue-600 group-hover:translate-x-0.5 transition-transform">
                        Open Workspace →
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  No materials found matching &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right side items: Role Switcher, Streak, Add button, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-3 sm:ml-4">
        {/* Role Switcher in TopBar */}
        {onSelectRole && (
          <RoleSwitcher
            currentRole={currentRole}
            onSelectRole={onSelectRole}
            variant="topbar"
          />
        )}

        {/* Daily Study Streak Badge (Student Mode) */}
        {currentRole === 'student' && (
          <div
            title={`${streakDays}-day study streak!`}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            <span>{streakDays} days</span>
          </div>
        )}

        {/* Quick Add Button (Student Mode) */}
        {currentRole === 'student' && (
          <button
            id="topbar-add-material-btn"
            onClick={onOpenAddModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Material</span>
          </button>
        )}

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            id="notifications-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Notifications
                </span>
                <span className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>

              <div className="divide-y divide-slate-100 mt-1 max-h-72 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors flex gap-3 cursor-pointer"
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${n.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${avatarBgColor}`}
            title={`${displayName} (${currentRole})`}
          >
            {displayInitials}
          </div>
        </div>
      </div>
    </header>
  );
};

