import React, { useState } from 'react';
import {
  Users,
  Award,
  TrendingUp,
  Clock,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Flame,
  ChevronRight,
  GraduationCap,
  MessageSquare,
  BarChart3,
  Heart,
  HelpCircle,
  FileText,
} from 'lucide-react';
import {
  MOCK_PARENT_CHILD_OVERVIEW,
  MOCK_CHILD_SUBJECTS_PROGRESS,
  MOCK_CHILD_QUIZ_REPORTS,
  MOCK_PARENT_RECOMMENDATIONS,
  MOCK_PARENT_PROFILE,
} from '../../data/portalMockData';
import { useToast } from '../common/Toast';

type ParentSubTab =
  | 'overview'
  | 'progress'
  | 'quizzes'
  | 'activity'
  | 'weak_topics'
  | 'revision';

interface ParentPortalViewProps {
  initialTab?: ParentSubTab;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  initialTab = 'overview',
}) => {
  const { success, info } = useToast();
  const [activeTab, setActiveTab] = useState<ParentSubTab>(initialTab);

  const child = MOCK_PARENT_CHILD_OVERVIEW;

  return (
    <div className="space-y-6 pb-12">
      {/* Parent Portal Banner */}
      <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-slate-50 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                  Parent & Guardian Portal
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Monitoring Student: <strong>{child.name}</strong>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Welcome, {MOCK_PARENT_PROFILE.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Track Alex&apos;s daily learning habits, test scores, and discover personalized ways to support revision at home.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                success('Encouragement Sent!', 'A supportive motivational note was sent to Alex’s dashboard.');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Send Encouragement
            </button>
            <button
              onClick={() => {
                info('Advisor Contact', `Direct inquiry message opened for ${child.advisor}.`);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold shadow-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Contact Faculty
            </button>
          </div>
        </div>

        {/* Child Highlights Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-amber-200/60">
          <div className="bg-white/90 rounded-xl p-3 border border-amber-100 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Study Streak
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold text-amber-700">{child.streakDays} Days</span>
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            </div>
          </div>

          <div className="bg-white/90 rounded-xl p-3 border border-amber-100 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Current Cumulative GPA
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold text-slate-900">{child.currentGpa}</span>
              <span className="text-[11px] text-emerald-600 font-semibold">Top 10%</span>
            </div>
          </div>

          <div className="bg-white/90 rounded-xl p-3 border border-amber-100 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Weekly Study Hours
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold text-slate-900">{child.weeklyStudyHours} hrs</span>
              <span className="text-[11px] text-emerald-600 font-semibold">+3.2h vs avg</span>
            </div>
          </div>

          <div className="bg-white/90 rounded-xl p-3 border border-amber-100 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Class Attendance
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold text-slate-900">{child.attendancePercentage}%</span>
              <span className="text-[11px] text-emerald-600 font-semibold">Excellent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        {[
          { id: 'overview', label: 'Student Overview', icon: GraduationCap },
          { id: 'progress', label: 'Learning Progress', icon: BarChart3 },
          { id: 'quizzes', label: 'Quiz Performance', icon: Award },
          { id: 'activity', label: 'Study Activity', icon: Clock },
          { id: 'weak_topics', label: 'Weak Topics', icon: AlertTriangle, count: 2, badgeColor: 'bg-amber-100 text-amber-800' },
          { id: 'revision', label: 'Recommended Revision', icon: Sparkles, count: 3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ParentSubTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : tab.badgeColor || 'bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 1. STUDENT OVERVIEW */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Profile Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="text-center pb-4 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl mx-auto mb-2 shadow-xs">
                  AC
                </div>
                <h3 className="text-base font-bold text-slate-900">{child.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{child.program}</p>
                <p className="text-xs text-slate-600 font-semibold">{child.institution}</p>
              </div>

              <div className="space-y-2.5 mt-4 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Current Standing:</span>
                  <span className="font-bold text-slate-900">{child.semester}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Faculty Advisor:</span>
                  <span className="font-semibold text-slate-800">{child.advisor}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Overall Concept Mastery:</span>
                  <span className="font-bold text-emerald-600">{child.overallMasteryPercentage}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Active Study Habit:</span>
                  <span className="font-semibold text-amber-700">Consistent (Daily)</span>
                </div>
              </div>
            </div>

            {/* Subject Snapshot */}
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Current Enrolled Courses</h3>
                <button
                  onClick={() => setActiveTab('progress')}
                  className="text-xs font-bold text-amber-800 hover:underline"
                >
                  View Course Details →
                </button>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {MOCK_CHILD_SUBJECTS_PROGRESS.map((sub) => (
                  <div key={sub.courseCode} className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {sub.courseCode}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{sub.subject}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          sub.status === 'ahead'
                            ? 'bg-emerald-50 text-emerald-700'
                            : sub.status === 'on_track'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {sub.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{ width: `${sub.syllabusCovered}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        {sub.syllabusCovered}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>Quiz Avg: <strong className="text-slate-800">{sub.quizAverage}%</strong></span>
                      <span>Next milestone: {sub.nextAssignmentDue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Home Support Card */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Parent Guidance Insight
                </h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  Alex is maintaining an excellent 6-day study streak and demonstrates strong mastery in C++ and Data Structures. We recommend a supportive check-in regarding <strong>Engineering Mathematics (Eigenvalues)</strong> before their upcoming review on Friday.
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => setActiveTab('revision')}
                    className="text-xs font-bold text-amber-800 underline hover:text-amber-900"
                  >
                    Read Recommended Revision Steps →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. LEARNING PROGRESS */}
      {/* ======================================================== */}
      {activeTab === 'progress' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Syllabus & Learning Pace</h2>
            <p className="text-xs text-slate-500">Comprehensive course breakdown and milestone targets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_CHILD_SUBJECTS_PROGRESS.map((sub) => (
              <div
                key={sub.courseCode}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {sub.courseCode}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{sub.syllabusCovered}% Completed</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2">{sub.subject}</h3>

                <div className="w-full h-2 rounded-full bg-slate-100 mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${sub.syllabusCovered}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Quiz Accuracy
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{sub.quizAverage}%</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Standing
                    </span>
                    <p className="text-xs font-bold text-emerald-700 capitalize mt-0.5">
                      {sub.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                  <span>Upcoming:</span>
                  <strong className="text-slate-900">{sub.nextAssignmentDue}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. QUIZ PERFORMANCE */}
      {/* ======================================================== */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Quiz & Diagnostic Reports</h2>
            <p className="text-xs text-slate-500">
              Exam scores compared against cohort averages and mastery criteria
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Quiz Title & Subject</th>
                    <th className="py-3 px-3">Alex&apos;s Score</th>
                    <th className="py-3 px-3">Percentage</th>
                    <th className="py-3 px-3">Class Average</th>
                    <th className="py-3 px-3">Completed On</th>
                    <th className="py-3 px-4 text-right">Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_CHILD_QUIZ_REPORTS.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{q.quizTitle}</div>
                        <div className="text-[11px] text-slate-500">{q.subject}</div>
                      </td>

                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        {q.score} / {q.totalQuestions}
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`font-bold text-xs px-2 py-0.5 rounded ${
                            q.percentage >= 85
                              ? 'bg-emerald-50 text-emerald-700'
                              : q.percentage >= 70
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {q.percentage}%
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-slate-600 font-medium">{q.classAverage}%</td>

                      <td className="py-3.5 px-3 text-slate-500">{q.completedDate}</td>

                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            q.status === 'excellent'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : q.status === 'good'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {q.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. STUDY ACTIVITY */}
      {/* ======================================================== */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Alex&apos;s Recent Study Sessions</h2>
            <p className="text-xs text-slate-500">Timeline of study engagement, practice quizzes, and flashcard repetitions</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="divide-y divide-slate-100">
              {[
                {
                  id: 'act-1',
                  time: 'Today, 09:12 AM',
                  activity: 'Active Recall Practice',
                  detail: 'Completed 10 questions on Arrays & Memory Layout (Score: 90%)',
                  duration: '25 mins',
                },
                {
                  id: 'act-2',
                  time: 'Yesterday, 04:30 PM',
                  activity: 'Study Guide Reading',
                  detail: 'Read Detailed Summary on Matrix Characteristic Equations',
                  duration: '45 mins',
                },
                {
                  id: 'act-3',
                  time: '2 days ago',
                  activity: 'Spaced Flashcards Review',
                  detail: 'Revisited 12 flashcards on C++ Pointer Arithmetic',
                  duration: '18 mins',
                },
                {
                  id: 'act-4',
                  time: '3 days ago',
                  activity: 'Concept Map Exploration',
                  detail: 'Interacted with the Digital Logic Gates connection graph',
                  duration: '30 mins',
                },
              ].map((item) => (
                <div key={item.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{item.activity}</span>
                        <span className="text-[10px] text-slate-400">• {item.duration}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. WEAK TOPICS */}
      {/* ======================================================== */}
      {activeTab === 'weak_topics' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Identified Areas for Additional Support</h2>
            <p className="text-xs text-slate-500">
              Specific academic concepts where Alex encountered difficulty in recent quizzes
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    MATH102
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">Eigenvalues & Characteristic Equations</h3>
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                  Last Score: 60%
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Alex struggled with calculating the determinant of (A - λI) for 3x3 matrices. The concept is scheduled in their StudyLens revision center for another attempt today.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Target Resolution: Practice test on Friday</span>
                <button
                  onClick={() =>
                    info('Reminder Set', 'Alex will be notified to review Eigenvalues before Friday.')
                  }
                  className="font-bold text-amber-800 hover:underline"
                >
                  Remind Alex to Practice →
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    EE204
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">Universal Logic Gate Realizations</h3>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Last Score: 70%
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Alex marked 2 flashcards as needing review regarding NAND-to-OR equivalent gate arrangements. Lab 4 (ALU simulation) requires this concept on September 18th.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Target Resolution: Lab assignment prep</span>
                <button
                  onClick={() =>
                    info('Study Tip Sent', 'Encouraged Alex to look over the Gate Conversion chart.')
                  }
                  className="font-bold text-amber-800 hover:underline"
                >
                  Send Encouragement →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. RECOMMENDED REVISION */}
      {/* ======================================================== */}
      {activeTab === 'revision' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recommended Home Guidance & Action Plan</h2>
            <p className="text-xs text-slate-500">
              Tailored suggestions from professors and AI diagnostics for constructive academic support
            </p>
          </div>

          <div className="space-y-3">
            {MOCK_PARENT_RECOMMENDATIONS.map((rec) => (
              <div
                key={rec.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{rec.topic}</span>
                    <span className="text-[11px] text-slate-500 font-medium">({rec.subject})</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      rec.priority === 'high'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : rec.priority === 'medium'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {rec.priority} priority
                  </span>
                </div>

                <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <strong className="text-slate-900">Academic Context: </strong>
                  {rec.reason}
                </div>

                <div className="mt-3 bg-amber-50/70 p-3 rounded-xl border border-amber-100 text-xs text-amber-900 font-medium flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Home Action: </strong>
                    {rec.actionAdvice}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
