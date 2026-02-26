import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Quiz } from './Quiz'; // Fixed import path - same folder
import { PaymentUpload } from './PaymentUpload'; // Fixed import path - same folder
import { useQuizStatus } from '../../hooks/useQuizStatus';
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Upload, 
  AlertTriangle,
  Clock,
  Award
} from 'lucide-react';

interface CourseEnrollmentProps {
  courseId: string;
  courseName: string;
  coursePrice: number;
  onBack: () => void;
  onEnrollmentComplete?: () => void;
}

type EnrollmentStep = 'checking' | 'quiz' | 'quiz-passed' | 'quiz-failed' | 'payment' | 'pending-verification' | 'enrolled';

export function CourseEnrollment({ 
  courseId, 
  courseName, 
  coursePrice, 
  onBack,
  onEnrollmentComplete 
}: CourseEnrollmentProps) {
  const { 
    quizStatus, 
    isLoading, 
    error, 
    refreshStatus,
    hasAttemptedQuiz,
    hasPassedQuiz,
    canEnroll 
  } = useQuizStatus();
  
  const [currentStep, setCurrentStep] = useState<EnrollmentStep>('checking');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'verified' | 'rejected' | undefined>(undefined);

  // Determine the current step based on quiz status
  useEffect(() => {
    if (isLoading) {
      setCurrentStep('checking');
      return;
    }

    if (!hasAttemptedQuiz) {
      setCurrentStep('quiz');
    } else if (hasPassedQuiz || canEnroll) {
      setCurrentStep('quiz-passed');
    } else {
      setCurrentStep('quiz-failed');
    }
  }, [isLoading, hasAttemptedQuiz, hasPassedQuiz, canEnroll]);

  const handleQuizComplete = async (passed: boolean, score: number) => {
    // Refresh quiz status after completion
    await refreshStatus();
    
    if (passed) {
      setCurrentStep('quiz-passed');
    } else {
      setCurrentStep('quiz-failed');
    }
  };

  const handleProceedToPayment = () => {
    setCurrentStep('payment');
  };

  // Handle payment upload - matches existing PaymentUpload props
  const handlePaymentUpload = (file: File, transactionId: string) => {
    console.log('Payment uploaded:', file.name, transactionId);
    setPaymentStatus('pending');
    setCurrentStep('pending-verification');
    onEnrollmentComplete?.();
  };

  const handlePaymentCancel = () => {
    setCurrentStep('quiz-passed');
  };

  // Loading state
  if (currentStep === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-violet-600 mx-auto" />
          <p className="mt-4 text-gray-600">Checking enrollment status...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center gap-4">
            <Button onClick={refreshStatus} variant="outline">
              Try Again
            </Button>
            <Button onClick={onBack} variant="outline">
              Back to Courses
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Quiz not attempted - Show Quiz
  if (currentStep === 'quiz') {
    return (
      <Quiz
        courseName={courseName}
        onComplete={handleQuizComplete}
        onCancel={onBack}
      />
    );
  }

  // Quiz Failed - Show failure message
  if (currentStep === 'quiz-failed') {
    return (
      <Card className="border-red-200">
        <CardHeader className="bg-red-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <XCircle className="w-6 h-6" />
            Assessment Not Passed
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Unfortunately, you did not pass the pre-enrollment assessment
            </h2>
            <p className="text-gray-600 mb-4">
              You need to pass all sections with at least 67% to proceed with enrollment.
            </p>
          </div>

          {quizStatus?.latestAttempt && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Your Results:</h3>
              <div className="space-y-2">
                <p>Overall Score: <span className="text-red-600 font-semibold">{quizStatus.latestAttempt.overallPercentage}%</span></p>
                <p>Correct Answers: {quizStatus.latestAttempt.correctAnswers} / {quizStatus.latestAttempt.totalQuestions}</p>
                <p>Attempt Date: {new Date(quizStatus.latestAttempt.attemptDate).toLocaleDateString()}</p>
              </div>
              
              {quizStatus.latestAttempt.sectionResults && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Section Results:</h4>
                  <div className="space-y-2">
                    {quizStatus.latestAttempt.sectionResults.map((section, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                        <span className="text-sm">{section.sectionName}</span>
                        <span className={`text-sm font-semibold ${section.sectionPassed ? 'text-green-600' : 'text-red-600'}`}>
                          {section.sectionPercentage}% {section.sectionPassed ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>What happens next?</strong>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>An administrator will review your assessment results</li>
                <li>If approved, you may be granted access to enroll</li>
                <li>You will be notified by email once a decision is made</li>
                <li>Contact support if you believe there was an error</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back to Courses
          </Button>
          <Button variant="outline" disabled>
            <Clock className="w-4 h-4 mr-2" />
            Awaiting Admin Review
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Quiz Passed - Show success and proceed to payment option
  if (currentStep === 'quiz-passed') {
    return (
      <Card className="border-green-200">
        <CardHeader className="bg-green-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" />
            Assessment Passed!
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Congratulations! You passed the pre-enrollment assessment
            </h2>
            <p className="text-gray-600">
              You are now eligible to enroll in this course.
            </p>
          </div>

          {quizStatus?.latestAttempt && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Your Results:</h3>
              <div className="space-y-2">
                <p>Overall Score: <span className="text-green-600 font-semibold">{quizStatus.latestAttempt.overallPercentage}%</span></p>
                <p>Correct Answers: {quizStatus.latestAttempt.correctAnswers} / {quizStatus.latestAttempt.totalQuestions}</p>
              </div>
            </div>
          )}

          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
            <h3 className="font-semibold text-violet-900 mb-2">Course Details</h3>
            <p className="text-violet-800"><strong>Course:</strong> {courseName}</p>
            <p className="text-violet-800"><strong>Price:</strong> ${coursePrice.toFixed(2)}</p>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <FileText className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Next Step:</strong> Upload your payment receipt to complete enrollment.
              Once verified by admin, you'll have access to the course.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back to Courses
          </Button>
          <Button 
            onClick={handleProceedToPayment}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Proceed to Payment
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Payment Upload Step - Using existing PaymentUpload component props
  if (currentStep === 'payment') {
    return (
      <PaymentUpload
        courseName={courseName}
        coursePrice={coursePrice}
        paymentStatus={paymentStatus}
        onUpload={handlePaymentUpload}
        onCancel={handlePaymentCancel}
      />
    );
  }

  // Pending Verification
  if (currentStep === 'pending-verification') {
    return (
      <Card className="border-yellow-200">
        <CardHeader className="bg-yellow-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Payment Pending Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Payment Receipt Submitted
            </h2>
            <p className="text-gray-600">
              Your payment is being reviewed by our team. You will be notified once it's verified.
            </p>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800">
              <strong>What happens next?</strong>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Admin will verify your payment within 24-48 hours</li>
                <li>You'll receive an email notification once verified</li>
                <li>Course access will be granted after verification</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={onBack} className="w-full">
            Back to Courses
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return null;
}