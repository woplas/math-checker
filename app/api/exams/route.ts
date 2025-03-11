import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/exams - Get all exams for the current user
export async function GET(request: NextRequest) {
  try {
    // Get current user from token
    const tokenUser = getCurrentUser(request);
    
    if (!tokenUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get exams for the current user
    const exams = await prisma.exam.findMany({
      where: {
        userId: tokenUser.id,
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
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json({
      success: true,
      exams,
    });
  } catch (error) {
    console.error('Get exams error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get exams' },
      { status: 500 }
    );
  }
}

// POST /api/exams - Create a new exam
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
    const { title, subject, date, description, totalQuestions, maxScore, students } = body;
    
    // Validate required fields
    if (!title || !subject || !date || !totalQuestions || !maxScore) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create exam
    const exam = await prisma.exam.create({
      data: {
        title,
        subject,
        date: new Date(date),
        description,
        totalQuestions,
        maxScore,
        userId: tokenUser.id,
        // Connect existing students or create new ones
        students: students ? {
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
      exam,
    }, { status: 201 });
  } catch (error) {
    console.error('Create exam error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create exam' },
      { status: 500 }
    );
  }
}
