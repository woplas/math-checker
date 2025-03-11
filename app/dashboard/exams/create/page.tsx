'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CreateExamPage() {
  const [examData, setExamData] = useState({
    title: '',
    subject: '',
    description: '',
    date: '',
  });
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExamData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAssignmentFile(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real application, you would upload the file to a server
    // and save the exam data to a database
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Redirect to the exams page after successful creation
      window.location.href = '/dashboard/exams';
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/dashboard/exams" className="text-blue-600 hover:underline mr-4">
          &larr; Back to Exams
        </Link>
        <h1 className="text-3xl font-bold">Create New Exam</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={examData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Algebra Quiz 1"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={examData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a subject</option>
                  <option value="algebra">Algebra</option>
                  <option value="geometry">Geometry</option>
                  <option value="calculus">Calculus</option>
                  <option value="trigonometry">Trigonometry</option>
                  <option value="statistics">Statistics</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={examData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={examData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Provide details about this exam..."
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Assignment Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <svg className="h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          accept="image/*"
                          className="sr-only" 
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  
                  {previewUrl && (
                    <div className="mt-4 w-full">
                      <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                      <img 
                        src={previewUrl} 
                        alt="Assignment preview" 
                        className="max-h-48 mx-auto border rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-gray-700 mb-2">AI Grading Information</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Our AI system will analyze the uploaded assignment image and automatically grade student submissions.
                </p>
                <p className="text-sm text-gray-600">
                  For best results:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                  <li>Ensure the image is clear and well-lit</li>
                  <li>Make sure all questions and answer spaces are visible</li>
                  <li>Use high contrast between text and background</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Link 
              href="/dashboard/exams" 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white ${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Creating...' : 'Create Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
