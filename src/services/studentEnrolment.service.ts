import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';
import type { StudentEnrolmentFormData } from '../types/studentEnrolment';

export interface EnrolmentSubmissionResponse {
  enrolmentId: string;
  studentId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

class StudentEnrolmentService {
  /**
   * Submit student enrolment form data
   * Handles file uploads and form data submission
   */
  async submitEnrolment(formData: StudentEnrolmentFormData): Promise<ApiResponse<EnrolmentSubmissionResponse>> {
    // Create FormData for multipart/form-data submission (for file uploads)
    const data = new FormData();

    // Applicant Details
    const { applicant } = formData;
    data.append('title', applicant.title);
    data.append('surname', applicant.surname);
    data.append('givenName', applicant.givenName);
    if (applicant.middleName) data.append('middleName', applicant.middleName);
    if (applicant.preferredName) data.append('preferredName', applicant.preferredName);
    data.append('dob', applicant.dob);
    data.append('gender', applicant.gender);
    if (applicant.homePhone) data.append('homePhone', applicant.homePhone);
    if (applicant.workPhone) data.append('workPhone', applicant.workPhone);
    data.append('mobile', applicant.mobile);
    data.append('email', applicant.email);
    data.append('resAddress', applicant.resAddress);
    data.append('resSuburb', applicant.resSuburb);
    data.append('resState', applicant.resState);
    data.append('resPostcode', applicant.resPostcode);
    data.append('postalDifferent', String(applicant.postalDifferent));

    if (applicant.postalDifferent) {
      if (applicant.postAddress) data.append('postAddress', applicant.postAddress);
      if (applicant.postSuburb) data.append('postSuburb', applicant.postSuburb);
      if (applicant.postState) data.append('postState', applicant.postState);
      if (applicant.postPostcode) data.append('postPostcode', applicant.postPostcode);
    }

    // File uploads
    if (applicant.docPrimaryId) data.append('docPrimaryId', applicant.docPrimaryId);
    if (applicant.docSecondaryId) data.append('docSecondaryId', applicant.docSecondaryId);

    // Emergency Contact
    data.append('emergencyName', applicant.emergencyName);
    data.append('emergencyRelationship', applicant.emergencyRelationship);
    data.append('emergencyContactNumber', applicant.emergencyContactNumber);
    data.append('emergencyPermission', applicant.emergencyPermission);

    // USI Details
    const { usi } = formData;
    if (usi.usi) data.append('usi', usi.usi);
    data.append('usiAccessPermission', String(usi.usiAccessPermission));
    data.append('usiApply', usi.usiApply);

    if (usi.usiApply === 'Yes') {
      if (usi.usiAuthoriseName) data.append('usiAuthoriseName', usi.usiAuthoriseName);
      data.append('usiConsent', String(usi.usiConsent));
      if (usi.townCityBirth) data.append('townCityBirth', usi.townCityBirth);
      if (usi.overseasCityBirth) data.append('overseasCityBirth', usi.overseasCityBirth);
      if (usi.usiIdType) data.append('usiIdType', usi.usiIdType);
      if (usi.usiIdUpload) data.append('usiIdUpload', usi.usiIdUpload);

      // ID-specific fields
      if (usi.usiIdType === '1') {
        if (usi.dlState) data.append('dlState', usi.dlState);
        if (usi.dlNumber) data.append('dlNumber', usi.dlNumber);
      }
      if (usi.usiIdType === '2') {
        if (usi.medicareNumber) data.append('medicareNumber', usi.medicareNumber);
        if (usi.medicareIRN) data.append('medicareIRN', usi.medicareIRN);
        if (usi.medicareColor) data.append('medicareColor', usi.medicareColor);
        if (usi.medicareExpiry) data.append('medicareExpiry', usi.medicareExpiry);
      }
      if (usi.usiIdType === '3' && usi.birthState) data.append('birthState', usi.birthState);
      if (usi.usiIdType === '4' && usi.immiNumber) data.append('immiNumber', usi.immiNumber);
      if (usi.usiIdType === '5' && usi.ausPassportNumber) data.append('ausPassportNumber', usi.ausPassportNumber);
      if (usi.usiIdType === '6') {
        if (usi.nonAusPassportNumber) data.append('nonAusPassportNumber', usi.nonAusPassportNumber);
        if (usi.nonAusPassportCountry) data.append('nonAusPassportCountry', usi.nonAusPassportCountry);
      }
      if (usi.usiIdType === '7') {
        if (usi.citizenshipStock) data.append('citizenshipStock', usi.citizenshipStock);
        if (usi.citizenshipAcqDate) data.append('citizenshipAcqDate', usi.citizenshipAcqDate);
      }
      if (usi.usiIdType === '8' && usi.descentAcqDate) data.append('descentAcqDate', usi.descentAcqDate);
    }

    // Education Details
    const { education } = formData;
    data.append('schoolLevel', education.schoolLevel);
    data.append('schoolCompleteYear', education.schoolCompleteYear);
    data.append('schoolName', education.schoolName?.trim() || 'N/A');
    data.append('schoolInAus', String(education.schoolInAus));

    if (education.schoolInAus) {
      if (education.schoolState) data.append('schoolState', education.schoolState);
      if (education.schoolPostcode) data.append('schoolPostcode', education.schoolPostcode);
    } else {
      if (education.schoolCountry) data.append('schoolCountry', education.schoolCountry);
    }

    data.append('hasPostQual', education.hasPostQual);
    if (education.hasPostQual === 'Yes') {
      if (education.qualLevels) data.append('qualLevels', JSON.stringify(education.qualLevels));
      if (education.qualDetails) data.append('qualDetails', education.qualDetails);
      if (education.qualEvidenceUpload) data.append('qualEvidenceUpload', education.qualEvidenceUpload);
    }

    data.append('employmentStatus', education.employmentStatus);
    if (education.employerName) data.append('employerName', education.employerName);
    if (education.supervisorName) data.append('supervisorName', education.supervisorName);
    if (education.employerAddress) data.append('employerAddress', education.employerAddress);
    if (education.employerEmail) data.append('employerEmail', education.employerEmail);
    if (education.employerPhone) data.append('employerPhone', education.employerPhone);

    data.append('trainingReason', education.trainingReason);
    if (education.trainingReason === 'Other' && education.trainingReasonOther) {
      data.append('trainingReasonOther', education.trainingReasonOther);
    }

    // Additional Info
    const { additionalInfo } = formData;
    data.append('countryOfBirth', additionalInfo.countryOfBirth);
    data.append('langOther', additionalInfo.langOther);
    if (additionalInfo.langOther === 'Yes' && additionalInfo.homeLanguage) {
      data.append('homeLanguage', additionalInfo.homeLanguage);
    }
    data.append('indigenousStatus', additionalInfo.indigenousStatus);
    data.append('hasDisability', additionalInfo.hasDisability);
    if (additionalInfo.hasDisability === 'Yes') {
      if (additionalInfo.disabilityTypes) data.append('disabilityTypes', JSON.stringify(additionalInfo.disabilityTypes));
      if (additionalInfo.disabilityNotes) data.append('disabilityNotes', additionalInfo.disabilityNotes);
    }

    // Privacy & Terms
    const { privacyTerms } = formData;
    data.append('acceptPrivacy', String(privacyTerms.acceptPrivacy));
    data.append('acceptTerms', String(privacyTerms.acceptTerms));
    data.append('declareName', privacyTerms.declareName);
    data.append('declareDate', privacyTerms.declareDate);
    data.append('signatureData', privacyTerms.signatureData);

    // Submit the form
    // Note: You may need to adjust the endpoint based on your API configuration
    const endpoint = `${API_CONFIG.ENDPOINTS.STUDENT_MANAGEMENT?.BASE || '/api/students'}/enrolment`;
    
    // For FormData with file uploads, we need to use fetch directly
    // since the apiService.post uses JSON.stringify which doesn't work for FormData
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: data,
      credentials: 'include',
      // Note: Don't set Content-Type header - browser will set it automatically with boundary for FormData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit enrolment');
    }

