import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Flashcard, FlashcardReview } from '../types';

export class FlashcardsController {
  static getTopicFlashcards(req: AuthenticatedRequest, res: Response) {
    const { topicId } = req.params;
    const { syllabusId } = req.query;
    const studentId = req.user?.userId || (req.query.studentId as string);

    let flashcards = db.flashcards.filter((f) => f.topicId === topicId || f.syllabusTopicId === topicId);
    if (syllabusId && typeof syllabusId === 'string') {
      flashcards = flashcards.filter((f) => !f.syllabusId || f.syllabusId === syllabusId);
    }

    const enriched = flashcards.map((f) => {
      const isReviewed = studentId
        ? db.flashcardReviews.some((r) => r.flashcardId === f.id && r.studentId === studentId)
        : false;
      return {
        ...f,
        isReviewed,
      };
    });

    return sendSuccess(res, enriched);
  }

  static getFlashcardById(req: Request, res: Response) {
    const { id } = req.params;
    const card = db.flashcards.find((f) => f.id === id);
    if (!card) {
      return sendError(res, 'Flashcard not found', 404);
    }
    return sendSuccess(res, card);
  }

  static reviewFlashcard(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const studentId = req.user?.userId || req.body.studentId;

    const card = db.flashcards.find((f) => f.id === id);
    if (!card) {
      return sendError(res, 'Flashcard not found', 404);
    }

    if (!studentId) {
      return sendError(res, 'studentId is required', 400);
    }

    const review: FlashcardReview = {
      id: `rev-${Date.now()}`,
      studentId,
      flashcardId: id,
      reviewedAt: new Date().toISOString(),
    };
    db.flashcardReviews.push(review);

    // Update student progress count
    const studentReviews = db.flashcardReviews.filter((r) => r.studentId === studentId);
    let progress = db.studentProgress.find((p) => p.studentId === studentId && p.topicId === card.topicId);
    if (!progress) {
      progress = {
        id: `prog-${Date.now()}`,
        studentId,
        topicId: card.topicId,
        notesCompleted: false,
        practiceCompleted: false,
        vivaScore: 0,
        quizScore: 0,
        flashcardsReviewed: 1,
        overallProgress: 15,
        updatedAt: new Date().toISOString(),
      };
      db.studentProgress.push(progress);
    } else {
      progress.flashcardsReviewed += 1;
      progress.updatedAt = new Date().toISOString();
    }

    return sendSuccess(
      res,
      {
        reviewId: review.id,
        flashcardId: id,
        totalReviews: studentReviews.length,
        reviewedAt: review.reviewedAt,
      },
      200,
      'Flashcard review recorded'
    );
  }

  static getStudentFlashcardProgress(req: AuthenticatedRequest, res: Response) {
    const { studentId } = req.params;
    const reviews = db.flashcardReviews.filter((r) => r.studentId === studentId);
    const uniqueReviewedIds = new Set(reviews.map((r) => r.flashcardId));

    return sendSuccess(res, {
      studentId,
      totalCardsInSystem: db.flashcards.length,
      reviewedCardsCount: uniqueReviewedIds.size,
      totalReviewSessions: reviews.length,
      completionRate: db.flashcards.length
        ? Math.round((uniqueReviewedIds.size / db.flashcards.length) * 100)
        : 0,
    });
  }

  static createFlashcard(req: AuthenticatedRequest, res: Response) {
    const { topicId, question, answer, organizationId, syllabusId, syllabusTopicId, conceptId } = req.body;
    if (!topicId || !question || !answer) {
      return sendError(res, 'topicId, question, and answer are required', 400);
    }

    const topic = db.topics.find((t) => t.id === topicId) || db.syllabusTopics.find((t) => t.id === topicId);
    if (!topic) {
      return sendError(res, 'Topic not found', 404);
    }

    const newCard: Flashcard = {
      id: `fc-${Date.now()}`,
      topicId,
      organizationId,
      syllabusId,
      syllabusTopicId: syllabusTopicId || (db.syllabusTopics.some((st) => st.id === topicId) ? topicId : undefined),
      conceptId,
      question,
      answer,
      createdBy: req.user!.userId,
      createdAt: new Date().toISOString(),
    };

    db.flashcards.push(newCard);
    return sendSuccess(res, newCard, 201, 'Flashcard created successfully');
  }

  static updateFlashcard(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { question, answer } = req.body;

    const card = db.flashcards.find((f) => f.id === id);
    if (!card) {
      return sendError(res, 'Flashcard not found', 404);
    }

    if (question !== undefined) card.question = question;
    if (answer !== undefined) card.answer = answer;

    return sendSuccess(res, card, 200, 'Flashcard updated successfully');
  }

  static deleteFlashcard(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const index = db.flashcards.findIndex((f) => f.id === id);
    if (index === -1) {
      return sendError(res, 'Flashcard not found', 404);
    }

    db.flashcardReviews = db.flashcardReviews.filter((r) => r.flashcardId !== id);
    const deleted = db.flashcards.splice(index, 1)[0];

    return sendSuccess(res, { id: deleted.id }, 200, 'Flashcard deleted successfully');
  }
}
