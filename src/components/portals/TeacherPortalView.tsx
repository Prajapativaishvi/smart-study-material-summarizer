import React, { useState } from 'react';
import {
  BookOpen,
  Upload,
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  TrendingUp,
  HelpCircle,
  Eye,
  Download,
  Award,
  ChevronRight,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  SlidersHorizontal,
} from 'lucide-react';
import {
  MOCK_TEACHER_PROFILE,
  MOCK_TEACHER_COURSES,
  MOCK_TEACHER_MATERIALS,
  MOCK_TEACHER_QUIZZES,
  MOCK_TEACHER_ASSIGNMENTS,
  MOCK_STUDENT_PERFORMANCE,
  MOCK_WEAK_TOPIC_ANALYSIS,
  MOCK_STUDENT_ACTIVITY_LOGS,
} from '../../data/portalMockData';
import {
  TeacherMaterial,
  TeacherQuiz,
  TeacherAssignment,
} from '../../types';
import { useToast } from '../common/Toast';

type TeacherSubTab =
  | 'overview'
  | 'upload'
  | 'materials'
  | 'quizzes'
  | 'assignments'
  | 'performance'
  | 'weak_topics'
  | 'progress'
  | 'activity';

interface TeacherPortalViewProps {
  initialTab?: TeacherSubTab;
}

