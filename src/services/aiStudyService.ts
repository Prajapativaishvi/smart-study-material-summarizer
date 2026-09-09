import {
  StudyMaterial,
  SmartSummary,
  KeyConcept,
  Flashcard,
  QuizQuestion,
  ConceptNode,
  RevisionItem,
} from '../types';
import { sampleMaterials } from '../data/mockData';

/**
 * AI Study Service Layer
 * 
 * Future Gemini API Integration:
 * When ready to connect live Gemini models, replace the mocked returns with calls to:
 * const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
 * const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
 * Using structured JSON outputs with responseSchema.
 */

export interface AnalyzeMaterialParams {
  title: string;
  subject: string;
  topic?: string;
  type: 'pdf' | 'notes' | 'text';
  rawText?: string;
  fileName?: string;
  fileSize?: string;
  pageCount?: number;
}

export interface MaterialGenerationProgress {
  stage: 'reading' | 'concepts' | 'organizing' | 'tools' | 'complete';
  message: string;
  progressPercentage: number;
}

export async function analyzeMaterial(
  params: AnalyzeMaterialParams,
  onProgress?: (progress: MaterialGenerationProgress) => void
): Promise<StudyMaterial> {
  const steps: MaterialGenerationProgress[] = [
    { stage: 'reading', message: 'Reading and parsing study material...', progressPercentage: 25 },
    { stage: 'concepts', message: 'Finding core principles and key definitions...', progressPercentage: 50 },
    { stage: 'organizing', message: 'Synthesizing smart summaries and topic hierarchy...', progressPercentage: 75 },
    { stage: 'tools', message: 'Preparing flashcards, quiz questions, and concept map...', progressPercentage: 95 },
  ];

  for (const step of steps) {
    if (onProgress) {
      onProgress(step);
    }
    await new Promise((resolve) => setTimeout(resolve, 450));
  }

  // Find a matching template or generate customized material based on title & subject
  const id = `mat-${Date.now()}`;
  const baseSample = sampleMaterials.find(
    (m) => m.subject.toLowerCase() === params.subject.toLowerCase()
  ) || sampleMaterials[0];

  const generatedMaterial: StudyMaterial = {
    ...baseSample,
    id,
    title: params.title || baseSample.title,
    subject: params.subject || baseSample.subject,
    topic: params.topic || params.title || baseSample.topic,
    pagesCount: params.pageCount || 14,
    progressPercentage: 10,
    lastStudied: 'Just now',
    isFavorite: false,
    isCompleted: false,
    recommendedNextStep: `Review Smart Summary for ${params.title || baseSample.topic}`,
  };

  if (onProgress) {
    onProgress({ stage: 'complete', message: 'Study workspace ready!', progressPercentage: 100 });
  }

  return generatedMaterial;
}

export async function generateSummary(
  _content: string,
  depth: 'short' | 'balanced' | 'detailed' = 'balanced'
): Promise<SmartSummary> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return sampleMaterials[0].summary;
}

export async function generateKeyConcepts(_content: string): Promise<KeyConcept[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return sampleMaterials[0].keyConcepts;
}

export async function generateFlashcards(_content: string): Promise<Flashcard[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return sampleMaterials[0].flashcards;
}

export async function generateQuiz(_content: string, _count: number = 10): Promise<QuizQuestion[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return sampleMaterials[0].quiz;
}

export async function generateConceptMap(_content: string): Promise<{
  centralNode: string;
  centralDescription: string;
  nodes: ConceptNode[];
}> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return sampleMaterials[0].conceptMap;
}

export async function generateRevisionInsights(_materialId: string): Promise<RevisionItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    {
      id: 'rev-1',
      topic: 'Engineering Mathematics — Matrices',
      subject: 'Engineering Mathematics',
      confidence: 48,
      lastReviewed: '5 days ago',
      priority: 'revise_today',
      materialId: 'mat-math-matrices',
      subtopicNotes: 'Eigenvalues calculation & matrix inversion methods',
    },
    {
      id: 'rev-2',
      topic: 'Data Structures — Arrays',
      subject: 'Data Structures',
      confidence: 72,
      lastReviewed: 'Today',
      priority: 'due_for_review',
      materialId: 'mat-ds-arrays',
      subtopicNotes: 'Dynamic array resizing amortized complexity',
    },
    {
      id: 'rev-3',
      topic: 'C++ Programming — Functions',
      subject: 'C++',
      confidence: 85,
      lastReviewed: '2 days ago',
      priority: 'strong',
      materialId: 'mat-cpp-functions',
      subtopicNotes: 'Function overloading and default arguments',
    },
    {
      id: 'rev-4',
      topic: 'Digital Electronics — Logic Gates',
      subject: 'Digital Electronics',
      confidence: 54,
      lastReviewed: '4 days ago',
      priority: 'needs_attention',
      materialId: 'mat-de-logic',
      subtopicNotes: 'NAND/NOR universal gate synthesis & De Morgan laws',
    },
  ];
}
