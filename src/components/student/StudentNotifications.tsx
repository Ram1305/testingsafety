import { Bell, CheckCircle, AlertCircle, Info, Calendar, Award, BookOpen, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function StudentNotifications() {
  const notifications = [
    {
      id: '1',
      type: 'success',
      category: 'Class',
      icon: CheckCircle,
      title: 'Practical Session Scheduled',
      message: 'Your Forklift Operator practical session has been scheduled for Nov 26, 2024 at 3:00 PM in Workshop B.',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'warning',
      category: 'Certificate',
      icon: AlertCircle,
      title: 'Certificate Expiring Soon',
      message: 'Your Basic Safety Training certificate will expire in 52 days. Consider renewing before expiry.',
      time: '1 day ago',
      read: false
    },
    {
      id: '3',
      type: 'info',
      category: 'Course',
      icon: Info,
      title: 'New Course Available',
      message: 'HVAC Technician License course is now available. Next batch starts Dec 5, 2024.',
      time: '2 days ago',
      read: true
    },
    {
      id: '4',
      type: 'success',
      category: 'Result',
      icon: Award,
      title: 'Exam Result Published',
      message: 'Your Forklift Operator mid-term exam result is now available. You scored 85/100.',
      time: '3 days ago',
      read: true
    },
    {
      id: '5',
      type: 'info',
      category: 'Schedule',
      icon: Calendar,
      title: 'Class Rescheduled',
      message: 'Theory class for Licensed Electrician has been rescheduled to Nov 28, 2024 at 2:00 PM.',
      time: '4 days ago',
      read: true
    },
    {
      id: '6',
      type: 'warning',
      category: 'Payment',
      icon: AlertCircle,
      title: 'Payment Reminder',
      message: 'Payment of $650 for Professional Plumber License course is due on Dec 1, 2024.',
      time: '5 days ago',
      read: true
    },
    {
      id: '7',
      type: 'success',
      category: 'Enrollment',
      icon: CheckCircle,
      title: 'Enrollment Confirmed',
      message: 'You have successfully enrolled in the Professional Plumber License course. Batch: PL-2024-B1',
      time: '1 week ago',
      read: true
    },
    {
      id: '8',
      type: 'info',
      category: 'Course',
      icon: BookOpen,
      title: 'Study Materials Available',
      message: 'New study materials for Electrician Level 1 Unit 3 have been uploaded.',
      time: '1 week ago',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'from-green-50 to-emerald-50 border-green-100';
      case 'warning':
        return 'from-orange-50 to-amber-50 border-orange-100';
      case 'info':
        return 'from-blue-50 to-indigo-50 border-blue-100';
      default:
        return 'from-gray-50 to-slate-50 border-gray-100';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-orange-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const filterByCategory = (category: string) => {
    if (category === 'all') return notifications;
    return notifications.filter(n => n.category === category);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-gray-600">Stay updated with your courses and activities</p>
        </div>
        <Badge className="bg-gradient-to-r from-violet-600 to-fuchsia-600">
          {unreadCount} Unread
        </Badge>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1">
          Mark All as Read
        </Button>
        <Button variant="outline" className="flex-1">
          Clear All
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Class">Classes</TabsTrigger>
          <TabsTrigger value="Result">Results</TabsTrigger>
          <TabsTrigger value="Certificate">Certificates</TabsTrigger>
          <TabsTrigger value="Course">Courses</TabsTrigger>
        </TabsList>

        {['all', 'Class', 'Result', 'Certificate', 'Course'].map((category) => (
          <TabsContent key={category} value={category} className="space-y-3 mt-6">
            {filterByCategory(category).map((notification) => {
              const Icon = notification.icon;
              return (
                <Card 
                  key={notification.id} 
                  className={`border ${getNotificationColor(notification.type)} ${!notification.read ? 'shadow-md' : ''}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        notification.type === 'success' ? 'bg-green-100' :
                        notification.type === 'warning' ? 'bg-orange-100' :
                        'bg-blue-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${getIconColor(notification.type)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span>{notification.title}</span>
                              {!notification.read && (
                                <Badge className="bg-violet-600 text-white text-xs px-2 py-0">New</Badge>
                              )}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {notification.category}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="icon" className="flex-shrink-0">
                            <Trash2 className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-gray-400">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>

      {/* Notification Settings */}
      <Card className="border-violet-100">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-violet-50">
            <div>
              <div className="mb-1">Class Reminders</div>
              <p className="text-gray-600">Get notified before your classes</p>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-violet-50">
            <div>
              <div className="mb-1">Exam Results</div>
              <p className="text-gray-600">Receive notifications when results are published</p>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-violet-50">
            <div>
              <div className="mb-1">Certificate Expiry</div>
              <p className="text-gray-600">Alerts for expiring certificates</p>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-violet-50">
            <div>
              <div className="mb-1">New Courses</div>
              <p className="text-gray-600">Updates about new course offerings</p>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
