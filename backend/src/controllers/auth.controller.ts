import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import { validateEmail, validateRequiredFields } from '../validators';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Role, User } from '../types';

export class AuthController {
  static async register(req: Request, res: Response) {
    const { name, email, password, role } = req.body;

    const missing = validateRequiredFields(req.body, ['name', 'email', 'password']);
    if (missing) {
      return sendError(res, missing, 400);
    }

    if (!validateEmail(email)) {
      return sendError(res, 'Invalid email address format', 400);
    }

    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters long', 400);
    }

    const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return sendError(res, 'An account with this email address already exists.', 409);
    }

    const assignedRole: Role = (role && ['STUDENT', 'TEACHER', 'ADMIN'].includes(role.toUpperCase()))
      ? (role.toUpperCase() as Role)
      : 'STUDENT';

    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: assignedRole,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.users.push(newUser);

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    return sendSuccess(res, { user: safeUser, token }, 201, 'User registered successfully');
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const missing = validateRequiredFields(req.body, ['email', 'password']);
    if (missing) {
      return sendError(res, missing, 400);
    }

    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || !user.password) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return sendSuccess(res, { user: safeUser, token }, 200, 'Login successful');
  }

  static async me(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const user = db.users.find((u) => u.id === req.user!.userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return sendSuccess(res, { user: safeUser }, 200);
  }

  static async changePassword(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { currentPassword, newPassword } = req.body;
    const missing = validateRequiredFields(req.body, ['currentPassword', 'newPassword']);
    if (missing) {
      return sendError(res, missing, 400);
    }

    if (newPassword.length < 6) {
      return sendError(res, 'New password must be at least 6 characters long', 400);
    }

    const user = db.users.find((u) => u.id === req.user!.userId);
    if (!user || !user.password) {
      return sendError(res, 'User account not found', 404);
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return sendError(res, 'Current password is incorrect', 400);
    }

    user.password = await hashPassword(newPassword);
    user.updatedAt = new Date().toISOString();

    return sendSuccess(res, { message: 'Password updated successfully' }, 200);
  }

  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email || !validateEmail(email)) {
      return sendError(res, 'A valid email address is required', 400);
    }

    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    // For security, always respond with success even if user not found, but if found generate simulated reset instruction
    return sendSuccess(
      res,
      {
        message: 'Password reset instructions sent to your email.',
        deliveryMode: 'SIMULATED',
        resetToken: user ? `rst-${Date.now()}` : undefined,
      },
      200
    );
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { name, email, organizationId, syllabusId } = req.body;
    const user = db.users.find((u) => u.id === req.user!.userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      if (!validateEmail(email)) {
        return sendError(res, 'Invalid email address', 400);
      }
      const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== user.id);
      if (existing) {
        return sendError(res, 'Email is already taken by another account', 409);
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (organizationId !== undefined) user.organizationId = organizationId;
    if (syllabusId !== undefined) user.syllabusId = syllabusId;
    user.updatedAt = new Date().toISOString();

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      syllabusId: user.syllabusId,
      createdAt: user.createdAt,
    };

    return sendSuccess(res, { user: safeUser }, 200, 'Profile updated successfully');
  }
}
