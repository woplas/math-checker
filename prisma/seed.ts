const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seeding database...');
    
    // Create a test user
    const hashedPassword = await bcrypt.hash('password', 10);
    
    const user = await prisma.user.upsert({
      where: { email: 'teacher@example.com' },
      update: {},
      create: {
        email: 'teacher@example.com',
        name: 'Test Teacher',
        password: hashedPassword,
        role: 'teacher',
      },
    });
    
    console.log('Created user:', user.email);
    
    // Create some students
    const students = await Promise.all([
      prisma.student.upsert({
        where: { id: '1' },
        update: {},
        create: {
          id: '1',
          name: 'John Doe',
        },
      }),
      prisma.student.upsert({
        where: { id: '2' },
        update: {},
        create: {
          id: '2',
          name: 'Jane Smith',
        },
      }),
      prisma.student.upsert({
        where: { id: '3' },
        update: {},
        create: {
          id: '3',
          name: 'Michael Johnson',
        },
      }),
      prisma.student.upsert({
        where: { id: '4' },
        update: {},
        create: {
          id: '4',
          name: 'Emily Williams',
        },
      }),
      prisma.student.upsert({
        where: { id: '5' },
        update: {},
        create: {
          id: '5',
          name: 'Robert Brown',
        },
      }),
    ]);
    
    console.log(`Created ${students.length} students`);
    
    // Create an exam
    const exam = await prisma.exam.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        title: 'Algebra Quiz 1',
        subject: 'Algebra',
        date: new Date('2025-03-10'),
        description: 'This quiz covers basic algebraic equations, including linear equations, quadratic equations, and systems of equations.',
        totalQuestions: 5,
        maxScore: 100,
        userId: user.id,
        students: {
          connect: students.map(student => ({ id: student.id })),
        },
      },
    });
    
    console.log('Created exam:', exam.title);
    
    // Create some submissions
    const submissions = await Promise.all([
      prisma.submission.upsert({
        where: { id: '1' },
        update: {},
        create: {
          id: '1',
          examId: exam.id,
          studentId: '1',
          status: 'graded',
          submittedAt: new Date('2025-03-10T10:30:00Z'),
          imageUrl: '/mock-submission.jpg',
        },
      }),
      prisma.submission.upsert({
        where: { id: '2' },
        update: {},
        create: {
          id: '2',
          examId: exam.id,
          studentId: '2',
          status: 'graded',
          submittedAt: new Date('2025-03-10T10:45:00Z'),
          imageUrl: '/mock-submission.jpg',
        },
      }),
      prisma.submission.upsert({
        where: { id: '3' },
        update: {},
        create: {
          id: '3',
          examId: exam.id,
          studentId: '3',
          status: 'submitted',
          submittedAt: new Date('2025-03-10T11:00:00Z'),
          imageUrl: '/mock-submission.jpg',
        },
      }),
    ]);
    
    console.log(`Created ${submissions.length} submissions`);
    
    // Create grading results for the graded submissions
    const gradingResults = await Promise.all([
      prisma.gradingResult.upsert({
        where: { submissionId: '1' },
        update: {},
        create: {
          submissionId: '1',
          totalScore: 85,
          maxPossibleScore: 100,
          gradedAt: new Date('2025-03-10T11:30:00Z'),
          answers: {
            create: [
              {
                questionNumber: 1,
                studentAnswer: 'x = 5',
                correctAnswer: 'x = 5',
                score: 20,
                maxScore: 20,
                confidence: 0.98,
                feedback: 'Correct solution with proper steps shown.',
              },
              {
                questionNumber: 2,
                studentAnswer: 'y = 3x + 2',
                correctAnswer: 'y = 3x + 2',
                score: 20,
                maxScore: 20,
                confidence: 0.97,
                feedback: 'Correct solution with proper steps shown.',
              },
              {
                questionNumber: 3,
                studentAnswer: 'z = 12',
                correctAnswer: 'z = 12',
                score: 20,
                maxScore: 20,
                confidence: 0.99,
                feedback: 'Correct solution with proper steps shown.',
              },
              {
                questionNumber: 4,
                studentAnswer: 'w = 6',
                correctAnswer: 'w = 8',
                score: 5,
                maxScore: 20,
                confidence: 0.85,
                feedback: 'Incorrect solution. Review the concept and try again.',
              },
              {
                questionNumber: 5,
                studentAnswer: 'a = 4, b = 3',
                correctAnswer: 'a = 4, b = 3',
                score: 20,
                maxScore: 20,
                confidence: 0.96,
                feedback: 'Correct solution with proper steps shown.',
              },
            ],
          },
        },
      }),
      prisma.gradingResult.upsert({
        where: { submissionId: '2' },
        update: {},
        create: {
          submissionId: '2',
          totalScore: 92,
          maxPossibleScore: 100,
          gradedAt: new Date('2025-03-10T11:45:00Z'),
          answers: {
            create: [
              {
                questionNumber: 1,
                studentAnswer: 'x = 5',
                correctAnswer: 'x = 5',
                score: 20,
                maxScore: 20,
                confidence: 0.98,
                feedback: 'Correct solution with proper steps shown.',
              },
              {
                questionNumber: 2,
                studentAnswer: 'y = 3x + 2',
                correctAnswer: 'y = 3x + 2',
                score: 20,
                maxScore: 20,
                confidence: 0.97,
                feedback: 'Correct solution with proper steps shown.',
              },
              {
                questionNumber: 3,
                studentAnswer: 'z = 12',
                correctAnswer: 'z = 12',
                score: 20,
                maxScore: 20,
                confidence: 0.99,
                feedback: 'Correct solution with proper steps shown.',
              },
              {
                questionNumber: 4,
                studentAnswer: 'w = 7',
                correctAnswer: 'w = 8',
                score: 12,
                maxScore: 20,
                confidence: 0.85,
                feedback: 'Partially correct. Some steps are missing or incorrect.',
              },
              {
                questionNumber: 5,
                studentAnswer: 'a = 4, b = 3',
                correctAnswer: 'a = 4, b = 3',
                score: 20,
                maxScore: 20,
                confidence: 0.96,
                feedback: 'Correct solution with proper steps shown.',
              },
            ],
          },
        },
      }),
    ]);
    
    console.log(`Created ${gradingResults.length} grading results`);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
