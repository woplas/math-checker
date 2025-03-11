import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// POST /api/submissions - Create a new submission
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
    
    // Parse request body
    const body = await request.json();
    const { examId, studentId, imageUrl } = body;
    
    // Validate required fields
    if (!examId || !studentId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if exam exists and belongs to user
    const exam = await prisma.exam.findUnique({
      where: {
        id: examId,
      },
    });
    
    if (!exam) {
      return NextResponse.json(
        { success: false, error: 'Exam not found' },
        { status: 404 }
      );
    }
    
    if (exam.userId !== tokenUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Check if student exists
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });
    
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }
    
    // Check if submission already exists
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        examId,
        studentId,
      },
    });
    
    let submission;
    
    if (existingSubmission) {
      // Update existing submission
      submission = await prisma.submission.update({
        where: {
          id: existingSubmission.id,
        },
        data: {
          status: 'submitted',
          submittedAt: new Date(),
          imageUrl,
        },
      });
    } else {
      // Create new submission
      submission = await prisma.submission.create({
        data: {
          examId,
          studentId,
          status: 'submitted',
          submittedAt: new Date(),
          imageUrl,
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      submission,
    }, { status: 201 });
  } catch (error) {
    console.error('Create submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}
