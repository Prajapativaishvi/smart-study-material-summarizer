import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class SubjectsController {
  static getSubjects(_req: Request, res: Response) {
    const subjectsWithUnits = db.subjects.map((sub) => {
      const units = db.units.filter((u) => u.subjectId === sub.id);
      return {
        ...sub,
        unitsCount: units.length,
      };
    });
    return sendSuccess(res, subjectsWithUnits);
  }

  static getSubjectUnits(req: Request, res: Response) {
    const { subjectId } = req.params;
    const subject = db.subjects.find((s) => s.id === subjectId);
    if (!subject) {
      return sendError(res, 'Subject not found', 404);
    }

    const units = db.units
      .filter((u) => u.subjectId === subjectId)
      .sort((a, b) => a.unitNumber - b.unitNumber);

    const unitsWithTopics = units.map((unit) => {
      const topics = db.topics.filter((t) => t.unitId === unit.id);
      return {
        ...unit,
        topics,
      };
    });

    return sendSuccess(res, unitsWithTopics);
  }

  static getUnitTopics(req: Request, res: Response) {
    const { unitId } = req.params;
    const unit = db.units.find((u) => u.id === unitId);
    if (!unit) {
      return sendError(res, 'Unit not found', 404);
    }

    const topics = db.topics.filter((t) => t.unitId === unitId);
    return sendSuccess(res, topics);
  }

  static createSubject(req: AuthenticatedRequest, res: Response) {
    const { name, description } = req.body;
    if (!name) {
      return sendError(res, 'Subject name is required', 400);
    }

    const newSubject = {
      id: `sub-${Date.now()}`,
      name,
      description: description || '',
    };
    db.subjects.push(newSubject);
    return sendSuccess(res, newSubject, 201, 'Subject created successfully');
  }

  static createUnit(req: AuthenticatedRequest, res: Response) {
    const { subjectId } = req.params;
    const { name, unitNumber } = req.body;

    const subject = db.subjects.find((s) => s.id === subjectId);
    if (!subject) {
      return sendError(res, 'Subject not found', 404);
    }

    if (!name) {
      return sendError(res, 'Unit name is required', 400);
    }

    const newUnit = {
      id: `unit-${Date.now()}`,
      subjectId,
      name,
      unitNumber: unitNumber || db.units.filter((u) => u.subjectId === subjectId).length + 1,
    };
    db.units.push(newUnit);
    return sendSuccess(res, newUnit, 201, 'Unit created successfully');
  }

  static createTopic(req: AuthenticatedRequest, res: Response) {
    const { unitId } = req.params;
    const { name, description } = req.body;

    const unit = db.units.find((u) => u.id === unitId);
    if (!unit) {
      return sendError(res, 'Unit not found', 404);
    }

    if (!name) {
      return sendError(res, 'Topic name is required', 400);
    }

    const newTopic = {
      id: `top-${Date.now()}`,
      unitId,
      name,
      description: description || '',
    };
    db.topics.push(newTopic);
    return sendSuccess(res, newTopic, 201, 'Topic created successfully');
  }
}
