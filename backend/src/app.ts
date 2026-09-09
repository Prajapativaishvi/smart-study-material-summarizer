import express from 'express';
import cors from 'cors';
import { config } from './config';
import authRoutes from './routes/auth.routes';
import subjectsRoutes from './routes/subjects.routes';
import unitsRoutes from './routes/units.routes';
import topicsRoutes from './routes/topics.routes';
import notesRoutes from './routes/notes.routes';
import examplesRoutes from './routes/examples.routes';
import vivaRoutes from './routes/viva.routes';
import quizRoutes from './routes/quiz.routes';
import groupsRoutes from './routes/groups.routes';
import flashcardsRoutes from './routes/flashcards.routes';
import studentsRoutes from './routes/students.routes';
import organizationsRoutes from './routes/organizations.routes';
import syllabiRoutes from './routes/syllabi.routes';
import conceptsRoutes from './routes/concepts.routes';
import { errorHandler } from './middleware/errorHandler.middleware';

export function createApp() {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: config.FRONTEND_URL === '*' ? true : config.FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health API
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'StudyLens Backend API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // Mount API Routers
  app.use('/api/auth', authRoutes);
  app.use('/api/subjects', subjectsRoutes);
  app.use('/api/units', unitsRoutes);
  app.use('/api/topics', topicsRoutes);
  app.use('/api/notes', notesRoutes);
  app.use('/api/examples', examplesRoutes);
  app.use('/api/viva', vivaRoutes);
  app.use('/api/quizzes', quizRoutes);
  app.use('/api/groups', groupsRoutes);
  app.use('/api/flashcards', flashcardsRoutes);
  app.use('/api/students', studentsRoutes);
  app.use('/api/organizations', organizationsRoutes);
  app.use('/api/syllabi', syllabiRoutes);
  app.use('/api/concepts', conceptsRoutes);

  // Centralized Error Handler (for API errors)
  app.use(errorHandler);

  return app;
}
