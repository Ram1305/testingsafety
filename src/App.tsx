import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { AdminPortal } from './components/AdminPortal';
import { SuperAdminPortal } from './components/SuperAdminPortal';
import { CourseDetailsPage } from './components/CourseDetails';
import { CourseBooking } from './components/CourseBooking';
import { AboutUsPage } from './components/AboutUsPage';
import { ContactPage } from './components/ContactPage';
import { BookNowPage } from './components/BookNowPage';
import { FormsPage } from './components/FormsPage';
import { FeesRefundPage } from './components/FeesRefundPage';
import { PublicQuiz } from './components/student/PublicQuiz';
import { PublicEnrollmentForm } from './components/student/PublicEnrollmentForm';
import { PublicEnrollmentWizard } from './components/student/PublicEnrollmentWizard';
import { useAuth } from './contexts/AuthContext';
import type { AuthUser } from './contexts/AuthContext';
import { publicEnrollmentWizardService } from './services/publicEnrollmentWizard.service';
import { toast } from 'sonner';

export type UserRole = 'student' | 'teacher' | 'admin' | 'superadmin' | null;

// Legacy User interface for portal components
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  studentId?: string;
}

// Helper function to map AuthUser to legacy User format
const mapAuthUserToUser = (authUser: AuthUser): User => {
  const userTypeLower = authUser.userType?.toLowerCase() || '';
  
  let role: UserRole = 'student';
  
  if (userTypeLower === 'superadmin' || userTypeLower === 'super_admin' || userTypeLower === 'super admin') {
    role = 'superadmin';
  } else if (userTypeLower === 'admin') {
    role = 'admin';
  } else if (userTypeLower === 'teacher') {
    role = 'teacher';
  } else if (userTypeLower === 'student') {
    role = 'student';
  }

  console.log('Auth User Type:', authUser.userType, '-> Mapped Role:', role);

  return {
    id: authUser.userId,
    name: authUser.fullName,
    email: authUser.email,
    role: role,
    studentId: authUser.studentId,
  };
};

// Helper function to parse URL path
const parseUrlPath = (): { path: string; enrollCode?: string } => {
  const pathname = window.location.pathname;
  
  // Check for /enroll/:code pattern
  const enrollMatch = pathname.match(/^\/enroll\/([a-zA-Z0-9]+)$/);
  if (enrollMatch) {
    return { path: 'enroll', enrollCode: enrollMatch[1] };
  }
  
  return { path: pathname };
};

