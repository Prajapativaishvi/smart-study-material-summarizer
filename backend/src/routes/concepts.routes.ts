import { Router } from 'express';
import { ConceptsController } from '../controllers/concepts.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', ConceptsController.getConcepts);
router.post('/', authenticate, requireRole('ADMIN'), ConceptsController.createConcept);
router.post('/map', authenticate, requireRole('TEACHER', 'ADMIN'), ConceptsController.mapTopicToConcept);
router.get('/:conceptId', ConceptsController.getConceptById);
router.put('/:conceptId', authenticate, requireRole('ADMIN'), ConceptsController.updateConcept);
router.delete('/:conceptId', authenticate, requireRole('ADMIN'), ConceptsController.deleteConcept);
router.get('/:conceptId/materials', ConceptsController.getConceptMaterials);
router.post('/:conceptId/materials', authenticate, requireRole('TEACHER', 'ADMIN'), ConceptsController.assignConceptMaterial);

export default router;
