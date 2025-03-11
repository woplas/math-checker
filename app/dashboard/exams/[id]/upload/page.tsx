'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Define the student type
type Student = {
  id: number;
  name: string;
  file: File | null;
  preview: string | null;
  uploading: boolean;
  uploaded: boolean;
};

export default function UploadStudentAnswersPage() {
  const params = useParams();
  const examId = params.id;
  
  // Mock exam data for demonstration
  const examData = {
    id: examId,
    title: 'Algebra Quiz 1',
    date: '2025-03-10',
    subject: 'Algebra',
  };
  
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'John Doe', file: null, preview: null, uploading: false, uploaded: false },
    { id: 2, name: 'Jane Smith', file: null, preview: null, uploading: false, uploaded: false },
    { id: 3, name: 'Michael Johnson', file: null, preview: null, uploading: false, uploaded: false },
    { id: 4, name: 'Emily Williams', file: null, preview: null, uploading: false, uploaded: false },
    { id: 5, name: 'Robert Brown', file: null, preview: null, uploading: false, uploaded: false },
  ]);
  
  const [uploadingAll, setUploadingAll] = useState(false);
  
  const handleFileChange = (studentId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudents(students.map(student => 
          student.id === studentId 
            ? { ...student, file, preview: reader.result as string } 
            : student
        ));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUpload = (studentId: number) => {
    // Update the student's uploading status
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, uploading: true } 
        : student
    ));
    
    // Simulate API call to upload the file
    setTimeout(() => {
      setStudents(students.map(student => 
        student.id === studentId 
          ? { ...student, uploading: false, uploaded: true } 
          : student
      ));
    }, 1500);
  };
  
  const handleUploadAll = () => {
    setUploadingAll(true);
    
    // Get all students with files
    const studentsWithFiles = students.filter(student => student.file !== null);
    
    // Update all students with files to uploading status
    setStudents(students.map(student => 
      student.file !== null 
        ? { ...student, uploading: true } 
        : student
    ));
    
    // Simulate API calls to upload all files
    setTimeout(() => {
      setStudents(students.map(student => 
        student.file !== null 
          ? { ...student, uploading: false, uploaded: true } 
          : student
      ));
      setUploadingAll(false);
      
      // If all students have uploaded files, redirect to grading page
      if (studentsWithFiles.length === students.length) {
        // In a real app, you would redirect to the grading page
        // window.location.href = `/dashboard/exams/${examId}/grade`;
      }
    }, 2000);
  };
  
  const allUploaded = students.every(student => student.uploaded);
  const anyUploaded = students.some(student => student.uploaded);
  const anyWithFile = students.some(student => student.file !== null);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href={`/dashboard/exams/${examId}`} className="text-blue-600 hover:underline mr-4">
          &larr; Back to Exam
        </Link>
        <h1 className="text-3xl font-bold">Upload Student Answers</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{examData.title}</h2>
          <div className="flex space-x-4 text-sm text-gray-600">
            <span>Subject: {examData.subject}</span>
            <span>Date: {examData.date}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700">
            Upload images of student answer sheets for this exam. The AI will automatically grade each submission.
          </p>
        </div>
        
        <div className="space-y-6">
          {students.map((student) => (
            <div key={student.id} className="border rounded-md p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-medium">{student.name}</h3>
                  <p className="text-sm text-gray-600">Student ID: {student.id}</p>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                  {!student.uploaded ? (
                    <>
                      <label className="relative cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-sm">
                        {student.file ? 'Change File' : 'Select File'}
                        <input 
                          type="file" 
                          accept="image/*"
                          className="sr-only" 
                          onChange={(e) => handleFileChange(student.id, e)}
                        />
                      </label>
                      
                      {student.file && (
                        <button
                          onClick={() => handleUpload(student.id)}
                          disabled={student.uploading}
                          className={`px-4 py-2 rounded-md text-sm text-white ${
                            student.uploading 
                              ? 'bg-green-400' 
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {student.uploading ? 'Uploading...' : 'Upload'}
                        </button>
                      )}
                    </>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <svg className="mr-1.5 h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      Uploaded
                    </span>
                  )}
                </div>
              </div>
              
              {student.preview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                  <img 
                    src={student.preview} 
                    alt={`${student.name}'s answer preview`} 
                    className="max-h-48 border rounded-md"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-between">
          <div>
            {anyUploaded && (
              <Link 
                href={`/dashboard/exams/${examId}/grade`}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
              >
                View Grading Progress
              </Link>
            )}
          </div>
          
          <div className="flex space-x-4">
            <Link 
              href={`/dashboard/exams/${examId}`}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            
            <button
              onClick={handleUploadAll}
              disabled={!anyWithFile || uploadingAll || allUploaded}
              className={`px-4 py-2 rounded-md text-white ${
                !anyWithFile || uploadingAll || allUploaded
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {uploadingAll ? 'Uploading...' : 'Upload All Selected'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