export const TeacherPortalView: React.FC<TeacherPortalViewProps> = ({
  initialTab = 'overview',
}) => {
  const { success, info } = useToast();
  const [activeTab, setActiveTab] = useState<TeacherSubTab>(initialTab);

  // Materials state
  const [materials, setMaterials] = useState<TeacherMaterial[]>(MOCK_TEACHER_MATERIALS);
  const [materialFilterCourse, setMaterialFilterCourse] = useState<string>('all');
  const [materialSearch, setMaterialSearch] = useState<string>('');

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('Data Structures');
  const [uploadCourseCode, setUploadCourseCode] = useState('CS201');
  const [uploadTopic, setUploadTopic] = useState('');
  const [uploadVisibility, setUploadVisibility] = useState<'class_only' | 'public' | 'hidden'>('class_only');
  const [uploadContent, setUploadContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Quizzes & Assignments state
  const [quizzes, setQuizzes] = useState<TeacherQuiz[]>(MOCK_TEACHER_QUIZZES);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>(MOCK_TEACHER_ASSIGNMENTS);
  const [showNewQuizModal, setShowNewQuizModal] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizCourse, setNewQuizCourse] = useState('CS201');
  const [newQuizQuestionsCount, setNewQuizQuestionsCount] = useState(10);

  // Student Performance Search
  const [studentSearch, setStudentSearch] = useState('');

  // Handlers
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      const newMat: TeacherMaterial = {
        id: `tm-${Date.now()}`,
        title: uploadTitle.trim(),
        subject: uploadSubject,
        courseCode: uploadCourseCode,
        topic: uploadTopic.trim() || 'General Coursework',
        uploadedAt: 'Just now',
        viewsCount: 0,
        downloadsCount: 0,
        status: 'published',
        visibility: uploadVisibility,
        fileFormat: 'PDF',
        fileSize: '2.4 MB',
      };
      setMaterials([newMat, ...materials]);
      setIsUploading(false);
      setUploadTitle('');
      setUploadTopic('');
      setUploadContent('');
      setActiveTab('materials');
      success('Material Published!', `"${newMat.title}" is now available to ${newMat.courseCode} students.`);
    }, 800);
  };

  const handleToggleMaterialVisibility = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextVis =
            m.visibility === 'class_only'
              ? 'public'
              : m.visibility === 'public'
              ? 'hidden'
              : 'class_only';
          info('Visibility Updated', `Visibility changed to ${nextVis.replace('_', ' ')}.`);
          return { ...m, visibility: nextVis };
        }
        return m;
      })
    );
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitle.trim()) return;

    const newQ: TeacherQuiz = {
      id: `tq-${Date.now()}`,
      title: newQuizTitle.trim(),
      courseCode: newQuizCourse,
      questionsCount: newQuizQuestionsCount,
      participantsCount: 0,
      totalStudents: 64,
      avgScore: 0,
      passRate: 0,
      dueDate: 'Sep 25, 2026',
      status: 'active',
    };

    setQuizzes([newQ, ...quizzes]);
    setShowNewQuizModal(false);
    setNewQuizTitle('');
    success('Quiz Created', `New quiz "${newQ.title}" assigned to course.`);
  };

  // Filtered materials
  const filteredMaterials = materials.filter((m) => {
    const matchesCourse =
      materialFilterCourse === 'all' || m.courseCode === materialFilterCourse;
    const matchesSearch =
      m.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.subject.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.topic.toLowerCase().includes(materialSearch.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  // Filtered students
  const filteredStudents = MOCK_STUDENT_PERFORMANCE.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.primaryWeakArea.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Teacher Portal Banner */}
      <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-slate-50 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              EV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  Teacher Portal
                </span>
                <span className="text-xs text-slate-500 font-medium">Faculty of Engineering</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Welcome back, {MOCK_TEACHER_PROFILE.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Manage your coursework, monitor active recall progress, and target student conceptual weaknesses.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('upload')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Material
            </button>
            <button
              onClick={() => {
                setActiveTab('quizzes');
                setShowNewQuizModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Quiz
            </button>
          </div>
        </div>

        {/* Quick Teacher Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-emerald-200/60">
          <div className="bg-white/80 rounded-xl p-3 border border-emerald-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-slate-900">254</span>
              <span className="text-[11px] text-emerald-600 font-semibold">4 Courses</span>
            </div>
          </div>

          <div className="bg-white/80 rounded-xl p-3 border border-emerald-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Avg. Class Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-slate-900">78.4%</span>
              <span className="text-[11px] text-emerald-600 font-semibold">+3.2% vs last term</span>
            </div>
          </div>

          <div className="bg-white/80 rounded-xl p-3 border border-emerald-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Active Materials
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-slate-900">{materials.length}</span>
              <span className="text-[11px] text-slate-500 font-medium">964 Total Views</span>
            </div>
          </div>

          <div className="bg-white/80 rounded-xl p-3 border border-emerald-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Weak Topics Flagged
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-amber-600">4</span>
              <span className="text-[11px] text-amber-700 font-semibold">Requires Recitation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        {[
          { id: 'overview', label: 'Teacher Overview', icon: BookOpen },
          { id: 'upload', label: 'Upload Material', icon: Upload },
          { id: 'materials', label: 'Manage Materials', icon: FileText, count: materials.length },
          { id: 'quizzes', label: 'Quizzes & Tests', icon: HelpCircle, count: quizzes.length },
          { id: 'assignments', label: 'Assignments', icon: Layers, count: assignments.length },
          { id: 'performance', label: 'Student Performance', icon: Award },
          { id: 'weak_topics', label: 'Weak Topic Analysis', icon: AlertTriangle, count: MOCK_WEAK_TOPIC_ANALYSIS.length, badgeColor: 'bg-amber-100 text-amber-800' },
          { id: 'progress', label: 'Course Progress', icon: BarChart3 },
          { id: 'activity', label: 'Student Activity', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TeacherSubTab)}
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
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab.badgeColor || 'bg-slate-200/80 text-slate-700'
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
      {/* 1. TEACHER OVERVIEW */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Courses Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Assigned Courses & Cohorts</h2>
                <p className="text-xs text-slate-500">Current active course sections under your instruction</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_TEACHER_COURSES.map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/80">
                          {course.code}
                        </span>
                        <span className="text-xs text-slate-500">{course.department}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-2">{course.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.enrolledStudents} students</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-600 font-medium">Syllabus Completion</span>
                      <span className="font-bold text-slate-900">{course.syllabusProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all"
                        style={{ width: `${course.syllabusProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Next session & actions */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Lecture: {course.nextLectureTime}</span>
                    </div>
                    <button
                      onClick={() => {
                        setMaterialFilterCourse(course.code);
                        setActiveTab('materials');
                      }}
                      className="text-emerald-700 font-bold hover:text-emerald-800 inline-flex items-center gap-1"
                    >
                      <span>Manage</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dual Column: Weak Spots & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent Diagnostic Alert Card */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/80">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Priority Weak Topic Diagnosis
                    </h3>
                    <p className="text-[11px] text-slate-600">Calculated from student quiz responses</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('weak_topics')}
                  className="text-xs font-bold text-amber-800 hover:underline"
                >
                  View All (4)
                </button>
              </div>

              <div className="mt-3 space-y-3">
                {MOCK_WEAK_TOPIC_ANALYSIS.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-white border border-amber-200/80 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{item.topic}</span>
                      <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                        {item.failureRate}% Fail Rate
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                      <strong>Misconception:</strong> {item.commonMisconception}
                    </p>
                    <div className="mt-2 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Suggested: {item.suggestedAction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Live Activity Stream */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Recent Student Activity
                    </h3>
                    <p className="text-[11px] text-slate-500">Live feed across your courses</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('activity')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Full Stream
                </button>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {MOCK_STUDENT_ACTIVITY_LOGS.slice(0, 4).map((log) => (
                  <div key={log.id} className="py-2.5 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{log.studentName}</span>
                        <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                          {log.courseCode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{log.detail}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. UPLOAD STUDY MATERIAL */}
      {/* ======================================================== */}
      {activeTab === 'upload' && (
        <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <Upload className="w-4 h-4" />
              <span>Publish Coursework & Study Guides</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">Upload Study Material</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Files uploaded here are automatically indexed into structured Smart Summaries, Key Concepts, Flashcards, and Practice Quizzes for students.
            </p>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Target Course <span className="text-red-500">*</span>
                </label>
                <select
                  value={uploadCourseCode}
                  onChange={(e) => {
                    setUploadCourseCode(e.target.value);
                    const course = MOCK_TEACHER_COURSES.find((c) => c.code === e.target.value);
                    if (course) setUploadSubject(course.name);
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
                >
                  {MOCK_TEACHER_COURSES.map((c) => (
                    <option key={c.id} value={c.code}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Visibility Scope
                </label>
                <select
                  value={uploadVisibility}
                  onChange={(e) =>
                    setUploadVisibility(e.target.value as 'class_only' | 'public' | 'hidden')
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="class_only">Enrolled Students Only (Recommended)</option>
                  <option value="public">Institution-Wide Public</option>
                  <option value="hidden">Hidden / Draft (Faculty only)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Material Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Unit 4: AVL Trees, Rotations & Balance Factors"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Topic or Unit Name
              </label>
              <input
                type="text"
                placeholder="e.g. Tree Data Structures"
                value={uploadTopic}
                onChange={(e) => setUploadTopic(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Drag and Drop Zone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Attach Document or Slides (PDF, DOCX, MD)
              </label>
              <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-6 text-center transition-colors cursor-pointer bg-slate-50/50">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800">
                  Drag and drop files here, or <span className="text-emerald-600 underline">browse</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Supports Lecture Notes, Syllabi, Slide Decks, and Lab Manuals (up to 50MB)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Or Paste Key Lecture Content / Syllabus Notes Directly
              </label>
              <textarea
                rows={4}
                placeholder="Paste verbatim notes, theorem statements, or key definitions..."
                value={uploadContent}
                onChange={(e) => setUploadContent(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('materials')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || !uploadTitle.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors"
              >
                {isUploading ? (
                  <>Processing Study Guide...</>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    Publish to Class
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MANAGE MATERIALS */}
      {/* ======================================================== */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Published Course Materials</h2>
              <p className="text-xs text-slate-500">
                View student access stats and toggle material visibility
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter materials..."
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  className="rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={materialFilterCourse}
                onChange={(e) => setMaterialFilterCourse(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Courses</option>
                {MOCK_TEACHER_COURSES.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Material Details</th>
                    <th className="py-3 px-3">Course</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Visibility</th>
                    <th className="py-3 px-3">Student Views</th>
                    <th className="py-3 px-3">Downloads</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMaterials.map((mat) => (
                    <tr key={mat.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{mat.title}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {mat.topic} • {mat.fileFormat} ({mat.fileSize})
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {mat.courseCode}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                            mat.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {mat.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => handleToggleMaterialVisibility(mat.id)}
                          className="font-semibold text-slate-700 hover:text-emerald-700 underline text-[11px]"
                          title="Click to toggle visibility"
                        >
                          {mat.visibility.replace('_', ' ')}
                        </button>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>{mat.viewsCount}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                          <span>{mat.downloadsCount}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() =>
                            info('Editing Material', `Opening editor for ${mat.title}`)
                          }
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold"
                        >
                          Edit
                        </button>
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
      {/* 4. CREATE / REVIEW QUIZZES */}
      {/* ======================================================== */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Class Quizzes & Active Recall Diagnostics</h2>
              <p className="text-xs text-slate-500">
                Monitor student test participation, score averages, and question-level difficulty
              </p>
            </div>
            <button
              onClick={() => setShowNewQuizModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Quiz
            </button>
          </div>

          {/* New Quiz Modal */}
          {showNewQuizModal && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200/80 mb-4">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  New Quiz Setup
                </span>
                <button
                  onClick={() => setShowNewQuizModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleCreateQuiz} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unit 4: Self-Balancing Trees & Rotations Diagnostic"
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Course
                  </label>
                  <select
                    value={newQuizCourse}
                    onChange={(e) => setNewQuizCourse(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    {MOCK_TEACHER_COURSES.map((c) => (
                      <option key={c.id} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Questions Pool Count
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={30}
                    value={newQuizQuestionsCount}
                    onChange={(e) => setNewQuizQuestionsCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>

                <div className="sm:col-span-2 flex items-end justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Publish Quiz to Class
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Quizzes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200/80">
                      {quiz.courseCode}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">{quiz.title}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      quiz.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {quiz.status}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Turnout
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">
                      {quiz.participantsCount}/{quiz.totalStudents}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Avg Score
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">
                      {quiz.avgScore > 0 ? `${quiz.avgScore}%` : 'Pending'}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Pass Rate
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">
                      {quiz.passRate > 0 ? `${quiz.passRate}%` : 'Pending'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 text-[11px]">Due: {quiz.dueDate}</span>
                  <button
                    onClick={() =>
                      info('Quiz Review', `Reviewing question telemetry for ${quiz.title}`)
                    }
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    Review Questions ({quiz.questionsCount}) →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. ASSIGNMENTS */}
      {/* ======================================================== */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Active Coursework & Assignments</h2>
              <p className="text-xs text-slate-500">Track student submissions, deadlines, and grading queues</p>
            </div>
            <button
              onClick={() => info('New Assignment', 'Opening assignment creator')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Assignment
            </button>
          </div>

          <div className="space-y-3">
            {assignments.map((asgn) => {
              const submissionPct = Math.round((asgn.submittedCount / asgn.totalStudents) * 100);
              return (
                <div
                  key={asgn.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                          {asgn.courseCode}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">Max Score: {asgn.maxScore} pts</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{asgn.title}</h3>
                      <p className="text-xs text-slate-600 mt-1">{asgn.description}</p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                      <span className="text-[11px] font-bold text-slate-500">Deadline</span>
                      <span className="text-xs font-bold text-slate-900">{asgn.dueDate}</span>
                    </div>
                  </div>

                  {/* Submission counter */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">
                        Submissions: {asgn.submittedCount} of {asgn.totalStudents} ({submissionPct}%)
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {asgn.gradedCount} Graded
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all"
                        style={{ width: `${submissionPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() =>
                        info('Grade Queue', `Opening submission evaluator for ${asgn.title}`)
                      }
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200"
                    >
                      View Submissions ({asgn.submittedCount})
                    </button>
                    <button
                      onClick={() =>
                        success('Grading Ready', `Loaded 12 ungraded papers for ${asgn.title}`)
                      }
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                    >
                      Start Grading
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. STUDENT PERFORMANCE */}
      {/* ======================================================== */}
      {activeTab === 'performance' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Class Grade & Diagnostic Roster</h2>
              <p className="text-xs text-slate-500">
                Individual performance breakdown across homework and active recall quizzes
              </p>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or weak area..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-3">Attendance</th>
                    <th className="py-3 px-3">Quiz Avg</th>
                    <th className="py-3 px-3">Assignments</th>
                    <th className="py-3 px-3">Primary Weak Area</th>
                    <th className="py-3 px-3">Trend</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {s.studentId} • {s.email}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-800">{s.attendanceRate}%</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`font-bold text-xs px-2 py-0.5 rounded ${
                            s.avgQuizScore >= 80
                              ? 'bg-emerald-50 text-emerald-700'
                              : s.avgQuizScore >= 70
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {s.avgQuizScore}%
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-semibold text-slate-700">
                        {s.assignmentsCompleted}/{s.totalAssignments}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-medium">
                          {s.primaryWeakArea}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            s.trend === 'improving'
                              ? 'bg-emerald-50 text-emerald-700'
                              : s.trend === 'steady'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {s.trend.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() =>
                            info('Student Profile', `Viewing detailed academic record for ${s.name}`)
                          }
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold"
                        >
                          Report
                        </button>
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
      {/* 7. WEAK TOPIC ANALYSIS */}
      {/* ======================================================== */}
      {activeTab === 'weak_topics' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">AI Diagnostic Weak Topic Analysis</h2>
            <p className="text-xs text-slate-500">
              Aggregated concept confusion patterns identified from student quiz questions and flashcard repeats
            </p>
          </div>

          <div className="space-y-4">
            {MOCK_WEAK_TOPIC_ANALYSIS.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {item.courseCode}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{item.subject}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{item.topic}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Failure Rate</span>
                      <span className="text-sm font-bold text-red-600">{item.failureRate}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Struggling</span>
                      <span className="text-sm font-bold text-slate-900">
                        {item.studentsStrugglingCount} students
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Identified Misconception
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {item.commonMisconception}
                    </p>
                  </div>

                  <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Recommended Pedagogical Action
                    </span>
                    <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                      {item.suggestedAction}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() =>
                      success('Flashcards Dispatched', `Targeted revision cards sent to ${item.studentsStrugglingCount} students.`)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Deploy Remedial Flashcard Blast
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. COURSE PROGRESS */}
      {/* ======================================================== */}
      {activeTab === 'progress' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Curriculum & Syllabus Milestones</h2>
            <p className="text-xs text-slate-500">Track module coverage and mid-term exam schedule targets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_TEACHER_COURSES.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {course.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">{course.name}</h3>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">
                    {course.syllabusProgress}%
                  </span>
                </div>

                <div className="mt-3">
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-600"
                      style={{ width: `${course.syllabusProgress}%` }}
                    />
                  </div>
                </div>

                {/* Milestone breakdown checklist */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Unit 1 & 2 Core Fundamentals
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700">Completed</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Mid-Term Diagnostic Assessment
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700">Completed</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      Advanced Structures & Recitation
                    </span>
                    <span className="text-[11px] font-semibold text-amber-700">In Progress</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. RECENT STUDENT ACTIVITY */}
      {/* ======================================================== */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Live Student Activity Stream</h2>
            <p className="text-xs text-slate-500">Real-time engagement telemetry across course materials</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="divide-y divide-slate-100">
              {MOCK_STUDENT_ACTIVITY_LOGS.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        log.type === 'quiz'
                          ? 'bg-blue-50 text-blue-600'
                          : log.type === 'assignment'
                          ? 'bg-emerald-50 text-emerald-600'
                          : log.type === 'flashcard'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {log.type === 'quiz' && <HelpCircle className="w-4 h-4" />}
                      {log.type === 'assignment' && <Layers className="w-4 h-4" />}
                      {log.type === 'flashcard' && <TrendingUp className="w-4 h-4" />}
                      {log.type === 'material' && <FileText className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{log.studentName}</span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {log.courseCode}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">• {log.action}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{log.detail}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-medium">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
