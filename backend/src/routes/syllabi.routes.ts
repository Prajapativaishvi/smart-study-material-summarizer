import { Router } from 'express';
import { SyllabiController } from '../controllers/syllabi.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Base Syllabus Operations
router.get('/', SyllabiController.getSyllabi);
router.post('/', authenticate, requireRole('ADMIN'), SyllabiController.createSyllabus);
router.get('/:syllabusId', SyllabiController.getSyllabusById);
router.put('/:syllabusId', authenticate, requireRole('ADMIN'), SyllabiController.updateSyllabus);
router.delete('/:syllabusId', authenticate, requireRole('ADMIN'), SyllabiController.deleteSyllabus);

// Structure, Topics & Concepts
router.get('/:syllabusId/structure', SyllabiController.getSyllabusStructure);
router.put('/:syllabusId/structure', authenticate, requireRole('ADMIN'), SyllabiController.updateSyllabusStructure);
router.get('/:syllabusId/topics', SyllabiController.getSyllabusTopics);
router.get('/:syllabusId/concepts', SyllabiController.getSyllabusConcepts);

// Syllabus-Specific Study Materials
router.get('/:syllabusId/topics/:topicId/materials', SyllabiController.getSyllabusTopicMaterials);
router.get('/:syllabusId/topics/:topicId/notes', SyllabiController.getSyllabusTopicNotes);
router.get('/:syllabusId/topics/:topicId/examples', SyllabiController.getSyllabusTopicExamples);
router.get('/:syllabusId/topics/:topicId/viva', SyllabiController.getSyllabusTopicViva);
router.get('/:syllabusId/topics/:topicId/quizzes', SyllabiController.getSyllabusTopicQuizzes);
router.get('/:syllabusId/topics/:topicId/flashcards', SyllabiController.getSyllabusTopicFlashcards);
router.post('/:syllabusId/materials', authenticate, requireRole('TEACHER', 'ADMIN'), SyllabiController.assignMaterial);

// Structure Components Management (Units, Sections, Topics)
router.post('/:syllabusId/units', authenticate, requireRole('ADMIN'), SyllabiController.addUnit);
router.put('/units/:unitId', authenticate, requireRole('ADMIN'), SyllabiController.updateUnit);
router.delete('/units/:unitId', authenticate, requireRole('ADMIN'), SyllabiController.deleteUnit);

router.post('/units/:unitId/sections', authenticate, requireRole('ADMIN'), SyllabiController.addSection);
router.put('/sections/:sectionId', authenticate, requireRole('ADMIN'), SyllabiController.updateSection);
router.delete('/sections/:sectionId', authenticate, requireRole('ADMIN'), SyllabiController.deleteSection);

router.post('/units/:unitId/topics', authenticate, requireRole('ADMIN'), SyllabiController.addUnitTopic);
router.post('/sections/:sectionId/topics', authenticate, requireRole('ADMIN'), SyllabiController.addSectionTopic);
router.put('/topics/:topicId', authenticate, requireRole('ADMIN'), SyllabiController.updateTopic);
router.delete('/topics/:topicId', authenticate, requireRole('ADMIN'), SyllabiController.deleteTopic);

// Concept Mapping
router.post('/topics/:topicId/concepts', authenticate, requireRole('TEACHER', 'ADMIN'), SyllabiController.mapTopicConcept);
router.delete('/topics/:topicId/concepts/:conceptId', authenticate, requireRole('TEACHER', 'ADMIN'), SyllabiController.unmapTopicConcept);

export default router;
