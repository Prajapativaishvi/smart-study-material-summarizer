import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Users,
  ChevronDown,
  Check,
  Sparkles,
} from 'lucide-react';
import { PortalRole } from '../../types';

interface RoleSwitcherProps {
  currentRole: PortalRole;
  onSelectRole: (role: PortalRole) => void;
  className?: string;
  variant?: 'topbar' | 'compact' | 'sidebar';
}

interface RoleOption {
  id: PortalRole;
  label: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  themeColor: {
    badgeBg: string;
    badgeText: string;
    iconColor: string;
    border: string;
  };
}

export const ROLE_CONFIGS: Record<PortalRole, RoleOption> = {
  student: {
    id: 'student',
    label: 'Student Portal',
    subtitle: 'Active recall, materials, flashcards & quizzes',
    badge: 'Student',
    icon: GraduationCap,
    themeColor: {
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-700',
      iconColor: 'text-blue-600',
      border: 'border-blue-200',
    },
  },
  teacher: {
    id: 'teacher',
    label: 'Teacher Portal',
    subtitle: 'Course analytics, assignments & class quizzes',
    badge: 'Faculty',
    icon: BookOpen,
    themeColor: {
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      iconColor: 'text-emerald-600',
      border: 'border-emerald-200',
    },
  },
  admin: {
    id: 'admin',
    label: 'Admin Portal',
    subtitle: 'Institution metrics, faculty, courses & audits',
    badge: 'Administrator',
    icon: ShieldCheck,
    themeColor: {
      badgeBg: 'bg-violet-50',
      badgeText: 'text-violet-700',
      iconColor: 'text-violet-600',
      border: 'border-violet-200',
    },
  },
  parent: {
    id: 'parent',
    label: 'Parent Portal',
    subtitle: 'Child progress, quiz scores & weak areas',
    badge: 'Parent',
    icon: Users,
    themeColor: {
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-800',
      iconColor: 'text-amber-600',
      border: 'border-amber-200',
    },
  },
};

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  onSelectRole,
  className = '',
  variant = 'topbar',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeConfig = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.student;
  const ActiveIcon = activeConfig.icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (role: PortalRole) => {
    onSelectRole(role);
    setIsOpen(false);
  };

  const rolesList: PortalRole[] = ['student', 'teacher', 'admin', 'parent'];

  if (variant === 'sidebar') {
    return (
      <div ref={dropdownRef} className={`relative w-full ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-left"
          aria-label="Switch active portal"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${activeConfig.themeColor.badgeBg} ${activeConfig.themeColor.iconColor}`}
            >
              <ActiveIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate">
                {activeConfig.label}
              </span>
              <span className="text-[10px] text-slate-500 truncate">Click to switch portal</span>
            </div>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-full min-w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 divide-y divide-slate-100">
            <div className="px-2.5 py-1.5 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Select StudyLens Portal
              </span>
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="pt-1 space-y-1">
              {rolesList.map((roleKey) => {
                const config = ROLE_CONFIGS[roleKey];
                const Icon = config.icon;
                const isCurrent = currentRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => handleSelect(roleKey)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                      isCurrent
                        ? `${config.themeColor.badgeBg} ${config.themeColor.border} border`
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${config.themeColor.badgeBg} ${config.themeColor.iconColor}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-slate-900">
                          {config.label}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate">
                          {config.subtitle}
                        </span>
                      </div>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Active Role Selector Pill */}
      <button
        id="portal-role-switcher-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-150 ${activeConfig.themeColor.border} ${activeConfig.themeColor.badgeBg} hover:shadow-xs focus:outline-none`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${activeConfig.themeColor.iconColor}`}
        >
          <ActiveIcon className="w-3.5 h-3.5" />
        </div>
        <span
          className={`text-xs font-bold tracking-tight ${activeConfig.themeColor.badgeText} whitespace-nowrap`}
        >
          {activeConfig.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 ${activeConfig.themeColor.iconColor} transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Role Dropdown Menu */}
      {isOpen && (
        <div
          id="portal-role-dropdown"
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Switch Workspace Portal</p>
              <p className="text-[11px] text-slate-500">
                Experience StudyLens from different academic perspectives
              </p>
            </div>
            <div className="p-1 rounded-md bg-blue-50 text-blue-600">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="mt-1 space-y-1">
            {rolesList.map((roleKey) => {
              const config = ROLE_CONFIGS[roleKey];
              const Icon = config.icon;
              const isCurrent = currentRole === roleKey;

              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => handleSelect(roleKey)}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-all text-left ${
                    isCurrent
                      ? `${config.themeColor.badgeBg} border ${config.themeColor.border}`
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${config.themeColor.badgeBg} ${config.themeColor.iconColor}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {config.label}
                      </span>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-white/80 px-2 py-0.5 rounded-full border border-blue-200">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      {config.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 px-3 py-1 bg-slate-50/70 rounded-xl">
            <p className="text-[10px] text-slate-500 leading-tight">
              💡 <strong>All portals share synchronized mock data.</strong> You can switch back to
              the Student Portal at any moment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
