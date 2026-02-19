import { useState, useEffect, useCallback } from 'react';
import { Search, BookOpen, Clock, Users, CheckCircle, Upload, AlertTriangle, Loader2, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Quiz } from './Quiz';
import { PaymentUpload } from './PaymentUpload';
import { StudentEnrollmentForm } from './StudentEnrollmentForm';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useQuizStatus } from '../../hooks/useQuizStatus';
import { useAuth } from '../../contexts/AuthContext';
import { enrollmentService, type StudentBrowseCourse, type StudentEnrolledCourse } from '../../services/enrollment.service';
import { studentEnrollmentFormService, type EnrollmentFormResponse } from '../../services/studentEnrollmentForm.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';

export function StudentCourses() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPaymentUpload, setShowPaymentUpload] = useState(false);
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState<StudentBrowseCourse | null>(null);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [activeTab, setActiveTab] = useState('enrolled');
  
  // Enrollment form status
  const [enrollmentFormData, setEnrollmentFormData] = useState<EnrollmentFormResponse | null>(null);
  const [isLoadingEnrollmentForm, setIsLoadingEnrollmentForm] = useState(true);
  
  // For quiz after payment (enrolled course quiz)
  const [enrolledCourseForQuiz, setEnrolledCourseForQuiz] = useState<StudentEnrolledCourse | null>(null);
  
  // Selected dates for enrollment
  const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});

  // API data states
  const [availableCourses, setAvailableCourses] = useState<StudentBrowseCourse[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<StudentEnrolledCourse[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(true);
  const [courseError, setCourseError] = useState<string | null>(null);

  // Use the quiz status hook
  const {
    quizStatus,
    isLoading: isLoadingQuizStatus,
    error: quizStatusError,
    refreshStatus,
    hasAttemptedQuiz,
    hasPassedQuiz,
    canEnroll
  } = useQuizStatus();

  // Fetch enrollment form status
  const fetchEnrollmentFormStatus = useCallback(async () => {
    if (!user?.studentId) {
      setIsLoadingEnrollmentForm(false);
      return;
    }
    
    try {
      setIsLoadingEnrollmentForm(true);
      // Use the studentId-specific endpoint to get enrollment form data
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

  // Fetch available courses
  const fetchAvailableCourses = useCallback(async () => {
    if (!user?.studentId) return;
    
    setIsLoadingCourses(true);
    setCourseError(null);
    
    try {
      const response = await enrollmentService.getAvailableCourses(user.studentId, searchQuery || undefined);
      if (response.success && response.data) {
        setAvailableCourses(response.data);
      } else {
        setCourseError(response.message || 'Failed to fetch courses');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setCourseError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setIsLoadingCourses(false);
    }
  }, [user?.studentId, searchQuery]);

  // Fetch enrolled courses
  const fetchEnrolledCourses = useCallback(async () => {
    if (!user?.studentId) return;
    
    setIsLoadingEnrollments(true);
    
    try {
      const response = await enrollmentService.getStudentEnrollments(user.studentId);
      if (response.success && response.data) {
        setEnrolledCourses(response.data);
      }
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    } finally {
      setIsLoadingEnrollments(false);
    }
  }, [user?.studentId]);

  useEffect(() => {
    fetchAvailableCourses();
  }, [fetchAvailableCourses]);

  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses]);

  useEffect(() => {
    fetchEnrollmentFormStatus();
  }, [fetchEnrollmentFormStatus]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user?.studentId) {
        fetchAvailableCourses();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // NEW FLOW: Show payment screen first, create enrollment only on payment submit
  const handleEnrollClick = async (course: StudentBrowseCourse) => {
    // Don't create enrollment yet - just show payment upload screen
    // Enrollment will be created when payment is submitted
    setSelectedCourseForPayment(course);
    setShowPaymentUpload(true);
  };

  // Handle quiz completion for enrolled course (after payment)
  const handleEnrolledCourseQuizComplete = async (passed: boolean, _score: number, _sectionScores: unknown[]) => {
    setShowQuiz(false);
    
    // Refresh quiz status from server
    await refreshStatus();
    
    // Refresh enrolled courses to update quiz status
    await fetchEnrolledCourses();
    
    if (passed) {
      alert('Assessment completed successfully! Your enrollment is now fully activated.');
    }
    
    setEnrolledCourseForQuiz(null);
  };

  const handleQuizCancel = () => {
    setShowQuiz(false);
    setEnrolledCourseForQuiz(null);
  };

  // Handle "Take Assessment" click for enrolled course
  const handleTakeAssessmentForEnrolledCourse = (course: StudentEnrolledCourse) => {
    setEnrolledCourseForQuiz(course);
    setShowQuiz(true);
  };

  const handlePaymentUpload = async (file: File, transactionId: string) => {
    if (!user?.studentId || !selectedCourseForPayment) {
      return;
    }

    try {
      const selectedDateId = selectedDates[selectedCourseForPayment.courseId];
      
      // Create enrollment AND submit payment proof in one step
      const enrollmentResponse = await enrollmentService.createEnrollment(user.studentId, {
        courseId: selectedCourseForPayment.courseId,
        selectedTheoryDateId: selectedDateId || undefined,
      });

      if (!enrollmentResponse.success || !enrollmentResponse.data) {
        throw new Error(enrollmentResponse.message || 'Failed to create enrollment');
      }

      // Now submit the payment proof for the newly created enrollment
      const paymentResponse = await enrollmentService.submitPaymentProof(
        enrollmentResponse.data.enrollmentId,
        user.studentId,
        {
          transactionId,
          amountPaid: selectedCourseForPayment.price,
          receiptFile: file,
        }
      );

      if (paymentResponse.success) {
        // Refresh courses and enrollments
        await Promise.all([fetchAvailableCourses(), fetchEnrolledCourses()]);
        setShowPaymentUpload(false);
        setSelectedCourseForPayment(null);
        
        // Notify user about next step - take quiz
        alert('Payment receipt uploaded successfully! Please complete the LLND Assessment in your enrolled courses section.');
      } else {
        // If payment proof submission fails, we need to cancel the enrollment
        try {
          await enrollmentService.cancelEnrollment(enrollmentResponse.data.enrollmentId, user.studentId);
        } catch (cancelErr) {
          console.error('Error cancelling enrollment after payment failure:', cancelErr);
        }
        alert(paymentResponse.message || 'Failed to submit payment proof');
      }
    } catch (err) {
      console.error('Error during enrollment:', err);
      alert(err instanceof Error ? err.message : 'Failed to complete enrollment');
    }
  };

  const handlePaymentCancel = () => {
    // No enrollment was created, so just close the dialog
    setShowPaymentUpload(false);
    setSelectedCourseForPayment(null);
  };

  const handleDateSelect = (courseId: string, dateId: string) => {
    setSelectedDates(prev => ({ ...prev, [courseId]: dateId }));
  };

  const handleEnrollmentFormComplete = () => {
    setShowEnrollmentForm(false);
    fetchEnrollmentFormStatus();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get next batch date
  const getNextBatchDate = (course: StudentBrowseCourse) => {
    if (course.nextBatchDate) {
      return formatDate(course.nextBatchDate);
    }
    if (course.availableDates && course.availableDates.length > 0) {
      return formatDate(course.availableDates[0].scheduledDate);
    }
    return 'Contact us';
  };

  // Check if any enrolled course needs quiz
  const hasEnrolledCourseNeedingQuiz = enrolledCourses.some(c => !c.quizCompleted);

  // Check if enrollment form needs to be completed
  const needsEnrollmentForm = !enrollmentFormData?.enrollmentFormCompleted;
  const enrollmentFormPending = enrollmentFormData?.enrollmentFormStatus === 'Pending';
  const enrollmentFormApproved = enrollmentFormData?.enrollmentFormStatus === 'Approved';
  const enrollmentFormRejected = enrollmentFormData?.enrollmentFormStatus === 'Rejected';

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
        onComplete={enrolledCourseForQuiz ? handleEnrolledCourseQuizComplete : handleQuizCancel}
        onCancel={handleQuizCancel}
      />
    );
  }

  if (showPaymentUpload && selectedCourseForPayment) {
    return (
      <PaymentUpload
        courseName={selectedCourseForPayment.courseName}
        coursePrice={selectedCourseForPayment.price}
        onUpload={handlePaymentUpload}
        onCancel={handlePaymentCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          My Courses
        </h1>
        <p className="text-gray-600">Manage your enrolled courses and discover new certifications</p>
      </div>

      {/* Quiz Status Alert - At Top */}
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

      {/* Enrollment Form Alert */}
      {!isLoadingEnrollmentForm && enrolledCourses.length > 0 && (
        <>
          {needsEnrollmentForm && (
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

      {/* Error Alert */}
      {(quizStatusError || courseError) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {quizStatusError || courseError}
            <Button variant="link" onClick={() => { refreshStatus(); fetchAvailableCourses(); }} className="ml-2 p-0 h-auto">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
          <TabsTrigger value="available">Browse Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="space-y-4 mt-6">
          {isLoadingEnrollments ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            </div>
          ) : enrolledCourses.length === 0 ? (
            <Card className="border-violet-100">
              <CardContent className="py-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Enrolled Courses</h3>
                <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                <Button variant="outline" onClick={() => setActiveTab('available')}>Browse Available Courses</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Show Take Assessment Card if there are enrolled courses needing quiz */}
              {!isLoadingQuizStatus && hasEnrolledCourseNeedingQuiz && !hasAttemptedQuiz && (
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

              {enrolledCourses.map((course) => (
                <Card key={course.enrollmentId} className="border-violet-100 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-48 h-48 flex-shrink-0">
                      <ImageWithFallback
                        src={course.imageUrl || ''}
                        alt={course.courseName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{course.courseName}</CardTitle>
                            <CardDescription>
                              {course.batchCode && `Batch: ${course.batchCode} • `}
                              {course.instructor && `Instructor: ${course.instructor}`}
                              {!course.batchCode && !course.instructor && `Enrolled: ${formatDate(course.enrolledAt)}`}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge className={
                              course.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : course.status === 'Active'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }>
                              {course.status}
                            </Badge>
                            <Badge className={
                              course.paymentStatus === 'Verified'
                                ? 'bg-green-100 text-green-700'
                                : course.paymentStatus === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }>
                              Payment: {course.paymentStatus}
                            </Badge>
                            {/* Quiz Status Badge */}
                            <Badge className={
                              course.quizCompleted
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700'
                            }>
                              Quiz: {course.quizCompleted ? 'Completed' : 'Pending'}
                            </Badge>
                            {/* Enrollment Form Status Badge */}
                            {!isLoadingEnrollmentForm && (
                              <Badge className={
                                enrollmentFormApproved
                                  ? 'bg-green-100 text-green-700'
                                  : enrollmentFormPending
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : enrollmentFormRejected
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-orange-100 text-orange-700'
                              }>
                                Form: {enrollmentFormApproved ? 'Approved' : enrollmentFormPending ? 'Pending' : enrollmentFormRejected ? 'Rejected' : 'Required'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600">Overall Progress</span>
                              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                {course.progress}%
                              </span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="gap-2 pt-6">
                        {/* Show Complete Enrollment Form button if not completed */}
                        {needsEnrollmentForm && (
                          <Button 
                            onClick={() => setShowEnrollmentForm(true)}
                            variant="outline"
                            className="border-orange-300 text-orange-700 hover:bg-orange-50"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Complete Enrollment Form
                          </Button>
                        )}
                        {/* Show Take Assessment button if quiz not completed */}
                        {!course.quizCompleted && !hasAttemptedQuiz && (
                          <Button 
                            onClick={() => handleTakeAssessmentForEnrolledCourse(course)}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Take LLND Assessment
                          </Button>
                        )}
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-6 mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoadingCourses ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            </div>
          ) : availableCourses.length === 0 ? (
            <Card className="border-violet-100">
              <CardContent className="py-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Courses Available</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'No courses match your search.' : 'No new courses available at this time.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => {
                const hasAvailableDates = course.availableDates && course.availableDates.length > 0;
                
                return (
                  <Card key={course.courseId} className="border-violet-100 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <ImageWithFallback
                        src={course.imageUrl || ''}
                        alt={course.courseName}
                        className="w-full h-full object-cover"
                      />
                      {course.categoryName && (
                        <Badge className="absolute top-4 right-4 bg-white/90 text-violet-700">
                          {course.categoryName}
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{course.courseName}</CardTitle>
                      <CardDescription>Next batch starts: {getNextBatchDate(course)}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration || 'Contact us'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{course.enrolledStudentsCount}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {course.hasTheory && (
                          <Badge variant="secondary" className="text-xs">Theory</Badge>
                        )}
                        {course.hasPractical && (
                          <Badge variant="secondary" className="text-xs">Practical</Badge>
                        )}
                      </div>
                      {course.validityPeriod && (
                        <div className="text-gray-500">
                          Valid for {course.validityPeriod}
                        </div>
                      )}
                      
                      {/* Date Selection - Always show if dates available */}
                      {hasAvailableDates && (
                        <div className="space-y-2 pt-2 border-t">
                          <Label className="flex items-center gap-1 text-sm">
                            <Calendar className="w-4 h-4" />
                            Select a Date
                          </Label>
                          <Select 
                            value={selectedDates[course.courseId] || ''} 
                            onValueChange={(value) => handleDateSelect(course.courseId, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose a date" />
                            </SelectTrigger>
                            <SelectContent>
                              {course.availableDates.filter(d => d.isAvailable).map((date) => (
                                <SelectItem key={date.courseDateId} value={date.courseDateId}>
                                  {formatDate(date.scheduledDate)}
                                  {date.sessionCount > 1 && ` (${date.sessionCount} sessions)`}
                                  {date.availableSpots < 100 && date.availableSpots !== 2147483647 && ` - ${date.availableSpots} spots left`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div>
                        <div className="text-gray-500">Price</div>
                        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                          ${course.price}
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleEnrollClick(course)}
                        className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Enroll & Pay
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}