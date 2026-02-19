import { Users } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

export function AdminBatches() {
  const batches = [
    { id: '1', code: 'FO-2024-B3', course: 'Forklift Operator', students: 16, startDate: 'Nov 1, 2024', teacher: 'John Miller', status: 'active' },
    { id: '2', code: 'EL-2024-B2', course: 'Electrician Level 1', students: 14, startDate: 'Oct 15, 2024', teacher: 'Dr. Sarah Smith', status: 'active' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Batch Management
        </h1>
        <p className="text-gray-600">Manage course batches and student assignments</p>
      </div>

      <div className="grid gap-4">
        {batches.map((batch) => (
          <Card key={batch.id} className="border-violet-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="mb-1">{batch.code}</div>
                    <p className="text-gray-600">{batch.course} • {batch.teacher}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-gray-600 mb-1">{batch.students} students • Start: {batch.startDate}</div>
                    <Badge className="bg-green-100 text-green-700">{batch.status}</Badge>
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
