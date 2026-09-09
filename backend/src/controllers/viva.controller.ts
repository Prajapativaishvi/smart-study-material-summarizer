import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { VivaAttempt, VivaQuestion } from '../types';

export class VivaController {
  static getTopicViva(req: AuthenticatedRequest, res: Response) {
    const { topicId } = req.params;
    const { syllabusId } = req.query;
    const isTeacherOrAdmin = req.user?.role === 'TEACHER' || req.user?.role === 'ADMIN';

    let questions = db.vivaQuestions.filter((v) => v.topicId === topicId || v.syllabusTopicId === topicId);
    if (syllabusId && typeof syllabusId === 'string') {
      questions = questions.filter((v) => !v.syllabusId || v.syllabusId === syllabusId);
    }

    // If student, do not reveal expected answer prior to test/attempt
    const responseData = questions.map((q) => {
      if (isTeacherOrAdmin) {
        return q;
      }
      const { expectedAnswer: _hidden, ...studentView } = q;
      return studentView;
    });

    return sendSuccess(res, responseData);
  }

  static createVivaQuestion(req: AuthenticatedRequest, res: Response) {
    const { topicId, question, expectedAnswer, organizationId, syllabusId, syllabusTopicId, conceptId } = req.body;
    if (!topicId || !question || !expectedAnswer) {
      return sendError(res, 'topicId, question, and expectedAnswer are required', 400);
    }

    const newQ: VivaQuestion = {
      id: `viva-${Date.now()}`,
      topicId,
      organizationId,
      syllabusId,
      syllabusTopicId: syllabusTopicId || (db.syllabusTopics.some((st) => st.id === topicId) ? topicId : undefined),
      conceptId,
      question,
      expectedAnswer,
      createdBy: req.user!.userId,
      createdAt: new Date().toISOString(),
    };

    db.vivaQuestions.push(newQ);
    return sendSuccess(res, newQ, 201, 'Viva prompt created successfully');
  }

  static submitVivaAttempt(req: AuthenticatedRequest, res: Response) {
    const { topicId, studentAnswer, questionId } = req.body;
    const studentId = req.user?.userId || req.body.studentId;

    if (!topicId || !studentAnswer) {
      return sendError(res, 'topicId and studentAnswer are required', 400);
    }

    const question = questionId
      ? db.vivaQuestions.find((q) => q.id === questionId)
      : db.vivaQuestions.find((q) => q.topicId === topicId);

    // Evaluate answer against expected answer using key semantic keywords
    let score = 75; // baseline attempt score
    let feedback = 'Good foundational understanding.';

    if (question && question.expectedAnswer) {
      const expectedKeywords = question.expectedAnswer
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .split(' ')
        .filter((w) => w.length > 3);

      const studentWords = new Set(
        studentAnswer
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, '')
          .split(' ')
      );

      const matched = expectedKeywords.filter((w) => studentWords.has(w));
      const keywordRatio = expectedKeywords.length > 0 ? matched.length / expectedKeywords.length : 0.8;

      score = Math.min(100, Math.max(50, Math.round(55 + keywordRatio * 45)));

      if (score >= 85) {
        feedback = 'Exceptional conceptual accuracy and technical terminology.';
      } else if (score >= 70) {
        feedback = 'Competent response. Could elaborate more on hardware-level memory implications.';
      } else {
        feedback = 'Review contiguous offset arithmetic and spatial cache prefetching details.';
      }
    }

    const attempt: VivaAttempt = {
      id: `va-${Date.now()}`,
      studentId,
      topicId,
      score,
      feedback,
      attemptedAt: new Date().toISOString(),
    };

    db.vivaAttempts.push(attempt);

    // Update student progress record
    let progress = db.studentProgress.find((p) => p.studentId === studentId && p.topicId === topicId);
    if (!progress) {
      progress = {
        id: `prog-${Date.now()}`,
        studentId,
        topicId,
        notesCompleted: false,
        practiceCompleted: false,
        vivaScore: score,
        quizScore: 0,
        flashcardsReviewed: 0,
        overallProgress: Math.round(score * 0.25),
        updatedAt: new Date().toISOString(),
      };
      db.studentProgress.push(progress);
    } else {
      progress.vivaScore = score;
      progress.updatedAt = new Date().toISOString();
    }

    return sendSuccess(
      res,
      {
        attemptId: attempt.id,
        score: attempt.score,
        feedback: attempt.feedback,
        expectedAnswer: question?.expectedAnswer,
        attemptedAt: attempt.attemptedAt,
      },
      201,
      'Viva evaluated successfully'
    );
  }

  static getStudentAttempts(req: AuthenticatedRequest, res: Response) {
    const { studentId } = req.params;
    const attempts = db.vivaAttempts.filter((a) => a.studentId === studentId);
    return sendSuccess(res, attempts);
  }
}
