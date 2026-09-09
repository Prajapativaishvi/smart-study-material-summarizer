import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Note } from '../types';

export class NotesController {
  static getTopicNotes(req: Request, res: Response) {
    const { topicId } = req.params;
    const { syllabusId } = req.query;

    const topic = db.topics.find((t) => t.id === topicId) || db.syllabusTopics.find((t) => t.id === topicId);
    if (!topic) {
      return sendError(res, 'Topic not found', 404);
    }

    let notes = db.notes.filter((n) => n.topicId === topicId || n.syllabusTopicId === topicId);
    if (syllabusId && typeof syllabusId === 'string') {
      notes = notes.filter((n) => !n.syllabusId || n.syllabusId === syllabusId);
    }

    return sendSuccess(res, notes);
  }

  static getNoteById(req: Request, res: Response) {
    const { noteId } = req.params;
    const note = db.notes.find((n) => n.id === noteId);
    if (!note) {
      return sendError(res, 'Note not found', 404);
    }

    const topic = db.topics.find((t) => t.id === note.topicId) || db.syllabusTopics.find((t) => t.id === note.syllabusTopicId);
    const author = db.users.find((u) => u.id === note.createdBy);
    const org = note.organizationId ? db.organizations.find((o) => o.id === note.organizationId) : null;
    const syllabus = note.syllabusId ? db.syllabi.find((s) => s.id === note.syllabusId) : null;
    const concept = note.conceptId ? db.concepts.find((c) => c.id === note.conceptId) : null;

    return sendSuccess(res, {
      ...note,
      topicName: topic?.name,
      authorName: author?.name || 'Faculty Member',
      organizationName: org?.name,
      syllabusName: syllabus?.name,
      conceptName: concept?.name,
    });
  }

  static createNote(req: AuthenticatedRequest, res: Response) {
    const { topicId, title, content, organizationId, syllabusId, syllabusTopicId, conceptId } = req.body;
    if (!topicId || !title || !content) {
      return sendError(res, 'topicId, title, and content are required fields', 400);
    }

    const topic = db.topics.find((t) => t.id === topicId) || db.syllabusTopics.find((t) => t.id === topicId);
    if (!topic) {
      return sendError(res, 'Topic not found', 404);
    }

    const newNote: Note = {
      id: `note-${Date.now()}`,
      topicId,
      organizationId,
      syllabusId,
      syllabusTopicId: syllabusTopicId || (db.syllabusTopics.some((st) => st.id === topicId) ? topicId : undefined),
      conceptId,
      title,
      content,
      createdBy: req.user!.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.notes.push(newNote);
    return sendSuccess(res, newNote, 201, 'Note published successfully');
  }

  static updateNote(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { title, content } = req.body;

    const note = db.notes.find((n) => n.id === id);
    if (!note) {
      return sendError(res, 'Note not found', 404);
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    note.updatedAt = new Date().toISOString();

    return sendSuccess(res, note, 200, 'Note updated successfully');
  }

  static deleteNote(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const index = db.notes.findIndex((n) => n.id === id);
    if (index === -1) {
      return sendError(res, 'Note not found', 404);
    }

    const deleted = db.notes.splice(index, 1)[0];
    return sendSuccess(res, { id: deleted.id }, 200, 'Note deleted successfully');
  }
}
