import { useState } from 'react';
import { FileText, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function TeacherGrading() {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  const pendingGrading = [
    { id: '1', student: 'John Doe', exam: 'Mid-term Theory', course: 'Forklift Operator B3', submittedAt: '2 hours ago', type: 'MCQ', autoGraded: true, score: 85 },
    { id: '2', student: 'Sarah Smith', exam: 'Mid-term Theory', course: 'Forklift Operator B3', submittedAt: '3 hours ago', type: 'MCQ', autoGraded: true, score: 78 },
    { id: '3', student: 'Mike Johnson', exam: 'Practical Assessment', course: 'Forklift Operator B3', submittedAt: '1 day ago', type: 'Practical', autoGraded: false, score: null }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Grading Center
        </h1>
        <p className="text-gray-600">Review and grade student submissions</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Review ({pendingGrading.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingGrading.map((item) => (
            <Card key={item.id} className="border-violet-100">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{item.student}</CardTitle>
                    <CardDescription>{item.exam} • {item.course}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.autoGraded && (
                      <Badge className="bg-green-100 text-green-700">Auto-graded</Badge>
                    )}
                    <Badge variant="secondary">{item.type}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {item.autoGraded ? (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <div>MCQ Auto-graded</div>
                        <p className="text-gray-600">Score: {item.score}/100</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-700 mb-2">Teacher's Feedback</label>
                        <Textarea placeholder="Add your feedback for the student..." rows={3} />
                      </div>
                      <div className="flex gap-3">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve & Publish
                        </Button>
                        <Button variant="outline">Request Recheck</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 mb-2">Score (out of 100)</label>
                        <Input type="number" placeholder="Enter score" />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Grade</label>
                        <Input placeholder="e.g., A, B+, etc." />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Feedback</label>
                      <Textarea placeholder="Provide detailed feedback..." rows={3} />
                    </div>
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
                        Submit Grade
                      </Button>
                      <Button variant="outline">Save Draft</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <Card className="border-violet-100">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="mb-2">All Caught Up!</div>
              <p className="text-gray-600">No completed gradings to show</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
