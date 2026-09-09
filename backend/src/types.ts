export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  organizationId?: string;
  syllabusId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
}

export interface Unit {
  id: string;
  subjectId: string;
  name: string;
  unitNumber: number;
}

export interface Topic {
  id: string;
  unitId: string;
  name: string;
  description?: string;
}

export interface Note {
  id: string;
  topicId: string;
  organizationId?: string;
  syllabusId?: string;
  syllabusTopicId?: string;
  conceptId?: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Example {
  id: string;
  topicId: string;
  organizationId?: string;
  syllabusId?: string;
  syllabusTopicId?: string;
  conceptId?: string;
  question: string;
  solution: string;
  difficulty: Difficulty;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface VivaQuestion {
  id: string;
  topicId: string;
  organizationId?: string;
  syllabusId?: string;
  syllabusTopicId?: string;
  conceptId?: string;
  question: string;
  expectedAnswer: string;
  createdBy: string;
  createdAt: string;
}

export interface VivaAttempt {
  id: string;
  studentId: string;
  topicId: string;
  score: number;
  attemptedAt: string;
  feedback?: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  topicId: string;
  organizationId?: string;
  syllabusId?: string;
  syllabusTopicId?: string;
  conceptId?: string;
  title: string;
  createdBy: string;
  createdAt: string;
  questions?: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  attemptedAt: string;
}

export interface Flashcard {
  id: string;
  topicId: string;
  organizationId?: string;
  syllabusId?: string;
  syllabusTopicId?: string;
  conceptId?: string;
  question: string;
  answer: string;
  createdBy: string;
  createdAt: string;
}

export interface FlashcardReview {
  id: string;
  studentId: string;
  flashcardId: string;
  reviewedAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  studentId: string;
  joinedAt: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName?: string;
  message: string;
  createdAt: string;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  topicId: string;
  notesCompleted: boolean;
  practiceCompleted: boolean;
  vivaScore: number;
  quizScore: number;
  flashcardsReviewed: number;
  overallProgress: number;
  updatedAt: string;
}

// Multi-Syllabus & Concept Mapping
export interface Organization {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface Syllabus {
  id: string;
  organizationId: string;
  name: string;
  version: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyllabusUnit {
  id: string;
  syllabusId: string;
  name: string;
  unitNumber: number;
  type: string; // 'UNIT' or 'MODULE'
  description?: string;
  createdAt: string;
}

export interface SyllabusSection {
  id: string;
  unitId: string;
  name: string;
  orderIndex: number;
  description?: string;
  createdAt: string;
}

export interface SyllabusTopic {
  id: string;
  unitId: string;
  sectionId?: string;
  name: string;
  orderIndex: number;
  description?: string;
  createdAt: string;
}

export interface Concept {
  id: string;
  name: string;
  code?: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyllabusTopicConcept {
  id: string;
  syllabusTopicId: string;
  conceptId: string;
  createdAt: string;
}

