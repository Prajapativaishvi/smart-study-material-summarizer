import React, { useState } from 'react';
import {
  ActivePage,
  StudyMaterial,
  UserProfile,
  RevisionItem,
  StudyHistoryItem,
  WorkspaceTab,
  PortalRole,
} from './types';
import {
  INITIAL_STUDY_MATERIALS,
  MOCK_USER_PROFILE,
  MOCK_REVISION_ITEMS,
  MOCK_STUDY_HISTORY,
} from './data/mockData';
import { ToastProvider, useToast } from './components/common/Toast';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { AddMaterialModal } from './components/modals/AddMaterialModal';
import { LandingPage } from './components/views/LandingPage';
import { DashboardView } from './components/views/DashboardView';
import { MaterialsView } from './components/views/MaterialsView';
import { StudyWorkspaceView } from './components/views/StudyWorkspaceView';
import { FlashcardsPageView } from './components/views/FlashcardsPageView';
import { QuizzesPageView } from './components/views/QuizzesPageView';
import { ConceptMapsPageView } from './components/views/ConceptMapsPageView';
import { RevisionCenterView } from './components/views/RevisionCenterView';
import { StudyHistoryView } from './components/views/StudyHistoryView';
import { SettingsView } from './components/views/SettingsView';
import { TeacherPortalView } from './components/portals/TeacherPortalView';
import { AdminPortalView } from './components/portals/AdminPortalView';
import { ParentPortalView } from './components/portals/ParentPortalView';

