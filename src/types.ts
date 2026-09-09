export type ImportanceLevel = 'High' | 'Medium' | 'Low';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface SummaryIdea {
  id: string;
  title: string;
  description: string;
  keyTakeaway: string;
  iconName?: string;
}

export interface SummaryDefinition {
  id: string;
  term: string;
  definition: string;
  context?: string;
  formulaOrSyntax?: string;
}

export interface SummaryExample {
  id: string;
  title: string;
  language?: string;
  codeSnippet?: string;
  explanation: string;
}

export interface SmartSummary {
  quickOverview: string;
  coreIdeas: SummaryIdea[];
  importantDefinitions: SummaryDefinition[];
  examples: SummaryExample[];
  rememberThis: {
    keyExamPoints: string[];
    commonPitfalls: string[];
    bestPractices: string[];
  };
  shortVersion: string;
  detailedVersion: string;
}

export interface KeyConcept {
  id: string;
  name: string;
  explanation: string;
  importance: ImportanceLevel;
  difficulty: DifficultyLevel;
  isUnderstood: boolean;
  isSavedForRevision: boolean;
  category: string;
  codeExample?: string;
}

export interface Flashcard {
  id: string;
  frontQuestion: string;
  backAnswer: string;
  hint?: string;
  category: string;
  difficulty: DifficultyLevel;
  isKnown?: boolean;
  reviewCount: number;
  lastReviewed?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  conceptRef: string;
  difficulty: DifficultyLevel;
}

export interface QuizResult {
  score: number;
  total: number;
  accuracy: number;
  strongAreas: string[];
  needsRevision: string[];
  recommendedTopics: string[];
  userAnswers: Record<number, number>;
}

export interface ConceptNode {
  id: string;
  label: string;
  category: string;
  description: string;
  importance: ImportanceLevel;
  difficulty: DifficultyLevel;
  connections: string[];
  x: number;
  y: number;
  codeOrFormula?: string;
  practicalUse?: string;
}

export interface RevisionItem {
  id: string;
  topic: string;
  subject: string;
  confidence: number;
  lastReviewed: string;
  priority: 'revise_today' | 'due_for_review' | 'strong' | 'needs_attention';
  materialId: string;
  subtopicNotes?: string;
}

