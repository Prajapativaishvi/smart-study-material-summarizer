import React, { useState } from 'react';
import { UserProfile } from '../../types';
import {
  User,
  Sliders,
  Bell,
  BookOpen,
  Save,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface SettingsViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userProfile,
  onUpdateProfile,
  onResetDemoData,
}) => {
  const { success } = useToast();
  const [profile, setProfile] = useState<UserProfile>(
    userProfile || {
      name: 'Alex Chen',
      email: 'alex.chen@university.edu',
      university: 'State Institute of Technology',
      major: 'Computer Science & Engineering',
      semester: 'Semester 4',
      materialsCount: 12,
      topicsCompleted: 28,
      quizAccuracy: 84,
      revisionProgress: 72,
      streakDays: 6,
    }
  );
  const [defaultDepth, setDefaultDepth] = useState<'short' | 'balanced' | 'detailed'>('balanced');
  const [dailyReminders, setDailyReminders] = useState(true);
  const [spacedAlerts, setSpacedAlerts] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [autoFlipCards, setAutoFlipCards] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profile);
    success('Settings Saved', 'Your study profile and preferences have been updated.');
  };

  return (
    <div id="settings-view" className="space-y-8 max-w-4xl mx-auto pb-10">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your academic profile, study defaults, and spaced repetition preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Student Profile Section */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Student Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                University / Institution
              </label>
              <input
                type="text"
                value={profile.university}
                onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Major / Field of Study
              </label>
              <input
                type="text"
                value={profile.major}
                onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Semester
              </label>
              <input
                type="text"
                value={profile.semester}
                onChange={(e) => setProfile({ ...profile, semester: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* 2. Study Preferences Section */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              Study Preferences
            </h2>
          </div>

          <div className="space-y-4 text-xs text-slate-700">
            <div>
              <label className="block font-semibold mb-1">
                Default Smart Summary Depth
              </label>
              <div className="flex gap-2">
                {(['short', 'balanced', 'detailed'] as const).map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDefaultDepth(d)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold capitalize transition-all cursor-pointer ${
                      defaultDepth === d
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-semibold text-slate-900">Auto-flip flashcards on arrow key</p>
                <p className="text-slate-400">Automatically flip to question when advancing cards</p>
              </div>
              <input
                type="checkbox"
                checked={autoFlipCards}
                onChange={(e) => setAutoFlipCards(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Notifications Section */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              Notifications & Spaced Prompts
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Daily Study Streak Reminder</p>
                <p className="text-slate-400">Receive an alert when daily study goal is pending</p>
              </div>
              <input
                type="checkbox"
                checked={dailyReminders}
                onChange={(e) => setDailyReminders(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="font-semibold text-slate-900">Spaced Repetition Decay Alerts</p>
                <p className="text-slate-400">Notify when topics reach critical retention window</p>
              </div>
              <input
                type="checkbox"
                checked={spacedAlerts}
                onChange={(e) => setSpacedAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={onResetDemoData}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Defaults</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
