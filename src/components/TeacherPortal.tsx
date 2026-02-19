import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Award, 
  Bell, 
  User, 
  LogOut,
  Menu,
  X,
  Calendar
} from 'lucide-react';
import { Button } from './ui/button';
import type { User as UserType } from '../App';
import { TeacherDashboard } from './teacher/TeacherDashboard';
import { TeacherGrading } from './teacher/TeacherGrading';
import { TeacherStudents } from './teacher/TeacherStudents';
import { TeacherCertifications } from './teacher/TeacherCertifications';
import { TeacherSchedule } from './teacher/TeacherSchedule';

interface TeacherPortalProps {
  user: UserType;
  onLogout: () => void;
}

type TeacherPage = 'dashboard' | 'grading' | 'students' | 'certifications' | 'schedule' | 'profile';

export function TeacherPortal({ user, onLogout }: TeacherPortalProps) {
  const [currentPage, setCurrentPage] = useState<TeacherPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'grading', name: 'Grading', icon: FileText },
    { id: 'students', name: 'My Students', icon: Users },
    { id: 'certifications', name: 'Certifications', icon: Award },
    { id: 'schedule', name: 'Schedule', icon: Calendar },
  ];

  const handleNavigate = (page: string) => {
    setCurrentPage(page as TeacherPage);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <TeacherDashboard onNavigate={handleNavigate} />;
      case 'grading':
        return <TeacherGrading />;
      case 'students':
        return <TeacherStudents />;
      case 'certifications':
        return <TeacherCertifications />;
      case 'schedule':
        return <TeacherSchedule />;
      default:
        return <TeacherDashboard onNavigate={handleNavigate} />;
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
              <div className="tracking-tight">Teacher Portal</div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)]
          w-64 bg-white border-r border-violet-100
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id as TeacherPage);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-violet-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-violet-100">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
