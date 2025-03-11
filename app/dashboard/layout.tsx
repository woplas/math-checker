import { ReactNode } from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-blue-600 text-xl font-bold">M</span>
            </div>
            <h1 className="text-2xl font-bold">Math Assignment Grader</h1>
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  href="/dashboard" 
                  className="hover:text-blue-200 transition-colors py-2 border-b-2 border-transparent hover:border-blue-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/exams" 
                  className="hover:text-blue-200 transition-colors py-2 border-b-2 border-transparent hover:border-blue-200"
                >
                  Exams
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/students" 
                  className="hover:text-blue-200 transition-colors py-2 border-b-2 border-transparent hover:border-blue-200"
                >
                  Students
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 my-6">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Math Assignment Grader. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
