import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Save, CheckCircle, Loader2, AlertCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useAuth } from '../../contexts/AuthContext';
import { studentEnrollmentFormService, type SubmitEnrollmentFormRequest, type EnrollmentFormResponse } from '../../services/studentEnrollmentForm.service';
import {
  ApplicantSection,
  USISection,
  EducationSection,
  AdditionalInfoSection,
  PrivacyTermsSection,
} from './enrolment';
import type {
  ApplicantDetails,
  USIDetails,
  EducationDetails,
  AdditionalInfo,
  PrivacyTerms,
  StudentEnrolmentFormData,
} from '../../types/studentEnrolment';
import {
  initialApplicantDetails,
  initialUSIDetails,
  initialEducationDetails,
  initialAdditionalInfo,
  initialPrivacyTerms,
} from '../../types/studentEnrolment';

interface StudentEnrollmentFormProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

const SECTIONS = [
  { id: 1, title: 'Applicant Information', shortTitle: 'Applicant' },
  { id: 2, title: 'Unique Student Identifier (USI)', shortTitle: 'USI' },
  { id: 3, title: 'Education & Employment', shortTitle: 'Education' },
  { id: 4, title: 'Additional Information', shortTitle: 'Additional' },
  { id: 5, title: 'Privacy, Terms & Signature', shortTitle: 'Privacy' },
];

