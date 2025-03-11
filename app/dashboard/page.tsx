import Link from 'next/link';

export default function Dashboard() {
  // Mock data for demonstration
  const recentExams = [
    { id: 1, title: 'Algebra Quiz 1', date: '2025-03-10', status: 'Graded' },
    { id: 2, title: 'Geometry Test', date: '2025-03-08', status: 'Pending' },
    { id: 3, title: 'Calculus Exam', date: '2025-03-05', status: 'Graded' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <Link 
          href="/dashboard/exams/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
        >
          Create New Exam
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Exams</span>
              <span className="font-medium text-gray-900">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Grading</span>
              <span className="font-medium text-gray-900">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Students</span>
              <span className="font-medium text-gray-900">45</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
          <ul className="space-y-3">
            <li>
              <span className="text-gray-500 text-sm">Today, 10:30 AM</span>
              <p className="text-gray-700">Uploaded new assignment for Algebra Quiz</p>
            </li>
            <li>
              <span className="text-gray-500 text-sm">Yesterday, 2:15 PM</span>
              <p className="text-gray-700">Graded 15 student submissions</p>
            </li>
            <li>
              <span className="text-gray-500 text-sm">Mar 9, 9:45 AM</span>
              <p className="text-gray-700">Created new exam: Geometry Test</p>
            </li>
          </ul>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
          <div className="space-y-3">
            <Link 
              href="/dashboard/exams/create" 
              className="block w-full text-center bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-3 rounded-md transition-colors"
            >
              Create Exam
            </Link>
            <Link 
              href="/dashboard/exams/1/upload" 
              className="block w-full text-center bg-green-100 hover:bg-green-200 text-green-800 px-4 py-3 rounded-md transition-colors"
            >
              Upload Assignment
            </Link>
            <Link 
              href="/dashboard/students" 
              className="block w-full text-center bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-3 rounded-md transition-colors"
            >
              Manage Students
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Exams Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Exams</h2>
          <Link href="/dashboard/exams" className="text-blue-600 hover:text-blue-800 hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentExams.map((exam) => (
                <tr key={exam.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{exam.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      exam.status === 'Graded' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href={`/dashboard/exams/${exam.id}`} className="text-blue-600 hover:underline mr-3">
                      View
                    </Link>
                    {exam.status === 'Pending' && (
                      <Link href={`/dashboard/exams/${exam.id}/grade`} className="text-green-600 hover:underline">
                        Grade
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
