import { Router } from 'express';
import { QuizController } from '../controllers/quiz.controller';
import { authenticate, requireRole, optionalAuthenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/:quizId', optionalAuthenticate, QuizController.getQuizById);
router.post('/:quizId/attempt', optionalAuthenticate, QuizController.attemptQuiz);
router.post('/', authenticate, requireRole('TEACHER', 'ADMIN'), QuizController.createQuiz);
router.put('/:quizId', authenticate, requireRole('TEACHER', 'ADMIN'), QuizController.updateQuiz);
router.delete('/:quizId', authenticate, requireRole('TEACHER', 'ADMIN'), QuizController.deleteQuiz);

export default router;
