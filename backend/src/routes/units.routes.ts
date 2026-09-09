import { Router } from 'express';
import { SubjectsController } from '../controllers/subjects.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/:unitId/topics', SubjectsController.getUnitTopics);
router.post('/:unitId/topics', authenticate, requireRole('TEACHER', 'ADMIN'), SubjectsController.createTopic);

export default router;
