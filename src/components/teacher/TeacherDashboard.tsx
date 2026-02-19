import { Users, Calendar, FileCheck, Award, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface TeacherDashboardProps {
  onNavigate: (page: string) => void;
}

export function TeacherDashboard({ onNavigate }: TeacherDashboardProps) {
  const stats = [
    { label: 'Total Students', value: '48', icon: Users, color: 'violet' },
    { label: 'Classes Today', value: '4', icon: Calendar, color: 'fuchsia' },
    { label: 'Pending Grading', value: '12', icon: FileCheck, color: 'orange' },
    { label: 'Certifications', value: '6', icon: Award, color: 'green' },
  ];

  const todayClasses = [
    {
      id: '1',
      course: 'Forklift Operator Certification',
      batch: 'FO-2024-B3',
      type: 'Theory',
      time: '09:00 AM - 11:00 AM',
      room: 'Room 101',
      students: 16
    },
    {
      id: '2',
      course: 'Forklift Operator Certification',
      batch: 'FO-2024-B3',
      type: 'Practical',
      time: '03:00 PM - 05:00 PM',
      room: 'Workshop B',
      students: 16
    }
  ];

  const pendingTasks = [
    {
      id: '1',
      task: 'Grade Mid-term Exams',
      course: 'Forklift Operator - Batch B3',
      count: 16,
      dueDate: 'Today',
      priority: 'high'
    },
    {
      id: '2',
      task: 'Approve Certifications',
      course: 'Forklift Operator - Batch B2',
      count: 6,
      dueDate: 'Tomorrow',
      priority: 'medium'
    },
    {
      id: '3',
      task: 'Review Practical Assessments',
      course: 'Forklift Operator - Batch B3',
      count: 8,
      dueDate: 'Nov 28',
      priority: 'low'
    }
  ];

  const recentStudents = [
    {
      id: '1',
      name: 'John Doe',
      course: 'Forklift Operator',
      progress: 65,
      lastActivity: '2 hours ago',
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Smith',
      course: 'Forklift Operator',
      progress: 80,
      lastActivity: '5 hours ago',
      status: 'active'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      course: 'Forklift Operator',
      progress: 45,
      lastActivity: '1 day ago',
      status: 'behind'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Welcome Back, Teacher! 👋
        </h1>
        <p className="text-gray-600">Here's an overview of your teaching activities today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-violet-100 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-${stat.color}-600`}>{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-violet-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Today's Classes</CardTitle>
                  <CardDescription>Your schedule for today</CardDescription>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => onNavigate('schedule')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayClasses.map((class_) => (
                <div key={class_.id} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="truncate">{class_.course}</span>
                      <Badge variant="secondary">{class_.type}</Badge>
                    </div>
                    <p className="text-gray-600">{class_.time} • {class_.room}</p>
                    <p className="text-gray-500">{class_.students} students • Batch: {class_.batch}</p>
                  </div>
                  <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
                    Start Class
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card className="border-violet-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Tasks</CardTitle>
                  <CardDescription>Tasks that need your attention</CardDescription>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => onNavigate('grading')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{task.task}</span>
                      <Badge className={
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{task.course} • {task.count} items</p>
                    <p className="text-gray-500">Due: {task.dueDate}</p>
                  </div>
                  <Button variant="outline">Review</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-violet-100 bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => onNavigate('grading')}
              >
                <FileCheck className="w-4 h-4 mr-2" />
                Grade Exams
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => onNavigate('certifications')}
              >
                <Award className="w-4 h-4 mr-2" />
                Approve Certifications
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => onNavigate('students')}
              >
                <Users className="w-4 h-4 mr-2" />
                View Students
              </Button>
            </CardContent>
          </Card>

          {/* Recent Students */}
          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle>Recent Student Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentStudents.map((student) => (
                <div key={student.id} className="p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{student.name}</div>
                      <p className="text-gray-500">{student.lastActivity}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Progress</span>
                      <span>{student.progress}%</span>
                    </div>
                    <Progress value={student.progress} className="h-1" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
