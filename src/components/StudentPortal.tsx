import { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  FileText, 
  Award, 
  Bell, 
  User as UserIcon, 
  LogOut,
  Menu,
  X,
  ShoppingCart,
  ClipboardList,
  Home
} from 'lucide-react';
import { Button } from './ui/button';
import type { User } from '../App';
import { StudentDashboard } from './student/StudentDashboard';
import { StudentCourses } from './student/StudentCourses';
import { StudentSchedule } from './student/StudentSchedule';
import { StudentResults } from './student/StudentResults';
import { StudentCertificates } from './student/StudentCertificates';
import { StudentProfile } from './student/StudentProfile';
import { StudentNotifications } from './student/StudentNotifications';
import { StudentCart } from './student/StudentCart';
import { StudentEnrollmentForm } from './student/StudentEnrollmentForm';

interface StudentPortalProps {
  user: User;
  onLogout: () => void;
  onNavigateToLanding?: () => void;
}

type StudentPage = 'dashboard' | 'courses' | 'schedule' | 'results' | 'certificates' | 'profile' | 'notifications' | 'cart' | 'enrollment-form';

export function StudentPortal({ user, onLogout, onNavigateToLanding }: StudentPortalProps) {
  const [currentPage, setCurrentPage] = useState<StudentPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true); // Start with sidebar open on desktop
  const [navbarHidden, setNavbarHidden] = useState(false);
  const [cartCount, setCartCount] = useState(2);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', name: 'My Courses', icon: BookOpen },
    { id: 'enrollment-form', name: 'Enrollment Form', icon: ClipboardList },
    { id: 'schedule', name: 'Schedule', icon: Calendar },
    { id: 'results', name: 'Results', icon: FileText },
    { id: 'certificates', name: 'Certificates', icon: Award },
  ];

  const handleNavigate = (page: string) => {
    setCurrentPage(page as StudentPage);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <StudentDashboard onNavigate={handleNavigate} />;
      case 'courses':
        return <StudentCourses />;
      case 'enrollment-form':
        return <StudentEnrollmentForm onComplete={() => setCurrentPage('courses')} />;
      case 'schedule':
        return <StudentSchedule />;
      case 'results':
        return <StudentResults />;
      case 'certificates':
        return <StudentCertificates />;
      case 'profile':
        return <StudentProfile user={user} />;
      case 'notifications':
        return <StudentNotifications />;
      case 'cart':
        return <StudentCart onCartUpdate={setCartCount} />;
      default:
        return <StudentDashboard onNavigate={handleNavigate} />;
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
              <div className="tracking-tight">Student Portal</div>
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
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setCurrentPage('cart')}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage('notifications')}
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage('profile')}
              >
                <UserIcon className="w-5 h-5" />
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
                    setCurrentPage(item.id as StudentPage);
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
