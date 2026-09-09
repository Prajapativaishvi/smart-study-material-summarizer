import bcrypt from 'bcryptjs';
import {
  User,
  Subject,
  Unit,
  Topic,
  Note,
  Example,
  VivaQuestion,
  VivaAttempt,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  Flashcard,
  FlashcardReview,
  StudyGroup,
  GroupMember,
  GroupMessage,
  StudentProgress,
  Organization,
  Syllabus,
  SyllabusUnit,
  SyllabusSection,
  SyllabusTopic,
  Concept,
  SyllabusTopicConcept,
  Role,
} from '../types';

class DatabaseStore {
  public users: User[] = [];
  public subjects: Subject[] = [];
  public units: Unit[] = [];
  public topics: Topic[] = [];
  public notes: Note[] = [];
  public examples: Example[] = [];
  public vivaQuestions: VivaQuestion[] = [];
  public vivaAttempts: VivaAttempt[] = [];
  public quizzes: Quiz[] = [];
  public quizQuestions: QuizQuestion[] = [];
  public quizAttempts: QuizAttempt[] = [];
  public flashcards: Flashcard[] = [];
  public flashcardReviews: FlashcardReview[] = [];
  public studyGroups: StudyGroup[] = [];
  public groupMembers: GroupMember[] = [];
  public groupMessages: GroupMessage[] = [];
  public studentProgress: StudentProgress[] = [];

