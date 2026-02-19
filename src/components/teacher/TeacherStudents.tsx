import { Users, Search } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useState } from 'react';

export function TeacherStudents() {
  const [searchQuery, setSearchQuery] = useState('');

  const students = [
    { id: '1', name: 'John Doe', batch: 'FO-2024-B3', progress: 65, attendance: 90, lastActive: '2 hours ago', status: 'active' },
    { id: '2', name: 'Sarah Smith', batch: 'FO-2024-B3', progress: 80, attendance: 95, lastActive: '5 hours ago', status: 'active' },
    { id: '3', name: 'Mike Johnson', batch: 'FO-2024-B3', progress: 45, attendance: 75, lastActive: '1 day ago', status: 'behind' },
    { id: '4', name: 'Emma Wilson', batch: 'FO-2024-B2', progress: 90, attendance: 98, lastActive: '1 hour ago', status: 'excellent' }
  ];

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.batch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          My Students
        </h1>
        <p className="text-gray-600">Manage and track your students' progress</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((student) => (
          <Card key={student.id} className="border-violet-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center text-white flex-shrink-0 text-xl">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="mb-1">{student.name}</div>
                    <p className="text-gray-600">Batch: {student.batch}</p>
                    <Badge className={
                      student.status === 'excellent' ? 'bg-green-100 text-green-700 mt-1' :
                      student.status === 'behind' ? 'bg-orange-100 text-orange-700 mt-1' :
                      'bg-blue-100 text-blue-700 mt-1'
                    }>
                      {student.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Progress</div>
                    <div className="mb-1">{student.progress}%</div>
                    <Progress value={student.progress} className="h-2" />
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Attendance</div>
                    <div>{student.attendance}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Last Active</div>
                    <div>{student.lastActive}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
