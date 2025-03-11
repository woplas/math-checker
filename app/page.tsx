'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // In a real application, we would check if the user is authenticated
    // and redirect accordingly
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="py-6 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-blue-600 rounded-xl w-10 h-10 flex items-center justify-center">
              <span className="text-white text-xl font-bold">M</span>
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-900">Math Assignment Grader</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Math Assignment <span className="text-blue-600">Grader</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Streamline your grading process with AI-powered math assignment evaluation. Save time and provide consistent feedback.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <button 
                onClick={() => router.push('/dashboard')}
                className="btn btn-primary px-8 py-3 text-lg shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
              
              <button 
                onClick={() => router.push('/auth/login')}
                className="btn btn-outline px-8 py-3 text-lg hover:bg-blue-50"
              >
                Sign In
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="card p-6">
                <div className="rounded-full bg-blue-100 p-3 w-14 h-14 flex items-center justify-center mb-6 mx-auto">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Assignments</h3>
                <p className="text-gray-600">
                  Simply upload math assignments and student answers as images.
                </p>
              </div>
              
              <div className="card p-6">
                <div className="rounded-full bg-indigo-100 p-3 w-14 h-14 flex items-center justify-center mb-6 mx-auto">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Grading</h3>
                <p className="text-gray-600">
                  Our AI analyzes student answers and provides accurate grading.
                </p>
              </div>
              
              <div className="card p-6">
                <div className="rounded-full bg-purple-100 p-3 w-14 h-14 flex items-center justify-center mb-6 mx-auto">
                  <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailed Analytics</h3>
                <p className="text-gray-600">
                  Get insights into student performance and track progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Math Assignment Grader. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
