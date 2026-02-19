import { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Save, CheckCircle, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { studentEnrollmentFormService, type SubmitEnrollmentFormRequest } from '../../services/studentEnrollmentForm.service';
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

interface PublicEnrollmentFormProps {
  onComplete: (result: { userId: string; studentId: string; email: string; fullName: string }) => void;
  onCancel: () => void;
}

const SECTIONS = [
  { id: 1, title: 'Applicant Information', shortTitle: 'Applicant' },
  { id: 2, title: 'Unique Student Identifier (USI)', shortTitle: 'USI' },
  { id: 3, title: 'Education & Employment', shortTitle: 'Education' },
  { id: 4, title: 'Additional Information', shortTitle: 'Additional' },
  { id: 5, title: 'Privacy, Terms & Signature', shortTitle: 'Privacy' },
];

export function PublicEnrollmentForm({ onComplete, onCancel }: PublicEnrollmentFormProps) {
  // Step management: 'registration' -> 'form' -> 'submitting' -> 'complete'
  const [currentStep, setCurrentStep] = useState<'registration' | 'form'>('registration');
  const [currentSection, setCurrentSection] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Registration form state
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToConditions, setAgreedToConditions] = useState(false);
  const [registrationErrors, setRegistrationErrors] = useState<Record<string, string>>({});

  // Form data state
  const [formData, setFormData] = useState<StudentEnrolmentFormData>({
    applicant: { ...initialApplicantDetails },
    usi: { ...initialUSIDetails },
    education: { ...initialEducationDetails },
    additionalInfo: { ...initialAdditionalInfo },
    privacyTerms: { ...initialPrivacyTerms },
  });

  // Validate registration form
  const validateRegistration = (): boolean => {
    const errors: Record<string, string> = {};

    if (!registrationData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!registrationData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!registrationData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!registrationData.password) {
      errors.password = 'Password is required';
    } else if (registrationData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!agreedToConditions) {
      errors.conditions = 'Please agree to the conditions';
    }

    setRegistrationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Start the enrollment form after registration
  const handleStartForm = () => {
    if (!validateRegistration()) {
      return;
    }

    // Pre-fill applicant details from registration
    const nameParts = registrationData.fullName.trim().split(' ');
    const givenName = nameParts[0] || '';
    const surname = nameParts.slice(1).join(' ') || '';

    setFormData(prev => ({
      ...prev,
      applicant: {
        ...prev.applicant,
        givenName: givenName,
        surname: surname,
        email: registrationData.email,
        mobile: registrationData.phone,
      }
    }));

    setCurrentStep('form');
  };

  // Form section handlers
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

  const mapFormDataToRequest = (): SubmitEnrollmentFormRequest => {
    const { applicant, usi, education, additionalInfo, privacyTerms } = formData;

    return {
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
      countryOfBirth: additionalInfo.countryOfBirth,
      speaksOtherLanguage: additionalInfo.langOther,
      homeLanguage: additionalInfo.homeLanguage || undefined,
      indigenousStatus: additionalInfo.indigenousStatus,
      hasDisability: additionalInfo.hasDisability,
      disabilityTypes: additionalInfo.disabilityTypes?.length ? additionalInfo.disabilityTypes : undefined,
      disabilityNotes: additionalInfo.disabilityNotes || undefined,
      acceptedPrivacyNotice: privacyTerms.acceptPrivacy,
      acceptedTermsAndConditions: privacyTerms.acceptTerms,
      declarationName: privacyTerms.declareName,
      declarationDate: privacyTerms.declareDate,
      signatureData: privacyTerms.signatureData,
    };
  };

  const handleSubmit = async () => {
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
      const request = mapFormDataToRequest();

      // Submit the public enrollment form (creates user + student + submits form)
      const response = await studentEnrollmentFormService.submitPublicEnrollmentForm({
        ...request,
        password: registrationData.password,
      });

      if (response.success && response.data) {
        toast.success('Enrollment form submitted successfully! Your account has been created.');
        onComplete({
          userId: response.data.userId,
          studentId: response.data.studentId,
          email: response.data.email,
          fullName: response.data.fullName,
        });
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

  // Registration Step
  if (currentStep === 'registration') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            Student Enrollment
          </h1>
          <p className="text-gray-600">Complete your registration and enrollment form to get started</p>
        </div>

        <Card className="border-violet-100">
          <CardHeader className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-t-lg">
            <CardTitle>Safety Training Academy - Enrollment Form</CardTitle>
            <CardDescription className="text-violet-100">
              Create your account and complete the enrollment process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Registration Form */}
            <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-lg p-6 border border-violet-200">
              <h2 className="text-xl font-semibold mb-4 text-violet-900">Your Details</h2>
              <p className="text-gray-600 mb-4 text-sm">Please fill in your details to create your account before completing the enrollment form.</p>
              
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={registrationData.fullName}
                    onChange={(e) => {
                      setRegistrationData({ ...registrationData, fullName: e.target.value });
                      if (registrationErrors.fullName) {
                        setRegistrationErrors({ ...registrationErrors, fullName: '' });
                      }
                    }}
                    className={`mt-1 ${registrationErrors.fullName ? 'border-red-500' : ''}`}
                  />
                  {registrationErrors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{registrationErrors.fullName}</p>
                  )}
                </div>

                {/* Email and Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={registrationData.email}
                      onChange={(e) => {
                        setRegistrationData({ ...registrationData, email: e.target.value });
                        if (registrationErrors.email) {
                          setRegistrationErrors({ ...registrationErrors, email: '' });
                        }
                      }}
                      className={`mt-1 ${registrationErrors.email ? 'border-red-500' : ''}`}
                    />
                    {registrationErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{registrationErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+61 xxx xxx xxx"
                      value={registrationData.phone}
                      onChange={(e) => {
                        setRegistrationData({ ...registrationData, phone: e.target.value });
                        if (registrationErrors.phone) {
                          setRegistrationErrors({ ...registrationErrors, phone: '' });
                        }
                      }}
                      className={`mt-1 ${registrationErrors.phone ? 'border-red-500' : ''}`}
                    />
                    {registrationErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{registrationErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a secure password"
                      value={registrationData.password}
                      onChange={(e) => {
                        setRegistrationData({ ...registrationData, password: e.target.value });
                        if (registrationErrors.password) {
                          setRegistrationErrors({ ...registrationErrors, password: '' });
                        }
                      }}
                      className={`pr-12 ${registrationErrors.password ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {registrationErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{registrationErrors.password}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>
              </div>
            </div>

            {/* Enrollment Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About the Enrollment Form</h2>
              <div className="space-y-3 text-gray-700">
                <p>The enrollment form consists of 5 sections:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li><strong>Applicant Information</strong> - Your personal details and emergency contacts</li>
                  <li><strong>Unique Student Identifier (USI)</strong> - Your USI details for Australian training records</li>
                  <li><strong>Education & Employment</strong> - Your educational background and current employment</li>
                  <li><strong>Additional Information</strong> - Language and accessibility requirements</li>
                  <li><strong>Privacy, Terms & Signature</strong> - Review and sign the enrollment agreement</li>
                </ol>
              </div>
            </div>

            {/* What happens next */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="space-y-1 text-blue-800 text-sm">
                <li>? After completing the form, your enrollment will be reviewed by our team</li>
                <li>? You'll receive access to your student portal immediately</li>
                <li>? You can track your enrollment status from the portal</li>
                <li>? Our team will contact you if any additional information is needed</li>
              </ul>
            </div>

            {/* Agreement */}
            <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <Checkbox 
                id="conditions" 
                checked={agreedToConditions}
                onCheckedChange={(checked: boolean) => {
                  setAgreedToConditions(checked);
                  if (registrationErrors.conditions) {
                    setRegistrationErrors({ ...registrationErrors, conditions: '' });
                  }
                }}
              />
              <label htmlFor="conditions" className="text-gray-700 cursor-pointer">
                I understand that my information will be used for enrollment purposes and I agree to provide accurate details
              </label>
            </div>
            {registrationErrors.conditions && (
              <p className="text-red-500 text-sm">{registrationErrors.conditions}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleStartForm}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
            >
              Continue to Enrollment Form
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Enrollment Form Step
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
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
            <Badge className="bg-blue-100 text-blue-700">
              New Enrollment
            </Badge>
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
          <div className="flex justify-between items-center">
            <div>
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            </div>
            <div className="flex gap-3">
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
                      Creating Account & Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Submit Enrollment
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