export function StudentEnrollmentForm({ onComplete, onCancel }: StudentEnrollmentFormProps) {
  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [existingForm, setExistingForm] = useState<EnrollmentFormResponse | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get studentId from auth context
  const studentId = user?.studentId;

  // Form data state
  const [formData, setFormData] = useState<StudentEnrolmentFormData>({
    applicant: { ...initialApplicantDetails },
    usi: { ...initialUSIDetails },
    education: { ...initialEducationDetails },
    additionalInfo: { ...initialAdditionalInfo },
    privacyTerms: { ...initialPrivacyTerms },
  });

  // Load existing form data
  const loadFormData = useCallback(async () => {
    if (!studentId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Use the studentId-specific endpoint
      const response = await studentEnrollmentFormService.getEnrollmentFormByStudentId(studentId);
      if (response.success && response.data) {
        setExistingForm(response.data);
        mapResponseToFormData(response.data);
      }
    } catch (error) {
      console.log('No existing form data or error loading:', error);
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadFormData();
  }, [loadFormData]);

  // Pre-fill email from user context
  useEffect(() => {
    if (user?.email && !formData.applicant.email) {
      setFormData((prev) => ({
        ...prev,
        applicant: { ...prev.applicant, email: user.email || '' },
      }));
    }
  }, [user?.email]);

  const mapResponseToFormData = (data: EnrollmentFormResponse) => {
    setFormData({
      applicant: {
        title: (data.title as ApplicantDetails['title']) || '',
        surname: data.surname || '',
        givenName: data.givenName || '',
        middleName: data.middleName || '',
        preferredName: data.preferredName || '',
        dob: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
        gender: (data.gender as ApplicantDetails['gender']) || '',
        homePhone: data.homePhone || '',
        workPhone: data.workPhone || '',
        mobile: data.mobile || '',
        email: data.email || '',
        resAddress: data.residentialAddress || '',
        resSuburb: data.residentialSuburb || '',
        resState: data.residentialState || '',
        resPostcode: data.residentialPostcode || '',
        postalDifferent: data.postalAddressDifferent,
        postAddress: data.postalAddress || '',
        postSuburb: data.postalSuburb || '',
        postState: data.postalState || '',
        postPostcode: data.postalPostcode || '',
        docPrimaryId: null,
        docSecondaryId: null,
        emergencyName: data.emergencyContactName || '',
        emergencyRelationship: data.emergencyContactRelationship || '',
        emergencyContactNumber: data.emergencyContactNumber || '',
        emergencyPermission: (data.emergencyPermission as 'Yes' | 'No') || '',
      },
      usi: {
        usi: data.usi || '',
        usiAccessPermission: data.usiAccessPermission,
        usiApply: (data.usiApplyThroughSTA as 'Yes' | 'No') || '',
        usiAuthoriseName: data.usiAuthoriseName || '',
        usiConsent: data.usiConsent,
        townCityBirth: data.townCityOfBirth || '',
        overseasCityBirth: data.overseasCityOfBirth || '',
        usiIdType: data.usiIdType || '',
        usiIdUpload: null,
        dlState: data.driversLicenceState || '',
        dlNumber: data.driversLicenceNumber || '',
        medicareNumber: data.medicareNumber || '',
        medicareIRN: data.medicareIRN || '',
        medicareColor: (data.medicareCardColor as USIDetails['medicareColor']) || '',
        medicareExpiry: data.medicareExpiry ? data.medicareExpiry.split('T')[0] : '',
        birthState: data.birthCertificateState || '',
        immiNumber: data.immiCardNumber || '',
        ausPassportNumber: data.australianPassportNumber || '',
        nonAusPassportNumber: data.nonAustralianPassportNumber || '',
        nonAusPassportCountry: data.nonAustralianPassportCountry || '',
        citizenshipStock: data.citizenshipStockNumber || '',
        citizenshipAcqDate: data.citizenshipAcquisitionDate ? data.citizenshipAcquisitionDate.split('T')[0] : '',
        descentAcqDate: data.descentAcquisitionDate ? data.descentAcquisitionDate.split('T')[0] : '',
      },
      education: {
        schoolLevel: data.schoolLevel || '',
        schoolCompleteYear: data.schoolCompleteYear || '',
        schoolName: data.schoolName || '',
        schoolInAus: data.schoolInAustralia,
        schoolState: data.schoolState || '',
        schoolPostcode: data.schoolPostcode || '',
        schoolCountry: data.schoolCountry || '',
        hasPostQual: (data.hasPostSecondaryQualification as 'Yes' | 'No') || '',
        qualLevels: data.qualificationLevels || [],
        qualDetails: data.qualificationDetails || '',
        qualEvidenceUpload: null,
        employmentStatus: data.employmentStatus || '',
        employerName: data.employerName || '',
        supervisorName: data.supervisorName || '',
        employerAddress: data.employerAddress || '',
        employerEmail: data.employerEmail || '',
        employerPhone: data.employerPhone || '',
        trainingReason: data.trainingReason || '',
        trainingReasonOther: data.trainingReasonOther || '',
      },
      additionalInfo: {
        countryOfBirth: data.countryOfBirth || '',
        langOther: (data.speaksOtherLanguage as 'Yes' | 'No') || '',
        homeLanguage: data.homeLanguage || '',
        indigenousStatus: data.indigenousStatus || '',
        hasDisability: (data.hasDisability as 'Yes' | 'No') || '',
        disabilityTypes: data.disabilityTypes || [],
        disabilityNotes: data.disabilityNotes || '',
      },
      privacyTerms: {
        acceptPrivacy: data.acceptedPrivacyNotice,
        acceptTerms: data.acceptedTermsAndConditions,
        declareName: data.declarationName || '',
        declareDate: data.declarationDate ? data.declarationDate.split('T')[0] : '',
        signatureData: data.signatureData || '',
      },
    });
  };

  const handleApplicantChange = (data: Partial<ApplicantDetails>) => {
    setFormData((prev) => ({
      ...prev,
      applicant: { ...prev.applicant, ...data },
    }));
  };

  const handleUSIChange = (data: Partial<USIDetails>) => {
    setFormData((prev) => ({
      ...prev,
      usi: { ...prev.usi, ...data },
    }));
  };

  const handleEducationChange = (data: Partial<EducationDetails>) => {
    setFormData((prev) => ({
      ...prev,
      education: { ...prev.education, ...data },
    }));
  };

  const handleAdditionalInfoChange = (data: Partial<AdditionalInfo>) => {
    setFormData((prev) => ({
      ...prev,
      additionalInfo: { ...prev.additionalInfo, ...data },
    }));
  };

  const handlePrivacyTermsChange = (data: Partial<PrivacyTerms>) => {
    setFormData((prev) => ({
      ...prev,
      privacyTerms: { ...prev.privacyTerms, ...data },
    }));
  };

  const validateSection = (section: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (section === 1) {
      const a = formData.applicant;
      if (!a.title) newErrors.title = 'Title is required';
      if (!a.surname) newErrors.surname = 'Surname is required';
      if (!a.givenName) newErrors.givenName = 'Given name is required';
      if (!a.dob) newErrors.dob = 'Date of birth is required';
      if (!a.gender) newErrors.gender = 'Gender is required';
      if (!a.mobile) newErrors.mobile = 'Mobile phone is required';
      if (!a.email) newErrors.email = 'Email is required';
      if (!a.resAddress) newErrors.resAddress = 'Residential address is required';
      if (!a.resSuburb) newErrors.resSuburb = 'Suburb is required';
      if (!a.resState) newErrors.resState = 'State is required';
      if (!a.resPostcode) newErrors.resPostcode = 'Postcode is required';
      if (!a.emergencyName) newErrors.emergencyName = 'Emergency contact name is required';
      if (!a.emergencyRelationship) newErrors.emergencyRelationship = 'Relationship is required';
      if (!a.emergencyContactNumber) newErrors.emergencyContactNumber = 'Contact number is required';
      if (!a.emergencyPermission) newErrors.emergencyPermission = 'Please select an option';

      if (a.postalDifferent) {
        if (!a.postAddress) newErrors.postAddress = 'Postal address is required';
        if (!a.postSuburb) newErrors.postSuburb = 'Suburb is required';
        if (!a.postState) newErrors.postState = 'State is required';
        if (!a.postPostcode) newErrors.postPostcode = 'Postcode is required';
      }
    }

    if (section === 2) {
      const u = formData.usi;
      if (!u.usiApply) newErrors.usiApply = 'Please select an option';

      if (u.usiApply === 'Yes') {
        if (!u.usiAuthoriseName) newErrors.usiAuthoriseName = 'Name is required';
        if (!u.usiConsent) newErrors.usiConsent = 'Consent is required';
        if (!u.townCityBirth) newErrors.townCityBirth = 'Town/City of birth is required';
        if (!u.overseasCityBirth) newErrors.overseasCityBirth = 'Overseas city is required';
        if (!u.usiIdType) newErrors.usiIdType = 'ID type is required';
      }
    }

    if (section === 3) {
      const e = formData.education;
      if (!e.schoolLevel) newErrors.schoolLevel = 'School level is required';
      if (!e.schoolCompleteYear) newErrors.schoolCompleteYear = 'Year completed is required';
      if (!e.hasPostQual) newErrors.hasPostQual = 'Please select an option';
      if (!e.employmentStatus) newErrors.employmentStatus = 'Employment status is required';
      if (!e.trainingReason) newErrors.trainingReason = 'Training reason is required';

      if (e.trainingReason === 'Other' && !e.trainingReasonOther) {
        newErrors.trainingReasonOther = 'Please specify the reason';
      }

      if (e.schoolInAus) {
        if (!e.schoolState) newErrors.schoolState = 'State is required';
        if (!e.schoolPostcode) newErrors.schoolPostcode = 'Postcode is required';
      } else {
        if (!e.schoolCountry) newErrors.schoolCountry = 'Country is required';
      }
    }

    if (section === 4) {
      const ai = formData.additionalInfo;
      if (!ai.countryOfBirth) newErrors.countryOfBirth = 'Country of birth is required';
      if (!ai.langOther) newErrors.langOther = 'Please select an option';
      if (!ai.indigenousStatus) newErrors.indigenousStatus = 'Indigenous status is required';
      if (!ai.hasDisability) newErrors.hasDisability = 'Please select an option';

      if (ai.langOther === 'Yes' && !ai.homeLanguage) {
        newErrors.homeLanguage = 'Language is required';
      }
    }

    if (section === 5) {
      const pt = formData.privacyTerms;
      if (!pt.acceptPrivacy) newErrors.acceptPrivacy = 'You must accept the privacy notice';
      if (!pt.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';
      if (!pt.declareName) newErrors.declareName = 'Name is required';
      if (!pt.declareDate) newErrors.declareDate = 'Date is required';
      if (!pt.signatureData) newErrors.signatureData = 'Signature is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handlePrevious = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    // Check if studentId exists
    if (!studentId) {
      toast.error('Student ID not found. Please log in again.');
      return;
    }

    // Validate all sections
    for (let i = 1; i <= 5; i++) {
      if (!validateSection(i)) {
        setCurrentSection(i);
        toast.error('Please fill in all required fields');
        return;
      }
    }

    setIsSaving(true);
    try {
      const request: SubmitEnrollmentFormRequest = mapFormDataToRequest();

      // Upload files first if any - pass studentId
      if (formData.applicant.docPrimaryId) {
        await studentEnrollmentFormService.uploadDocument(formData.applicant.docPrimaryId, 'primaryId', studentId);
      }
      if (formData.applicant.docSecondaryId) {
        await studentEnrollmentFormService.uploadDocument(formData.applicant.docSecondaryId, 'secondaryId', studentId);
      }
      if (formData.usi.usiIdUpload) {
        await studentEnrollmentFormService.uploadDocument(formData.usi.usiIdUpload, 'usiId', studentId);
      }
      if (formData.education.qualEvidenceUpload) {
        await studentEnrollmentFormService.uploadDocument(formData.education.qualEvidenceUpload, 'qualification', studentId);
      }

      // Submit or update the form - pass studentId
      const response = existingForm?.enrollmentFormCompleted
        ? await studentEnrollmentFormService.updateEnrollmentForm(request, studentId)
        : await studentEnrollmentFormService.submitEnrollmentForm(request, studentId);

      if (response.success) {
        toast.success('Enrollment form submitted successfully!');
        onComplete?.();
      } else {
        toast.error(response.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setIsSaving(false);
    }
  };

  const mapFormDataToRequest = (): SubmitEnrollmentFormRequest => {
    const { applicant, usi, education, additionalInfo, privacyTerms } = formData;

    return {
      // Section 1
      title: applicant.title,
      surname: applicant.surname,
      givenName: applicant.givenName,
      middleName: applicant.middleName || undefined,
      preferredName: applicant.preferredName || undefined,
      dateOfBirth: applicant.dob,
      gender: applicant.gender,
      homePhone: applicant.homePhone || undefined,
      workPhone: applicant.workPhone || undefined,
      mobile: applicant.mobile,
      email: applicant.email,
      residentialAddress: applicant.resAddress,
      residentialSuburb: applicant.resSuburb,
      residentialState: applicant.resState,
      residentialPostcode: applicant.resPostcode,
      postalAddressDifferent: applicant.postalDifferent,
      postalAddress: applicant.postAddress || undefined,
      postalSuburb: applicant.postSuburb || undefined,
      postalState: applicant.postState || undefined,
      postalPostcode: applicant.postPostcode || undefined,
      emergencyContactName: applicant.emergencyName,
      emergencyContactRelationship: applicant.emergencyRelationship,
      emergencyContactNumber: applicant.emergencyContactNumber,
      emergencyPermission: applicant.emergencyPermission,

      // Section 2
      usi: usi.usi || undefined,
      usiAccessPermission: usi.usiAccessPermission,
      usiApplyThroughSTA: usi.usiApply,
      usiAuthoriseName: usi.usiAuthoriseName || undefined,
      usiConsent: usi.usiConsent || undefined,
      townCityOfBirth: usi.townCityBirth || undefined,
      overseasCityOfBirth: usi.overseasCityBirth || undefined,
      usiIdType: usi.usiIdType || undefined,
      driversLicenceState: usi.dlState || undefined,
      driversLicenceNumber: usi.dlNumber || undefined,
      medicareNumber: usi.medicareNumber || undefined,
      medicareIRN: usi.medicareIRN || undefined,
      medicareCardColor: usi.medicareColor || undefined,
      medicareExpiry: usi.medicareExpiry || undefined,
      birthCertificateState: usi.birthState || undefined,
      immiCardNumber: usi.immiNumber || undefined,
      australianPassportNumber: usi.ausPassportNumber || undefined,
      nonAustralianPassportNumber: usi.nonAusPassportNumber || undefined,
      nonAustralianPassportCountry: usi.nonAusPassportCountry || undefined,
      citizenshipStockNumber: usi.citizenshipStock || undefined,
      citizenshipAcquisitionDate: usi.citizenshipAcqDate || undefined,
      descentAcquisitionDate: usi.descentAcqDate || undefined,

      // Section 3
      schoolLevel: education.schoolLevel,
      schoolCompleteYear: education.schoolCompleteYear,
      schoolName: education.schoolName || 'N/A',
      schoolInAustralia: education.schoolInAus,
      schoolState: education.schoolState || undefined,
      schoolPostcode: education.schoolPostcode || undefined,
      schoolCountry: education.schoolCountry || undefined,
      hasPostSecondaryQualification: education.hasPostQual,
      qualificationLevels: education.qualLevels?.length ? education.qualLevels : undefined,
      qualificationDetails: education.qualDetails || undefined,
      employmentStatus: education.employmentStatus,
      employerName: education.employerName || undefined,
      supervisorName: education.supervisorName || undefined,
      employerAddress: education.employerAddress || undefined,
      employerEmail: education.employerEmail || undefined,
      employerPhone: education.employerPhone || undefined,
      trainingReason: education.trainingReason,
      trainingReasonOther: education.trainingReasonOther || undefined,

      // Section 4
      countryOfBirth: additionalInfo.countryOfBirth,
      speaksOtherLanguage: additionalInfo.langOther,
      homeLanguage: additionalInfo.homeLanguage || undefined,
      indigenousStatus: additionalInfo.indigenousStatus,
      hasDisability: additionalInfo.hasDisability,
      disabilityTypes: additionalInfo.disabilityTypes?.length ? additionalInfo.disabilityTypes : undefined,
      disabilityNotes: additionalInfo.disabilityNotes || undefined,

      // Section 5
      acceptedPrivacyNotice: privacyTerms.acceptPrivacy,
      acceptedTermsAndConditions: privacyTerms.acceptTerms,
      declarationName: privacyTerms.declareName,
      declarationDate: privacyTerms.declareDate,
      signatureData: privacyTerms.signatureData,
    };
  };

  const getStatusBadge = () => {
    if (!existingForm) return null;

    const status = existingForm.enrollmentFormStatus;
    if (status === 'Approved') {
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    }
    if (status === 'Rejected') {
      return (
        <Badge className="bg-red-100 text-red-700">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    }
    if (status === 'Pending') {
      return (
        <Badge className="bg-yellow-100 text-yellow-700">
          <Clock className="w-3 h-3 mr-1" />
          Pending Review
        </Badge>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
        <span className="ml-2 text-gray-600">Loading enrollment form...</span>
      </div>
    );
  }

  // Show error if no studentId
  if (!studentId) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-900">Unable to Load Form</AlertTitle>
          <AlertDescription className="text-red-800">
            Student ID not found. Please log out and log in again to access the enrollment form.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-violet-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Student Enrollment Form
              </CardTitle>
              <CardDescription>
                Complete all sections to finalize your enrollment
              </CardDescription>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Section {currentSection} of 5</span>
              <span>{Math.round((currentSection / 5) * 100)}% Complete</span>
            </div>
            <Progress value={(currentSection / 5) * 100} className="h-2" />
          </div>

          {/* Section Indicators */}
          <div className="flex justify-between mt-4">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`flex flex-col items-center text-xs ${
                  currentSection === section.id
                    ? 'text-violet-600 font-semibold'
                    : currentSection > section.id
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    currentSection === section.id
                      ? 'bg-violet-600 text-white'
                      : currentSection > section.id
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {currentSection > section.id ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    section.id
                  )}
                </div>
                <span className="hidden sm:block">{section.shortTitle}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Notes Alert */}
      {existingForm?.enrollmentFormReviewNotes && (
        <Alert className={existingForm.enrollmentFormStatus === 'Rejected' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}>
          <AlertCircle className={`h-4 w-4 ${existingForm.enrollmentFormStatus === 'Rejected' ? 'text-red-600' : 'text-blue-600'}`} />
          <AlertTitle className={existingForm.enrollmentFormStatus === 'Rejected' ? 'text-red-900' : 'text-blue-900'}>
            Review Notes
          </AlertTitle>
          <AlertDescription className={existingForm.enrollmentFormStatus === 'Rejected' ? 'text-red-800' : 'text-blue-800'}>
            {existingForm.enrollmentFormReviewNotes}
          </AlertDescription>
        </Alert>
      )}

      {/* Form Sections */}
      <div className="min-h-[400px]">
        {currentSection === 1 && (
          <ApplicantSection
            data={formData.applicant}
            onChange={handleApplicantChange}
            errors={errors}
          />
        )}
        {currentSection === 2 && (
          <USISection
            data={formData.usi}
            onChange={handleUSIChange}
            errors={errors}
          />
        )}
        {currentSection === 3 && (
          <EducationSection
            data={formData.education}
            onChange={handleEducationChange}
            errors={errors}
          />
        )}
        {currentSection === 4 && (
          <AdditionalInfoSection
            data={formData.additionalInfo}
            onChange={handleAdditionalInfoChange}
            errors={errors}
          />
        )}
        {currentSection === 5 && (
          <PrivacyTermsSection
            data={formData.privacyTerms}
            onChange={handlePrivacyTermsChange}
            errors={errors}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <Card className="border-violet-100">
        <CardContent className="py-4">
          <div className="enrollment-navigation">
            <div className="enrollment-navigation-left">
              {onCancel && (
                <Button variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
            <div className="enrollment-navigation-right">
              {currentSection > 1 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              {currentSection < 5 ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {existingForm?.enrollmentFormCompleted ? 'Update Form' : 'Submit Form'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
