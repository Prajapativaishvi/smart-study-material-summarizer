import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { VivaController } from '../controllers/viva.controller';
import { FlashcardsController } from '../controllers/flashcards.controller';
import { optionalAuthenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/:studentId/progress', optionalAuthenticate, ProgressController.getStudentProgress);
router.get('/:studentId/dashboard', optionalAuthenticate, ProgressController.getStudentDashboard);
router.get('/:studentId/syllabus', optionalAuthenticate, ProgressController.getStudentSyllabus);
router.put('/:studentId/syllabus', optionalAuthenticate, ProgressController.updateStudentSyllabus);
router.get('/:studentId/viva-attempts', optionalAuthenticate, VivaController.getStudentAttempts);
router.get('/:studentId/flashcard-progress', optionalAuthenticate, FlashcardsController.getStudentFlashcardProgress);
router.put('/:studentId/progress/:topicId', optionalAuthenticate, ProgressController.updateTopicProgress);

export default router;
