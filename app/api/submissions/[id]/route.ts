import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/submissions/[id] - Get a single submission by ID
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
    
    // Get submission by ID
    const submission = await prisma.submission.findUnique({
      where: {
        id,
      },
      include: {
        exam: true,
        student: true,
        gradingResult: {
          include: {
            answers: true,
          },
        },
      },
    });
    
    // Check if submission exists
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
    
    return NextResponse.json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error('Get submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get submission' },
      { status: 500 }
    );
  }
}

// PUT /api/submissions/[id] - Update a submission
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
    
    // Get submission by ID
    const submission = await prisma.submission.findUnique({
      where: {
        id,
      },
      include: {
        exam: true,
      },
    });
    
    // Check if submission exists
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
    
    // Parse request body
    const body = await request.json();
    const { status, imageUrl } = body;
    
    // Update submission
    const updatedSubmission = await prisma.submission.update({
      where: {
        id,
      },
      data: {
        status: status || submission.status,
        imageUrl: imageUrl || submission.imageUrl,
      },
    });
    
    return NextResponse.json({
      success: true,
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error('Update submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}

// DELETE /api/submissions/[id] - Delete a submission
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
    
    // Get submission by ID
    const submission = await prisma.submission.findUnique({
      where: {
        id,
      },
      include: {
        exam: true,
      },
    });
    
    // Check if submission exists
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
    
    // Delete submission (this will cascade delete grading results)
    await prisma.submission.delete({
      where: {
        id,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully',
    });
  } catch (error) {
    console.error('Delete submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete submission' },
      { status: 500 }
    );
  }
}
