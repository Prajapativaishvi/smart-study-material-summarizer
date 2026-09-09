import { Response } from 'express';
import { db } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { GroupMember, GroupMessage, StudyGroup } from '../types';

export class GroupsController {
  static getGroups(req: AuthenticatedRequest, res: Response) {
    const currentUserId = req.user?.userId;

    const groupsWithStats = db.studyGroups.map((g) => {
      const members = db.groupMembers.filter((m) => m.groupId === g.id);
      const messagesCount = db.groupMessages.filter((msg) => msg.groupId === g.id).length;
      const isMember = currentUserId ? members.some((m) => m.studentId === currentUserId) : false;

      return {
        ...g,
        membersCount: members.length,
        messagesCount,
        isMember,
      };
    });

    return sendSuccess(res, groupsWithStats);
  }

  static getGroupById(req: AuthenticatedRequest, res: Response) {
    const { groupId } = req.params;
    const group = db.studyGroups.find((g) => g.id === groupId);
    if (!group) {
      return sendError(res, 'Study group not found', 404);
    }

    const members = db.groupMembers
      .filter((m) => m.groupId === groupId)
      .map((m) => {
        const user = db.users.find((u) => u.id === m.studentId);
        return {
          id: m.id,
          studentId: m.studentId,
          name: user?.name || 'Student Member',
          email: user?.email,
          role: user?.role,
          joinedAt: m.joinedAt,
        };
      });

    return sendSuccess(res, {
      ...group,
      members,
    });
  }

  static createGroup(req: AuthenticatedRequest, res: Response) {
    const { name, description } = req.body;
    if (!name) {
      return sendError(res, 'Group name is required', 400);
    }

    const newGroup: StudyGroup = {
      id: `grp-${Date.now()}`,
      name,
      description: description || '',
      createdBy: req.user!.userId,
      createdAt: new Date().toISOString(),
    };

    db.studyGroups.push(newGroup);

    // Auto-join creator as initial member
    const member: GroupMember = {
      id: `gm-${Date.now()}`,
      groupId: newGroup.id,
      studentId: req.user!.userId,
      joinedAt: new Date().toISOString(),
    };
    db.groupMembers.push(member);

    return sendSuccess(res, newGroup, 201, 'Study group created successfully');
  }

  static joinGroup(req: AuthenticatedRequest, res: Response) {
    const { groupId } = req.params;
    const studentId = req.user!.userId;

    const group = db.studyGroups.find((g) => g.id === groupId);
    if (!group) {
      return sendError(res, 'Study group not found', 404);
    }

    const existingMember = db.groupMembers.find(
      (m) => m.groupId === groupId && m.studentId === studentId
    );
    if (existingMember) {
      return sendSuccess(res, existingMember, 200, 'Already a member of this group');
    }

    const newMember: GroupMember = {
      id: `gm-${Date.now()}`,
      groupId,
      studentId,
      joinedAt: new Date().toISOString(),
    };

    db.groupMembers.push(newMember);

    // Add automated system notice message
    db.groupMessages.push({
      id: `msg-${Date.now()}`,
      groupId,
      senderId: studentId,
      senderName: req.user!.name,
      message: `${req.user!.name} joined the study group.`,
      createdAt: new Date().toISOString(),
    });

    return sendSuccess(res, newMember, 201, 'Joined study group successfully');
  }

  static leaveGroup(req: AuthenticatedRequest, res: Response) {
    const { groupId } = req.params;
    const studentId = req.user!.userId;

    const index = db.groupMembers.findIndex(
      (m) => m.groupId === groupId && m.studentId === studentId
    );
    if (index === -1) {
      return sendError(res, 'Not a member of this study group', 400);
    }

    db.groupMembers.splice(index, 1);
    return sendSuccess(res, { groupId, studentId }, 200, 'Left study group successfully');
  }

  static getMessages(req: AuthenticatedRequest, res: Response) {
    const { groupId } = req.params;
    const group = db.studyGroups.find((g) => g.id === groupId);
    if (!group) {
      return sendError(res, 'Study group not found', 404);
    }

    const messages = db.groupMessages
      .filter((m) => m.groupId === groupId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return sendSuccess(res, messages);
  }

  static postMessage(req: AuthenticatedRequest, res: Response) {
    const { groupId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return sendError(res, 'Message body cannot be empty', 400);
    }

    const group = db.studyGroups.find((g) => g.id === groupId);
    if (!group) {
      return sendError(res, 'Study group not found', 404);
    }

    const newMsg: GroupMessage = {
      id: `msg-${Date.now()}`,
      groupId,
      senderId: req.user!.userId,
      senderName: req.user!.name,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    db.groupMessages.push(newMsg);
    return sendSuccess(res, newMsg, 201, 'Message posted');
  }
}
