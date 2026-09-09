import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Concept, Note, Example, VivaQuestion, Quiz, Flashcard } from '../types';

export class ConceptsController {
  // GET /api/concepts
  static getConcepts(req: Request, res: Response) {
    const { search, category } = req.query;

    let list = db.concepts;
    if (category && typeof category === 'string') {
      list = list.filter((c) => c.category?.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }

    const enriched = list.map((c) => {
      const mappings = db.syllabusTopicConcepts.filter((stc) => stc.conceptId === c.id);
      return {
        ...c,
        mappedTopicsCount: mappings.length,
      };
    });

    return sendSuccess(res, enriched);
  }

  // GET /api/concepts/:conceptId
  static getConceptById(req: Request, res: Response) {
    const { conceptId } = req.params;
    const concept = db.concepts.find((c) => c.id === conceptId);
    if (!concept) {
      return sendError(res, 'Concept not found', 404);
    }

    // Find all mapped syllabus topics across all syllabi & organizations
    const mappings = db.syllabusTopicConcepts.filter((stc) => stc.conceptId === conceptId);
    const mappedTopics = mappings.map((m) => {
      const topic = db.syllabusTopics.find((t) => t.id === m.syllabusTopicId);
      const unit = topic ? db.syllabusUnits.find((u) => u.id === topic.unitId) : null;
      const syllabus = unit ? db.syllabi.find((s) => s.id === unit.syllabusId) : null;
      const org = syllabus ? db.organizations.find((o) => o.id === syllabus.organizationId) : null;

      return {
        mappingId: m.id,
        topicId: topic?.id,
        topicName: topic?.name,
        unitId: unit?.id,
        unitName: unit?.name,
        unitType: unit?.type || 'UNIT',
        syllabusId: syllabus?.id,
        syllabusName: syllabus?.name,
        syllabusVersion: syllabus?.version,
        organizationId: org?.id,
        organizationName: org?.name,
      };
    });

    return sendSuccess(res, {
      ...concept,
      mappedSyllabusTopics: mappedTopics,
    });
  }

  // POST /api/concepts (Admin)
  static createConcept(req: AuthenticatedRequest, res: Response) {
    const { name, code, description, category } = req.body;
    if (!name || !name.trim()) {
      return sendError(res, 'Concept name is required', 400);
    }

    const existing = db.concepts.find((c) => c.name.toLowerCase() === name.trim().toLowerCase());
    if (existing) {
      return sendError(res, 'A concept with this name already exists', 409);
    }

    const newConcept: Concept = {
      id: `conc-${Date.now()}`,
      name: name.trim(),
      code: code ? code.trim() : `CONC-${Date.now().toString().slice(-4)}`,
      description: description || '',
      category: category || 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.concepts.push(newConcept);
    return sendSuccess(res, newConcept, 201, 'Concept created successfully');
  }

  // PUT /api/concepts/:conceptId (Admin)
  static updateConcept(req: AuthenticatedRequest, res: Response) {
    const { conceptId } = req.params;
    const { name, code, description, category } = req.body;

    const idx = db.concepts.findIndex((c) => c.id === conceptId);
    if (idx === -1) {
      return sendError(res, 'Concept not found', 404);
    }

    if (name) {
      const duplicate = db.concepts.find(
        (c) => c.id !== conceptId && c.name.toLowerCase() === name.trim().toLowerCase()
      );
      if (duplicate) return sendError(res, 'Another concept with this name already exists', 409);
      db.concepts[idx].name = name.trim();
    }

    if (code !== undefined) db.concepts[idx].code = code;
    if (description !== undefined) db.concepts[idx].description = description;
    if (category !== undefined) db.concepts[idx].category = category;

    db.concepts[idx].updatedAt = new Date().toISOString();
    return sendSuccess(res, db.concepts[idx], 200, 'Concept updated successfully');
  }

  // DELETE /api/concepts/:conceptId (Admin)
  static deleteConcept(req: AuthenticatedRequest, res: Response) {
    const { conceptId } = req.params;
    const idx = db.concepts.findIndex((c) => c.id === conceptId);
    if (idx === -1) {
      return sendError(res, 'Concept not found', 404);
    }

    db.syllabusTopicConcepts = db.syllabusTopicConcepts.filter((stc) => stc.conceptId !== conceptId);
    db.concepts.splice(idx, 1);

    return sendSuccess(res, { deletedId: conceptId }, 200, 'Concept deleted successfully');
  }

  // GET /api/concepts/:conceptId/materials
  static getConceptMaterials(req: Request, res: Response) {
    const { conceptId } = req.params;
    const { syllabusId, organizationId } = req.query;

    const concept = db.concepts.find((c) => c.id === conceptId);
    if (!concept) {
      return sendError(res, 'Concept not found', 404);
    }

    // Filter materials linked to this concept
    let notes = db.notes.filter((n) => n.conceptId === conceptId);
    let examples = db.examples.filter((e) => e.conceptId === conceptId);
    let viva = db.vivaQuestions.filter((v) => v.conceptId === conceptId);
    let quizzes = db.quizzes.filter((q) => q.conceptId === conceptId);
    let flashcards = db.flashcards.filter((f) => f.conceptId === conceptId);

    if (syllabusId && typeof syllabusId === 'string') {
      notes = notes.filter((n) => !n.syllabusId || n.syllabusId === syllabusId);
      examples = examples.filter((e) => !e.syllabusId || e.syllabusId === syllabusId);
      viva = viva.filter((v) => !v.syllabusId || v.syllabusId === syllabusId);
      quizzes = quizzes.filter((q) => !q.syllabusId || q.syllabusId === syllabusId);
      flashcards = flashcards.filter((f) => !f.syllabusId || f.syllabusId === syllabusId);
    }

    if (organizationId && typeof organizationId === 'string') {
      notes = notes.filter((n) => !n.organizationId || n.organizationId === organizationId);
      examples = examples.filter((e) => !e.organizationId || e.organizationId === organizationId);
      viva = viva.filter((v) => !v.organizationId || v.organizationId === organizationId);
      quizzes = quizzes.filter((q) => !q.organizationId || q.organizationId === organizationId);
      flashcards = flashcards.filter((f) => !f.organizationId || f.organizationId === organizationId);
    }

    return sendSuccess(res, {
      conceptId,
      conceptName: concept.name,
      notes,
      examples,
      viva,
      quizzes,
      flashcards,
    });
  }

  // POST /api/concepts/:conceptId/materials (Teacher / Admin)
  static assignConceptMaterial(req: AuthenticatedRequest, res: Response) {
    const { conceptId } = req.params;
    const { materialType, topicId, syllabusId, organizationId, title, question, content, solution, answer, difficulty, expectedAnswer } = req.body;

    const concept = db.concepts.find((c) => c.id === conceptId);
    if (!concept) return sendError(res, 'Concept not found', 404);

    const createdBy = req.user?.userId || 'usr-teacher-1';
    const fallbackTopicId = topicId || 'top-ds-arrays';

    if (materialType === 'NOTE') {
      const newNote: Note = {
        id: `note-c-${Date.now()}`,
        topicId: fallbackTopicId,
        organizationId,
        syllabusId,
        syllabusTopicId: topicId,
        conceptId,
        title: title || `${concept.name} Notes`,
        content: content || '',
        createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.notes.push(newNote);
      return sendSuccess(res, newNote, 201, 'Note assigned to concept');
    }

    if (materialType === 'EXAMPLE') {
      const newExample: Example = {
        id: `ex-c-${Date.now()}`,
        topicId: fallbackTopicId,
        organizationId,
        syllabusId,
        syllabusTopicId: topicId,
        conceptId,
        question: question || 'Concept problem',
        solution: solution || '',
        difficulty: difficulty || 'MEDIUM',
        createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.examples.push(newExample);
      return sendSuccess(res, newExample, 201, 'Example assigned to concept');
    }

    if (materialType === 'VIVA') {
      const newViva: VivaQuestion = {
        id: `viva-c-${Date.now()}`,
        topicId: fallbackTopicId,
        organizationId,
        syllabusId,
        syllabusTopicId: topicId,
        conceptId,
        question: question || 'Concept viva question',
        expectedAnswer: expectedAnswer || '',
        createdBy,
        createdAt: new Date().toISOString(),
      };
      db.vivaQuestions.push(newViva);
      return sendSuccess(res, newViva, 201, 'Viva question assigned to concept');
    }

    if (materialType === 'FLASHCARD') {
      const newFc: Flashcard = {
        id: `fc-c-${Date.now()}`,
        topicId: fallbackTopicId,
        organizationId,
        syllabusId,
        syllabusTopicId: topicId,
        conceptId,
        question: question || 'Flashcard question',
        answer: answer || '',
        createdBy,
        createdAt: new Date().toISOString(),
      };
      db.flashcards.push(newFc);
      return sendSuccess(res, newFc, 201, 'Flashcard assigned to concept');
    }

    return sendError(res, 'Invalid materialType (must be NOTE, EXAMPLE, VIVA, or FLASHCARD)', 400);
  }

  // POST /api/concepts/map (Teacher / Admin)
  static mapTopicToConcept(req: AuthenticatedRequest, res: Response) {
    const { syllabusTopicId, conceptId } = req.body;
    if (!syllabusTopicId || !conceptId) {
      return sendError(res, 'syllabusTopicId and conceptId are required', 400);
    }

    const topic = db.syllabusTopics.find((t) => t.id === syllabusTopicId);
    if (!topic) return sendError(res, 'Syllabus topic not found', 404);

    const concept = db.concepts.find((c) => c.id === conceptId);
    if (!concept) return sendError(res, 'Concept not found', 404);

    const existing = db.syllabusTopicConcepts.find(
      (stc) => stc.syllabusTopicId === syllabusTopicId && stc.conceptId === conceptId
    );
    if (existing) {
      return sendError(res, 'Topic is already mapped to this concept', 409);
    }

    const mapping = {
      id: `stc-${Date.now()}`,
      syllabusTopicId,
      conceptId,
      createdAt: new Date().toISOString(),
    };

    db.syllabusTopicConcepts.push(mapping);
    return sendSuccess(res, { mapping, concept, topic }, 201, 'Mapping created successfully');
  }
}