export default function App() {
  const { user: authUser, setUser, isLoading, logout, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'portal' | 'courseDetails' | 'courseBooking' | 'about' | 'contact' | 'bookNow' | 'publicQuiz' | 'publicEnrollment' | 'publicEnrollmentWizard' | 'forms' | 'feesRefund'>('landing');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseData, setSelectedCourseData] = useState<{
    courseName?: string;
    courseCode?: string;
    coursePrice?: number;
    experienceType?: 'with' | 'without';
  }>({});
  
  // Enrollment link data from URL
  const [enrollmentLinkData, setEnrollmentLinkData] = useState<{
    courseId?: string;
    courseDateId?: string;
    linkId?: string;
  } | null>(null);
  const [isLoadingEnrollmentLink, setIsLoadingEnrollmentLink] = useState(false);

  const user: User | null = authUser ? mapAuthUserToUser(authUser) : null;

  // Check URL path on mount for enrollment links
  useEffect(() => {
    const checkUrlPath = async () => {
      const { path, enrollCode } = parseUrlPath();
      
      if (path === 'enroll' && enrollCode) {
        setIsLoadingEnrollmentLink(true);
        try {
          // Fetch enrollment link data from API
          const response = await publicEnrollmentWizardService.getWizardDataByCode(enrollCode);
          if (response.success && response.data) {
            setEnrollmentLinkData({
              courseId: response.data.courseId,
              courseDateId: response.data.courseDateId,
              linkId: response.data.linkId,
            });
            setCurrentPage('publicEnrollmentWizard');
            // Update URL to clean state (optional)
            window.history.replaceState({}, '', '/');
          } else {
            toast.error('Invalid or expired enrollment link');
            setCurrentPage('landing');
            window.history.replaceState({}, '', '/');
          }
        } catch (error) {
          console.error('Error fetching enrollment link:', error);
          toast.error('Failed to load enrollment link. Please try again.');
          setCurrentPage('landing');
          window.history.replaceState({}, '', '/');
        } finally {
          setIsLoadingEnrollmentLink(false);
        }
      }
    };
    
    if (!isLoading) {
      checkUrlPath();
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && currentPage === 'login') {
        setCurrentPage('portal');
      }
    }
  }, [isAuthenticated, isLoading, currentPage]);

  const handleLogin = (userData: User) => {
    const authUser: AuthUser = {
      userId: userData.id,
      fullName: userData.name,
      email: userData.email,
      userType: userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Student',
      isActive: true,
      studentId: userData.studentId,
    };
    setUser(authUser);
    setCurrentPage('portal');
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('landing');
    setSelectedCourseId(null);
  };

  const handleGoToLogin = () => {
    setCurrentPage('login');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    setSelectedCourseId(null);
    setEnrollmentLinkData(null);
  };

  const handleViewCourses = () => {
    setCurrentPage('landing');
    setSelectedCourseId(null);
    setTimeout(() => {
      const coursesSection = document.getElementById('courses');
      if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleGoToAbout = () => {
    setCurrentPage('about');
  };

  const handleGoToContact = () => {
    setCurrentPage('contact');
  };

  const handleGoToBookNow = () => {
    setCurrentPage('bookNow');
  };

  const handleGoToPublicQuiz = () => {
    setCurrentPage('publicQuiz');
  };

  const handleGoToPublicEnrollment = () => {
    setCurrentPage('publicEnrollment');
  };

  const handleGoToPublicEnrollmentWizard = () => {
    setEnrollmentLinkData(null); // Clear any pre-selected data
    setCurrentPage('publicEnrollmentWizard');
  };

  const handleGoToForms = () => {
    setCurrentPage('forms');
  };

  const handleGoToFeesRefund = () => {
    setCurrentPage('feesRefund');
  };

  const handlePublicQuizComplete = (result: { userId: string; studentId: string; email: string; fullName: string; isPassed: boolean }) => {
    const authUser: AuthUser = {
      userId: result.userId,
      fullName: result.fullName,
      email: result.email,
      userType: 'Student',
      isActive: true,
      studentId: result.studentId,
    };
    
    setUser(authUser);
    setCurrentPage('portal');
  };

  const handlePublicEnrollmentComplete = (result: { userId: string; studentId: string; email: string; fullName: string }) => {
    const authUser: AuthUser = {
      userId: result.userId,
      fullName: result.fullName,
      email: result.email,
      userType: 'Student',
      isActive: true,
      studentId: result.studentId,
    };
    
    setUser(authUser);
    setCurrentPage('portal');
  };

  const handlePublicEnrollmentWizardComplete = (result: { userId: string; studentId: string; email: string; fullName: string }) => {
    const authUser: AuthUser = {
      userId: result.userId,
      fullName: result.fullName,
      email: result.email,
      userType: 'Student',
      isActive: true,
      studentId: result.studentId,
    };
    
    setUser(authUser);
    setEnrollmentLinkData(null);
    setCurrentPage('portal');
  };

  const handleCourseDetails = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('courseDetails');
  };

  const handleCourseBooking = (courseData?: { courseName?: string; courseCode?: string; coursePrice?: number; experienceType?: 'with' | 'without' }) => {
    if (courseData) {
      setSelectedCourseData(courseData);
    }
    setCurrentPage('courseBooking');
  };

  const handleBookCourse = (courseId: string, courseCode: string, courseName: string, price: number, experienceType?: 'with' | 'without') => {
    setSelectedCourseId(courseId);
    setSelectedCourseData({
      courseName,
      courseCode,
      coursePrice: price,
      experienceType
    });
    setCurrentPage('courseBooking');
  };

  const handleBackFromBooking = () => {
    if (selectedCourseId) {
      setCurrentPage('courseDetails');
    } else {
      setCurrentPage('landing');
    }
  };

  const handleBookingSuccess = (data: { userId: string; studentId: string; email: string }) => {
    let fullName = '';
    try {
      const tempUserData = localStorage.getItem('tempUserData');
      if (tempUserData) {
        const parsed = JSON.parse(tempUserData);
        fullName = parsed.fullName || '';
        localStorage.removeItem('tempUserData');
      }
    } catch (error) {
      console.error('Error retrieving temp user data:', error);
    }
    
    const authUser: AuthUser = {
      userId: data.userId,
      fullName: fullName,
      email: data.email,
      userType: 'Student',
      isActive: true,
      studentId: data.studentId,
    };
    
    setUser(authUser);
    setCurrentPage('portal');
  };

  // Show loading while checking enrollment link
  if (isLoading || isLoadingEnrollmentLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isLoadingEnrollmentLink ? 'Loading enrollment...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (currentPage === 'landing') {
    return (
      <LandingPage 
        onLogin={handleGoToLogin} 
        onRegister={handleGoToLogin} 
        onCourseDetails={handleCourseDetails}
        onAbout={handleGoToAbout}
        onContact={handleGoToContact}
        onBookNow={handleGoToBookNow}
        onLLNDTest={handleGoToPublicQuiz}
        onEnrollNow={handleGoToPublicEnrollmentWizard}
        onForms={handleGoToForms}
        onFeesRefund={handleGoToFeesRefund}
        onBookCourse={handleBookCourse}
      />
    );
  }

  if (currentPage === 'forms') {
    return (
      <FormsPage
        onBack={handleBackToLanding}
        onLogin={handleGoToLogin}
        onRegister={handleGoToLogin}
        onAbout={handleGoToAbout}
        onContact={handleGoToContact}
        onBookNow={handleGoToBookNow}
        onCourseDetails={handleCourseDetails}
        onFeesRefund={handleGoToFeesRefund}
      />
    );
  }

  if (currentPage === 'feesRefund') {
    return (
      <FeesRefundPage
        onBack={handleBackToLanding}
        onLogin={handleGoToLogin}
        onRegister={handleGoToLogin}
        onAbout={handleGoToAbout}
        onContact={handleGoToContact}
        onBookNow={handleGoToBookNow}
        onCourseDetails={handleCourseDetails}
      />
    );
  }

  if (currentPage === 'publicQuiz') {
    return (
      <PublicQuiz
        onComplete={handlePublicQuizComplete}
        onCancel={handleBackToLanding}
      />
    );
  }

  if (currentPage === 'publicEnrollment') {
    return (
      <PublicEnrollmentForm
        onComplete={handlePublicEnrollmentComplete}
        onCancel={handleBackToLanding}
      />
    );
  }

  if (currentPage === 'publicEnrollmentWizard') {
    return (
      <PublicEnrollmentWizard
        onComplete={handlePublicEnrollmentWizardComplete}
        onCancel={handleBackToLanding}
        preSelectedCourseId={enrollmentLinkData?.courseId}
        preSelectedCourseDateId={enrollmentLinkData?.courseDateId}
      />
    );
  }

  if (currentPage === 'bookNow') {
    return (
      <BookNowPage 
        onBack={handleBackToLanding}
        onLogin={handleGoToLogin}
        onRegister={handleGoToLogin}
        onCourseDetails={handleCourseDetails}
        onAbout={handleGoToAbout}
        onContact={handleGoToContact}
        onForms={handleGoToForms}
        onFeesRefund={handleGoToFeesRefund}
      />
    );
  }

  if (currentPage === 'about') {
    return (
      <AboutUsPage 
        onBack={handleBackToLanding}
        onLogin={handleGoToLogin}
        onRegister={handleGoToLogin}
        onContact={handleGoToContact}
        onViewCourses={handleViewCourses}
        onBookNow={handleGoToBookNow}
        onCourseDetails={handleCourseDetails}
        onForms={handleGoToForms}
        onFeesRefund={handleGoToFeesRefund}
      />
    );
  }

  if (currentPage === 'contact') {
    return (
      <ContactPage 
        onBack={handleBackToLanding}
        onLogin={handleGoToLogin}
        onRegister={handleGoToLogin}
        onAbout={handleGoToAbout}
        onViewCourses={handleViewCourses}
        onBookNow={handleGoToBookNow}
        onCourseDetails={handleCourseDetails}
        onForms={handleGoToForms}
        onFeesRefund={handleGoToFeesRefund}
      />
    );
  }

  if (currentPage === 'courseDetails' && selectedCourseId) {
    return (
      <CourseDetailsPage 
        courseId={selectedCourseId} 
        onBack={handleBackToLanding}
        onEnroll={handleCourseBooking}
        onLogin={handleGoToLogin}
        onRegister={handleGoToLogin}
        onContact={handleGoToContact}
        onViewCourses={handleViewCourses}
        onBookNow={handleGoToBookNow}
        onCourseDetails={handleCourseDetails}
        onAbout={handleGoToAbout}
        onForms={handleGoToForms}
        onFeesRefund={handleGoToFeesRefund}
      />
    );
  }

  if (currentPage === 'courseBooking') {
    return (
      <CourseBooking 
        courseId={selectedCourseId || undefined}
        courseName={selectedCourseData.courseName}
        courseCode={selectedCourseData.courseCode}
        coursePrice={selectedCourseData.coursePrice}
        experienceType={selectedCourseData.experienceType}
        onBack={handleBackFromBooking}
        onBookingSuccess={handleBookingSuccess}
        onAbout={handleGoToAbout}
        onContact={handleGoToContact}
        onBookNow={handleGoToBookNow}
        onForms={handleGoToForms}
        onFeesRefund={handleGoToFeesRefund}
      />
    );
  }

  if (currentPage === 'login') {
    return <LoginPage onLogin={handleLogin} onBack={handleBackToLanding} />;
  }

  if (isAuthenticated && user) {
    switch (user.role) {
      case 'student':
        return <StudentPortal user={user} onLogout={handleLogout} onNavigateToLanding={handleBackToLanding} />;
      case 'teacher':
        return <TeacherPortal user={user} onLogout={handleLogout} />;
      case 'admin':
        return <AdminPortal user={user} onLogout={handleLogout} onNavigateToLanding={handleBackToLanding} />;
      case 'superadmin':
        return <SuperAdminPortal user={user} onLogout={handleLogout} />;
      default:
        return <StudentPortal user={user} onLogout={handleLogout} onNavigateToLanding={handleBackToLanding} />;
    }
  }

  return null;
}