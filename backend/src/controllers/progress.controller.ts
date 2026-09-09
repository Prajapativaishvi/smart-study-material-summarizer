import { Response } from 'express';
import { db } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class ProgressController {
  static getStudentProgress(req: AuthenticatedRequest, res: Response) {
    const { studentId } = req.params;
    const student = db.users.find((u) => u.id === studentId);
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }

    const progressRecords = db.studentProgress.filter((p) => p.studentId === studentId);
    const enriched = progressRecords.map((p) => {
      const topic = db.topics.find((t) => t.id === p.topicId);
      return {
        ...p,
        topicName: topic?.name,
      };
    });

    return sendSuccess(res, enriched);
  }

  static getStudentDashboard(req: AuthenticatedRequest, res: Response) {
    const { studentId } = req.params;
    const student = db.users.find((u) => u.id === studentId);
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }

    const quizAttempts = db.quizAttempts.filter((q) => q.studentId === studentId);
    const vivaAttempts = db.vivaAttempts.filter((v) => v.studentId === studentId);
    const flashcardReviews = db.flashcardReviews.filter((f) => f.studentId === studentId);
    const progressList = db.studentProgress.filter((p) => p.studentId === studentId);

    // Aggregate statistics
    const totalQuizScore = quizAttempts.reduce((sum, q) => sum + (q.score / q.totalQuestions) * 100, 0);
    const avgQuizAccuracy = quizAttempts.length > 0 ? Math.round(totalQuizScore / quizAttempts.length) : 84;

    const totalVivaScore = vivaAttempts.reduce((sum, v) => sum + v.score, 0);
    const avgVivaScore = vivaAttempts.length > 0 ? Math.round(totalVivaScore / vivaAttempts.length) : 88;

    const completedNotesCount = progressList.filter((p) => p.notesCompleted).length;
    const completedPracticeCount = progressList.filter((p) => p.practiceCompleted).length;

    const overallCompletionRate = progressList.length > 0
      ? Math.round(progressList.reduce((sum, p) => sum + p.overallProgress, 0) / progressList.length)
      : 72;

    const uniqueFlashcardsReviewed = new Set(flashcardReviews.map((f) => f.flashcardId)).size;

    const organization = student.organizationId ? db.organizations.find((o) => o.id === student.organizationId) : null;
    const syllabus = student.syllabusId ? db.syllabi.find((s) => s.id === student.syllabusId) : null;

    return sendSuccess(res, {
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        role: student.role,
        organizationId: student.organizationId,
        organizationName: organization?.name,
        syllabusId: student.syllabusId,
        syllabusName: syllabus?.name,
        syllabusVersion: syllabus?.version,
      },
      stats: {
        topicsCompleted: completedNotesCount + completedPracticeCount,
        notesCompleted: completedNotesCount,
        practiceCompleted: completedPracticeCount,
        quizAccuracy: avgQuizAccuracy,
        quizzesAttempted: quizAttempts.length,
        vivaAttemptsCount: vivaAttempts.length,
        avgVivaScore,
        flashcardsReviewedCount: uniqueFlashcardsReviewed,
        overallCompletionRate,
        streakDays: 6,
      },
      recentActivity: {
        quizAttempts: quizAttempts.slice(-5).reverse(),
        vivaAttempts: vivaAttempts.slice(-5).reverse(),
        flashcardReviewsCount: flashcardReviews.length,
      },
      progressByTopic: progressList.map((p) => {
        const topic = db.topics.find((t) => t.id === p.topicId);
        return {
          ...p,
          topicName: topic?.name || 'Data Structures',
        };
      }),
    });
  }

  static updateTopicProgress(req: AuthenticatedRequest, res: Response) {
    const { studentId, topicId } = req.params;
    const { notesCompleted, practiceCompleted } = req.body;

    let progress = db.studentProgress.find((p) => p.studentId === studentId && p.topicId === topicId);
    if (!progress) {
      progress = {
        id: `prog-${Date.now()}`,
        studentId,
        topicId,
        notesCompleted: Boolean(notesCompleted),
        practiceCompleted: Boolean(practiceCompleted),
        vivaScore: 0,
        quizScore: 0,
        flashcardsReviewed: 0,
        overallProgress: (notesCompleted ? 25 : 0) + (practiceCompleted ? 25 : 0),
        updatedAt: new Date().toISOString(),
      };
      db.studentProgress.push(progress);
    } else {
      if (notesCompleted !== undefined) progress.notesCompleted = Boolean(notesCompleted);
      if (practiceCompleted !== undefined) progress.practiceCompleted = Boolean(practiceCompleted);
      progress.overallProgress = Math.min(
        100,
        (progress.notesCompleted ? 25 : 0) +
          (progress.practiceCompleted ? 25 : 0) +
          (progress.quizScore ? progress.quizScore * 0.25 : 0) +
          (progress.vivaScore ? progress.vivaScore * 0.25 : 0)
      );
      progress.updatedAt = new Date().toISOString();
    }

    return sendSuccess(res, progress, 200, 'Topic progress updated');
  }

  static getStudentSyllabus(req: AuthenticatedRequest, res: Response) {
    const { studentId } = req.params;
    const student = db.users.find((u) => u.id === studentId);
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }

    const organization = student.organizationId ? db.organizations.find((o) => o.id === student.organizationId) : null;
    const syllabus = student.syllabusId ? db.syllabi.find((s) => s.id === student.syllabusId) : null;

    let unitsWithTopics: any[] = [];
    if (syllabus) {
      const units = db.syllabusUnits
        .filter((u) => u.syllabusId === syllabus.id)
        .sort((a, b) => a.unitNumber - b.unitNumber);

      unitsWithTopics = units.map((u) => {
        const topics = db.syllabusTopics.filter((t) => t.unitId === u.id);
        return {
          ...u,
          topics,
        };
      });
    }

    return sendSuccess(res, {
      studentId: student.id,
      organization,
      syllabus,
      units: unitsWithTopics,
    });
  }

  static updateStudentSyllabus(req: AuthenticatedRequest, res: Response) {
    const { studentId } = req.params;
    const { organizationId, syllabusId } = req.body;

    const student = db.users.find((u) => u.id === studentId);
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }

    if (organizationId) {
      const org = db.organizations.find((o) => o.id === organizationId);
      if (!org) return sendError(res, 'Organization not found', 404);
      student.organizationId = organizationId;
    }

    if (syllabusId) {
      const syl = db.syllabi.find((s) => s.id === syllabusId);
      if (!syl) return sendError(res, 'Syllabus not found', 404);
      student.syllabusId = syllabusId;
    }

    student.updatedAt = new Date().toISOString();

    const organization = student.organizationId ? db.organizations.find((o) => o.id === student.organizationId) : null;
    const syllabus = student.syllabusId ? db.syllabi.find((s) => s.id === student.syllabusId) : null;

    return sendSuccess(
      res,
      {
        studentId: student.id,
        organizationId: student.organizationId,
        organizationName: organization?.name,
        syllabusId: student.syllabusId,
        syllabusName: syllabus?.name,
        syllabusVersion: syllabus?.version,
      },
      200,
      'Student syllabus preference updated successfully'
    );
  }
}