export interface StudyHistoryItem {
  id: string;
  dateGroup: 'Today' | 'Yesterday' | 'Earlier this week' | 'Last week';
  title: string;
  subject: string;
  activityType: 'summary_completed' | 'quiz_completed' | 'flashcards_reviewed' | 'material_analyzed';
  detail: string;
  timestamp: string;
  scoreOrProgress?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  topic: string;
  pagesCount: number;
  progressPercentage: number;
  lastStudied: string;
  isFavorite: boolean;
  isCompleted: boolean;
  summary: SmartSummary;
  keyConcepts: KeyConcept[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  conceptMap: {
    centralNode: string;
    centralDescription: string;
    nodes: ConceptNode[];
  };
  recommendedNextStep: string;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export type PortalRole = 'student' | 'teacher' | 'admin' | 'parent';

export type ActivePage =
  | 'landing'
  | 'dashboard'
  | 'materials'
  | 'workspace'
  | 'flashcards'
  | 'quizzes'
  | 'concept_map'
  | 'concept_maps'
  | 'revision'
  | 'history'
  | 'groups'
  | 'settings'
  // Teacher Portal Pages
  | 'teacher_overview'
  | 'teacher_materials'
  | 'teacher_quizzes'
  | 'teacher_assignments'
  | 'teacher_performance'
  | 'teacher_weak_topics'
  | 'teacher_progress'
  | 'teacher_activity'
  // Admin Portal Pages
  | 'admin_overview'
  | 'admin_stats'
  | 'admin_students'
  | 'admin_teachers'
  | 'admin_courses'
  | 'admin_materials'
  | 'admin_activity'
  | 'admin_analytics'
  // Parent Portal Pages
  | 'parent_overview'
  | 'parent_progress'
  | 'parent_quizzes'
  | 'parent_activity'
  | 'parent_weak_topics'
  | 'parent_revision';

export type WorkspaceTab =
  | 'overview'
  | 'summary'
  | 'concepts'
  | 'practice'
  | 'viva'
  | 'flashcards'
  | 'quiz'
  | 'concept_map'
  | 'revision';

export interface UserProfile {
  name: string;
  email: string;
  university: string;
  major: string;
  semester: string;
  materialsCount: number;
  topicsCompleted: number;
  quizAccuracy: number;
  revisionProgress: number;
  streakDays: number;
  role?: PortalRole;
  avatarUrl?: string;
}

// Teacher Portal Data Types
export interface TeacherCourse {
  id: string;
  code: string;
  name: string;
  department: string;
  enrolledStudents: number;
  syllabusProgress: number;
  activeQuizzes: number;
  pendingAssignments: number;
  nextLectureTime: string;
}

export interface TeacherMaterial {
  id: string;
  title: string;
  subject: string;
  courseCode: string;
  topic: string;
  uploadedAt: string;
  viewsCount: number;
  downloadsCount: number;
  status: 'published' | 'draft' | 'archived';
  visibility: 'class_only' | 'public' | 'hidden';
  fileFormat: string;
  fileSize: string;
}

export interface TeacherQuiz {
  id: string;
  title: string;
  courseCode: string;
  questionsCount: number;
  participantsCount: number;
  totalStudents: number;
  avgScore: number;
  passRate: number;
  dueDate: string;
  status: 'active' | 'completed' | 'draft';
}

export interface TeacherAssignment {
  id: string;
  title: string;
  courseCode: string;
  description: string;
  dueDate: string;
  submittedCount: number;
  totalStudents: number;
  gradedCount: number;
  maxScore: number;
  status: 'active' | 'grading' | 'closed';
}

export interface StudentPerformanceRecord {
  id: string;
  studentId: string;
  name: string;
  email: string;
  courseCode: string;
  attendanceRate: number;
  avgQuizScore: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  weakTopicsCount: number;
  primaryWeakArea: string;
  trend: 'improving' | 'steady' | 'needs_attention';
}

export interface WeakTopicAnalysisItem {
  id: string;
  topic: string;
  courseCode: string;
  subject: string;
  failureRate: number; // percentage
  studentsStrugglingCount: number;
  commonMisconception: string;
  suggestedAction: string;
  severity: 'high' | 'medium' | 'low';
}

export interface StudentActivityLog {
  id: string;
  studentName: string;
  action: string;
  detail: string;
  courseCode: string;
  timestamp: string;
  type: 'quiz' | 'material' | 'assignment' | 'flashcard';
}

// Admin Portal Data Types
export interface AdminStudent {
  id: string;
  studentId: string;
  name: string;
  email: string;
  department: string;
  semester: string;
  gpa: number;
  coursesEnrolled: number;
  status: 'active' | 'on_leave' | 'suspended';
  lastActive: string;
}

export interface AdminTeacher {
  id: string;
  facultyId: string;
  name: string;
  email: string;
  title: string;
  department: string;
  coursesAssigned: number;
  studentRating: number;
  status: 'active' | 'sabbatical' | 'leave';
  joinedYear: string;
}

export interface AdminCourse {
  id: string;
  code: string;
  title: string;
  department: string;
  credits: number;
  facultyInCharge: string;
  enrolledStudents: number;
  status: 'active' | 'upcoming' | 'archived';
}

export interface AdminMaterialRecord {
  id: string;
  title: string;
  courseCode: string;
  uploadedBy: string;
  department: string;
  uploadedAt: string;
  size: string;
  status: 'verified' | 'pending_review' | 'flagged';
  downloads: number;
}

export interface AdminSystemAudit {
  id: string;
  user: string;
  role: 'student' | 'teacher' | 'admin';
  action: string;
  detail: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'error';
}

export interface PlatformStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalMaterials: number;
  activeUsers: number;
  storageUsedGb: number;
  totalStorageGb: number;
  dailyQuizzesTaken: number;
  systemUptimePercentage: number;
}

// Parent Portal Data Types
export interface ChildSubjectProgress {
  subject: string;
  courseCode: string;
  syllabusCovered: number; // percentage
  quizAverage: number; // percentage
  status: 'ahead' | 'on_track' | 'needs_boost';
  nextAssignmentDue: string;
}

export interface ChildQuizReport {
  id: string;
  quizTitle: string;
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  classAverage: number;
  completedDate: string;
  status: 'excellent' | 'good' | 'review_needed';
}

export interface ParentRecommendation {
  id: string;
  topic: string;
  subject: string;
  reason: string;
  actionAdvice: string;
  priority: 'high' | 'medium' | 'low';
}
