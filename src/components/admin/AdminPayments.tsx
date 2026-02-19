import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Clock, Eye, X, Check, Download, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { adminPaymentService, type AdminPaymentProof, type AdminPaymentStats } from '../../services/adminPayment.service';
import { useAuth } from '../../contexts/AuthContext';

export function AdminPayments() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<AdminPaymentProof | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // API data states
  const [receipts, setReceipts] = useState<AdminPaymentProof[]>([]);
  const [stats, setStats] = useState<AdminPaymentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Fetch payment proofs
  const fetchPaymentProofs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await adminPaymentService.getPaymentProofs({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        searchQuery: searchQuery || undefined,
        page: currentPage,
        pageSize,
        sortBy: 'uploadedat',
        sortDescending: true,
      });

      if (response.success && response.data) {
        setReceipts(response.data.paymentProofs);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      } else {
        setError(response.message || 'Failed to fetch payment proofs');
      }
    } catch (err) {
      console.error('Error fetching payment proofs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch payment proofs');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, currentPage]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    
    try {
      const response = await adminPaymentService.getPaymentStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentProofs();
  }, [fetchPaymentProofs]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchPaymentProofs();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const handleViewDetails = async (receipt: AdminPaymentProof) => {
    setSelectedReceipt(receipt);
    setShowDetailDialog(true);
    setRejectionReason('');
  };

  const handleVerifyPayment = async (paymentProofId: string) => {
    if (!user?.userId) {
      alert('User not authenticated');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await adminPaymentService.verifyPayment(paymentProofId, user.userId, {
        approve: true,
      });

      if (response.success) {
        await Promise.all([fetchPaymentProofs(), fetchStats()]);
        setShowDetailDialog(false);
        alert('Payment verified successfully! Student can now access the course.');
      } else {
        alert(response.message || 'Failed to verify payment');
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
      alert(err instanceof Error ? err.message : 'Failed to verify payment');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRejectPayment = async (paymentProofId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (!user?.userId) {
      alert('User not authenticated');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await adminPaymentService.verifyPayment(paymentProofId, user.userId, {
        approve: false,
        rejectionReason,
      });

      if (response.success) {
        await Promise.all([fetchPaymentProofs(), fetchStats()]);
        setShowDetailDialog(false);
        alert('Payment receipt rejected. Student has been notified.');
      } else {
        alert(response.message || 'Failed to reject payment');
      }
    } catch (err) {
      console.error('Error rejecting payment:', err);
      alert(err instanceof Error ? err.message : 'Failed to reject payment');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownloadReceipt = async (paymentProofId: string, fileName: string) => {
    setIsDownloading(true);
    try {
      const blob = await adminPaymentService.downloadReceipt(paymentProofId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'payment_receipt';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading receipt:', err);
      alert('Failed to download receipt');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Payment Management
        </h1>
        <p className="text-gray-600">Track and manage course payments and verify student receipts</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Verification</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {isStatsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats?.pendingCount ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Verified Payments</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {isStatsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats?.verifiedCount ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {isStatsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats?.rejectedCount ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Verified Amount</CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              {isStatsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `$${stats?.totalVerifiedAmount?.toLocaleString() ?? 0}`}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button variant="link" onClick={fetchPaymentProofs} className="ml-2 p-0 h-auto">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Receipt Verification */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Receipt Verification</CardTitle>
              <CardDescription>Review and verify student payment receipts</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => { fetchPaymentProofs(); fetchStats(); }}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search by student, course, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              <Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            </div>
          ) : receipts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No payment receipts found
            </div>
          ) : (
            <>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receipts.map((receipt) => (
                      <TableRow key={receipt.paymentProofId}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{receipt.studentName}</div>
                            <div className="text-sm text-gray-500">{receipt.studentEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{receipt.courseName}</div>
                            <div className="text-sm text-gray-500">{receipt.courseCode}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                          ${receipt.amountPaid.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{receipt.transactionId}</code>
                        </TableCell>
                        <TableCell>{formatDate(receipt.uploadedAt)}</TableCell>
                        <TableCell>
                          <Badge className={
                            receipt.status === 'Verified'
                              ? 'bg-green-100 text-green-700'
                              : receipt.status === 'Rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }>
                            {receipt.status === 'Verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {receipt.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                            {receipt.status === 'Rejected' && <X className="w-3 h-3 mr-1" />}
                            {receipt.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadReceipt(receipt.paymentProofId, receipt.receiptFileName)}
                              disabled={isDownloading}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(receipt)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Review
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
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
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

      {/* Receipt Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Receipt Review</DialogTitle>
            <DialogDescription>
              Verify payment receipt for {selectedReceipt?.studentName}
            </DialogDescription>
          </DialogHeader>

          {selectedReceipt && (
            <div className="space-y-6">
              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-violet-50 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Student Information</h4>
                  <div><strong>Name:</strong> {selectedReceipt.studentName}</div>
                  <div><strong>Email:</strong> {selectedReceipt.studentEmail}</div>
                </div>
                <div className="bg-fuchsia-50 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Course Information</h4>
                  <div><strong>Course:</strong> {selectedReceipt.courseName}</div>
                  <div><strong>Code:</strong> {selectedReceipt.courseCode}</div>
                  <div><strong>Course Price:</strong> ${selectedReceipt.coursePrice.toLocaleString()}</div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-600">Transaction Details</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>Transaction ID:</strong> <code className="bg-white px-2 py-1 rounded">{selectedReceipt.transactionId}</code></div>
                  <div><strong>Amount Paid:</strong> <span className="font-semibold text-green-600">${selectedReceipt.amountPaid.toLocaleString()}</span></div>
                  <div><strong>Payment Date:</strong> {formatDate(selectedReceipt.paymentDate)}</div>
                  <div><strong>Upload Date:</strong> {formatDateTime(selectedReceipt.uploadedAt)}</div>
                  {selectedReceipt.paymentMethod && <div><strong>Payment Method:</strong> {selectedReceipt.paymentMethod}</div>}
                  {selectedReceipt.bankName && <div><strong>Bank:</strong> {selectedReceipt.bankName}</div>}
                  {selectedReceipt.referenceNumber && <div><strong>Reference:</strong> {selectedReceipt.referenceNumber}</div>}
                </div>
              </div>

              {/* Receipt Image/PDF */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-600">Payment Receipt</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReceipt(selectedReceipt.paymentProofId, selectedReceipt.receiptFileName)}
                    disabled={isDownloading}
                  >
                    {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                    Download Receipt
                  </Button>
                </div>
                <div className="text-sm text-gray-500 mb-3">File: {selectedReceipt.receiptFileName}</div>
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[300px]">
                  {selectedReceipt.receiptFileName?.toLowerCase().endsWith('.pdf') ? (
                    <div className="text-center">
                      <div className="text-gray-500 mb-4">PDF Document</div>
                      <Button
                        variant="outline"
                        onClick={() => window.open(selectedReceipt.receiptFileUrl, '_blank')}
                      >
                        Open PDF in New Tab
                      </Button>
                    </div>
                  ) : (
                    <img
                      src={selectedReceipt.receiptFileUrl}
                      alt="Payment Receipt"
                      className="max-w-full max-h-[400px] rounded shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Rejection Reason Input */}
              {selectedReceipt.status === 'Pending' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Rejection Reason (if rejecting)</label>
                  <Input
                    type="text"
                    placeholder="Enter reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              )}

              {/* Status Info */}
              {selectedReceipt.status !== 'Pending' && (
                <Alert className={
                  selectedReceipt.status === 'Verified'
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }>
                  <AlertDescription>
                    {selectedReceipt.status === 'Verified' ? (
                      <>
                        <CheckCircle className="w-4 h-4 inline mr-2 text-green-600" />
                        <strong>Verified</strong> on {selectedReceipt.verifiedAt ? formatDateTime(selectedReceipt.verifiedAt) : 'N/A'}
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 inline mr-2 text-red-600" />
                        <strong>Rejected:</strong> {selectedReceipt.rejectionReason}
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Close
            </Button>
            {selectedReceipt && selectedReceipt.status === 'Pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleRejectPayment(selectedReceipt.paymentProofId)}
                  disabled={isVerifying}
                >
                  {isVerifying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
                  Reject
                </Button>
                <Button
                  onClick={() => handleVerifyPayment(selectedReceipt.paymentProofId)}
                  disabled={isVerifying}
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                >
                  {isVerifying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                  Verify Payment
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}