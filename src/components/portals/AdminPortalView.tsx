import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  FolderOpen,
  Activity,
  BarChart3,
  Server,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Download,
  Building2,
  HardDrive,
  Cpu,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  MOCK_PLATFORM_STATS,
  MOCK_ADMIN_STUDENTS,
  MOCK_ADMIN_TEACHERS,
  MOCK_ADMIN_COURSES,
  MOCK_ADMIN_MATERIALS,
  MOCK_ADMIN_AUDITS,
  MOCK_ADMIN_PROFILE,
} from '../../data/portalMockData';
import {
  AdminStudent,
  AdminTeacher,
  AdminCourse,
  AdminMaterialRecord,
} from '../../types';
import { useToast } from '../common/Toast';

type AdminSubTab =
  | 'overview'
  | 'stats'
  | 'students'
  | 'teachers'
  | 'courses'
  | 'materials'
  | 'activity'
  | 'analytics';

interface AdminPortalViewProps {
  initialTab?: AdminSubTab;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  initialTab = 'overview',
}) => {
  const { success, info } = useToast();
  const [activeTab, setActiveTab] = useState<AdminSubTab>(initialTab);

  // States
  const [students, setStudents] = useState<AdminStudent[]>(MOCK_ADMIN_STUDENTS);
  const [teachers, setTeachers] = useState<AdminTeacher[]>(MOCK_ADMIN_TEACHERS);
  const [courses, setCourses] = useState<AdminCourse[]>(MOCK_ADMIN_COURSES);
  const [materials, setMaterials] = useState<AdminMaterialRecord[]>(MOCK_ADMIN_MATERIALS);

  // Search queries
  const [studentSearch, setStudentSearch] = useState('');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [materialSearch, setMaterialSearch] = useState('');

  // Modals state
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentDept, setNewStudentDept] = useState('Computer Science & Engineering');

  // Add Student Handler
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newStudent: AdminStudent = {
      id: `ast-${Date.now()}`,
      studentId: `STU-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: newStudentName.trim(),
      email: newStudentEmail.trim() || `${newStudentName.toLowerCase().replace(/\s+/g, '.')}@university.edu`,
      department: newStudentDept,
      semester: 'Semester 1',
      gpa: 3.50,
      coursesEnrolled: 4,
      status: 'active',
      lastActive: 'Just now',
    };

    setStudents([newStudent, ...students]);
    setShowAddStudent(false);
    setNewStudentName('');
    setNewStudentEmail('');
    success('Student Enrolled', `${newStudent.name} registered successfully with ID ${newStudent.studentId}.`);
  };

  const handleToggleStudentStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'active' ? 'on_leave' : 'active';
          info('Status Updated', `${s.name} is now marked as ${nextStatus.replace('_', ' ')}.`);
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  // Filtered queries
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.department.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.facultyId.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.department.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  const filteredCourses = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.facultyInCharge.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const filteredMaterials = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.courseCode.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.uploadedBy.toLowerCase().includes(materialSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Portal Header Banner */}
      <div className="rounded-2xl border border-violet-200/80 bg-gradient-to-r from-violet-50/70 via-purple-50/40 to-slate-50 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-700 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-800 bg-violet-100/80 px-2.5 py-0.5 rounded-full">
                  Admin Portal
                </span>
                <span className="text-xs text-slate-500 font-medium">State Institute of Technology</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Institution Command Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Logged in as <strong>{MOCK_ADMIN_PROFILE.name}</strong> • Academic Administration & Registrar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setActiveTab('students');
                setShowAddStudent(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Student
            </button>
            <button
              onClick={() => {
                info('Report Generated', 'Institution summary audit exported to CSV.');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export Audit
            </button>
          </div>
        </div>

        {/* 5 Core Required Platform Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-violet-200/60">
          <div className="bg-white/90 rounded-xl p-3 border border-violet-100 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Total Students</span>
              <GraduationCap className="w-3.5 h-3.5 text-violet-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900">
                {MOCK_PLATFORM_STATS.totalStudents.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">+12%</span>
            </div>
          </div>

          <div className="bg-white/90 rounded-xl p-3 border border-violet-100 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Total Teachers</span>
              <BookOpen className="w-3.5 h-3.5 text-violet-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900">
                {MOCK_PLATFORM_STATS.totalTeachers}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Faculty</span>
            </div>
          </div>

          <div className="bg-white/90 rounded-xl p-3 border border-violet-100 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Total Courses</span>
              <Building2 className="w-3.5 h-3.5 text-violet-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900">
                {MOCK_PLATFORM_STATS.totalCourses}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Active</span>
            </div>
          </div>

          <div className="bg-white/90 rounded-xl p-3 border border-violet-100 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Total Materials</span>
              <FolderOpen className="w-3.5 h-3.5 text-violet-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900">
                {MOCK_PLATFORM_STATS.totalMaterials.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">+84 wk</span>
            </div>
          </div>

          <div className="bg-white/90 rounded-xl p-3 border border-violet-100 shadow-2xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Active Users</span>
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-emerald-600">
                {MOCK_PLATFORM_STATS.activeUsers}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">DAU</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        {[
          { id: 'overview', label: 'Admin Overview', icon: ShieldCheck },
          { id: 'stats', label: 'Platform Statistics', icon: BarChart3 },
          { id: 'students', label: 'Student Management', icon: GraduationCap, count: students.length },
          { id: 'teachers', label: 'Teacher Management', icon: BookOpen, count: teachers.length },
          { id: 'courses', label: 'Course Management', icon: Building2, count: courses.length },
          { id: 'materials', label: 'Material Management', icon: FolderOpen, count: materials.length },
          { id: 'activity', label: 'User Activity Log', icon: Clock },
          { id: 'analytics', label: 'Institution Analytics', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminSubTab)}
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
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
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
      {/* 1. ADMIN OVERVIEW */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* System Health & Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Infrastructure & Platform Health
                    </h3>
                    <p className="text-[11px] text-slate-500">Service reliability and resource status</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All Systems Operational
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Core Web Service Uptime
                  </span>
                  <p className="text-lg font-bold text-slate-900 mt-1">99.98%</p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Past 90 days</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Smart Summary Indexer
                  </span>
                  <p className="text-lg font-bold text-slate-900 mt-1">32ms avg</p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">0 failed jobs</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Institution Cloud Storage
                  </span>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {MOCK_PLATFORM_STATS.storageUsedGb} GB / {MOCK_PLATFORM_STATS.totalStorageGb} GB
                  </p>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 mt-1 overflow-hidden">
                    <div className="h-full bg-violet-600 w-[10%]" />
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-2">Quick Admin Tasks:</span>
                <button
                  onClick={() => {
                    setActiveTab('students');
                    setShowAddStudent(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  + Enroll Student
                </button>
                <button
                  onClick={() => setActiveTab('teachers')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Assign Faculty
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Create New Course
                </button>
                <button
                  onClick={() => setActiveTab('materials')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Verify Pending Uploads
                </button>
              </div>
            </div>

            {/* Institution Announcement Box */}
            <div className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-violet-800 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Academic Directive</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Mid-Term Active Recall Period
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                All Engineering departments have initiated syllabus milestone checkpoints. Teachers are encouraged to deploy diagnostic quizzes to identify struggling student cohorts.
              </p>

              <div className="mt-4 pt-3 border-t border-violet-200/60 text-xs text-slate-500">
                <span>Next Faculty Senate Meeting:</span>
                <strong className="block text-slate-900 mt-0.5">Thursday, Sep 17 • 03:00 PM</strong>
              </div>
            </div>
          </div>

          {/* User Activity Snapshot */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Recent System & Audit Events
                  </h3>
                  <p className="text-[11px] text-slate-500">Recorded across campus network</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('activity')}
                className="text-xs font-bold text-violet-700 hover:underline"
              >
                View Full Logs →
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {MOCK_ADMIN_AUDITS.slice(0, 4).map((audit) => (
                <div key={audit.id} className="py-2.5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        audit.status === 'success'
                          ? 'bg-emerald-500'
                          : audit.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{audit.user}</span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded capitalize">
                          {audit.role}
                        </span>
                        <span className="text-xs text-slate-600 font-medium">• {audit.action}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{audit.detail}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">{audit.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. PLATFORM STATISTICS */}
      {/* ======================================================== */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Campus Platform Metrics</h2>
            <p className="text-xs text-slate-500">
              Institutional engagement analytics, daily recall counts, and storage metrics
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Enrolled Students
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">1,420</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                98.2% Active in last 14 days
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Active Faculty Members
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">68</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Across 8 departments</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Daily Active Quizzes Taken
              </span>
              <p className="text-2xl font-bold text-violet-700 mt-1">432</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">+18% increase this week</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Storage Allocation
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">48.2 GB</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Of 500 GB total campus quota</p>
            </div>
          </div>

          {/* Departmental breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Department Usage Distribution</h3>
            <div className="space-y-3">
              {[
                { dept: 'Computer Science & Engineering', students: 480, materials: 1420, pct: 34 },
                { dept: 'Electrical & Computer Engineering', students: 340, materials: 980, pct: 24 },
                { dept: 'Applied Mathematics & Sciences', students: 310, materials: 820, pct: 22 },
                { dept: 'Mechanical Engineering', students: 290, materials: 670, pct: 20 },
              ].map((row) => (
                <div key={row.dept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{row.dept}</span>
                    <span className="text-slate-500">
                      {row.students} students • {row.materials} materials ({row.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-600 transition-all"
                      style={{ width: `${row.pct * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. STUDENT MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Enrolled Student Roster</h2>
              <p className="text-xs text-slate-500">
                Manage student records, enrollment statuses, and academic standing
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by name, ID or department..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-500"
                />
              </div>

              <button
                onClick={() => setShowAddStudent(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Enroll Student
              </button>
            </div>
          </div>

          {/* Add Student Form */}
          {showAddStudent && (
            <div className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-violet-200/80 mb-4">
                <span className="text-xs font-bold text-violet-800 uppercase tracking-wider">
                  New Student Registration
                </span>
                <button
                  onClick={() => setShowAddStudent(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Lin"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    University Email
                  </label>
                  <input
                    type="email"
                    placeholder="m.lin@university.edu"
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Academic Department
                  </label>
                  <select
                    value={newStudentDept}
                    onChange={(e) => setNewStudentDept(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Applied Mathematics">Applied Mathematics</option>
                  </select>
                </div>

                <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddStudent(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Save Student Record
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Student Table */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Semester</th>
                    <th className="py-3 px-3">Cumulative GPA</th>
                    <th className="py-3 px-3">Enrolled Courses</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
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
                        <span className="text-slate-700 font-medium">{s.department}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-slate-700 font-semibold">{s.semester}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {s.gpa.toFixed(2)}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-slate-700 font-semibold">{s.coursesEnrolled} Courses</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full capitalize ${
                            s.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : s.status === 'on_leave'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {s.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleStudentStatus(s.id)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold"
                        >
                          Toggle Status
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
      {/* 4. TEACHER MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'teachers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Faculty & Instructor Directory</h2>
              <p className="text-xs text-slate-500">
                Departmental teaching appointments, ratings, and course loads
              </p>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search faculty..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTeachers.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-violet-800 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                        {t.facultyId}
                      </span>
                      <span className="text-xs text-slate-500">{t.department}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">{t.name}</h3>
                    <p className="text-xs text-slate-600">{t.title}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      t.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Courses</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{t.coursesAssigned}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Rating</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">⭐ {t.studentRating}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Joined</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{t.joinedYear}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() =>
                      info('Faculty Details', `Viewing course assignments for ${t.name}`)
                    }
                    className="px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200"
                  >
                    View Teaching Load
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. COURSE MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Curriculum Course Registry</h2>
              <p className="text-xs text-slate-500">Official catalog of approved academic courses</p>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Course Code & Title</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Credits</th>
                    <th className="py-3 px-3">Lead Faculty</th>
                    <th className="py-3 px-3">Enrolled</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-xs text-violet-800 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                          {c.code}
                        </span>
                        <div className="font-bold text-slate-900 mt-1">{c.title}</div>
                      </td>

                      <td className="py-3.5 px-3 font-medium text-slate-700">{c.department}</td>

                      <td className="py-3.5 px-3 font-bold text-slate-900">{c.credits} Credits</td>

                      <td className="py-3.5 px-3 font-medium text-slate-800">{c.facultyInCharge}</td>

                      <td className="py-3.5 px-3 font-semibold text-slate-700">
                        {c.enrolledStudents} Students
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            c.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() =>
                            info('Course Syllabus', `Opening curriculum specs for ${c.code}`)
                          }
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold"
                        >
                          View
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
      {/* 6. STUDY MATERIAL MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Campus Study Material Repository</h2>
              <p className="text-xs text-slate-500">
                Audit uploaded notes, syllabi, and student-shared reference decks
              </p>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search repository..."
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
                className="rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Document Title</th>
                    <th className="py-3 px-3">Course</th>
                    <th className="py-3 px-3">Uploaded By</th>
                    <th className="py-3 px-3">File Size</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Downloads</th>
                    <th className="py-3 px-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMaterials.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{m.title}</div>
                        <div className="text-[11px] text-slate-500">
                          {m.department} • Uploaded {m.uploadedAt}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {m.courseCode}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-medium text-slate-700">{m.uploadedBy}</td>

                      <td className="py-3.5 px-3 text-slate-600">{m.size}</td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full capitalize ${
                            m.status === 'verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : m.status === 'pending_review'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {m.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-semibold text-slate-700">{m.downloads}</td>

                      <td className="py-3.5 px-4 text-right">
                        {m.status === 'pending_review' ? (
                          <button
                            onClick={() => {
                              setMaterials((prev) =>
                                prev.map((item) =>
                                  item.id === m.id ? { ...item, status: 'verified' } : item
                                )
                              );
                              success('Material Verified', `Approved "${m.title}"`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => info('Audit Log', `Document checksum OK for ${m.id}`)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px]"
                          >
                            Details
                          </button>
                        )}
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
      {/* 7. USER ACTIVITY */}
      {/* ======================================================== */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Security & User Audit Log</h2>
            <p className="text-xs text-slate-500">Immutable trace of authentication, uploads, and examination attempts</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {MOCK_ADMIN_AUDITS.map((log) => (
                <div key={log.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        log.status === 'success'
                          ? 'bg-emerald-50 text-emerald-600'
                          : log.status === 'warning'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{log.user}</span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded capitalize">
                          {log.role}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">• {log.action}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{log.detail}</p>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                        IP: {log.ipAddress}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. INSTITUTION ANALYTICS */}
      {/* ======================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Institutional Learning Analytics</h2>
            <p className="text-xs text-slate-500">
              High-level academic progress, active recall retention curves, and engagement trends
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Active Recall Retention by Subject Area
              </h3>
              <div className="space-y-3">
                {[
                  { subject: 'Data Structures (CS201)', retention: 84, color: 'bg-emerald-500' },
                  { subject: 'C++ Object Oriented (CS203)', retention: 89, color: 'bg-blue-500' },
                  { subject: 'Engineering Math (MATH102)', retention: 68, color: 'bg-amber-500' },
                  { subject: 'Digital Electronics (EE204)', retention: 74, color: 'bg-purple-500' },
                ].map((item) => (
                  <div key={item.subject} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{item.subject}</span>
                      <span className="font-bold text-slate-900">{item.retention}% Retention</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.retention}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Weekly Active Study Hours per Student
              </h3>
              <div className="space-y-3">
                {[
                  { range: '15+ hours/week (Intensive)', percentage: 38 },
                  { range: '10–14 hours/week (Standard)', percentage: 44 },
                  { range: '5–9 hours/week (Moderate)', percentage: 14 },
                  { range: '< 5 hours/week (At-Risk)', percentage: 4 },
                ].map((tier) => (
                  <div key={tier.range} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700">{tier.range}</span>
                      <span className="font-bold text-slate-900">{tier.percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-600"
                        style={{ width: `${tier.percentage * 2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
