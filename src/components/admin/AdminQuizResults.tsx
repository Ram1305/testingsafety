import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, CheckCircle2, XCircle, Eye, UserCheck, Loader2, RefreshCw, Undo2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { adminQuizService } from '../../services/adminQuiz.service';
import type { 
  AdminQuizResultResponse, 
  AdminQuizResultListResponse,
  QuizStatisticsResponse 
} from '../../services/adminQuiz.service';

interface AdminQuizResultsProps {
  initialSearchQuery?: string;
}

export function AdminQuizResults({ initialSearchQuery }: AdminQuizResultsProps = {}) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedResult, setSelectedResult] = useState<AdminQuizResultResponse | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data
  const [resultsData, setResultsData] = useState<AdminQuizResultListResponse | null>(null);
  const [statistics, setStatistics] = useState<QuizStatisticsResponse | null>(null);
  
  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchQuizResults();
    fetchStatistics();
  }, [pageNumber, statusFilter]);

  const fetchQuizResults = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminQuizService.getAllQuizResults({
        search: searchQuery || undefined,
        status: statusFilter || undefined,
        pageNumber,
        pageSize,
      });
      
      if (response.success) {
        setResultsData(response.data);
      } else {
        setError(response.message || 'Failed to fetch quiz results');
      }
    } catch (err) {
      console.error('Error fetching quiz results:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch quiz results');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await adminQuizService.getQuizStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleSearch = () => {
    setPageNumber(1);
    fetchQuizResults();
  };

  const handleViewDetails = (result: AdminQuizResultResponse) => {
    setSelectedResult(result);
    setRejectReason('');
    setShowDetailDialog(true);
  };

  const handleApproveStudent = async () => {
    if (!selectedResult) {
      return;
    }

    // Check if already approved
    if (selectedResult.hasAdminBypass || selectedResult.status === 'Approved') {
      alert('This student has already been approved.');
      setShowDetailDialog(false);
      return;
    }

    setIsProcessing(true);
    try {
      const response = await adminQuizService.createAdminBypass({
        studentId: selectedResult.studentId,
        quizAttemptId: selectedResult.quizAttemptId,
      });

      if (response.success) {
        alert('Student has been approved to enroll in courses. Their quiz results have been updated to meet passing criteria.');
        setShowDetailDialog(false);
        fetchQuizResults();
        fetchStatistics();
      } else {
        alert(response.message || 'Failed to approve student. They may already be approved.');
      }
    } catch (err) {
      console.error('Error approving student:', err);
      alert(err instanceof Error ? err.message : 'Failed to approve student. Please refresh the page and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectStudent = async () => {
    if (!selectedResult) return;

    setIsProcessing(true);
    try {
      const response = await adminQuizService.rejectStudent({
        studentId: selectedResult.studentId,
        quizAttemptId: selectedResult.quizAttemptId,
        reason: rejectReason || undefined,
      });

      if (response.success) {
        alert('Student has been rejected');
        setShowDetailDialog(false);
        fetchQuizResults();
        fetchStatistics();
      } else {
        alert(response.message || 'Failed to reject student');
      }
    } catch (err) {
      console.error('Error rejecting student:', err);
      alert(err instanceof Error ? err.message : 'Failed to reject student');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRevokeBypass = async (bypassId: string) => {
    if (!confirm('Are you sure you want to revoke this bypass?')) return;

    setIsProcessing(true);
    try {
      const response = await adminQuizService.revokeAdminBypass(bypassId);

      if (response.success) {
        alert('Bypass has been revoked');
        setShowDetailDialog(false);
        fetchQuizResults();
        fetchStatistics();
      } else {
        alert(response.message || 'Failed to revoke bypass');
      }
    } catch (err) {
      console.error('Error revoking bypass:', err);
      alert(err instanceof Error ? err.message : 'Failed to revoke bypass');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (result: AdminQuizResultResponse) => {
    if (result.status === 'Approved' || result.isPassed) {
      return (
        <Badge className="bg-green-100 text-green-700">
          Approved
        </Badge>
      );
    }
    if (result.status === 'Rejected') {
      return (
        <Badge className="bg-red-100 text-red-700">
          Rejected
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-700">
        Pending
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Quiz Results Management
        </h1>
        <p className="text-gray-600">Review and manage student pre-enrollment assessment results</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Assessments</CardDescription>
            <CardTitle className="text-3xl">{statistics?.totalAttempts || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Passed</CardDescription>
            <CardTitle className="text-3xl text-green-600">{statistics?.passedCount || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Failed</CardDescription>
            <CardTitle className="text-3xl text-red-600">{statistics?.failedCount || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Review</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{statistics?.pendingReviewCount || 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Admin Bypasses</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{statistics?.approvedBypassCount || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average Score</CardDescription>
            <CardTitle className="text-2xl text-purple-600">{statistics?.averageScore || 0}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pass Rate</CardDescription>
            <CardTitle className="text-2xl text-emerald-600">{statistics?.passRate || 0}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Results</CardTitle>
          <CardDescription>View and manage all student assessment results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by student name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setPageNumber(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPageNumber(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <Button onClick={handleSearch} variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button onClick={() => { fetchQuizResults(); fetchStatistics(); }} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            </div>
          ) : (
            <>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Overall Score</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultsData?.results && resultsData.results.length > 0
                      ? resultsData.results.map((result) => (
                        <TableRow key={result.quizAttemptId}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{result.studentName}</div>
                              <div className="text-sm text-gray-500">{result.studentEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(result.attemptDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={result.isPassed ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                {result.overallPercentage}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {result.isPassed ? (
                              <Badge className="bg-green-100 text-green-700">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Passed
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700">
                                <XCircle className="w-3 h-3 mr-1" />
                                Failed
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(result)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(result)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                      : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No quiz results found
                          </TableCell>
                        </TableRow>
                      )
                    }
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {resultsData && resultsData.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {((pageNumber - 1) * pageSize) + 1} to {Math.min(pageNumber * pageSize, resultsData.totalCount)} of {resultsData.totalCount} results
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pageNumber === 1}
                      onClick={() => setPageNumber(pageNumber - 1)}
                    >
                      Previous
                    </Button>
                    <span className="px-3 py-1 text-sm">
                      Page {pageNumber} of {resultsData.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pageNumber === resultsData.totalPages}
                      onClick={() => setPageNumber(pageNumber + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assessment Details</DialogTitle>
            <DialogDescription>
              Detailed results for {selectedResult?.studentName}
            </DialogDescription>
          </DialogHeader>

          {selectedResult && (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="bg-violet-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Student Name:</span>
                  <span className="font-medium">{selectedResult.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span>{selectedResult.studentEmail}</span>
                </div>
                {selectedResult.studentPhone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{selectedResult.studentPhone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Date:</span>
                  <span>{new Date(selectedResult.attemptDate).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  {getStatusBadge(selectedResult)}
                </div>
              </div>

              {/* Overall Score */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Overall Score</span>
                  <span className={`text-2xl font-bold ${selectedResult.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedResult.overallPercentage}%
                  </span>
                </div>
                <Progress 
                  value={selectedResult.overallPercentage} 
                  className={`h-3 ${selectedResult.isPassed ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Correct: {selectedResult.correctAnswers}/{selectedResult.totalQuestions}</span>
                  <span>Wrong: {selectedResult.wrongAnswers}</span>
                </div>
              </div>

              {/* Section Breakdown */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">Section Results:</h4>
                {selectedResult.sectionResults.map((section, index) => (
                  <Card key={index} className={`border-2 ${section.sectionPassed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {section.sectionPassed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className={`font-medium ${section.sectionPassed ? 'text-green-900' : 'text-red-900'}`}>
                            {section.sectionName}
                          </span>
                        </div>
                        <span className={`text-lg font-bold ${section.sectionPassed ? 'text-green-600' : 'text-red-600'}`}>
                          {section.sectionPercentage}%
                        </span>
                      </div>
                      <Progress 
                        value={section.sectionPercentage} 
                        className={`h-2 ${section.sectionPassed ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>{section.correctAnswers}/{section.totalQuestions} correct</span>
                        <span>{section.sectionPassed ? 'Passed' : 'Failed'} (Passing: 67%)</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Admin Bypass Info */}
              {/* Removed Admin Bypass Active alert - no longer displayed */}

              {/* Approve Section - Only show for failed & pending */}
              {!selectedResult.isPassed && selectedResult.status === 'Pending' && !selectedResult.hasAdminBypass && (
                <>
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertDescription className="text-yellow-800">
                      This student did not pass the assessment. You can approve them to enroll in courses. The system will automatically adjust their results to meet the passing criteria.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Close
            </Button>
            
            {/* Revoke Bypass Button */}
            {selectedResult?.hasAdminBypass && selectedResult.adminBypass && (
              <Button
                variant="destructive"
                onClick={() => handleRevokeBypass(selectedResult.adminBypass!.bypassId)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Undo2 className="w-4 h-4 mr-2" />
                )}
                Revoke Bypass
              </Button>
            )}

            {/* Reject & Approve Buttons - Only for failed & pending */}
            {selectedResult && !selectedResult.isPassed && selectedResult.status === 'Pending' && !selectedResult.hasAdminBypass && (
              <>
                <Button
                  variant="destructive"
                  onClick={handleRejectStudent}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Reject
                </Button>
                <Button
                  onClick={handleApproveStudent}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <UserCheck className="w-4 h-4 mr-2" />
                  )}
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}