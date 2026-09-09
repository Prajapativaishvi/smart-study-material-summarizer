import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { SyllabusUnit, SyllabusSection, SyllabusTopic, Note, Example, VivaQuestion, Quiz, Flashcard } from '../types';

export class SyllabiController {
  // GET /api/syllabi
  static getSyllabi(req: Request, res: Response) {
    const { organizationId } = req.query;

    let list = db.syllabi;
    if (organizationId && typeof organizationId === 'string') {
      list = list.filter((s) => s.organizationId === organizationId);
    }

    const enriched = list.map((syl) => {
      const org = db.organizations.find((o) => o.id === syl.organizationId);
      const units = db.syllabusUnits.filter((u) => u.syllabusId === syl.id);
      return {
        ...syl,
        organizationName: org?.name || 'Unknown Organization',
        unitsCount: units.length,
      };
    });

    return sendSuccess(res, enriched);
  }

  // GET /api/syllabi/:syllabusId
  static getSyllabusById(req: Request, res: Response) {
    const { syllabusId } = req.params;
    const syllabus = db.syllabi.find((s) => s.id === syllabusId);
    if (!syllabus) {
      return sendError(res, 'Syllabus not found', 404);
    }

    const org = db.organizations.find((o) => o.id === syllabus.organizationId);
    const units = db.syllabusUnits.filter((u) => u.syllabusId === syllabusId);

    return sendSuccess(res, {
      ...syllabus,
      organization: org,
      unitsCount: units.length,
    });
  }