  // Multi-Syllabus & Concept Mapping Store
  public organizations: Organization[] = [];
  public syllabi: Syllabus[] = [];
  public syllabusUnits: SyllabusUnit[] = [];
  public syllabusSections: SyllabusSection[] = [];
  public syllabusTopics: SyllabusTopic[] = [];
  public concepts: Concept[] = [];
  public syllabusTopicConcepts: SyllabusTopicConcept[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Generate static hashes for default users
    const salt = bcrypt.genSaltSync(10);
    const studentPass = bcrypt.hashSync('Student@123', salt);
    const teacherPass = bcrypt.hashSync('Teacher@123', salt);
    const adminPass = bcrypt.hashSync('Admin@123', salt);

    // 1. Users
    const student: User = {
      id: 'usr-student-1',
      name: 'Alex Chen',
      email: 'student@studylens.edu',
      password: studentPass,
      role: 'STUDENT',
      organizationId: 'org-gtu',
      syllabusId: 'syl-gtu-2026',
      createdAt: '2026-09-01T08:00:00.000Z',
      updatedAt: '2026-09-08T08:00:00.000Z',
    };

    const teacher: User = {
      id: 'usr-teacher-1',
      name: 'Dr. Sarah Jenkins',
      email: 'teacher@studylens.edu',
      password: teacherPass,
      role: 'TEACHER',
      createdAt: '2026-08-15T08:00:00.000Z',
      updatedAt: '2026-09-08T08:00:00.000Z',
    };

    const admin: User = {
      id: 'usr-admin-1',
      name: 'Director Marcus Vance',
      email: 'admin@studylens.edu',
      password: adminPass,
      role: 'ADMIN',
      createdAt: '2026-08-01T08:00:00.000Z',
      updatedAt: '2026-09-08T08:00:00.000Z',
    };

    this.users.push(student, teacher, admin);

    // 2. Subjects
    const dsSubject: Subject = {
      id: 'sub-ds',
      name: 'Data Structures & Algorithms',
      description: 'Foundational study of contiguous memory, pointer topologies, graph algorithms, and asymptotic complexity.',
    };

    const osSubject: Subject = {
      id: 'sub-os',
      name: 'Operating Systems',
      description: 'Process scheduling, concurrency primitives, virtual memory management, and file system architecture.',
    };

    this.subjects.push(dsSubject, osSubject);

    // 3. Units
    const unit1: Unit = {
      id: 'unit-ds-1',
      subjectId: 'sub-ds',
      name: 'Unit 1: Linear Memory & Arrays',
      unitNumber: 1,
    };

    const unit2: Unit = {
      id: 'unit-ds-2',
      subjectId: 'sub-ds',
      name: 'Unit 2: Pointer Structures & Linked Lists',
      unitNumber: 2,
    };

    this.units.push(unit1, unit2);

    // 4. Topics
    const topicArrays: Topic = {
      id: 'top-ds-arrays',
      unitId: 'unit-ds-1',
      name: 'Arrays & Memory Layout',
      description: 'Contiguous RAM allocation, cache prefetching, row-major matrices, and amortized resizing.',
    };

    const topicLinkedLists: Topic = {
      id: 'top-ds-linkedlists',
      unitId: 'unit-ds-2',
      name: 'Linked Lists & Dynamic Nodes',
      description: 'Heap allocation, pointer chaining, cycle detection, and memory fragmentation trade-offs.',
    };

    this.topics.push(topicArrays, topicLinkedLists);

    // 5. Notes (Learn → Notes)
    const note1: Note = {
      id: 'note-ds-1',
      topicId: 'top-ds-arrays',
      title: 'Contiguous Physical Memory Allocation & Random Access',
      content: `# Arrays: Core Memory Principles and Random Access

Arrays are the primary linear data structure used to store elements of uniform data types in contiguous memory locations.

### 1. Deterministic Offset Formula
Because all elements reside consecutively in physical RAM, the hardware computes memory addresses in $O(1)$ constant time:
$$\\text{Address}(A[i]) = \\text{BaseAddress} + (i \\times \\text{sizeof}(T))$$

### 2. Cache Line Locality
CPUs fetch data into L1/L2 cache in lines (typically 64 bytes). Reading $A[0]$ automatically prefetches $A[1]$ through $A[7]$ (for 64-bit integers), eliminating main RAM stall cycles.

### 3. Dynamic Array Amortization
Dynamic arrays double capacity on exhaustion. The sum of doubling copies over $N$ items converges to $2N$, delivering an amortized $O(1)$ append cost.`,
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-02T10:00:00.000Z',
      updatedAt: '2026-09-02T10:00:00.000Z',
    };

    this.notes.push(note1);

    // 6. Examples (Practice → Examples)
    const example1: Example = {
      id: 'ex-ds-1',
      topicId: 'top-ds-arrays',
      question: 'Rotate an array of n elements to the right by k steps in-place with O(1) extra space.',
      solution: `We perform an in-place triple reversal:
1. Reverse the entire array: reverse(nums, 0, n-1)
2. Reverse the first k elements: reverse(nums, 0, k-1)
3. Reverse the remaining n-k elements: reverse(nums, k, n-1)

Time: O(n) pass
Space: O(1) aux`,
      difficulty: 'MEDIUM',
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-03T11:00:00.000Z',
      updatedAt: '2026-09-03T11:00:00.000Z',
    };

    const example2: Example = {
      id: 'ex-ds-2',
      topicId: 'top-ds-arrays',
      question: 'Implement Kadane’s Algorithm to find the maximum sum contiguous sub-array in O(n) time.',
      solution: `Maintain running max and global max:
int maxSubArray(vector<int>& nums) {
    int curMax = nums[0], allMax = nums[0];
    for (size_t i = 1; i < nums.size(); ++i) {
        curMax = max(nums[i], curMax + nums[i]);
        allMax = max(allMax, curMax);
    }
    return allMax;
}`,
      difficulty: 'HARD',
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-03T11:30:00.000Z',
      updatedAt: '2026-09-03T11:30:00.000Z',
    };

    this.examples.push(example1, example2);

    // 7. Viva Questions (Speak → Viva)
    const viva1: VivaQuestion = {
      id: 'viva-ds-1',
      topicId: 'top-ds-arrays',
      question: 'Why is random access O(1) in an array but O(n) in a linked list?',
      expectedAnswer: 'Arrays reside in contiguous memory, so the physical address can be calculated directly with Base + (Index * ElementSize). In linked lists, nodes are scattered in heap memory connected by pointers, requiring sequential traversal.',
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-04T09:00:00.000Z',
    };

    const viva2: VivaQuestion = {
      id: 'viva-ds-2',
      topicId: 'top-ds-arrays',
      question: 'What is the impact of spatial locality on array traversal versus linked list traversal?',
      expectedAnswer: 'Array traversal benefits from CPU cache lines fetching consecutive memory chunks into L1 cache, minimizing cache misses. Linked lists suffer from cache misses because nodes are allocated non-contiguously on the heap.',
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-04T09:15:00.000Z',
    };

    this.vivaQuestions.push(viva1, viva2);

    // 8. Quizzes (Test → Quiz)
    const quiz1: Quiz = {
      id: 'quiz-ds-1',
      topicId: 'top-ds-arrays',
      title: 'Arrays & Memory Architecture Mastery Quiz',
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-05T14:00:00.000Z',
    };

    const q1: QuizQuestion = {
      id: 'qq-1',
      quizId: 'quiz-ds-1',
      question: 'Why does an array allow O(1) random access by index?',
      options: [
        'Elements are connected through hardware pointers',
        'Contiguous memory enables direct address arithmetic',
        'Hardware stores array indices in CPU register caches',
        'The compiler builds an internal lookup hashtable',
      ],
      correctAnswer: 1,
      explanation: 'Contiguous memory layout allows direct computation: Address = Base + Index * ElementSize.',
    };

    const q2: QuizQuestion = {
      id: 'qq-2',
      quizId: 'quiz-ds-1',
      question: 'What is the amortized cost of inserting an element into a dynamic array that doubles its capacity?',
      options: [
        'O(n) linear time',
        'O(log n) logarithmic time',
        'O(1) amortized constant time',
        'O(n^2) quadratic time',
      ],
      correctAnswer: 2,
      explanation: 'Doubling capacity geometrically bounds the sum of copying costs to less than 2N across N insertions.',
    };

    this.quizzes.push(quiz1);
    this.quizQuestions.push(q1, q2);

    // 9. Flashcards (Revise → Flashcards)
    const fc1: Flashcard = {
      id: 'fc-ds-1',
      topicId: 'top-ds-arrays',
      question: 'What is the memory address calculation formula for a 1D array?',
      answer: 'Address(A[i]) = BaseAddress + (i * sizeof(DataType))',
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-05T15:00:00.000Z',
    };

    const fc2: Flashcard = {
      id: 'fc-ds-2',
      topicId: 'top-ds-arrays',
      question: 'What is the cache line size of most modern x86/ARM CPUs?',
      answer: '64 bytes (typically holding 8 consecutive 64-bit integers or 16 32-bit integers).',
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-05T15:10:00.000Z',
    };

    this.flashcards.push(fc1, fc2);

    // 10. Study Groups (Discuss → Group Study)
    const group1: StudyGroup = {
      id: 'grp-ds-1',
      name: 'DSA Exam Sprint Circle',
      description: 'Peer problem solving, mock viva questions, and exam preparation for computer science students.',
      createdBy: 'usr-student-1',
      createdAt: '2026-09-06T12:00:00.000Z',
    };

    this.studyGroups.push(group1);

    this.groupMembers.push({
      id: 'gm-1',
      groupId: 'grp-ds-1',
      studentId: 'usr-student-1',
      joinedAt: '2026-09-06T12:00:00.000Z',
    });

    this.groupMessages.push({
      id: 'msg-1',
      groupId: 'grp-ds-1',
      senderId: 'usr-student-1',
      senderName: 'Alex Chen',
      message: 'Welcome everyone! Today let’s focus on row-major matrix indexing and dynamic array amortization proofs.',
      createdAt: '2026-09-06T12:05:00.000Z',
    });

    // 11. Initial Progress
    this.studentProgress.push({
      id: 'prog-1',
      studentId: 'usr-student-1',
      topicId: 'top-ds-arrays',
      notesCompleted: true,
      practiceCompleted: true,
      vivaScore: 92.5,
      quizScore: 100,
      flashcardsReviewed: 14,
      overallProgress: 88,
      updatedAt: '2026-09-08T02:00:00.000Z',
    });

    // ==========================================
    // 12. MULTI-SYLLABUS SEED DATA
    // ==========================================

    // Organizations
    const orgGtu: Organization = {
      id: 'org-gtu',
      name: 'GTU (Gujarat Technological University)',
      type: 'STATE_UNIVERSITY',
      createdAt: '2026-08-01T00:00:00.000Z',
      updatedAt: '2026-09-08T00:00:00.000Z',
    };

    const orgUnivB: Organization = {
      id: 'org-unib',
      name: 'University B (Engineering & Technology)',
      type: 'AUTONOMOUS_UNIVERSITY',
      createdAt: '2026-08-01T00:00:00.000Z',
      updatedAt: '2026-09-08T00:00:00.000Z',
    };

    const orgColC: Organization = {
      id: 'org-colc',
      name: 'College of Advanced Computing',
      type: 'COLLEGE',
      createdAt: '2026-08-01T00:00:00.000Z',
      updatedAt: '2026-09-08T00:00:00.000Z',
    };

    this.organizations.push(orgGtu, orgUnivB, orgColC);

    // Syllabi
    const sylGtu: Syllabus = {
      id: 'syl-gtu-2026',
      organizationId: 'org-gtu',
      name: 'GTU B.Tech CSE (2026 Scheme)',
      version: '2026.1',
      description: 'Official Computer Science & Engineering syllabus for Semester 3, GTU.',
      createdAt: '2026-08-10T00:00:00.000Z',
      updatedAt: '2026-09-08T00:00:00.000Z',
    };

    const sylUnivB: Syllabus = {
      id: 'syl-unib-2025',
      organizationId: 'org-unib',
      name: 'University B Autonomous CSE Scheme',
      version: '2025.2',
      description: 'Specialized Data Systems & Algorithms curriculum for University B engineering cohort.',
      createdAt: '2026-08-10T00:00:00.000Z',
      updatedAt: '2026-09-08T00:00:00.000Z',
    };

    this.syllabi.push(sylGtu, sylUnivB);

    // Syllabus A Structure (GTU): Unit 2 -> Linked List (Direct Unit -> Topic)
    const gtuUnit1: SyllabusUnit = {
      id: 'syl-unit-gtu-1',
      syllabusId: 'syl-gtu-2026',
      name: 'Unit 1: Primitive Memory & Array Buffers',
      unitNumber: 1,
      type: 'UNIT',
      description: 'Sequential RAM storage, address offsets, and matrix bounds.',
      createdAt: '2026-08-12T00:00:00.000Z',
    };

    const gtuUnit2: SyllabusUnit = {
      id: 'syl-unit-gtu-2',
      syllabusId: 'syl-gtu-2026',
      name: 'Unit 2: Pointer Structures & Dynamic Nodes',
      unitNumber: 2,
      type: 'UNIT',
      description: 'Linked representations, pointer operations, and dynamic storage allocation.',
      createdAt: '2026-08-12T00:00:00.000Z',
    };

    this.syllabusUnits.push(gtuUnit1, gtuUnit2);

    const gtuTopicLL: SyllabusTopic = {
      id: 'syl-top-gtu-ll',
      unitId: 'syl-unit-gtu-2',
      name: 'Linked List',
      orderIndex: 1,
      description: 'Singly, doubly, and circular linked lists with pointer manipulators according to GTU scheme.',
      createdAt: '2026-08-14T00:00:00.000Z',
    };

    const gtuTopicArr: SyllabusTopic = {
      id: 'syl-top-gtu-arr',
      unitId: 'syl-unit-gtu-1',
      name: 'Arrays & Memory Layout',
      orderIndex: 1,
      description: 'Sequential allocation, base addresses, and row/column major ordering.',
      createdAt: '2026-08-14T00:00:00.000Z',
    };

    this.syllabusTopics.push(gtuTopicLL, gtuTopicArr);

    // Syllabus B Structure (Univ B): Module 3 -> Linear Data Structures -> Linked List
    const unibMod1: SyllabusUnit = {
      id: 'syl-mod-unib-1',
      syllabusId: 'syl-unib-2025',
      name: 'Module 1: Computational Foundations',
      unitNumber: 1,
      type: 'MODULE',
      description: 'Asymptotic notation, memory hierarchy, and cache behavior.',
      createdAt: '2026-08-15T00:00:00.000Z',
    };

    const unibMod3: SyllabusUnit = {
      id: 'syl-mod-unib-3',
      syllabusId: 'syl-unib-2025',
      name: 'Module 3: Linear Data Topologies',
      unitNumber: 3,
      type: 'MODULE',
      description: 'Dynamic chaining, sentinel headers, and cycle invariants.',
      createdAt: '2026-08-15T00:00:00.000Z',
    };

    this.syllabusUnits.push(unibMod1, unibMod3);

    const unibSecLDS: SyllabusSection = {
      id: 'syl-sec-unib-lds',
      unitId: 'syl-mod-unib-3',
      name: 'Linear Data Structures',
      orderIndex: 1,
      description: 'Dynamic node abstractions, pointer chasing, and iterator design.',
      createdAt: '2026-08-16T00:00:00.000Z',
    };

    this.syllabusSections.push(unibSecLDS);

    const unibTopicLL: SyllabusTopic = {
      id: 'syl-top-unib-ll',
      unitId: 'syl-mod-unib-3',
      sectionId: 'syl-sec-unib-lds',
      name: 'Linked List',
      orderIndex: 1,
      description: 'Pointer graphs, doubly-linked sentinel nodes, and garbage-collected chains.',
      createdAt: '2026-08-17T00:00:00.000Z',
    };

    this.syllabusTopics.push(unibTopicLL);

    // Central Concepts
    const concLinkedList: Concept = {
      id: 'conc-linked-list',
      name: 'Linked List',
      code: 'CONC-DS-002',
      category: 'Data Structures',
      description: 'Fundamental linear data structure where elements are not stored at contiguous memory locations, but point to successive nodes via pointers.',
      createdAt: '2026-08-01T00:00:00.000Z',
      updatedAt: '2026-09-08T00:00:00.000Z',
    };

    const concArrays: Concept = {
      id: 'conc-arrays',
      name: 'Arrays & Memory Layout',
      code: 'CONC-DS-001',
      category: 'Data Structures',
      description: 'Contiguous memory layout, deterministic offset computation, and CPU cache prefetching.',
      createdAt: '2026-08-01T00:00:00.000Z',
      updatedAt: '2026-09-08T00:00:00.000Z',
    };

    this.concepts.push(concLinkedList, concArrays);

    // Concept Mappings:
    // Both GTU Unit 2 -> Linked List AND Univ B Module 3 -> Linear Data Structures -> Linked List map to 'conc-linked-list'!
    this.syllabusTopicConcepts.push({
      id: 'stc-gtu-ll',
      syllabusTopicId: 'syl-top-gtu-ll',
      conceptId: 'conc-linked-list',
      createdAt: '2026-08-18T00:00:00.000Z',
    });

    this.syllabusTopicConcepts.push({
      id: 'stc-unib-ll',
      syllabusTopicId: 'syl-top-unib-ll',
      conceptId: 'conc-linked-list',
      createdAt: '2026-08-18T00:00:00.000Z',
    });

    this.syllabusTopicConcepts.push({
      id: 'stc-gtu-arr',
      syllabusTopicId: 'syl-top-gtu-arr',
      conceptId: 'conc-arrays',
      createdAt: '2026-08-18T00:00:00.000Z',
    });

    // ==========================================
    // 13. SYLLABUS-SPECIFIC STUDY MATERIALS
    // ==========================================

    // --- GTU SPECIFIC MATERIAL (Unit 2 -> Linked List) ---
    const gtuNote: Note = {
      id: 'note-gtu-ll-1',
      topicId: 'top-ds-linkedlists',
      organizationId: 'org-gtu',
      syllabusId: 'syl-gtu-2026',
      syllabusTopicId: 'syl-top-gtu-ll',
      conceptId: 'conc-linked-list',
      title: 'GTU Examination Standard: Singly & Doubly Linked List Operations',
      content: `# GTU CSE: Unit 2 Linked List Architecture

In the GTU 2026 examination scheme, Linked Lists are evaluated under linear data structures with explicit pointer manipulators.

### 1. Singly Linked List Node Definition
\`\`\`c
struct Node {
    int data;
    struct Node* next;
};
\`\`\`

### 2. Insertion at First Position
Time complexity is strictly $O(1)$:
\`\`\`c
void insertFirst(struct Node** head, int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = *head;
    *head = newNode;
}
\`\`\`

### 3. Key GTU Exam Points
- Differentiate between Internal Fragmentation in Arrays vs External Pointer Overhead in Linked Lists.
- Circular linked lists have no NULL terminating pointer; \`last->next == head\`.`,
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-02T12:00:00.000Z',
      updatedAt: '2026-09-02T12:00:00.000Z',
    };

    const gtuExample: Example = {
      id: 'ex-gtu-ll-1',
      topicId: 'top-ds-linkedlists',
      organizationId: 'org-gtu',
      syllabusId: 'syl-gtu-2026',
      syllabusTopicId: 'syl-top-gtu-ll',
      conceptId: 'conc-linked-list',
      question: '[GTU Dec 2025 Paper] Write an algorithm to reverse a singly linked list in O(n) time and O(1) auxiliary space.',
      solution: `Step-by-step 3-pointer algorithm:
1. Initialize three pointers: prev = NULL, curr = head, next = NULL.
2. While curr is not NULL:
   a. next = curr->next;
   b. curr->next = prev;
   c. prev = curr;
   d. curr = next;
3. head = prev; return head.

Complexity:
- Time: O(n) single pass
- Space: O(1) in-place pointers`,
      difficulty: 'MEDIUM',
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-03T14:00:00.000Z',
      updatedAt: '2026-09-03T14:00:00.000Z',
    };

    const gtuViva: VivaQuestion = {
      id: 'viva-gtu-ll-1',
      topicId: 'top-ds-linkedlists',
      organizationId: 'org-gtu',
      syllabusId: 'syl-gtu-2026',
      syllabusTopicId: 'syl-top-gtu-ll',
      conceptId: 'conc-linked-list',
      question: 'Explain the difference between singly and doubly linked lists regarding deletion operations.',
      expectedAnswer: 'In a singly linked list, deleting a given node requires knowing the predecessor node, which takes O(n) traversal from the head unless predecessor is provided. In a doubly linked list, each node stores a prev pointer, enabling direct O(1) deletion given the node pointer.',
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-04T09:00:00.000Z',
    };

    const gtuQuiz: Quiz = {
      id: 'quiz-gtu-ll-1',
      topicId: 'top-ds-linkedlists',
      organizationId: 'org-gtu',
      syllabusId: 'syl-gtu-2026',
      syllabusTopicId: 'syl-top-gtu-ll',
      conceptId: 'conc-linked-list',
      title: 'GTU Unit 2 Assessment: Linked List Mechanics',
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-05T10:00:00.000Z',
    };

    const gtuQuizQuestions: QuizQuestion[] = [
      {
        id: 'qq-gtu-1',
        quizId: 'quiz-gtu-ll-1',
        question: 'What is the time complexity to insert a node at the front of a singly linked list?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
        correctAnswer: 0,
        explanation: 'Inserting at the beginning only requires updating newNode->next and head pointer, taking O(1) constant time.',
      },
      {
        id: 'qq-gtu-2',
        quizId: 'quiz-gtu-ll-1',
        question: 'In a circular linked list, what does the next pointer of the last node point to?',
        options: ['NULL', 'The second node', 'The head node', 'Random memory address'],
        correctAnswer: 2,
        explanation: 'In a circular linked list, the final node loops back to the head node.',
      },
    ];

    const gtuFlashcard: Flashcard = {
      id: 'fc-gtu-ll-1',
      topicId: 'top-ds-linkedlists',
      organizationId: 'org-gtu',
      syllabusId: 'syl-gtu-2026',
      syllabusTopicId: 'syl-top-gtu-ll',
      conceptId: 'conc-linked-list',
      question: 'What is the space overhead per element in a 64-bit singly linked list?',
      answer: 'Each node requires 8 bytes for data (assuming 64-bit int/pointer) plus 8 bytes for the next pointer, leading to 100% pointer overhead.',
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-06T11:00:00.000Z',
    };

    this.notes.push(gtuNote);
    this.examples.push(gtuExample);
    this.vivaQuestions.push(gtuViva);
    this.quizzes.push(gtuQuiz);
    this.quizQuestions.push(...gtuQuizQuestions);
    this.flashcards.push(gtuFlashcard);

    // --- UNIVERSITY B SPECIFIC MATERIAL (Module 3 -> Linear Data Structures -> Linked List) ---
    const unibNote: Note = {
      id: 'note-unib-ll-1',
      topicId: 'top-ds-linkedlists',
      organizationId: 'org-unib',
      syllabusId: 'syl-unib-2025',
      syllabusTopicId: 'syl-top-unib-ll',
      conceptId: 'conc-linked-list',
      title: 'University B Lab: Sentinel Node Topology & Cache Profiling',
      content: `# University B Module 3: Advanced Linked Topologies

University B engineering curriculum focuses on system-level implementations, sentinel boundaries, and modern hardware cache implications.

### 1. Sentinel Dummy Nodes
Eliminating edge cases (null heads) through dummy sentinel nodes:
\`\`\`cpp
struct SentinelList {
    Node* head;
    Node* tail;
    SentinelList() {
        head = new Node(-1);
        tail = new Node(-1);
        head->next = tail;
        tail->prev = head;
    }
};
\`\`\`

### 2. Cache Line Misses (Pointer Chasing)
Unlike sequential arrays that trigger hardware L1/L2 stream prefetchers, each linked list node can be allocated in arbitrary heap pages, causing a CPU cache miss on almost every pointer dereference.

### 3. Modern Mitigation: Unrolled Linked Lists
Chunking multiple elements inside each node node to regain cache line spatial locality while retaining O(1) splicing.`,
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-02T13:00:00.000Z',
      updatedAt: '2026-09-02T13:00:00.000Z',
    };

    const unibExample: Example = {
      id: 'ex-unib-ll-1',
      topicId: 'top-ds-linkedlists',
      organizationId: 'org-unib',
      syllabusId: 'syl-unib-2025',
      syllabusTopicId: 'syl-top-unib-ll',
      conceptId: 'conc-linked-list',
      question: '[Univ B Systems Lab] Implement Floyd’s Tortoise and Hare algorithm to detect cycles in a dynamic node chain and find the cycle entry node.',
      solution: `// Phase 1: Detect cycle
Node *slow = head, *fast = head;
while (fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
    if (slow == fast) break;
}
if (!fast || !fast->next) return nullptr; // No cycle

// Phase 2: Locate cycle origin
slow = head;
while (slow != fast) {
    slow = slow->next;
    fast = fast->next;
}
return slow; // Cycle start`,
      difficulty: 'HARD',
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-03T15:00:00.000Z',
      updatedAt: '2026-09-03T15:00:00.000Z',
    };

    const unibViva: VivaQuestion = {
      id: 'viva-unib-ll-1',
      topicId: 'top-ds-linkedlists',
      organizationId: 'org-unib',
      syllabusId: 'syl-unib-2025',
      syllabusTopicId: 'syl-top-unib-ll',
      conceptId: 'conc-linked-list',
      question: 'Why do modern high-performance compilers prefer vector/array layouts over linked lists even for insertions in the middle for moderate sizes (N < 1000)?',
      expectedAnswer: 'Because traversing scattered heap nodes triggers continuous CPU cache misses that stall CPU execution for hundreds of cycles, whereas moving contiguous memory in an array uses high-speed SIMD vector instructions with 100% cache line hits.',
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-04T10:00:00.000Z',
    };

    const unibQuiz: Quiz = {
      id: 'quiz-unib-ll-1',
      topicId: 'top-ds-linkedlists',
      organizationId: 'org-unib',
      syllabusId: 'syl-unib-2025',
      syllabusTopicId: 'syl-top-unib-ll',
      conceptId: 'conc-linked-list',
      title: 'Univ B Module 3 Systems Quiz: Dynamic Node Chains',
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-05T11:00:00.000Z',
    };

    const unibQuizQuestions: QuizQuestion[] = [
      {
        id: 'qq-unib-1',
        quizId: 'quiz-unib-ll-1',
        question: 'What is the primary benefit of using sentinel dummy nodes in a doubly linked list?',
        options: [
          'It completely eliminates special-case branching for empty list or head/tail insertions',
          'It reduces overall memory usage to O(1)',
          'It allows O(1) random binary search access',
          'It guarantees automatic hardware cache alignment',
        ],
        correctAnswer: 0,
        explanation: 'Sentinel head and tail nodes guarantee that every valid element has non-null prev and next pointers, removing boundary branch checks.',
      },
      {
        id: 'qq-unib-2',
        quizId: 'quiz-unib-ll-1',
        question: 'In Floyd’s Cycle-Finding Algorithm, if the slow pointer moves 1 step and fast moves 2 steps, what is the time complexity to detect a cycle of length C?',
        options: ['O(N + C)', 'O(N * C)', 'O(C^2)', 'O(log N)'],
        correctAnswer: 0,
        explanation: 'The relative speed difference is 1 step per iteration, so once both enter the loop, they meet in at most C steps, total O(N + C).',
      },
    ];

    const unibFlashcard: Flashcard = {
      id: 'fc-unib-ll-1',
      topicId: 'top-ds-linkedlists',
      organizationId: 'org-unib',
      syllabusId: 'syl-unib-2025',
      syllabusTopicId: 'syl-top-unib-ll',
      conceptId: 'conc-linked-list',
      question: 'What is an Unrolled Linked List and why is it used?',
      answer: 'An unrolled linked list stores an array of elements inside each linked list node, combining O(1) node splicing with array cache-line spatial locality.',
      createdBy: 'usr-teacher-1',
      createdAt: '2026-09-06T12:00:00.000Z',
    };

    this.notes.push(unibNote);
    this.examples.push(unibExample);
    this.vivaQuestions.push(unibViva);
    this.quizzes.push(unibQuiz);
    this.quizQuestions.push(...unibQuizQuestions);
    this.flashcards.push(unibFlashcard);
  }
}

export const db = new DatabaseStore();

