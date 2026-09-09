const API_BASE = '/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: unknown;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  };
  token: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('studylens_auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('studylens_auth_token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('studylens_auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const json = await response.json();
      return json as ApiResponse<T>;
    } catch (error) {
      console.error(`API request error on ${endpoint}:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // 1. Health check
  async checkHealth() {
    return this.request<{ status: string; service: string }>('/health');
  }

  // 2. Auth APIs
  async login(email: string, password: string) {
    const res = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  async register(name: string, email: string, password: string, role: string = 'STUDENT') {
    const res = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  async getMe() {
    return this.request<{ user: AuthResponse['user'] }>('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // 3. Learn → Subjects & Notes APIs
  async getSubjects() {
    return this.request<Array<{ id: string; name: string; description?: string; unitsCount: number }>>('/subjects');
  }

  async getSubjectUnits(subjectId: string) {
    return this.request<Array<{ id: string; name: string; unitNumber: number; topics: Array<{ id: string; name: string; description?: string }> }>>(`/subjects/${subjectId}/units`);
  }

  async getUnitTopics(unitId: string) {
    return this.request<Array<{ id: string; name: string; description?: string }>>(`/units/${unitId}/topics`);
  }

  async getTopicNotes(topicId: string) {
    return this.request<Array<{ id: string; title: string; content: string; createdBy: string; createdAt: string }>>(`/topics/${topicId}/notes`);
  }

  async getNoteById(noteId: string) {
    return this.request<{ id: string; title: string; content: string; topicName?: string; authorName?: string; createdAt: string }>(`/notes/${noteId}`);
  }

  async createNote(topicId: string, title: string, content: string) {
    return this.request('/notes', {
      method: 'POST',
      body: JSON.stringify({ topicId, title, content }),
    });
  }

  // 4. Practice → Examples APIs
  async getTopicExamples(topicId: string, difficulty?: string) {
    const query = difficulty ? `?difficulty=${difficulty}` : '';
    return this.request<Array<{ id: string; question: string; solution: string; difficulty: string }>>(`/topics/${topicId}/examples${query}`);
  }

  async createExample(topicId: string, question: string, solution: string, difficulty: string = 'MEDIUM') {
    return this.request('/examples', {
      method: 'POST',
      body: JSON.stringify({ topicId, question, solution, difficulty }),
    });
  }

  // 5. Speak → Viva APIs
  async getTopicViva(topicId: string) {
    return this.request<Array<{ id: string; question: string; expectedAnswer?: string }>>(`/topics/${topicId}/viva`);
  }

  async submitVivaAttempt(topicId: string, studentAnswer: string, questionId?: string) {
    return this.request<{ attemptId: string; score: number; feedback: string; expectedAnswer?: string }>('/viva/attempts', {
      method: 'POST',
      body: JSON.stringify({ topicId, studentAnswer, questionId }),
    });
  }

  async getStudentVivaAttempts(studentId: string) {
    return this.request<Array<{ id: string; topicId: string; score: number; feedback?: string; attemptedAt: string }>>(`/students/${studentId}/viva-attempts`);
  }

  // 6. Test → Quiz APIs
  async getTopicQuizzes(topicId: string) {
    return this.request<Array<{ id: string; title: string; questionsCount: number }>>(`/topics/${topicId}/quizzes`);
  }

  async getQuizById(quizId: string) {
    return this.request<{
      id: string;
      title: string;
      totalQuestions: number;
      questions: Array<{ id: string; question: string; options: string[] }>;
    }>(`/quizzes/${quizId}`);
  }

  async attemptQuiz(quizId: string, answers: Record<string, number>) {
    return this.request<{
      attemptId: string;
      score: number;
      totalQuestions: number;
      percentage: number;
      detailedResults: Array<{
        questionId: string;
        question: string;
        selectedOption: number;
        correctOption: number;
        isCorrect: boolean;
        explanation?: string;
      }>;
    }>(`/quizzes/${quizId}/attempt`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  // 7. Discuss → Group Study APIs
  async getGroups() {
    return this.request<Array<{
      id: string;
      name: string;
      description?: string;
      membersCount: number;
      messagesCount: number;
      isMember: boolean;
    }>>('/groups');
  }

  async getGroupById(groupId: string) {
    return this.request<{
      id: string;
      name: string;
      description?: string;
      members: Array<{ id: string; name: string; email?: string }>;
    }>(`/groups/${groupId}`);
  }

  async createGroup(name: string, description?: string) {
    return this.request('/groups', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  }

  async joinGroup(groupId: string) {
    return this.request(`/groups/${groupId}/join`, {
      method: 'POST',
    });
  }

  async leaveGroup(groupId: string) {
    return this.request(`/groups/${groupId}/leave`, {
      method: 'POST',
    });
  }

  async getGroupMessages(groupId: string) {
    return this.request<Array<{
      id: string;
      senderId: string;
      senderName?: string;
      message: string;
      createdAt: string;
    }>>(`/groups/${groupId}/messages`);
  }

  async postGroupMessage(groupId: string, message: string) {
    return this.request(`/groups/${groupId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // 8. Revise → Flashcards APIs
  async getTopicFlashcards(topicId: string) {
    return this.request<Array<{
      id: string;
      question: string;
      answer: string;
      isReviewed?: boolean;
    }>>(`/topics/${topicId}/flashcards`);
  }

  async reviewFlashcard(flashcardId: string, studentId: string = 'usr-student-1') {
    return this.request<{
      reviewId: string;
      flashcardId: string;
      totalReviews: number;
    }>(`/flashcards/${flashcardId}/review`, {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    });
  }

  async getStudentFlashcardProgress(studentId: string) {
    return this.request<{
      studentId: string;
      totalCardsInSystem: number;
      reviewedCardsCount: number;
      completionRate: number;
    }>(`/students/${studentId}/flashcard-progress`);
  }

  // 9. Student Progress & Dashboard APIs
  async getStudentDashboard(studentId: string = 'usr-student-1') {
    return this.request<{
      student: { id: string; name: string; email: string; role: string };
      stats: {
        topicsCompleted: number;
        notesCompleted: number;
        practiceCompleted: number;
        quizAccuracy: number;
        quizzesAttempted: number;
        vivaAttemptsCount: number;
        avgVivaScore: number;
        flashcardsReviewedCount: number;
        overallCompletionRate: number;
        streakDays: number;
      };
      progressByTopic: Array<{
        topicId: string;
        topicName: string;
        notesCompleted: boolean;
        practiceCompleted: boolean;
        overallProgress: number;
      }>;
    }>(`/students/${studentId}/dashboard`);
  }
}

export const api = new ApiService();
