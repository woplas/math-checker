'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type Student = {
  id: number;
  name: string;
  status: 'not_submitted' | 'submitted' | 'graded';
  score?: number;
  submittedAt?: string;
};

export default function ExamDetailPage() {
  const params = useParams();
  const examId = params.id;
  
  // Mock exam data for demonstration
  const examData = {
    id: examId,
    title: 'Algebra Quiz 1',
    date: '2025-03-10',
    subject: 'Algebra',
    description: 'This quiz covers basic algebraic equations, including linear equations, quadratic equations, and systems of equations.',
    totalQuestions: 5,
    maxScore: 100,
    createdAt: '2025-03-05T10:00:00Z',
    assignmentImageUrl: '/mock-assignment.jpg', // In a real app, this would be a real image URL
  };
  
  // Mock student data for demonstration
  const [students, setStudents] = useState<Student[]>([
    { 
      id: 1, 
      name: 'John Doe', 
      status: 'graded', 
      score: 85, 
      submittedAt: '2025-03-10T10:30:00Z' 
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      status: 'graded', 
      score: 92, 
      submittedAt: '2025-03-10T10:45:00Z' 
    },
    { 
      id: 3, 
      name: 'Michael Johnson', 
      status: 'submitted', 
      submittedAt: '2025-03-10T11:00:00Z' 
    },
    { 
      id: 4, 
      name: 'Emily Williams', 
      status: 'not_submitted'
    },
    { 
      id: 5, 
      name: 'Robert Brown', 
      status: 'not_submitted'
    },
  ]);
  
  // Calculate statistics
  const totalStudents = students.length;
  const submittedCount = students.filter(s => s.status === 'submitted' || s.status === 'graded').length;
  const gradedCount = students.filter(s => s.status === 'graded').length;
  const notSubmittedCount = students.filter(s => s.status === 'not_submitted').length;
  
  const averageScore = students
    .filter(s => s.status === 'graded' && s.score !== undefined)
    .reduce((sum, student) => sum + (student.score || 0), 0) / gradedCount || 0;
  
  // Status badge component
  const StatusBadge = ({ status }: { status: Student['status'] }) => {
    switch (status) {
      case 'graded':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Graded
          </span>
        );
      case 'submitted':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Submitted
          </span>
        );
      case 'not_submitted':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Not Submitted
          </span>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/dashboard/exams" className="text-blue-600 hover:underline mr-4">
          &larr; Back to Exams
        </Link>
        <h1 className="text-3xl font-bold">{examData.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Exam Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-medium">{examData.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{examData.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Questions</p>
                <p className="font-medium">{examData.totalQuestions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Max Score</p>
                <p className="font-medium">{examData.maxScore}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Description</p>
                <p>{examData.description}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Assignment</h2>
              <button className="text-blue-600 hover:underline text-sm">
                View Full Size
              </button>
            </div>
            <div className="border rounded-md p-4 bg-gray-50 flex items-center justify-center">
              <p className="text-gray-500 italic">
                (In a real application, the assignment image would be displayed here)
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Students</h2>
              <Link 
                href={`/dashboard/exams/${examId}/upload`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Upload Student Answers
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">ID: {student.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={student.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.submittedAt 
                          ? new Date(student.submittedAt).toLocaleString() 
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.score !== undefined ? `${student.score}/${examData.maxScore}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.status === 'graded' && (
                          <Link 
                            href={`/dashboard/exams/${examId}/grade?student=${student.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            View Results
                          </Link>
                        )}
                        {student.status === 'submitted' && (
                          <Link 
                            href={`/dashboard/exams/${examId}/grade?student=${student.id}`}
                            className="text-green-600 hover:underline"
                          >
                            Grade
                          </Link>
                        )}
                        {student.status === 'not_submitted' && (
                          <span className="text-gray-400">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Statistics</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="text-xl font-bold text-blue-600">{submittedCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Graded</p>
                  <p className="text-xl font-bold text-green-600">{gradedCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-yellow-600">{notSubmittedCount}</p>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold">
                  {averageScore ? `${Math.round(averageScore)}/${examData.maxScore}` : '-'}
                </p>
                {averageScore > 0 && (
                  <p className="text-sm text-gray-600">
                    {Math.round((averageScore / examData.maxScore) * 100)}%
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-3">
              <Link 
                href={`/dashboard/exams/${examId}/upload`}
                className="block w-full text-center bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-md"
              >
                Upload Student Answers
              </Link>
              {gradedCount > 0 && (
                <Link 
                  href={`/dashboard/exams/${examId}/results`}
                  className="block w-full text-center bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-md"
                >
                  View All Results
                </Link>
              )}
              <Link 
                href={`/dashboard/exams/${examId}/edit`}
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
              >
                Edit Exam
              </Link>
              <button 
                className="block w-full text-center bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md"
              >
                Delete Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
