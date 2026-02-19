import { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Edit,
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  X,
  Download,
  FileDown,
  Printer
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { 
  studentEnrollmentFormService, 
  type EnrollmentFormListItem, 
  type EnrollmentFormResponse,
  type EnrollmentFormStats 
} from '../../services/studentEnrollmentForm.service';

interface AdminStudentEnrollmentsProps {
  initialSearchQuery?: string;
}

export function AdminStudentEnrollments({ initialSearchQuery }: AdminStudentEnrollmentsProps = {}) {
  const [enrollmentForms, setEnrollmentForms] = useState<EnrollmentFormListItem[]>([]);
  const [stats, setStats] = useState<EnrollmentFormStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // View/Edit Dialog
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<EnrollmentFormResponse | null>(null);
  const [loadingForm, setLoadingForm] = useState(false);

  // Review Dialog
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [isReviewing, setIsReviewing] = useState(false);

  // PDF handling
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  // Fetch enrollment forms
  const fetchEnrollmentForms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await studentEnrollmentFormService.getEnrollmentFormsForAdmin({
        searchQuery: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: currentPage,
        pageSize: pageSize,
        sortDescending: true,
      });

      if (response.success) {
        setEnrollmentForms(response.data.enrollmentForms);
        setTotalCount(response.data.totalCount);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch enrollment forms');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, currentPage, pageSize]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await studentEnrollmentFormService.getEnrollmentFormStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchEnrollmentForms();
    fetchStats();
  }, [fetchEnrollmentForms, fetchStats]);

  const handleViewForm = async (studentId: string) => {
    setLoadingForm(true);
    setViewDialogOpen(true);
    try {
      const response = await studentEnrollmentFormService.getEnrollmentFormByIdForAdmin(studentId);
      if (response.success) {
        setSelectedForm(response.data);
      } else {
        toast.error('Failed to load enrollment form');
        setViewDialogOpen(false);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load enrollment form');
      setViewDialogOpen(false);
    } finally {
      setLoadingForm(false);
    }
  };

  const handleOpenReviewDialog = (action: 'approve' | 'reject') => {
    setReviewAction(action);
    setReviewNotes('');
    setReviewDialogOpen(true);
  };

  const handleReviewSubmit = async () => {
    if (!selectedForm) return;

    setIsReviewing(true);
    try {
      const response = await studentEnrollmentFormService.reviewEnrollmentForm(selectedForm.studentId, {
        approve: reviewAction === 'approve',
        reviewNotes: reviewNotes || undefined,
      });

      if (response.success) {
        toast.success(`Enrollment form ${reviewAction === 'approve' ? 'approved' : 'rejected'} successfully`);
        setReviewDialogOpen(false);
        setViewDialogOpen(false);
        setSelectedForm(null);
        fetchEnrollmentForms();
        fetchStats();
      } else {
        toast.error(response.message || 'Failed to submit review');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsReviewing(false);
    }
  };

  const handleViewPdf = async (studentId: string) => {
    setIsPdfLoading(true);
    try {
      await studentEnrollmentFormService.viewEnrollmentFormPdf(studentId);
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleDownloadPdf = async (studentId: string, studentName: string) => {
    setIsPdfLoading(true);
    try {
      await studentEnrollmentFormService.downloadEnrollmentFormPdf(studentId, studentName);
      toast.success('PDF opened for printing');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setIsPdfLoading(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Unknown</Badge>;
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-gray-900 mb-2">Student Enrollment Forms</h1>
        <p className="text-gray-600">Review and manage student enrollment form submissions</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-violet-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Total Submitted</p>
                  <p className="text-2xl font-bold text-violet-600">{stats.totalSubmitted}</p>
                </div>
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approvedCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejectedCount}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <Card className="border-violet-100">
        <CardContent className="p-6">
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="w-[150px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forms Table */}
      <Card className="border-violet-100">
        <CardHeader>
          <CardTitle>Enrollment Forms ({totalCount})</CardTitle>
          <CardDescription>Review submitted enrollment forms</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto" />
              <p className="mt-2 text-gray-500">Loading...</p>
            </div>
          ) : enrollmentForms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No enrollment forms found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrollments</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollmentForms.map((form) => (
                      <TableRow key={form.studentId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="font-medium text-gray-900">{form.fullName}</div>
                          </div>
                        </TableCell>
                        <TableCell>{form.email}</TableCell>
                        <TableCell>{form.phoneNumber || 'N/A'}</TableCell>
                        <TableCell>{formatDate(form.submittedAt)}</TableCell>
                        <TableCell>{getStatusBadge(form.status)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-blue-200 text-blue-700">
                            {form.enrollmentCount} course{form.enrollmentCount !== 1 ? 's' : ''}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewForm(form.studentId)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewPdf(form.studentId)}
                              disabled={isPdfLoading}
                              title="View PDF"
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadPdf(form.studentId, form.fullName)}
                              disabled={isPdfLoading}
                              title="Print/Download PDF"
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1 || loading}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || loading}
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

      {/* View Form Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={(open) => { if (!open) { setViewDialogOpen(false); setSelectedForm(null); } }}>
        <DialogContent className="max-w-4xl max-h-[90vh] enrollment-form-dialog-content">
          <DialogHeader>
            <DialogTitle>Enrollment Form Details</DialogTitle>
            <DialogDescription>
              Review the student's enrollment form submission
            </DialogDescription>
          </DialogHeader>
          
          {loadingForm ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            </div>
          ) : selectedForm ? (
            <ScrollArea className="enrollment-form-scroll-area">
              <div className="space-y-6 pr-4 pb-4">
                {/* Status Banner */}
                <div className={`p-4 rounded-lg flex items-center justify-between ${
                  selectedForm.enrollmentFormStatus === 'Approved' ? 'bg-green-50 border border-green-200' :
                  selectedForm.enrollmentFormStatus === 'Rejected' ? 'bg-red-50 border border-red-200' :
                  'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-center gap-3">
                    {selectedForm.enrollmentFormStatus === 'Approved' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                     selectedForm.enrollmentFormStatus === 'Rejected' ? <XCircle className="w-5 h-5 text-red-600" /> :
                     <Clock className="w-5 h-5 text-yellow-600" />}
                    <div>
                      <div className="font-medium">Status: {selectedForm.enrollmentFormStatus}</div>
                      {selectedForm.enrollmentFormReviewedAt && (
                        <div className="text-sm text-gray-600">
                          Reviewed on {formatDate(selectedForm.enrollmentFormReviewedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* PDF Buttons */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewPdf(selectedForm.studentId)}
                      disabled={isPdfLoading}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      View PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadPdf(selectedForm.studentId, selectedForm.studentName)}
                      disabled={isPdfLoading}
                    >
                      <Printer className="w-4 h-4 mr-1" />
                      Print
                    </Button>
                    {selectedForm.enrollmentFormStatus === 'Pending' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleOpenReviewDialog('approve')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleOpenReviewDialog('reject')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Review Notes */}
                {selectedForm.enrollmentFormReviewNotes && (
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <h4 className="font-medium mb-2">Review Notes</h4>
                    <p className="text-gray-600">{selectedForm.enrollmentFormReviewNotes}</p>
                  </div>
                )}

                <Tabs defaultValue="applicant" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="applicant">Applicant</TabsTrigger>
                    <TabsTrigger value="usi">USI</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="additional">Additional</TabsTrigger>
                    <TabsTrigger value="declaration">Declaration</TabsTrigger>
                  </TabsList>

                  <TabsContent value="applicant" className="mt-4 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Personal Details</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-500">Title</Label>
                          <p className="font-medium">{selectedForm.title || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Full Name</Label>
                          <p className="font-medium">{`${selectedForm.givenName || ''} ${selectedForm.middleName || ''} ${selectedForm.surname || ''}`.trim() || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Preferred Name</Label>
                          <p className="font-medium">{selectedForm.preferredName || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Date of Birth</Label>
                          <p className="font-medium">{formatDate(selectedForm.dateOfBirth)}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Gender</Label>
                          <p className="font-medium">{selectedForm.gender || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Email</Label>
                          <p className="font-medium">{selectedForm.email || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Mobile</Label>
                          <p className="font-medium">{selectedForm.mobile || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Home Phone</Label>
                          <p className="font-medium">{selectedForm.homePhone || 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Residential Address</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-medium">
                          {selectedForm.residentialAddress || 'N/A'}
                          {selectedForm.residentialSuburb && `, ${selectedForm.residentialSuburb}`}
                          {selectedForm.residentialState && ` ${selectedForm.residentialState}`}
                          {selectedForm.residentialPostcode && ` ${selectedForm.residentialPostcode}`}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Emergency Contact</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-500">Name</Label>
                          <p className="font-medium">{selectedForm.emergencyContactName || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Relationship</Label>
                          <p className="font-medium">{selectedForm.emergencyContactRelationship || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Phone</Label>
                          <p className="font-medium">{selectedForm.emergencyContactNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Emergency Permission</Label>
                          <p className="font-medium">{selectedForm.emergencyPermission || 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="usi" className="mt-4 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">USI Details</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-500">USI</Label>
                          <p className="font-medium">{selectedForm.usi || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Apply through STA</Label>
                          <p className="font-medium">{selectedForm.usiApplyThroughSTA || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">USI Access Permission</Label>
                          <p className="font-medium">{selectedForm.usiAccessPermission ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Town/City of Birth</Label>
                          <p className="font-medium">{selectedForm.townCityOfBirth || 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="education" className="mt-4 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Prior Education</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-500">School Level</Label>
                          <p className="font-medium">{selectedForm.schoolLevel || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Year Completed</Label>
                          <p className="font-medium">{selectedForm.schoolCompleteYear || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">School Name</Label>
                          <p className="font-medium">{selectedForm.schoolName || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">School Location</Label>
                          <p className="font-medium">
                            {selectedForm.schoolInAustralia 
                              ? `${selectedForm.schoolState || ''} ${selectedForm.schoolPostcode || ''}`.trim() || 'Australia'
                              : selectedForm.schoolCountry || 'Overseas'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Employment</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-500">Employment Status</Label>
                          <p className="font-medium">{selectedForm.employmentStatus || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Employer</Label>
                          <p className="font-medium">{selectedForm.employerName || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Training Reason</Label>
                          <p className="font-medium">{selectedForm.trainingReason || 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="additional" className="mt-4 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Additional Information</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-500">Country of Birth</Label>
                          <p className="font-medium">{selectedForm.countryOfBirth || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Speaks Other Language</Label>
                          <p className="font-medium">{selectedForm.speaksOtherLanguage || 'N/A'}</p>
                        </div>
                        {selectedForm.speaksOtherLanguage === 'Yes' && (
                          <div>
                            <Label className="text-gray-500">Home Language</Label>
                            <p className="font-medium">{selectedForm.homeLanguage || 'N/A'}</p>
                          </div>
                        )}
                        <div>
                          <Label className="text-gray-500">Indigenous Status</Label>
                          <p className="font-medium">{selectedForm.indigenousStatus || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Has Disability</Label>
                          <p className="font-medium">{selectedForm.hasDisability || 'N/A'}</p>
                        </div>
                        {selectedForm.hasDisability === 'Yes' && selectedForm.disabilityTypes && (
                          <div className="col-span-2">
                            <Label className="text-gray-500">Disability Types</Label>
                            <p className="font-medium">{selectedForm.disabilityTypes.join(', ')}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="declaration" className="mt-4 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Declaration & Signature</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-500">Privacy Notice Accepted</Label>
                            <p className="font-medium">{selectedForm.acceptedPrivacyNotice ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Terms Accepted</Label>
                            <p className="font-medium">{selectedForm.acceptedTermsAndConditions ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Declaration Name</Label>
                            <p className="font-medium">{selectedForm.declarationName || 'N/A'}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Declaration Date</Label>
                            <p className="font-medium">{formatDate(selectedForm.declarationDate)}</p>
                          </div>
                        </div>
                        {selectedForm.signatureData && (
                          <div>
                            <Label className="text-gray-500">Signature</Label>
                            <div className="mt-2 border rounded-lg p-4 bg-white">
                              <img 
                                src={selectedForm.signatureData} 
                                alt="Signature" 
                                className="max-h-24"
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve Enrollment Form' : 'Reject Enrollment Form'}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve' 
                ? 'Are you sure you want to approve this enrollment form?' 
                : 'Please provide a reason for rejecting this enrollment form.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reviewNotes">
                Review Notes {reviewAction === 'reject' && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="reviewNotes"
                placeholder={reviewAction === 'reject' ? 'Please explain why the form is being rejected...' : 'Optional notes...'}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setReviewDialogOpen(false)}
                disabled={isReviewing}
              >
                Cancel
              </Button>
              <Button
                className={`flex-1 ${reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                onClick={handleReviewSubmit}
                disabled={isReviewing || (reviewAction === 'reject' && !reviewNotes.trim())}
              >
                {isReviewing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {reviewAction === 'approve' ? <CheckCircle className="w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                    {reviewAction === 'approve' ? 'Approve' : 'Reject'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
