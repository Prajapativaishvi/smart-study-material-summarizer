import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Difficulty, Example } from '../types';

export class ExamplesController {
  static getTopicExamples(req: Request, res: Response) {
    const { topicId } = req.params;
    const { difficulty, syllabusId } = req.query;

    let examples = db.examples.filter((e) => e.topicId === topicId || e.syllabusTopicId === topicId);
    if (difficulty && typeof difficulty === 'string') {
      examples = examples.filter((e) => e.difficulty.toUpperCase() === difficulty.toUpperCase());
    }
    if (syllabusId && typeof syllabusId === 'string') {
      examples = examples.filter((e) => !e.syllabusId || e.syllabusId === syllabusId);
    }

    return sendSuccess(res, examples);
  }

  static getExampleById(req: Request, res: Response) {
    const { id } = req.params;
    const example = db.examples.find((e) => e.id === id);
    if (!example) {
      return sendError(res, 'Example not found', 404);
    }
    return sendSuccess(res, example);
  }

  static createExample(req: AuthenticatedRequest, res: Response) {
    const { topicId, question, solution, difficulty, organizationId, syllabusId, syllabusTopicId, conceptId } = req.body;
    if (!topicId || !question || !solution) {
      return sendError(res, 'topicId, question, and solution are required', 400);
    }

    const topic = db.topics.find((t) => t.id === topicId) || db.syllabusTopics.find((t) => t.id === topicId);
    if (!topic) {
      return sendError(res, 'Topic not found', 404);
    }

    const validDifficulty: Difficulty =
      difficulty && ['EASY', 'MEDIUM', 'HARD'].includes(difficulty.toUpperCase())
        ? (difficulty.toUpperCase() as Difficulty)
        : 'MEDIUM';

    const newExample: Example = {
      id: `ex-${Date.now()}`,
      topicId,
      organizationId,
      syllabusId,
      syllabusTopicId: syllabusTopicId || (db.syllabusTopics.some((st) => st.id === topicId) ? topicId : undefined),
      conceptId,
      question,
      solution,
      difficulty: validDifficulty,
      createdBy: req.user!.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.examples.push(newExample);
    return sendSuccess(res, newExample, 201, 'Practice example added successfully');
  }

  static updateExample(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { question, solution, difficulty } = req.body;

    const example = db.examples.find((e) => e.id === id);
    if (!example) {
      return sendError(res, 'Example not found', 404);
    }

    if (question !== undefined) example.question = question;
    if (solution !== undefined) example.solution = solution;
    if (difficulty !== undefined && ['EASY', 'MEDIUM', 'HARD'].includes(difficulty.toUpperCase())) {
      example.difficulty = difficulty.toUpperCase() as Difficulty;
    }
    example.updatedAt = new Date().toISOString();

    return sendSuccess(res, example, 200, 'Example updated successfully');
  }

  static deleteExample(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const index = db.examples.findIndex((e) => e.id === id);
    if (index === -1) {
      return sendError(res, 'Example not found', 404);
    }

    const deleted = db.examples.splice(index, 1)[0];
    return sendSuccess(res, { id: deleted.id }, 200, 'Example removed successfully');
  }
}
