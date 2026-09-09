import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Quiz, QuizAttempt, QuizQuestion } from '../types';

export class QuizController {
  static getTopicQuizzes(req: Request, res: Response) {
    const { topicId } = req.params;
    const { syllabusId } = req.query;

    let quizzes = db.quizzes.filter((q) => q.topicId === topicId || q.syllabusTopicId === topicId);
    if (syllabusId && typeof syllabusId === 'string') {
      quizzes = quizzes.filter((q) => !q.syllabusId || q.syllabusId === syllabusId);
    }

    const quizzesWithCounts = quizzes.map((q) => {
      const count = db.quizQuestions.filter((qq) => qq.quizId === q.id).length;
      return {
        ...q,
        questionsCount: count,
      };
    });

    return sendSuccess(res, quizzesWithCounts);
  }

  static getQuizById(req: AuthenticatedRequest, res: Response) {
    const { quizId } = req.params;
    const quiz = db.quizzes.find((q) => q.id === quizId);
    if (!quiz) {
      return sendError(res, 'Quiz not found', 404);
    }

    const isTeacher = req.user?.role === 'TEACHER' || req.user?.role === 'ADMIN';
    const questions = db.quizQuestions.filter((qq) => qq.quizId === quizId);

    // CRITICAL REQUIREMENT: Do NOT expose correct answers before quiz submission
    const sanitizedQuestions = questions.map((qq) => {
      if (isTeacher) {
        return qq;
      }
      const { correctAnswer: _hidden, explanation: _exp, ...studentQ } = qq;
      return studentQ;
    });

    return sendSuccess(res, {
      ...quiz,
      questions: sanitizedQuestions,
      totalQuestions: questions.length,
    });
  }

  static attemptQuiz(req: AuthenticatedRequest, res: Response) {
    const { quizId } = req.params;
    const { answers } = req.body; // Record<questionId, selectedOptionIndex> or Array<{ questionId, selectedOption }>
    const studentId = req.user?.userId || req.body.studentId;

    const quiz = db.quizzes.find((q) => q.id === quizId);
    if (!quiz) {
      return sendError(res, 'Quiz not found', 404);
    }

    const questions = db.quizQuestions.filter((qq) => qq.quizId === quizId);
    if (questions.length === 0) {
      return sendError(res, 'No questions found in this quiz', 400);
    }

    let correctCount = 0;
    const detailedResults: Array<{
      questionId: string;
      question: string;
      selectedOption: number;
      correctOption: number;
      isCorrect: boolean;
      explanation?: string;
    }> = [];

    questions.forEach((q) => {
      let userSelected: number = -1;
      if (typeof answers === 'object' && answers !== null) {
        if (answers[q.id] !== undefined) {
          userSelected = Number(answers[q.id]);
        } else if (Array.isArray(answers)) {
          const item = answers.find((a: { questionId: string; selectedOption: number }) => a.questionId === q.id);
          if (item) userSelected = Number(item.selectedOption);
        }
      }

      const isCorrect = userSelected === q.correctAnswer;
      if (isCorrect) correctCount += 1;

      detailedResults.push({
        questionId: q.id,
        question: q.question,
        selectedOption: userSelected,
        correctOption: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      });
    });

    const totalQuestions = questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    const attempt: QuizAttempt = {
      id: `qa-${Date.now()}`,
      studentId,
      quizId,
      score: correctCount,
      totalQuestions,
      attemptedAt: new Date().toISOString(),
    };

    db.quizAttempts.push(attempt);

    // Update student progress
    if (studentId) {
      let progress = db.studentProgress.find((p) => p.studentId === studentId && p.topicId === quiz.topicId);
      if (!progress) {
        progress = {
          id: `prog-${Date.now()}`,
          studentId,
          topicId: quiz.topicId,
          notesCompleted: false,
          practiceCompleted: false,
          vivaScore: 0,
          quizScore: percentage,
          flashcardsReviewed: 0,
          overallProgress: Math.round(percentage * 0.35),
          updatedAt: new Date().toISOString(),
        };
        db.studentProgress.push(progress);
      } else {
        progress.quizScore = Math.max(progress.quizScore, percentage);
        progress.overallProgress = Math.min(
          100,
          Math.round(
            (progress.notesCompleted ? 25 : 0) +
              (progress.practiceCompleted ? 25 : 0) +
              progress.quizScore * 0.25 +
              (progress.vivaScore || 0) * 0.25
          )
        );
        progress.updatedAt = new Date().toISOString();
      }
    }

    return sendSuccess(
      res,
      {
        attemptId: attempt.id,
        score: correctCount,
        totalQuestions,
        percentage,
        detailedResults,
        attemptedAt: attempt.attemptedAt,
      },
      200,
      'Quiz attempt evaluated successfully'
    );
  }

  static createQuiz(req: AuthenticatedRequest, res: Response) {
    const { topicId, title, questions, organizationId, syllabusId, syllabusTopicId, conceptId } = req.body;
    if (!topicId || !title) {
      return sendError(res, 'topicId and title are required', 400);
    }

    const topic = db.topics.find((t) => t.id === topicId) || db.syllabusTopics.find((t) => t.id === topicId);
    if (!topic) {
      return sendError(res, 'Topic not found', 404);
    }

    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      topicId,
      organizationId,
      syllabusId,
      syllabusTopicId: syllabusTopicId || (db.syllabusTopics.some((st) => st.id === topicId) ? topicId : undefined),
      conceptId,
      title,
      createdBy: req.user!.userId,
      createdAt: new Date().toISOString(),
    };

    db.quizzes.push(newQuiz);

    if (Array.isArray(questions)) {
      questions.forEach((q: { question: string; options: string[]; correctAnswer: number; explanation?: string }, index: number) => {
        const newQ: QuizQuestion = {
          id: `qq-${Date.now()}-${index}`,
          quizId: newQuiz.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        };
        db.quizQuestions.push(newQ);
      });
    }

    return sendSuccess(res, newQuiz, 201, 'Quiz created successfully');
  }

  static updateQuiz(req: AuthenticatedRequest, res: Response) {
    const { quizId } = req.params;
    const { title } = req.body;

    const quiz = db.quizzes.find((q) => q.id === quizId);
    if (!quiz) {
      return sendError(res, 'Quiz not found', 404);
    }

    if (title !== undefined) quiz.title = title;
    return sendSuccess(res, quiz, 200, 'Quiz updated successfully');
  }

  static deleteQuiz(req: AuthenticatedRequest, res: Response) {
    const { quizId } = req.params;
    const index = db.quizzes.findIndex((q) => q.id === quizId);
    if (index === -1) {
      return sendError(res, 'Quiz not found', 404);
    }

    db.quizQuestions = db.quizQuestions.filter((qq) => qq.quizId !== quizId);
    db.quizAttempts = db.quizAttempts.filter((qa) => qa.quizId !== quizId);
    const deleted = db.quizzes.splice(index, 1)[0];

    return sendSuccess(res, { id: deleted.id }, 200, 'Quiz deleted successfully');
  }
}
