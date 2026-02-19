import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Upload, FileCheck, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';

interface PaymentUploadProps {
  courseName: string;
  coursePrice: number;
  onUpload: (file: File, transactionId: string) => Promise<void> | void;
  onCancel: () => void;
  paymentStatus?: 'pending' | 'verified' | 'rejected';
}

export function PaymentUpload({ courseName, coursePrice, onUpload, onCancel, paymentStatus }: PaymentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a JPG, PNG, or PDF file');
        return;
      }
      
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !transactionId.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onUpload(selectedFile, transactionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit payment proof');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = selectedFile && transactionId.trim().length > 0 && !isSubmitting;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Payment Verification
        </h1>
        <p className="text-gray-600">Upload your payment receipt to complete enrollment</p>
      </div>

      {paymentStatus === 'pending' && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Clock className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-900">Payment Verification Pending</AlertTitle>
          <AlertDescription className="text-yellow-800">
            Your payment receipt has been submitted and is awaiting admin verification.
          </AlertDescription>
        </Alert>
      )}

      {paymentStatus === 'rejected' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Rejected</AlertTitle>
          <AlertDescription>
            Your payment receipt was not approved. Please upload a valid receipt or contact support.
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-violet-100">
        <CardHeader>
          <CardTitle>Course Enrollment Payment</CardTitle>
          <CardDescription>
            Complete payment verification for {courseName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course Details */}
          <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Course Name:</span>
              <span>{courseName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Course Fee:</span>
              <span className="text-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                ${coursePrice}
              </span>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <h4 className="text-blue-900">Payment Instructions:</h4>
            <ol className="space-y-1 text-sm text-blue-800 list-decimal list-inside ml-2">
              <li>Make payment of ${coursePrice} to the institute's bank account</li>
              <li>Save the payment receipt/confirmation from your bank</li>
              <li>Upload the receipt image or PDF below</li>
              <li>Enter your transaction/reference ID</li>
              <li>Wait for admin verification (usually within 24 hours)</li>
            </ol>
          </div>

          {/* Transaction ID */}
          <div className="space-y-2">
            <Label htmlFor="transaction-id">Transaction ID / Reference Number *</Label>
            <Input
              id="transaction-id"
              type="text"
              placeholder="Enter your transaction reference number"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              disabled={paymentStatus === 'pending' || isSubmitting}
            />
            <p className="text-sm text-gray-500">This can be found on your bank receipt or transaction confirmation</p>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="receipt">Payment Receipt *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-violet-400 transition-colors">
              <input
                id="receipt"
                type="file"
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                disabled={paymentStatus === 'pending' || isSubmitting}
              />
              <label htmlFor="receipt" className={`cursor-pointer ${(paymentStatus === 'pending' || isSubmitting) ? 'pointer-events-none' : ''}`}>
                {selectedFile ? (
                  <div className="space-y-2">
                    <FileCheck className="w-12 h-12 mx-auto text-green-600" />
                    <p className="text-green-700">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                    {previewUrl && (
                      <img 
                        src={previewUrl} 
                        alt="Receipt preview" 
                        className="max-w-full max-h-48 mx-auto mt-4 rounded border"
                      />
                    )}
                    {selectedFile.type === 'application/pdf' && (
                      <div className="mt-4 p-4 bg-gray-50 rounded">
                        <p className="text-gray-600">PDF file selected</p>
                      </div>
                    )}
                    {paymentStatus !== 'pending' && !isSubmitting && (
                      <Button variant="outline" size="sm" className="mt-2">
                        Change File
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="text-gray-600">Click to upload payment receipt</p>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, PDF (Max 5MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Status Badge */}
          {paymentStatus && (
            <div className="flex justify-center">
              <Badge className={
                paymentStatus === 'verified' 
                  ? 'bg-green-100 text-green-700 text-sm px-4 py-2'
                  : paymentStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-700 text-sm px-4 py-2'
                  : 'bg-red-100 text-red-700 text-sm px-4 py-2'
              }>
                Status: {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
              </Badge>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || paymentStatus === 'pending'}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit for Verification'
            )}
          </Button>
        </CardFooter>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Once your payment is verified by the admin, you will receive access to the course materials and can begin your training.
        </AlertDescription>
      </Alert>
    </div>
  );
}
