'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type GradedAnswer = {
  questionNumber: number;
  studentAnswer: string;
  correctAnswer: string;
  score: number;
  maxScore: number;
  confidence: number;
  feedback: string;
};

type StudentSubmission = {
  id: number;
  name: string;
  status: 'grading' | 'completed' | 'error';
  submittedAt: string;
  previewUrl: string;
  totalScore: number;
  maxPossibleScore: number;
  answers: GradedAnswer[];
};

export default function GradeExamPage() {
  const params = useParams();
  const examId = params.id;
  
  // Mock exam data for demonstration
  const examData = {
    id: examId,
    title: 'Algebra Quiz 1',
    date: '2025-03-10',
    subject: 'Algebra',
    totalQuestions: 5,
    maxScore: 100,
  };
  
  // Mock student submissions with AI grading results
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([
    {
      id: 1,
      name: 'John Doe',
      status: 'completed',
      submittedAt: '2025-03-10T10:30:00Z',
      previewUrl: '/mock-student-answer-1.jpg',
      totalScore: 85,
      maxPossibleScore: 100,
      answers: [
        {
          questionNumber: 1,
          studentAnswer: 'x = 5',
          correctAnswer: 'x = 5',
          score: 20,
          maxScore: 20,
          confidence: 0.98,
          feedback: 'Correct solution with proper steps shown.'
        },
        {
          questionNumber: 2,
          studentAnswer: 'y = 3x + 2',
          correctAnswer: 'y = 3x + 2',
          score: 20,
          maxScore: 20,
          confidence: 0.95,
          feedback: 'Correct equation derived.'
        },
        {
          questionNumber: 3,
          studentAnswer: 'z = 12',
          correctAnswer: 'z = 12',
          score: 20,
          maxScore: 20,
          confidence: 0.99,
          feedback: 'Perfect answer.'
        },
        {
          questionNumber: 4,
          studentAnswer: 'w = 7',
          correctAnswer: 'w = 8',
          score: 5,
          maxScore: 20,
          confidence: 0.9,
          feedback: 'Calculation error in the final step.'
        },
        {
          questionNumber: 5,
          studentAnswer: 'a = 4, b = 3',
          correctAnswer: 'a = 4, b = 3',
          score: 20,
          maxScore: 20,
          confidence: 0.97,
          feedback: 'Correct solution for the system of equations.'
        },
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      status: 'completed',
      submittedAt: '2025-03-10T10:45:00Z',
      previewUrl: '/mock-student-answer-2.jpg',
      totalScore: 92,
      maxPossibleScore: 100,
      answers: [
        {
          questionNumber: 1,
          studentAnswer: 'x = 5',
          correctAnswer: 'x = 5',
          score: 20,
          maxScore: 20,
          confidence: 0.98,
          feedback: 'Correct solution.'
        },
        {
          questionNumber: 2,
          studentAnswer: 'y = 3x + 2',
          correctAnswer: 'y = 3x + 2',
          score: 20,
          maxScore: 20,
          confidence: 0.97,
          feedback: 'Correct equation.'
        },
        {
          questionNumber: 3,
          studentAnswer: 'z = 12',
          correctAnswer: 'z = 12',
          score: 20,
          maxScore: 20,
          confidence: 0.99,
          feedback: 'Perfect answer.'
        },
        {
          questionNumber: 4,
          studentAnswer: 'w = 8',
          correctAnswer: 'w = 8',
          score: 20,
          maxScore: 20,
          confidence: 0.95,
          feedback: 'Correct calculation.'
        },
        {
          questionNumber: 5,
          studentAnswer: 'a = 4, b = 2',
          correctAnswer: 'a = 4, b = 3',
          score: 12,
          maxScore: 20,
          confidence: 0.85,
          feedback: 'Partially correct. Error in calculating b.'
        },
      ]
    },
    {
      id: 3,
      name: 'Michael Johnson',
      status: 'grading',
      submittedAt: '2025-03-10T11:00:00Z',
      previewUrl: '/mock-student-answer-3.jpg',
      totalScore: 0,
      maxPossibleScore: 100,
      answers: []
    },
  ]);
  
  const [selectedStudent, setSelectedStudent] = useState<number | null>(1);
  const [editingAnswer, setEditingAnswer] = useState<number | null>(null);
  const [editedScore, setEditedScore] = useState<number>(0);
  const [editedFeedback, setEditedFeedback] = useState<string>('');
  
  const selectedSubmission = submissions.find(s => s.id === selectedStudent) || null;
  
  const handleScoreEdit = (questionNumber: number, currentScore: number, currentFeedback: string) => {
    setEditingAnswer(questionNumber);
    setEditedScore(currentScore);
    setEditedFeedback(currentFeedback);
  };
  
  const handleSaveEdit = () => {
    if (!selectedSubmission || editingAnswer === null) return;
    
    const updatedSubmissions = submissions.map(submission => {
      if (submission.id === selectedStudent) {
        // Update the specific answer
        const updatedAnswers = submission.answers.map(answer => {
          if (answer.questionNumber === editingAnswer) {
            return {
              ...answer,
              score: editedScore,
              feedback: editedFeedback
            };
          }
          return answer;
        });
        
        // Recalculate total score
        const newTotalScore = updatedAnswers.reduce((sum, answer) => sum + answer.score, 0);
        
        return {
          ...submission,
          answers: updatedAnswers,
          totalScore: newTotalScore
        };
      }
      return submission;
    });
    
    setSubmissions(updatedSubmissions);
    setEditingAnswer(null);
  };
  
  const handleCancelEdit = () => {
    setEditingAnswer(null);
  };
  
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.95) return 'High';
    if (confidence >= 0.8) return 'Medium';
    return 'Low';
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.95) return 'bg-green-100 text-green-800';
    if (confidence >= 0.8) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href={`/dashboard/exams/${examId}`} className="text-blue-600 hover:underline mr-4">
          &larr; Back to Exam
        </Link>
        <h1 className="text-3xl font-bold">Grading Results</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{examData.title}</h2>
          <div className="flex space-x-4 text-sm text-gray-600">
            <span>Subject: {examData.subject}</span>
            <span>Date: {examData.date}</span>
            <span>Questions: {examData.totalQuestions}</span>
            <span>Max Score: {examData.maxScore}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium mb-4">Student Submissions</h3>
            <div className="space-y-2">
              {submissions.map((submission) => (
                <div 
                  key={submission.id}
                  onClick={() => submission.status === 'completed' && setSelectedStudent(submission.id)}
                  className={`p-3 border rounded-md cursor-pointer ${
                    selectedStudent === submission.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{submission.name}</h4>
                      <p className="text-sm text-gray-600">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      {submission.status === 'completed' ? (
                        <>
                          <span className={`font-bold ${getScoreColor(submission.totalScore, submission.maxPossibleScore)}`}>
                            {submission.totalScore}/{submission.maxPossibleScore}
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.round((submission.totalScore / submission.maxPossibleScore) * 100)}%
                          </span>
                        </>
                      ) : submission.status === 'grading' ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          Grading...
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          Error
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {selectedSubmission && selectedSubmission.status === 'completed' ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    {selectedSubmission.name}'s Results
                  </h3>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${getScoreColor(selectedSubmission.totalScore, selectedSubmission.maxPossibleScore)}`}>
                      {selectedSubmission.totalScore}/{selectedSubmission.maxPossibleScore}
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.round((selectedSubmission.totalScore / selectedSubmission.maxPossibleScore) * 100)}%
                    </div>
                  </div>
                </div>
                
                <div className="mb-6 border p-4 rounded-md">
                  <h4 className="font-medium mb-2">Answer Sheet Preview</h4>
                  <div className="bg-gray-100 p-4 rounded flex items-center justify-center">
                    <p className="text-gray-500 italic">
                      (In a real application, the student's answer sheet image would be displayed here)
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Question-by-Question Breakdown</h4>
                  
                  {selectedSubmission.answers.map((answer) => (
                    <div key={answer.questionNumber} className="border rounded-md p-4">
                      {editingAnswer === answer.questionNumber ? (
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <h5 className="font-medium">Question {answer.questionNumber}</h5>
                            <div className="flex space-x-2">
                              <button 
                                onClick={handleSaveEdit}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button 
                                onClick={handleCancelEdit}
                                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Student Answer
                              </label>
                              <div className="p-2 bg-gray-50 rounded-md">
                                {answer.studentAnswer}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Correct Answer
                              </label>
                              <div className="p-2 bg-gray-50 rounded-md">
                                {answer.correctAnswer}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Score (out of {answer.maxScore})
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={answer.maxScore}
                              value={editedScore}
                              onChange={(e) => setEditedScore(Number(e.target.value))}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Feedback
                            </label>
                            <textarea
                              value={editedFeedback}
                              onChange={(e) => setEditedFeedback(e.target.value)}
                              rows={3}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between">
                            <h5 className="font-medium">Question {answer.questionNumber}</h5>
                            <button 
                              onClick={() => handleScoreEdit(answer.questionNumber, answer.score, answer.feedback)}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Edit
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                              <p className="text-sm text-gray-600">Student Answer:</p>
                              <p className="mt-1">{answer.studentAnswer}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Correct Answer:</p>
                              <p className="mt-1">{answer.correctAnswer}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap justify-between items-center mt-4">
                            <div>
                              <p className="text-sm text-gray-600">AI Feedback:</p>
                              <p className="mt-1">{answer.feedback}</p>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 md:mt-0">
                              <div>
                                <span className="text-sm text-gray-600">AI Confidence:</span>
                                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getConfidenceColor(answer.confidence)}`}>
                                  {getConfidenceLabel(answer.confidence)}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600">Score:</span>
                                <span className={`ml-2 font-bold ${getScoreColor(answer.score, answer.maxScore)}`}>
                                  {answer.score}/{answer.maxScore}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Link 
                    href={`/dashboard/exams/${examId}/results`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    View All Results
                  </Link>
                </div>
              </div>
            ) : selectedSubmission && selectedSubmission.status === 'grading' ? (
              <div className="flex flex-col items-center justify-center h-full p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <h3 className="text-lg font-medium">Grading in Progress</h3>
                <p className="text-gray-600 mt-2 text-center">
                  Our AI is analyzing {selectedSubmission.name}'s submission. This may take a few moments.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium">Select a Student</h3>
                <p className="text-gray-600 mt-2 max-w-md">
                  Select a student from the list to view their graded submission and AI-generated feedback.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
