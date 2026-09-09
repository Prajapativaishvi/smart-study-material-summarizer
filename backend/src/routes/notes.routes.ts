import { Router } from 'express';
import { NotesController } from '../controllers/notes.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/:noteId', NotesController.getNoteById);
router.post('/', authenticate, requireRole('TEACHER', 'ADMIN'), NotesController.createNote);
router.put('/:id', authenticate, requireRole('TEACHER', 'ADMIN'), NotesController.updateNote);
router.delete('/:id', authenticate, requireRole('TEACHER', 'ADMIN'), NotesController.deleteNote);

export default router;
