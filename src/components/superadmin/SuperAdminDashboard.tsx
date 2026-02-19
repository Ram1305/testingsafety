import { useEffect, useState } from 'react';
import { Shield, GraduationCap, Users, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { adminManagementService, type AdminStatsResponse } from '../../services/adminManagement.service';
import { toast } from 'sonner';

interface SuperAdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function SuperAdminDashboard({ onNavigate }: SuperAdminDashboardProps) {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminManagementService.getAdminStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        toast.error('Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = stats ? [
    {
      title: 'Total Admins',
      value: stats.totalAdmins.toString(),
      change: `+${stats.newAdminsThisMonth} this month`,
      icon: Shield,
      color: 'from-violet-600 to-purple-600',
      bgColor: 'bg-violet-50',
      iconColor: 'text-violet-600',
      trend: 'up'
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers.toString(),
      change: `+${stats.newTeachersThisMonth} this month`,
      icon: GraduationCap,
      color: 'from-fuchsia-600 to-pink-600',
      bgColor: 'bg-fuchsia-50',
      iconColor: 'text-fuchsia-600',
      trend: 'up'
    },
    {
      title: 'Active Users',
      value: stats.totalUsers.toString(),
      change: `${stats.activeAdmins + stats.activeTeachers} active`,
      icon: Users,
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: 'up'
    },
    {
      title: 'Active Admins',
      value: stats.activeAdmins.toString(),
      change: `${stats.inactiveAdmins} inactive`,
      icon: Activity,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: 'stable'
    }
  ] : [];

  /* Commented out data - no longer needed
  const recentActivity = [
    { type: 'admin-created', user: 'Super Admin', action: 'Created new admin account', time: '2 hours ago', entity: 'Michael Johnson' },
    { type: 'teacher-created', user: 'Super Admin', action: 'Created new teacher account', time: '5 hours ago', entity: 'Dr. Emily Parker' },
    { type: 'settings-changed', user: 'Super Admin', action: 'Updated system settings', time: '1 day ago', entity: 'Email Configuration' },
    { type: 'admin-deleted', user: 'Super Admin', action: 'Deactivated admin account', time: '2 days ago', entity: 'John Smith' },
    { type: 'teacher-edited', user: 'Super Admin', action: 'Updated teacher permissions', time: '3 days ago', entity: 'Dr. Sarah Wilson' }
  ];

  const pendingActions = [
    { id: 1, title: 'Review new admin registration', priority: 'high', date: 'Today' },
    { id: 2, title: 'Update system security settings', priority: 'medium', date: 'Tomorrow' },
    { id: 3, title: 'Backup database', priority: 'low', date: 'This Week' }
  ];
  */

  /* Commented out helper functions - no longer needed
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'admin-created':
      case 'admin-deleted':
        return <Shield className="w-4 h-4" />;
      case 'teacher-created':
      case 'teacher-edited':
        return <GraduationCap className="w-4 h-4" />;
      case 'settings-changed':
        return <Activity className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'admin-created':
        return 'bg-violet-50 text-violet-600';
      case 'admin-deleted':
        return 'bg-red-50 text-red-600';
      case 'teacher-created':
      case 'teacher-edited':
        return 'bg-fuchsia-50 text-fuchsia-600';
      case 'settings-changed':
        return 'bg-blue-50 text-blue-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  */

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-gray-900 mb-2">Super Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management console</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          </div>
        ) : (
          statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-violet-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    {stat.trend === 'up' && (
                      <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl text-gray-900">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      <Card className="border-violet-100">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => onNavigate('admins')}
              className="h-auto py-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 flex flex-col items-center gap-2"
            >
              <Shield className="w-6 h-6" />
              <span>Create New Admin</span>
            </Button>
            <Button
              onClick={() => onNavigate('teachers')}
              className="h-auto py-6 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 flex flex-col items-center gap-2"
            >
              <GraduationCap className="w-6 h-6" />
              <span>Create New Teacher</span>
            </Button>
            {/* <Button
              onClick={() => onNavigate('audit-logs')}
              className="h-auto py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex flex-col items-center gap-2"
            >
              <Activity className="w-6 h-6" />
              <span>View Audit Logs</span>
            </Button> */}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className="border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50">
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Overall system performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl text-violet-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl text-fuchsia-600 mb-2">234ms</div>
              <div className="text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl text-green-600 mb-2">0</div>
              <div className="text-gray-600">Critical Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
