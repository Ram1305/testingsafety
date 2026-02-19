import { GraduationCap } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

export function AdminTeachers() {
  const teachers = [
    { id: '1', name: 'John Miller', courses: ['Forklift Operator'], students: 48, status: 'active' },
    { id: '2', name: 'Dr. Sarah Smith', courses: ['Electrician Level 1'], students: 42, status: 'active' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Teacher Management
        </h1>
        <p className="text-gray-600">Manage instructors and assignments</p>
      </div>

      <div className="grid gap-4">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="border-violet-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="mb-1">{teacher.name}</div>
                    <p className="text-gray-600">{teacher.courses.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-gray-600 mb-1">{teacher.students} students</div>
                    <Badge className="bg-green-100 text-green-700">{teacher.status}</Badge>
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
