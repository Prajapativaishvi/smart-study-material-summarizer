import { Router } from 'express';
import { VivaController } from '../controllers/viva.controller';
import { authenticate, requireRole, optionalAuthenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/attempts', optionalAuthenticate, VivaController.submitVivaAttempt);
router.post('/', authenticate, requireRole('TEACHER', 'ADMIN'), VivaController.createVivaQuestion);

export default router;
