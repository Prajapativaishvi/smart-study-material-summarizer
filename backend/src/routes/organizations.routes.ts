import { Router } from 'express';
import { OrganizationsController } from '../controllers/organizations.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', OrganizationsController.getOrganizations);
router.post('/', authenticate, requireRole('ADMIN'), OrganizationsController.createOrganization);
router.get('/:organizationId', OrganizationsController.getOrganizationById);
router.put('/:organizationId', authenticate, requireRole('ADMIN'), OrganizationsController.updateOrganization);
router.delete('/:organizationId', authenticate, requireRole('ADMIN'), OrganizationsController.deleteOrganization);
router.get('/:organizationId/syllabi', OrganizationsController.getOrganizationSyllabi);
router.post('/:organizationId/syllabi', authenticate, requireRole('ADMIN'), OrganizationsController.createOrganizationSyllabus);

export default router;
