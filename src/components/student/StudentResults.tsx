import { FileText, TrendingUp, Trophy, AlertCircle, Download, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function StudentResults() {
  const examResults = [
    {
      id: '1',
      course: 'Forklift Operator Certification',
      examName: 'Mid-term Theory Exam',
      date: 'Nov 15, 2024',
      type: 'MCQ',
      totalMarks: 100,
      obtainedMarks: 85,
      passingMarks: 70,
      status: 'Passed',
      grade: 'A',
      reviewedBy: 'John Miller',
      feedback: 'Excellent understanding of safety protocols and operational procedures.'
    },
    {
      id: '2',
      course: 'Licensed Electrician Level 1',
      examName: 'Unit 1 Assessment',
      date: 'Nov 10, 2024',
      type: 'Theory + Practical',
      totalMarks: 100,
      obtainedMarks: 78,
      passingMarks: 70,
      status: 'Passed',
      grade: 'B+',
      reviewedBy: 'Dr. Sarah Smith',
      feedback: 'Good grasp of electrical concepts. Practice more on circuit diagrams.'
    },
    {
      id: '3',
      course: 'Professional Plumber License',
      examName: 'Practical Skills Test',
      date: 'Nov 8, 2024',
      type: 'Practical',
      totalMarks: 100,
      obtainedMarks: 92,
      passingMarks: 70,
      status: 'Passed',
      grade: 'A+',
      reviewedBy: 'Mike Johnson',
      feedback: 'Outstanding practical skills and attention to detail.'
    }
  ];

  const pendingExams = [
    {
      id: '4',
      course: 'Professional Plumber License',
      examName: 'Final Certification Exam',
      scheduledDate: 'Nov 27, 2024',
      time: '10:00 AM - 12:00 PM',
      type: 'Theory + Practical',
      location: 'Exam Hall A',
      status: 'Upcoming'
    },
    {
      id: '5',
      course: 'Forklift Operator Certification',
      examName: 'Final Practical Assessment',
      scheduledDate: 'Dec 1, 2024',
      time: '02:00 PM - 04:00 PM',
      type: 'Practical',
      location: 'Workshop B',
      status: 'Upcoming'
    }
  ];

  const overallStats = {
    totalExams: 5,
    examsPassed: 3,
    averageScore: 85,
    highestScore: 92,
    pendingExams: 2
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          My Results
        </h1>
        <p className="text-gray-600">Track your exam results and academic performance</p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="pt-6 flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-amber-900">🚀 Coming Soon!</div>
            <p className="text-amber-800 text-sm">
              This results section will be fully implemented in the next update. All features and data will be available shortly.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview - COMMENTED OUT FOR FUTURE IMPLEMENTATION */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="border-violet-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Exams</p>
                <p className="text-violet-600">{overallStats.totalExams}</p>
              </div>
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-violet-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Passed</p>
                <p className="text-green-600">{overallStats.examsPassed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-violet-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Average</p>
                <p className="text-blue-600">{overallStats.averageScore}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-violet-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Highest Score</p>
                <p className="text-fuchsia-600">{overallStats.highestScore}%</p>
              </div>
              <div className="w-12 h-12 bg-fuchsia-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-fuchsia-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-violet-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Pending</p>
                <p className="text-orange-600">{overallStats.pendingExams}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="results">Exam Results</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Exams</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4 mt-6">
          {examResults.map((result) => (
            <Card key={result.id} className="border-violet-100">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{result.examName}</CardTitle>
                    <CardDescription>{result.course} • {result.date}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      result.grade.startsWith('A') 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }>
                      Grade: {result.grade}
                    </Badge>
                    <Badge className="bg-green-100 text-green-700">
                      {result.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-violet-50 rounded-lg p-4">
                    <div className="text-gray-600 mb-1">Exam Type</div>
                    <div>{result.type}</div>
                  </div>
                  <div className="bg-fuchsia-50 rounded-lg p-4">
                    <div className="text-gray-600 mb-1">Score</div>
                    <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                      {result.obtainedMarks}/{result.totalMarks}
                    </div>
                  </div>
                  <div className="bg-violet-50 rounded-lg p-4">
                    <div className="text-gray-600 mb-1">Percentage</div>
                    <div>{Math.round((result.obtainedMarks / result.totalMarks) * 100)}%</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Performance</span>
                    <span>{Math.round((result.obtainedMarks / result.totalMarks) * 100)}%</span>
                  </div>
                  <Progress value={(result.obtainedMarks / result.totalMarks) * 100} className="h-2" />
                  <div className="flex justify-between mt-1 text-gray-500">
                    <span>Passing: {result.passingMarks}%</span>
                    <span>Total: {result.totalMarks}</span>
                  </div>
                </div>

                <div className="border-t border-violet-100 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      {result.reviewedBy.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1">Reviewed by {result.reviewedBy}</div>
                      <p className="text-gray-600">{result.feedback}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline">
                    Request Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {pendingExams.map((exam) => (
            <Card key={exam.id} className="border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{exam.examName}</CardTitle>
                    <CardDescription>{exam.course}</CardDescription>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700">
                    {exam.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-gray-600 mb-1">Date</div>
                    <div>{exam.scheduledDate}</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-gray-600 mb-1">Time</div>
                    <div>{exam.time}</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-gray-600 mb-1">Location</div>
                    <div>{exam.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-blue-900">
                    Make sure to arrive 15 minutes before the exam starts. Bring your student ID and necessary materials.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
                    View Exam Details
                  </Button>
                  <Button variant="outline">
                    Add to Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs> */}
    </div>
  );
}
