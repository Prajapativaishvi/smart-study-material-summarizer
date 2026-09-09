import { Router } from 'express';
import { GroupsController } from '../controllers/groups.controller';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuthenticate, GroupsController.getGroups);
router.post('/', authenticate, GroupsController.createGroup);
router.get('/:groupId', optionalAuthenticate, GroupsController.getGroupById);
router.post('/:groupId/join', authenticate, GroupsController.joinGroup);
router.post('/:groupId/leave', authenticate, GroupsController.leaveGroup);
router.get('/:groupId/messages', optionalAuthenticate, GroupsController.getMessages);
router.post('/:groupId/messages', authenticate, GroupsController.postMessage);

export default router;
