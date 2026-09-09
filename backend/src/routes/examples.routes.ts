import { Router } from 'express';
import { ExamplesController } from '../controllers/examples.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/:id', ExamplesController.getExampleById);
router.post('/', authenticate, requireRole('TEACHER', 'ADMIN'), ExamplesController.createExample);
router.put('/:id', authenticate, requireRole('TEACHER', 'ADMIN'), ExamplesController.updateExample);
router.delete('/:id', authenticate, requireRole('TEACHER', 'ADMIN'), ExamplesController.deleteExample);

export default router;
