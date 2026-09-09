import { PrismaClient, Role, Difficulty } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('Seeding StudyLens database...');

  // Hash passwords
  const passwordSalt = await bcrypt.genSalt(10);
  const studentPassword = await bcrypt.hash('Student@123', passwordSalt);
  const teacherPassword = await bcrypt.hash('Teacher@123', passwordSalt);
  const adminPassword = await bcrypt.hash('Admin@123', passwordSalt);

  // 1. Create Users
  const student = await prisma.user.upsert({
    where: { email: 'student@studylens.edu' },
    update: {},
    create: {
      name: 'Alex Chen',
      email: 'student@studylens.edu',
      password: studentPassword,
      role: Role.STUDENT,
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@studylens.edu' },
    update: {},
    create: {
      name: 'Dr. Sarah Jenkins',
      email: 'teacher@studylens.edu',
      password: teacherPassword,
      role: Role.TEACHER,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@studylens.edu' },
    update: {},
    create: {
      name: 'Director Marcus Vance',
      email: 'admin@studylens.edu',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  console.log('Users created:', { student: student.email, teacher: teacher.email, admin: admin.email });

  // 2. Create Subjects
  const dsSubject = await prisma.subject.create({
    data: {
      name: 'Data Structures & Algorithms',
      description: 'Foundational study of memory models, continuous layouts, graph topologies, and algorithmic complexity.',
    },
  });

  const osSubject = await prisma.subject.create({
    data: {
      name: 'Operating Systems',
      description: 'Core concepts in process scheduling, virtual memory paging, multithreading synchronization, and file systems.',
    },
  });

  // 3. Create Units
  const unit1 = await prisma.unit.create({
    data: {
      subjectId: dsSubject.id,
      name: 'Linear Memory & Sequential Structures',
      unitNumber: 1,
    },
  });

  const unit2 = await prisma.unit.create({
    data: {
      subjectId: dsSubject.id,
      name: 'Non-Linear Topologies & Trees',
      unitNumber: 2,
    },
  });

  // 4. Create Topics
  const topicArrays = await prisma.topic.create({
    data: {
      unitId: unit1.id,
      name: 'Arrays & Memory Layout',
      description: 'Physical RAM contiguous offsets, cache lines, row-major matrices, and amortized dynamic resizing.',
    },
  });

  const topicLinkedLists = await prisma.topic.create({
    data: {
      unitId: unit1.id,
      name: 'Linked Lists & Pointer Chaining',
      description: 'Singly, doubly, and circular linked structures with pointer manipulation and cycle detection.',
    },
  });

  // 5. Create Notes (Learn → Notes)
  await prisma.note.create({
    data: {
      topicId: topicArrays.id,
      title: 'Contiguous Memory Allocation & Hardware Cache Friendliness',
      content: `# Arrays: Memory Layout and Random Access

Arrays are the bedrock of low-level memory allocation and higher-order data structures.
By maintaining elements consecutively in physical RAM, modern hardware CPUs leverage L1/L2 cache prefetching to provide exceptional spatial locality of reference.

## 1. Contiguous Address Formula
When an array of type \`T\` starts at base address \`B\`:
\`\`\`
Address(A[i]) = B + (i * sizeof(T))
\`\`\`
This deterministic arithmetic allows constant-time O(1) random access.

## 2. Dynamic Array Amortization
Dynamic arrays (such as std::vector in C++ or ArrayList in Java) double their capacity when full:
- Cost of inserting N elements without resizing: O(N)
- Total copies across geometric doublings (1 + 2 + 4 + ... + N): < 2N
- Amortized cost per insertion: O(1)

## 3. Cache Spatial Locality
Because elements reside consecutively, CPU cache lines (typically 64 bytes) fetch adjacent elements together. Sequential traversal is drastically faster than node-based structures like linked lists.`,
      createdBy: teacher.id,
    },
  });

  // 6. Create Examples (Practice → Examples)
  await prisma.example.create({
    data: {
      topicId: topicArrays.id,
      question: 'Given an integer array nums, rotate the array to the right by k steps, where k is non-negative. Do it in-place with O(1) extra space.',
      solution: `We can reverse parts of the array in three distinct passes:
1. Reverse the entire array.
2. Reverse the first k elements.
3. Reverse the remaining n - k elements.

Time Complexity: O(n)
Space Complexity: O(1) in-place.`,
      difficulty: Difficulty.MEDIUM,
      createdBy: teacher.id,
    },
  });

  await prisma.example.create({
    data: {
      topicId: topicArrays.id,
      question: 'Find the contiguous sub-array within an array of numbers that has the largest sum (Kadane’s Algorithm).',
      solution: `Keep a running current_sum and max_global:
\`\`\`python
def max_sub_array(nums):
    current_sum = max_global = nums[0]
    for x in nums[1:]:
        current_sum = max(x, current_sum + x)
        max_global = max(max_global, current_sum)
    return max_global
\`\`\`
Time Complexity: O(n), Single pass.
Space Complexity: O(1).`,
      difficulty: Difficulty.HARD,
      createdBy: teacher.id,
    },
  });

  // 7. Create Viva Questions (Speak → Viva)
  await prisma.vivaQuestion.create({
    data: {
      topicId: topicArrays.id,
      question: 'Why does accessing an element in an array take O(1) constant time, while in a linked list it takes O(n)?',
      expectedAnswer: 'Arrays use contiguous memory allocation, allowing the CPU to compute the exact physical RAM address directly using Base Address + (Index * Element Size). Linked lists allocate nodes discontinuously on the heap, requiring sequential pointer traversal from head to index n.',
      createdBy: teacher.id,
    },
  });

  await prisma.vivaQuestion.create({
    data: {
      topicId: topicArrays.id,
      question: 'What is the difference between static arrays and dynamic arrays regarding reallocation overhead?',
      expectedAnswer: 'Static arrays have fixed compile-time capacity and cannot grow. Dynamic arrays allocate extra capacity and double in size when full, incurring an occasional O(n) copy overhead but achieving amortized O(1) insertion time across all operations.',
      createdBy: teacher.id,
    },
  });

  // 8. Create Quizzes (Test → Quiz)
  const quiz = await prisma.quiz.create({
    data: {
      topicId: topicArrays.id,
      title: 'Arrays & Memory Architecture Mastery Test',
      createdBy: teacher.id,
    },
  });

  await prisma.quizQuestion.create({
    data: {
      quizId: quiz.id,
      question: 'Why does an array allow O(1) constant time random access to any element by index?',
      options: JSON.stringify([
        'Elements are linked via heap pointers',
        'Physical memory is contiguous so offset arithmetic computes the address instantly',
        'Hardware stores array indices in CPU register caches',
        'Compiler builds a binary hash table for all index values',
      ]),
      correctAnswer: 1,
      explanation: 'Contiguous memory allocation allows index calculation via Address = Base + (Index * ElementSize).',
    },
  });

  await prisma.quizQuestion.create({
    data: {
      quizId: quiz.id,
      question: 'What is the amortized time complexity of appending an element to a dynamic array that doubles its capacity when full?',
      options: JSON.stringify([
        'O(n) linear time',
        'O(log n) logarithmic time',
        'O(1) amortized constant time',
        'O(n^2) quadratic time',
      ]),
      correctAnswer: 2,
      explanation: 'Geometric doubling ensures that the total copying work over N insertions is less than 2N, giving an average of O(1) work per insertion.',
    },
  });

  // 9. Create Flashcards (Revise → Flashcards)
  await prisma.flashcard.create({
    data: {
      topicId: topicArrays.id,
      question: 'What is the formula for calculating memory address in a 1D array?',
      answer: 'Address(A[i]) = BaseAddress + (i * ElementSizeInBytes)',
      createdBy: teacher.id,
    },
  });

  await prisma.flashcard.create({
    data: {
      topicId: topicArrays.id,
      question: 'Why do arrays provide superior performance over linked lists in sequential algorithms?',
      answer: 'Spatial locality: hardware CPU cache lines (64 bytes) automatically prefetch contiguous neighboring elements into L1/L2 caches, eliminating memory stall latency.',
      createdBy: teacher.id,
    },
  });

  // 10. Create Study Groups (Discuss → Group Study)
  const group = await prisma.studyGroup.create({
    data: {
      name: 'Algorithms & Data Structures Study Circle',
      description: 'Collaborative revision, peer mock viva prep, and daily algorithmic problem solving.',
      createdBy: student.id,
    },
  });

  await prisma.groupMember.create({
    data: {
      groupId: group.id,
      studentId: student.id,
    },
  });

  await prisma.groupMessage.create({
    data: {
      groupId: group.id,
      senderId: student.id,
      message: 'Hey everyone! Let’s review amortized dynamic array resizing proofs before tomorrow’s quiz.',
    },
  });

  // 11. Create Student Progress
  await prisma.studentProgress.create({
    data: {
      studentId: student.id,
      topicId: topicArrays.id,
      notesCompleted: true,
      practiceCompleted: true,
      vivaScore: 92.5,
      quizScore: 85.0,
      flashcardsReviewed: 14,
      overallProgress: 88.0,
    },
  });

  console.log('Database seeded successfully!');
}

async function main() {
  try {
    await seedDatabase();
  } catch (e) {
    console.error('Seed error:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
