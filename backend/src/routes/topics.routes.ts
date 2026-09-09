import { Router } from 'express';
import { NotesController } from '../controllers/notes.controller';
import { ExamplesController } from '../controllers/examples.controller';
import { VivaController } from '../controllers/viva.controller';
import { QuizController } from '../controllers/quiz.controller';
import { FlashcardsController } from '../controllers/flashcards.controller';
import { optionalAuthenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/:topicId/notes', NotesController.getTopicNotes);
router.get('/:topicId/examples', ExamplesController.getTopicExamples);
router.get('/:topicId/viva', optionalAuthenticate, VivaController.getTopicViva);
router.get('/:topicId/quizzes', QuizController.getTopicQuizzes);
router.get('/:topicId/flashcards', optionalAuthenticate, FlashcardsController.getTopicFlashcards);

export default router;
