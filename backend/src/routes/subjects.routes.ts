import { Router } from 'express';
import { SubjectsController } from '../controllers/subjects.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', SubjectsController.getSubjects);
router.get('/:subjectId/units', SubjectsController.getSubjectUnits);
router.post('/', authenticate, requireRole('TEACHER', 'ADMIN'), SubjectsController.createSubject);
router.post('/:subjectId/units', authenticate, requireRole('TEACHER', 'ADMIN'), SubjectsController.createUnit);

export default router;
