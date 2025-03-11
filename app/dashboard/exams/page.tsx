import Link from 'next/link';

export default function ExamsPage() {
  // Mock data for demonstration
  const exams = [
    { id: 1, title: 'Algebra Quiz 1', date: '2025-03-10', status: 'Graded', students: 25, avgScore: 85 },
    { id: 2, title: 'Geometry Test', date: '2025-03-08', status: 'Pending', students: 22, avgScore: null },
    { id: 3, title: 'Calculus Exam', date: '2025-03-05', status: 'Graded', students: 18, avgScore: 78 },
    { id: 4, title: 'Trigonometry Quiz', date: '2025-03-01', status: 'Graded', students: 20, avgScore: 92 },
    { id: 5, title: 'Statistics Midterm', date: '2025-02-25', status: 'Graded', students: 23, avgScore: 81 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Exams</h1>
        <Link 
          href="/dashboard/exams/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Create New Exam
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search exams..."
            className="w-full p-2 border border-gray-300 rounded-md"
          />
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
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exams.map((exam) => (
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
                    {exam.students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exam.avgScore ? `${exam.avgScore}%` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href={`/dashboard/exams/${exam.id}`} className="text-blue-600 hover:underline mr-3">
                      View
                    </Link>
                    <Link href={`/dashboard/exams/${exam.id}/edit`} className="text-indigo-600 hover:underline mr-3">
                      Edit
                    </Link>
                    {exam.status === 'Pending' && (
                      <Link href={`/dashboard/exams/${exam.id}/grade`} className="text-green-600 hover:underline mr-3">
                        Grade
                      </Link>
                    )}
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
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
