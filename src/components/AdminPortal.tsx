import { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  // GraduationCap, 
  DollarSign, 
  FileText, 
  Award, 
  Settings,
  Bell, 
  User, 
  LogOut,
  Menu,
  X,
  Home,
  // UserPlus,
  ClipboardList,
  ClipboardCheck,
  Calendar,
  FileEdit,
  Link2
} from 'lucide-react';
import { Button } from './ui/button';
import type { User as UserType } from '../App';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminCourses } from './admin/AdminCourses';
import { AdminStudents } from './admin/AdminStudents';
// import { AdminTeachers } from './admin/AdminTeachers';
// import { AdminBatches } from './admin/AdminBatches';
import { AdminPayments } from './admin/AdminPayments';
import { AdminExams } from './admin/AdminExams';
import { AdminCertificates } from './admin/AdminCertificates';
// import { AdminWalkIn } from './admin/AdminWalkIn';
import { AdminReports } from './admin/AdminReports';
import { AdminQuizResults } from './admin/AdminQuizResults';
import { AdminScheduling } from './admin/AdminScheduling';
import { AdminStudentEnrollments } from './admin/AdminStudentEnrollments';
import { AdminEnrollmentLinks } from './admin/AdminEnrollmentLinks';

interface AdminPortalProps {
  user: UserType;
  onLogout: () => void;
  onNavigateToLanding?: () => void;
}

type AdminPage = 'dashboard' | 'courses' | 'students' | 'payments' | 'exams' | 'certificates' | 'reports' | 'quiz-results' | 'scheduling' | 'enrollment-forms' | 'enrollment-links';
// Commented out: 'teachers' | 'batches' | 'walkin'

export function AdminPortal({ user, onLogout, onNavigateToLanding }: AdminPortalProps) {
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true); // Start with sidebar open on desktop
  const [navbarHidden, setNavbarHidden] = useState(false);
  const [studentEmailFilter, setStudentEmailFilter] = useState<string | undefined>(undefined);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', name: 'Courses', icon: BookOpen },
    { id: 'students', name: 'Students', icon: Users },
    // { id: 'teachers', name: 'Teachers', icon: GraduationCap },
    { id: 'scheduling', name: 'Schedule', icon: Calendar },
    // { id: 'walkin', name: 'Walk-in Registration', icon: UserPlus },
    { id: 'quiz-results', name: 'LLND Results', icon: ClipboardCheck },
    { id: 'enrollment-forms', name: 'Enrollment Forms', icon: FileEdit },
    { id: 'enrollment-links', name: 'Enrollment Links', icon: Link2 },
    { id: 'exams', name: 'Exams', icon: FileText },
    { id: 'certificates', name: 'Certificates', icon: Award },
    { id: 'payments', name: 'Payments', icon: DollarSign },
    { id: 'reports', name: 'Reports', icon: ClipboardList },
  ];

  const handleNavigate = (page: string, studentEmail?: string) => {
    setCurrentPage(page as AdminPage);
    setStudentEmailFilter(studentEmail);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard onNavigate={handleNavigate} onNavigateToLanding={onNavigateToLanding} />;
      case 'courses':
        return <AdminCourses />;
      case 'students':
        return <AdminStudents onNavigate={handleNavigate} />;
      // case 'teachers':
      //   return <AdminTeachers />;
      // case 'batches':
      //   return <AdminBatches />;
      case 'payments':
        return <AdminPayments />;
      case 'exams':
        return <AdminExams />;
      case 'certificates':
        return <AdminCertificates />;
      // case 'walkin':
      //   return <AdminWalkIn />;
      case 'reports':
        return <AdminReports />;
      case 'quiz-results':
        return <AdminQuizResults initialSearchQuery={studentEmailFilter} />;
      case 'scheduling':
        return <AdminScheduling />;
      case 'enrollment-forms':
        return <AdminStudentEnrollments initialSearchQuery={studentEmailFilter} />;
      case 'enrollment-links':
        return <AdminEnrollmentLinks />;
      default:
        return <AdminDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-violet-100">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              {/* Nav toggle button - works for both mobile and desktop */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newState = !navbarHidden;
                  setNavbarHidden(newState);
                  setSidebarOpen(!newState); // Inverse for mobile
                }}
                className="gap-2"
                title={navbarHidden ? "Show Navigation" : "Hide Navigation"}
              >
                {navbarHidden ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {navbarHidden ? "Show Nav" : "Hide Nav"}
                </span>
              </Button>
              <div className="tracking-tight">Admin Portal</div>
              {onNavigateToLanding && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onNavigateToLanding}
                  className="gap-2 ml-4"
                >
                  <Home className="w-4 h-4" />
                  <span>Go to Home Page</span>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)]
          w-64 bg-white border-r border-violet-100 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          flex-shrink-0
          ${navbarHidden ? '-translate-x-full' : 'translate-x-0'}
        `}>
          <div className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id as AdminPage);
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
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
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