    return await response.json();
  }

  /**
   * Get enrolment status by ID
   */
  async getEnrolmentStatus(enrolmentId: string): Promise<ApiResponse<EnrolmentSubmissionResponse>> {
    const endpoint = `${API_CONFIG.ENDPOINTS.STUDENT_MANAGEMENT?.BASE || '/api/students'}/enrolment/${enrolmentId}`;
    return apiService.get<ApiResponse<EnrolmentSubmissionResponse>>(endpoint);
  }

  /**
   * Save enrolment as draft (for later completion)
   */
  async saveDraft(formData: Partial<StudentEnrolmentFormData>): Promise<ApiResponse<{ draftId: string }>> {
    const endpoint = `${API_CONFIG.ENDPOINTS.STUDENT_MANAGEMENT?.BASE || '/api/students'}/enrolment/draft`;
    return apiService.post<ApiResponse<{ draftId: string }>>(endpoint, formData);
  }

  /**
   * Load a saved draft
   */
  async loadDraft(draftId: string): Promise<ApiResponse<StudentEnrolmentFormData>> {
    const endpoint = `${API_CONFIG.ENDPOINTS.STUDENT_MANAGEMENT?.BASE || '/api/students'}/enrolment/draft/${draftId}`;
    return apiService.get<ApiResponse<StudentEnrolmentFormData>>(endpoint);
  }
}

export const studentEnrolmentService = new StudentEnrolmentService();
