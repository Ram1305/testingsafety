import { useState } from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Shield,
  Settings,
  Bell, 
  User, 
  LogOut,
  Menu,
  X,
  Activity,
  Database
} from 'lucide-react';
import { Button } from './ui/button';
import type { User as UserType } from '../App';
import { SuperAdminDashboard } from './superadmin/SuperAdminDashboard';
import { SuperAdminManageAdmins } from './superadmin/SuperAdminManageAdmins';
import { SuperAdminManageTeachers } from './superadmin/SuperAdminManageTeachers';
import { SuperAdminAuditLogs } from './superadmin/SuperAdminAuditLogs';
import { SuperAdminSettings } from './superadmin/SuperAdminSettings';

interface SuperAdminPortalProps {
  user: UserType;
  onLogout: () => void;
}

type SuperAdminPage = 'dashboard' | 'admins' | 'teachers' | 'audit-logs' | 'settings';

export function SuperAdminPortal({ user, onLogout }: SuperAdminPortalProps) {
  const [currentPage, setCurrentPage] = useState<SuperAdminPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'admins', name: 'Manage Admins', icon: Shield },
    { id: 'teachers', name: 'Manage Teachers', icon: GraduationCap },
    // { id: 'audit-logs', name: 'Audit Logs', icon: Activity },
    // { id: 'settings', name: 'System Settings', icon: Settings },
  ];

  const handleNavigate = (page: string) => {
    setCurrentPage(page as SuperAdminPage);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <SuperAdminDashboard onNavigate={handleNavigate} />;
      case 'admins':
        return <SuperAdminManageAdmins />;
      case 'teachers':
        return <SuperAdminManageTeachers />;
      case 'audit-logs':
        return <SuperAdminAuditLogs />;
      case 'settings':
        return <SuperAdminSettings />;
      default:
        return <SuperAdminDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-violet-100">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X /> : <Menu />}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Super Admin Portal</div>
                  <div className="text-xs text-gray-500">System Administrator</div>
                </div>
              </div>
            </div>

            {/* Right side - User Menu */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-violet-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-fuchsia-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-violet-50 rounded-lg cursor-pointer transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">Super Admin</div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-white/50 backdrop-blur-lg border-r border-violet-100 transition-transform duration-300 overflow-y-auto`}
        >
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id as SuperAdminPage);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-200'
                      : 'text-gray-700 hover:bg-violet-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* System Status */}
          <div className="p-4 m-4 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-900">System Status</span>
            </div>
            <div className="space-y-2 text-xs text-violet-700">
              <div className="flex justify-between">
                <span>Database:</span>
                <span className="font-medium text-green-600">Online</span>
              </div>
              <div className="flex justify-between">
                <span>API:</span>
                <span className="font-medium text-green-600">Online</span>
              </div>
              <div className="flex justify-between">
                <span>Uptime:</span>
                <span className="font-medium">99.9%</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
