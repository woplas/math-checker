import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get current user from token
    const tokenUser = getCurrentUser(request);
    
    if (!tokenUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    const { submissionId } = body;
    
    if (!submissionId) {
      return NextResponse.json(
        { success: false, error: 'Missing submission ID' },
        { status: 400 }
      );
    }
    
    // Get the submission
    const submission = await prisma.submission.findUnique({
      where: {
        id: submissionId,
      },
      include: {
        exam: true,
        student: true,
      },
    });
    
    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the exam
    if (submission.exam.userId !== tokenUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Check if submission is already graded
    const existingGradingResult = await prisma.gradingResult.findUnique({
      where: {
        submissionId,
      },
    });
    
    if (existingGradingResult) {
      return NextResponse.json(
        { success: false, error: 'Submission already graded' },
        { status: 400 }
      );
    }
    
    // In a real application, this would:
    // 1. Process the uploaded image using AI/ML models
    // 2. Extract student answers from the image
    // 3. Compare with correct answers
    // 4. Generate scores and feedback
    
    // For demo purposes, we'll create mock grading results
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate random scores for demonstration
    const totalQuestions = submission.exam.totalQuestions;
    const answers = [];
    let totalScore = 0;
    
    for (let i = 1; i <= totalQuestions; i++) {
      // Randomly determine if the answer is correct or partially correct
      const correctness = Math.random();
      let score = 0;
      let feedback = '';
      let confidence = 0;
      
      if (correctness > 0.7) {
        // Correct answer
        score = 20;
        feedback = 'Correct solution with proper steps shown.';
        confidence = 0.95 + (Math.random() * 0.05); // High confidence
      } else if (correctness > 0.4) {
        // Partially correct
        score = 10 + Math.floor(Math.random() * 8);
        feedback = 'Partially correct. Some steps are missing or incorrect.';
        confidence = 0.8 + (Math.random() * 0.15); // Medium confidence
      } else {
        // Incorrect
        score = Math.floor(Math.random() * 8);
        feedback = 'Incorrect solution. Review the concept and try again.';
        confidence = 0.6 + (Math.random() * 0.2); // Low confidence
      }
      
      totalScore += score;
      
      // Mock student and correct answers
      const questionTypes = [
        { student: 'x = 5', correct: 'x = 5' },
        { student: 'y = 3x + 2', correct: 'y = 3x + 2' },
        { student: 'z = 12', correct: 'z = 12' },
        { student: 'w = 7', correct: 'w = 8' },
        { student: 'a = 4, b = 3', correct: 'a = 4, b = 3' },
      ];
      
      const questionIndex = (i - 1) % questionTypes.length;
      let studentAnswer = questionTypes[questionIndex].student;
      const correctAnswer = questionTypes[questionIndex].correct;
      
      // If not fully correct, modify the student answer slightly
      if (correctness <= 0.7) {
        const parts = studentAnswer.split('=');
        if (parts.length > 1) {
          // Modify the value slightly
          const value = parseFloat(parts[1].trim());
          if (!isNaN(value)) {
            const newValue = value + (Math.random() > 0.5 ? 1 : -1);
            studentAnswer = `${parts[0]}= ${newValue}`;
          }
        }
      }
      
      answers.push({
        questionNumber: i,
        studentAnswer,
        correctAnswer,
        score,
        maxScore: 20,
        confidence,
        feedback,
      });
    }
    
    // Create grading result in database
    const gradingResult = await prisma.gradingResult.create({
      data: {
        submissionId,
        totalScore,
        maxPossibleScore: totalQuestions * 20,
        gradedAt: new Date(),
        answers: {
          create: answers.map(answer => ({
            questionNumber: answer.questionNumber,
            studentAnswer: answer.studentAnswer,
            correctAnswer: answer.correctAnswer,
            score: answer.score,
            maxScore: answer.maxScore,
            confidence: answer.confidence,
            feedback: answer.feedback,
          })),
        },
      },
      include: {
        answers: true,
      },
    });
    
    // Update submission status to 'graded'
    await prisma.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        status: 'graded',
      },
    });
    
    return NextResponse.json({
      success: true,
      gradingResult,
    });
  } catch (error) {
    console.error('Error grading assignment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to grade assignment' },
      { status: 500 }
    );
  }
}
