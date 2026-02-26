import { API_CONFIG } from '../config/api.config';

export interface FileUploadResult {
  success: boolean;
  relativePath?: string;
  fileName?: string;
  originalFileName?: string;
  fileSize?: number;
  contentType?: string;
  errorMessage?: string;
  uploadedAt?: string;
}

export const filesService = {
  /**
   * Upload a file to the specified folder.
   * Returns the full URL for accessing the file.
   */
  async uploadFile(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILES.UPLOAD(folder)}`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to upload file');
    }

    const result = (await response.json()) as FileUploadResult;
    if (!result.success || !result.relativePath) {
      throw new Error(result.errorMessage || 'Upload failed');
    }

    // Build full URL for file access (API serves files at /api/files/{path})
    return `${API_CONFIG.BASE_URL}/files/${result.relativePath}`;
  },
};