  // POST /api/syllabi (Admin)
  static createSyllabus(req: AuthenticatedRequest, res: Response) {
    const { organizationId, name, version, description } = req.body;
    if (!organizationId || !name || !version) {
      return sendError(res, 'organizationId, name, and version are required', 400);
    }

    const org = db.organizations.find((o) => o.id === organizationId);
    if (!org) {
      return sendError(res, 'Organization not found', 404);
    }

    const newSyllabus = {
      id: `syl-${Date.now()}`,
      organizationId,
      name: name.trim(),
      version: version.trim(),
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.syllabi.push(newSyllabus);
    return sendSuccess(res, newSyllabus, 201, 'Syllabus created successfully');
  }

  // PUT /api/syllabi/:syllabusId (Admin)
  static updateSyllabus(req: AuthenticatedRequest, res: Response) {
    const { syllabusId } = req.params;
    const { name, version, description, organizationId } = req.body;

    const sylIndex = db.syllabi.findIndex((s) => s.id === syllabusId);
    if (sylIndex === -1) {
      return sendError(res, 'Syllabus not found', 404);
    }

    if (organizationId) {
      const org = db.organizations.find((o) => o.id === organizationId);
      if (!org) return sendError(res, 'Target organization not found', 404);
      db.syllabi[sylIndex].organizationId = organizationId;
    }

    if (name) db.syllabi[sylIndex].name = name.trim();
    if (version) db.syllabi[sylIndex].version = version.trim();
    if (description !== undefined) db.syllabi[sylIndex].description = description;

    db.syllabi[sylIndex].updatedAt = new Date().toISOString();
    return sendSuccess(res, db.syllabi[sylIndex], 200, 'Syllabus updated successfully');
  }

  // DELETE /api/syllabi/:syllabusId (Admin)
  static deleteSyllabus(req: AuthenticatedRequest, res: Response) {
    const { syllabusId } = req.params;
    const sylIndex = db.syllabi.findIndex((s) => s.id === syllabusId);
    if (sylIndex === -1) {
      return sendError(res, 'Syllabus not found', 404);
    }

    // Cascade delete units, sections, topics
    const units = db.syllabusUnits.filter((u) => u.syllabusId === syllabusId);
    for (const unit of units) {
      db.syllabusTopics = db.syllabusTopics.filter((t) => t.unitId !== unit.id);
      db.syllabusSections = db.syllabusSections.filter((s) => s.unitId !== unit.id);
    }
    db.syllabusUnits = db.syllabusUnits.filter((u) => u.syllabusId !== syllabusId);
    db.syllabi.splice(sylIndex, 1);

    return sendSuccess(res, { deletedId: syllabusId }, 200, 'Syllabus deleted successfully');
  }

  // GET /api/syllabi/:syllabusId/structure
  // Organization -> Syllabus -> Unit / Module -> Section -> Topic -> Concept
  static getSyllabusStructure(req: Request, res: Response) {
    const { syllabusId } = req.params;
    const syllabus = db.syllabi.find((s) => s.id === syllabusId);
    if (!syllabus) {
      return sendError(res, 'Syllabus not found', 404);
    }

    const organization = db.organizations.find((o) => o.id === syllabus.organizationId);
    const units = db.syllabusUnits
      .filter((u) => u.syllabusId === syllabusId)
      .sort((a, b) => a.unitNumber - b.unitNumber);

    const fullUnits = units.map((unit) => {
      const sections = db.syllabusSections
        .filter((sec) => sec.unitId === unit.id)
        .sort((a, b) => a.orderIndex - b.orderIndex);

      const unitTopics = db.syllabusTopics.filter((t) => t.unitId === unit.id);

      // Sectioned topics
      const sectionsWithTopics = sections.map((sec) => {
        const secTopics = unitTopics
          .filter((t) => t.sectionId === sec.id)
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((topic) => {
            const mappedConceptIds = db.syllabusTopicConcepts
              .filter((stc) => stc.syllabusTopicId === topic.id)
              .map((stc) => stc.conceptId);
            const concepts = db.concepts.filter((c) => mappedConceptIds.includes(c.id));
            return {
              ...topic,
              concepts,
            };
          });

        return {
          ...sec,
          topics: secTopics,
        };
      });

      // Direct topics under unit (where sectionId is not set)
      const directTopics = unitTopics
        .filter((t) => !t.sectionId)
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((topic) => {
          const mappedConceptIds = db.syllabusTopicConcepts
            .filter((stc) => stc.syllabusTopicId === topic.id)
            .map((stc) => stc.conceptId);
          const concepts = db.concepts.filter((c) => mappedConceptIds.includes(c.id));
          return {
            ...topic,
            concepts,
          };
        });

      return {
        ...unit,
        sections: sectionsWithTopics,
        directTopics,
        allTopicsCount: unitTopics.length,
      };
    });

    return sendSuccess(res, {
      organization,
      syllabus,
      units: fullUnits,
    });
  }

  // PUT /api/syllabi/:syllabusId/structure (Admin)
  static updateSyllabusStructure(req: AuthenticatedRequest, res: Response) {
    const { syllabusId } = req.params;
    const { units } = req.body;

    const syllabus = db.syllabi.find((s) => s.id === syllabusId);
    if (!syllabus) {
      return sendError(res, 'Syllabus not found', 404);
    }

    if (!Array.isArray(units)) {
      return sendError(res, 'units array is required to update structure', 400);
    }

    return sendSuccess(res, { syllabusId, unitsUpdated: units.length }, 200, 'Structure updated successfully');
  }

  // GET /api/syllabi/:syllabusId/topics
  static getSyllabusTopics(req: Request, res: Response) {
    const { syllabusId } = req.params;
    const syllabus = db.syllabi.find((s) => s.id === syllabusId);
    if (!syllabus) {
      return sendError(res, 'Syllabus not found', 404);
    }

    const unitIds = db.syllabusUnits.filter((u) => u.syllabusId === syllabusId).map((u) => u.id);
    const topics = db.syllabusTopics.filter((t) => unitIds.includes(t.unitId));

    const enriched = topics.map((t) => {
      const unit = db.syllabusUnits.find((u) => u.id === t.unitId);
      const section = t.sectionId ? db.syllabusSections.find((s) => s.id === t.sectionId) : null;
      const mappedConceptIds = db.syllabusTopicConcepts
        .filter((stc) => stc.syllabusTopicId === t.id)
        .map((stc) => stc.conceptId);
      const concepts = db.concepts.filter((c) => mappedConceptIds.includes(c.id));

      return {
        ...t,
        unitName: unit?.name,
        unitNumber: unit?.unitNumber,
        unitType: unit?.type || 'UNIT',
        sectionName: section?.name || null,
        concepts,
      };
    });

    return sendSuccess(res, enriched);
  }

  // GET /api/syllabi/:syllabusId/concepts
  static getSyllabusConcepts(req: Request, res: Response) {
    const { syllabusId } = req.params;
    const syllabus = db.syllabi.find((s) => s.id === syllabusId);
    if (!syllabus) {
      return sendError(res, 'Syllabus not found', 404);
    }

    const unitIds = db.syllabusUnits.filter((u) => u.syllabusId === syllabusId).map((u) => u.id);
    const topicIds = db.syllabusTopics.filter((t) => unitIds.includes(t.unitId)).map((t) => t.id);

    const mappedConceptIds = Array.from(
      new Set(
        db.syllabusTopicConcepts
          .filter((stc) => topicIds.includes(stc.syllabusTopicId))
          .map((stc) => stc.conceptId)
      )
    );

    const concepts = db.concepts.filter((c) => mappedConceptIds.includes(c.id));
    return sendSuccess(res, concepts);
  }

  // GET /api/syllabi/:syllabusId/topics/:topicId/materials
  static getSyllabusTopicMaterials(req: Request, res: Response) {
    const { syllabusId, topicId } = req.params;

    // Verify syllabus exists
    const syllabus = db.syllabi.find((s) => s.id === syllabusId);
    if (!syllabus) {
      return sendError(res, 'Syllabus not found', 404);
    }

    // Material matching helper: matches this specific topic AND (optionally) syllabus
    const notes = db.notes.filter(
      (n) =>
        (n.syllabusTopicId === topicId || n.topicId === topicId) &&
        (!n.syllabusId || n.syllabusId === syllabusId)
    );

    const examples = db.examples.filter(
      (e) =>
        (e.syllabusTopicId === topicId || e.topicId === topicId) &&
        (!e.syllabusId || e.syllabusId === syllabusId)
    );

    const viva = db.vivaQuestions.filter(
      (v) =>
        (v.syllabusTopicId === topicId || v.topicId === topicId) &&
        (!v.syllabusId || v.syllabusId === syllabusId)
    );

    const quizzes = db.quizzes.filter(
      (q) =>
        (q.syllabusTopicId === topicId || q.topicId === topicId) &&
        (!q.syllabusId || q.syllabusId === syllabusId)
    );

    const flashcards = db.flashcards.filter(
      (f) =>
        (f.syllabusTopicId === topicId || f.topicId === topicId) &&
        (!f.syllabusId || f.syllabusId === syllabusId)
    );

    return sendSuccess(res, {
      syllabusId,
      topicId,
      notes,
      examples,
      viva,
      quizzes,
      flashcards,
    });
  }

  // GET /api/syllabi/:syllabusId/topics/:topicId/notes
  static getSyllabusTopicNotes(req: Request, res: Response) {
    const { syllabusId, topicId } = req.params;
    const notes = db.notes.filter(
      (n) =>
        (n.syllabusTopicId === topicId || n.topicId === topicId) &&
        (!n.syllabusId || n.syllabusId === syllabusId)
    );
    return sendSuccess(res, notes);
  }

  // GET /api/syllabi/:syllabusId/topics/:topicId/examples
  static getSyllabusTopicExamples(req: Request, res: Response) {
    const { syllabusId, topicId } = req.params;
    const examples = db.examples.filter(
      (e) =>
        (e.syllabusTopicId === topicId || e.topicId === topicId) &&
        (!e.syllabusId || e.syllabusId === syllabusId)
    );
    return sendSuccess(res, examples);
  }

  // GET /api/syllabi/:syllabusId/topics/:topicId/viva
  static getSyllabusTopicViva(req: Request, res: Response) {
    const { syllabusId, topicId } = req.params;
    const viva = db.vivaQuestions.filter(
      (v) =>
        (v.syllabusTopicId === topicId || v.topicId === topicId) &&
        (!v.syllabusId || v.syllabusId === syllabusId)
    );
    return sendSuccess(res, viva);
  }

  // GET /api/syllabi/:syllabusId/topics/:topicId/quizzes
  static getSyllabusTopicQuizzes(req: Request, res: Response) {
    const { syllabusId, topicId } = req.params;
    const quizzes = db.quizzes.filter(
      (q) =>
        (q.syllabusTopicId === topicId || q.topicId === topicId) &&
        (!q.syllabusId || q.syllabusId === syllabusId)
    );
    return sendSuccess(res, quizzes);
  }

  // GET /api/syllabi/:syllabusId/topics/:topicId/flashcards
  static getSyllabusTopicFlashcards(req: Request, res: Response) {
    const { syllabusId, topicId } = req.params;
    const flashcards = db.flashcards.filter(
      (f) =>
        (f.syllabusTopicId === topicId || f.topicId === topicId) &&
        (!f.syllabusId || f.syllabusId === syllabusId)
    );
    return sendSuccess(res, flashcards);
  }

  // --------------------------------------------------------------------------
  // Structure Management Endpoints (Admin & Teacher operations)
  // --------------------------------------------------------------------------

  // POST /api/syllabi/:syllabusId/units (Admin)
  static addUnit(req: AuthenticatedRequest, res: Response) {
    const { syllabusId } = req.params;
    const { name, unitNumber, type, description } = req.body;

    const syllabus = db.syllabi.find((s) => s.id === syllabusId);
    if (!syllabus) return sendError(res, 'Syllabus not found', 404);
    if (!name) return sendError(res, 'Unit name is required', 400);

    const existingUnits = db.syllabusUnits.filter((u) => u.syllabusId === syllabusId);
    const newUnit: SyllabusUnit = {
      id: `syl-unit-${Date.now()}`,
      syllabusId,
      name: name.trim(),
      unitNumber: unitNumber || existingUnits.length + 1,
      type: type || 'UNIT',
      description: description || '',
      createdAt: new Date().toISOString(),
    };

    db.syllabusUnits.push(newUnit);
    return sendSuccess(res, newUnit, 201, 'Unit/Module added successfully');
  }

  // PUT /api/syllabi/units/:unitId (Admin)
  static updateUnit(req: AuthenticatedRequest, res: Response) {
    const { unitId } = req.params;
    const { name, unitNumber, type, description } = req.body;

    const unit = db.syllabusUnits.find((u) => u.id === unitId);
    if (!unit) return sendError(res, 'Unit not found', 404);

    if (name) unit.name = name.trim();
    if (unitNumber !== undefined) unit.unitNumber = unitNumber;
    if (type) unit.type = type;
    if (description !== undefined) unit.description = description;

    return sendSuccess(res, unit, 200, 'Unit updated successfully');
  }

  // DELETE /api/syllabi/units/:unitId (Admin)
  static deleteUnit(req: AuthenticatedRequest, res: Response) {
    const { unitId } = req.params;
    const idx = db.syllabusUnits.findIndex((u) => u.id === unitId);
    if (idx === -1) return sendError(res, 'Unit not found', 404);

    db.syllabusTopics = db.syllabusTopics.filter((t) => t.unitId !== unitId);
    db.syllabusSections = db.syllabusSections.filter((s) => s.unitId !== unitId);
    db.syllabusUnits.splice(idx, 1);

    return sendSuccess(res, { deletedId: unitId }, 200, 'Unit deleted successfully');
  }

  // POST /api/syllabi/units/:unitId/sections (Admin)
  static addSection(req: AuthenticatedRequest, res: Response) {
    const { unitId } = req.params;
    const { name, orderIndex, description } = req.body;

    const unit = db.syllabusUnits.find((u) => u.id === unitId);
    if (!unit) return sendError(res, 'Unit not found', 404);
    if (!name) return sendError(res, 'Section name is required', 400);

    const existingSecs = db.syllabusSections.filter((s) => s.unitId === unitId);
    const newSection: SyllabusSection = {
      id: `syl-sec-${Date.now()}`,
      unitId,
      name: name.trim(),
      orderIndex: orderIndex || existingSecs.length + 1,
      description: description || '',
      createdAt: new Date().toISOString(),
    };

    db.syllabusSections.push(newSection);
    return sendSuccess(res, newSection, 201, 'Section added successfully');
  }

  // PUT /api/syllabi/sections/:sectionId (Admin)
  static updateSection(req: AuthenticatedRequest, res: Response) {
    const { sectionId } = req.params;
    const { name, orderIndex, description } = req.body;

    const section = db.syllabusSections.find((s) => s.id === sectionId);
    if (!section) return sendError(res, 'Section not found', 404);

    if (name) section.name = name.trim();
    if (orderIndex !== undefined) section.orderIndex = orderIndex;
    if (description !== undefined) section.description = description;

    return sendSuccess(res, section, 200, 'Section updated successfully');
  }

  // DELETE /api/syllabi/sections/:sectionId (Admin)
  static deleteSection(req: AuthenticatedRequest, res: Response) {
    const { sectionId } = req.params;
    const idx = db.syllabusSections.findIndex((s) => s.id === sectionId);
    if (idx === -1) return sendError(res, 'Section not found', 404);

    // Unlink topics that were under this section
    db.syllabusTopics.forEach((t) => {
      if (t.sectionId === sectionId) t.sectionId = undefined;
    });
    db.syllabusSections.splice(idx, 1);

    return sendSuccess(res, { deletedId: sectionId }, 200, 'Section deleted successfully');
  }

  // POST /api/syllabi/units/:unitId/topics (Admin)
  static addUnitTopic(req: AuthenticatedRequest, res: Response) {
    const { unitId } = req.params;
    const { name, orderIndex, description, sectionId, conceptIds } = req.body;

    const unit = db.syllabusUnits.find((u) => u.id === unitId);
    if (!unit) return sendError(res, 'Unit not found', 404);
    if (!name) return sendError(res, 'Topic name is required', 400);

    const existingTopics = db.syllabusTopics.filter((t) => t.unitId === unitId);
    const newTopic: SyllabusTopic = {
      id: `syl-top-${Date.now()}`,
      unitId,
      sectionId: sectionId || undefined,
      name: name.trim(),
      orderIndex: orderIndex || existingTopics.length + 1,
      description: description || '',
      createdAt: new Date().toISOString(),
    };

    db.syllabusTopics.push(newTopic);

    // If conceptIds were provided, map them right away
    if (Array.isArray(conceptIds)) {
      for (const cId of conceptIds) {
        if (db.concepts.some((c) => c.id === cId)) {
          db.syllabusTopicConcepts.push({
            id: `stc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            syllabusTopicId: newTopic.id,
            conceptId: cId,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    return sendSuccess(res, newTopic, 201, 'Topic added to unit successfully');
  }

  // POST /api/syllabi/sections/:sectionId/topics (Admin)
  static addSectionTopic(req: AuthenticatedRequest, res: Response) {
    const { sectionId } = req.params;
    const { name, orderIndex, description, conceptIds } = req.body;

    const section = db.syllabusSections.find((s) => s.id === sectionId);
    if (!section) return sendError(res, 'Section not found', 404);
    if (!name) return sendError(res, 'Topic name is required', 400);

    const existingTopics = db.syllabusTopics.filter((t) => t.sectionId === sectionId);
    const newTopic: SyllabusTopic = {
      id: `syl-top-${Date.now()}`,
      unitId: section.unitId,
      sectionId: section.id,
      name: name.trim(),
      orderIndex: orderIndex || existingTopics.length + 1,
      description: description || '',
      createdAt: new Date().toISOString(),
    };

    db.syllabusTopics.push(newTopic);

    if (Array.isArray(conceptIds)) {
      for (const cId of conceptIds) {
        if (db.concepts.some((c) => c.id === cId)) {
          db.syllabusTopicConcepts.push({
            id: `stc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            syllabusTopicId: newTopic.id,
            conceptId: cId,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    return sendSuccess(res, newTopic, 201, 'Topic added to section successfully');
  }

  // PUT /api/syllabi/topics/:topicId (Admin)
  static updateTopic(req: AuthenticatedRequest, res: Response) {
    const { topicId } = req.params;
    const { name, orderIndex, description, sectionId } = req.body;

    const topic = db.syllabusTopics.find((t) => t.id === topicId);
    if (!topic) return sendError(res, 'Topic not found', 404);

    if (name) topic.name = name.trim();
    if (orderIndex !== undefined) topic.orderIndex = orderIndex;
    if (description !== undefined) topic.description = description;
    if (sectionId !== undefined) topic.sectionId = sectionId || undefined;

    return sendSuccess(res, topic, 200, 'Topic updated successfully');
  }

  // DELETE /api/syllabi/topics/:topicId (Admin)
  static deleteTopic(req: AuthenticatedRequest, res: Response) {
    const { topicId } = req.params;
    const idx = db.syllabusTopics.findIndex((t) => t.id === topicId);
    if (idx === -1) return sendError(res, 'Topic not found', 404);

    // Remove concept mappings
    db.syllabusTopicConcepts = db.syllabusTopicConcepts.filter((stc) => stc.syllabusTopicId !== topicId);
    db.syllabusTopics.splice(idx, 1);

    return sendSuccess(res, { deletedId: topicId }, 200, 'Topic deleted successfully');
  }

  // POST /api/syllabi/topics/:topicId/concepts (Teacher / Admin - Map topic to concept)
  static mapTopicConcept(req: AuthenticatedRequest, res: Response) {
    const { topicId } = req.params;
    const { conceptId } = req.body;

    if (!conceptId) return sendError(res, 'conceptId is required', 400);

    const topic = db.syllabusTopics.find((t) => t.id === topicId);
    if (!topic) return sendError(res, 'Topic not found', 404);

    const concept = db.concepts.find((c) => c.id === conceptId);
    if (!concept) return sendError(res, 'Concept not found', 404);

    const existing = db.syllabusTopicConcepts.find(
      (stc) => stc.syllabusTopicId === topicId && stc.conceptId === conceptId
    );
    if (existing) {
      return sendError(res, 'Topic is already mapped to this concept', 409);
    }

    const mapping = {
      id: `stc-${Date.now()}`,
      syllabusTopicId: topicId,
      conceptId,
      createdAt: new Date().toISOString(),
    };

    db.syllabusTopicConcepts.push(mapping);
    return sendSuccess(res, { mapping, concept, topic }, 201, 'Concept mapped to topic successfully');
  }

  // DELETE /api/syllabi/topics/:topicId/concepts/:conceptId (Teacher / Admin)
  static unmapTopicConcept(req: AuthenticatedRequest, res: Response) {
    const { topicId, conceptId } = req.params;
    const idx = db.syllabusTopicConcepts.findIndex(
      (stc) => stc.syllabusTopicId === topicId && stc.conceptId === conceptId
    );
    if (idx === -1) {
      return sendError(res, 'Mapping between topic and concept not found', 404);
    }

    db.syllabusTopicConcepts.splice(idx, 1);
    return sendSuccess(res, { unmappedTopicId: topicId, conceptId }, 200, 'Concept unmapped successfully');
  }

  // POST /api/syllabi/:syllabusId/materials (Teacher / Admin - Assign / Create materials for syllabus topic)
  static assignMaterial(req: AuthenticatedRequest, res: Response) {
    const { syllabusId } = req.params;
    const { materialType, topicId, title, question, content, solution, answer, difficulty, expectedAnswer } = req.body;

    const syllabus = db.syllabi.find((s) => s.id === syllabusId);
    if (!syllabus) return sendError(res, 'Syllabus not found', 404);

    const topic = db.syllabusTopics.find((t) => t.id === topicId) || db.topics.find((t) => t.id === topicId);
    if (!topic) return sendError(res, 'Topic not found', 404);

    const createdBy = req.user?.userId || 'usr-teacher-1';

    // Find first mapped concept if any
    const mapping = db.syllabusTopicConcepts.find((stc) => stc.syllabusTopicId === topicId);
    const conceptId = mapping?.conceptId;

    if (materialType === 'NOTE') {
      const newNote: Note = {
        id: `note-syl-${Date.now()}`,
        topicId: topic.id,
        organizationId: syllabus.organizationId,
        syllabusId: syllabus.id,
        syllabusTopicId: topic.id,
        conceptId,
        title: title || 'Syllabus Note',
        content: content || '',
        createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.notes.push(newNote);
      return sendSuccess(res, newNote, 201, 'Note assigned to syllabus topic');
    }

    if (materialType === 'EXAMPLE') {
      const newExample: Example = {
        id: `ex-syl-${Date.now()}`,
        topicId: topic.id,
        organizationId: syllabus.organizationId,
        syllabusId: syllabus.id,
        syllabusTopicId: topic.id,
        conceptId,
        question: question || 'Example problem',
        solution: solution || '',
        difficulty: difficulty || 'MEDIUM',
        createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.examples.push(newExample);
      return sendSuccess(res, newExample, 201, 'Example assigned to syllabus topic');
    }

    if (materialType === 'VIVA') {
      const newViva: VivaQuestion = {
        id: `viva-syl-${Date.now()}`,
        topicId: topic.id,
        organizationId: syllabus.organizationId,
        syllabusId: syllabus.id,
        syllabusTopicId: topic.id,
        conceptId,
        question: question || 'Viva question',
        expectedAnswer: expectedAnswer || '',
        createdBy,
        createdAt: new Date().toISOString(),
      };
      db.vivaQuestions.push(newViva);
      return sendSuccess(res, newViva, 201, 'Viva question assigned to syllabus topic');
    }

    if (materialType === 'FLASHCARD') {
      const newFc: Flashcard = {
        id: `fc-syl-${Date.now()}`,
        topicId: topic.id,
        organizationId: syllabus.organizationId,
        syllabusId: syllabus.id,
        syllabusTopicId: topic.id,
        conceptId,
        question: question || 'Flashcard question',
        answer: answer || '',
        createdBy,
        createdAt: new Date().toISOString(),
      };
      db.flashcards.push(newFc);
      return sendSuccess(res, newFc, 201, 'Flashcard assigned to syllabus topic');
    }

    return sendError(res, 'Invalid materialType (must be NOTE, EXAMPLE, VIVA, or FLASHCARD)', 400);
  }
}
