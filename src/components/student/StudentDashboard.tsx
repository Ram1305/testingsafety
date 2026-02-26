import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Award, TrendingUp, Clock, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useAuth } from '../../contexts/AuthContext';
import { useQuizStatus } from '../../hooks/useQuizStatus';
import { studentEnrollmentFormService, type EnrollmentFormResponse } from '../../services/studentEnrollmentForm.service';
import { Quiz } from './Quiz';
import { StudentEnrollmentForm } from './StudentEnrollmentForm';

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
}

export function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const { user } = useAuth();
  const [enrollmentFormData, setEnrollmentFormData] = useState<EnrollmentFormResponse | null>(null);
  const [isLoadingEnrollmentForm, setIsLoadingEnrollmentForm] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);

  // Use the quiz status hook
  const {
    quizStatus,
    isLoading: isLoadingQuizStatus,
    hasAttemptedQuiz,
    hasPassedQuiz,
    canEnroll,
    refreshStatus
  } = useQuizStatus();

  // Fetch enrollment form status
  const fetchEnrollmentFormStatus = useCallback(async () => {
    if (!user?.studentId) {
      setIsLoadingEnrollmentForm(false);
      return;
    }
    
    try {
      setIsLoadingEnrollmentForm(true);
      const response = await studentEnrollmentFormService.getEnrollmentFormByStudentId(user.studentId);
      if (response.success && response.data) {
        setEnrollmentFormData(response.data);
      }
    } catch (error) {
      console.log('No enrollment form data:', error);
    } finally {
      setIsLoadingEnrollmentForm(false);
    }
  }, [user?.studentId]);

  useEffect(() => {
    fetchEnrollmentFormStatus();
  }, [fetchEnrollmentFormStatus]);

  // Handler for quiz completion
  const handleQuizComplete = async (passed: boolean, _score: number, _sectionScores: unknown[]) => {
    setShowQuiz(false);
    
    // Refresh quiz status from server
    await refreshStatus();
    
    if (passed) {
      alert('Assessment completed successfully! You can now enroll in courses.');
    }
  };

  const handleQuizCancel = () => {
    setShowQuiz(false);
  };

  const handleEnrollmentFormComplete = () => {
    setShowEnrollmentForm(false);
    fetchEnrollmentFormStatus();
  };

  // Enrollment form status flags - Match My Courses logic
  const needsEnrollmentForm = !enrollmentFormData?.enrollmentFormCompleted;
  const enrollmentFormPending = enrollmentFormData?.enrollmentFormStatus === 'Pending';
  const enrollmentFormRejected = enrollmentFormData?.enrollmentFormStatus === 'Rejected';
  const enrollmentFormApproved = enrollmentFormData?.enrollmentFormStatus === 'Approved';

  // Show Quiz or Enrollment Form if active
  if (showEnrollmentForm) {
    return (
      <StudentEnrollmentForm
        onComplete={handleEnrollmentFormComplete}
        onCancel={() => setShowEnrollmentForm(false)}
      />
    );
  }

  if (showQuiz) {
    return (
      <Quiz
        onComplete={handleQuizComplete}
        onCancel={handleQuizCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Welcome Back! 👋
        </h1>
        <p className="text-gray-600">Here's what's happening with your courses today.</p>
      </div>

      {/* Pre-Enrollment Assessment (LLN Test) Status Banner - At Top */}
      {!isLoadingQuizStatus && hasAttemptedQuiz && (
        <Alert className={hasPassedQuiz || canEnroll ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
          {hasPassedQuiz || canEnroll ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Pre-Enrollment Assessment Passed</AlertTitle>
              <AlertDescription className="text-green-800">
                Score: {quizStatus?.latestAttempt?.overallPercentage?.toFixed(2)}% - You can now enroll in courses. Payment verification required after enrollment.
              </AlertDescription>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-900">Assessment Under Review</AlertTitle>
              <AlertDescription className="text-yellow-800">
                Score: {quizStatus?.latestAttempt?.overallPercentage?.toFixed(2)}% - Your results are being reviewed by an administrator who may grant access to enroll.
                You cannot retake the assessment.
              </AlertDescription>
            </>
          )}
        </Alert>
      )}

      {/* LLND Assessment Banner - Show when quiz not attempted (first priority) */}
      {!isLoadingQuizStatus && !hasAttemptedQuiz && (
        <Card className="border-violet-200 bg-gradient-to-r from-violet-50 to-fuchsia-50">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">LLND Assessment Required</h3>
                  <p className="text-gray-600 text-sm">Complete the LLND assessment to fully activate your enrollment</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowQuiz(true)}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Take Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enrollment Form Status Banners */}
      {!isLoadingEnrollmentForm && (
        <>
          {needsEnrollmentForm && !enrollmentFormPending && !enrollmentFormApproved && (
            <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Enrollment Form Required</h3>
                      <p className="text-gray-600 text-sm">Complete your enrollment form to finalize your course registration</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowEnrollmentForm(true)}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Complete Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {enrollmentFormPending && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-900">Enrollment Form Under Review</AlertTitle>
              <AlertDescription className="text-yellow-800">
                Your enrollment form has been submitted and is being reviewed by an administrator.
                <Button variant="link" className="ml-2 p-0 h-auto text-yellow-700" onClick={() => setShowEnrollmentForm(true)}>
                  View/Edit Form
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {enrollmentFormRejected && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-900">Enrollment Form Needs Attention</AlertTitle>
              <AlertDescription className="text-red-800">
                Your enrollment form requires corrections. Please review and resubmit.
                {enrollmentFormData?.enrollmentFormReviewNotes && (
                  <span className="block mt-1 font-medium">Notes: {enrollmentFormData.enrollmentFormReviewNotes}</span>
                )}
                <Button variant="link" className="ml-2 p-0 h-auto text-red-700" onClick={() => setShowEnrollmentForm(true)}>
                  Edit Form
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {enrollmentFormApproved && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Enrollment Form Approved</AlertTitle>
              <AlertDescription className="text-green-800">
                Your enrollment form has been approved.
                <Button variant="link" className="ml-2 p-0 h-auto text-green-700" onClick={() => setShowEnrollmentForm(true)}>
                  View Form
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      {/* Quick Actions */}
      <Card className="border-violet-100 bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="secondary" 
            className="w-full justify-start"
            onClick={() => onNavigate('courses')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Enroll in New Course
          </Button>
          <Button 
            variant="secondary" 
            className="w-full justify-start"
            onClick={() => onNavigate('certificates')}
          >
            <Award className="w-4 h-4 mr-2" />
            Download Certificates
          </Button>
          <Button 
            variant="secondary" 
            className="w-full justify-start"
            onClick={() => onNavigate('results')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Results
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
