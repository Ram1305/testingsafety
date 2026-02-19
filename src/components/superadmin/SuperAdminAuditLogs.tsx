import { useState } from 'react';
import { Activity, Search, Download, Shield, Users, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userRole: 'superadmin' | 'admin' | 'teacher' | 'student';
  action: string;
  category: 'account' | 'settings' | 'content' | 'security';
  status: 'success' | 'failed' | 'warning';
  details: string;
  ipAddress: string;
}

export function SuperAdminAuditLogs() {
  const [logs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: '2024-03-10 14:32:15',
      user: 'Super Admin',
      userRole: 'superadmin',
      action: 'Created admin account',
      category: 'account',
      status: 'success',
      details: 'Created new admin account for Michael Johnson',
      ipAddress: '192.168.1.1'
    },
    {
      id: '2',
      timestamp: '2024-03-10 14:15:08',
      user: 'Super Admin',
      userRole: 'superadmin',
      action: 'Created teacher account',
      category: 'account',
      status: 'success',
      details: 'Created new teacher account for Dr. Emily Parker',
      ipAddress: '192.168.1.1'
    },
    {
      id: '3',
      timestamp: '2024-03-10 13:45:22',
      user: 'Admin User',
      userRole: 'admin',
      action: 'Updated course',
      category: 'content',
      status: 'success',
      details: 'Modified course details for Forklift Operator Certification',
      ipAddress: '192.168.1.5'
    },
    {
      id: '4',
      timestamp: '2024-03-10 12:30:45',
      user: 'Super Admin',
      userRole: 'superadmin',
      action: 'Updated system settings',
      category: 'settings',
      status: 'success',
      details: 'Changed email notification settings',
      ipAddress: '192.168.1.1'
    },
    {
      id: '5',
      timestamp: '2024-03-10 11:20:33',
      user: 'Unknown User',
      userRole: 'student',
      action: 'Failed login attempt',
      category: 'security',
      status: 'failed',
      details: 'Multiple failed login attempts detected',
      ipAddress: '203.0.113.42'
    },
    {
      id: '6',
      timestamp: '2024-03-10 10:15:18',
      user: 'Super Admin',
      userRole: 'superadmin',
      action: 'Deactivated admin account',
      category: 'account',
      status: 'warning',
      details: 'Deactivated admin account for John Smith',
      ipAddress: '192.168.1.1'
    },
    {
      id: '7',
      timestamp: '2024-03-10 09:45:55',
      user: 'Dr. Sarah Smith',
      userRole: 'teacher',
      action: 'Approved certification',
      category: 'content',
      status: 'success',
      details: 'Approved Electrician Level 2 certification for student ID #1234',
      ipAddress: '192.168.1.12'
    },
    {
      id: '8',
      timestamp: '2024-03-10 09:12:40',
      user: 'Admin User',
      userRole: 'admin',
      action: 'Verified payment',
      category: 'content',
      status: 'success',
      details: 'Verified payment receipt for student enrollment',
      ipAddress: '192.168.1.5'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesRole = filterRole === 'all' || log.userRole === filterRole;

    return matchesSearch && matchesCategory && matchesStatus && matchesRole;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'account':
        return <Users className="w-4 h-4" />;
      case 'settings':
        return <Settings className="w-4 h-4" />;
      case 'content':
        return <Activity className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'account':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'settings':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'content':
        return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200';
      case 'security':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'failed':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'failed':
      case 'warning':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-700';
      case 'admin':
        return 'bg-violet-100 text-violet-700';
      case 'teacher':
        return 'bg-fuchsia-100 text-fuchsia-700';
      case 'student':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleExportLogs = () => {
    // In a real app, this would export to CSV or PDF
    console.log('Audit logs exported successfully!');
    // TODO: Implement toast notification system
  };

  const stats = [
    { label: 'Total Events', value: logs.length, color: 'text-violet-600' },
    { label: 'Success', value: logs.filter(l => l.status === 'success').length, color: 'text-green-600' },
    { label: 'Failed', value: logs.filter(l => l.status === 'failed').length, color: 'text-red-600' },
    { label: 'Warnings', value: logs.filter(l => l.status === 'warning').length, color: 'text-yellow-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Audit Logs</h1>
          <p className="text-gray-600">Monitor all system activities and changes</p>
        </div>
        <Button
          onClick={handleExportLogs}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-violet-100">
            <CardContent className="p-6">
              <div className="text-gray-600 mb-1">{stat.label}</div>
              <div className={`text-3xl ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-violet-100">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue placeholder="User Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="border-violet-100">
        <CardHeader>
          <CardTitle>Activity Log ({filteredLogs.length} events)</CardTitle>
          <CardDescription>Detailed system activity records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-violet-50">
                    <TableCell className="text-gray-600">{log.timestamp}</TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{log.user}</div>
                      <div className="text-xs text-gray-500 mt-1">{log.details}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRoleColor(log.userRole)}>
                        {log.userRole}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getCategoryColor(log.category)}>
                        <span className="flex items-center gap-1">
                          {getCategoryIcon(log.category)}
                          {log.category}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(log.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(log.status)}
                          {log.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 font-mono text-xs">{log.ipAddress}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No audit logs found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
