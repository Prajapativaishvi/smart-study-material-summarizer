import React, { useState } from 'react';
import {
  X,
  FileUp,
  FileText,
  AlignLeft,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileCode,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StudyMaterial } from '../../types';
import { analyzeMaterial, MaterialGenerationProgress } from '../../services/aiStudyService';
import { useToast } from '../common/Toast';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMaterialCreated: (material: StudyMaterial) => void;
}

type TabType = 'pdf' | 'notes' | 'text';

export const AddMaterialModal: React.FC<AddMaterialModalProps> = ({
  isOpen,
  onClose,
  onMaterialCreated,
}) => {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('pdf');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [pastedText, setPastedText] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<MaterialGenerationProgress>({
    stage: 'reading',
    message: 'Reading material...',
    progressPercentage: 15,
  });

  if (!isOpen) return null;

  const handleSelectSample = (sampleType: 'trees' | 'dbms' | 'physics') => {
    if (sampleType === 'trees') {
      setTitle('Data Structures — Binary Search Trees');
      setSubject('Data Structures');
      setSelectedFileName('Lecture_08_BinarySearchTrees.pdf');
      setPastedText(
        'A Binary Search Tree (BST) is a node-based binary tree data structure where each node has at most two children. For any given node N, all keys in its left subtree are less than N.key, and all keys in its right subtree are greater than N.key. In-order traversal of a BST produces elements in strictly ascending sorted order.'
      );
    } else if (sampleType === 'dbms') {
      setTitle('Database Systems — Normalization');
      setSubject('Computer Science');
      setSelectedFileName('Unit3_Relational_Normalization.pdf');
      setPastedText(
        'Database normalization is the process of structuring a relational database in accordance with a series of normal forms (1NF, 2NF, 3NF, BCNF) to reduce data redundancy and improve data integrity. An anomaly can occur during insert, update, or deletion if functional dependencies are violated.'
      );
    } else {
      setTitle('Engineering Physics — Quantum Harmonic Oscillator');
      setSubject('Engineering Physics');
      setSelectedFileName('QuantumMechanics_Lecture05.pdf');
      setPastedText(
        'The quantum harmonic oscillator is the quantum-mechanical analog of the classical harmonic oscillator. Because an arbitrary potential can usually be approximated as a harmonic potential at the vicinity of a stable equilibrium point, it is one of the most important model systems in quantum mechanics.'
      );
    }
  };

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);

    try {
      const finalTitle =
        title.trim() ||
        (selectedFileName ? selectedFileName.replace(/\.[^/.]+$/, '') : 'Study Material Unit');
      const finalSubject = subject || 'General Engineering';

      const newMaterial = await analyzeMaterial(
        {
          title: finalTitle,
          subject: finalSubject,
          type: activeTab,
          rawText: pastedText,
          fileName: selectedFileName || undefined,
        },
        (progress) => {
          setCurrentProgress(progress);
        }
      );

      success('Study Material Analyzed!', `Created workspace for ${newMaterial.title}`);
      setIsAnalyzing(false);
      onMaterialCreated(newMaterial);
      onClose();
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      id="add-study-material-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={!isAnalyzing ? onClose : undefined}
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Add Study Material</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                AI Powered
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Transform lectures, textbook chapters, or raw notes into an interactive workspace.
            </p>
          </div>
          {!isAnalyzing && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Analysis in Progress View */}
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="analyzing-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-10 px-4 flex flex-col items-center justify-center text-center space-y-6"
              >
                {/* Modern subtle pulse indicator */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl bg-blue-100 animate-ping opacity-30"></div>
                  <div className="relative w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Sparkles className="w-8 h-8 animate-spin" />
                  </div>
                </div>

                <div className="space-y-2 max-w-md">
                  <h3 className="text-lg font-bold text-slate-900">
                    Analyzing Material...
                  </h3>
                  <p className="text-sm text-blue-600 font-medium">
                    {currentProgress.message}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-md bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${currentProgress.progressPercentage}%` }}
                  />
                </div>

                {/* Stages List */}
                <div className="w-full max-w-sm grid grid-cols-2 gap-2 text-left text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        currentProgress.progressPercentage >= 25
                          ? 'text-emerald-500'
                          : 'text-slate-300'
                      }`}
                    />
                    <span>Reading material</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        currentProgress.progressPercentage >= 50
                          ? 'text-emerald-500'
                          : 'text-slate-300'
                      }`}
                    />
                    <span>Finding key concepts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        currentProgress.progressPercentage >= 75
                          ? 'text-emerald-500'
                          : 'text-slate-300'
                      }`}
                    />
                    <span>Organizing topics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        currentProgress.progressPercentage >= 95
                          ? 'text-emerald-500'
                          : 'text-slate-300'
                      }`}
                    />
                    <span>Preparing study tools</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Method Tabs */}
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setActiveTab('pdf')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'pdf'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileUp className="w-3.5 h-3.5" />
                    <span>Upload PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('notes')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'notes'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Upload Notes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'text'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    <span>Paste Text</span>
                  </button>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject / Course
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
                    >
                      <option value="Data Structures">Data Structures</option>
                      <option value="Engineering Mathematics">Engineering Mathematics</option>
                      <option value="C++ Programming">C++ Programming</option>
                      <option value="Digital Electronics">Digital Electronics</option>
                      <option value="Computer Fundamentals">Computer Fundamentals</option>
                      <option value="Database Systems">Database Systems</option>
                      <option value="Physics">Physics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Topic Title (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Binary Search Trees"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>

                {/* Tab 1: Upload PDF */}
                {activeTab === 'pdf' && (
                  <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      id="pdf-file-input"
                      accept=".pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFileName(e.target.files[0].name);
                          if (!title) {
                            setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                          }
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="pdf-file-input"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                        <FileUp className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800">
                        {selectedFileName ? (
                          <span className="text-blue-600">{selectedFileName}</span>
                        ) : (
                          'Drop your lecture PDF here or click to browse'
                        )}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Supports college slides, lecture notes, textbook chapters (up to 50MB)
                      </p>
                    </label>
                  </div>
                )}

                {/* Tab 2: Upload Notes */}
                {activeTab === 'notes' && (
                  <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      id="notes-file-input"
                      accept=".docx,.txt,.md"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFileName(e.target.files[0].name);
                          if (!title) {
                            setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                          }
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="notes-file-input"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                        <FileCode className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800">
                        {selectedFileName ? (
                          <span className="text-emerald-600">{selectedFileName}</span>
                        ) : (
                          'Upload .docx, Markdown (.md), or raw text file'
                        )}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Formatted notes, cheat-sheets, or exported study docs
                      </p>
                    </label>
                  </div>
                )}

                {/* Tab 3: Paste Text */}
                {activeTab === 'text' && (
                  <div>
                    <textarea
                      rows={5}
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder="Paste your study notes, textbook excerpt, or lecture transcript here..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden resize-none font-mono"
                    />
                  </div>
                )}

                {/* 1-Click Sample Previews for reviewers */}
                <div className="pt-1">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>Or try realistic sample notes with 1 click:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectSample('trees')}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 transition-colors"
                    >
                      📚 Binary Search Trees
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSample('dbms')}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 transition-colors"
                    >
                      🗄️ Relational Normalization
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSample('physics')}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 transition-colors"
                    >
                      ⚛️ Quantum Oscillator
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!isAnalyzing && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              id="analyze-material-btn"
              onClick={handleStartAnalysis}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all hover:gap-2.5"
            >
              <span>Analyze Material</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
