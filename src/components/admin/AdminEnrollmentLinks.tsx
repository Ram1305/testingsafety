import { useState, useEffect, useCallback } from 'react';
import {
  Link2,
  QrCode,
  Copy,
  Download,
  Trash2,
  Plus,
  Search,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  ExternalLink,
  Calendar,
  Users,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import {
  publicEnrollmentWizardService,
  type EnrollmentLinkResponse,
  type EnrollmentLinkRequest,
  type CourseDropdownItem
} from '../../services/publicEnrollmentWizard.service';

export function AdminEnrollmentLinks() {
  const [links, setLinks] = useState<EnrollmentLinkResponse[]>([]);
  const [courses, setCourses] = useState<CourseDropdownItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Create dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newLink, setNewLink] = useState<EnrollmentLinkRequest>({
    name: '',
    description: '',
    courseId: undefined,
    courseDateId: undefined,
    maxUses: undefined,
    expiresAt: undefined
  });

  // View dialog
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<EnrollmentLinkResponse | null>(null);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch links
  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await publicEnrollmentWizardService.getEnrollmentLinks(currentPage, pageSize);
      if (response.success && response.data) {
        setLinks(response.data.links);
        setTotalCount(response.data.totalCount);
      }
    } catch (error) {
      toast.error('Failed to fetch enrollment links');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  // Fetch courses for dropdown
  const fetchCourses = async () => {
    try {
      const response = await publicEnrollmentWizardService.getCoursesForDropdown();
      if (response.success && response.data) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  useEffect(() => {
    fetchLinks();
    fetchCourses();
  }, [fetchLinks]);

  // Create new link
  const handleCreateLink = async () => {
    if (!newLink.name.trim()) {
      toast.error('Please enter a name for the link');
      return;
    }

    setIsCreating(true);
    try {
      const response = await publicEnrollmentWizardService.createEnrollmentLink(newLink);
      if (response.success) {
        toast.success('Enrollment link created successfully');
        setCreateDialogOpen(false);
        setNewLink({ name: '', description: '', courseId: undefined, courseDateId: undefined, maxUses: undefined, expiresAt: undefined });
        fetchLinks();
      } else {
        toast.error(response.message || 'Failed to create link');
      }
    } catch (error) {
      toast.error('Failed to create enrollment link');
    } finally {
      setIsCreating(false);
    }
  };

  // Copy URL to clipboard
  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  // Download QR code
  const handleDownloadQR = (link: EnrollmentLinkResponse) => {
    if (!link.qrCodeDataUrl) {
      toast.error('QR code not available');
      return;
    }

    const downloadLink = document.createElement('a');
    downloadLink.href = link.qrCodeDataUrl;
    downloadLink.download = `enrollment-qr-${link.uniqueCode}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    toast.success('QR code downloaded');
  };

  // Toggle link status
  const handleToggleStatus = async (linkId: string) => {
    try {
      const response = await publicEnrollmentWizardService.toggleLinkStatus(linkId);
      if (response.success) {
        toast.success('Link status updated');
        fetchLinks();
      }
    } catch (error) {
      toast.error('Failed to update link status');
    }
  };

  // Delete link
  const handleDeleteLink = async () => {
    if (!linkToDelete) return;

    setIsDeleting(true);
    try {
      const response = await publicEnrollmentWizardService.deleteEnrollmentLink(linkToDelete);
      if (response.success) {
        toast.success('Enrollment link deleted');
        setDeleteDialogOpen(false);
        setLinkToDelete(null);
        fetchLinks();
      }
    } catch (error) {
      toast.error('Failed to delete link');
    } finally {
      setIsDeleting(false);
    }
  };

  // View link details
  const handleViewLink = (link: EnrollmentLinkResponse) => {
    setSelectedLink(link);
    setViewDialogOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Enrollment Links</h1>
          <p className="text-gray-600">Generate and manage enrollment links with QR codes for bulk student enrollment</p>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Link
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-violet-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Links</p>
                <p className="text-2xl font-bold text-violet-600">{totalCount}</p>
              </div>
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                <Link2 className="w-6 h-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Active Links</p>
                <p className="text-2xl font-bold text-green-600">{links.filter(l => l.isActive).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Usage</p>
                <p className="text-2xl font-bold text-blue-600">{links.reduce((sum, l) => sum + l.usedCount, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Links Table */}
      <Card className="border-violet-100">
        <CardHeader>
          <CardTitle>Enrollment Links ({totalCount})</CardTitle>
          <CardDescription>Manage your enrollment links and QR codes</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto" />
              <p className="mt-2 text-gray-500">Loading...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-12">
              <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No enrollment links yet</p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Link
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {links.map((link) => (
                      <TableRow key={link.linkId}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{link.name}</div>
                            <div className="text-sm text-gray-500">{link.uniqueCode}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {link.courseName ? (
                            <Badge variant="outline">{link.courseName}</Badge>
                          ) : (
                            <span className="text-gray-400">Any course</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="font-medium">{link.usedCount}</span>
                            {link.maxUses && <span className="text-gray-500"> / {link.maxUses}</span>}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(link.expiresAt)}</TableCell>
                        <TableCell>
                          <Badge className={link.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {link.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewLink(link)}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopyUrl(link.fullUrl)}
                              title="Copy URL"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadQR(link)}
                              title="Download QR Code"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleStatus(link.linkId)}
                              title={link.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {link.isActive ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setLinkToDelete(link.linkId);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-500 hover:text-red-700"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
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
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount}
                  </p>
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

      {/* Create Link Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Enrollment Link</DialogTitle>
            <DialogDescription>
              Generate a new enrollment link with optional QR code
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkName">Link Name <span className="text-red-500">*</span></Label>
              <Input
                id="linkName"
                placeholder="e.g., January 2025 Batch"
                value={newLink.name}
                onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="linkDescription">Description</Label>
              <Textarea
                id="linkDescription"
                placeholder="Optional description..."
                value={newLink.description || ''}
                onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
              />
            </div>

            <div>
              <Label>Pre-select Course (Optional)</Label>
              <Select
                value={newLink.courseId || 'none'}
                onValueChange={(value) => setNewLink({ ...newLink, courseId: value === 'none' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Any course</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course.courseId} value={course.courseId}>
                      {course.courseCode} - {course.courseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxUses">Max Uses</Label>
                <Input
                  id="maxUses"
                  type="number"
                  placeholder="Unlimited"
                  value={newLink.maxUses || ''}
                  onChange={(e) => setNewLink({ ...newLink, maxUses: e.target.value ? parseInt(e.target.value) : undefined })}
                />
              </div>
              <div>
                <Label htmlFor="expiresAt">Expires At</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={newLink.expiresAt || ''}
                  onChange={(e) => setNewLink({ ...newLink, expiresAt: e.target.value || undefined })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreateLink}
              disabled={isCreating}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600"
            >
              {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Create Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Link Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedLink?.name}</DialogTitle>
            <DialogDescription>
              Enrollment link details and QR code
            </DialogDescription>
          </DialogHeader>
          {selectedLink && (
            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center">
                {selectedLink.qrCodeDataUrl ? (
                  <div className="p-4 bg-white border rounded-lg">
                    <img src={selectedLink.qrCodeDataUrl} alt="QR Code" className="w-48 h-48" />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* URL */}
              <div className="bg-gray-50 rounded-lg p-4">
                <Label className="text-sm text-gray-500">Enrollment URL</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input value={selectedLink.fullUrl} readOnly className="text-sm" />
                  <Button size="sm" variant="outline" onClick={() => handleCopyUrl(selectedLink.fullUrl)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => window.open(selectedLink.fullUrl, '_blank')}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Unique Code:</span>
                  <p className="font-mono font-medium">{selectedLink.uniqueCode}</p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <p>
                    <Badge className={selectedLink.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {selectedLink.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Usage:</span>
                  <p className="font-medium">
                    {selectedLink.usedCount}
                    {selectedLink.maxUses ? ` / ${selectedLink.maxUses}` : ' (unlimited)'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Expires:</span>
                  <p>{formatDate(selectedLink.expiresAt)}</p>
                </div>
                {selectedLink.courseName && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Pre-selected Course:</span>
                    <p className="font-medium">{selectedLink.courseName}</p>
                  </div>
                )}
                {selectedLink.description && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Description:</span>
                    <p>{selectedLink.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => selectedLink && handleDownloadQR(selectedLink)}>
              <Download className="w-4 h-4 mr-2" />
              Download QR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Enrollment Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this enrollment link? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteLink} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
