import { Award, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';

export function TeacherCertifications() {
  const pendingApprovals = [
    {
      id: '1',
      studentName: 'Emily Davis',
      course: 'Forklift Operator Certification',
      batch: 'FO-2024-B2',
      completionDate: 'Nov 20, 2024',
      theoryClasses: { completed: 12, total: 12, percentage: 100 },
      practicalSessions: { completed: 6, total: 6, percentage: 100 },
      examScore: 92,
      overallProgress: 100,
      daysAgo: '2 days ago'
    },
    {
      id: '2',
      studentName: 'Michael Brown',
      course: 'Forklift Operator Certification',
      batch: 'FO-2024-B2',
      completionDate: 'Nov 21, 2024',
      theoryClasses: { completed: 12, total: 12, percentage: 100 },
      practicalSessions: { completed: 6, total: 6, percentage: 100 },
      examScore: 88,
      overallProgress: 100,
      daysAgo: '1 day ago'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Student Certifications
        </h1>
        <p className="text-gray-600">Review and approve students for certification</p>
      </div>

      <Card className="border-blue-100 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <div className="text-blue-900 mb-1">Certification Approval Responsibility</div>
              <p className="text-blue-700">
                As the instructor, you are responsible for the final approval before certificates are issued. 
                Ensure all requirements are met and the student has demonstrated competency.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {pendingApprovals.map((student) => (
          <Card key={student.id} className="border-violet-100">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{student.studentName}</CardTitle>
                  <CardDescription>{student.course} • Batch: {student.batch}</CardDescription>
                </div>
                <Badge className="bg-orange-100 text-orange-700">Pending Approval</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-gray-600 mb-1">Theory Classes</div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600">{student.theoryClasses.completed}/{student.theoryClasses.total}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-gray-600 mb-1">Practical Sessions</div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600">{student.practicalSessions.completed}/{student.practicalSessions.total}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-gray-600 mb-1">Exam Score</div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600">{student.examScore}%</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-gray-600 mb-1">Completed</div>
                  <div>{student.completionDate}</div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Certification Comments (Optional)</label>
                <Textarea 
                  placeholder="Add any comments or notes about this certification..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Certification
                </Button>
                <Button variant="outline" className="text-red-600 border-red-300">
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