function StudyLensApp() {
  const { success, info } = useToast();

  // Navigation State
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [currentRole, setCurrentRole] = useState<PortalRole>('student');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Core Data State
  const [materials, setMaterials] = useState<StudyMaterial[]>(INITIAL_STUDY_MATERIALS);
  const [activeMaterial, setActiveMaterial] = useState<StudyMaterial>(
    INITIAL_STUDY_MATERIALS[0]
  );
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('overview');
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [revisionItems, setRevisionItems] = useState<RevisionItem[]>(MOCK_REVISION_ITEMS);
  const [historyItems, setHistoryItems] = useState<StudyHistoryItem[]>(MOCK_STUDY_HISTORY);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Role Switcher Handler
  const handleRoleSelect = (newRole: PortalRole) => {
    setCurrentRole(newRole);
    if (newRole === 'teacher') {
      setActivePage('teacher_overview');
      info('Teacher Portal', 'Switched to Faculty Dashboard.');
    } else if (newRole === 'admin') {
      setActivePage('admin_overview');
      info('Admin Portal', 'Switched to Institution Command Center.');
    } else if (newRole === 'parent') {
      setActivePage('parent_overview');
      info('Parent Portal', 'Switched to Guardian Monitoring Dashboard.');
    } else {
      setActivePage('dashboard');
      info('Student Portal', 'Switched back to Student Workspace.');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Safe Navigation with role auto-detection
  const handleNavigate = (page: ActivePage) => {
    if (page.startsWith('teacher_')) {
      setCurrentRole('teacher');
    } else if (page.startsWith('admin_')) {
      setCurrentRole('admin');
    } else if (page.startsWith('parent_')) {
      setCurrentRole('parent');
    } else if (
      page === 'dashboard' ||
      page === 'materials' ||
      page === 'workspace' ||
      page === 'flashcards' ||
      page === 'quizzes' ||
      page === 'concept_maps' ||
      page === 'concept_map' ||
      page === 'revision' ||
      page === 'history'
    ) {
      if (currentRole !== 'student') {
        setCurrentRole('student');
      }
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers
  const handleOpenWorkspace = (material: StudyMaterial, tab: WorkspaceTab = 'overview') => {
    setActiveMaterial(material);
    setWorkspaceTab(tab);
    handleNavigate('workspace');
  };

  const handleToggleFavorite = (materialId: string) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === materialId) {
          const updatedFav = !m.isFavorite;
          if (updatedFav) {
            success('Added to Favorites', `"${m.title}" is now starred in your library.`);
          } else {
            info('Removed from Favorites', `"${m.title}" unstarred.`);
          }
          return { ...m, isFavorite: updatedFav };
        }
        return m;
      })
    );

    // Also update activeMaterial if currently open
    if (activeMaterial.id === materialId) {
      setActiveMaterial((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
    }
  };

  const handleUpdateConcept = (materialId: string, conceptId: string) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === materialId) {
          const updatedConcepts = m.keyConcepts.map((c) =>
            c.id === conceptId ? { ...c, isUnderstood: !c.isUnderstood } : c
          );
          return { ...m, keyConcepts: updatedConcepts };
        }
        return m;
      })
    );

    if (activeMaterial.id === materialId) {
      setActiveMaterial((prev) => ({
        ...prev,
        keyConcepts: prev.keyConcepts.map((c) =>
          c.id === conceptId ? { ...c, isUnderstood: !c.isUnderstood } : c
        ),
      }));
    }
  };

  const handleMaterialAdded = (newMaterial: StudyMaterial) => {
    // Prepend to materials
    setMaterials((prev) => [newMaterial, ...prev]);

    // Update user profile counts
    setUserProfile((prev) => ({
      ...prev,
      materialsCount: prev.materialsCount + 1,
    }));

    // Add entry to study history
    const historyEntry: StudyHistoryItem = {
      id: `hist-${Date.now()}`,
      title: `${newMaterial.subject} — ${newMaterial.topic}`,
      subject: newMaterial.subject,
      activityType: 'material_analyzed',
      detail: `Created new interactive study path with ${newMaterial.keyConcepts.length} concepts and ${newMaterial.flashcards.length} flashcards`,
      timestamp: 'Just now',
      dateGroup: 'Today',
    };
    setHistoryItems((prev) => [historyEntry, ...prev]);

    // Open newly generated material in workspace
    setActiveMaterial(newMaterial);
    setWorkspaceTab('overview');
    handleNavigate('workspace');

    success(
      'Study Material Processed!',
      `Generated interactive workspace for ${newMaterial.title}.`
    );
  };

  const handleResetDemoData = () => {
    setMaterials(INITIAL_STUDY_MATERIALS);
    setActiveMaterial(INITIAL_STUDY_MATERIALS[0]);
    setUserProfile(MOCK_USER_PROFILE);
    setRevisionItems(MOCK_REVISION_ITEMS);
    setHistoryItems(MOCK_STUDY_HISTORY);
    success('Reset Complete', 'Demo content restored to factory state.');
  };

  // If on landing page, display the public landing layout
  if (activePage === 'landing') {
    return (
      <LandingPage
        onEnterApp={() => {
          handleNavigate('dashboard');
        }}
      />
    );
  }

  // App Shell Layout (Sidebar + TopBar + Main View)
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Primary Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        userProfile={userProfile}
        currentRole={currentRole}
        onSelectRole={handleRoleSelect}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <TopBar
          userProfile={userProfile}
          materials={materials}
          currentRole={currentRole}
          onSelectRole={handleRoleSelect}
          onOpenMobileNav={() => setMobileSidebarOpen(true)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onSelectMaterial={(material) => handleOpenWorkspace(material, 'overview')}
          searchQuery={globalSearchQuery}
          setSearchQuery={setGlobalSearchQuery}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          {/* ======================================================== */}
          {/* 1. STUDENT PORTAL VIEWS */}
          {/* ======================================================== */}
          {activePage === 'dashboard' && (
            <DashboardView
              userProfile={userProfile}
              materials={materials}
              onOpenWorkspace={handleOpenWorkspace}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'materials' && (
            <MaterialsView
              materials={materials}
              onOpenWorkspace={handleOpenWorkspace}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activePage === 'workspace' && (
            <StudyWorkspaceView
              material={activeMaterial}
              initialTab={workspaceTab}
              onBackToMaterials={() => handleNavigate('materials')}
              onToggleFavorite={handleToggleFavorite}
              onUpdateConcepts={handleUpdateConcept}
            />
          )}

          {activePage === 'flashcards' && (
            <FlashcardsPageView
              materials={materials}
              onOpenWorkspace={handleOpenWorkspace}
            />
          )}

          {activePage === 'quizzes' && (
            <QuizzesPageView
              materials={materials}
              onOpenWorkspace={handleOpenWorkspace}
            />
          )}

          {(activePage === 'concept_maps' || activePage === 'concept_map') && (
            <ConceptMapsPageView
              materials={materials}
              onOpenWorkspace={handleOpenWorkspace}
            />
          )}

          {activePage === 'revision' && (
            <RevisionCenterView
              revisionItems={revisionItems}
              materials={materials}
              onOpenWorkspace={handleOpenWorkspace}
            />
          )}

          {activePage === 'history' && (
            <StudyHistoryView historyItems={historyItems} />
          )}

          {activePage === 'settings' && (
            <SettingsView
              userProfile={userProfile}
              onUpdateProfile={(p) => setUserProfile(p)}
              onResetDemoData={handleResetDemoData}
            />
          )}

          {/* ======================================================== */}
          {/* 2. TEACHER PORTAL VIEWS */}
          {/* ======================================================== */}
          {activePage === 'teacher_overview' && <TeacherPortalView initialTab="overview" />}
          {activePage === 'teacher_materials' && <TeacherPortalView initialTab="materials" />}
          {activePage === 'teacher_quizzes' && <TeacherPortalView initialTab="quizzes" />}
          {activePage === 'teacher_assignments' && <TeacherPortalView initialTab="assignments" />}
          {activePage === 'teacher_performance' && <TeacherPortalView initialTab="performance" />}
          {activePage === 'teacher_weak_topics' && <TeacherPortalView initialTab="weak_topics" />}
          {activePage === 'teacher_progress' && <TeacherPortalView initialTab="progress" />}
          {activePage === 'teacher_activity' && <TeacherPortalView initialTab="activity" />}

          {/* ======================================================== */}
          {/* 3. ADMIN PORTAL VIEWS */}
          {/* ======================================================== */}
          {activePage === 'admin_overview' && <AdminPortalView initialTab="overview" />}
          {activePage === 'admin_stats' && <AdminPortalView initialTab="stats" />}
          {activePage === 'admin_students' && <AdminPortalView initialTab="students" />}
          {activePage === 'admin_teachers' && <AdminPortalView initialTab="teachers" />}
          {activePage === 'admin_courses' && <AdminPortalView initialTab="courses" />}
          {activePage === 'admin_materials' && <AdminPortalView initialTab="materials" />}
          {activePage === 'admin_activity' && <AdminPortalView initialTab="activity" />}
          {activePage === 'admin_analytics' && <AdminPortalView initialTab="analytics" />}

          {/* ======================================================== */}
          {/* 4. PARENT PORTAL VIEWS */}
          {/* ======================================================== */}
          {activePage === 'parent_overview' && <ParentPortalView initialTab="overview" />}
          {activePage === 'parent_progress' && <ParentPortalView initialTab="progress" />}
          {activePage === 'parent_quizzes' && <ParentPortalView initialTab="quizzes" />}
          {activePage === 'parent_activity' && <ParentPortalView initialTab="activity" />}
          {activePage === 'parent_weak_topics' && <ParentPortalView initialTab="weak_topics" />}
          {activePage === 'parent_revision' && <ParentPortalView initialTab="revision" />}
        </main>
      </div>

      {/* Add Study Material Modal */}
      <AddMaterialModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onMaterialAdded={handleMaterialAdded}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <StudyLensApp />
    </ToastProvider>
  );
}

