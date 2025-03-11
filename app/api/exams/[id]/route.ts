import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/exams/[id] - Get a single exam by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get current user from token
    const tokenUser = getCurrentUser(request);
    
    if (!tokenUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get exam by ID
    const exam = await prisma.exam.findUnique({
      where: {
        id,
      },
      include: {
        students: {
          select: {
            id: true,
            name: true,
          },
        },
        submissions: {
          select: {
            id: true,
            status: true,
            submittedAt: true,
            student: {
              select: {
                id: true,
                name: true,
              },
            },
            gradingResult: {
              select: {
                id: true,
                totalScore: true,
                maxPossibleScore: true,
                gradedAt: true,
              },
            },
          },
        },
      },
    });
    
    // Check if exam exists
    if (!exam) {
      return NextResponse.json(
        { success: false, error: 'Exam not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the exam
    if (exam.userId !== tokenUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      success: true,
      exam,
    });
  } catch (error) {
    console.error('Get exam error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get exam' },
      { status: 500 }
    );
  }
}

// PUT /api/exams/[id] - Update an exam
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get current user from token
    const tokenUser = getCurrentUser(request);
    
    if (!tokenUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Check if exam exists and belongs to user
    const existingExam = await prisma.exam.findUnique({
      where: {
        id,
      },
    });
    
    if (!existingExam) {
      return NextResponse.json(
        { success: false, error: 'Exam not found' },
        { status: 404 }
      );
    }
    
    if (existingExam.userId !== tokenUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { title, subject, date, description, totalQuestions, maxScore, students } = body;
    
    // Validate required fields
    if (!title || !subject || !date || !totalQuestions || !maxScore) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Update exam
    const updatedExam = await prisma.exam.update({
      where: {
        id,
      },
      data: {
        title,
        subject,
        date: new Date(date),
        description,
        totalQuestions,
        maxScore,
        // Update students if provided
        students: students ? {
          set: [], // Clear existing connections
          connectOrCreate: students.map((student: { id?: string; name: string }) => ({
            where: { id: student.id || '' },
            create: { name: student.name },
          })),
        } : undefined,
      },
      include: {
        students: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      exam: updatedExam,
    });
  } catch (error) {
    console.error('Update exam error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update exam' },
      { status: 500 }
    );
  }
}

// DELETE /api/exams/[id] - Delete an exam
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get current user from token
    const tokenUser = getCurrentUser(request);
    
    if (!tokenUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Check if exam exists and belongs to user
    const existingExam = await prisma.exam.findUnique({
      where: {
        id,
      },
    });
    
    if (!existingExam) {
      return NextResponse.json(
        { success: false, error: 'Exam not found' },
        { status: 404 }
      );
    }
    
    if (existingExam.userId !== tokenUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Delete exam (this will cascade delete submissions and grading results)
    await prisma.exam.delete({
      where: {
        id,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Exam deleted successfully',
    });
  } catch (error) {
    console.error('Delete exam error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete exam' },
      { status: 500 }
    );
  }
}
