import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Organization } from '../types';

export class OrganizationsController {
  // GET /api/organizations
  static getOrganizations(_req: Request, res: Response) {
    const list = db.organizations.map((org) => {
      const syllabi = db.syllabi.filter((s) => s.organizationId === org.id);
      return {
        ...org,
        syllabiCount: syllabi.length,
      };
    });
    return sendSuccess(res, list);
  }

  // GET /api/organizations/:organizationId
  static getOrganizationById(req: Request, res: Response) {
    const { organizationId } = req.params;
    const org = db.organizations.find((o) => o.id === organizationId);
    if (!org) {
      return sendError(res, 'Organization not found', 404);
    }

    const syllabi = db.syllabi.filter((s) => s.organizationId === org.id);
    return sendSuccess(res, {
      ...org,
      syllabi,
    });
  }

  // POST /api/organizations (Admin)
  static createOrganization(req: AuthenticatedRequest, res: Response) {
    const { name, type } = req.body;
    if (!name || !name.trim()) {
      return sendError(res, 'Organization name is required', 400);
    }

    const existing = db.organizations.find(
      (o) => o.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (existing) {
      return sendError(res, 'Organization with this name already exists', 409);
    }

    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: name.trim(),
      type: type || 'UNIVERSITY',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.organizations.push(newOrg);
    return sendSuccess(res, newOrg, 201, 'Organization created successfully');
  }

  // PUT /api/organizations/:organizationId (Admin)
  static updateOrganization(req: AuthenticatedRequest, res: Response) {
    const { organizationId } = req.params;
    const { name, type } = req.body;

    const orgIndex = db.organizations.findIndex((o) => o.id === organizationId);
    if (orgIndex === -1) {
      return sendError(res, 'Organization not found', 404);
    }

    if (name) {
      const duplicate = db.organizations.find(
        (o) => o.id !== organizationId && o.name.toLowerCase() === name.trim().toLowerCase()
      );
      if (duplicate) {
        return sendError(res, 'Another organization with this name already exists', 409);
      }
      db.organizations[orgIndex].name = name.trim();
    }

    if (type) {
      db.organizations[orgIndex].type = type;
    }

    db.organizations[orgIndex].updatedAt = new Date().toISOString();
    return sendSuccess(res, db.organizations[orgIndex], 200, 'Organization updated successfully');
  }

  // DELETE /api/organizations/:organizationId (Admin)
  static deleteOrganization(req: AuthenticatedRequest, res: Response) {
    const { organizationId } = req.params;
    const orgIndex = db.organizations.findIndex((o) => o.id === organizationId);
    if (orgIndex === -1) {
      return sendError(res, 'Organization not found', 404);
    }

    // Cascade delete associated syllabi and units
    const syllabiToDelete = db.syllabi.filter((s) => s.organizationId === organizationId);
    for (const syl of syllabiToDelete) {
      const unitsToDelete = db.syllabusUnits.filter((u) => u.syllabusId === syl.id);
      for (const unit of unitsToDelete) {
        db.syllabusTopics = db.syllabusTopics.filter((t) => t.unitId !== unit.id);
        db.syllabusSections = db.syllabusSections.filter((s) => s.unitId !== unit.id);
      }
      db.syllabusUnits = db.syllabusUnits.filter((u) => u.syllabusId !== syl.id);
    }
    db.syllabi = db.syllabi.filter((s) => s.organizationId !== organizationId);
    db.organizations.splice(orgIndex, 1);

    return sendSuccess(res, { deletedId: organizationId }, 200, 'Organization deleted successfully');
  }

  // GET /api/organizations/:organizationId/syllabi
  static getOrganizationSyllabi(req: Request, res: Response) {
    const { organizationId } = req.params;
    const org = db.organizations.find((o) => o.id === organizationId);
    if (!org) {
      return sendError(res, 'Organization not found', 404);
    }

    const syllabi = db.syllabi.filter((s) => s.organizationId === organizationId);
    return sendSuccess(res, syllabi);
  }

  // POST /api/organizations/:organizationId/syllabi (Admin)
  static createOrganizationSyllabus(req: AuthenticatedRequest, res: Response) {
    const { organizationId } = req.params;
    const { name, version, description } = req.body;

    const org = db.organizations.find((o) => o.id === organizationId);
    if (!org) {
      return sendError(res, 'Organization not found', 404);
    }

    if (!name || !version) {
      return sendError(res, 'Syllabus name and version are required', 400);
    }

    const newSyllabus = {
      id: `syl-${Date.now()}`,
      organizationId,
      name: name.trim(),
      version: version.trim(),
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.syllabi.push(newSyllabus);
    return sendSuccess(res, newSyllabus, 201, 'Syllabus created successfully');
  }
}
