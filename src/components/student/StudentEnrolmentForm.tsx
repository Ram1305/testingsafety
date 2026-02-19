import { useState, useCallback } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { RotateCcw, ChevronLeft, ChevronRight, Send, Phone, MapPin } from 'lucide-react';

import { ApplicantSection } from './enrolment/ApplicantSection';
import { USISection } from './enrolment/USISection';
import { EducationSection } from './enrolment/EducationSection';
import { AdditionalInfoSection } from './enrolment/AdditionalInfoSection';
import { PrivacyTermsSection } from './enrolment/PrivacyTermsSection';

import type {
  StudentEnrolmentFormData,
  ApplicantDetails,
  USIDetails,
  EducationDetails,
  AdditionalInfo,
  PrivacyTerms,
} from '../../types/studentEnrolment';

import {
  initialFormData,
  initialApplicantDetails,
  initialUSIDetails,
  initialEducationDetails,
  initialAdditionalInfo,
  initialPrivacyTerms,
} from '../../types/studentEnrolment';

const TABS = [
  { id: 'applicant', label: '1) Applicant' },
  { id: 'usi', label: '2) USI' },
  { id: 'education', label: '3) Education & Work' },
  { id: 'additional', label: '4) Additional Info' },
  { id: 'privacy', label: '5) Privacy / Terms' },
] as const;

type TabId = (typeof TABS)[number]['id'];

interface ValidationErrors {
  applicant: Record<string, string>;
  usi: Record<string, string>;
  education: Record<string, string>;
  additionalInfo: Record<string, string>;
  privacyTerms: Record<string, string>;
}

export function StudentEnrolmentForm() {
  const [formData, setFormData] = useState<StudentEnrolmentFormData>(initialFormData);
  const [activeTab, setActiveTab] = useState<TabId>('applicant');
  const [errors, setErrors] = useState<ValidationErrors>({
    applicant: {},
    usi: {},
    education: {},
    additionalInfo: {},
    privacyTerms: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentTabIndex = TABS.findIndex((t) => t.id === activeTab);
  const progressPercent = ((currentTabIndex + 1) / TABS.length) * 100;

  // Update handlers for each section
  const updateApplicant = useCallback((data: Partial<ApplicantDetails>) => {
    setFormData((prev) => ({
      ...prev,
      applicant: { ...prev.applicant, ...data },
    }));
    // Clear errors for updated fields
    setErrors((prev) => ({
      ...prev,
      applicant: Object.fromEntries(
        Object.entries(prev.applicant).filter(([key]) => !(key in data))
      ),
    }));
  }, []);

  const updateUSI = useCallback((data: Partial<USIDetails>) => {
    setFormData((prev) => ({
      ...prev,
      usi: { ...prev.usi, ...data },
    }));
    setErrors((prev) => ({
      ...prev,
      usi: Object.fromEntries(
        Object.entries(prev.usi).filter(([key]) => !(key in data))
      ),
    }));
  }, []);

  const updateEducation = useCallback((data: Partial<EducationDetails>) => {
    setFormData((prev) => ({
      ...prev,
      education: { ...prev.education, ...data },
    }));
    setErrors((prev) => ({
      ...prev,
      education: Object.fromEntries(
        Object.entries(prev.education).filter(([key]) => !(key in data))
      ),
    }));
  }, []);

  const updateAdditionalInfo = useCallback((data: Partial<AdditionalInfo>) => {
    setFormData((prev) => ({
      ...prev,
      additionalInfo: { ...prev.additionalInfo, ...data },
    }));
    setErrors((prev) => ({
      ...prev,
      additionalInfo: Object.fromEntries(
        Object.entries(prev.additionalInfo).filter(([key]) => !(key in data))
      ),
    }));
  }, []);

  const updatePrivacyTerms = useCallback((data: Partial<PrivacyTerms>) => {
    setFormData((prev) => ({
      ...prev,
      privacyTerms: { ...prev.privacyTerms, ...data },
    }));
    setErrors((prev) => ({
      ...prev,
      privacyTerms: Object.fromEntries(
        Object.entries(prev.privacyTerms).filter(([key]) => !(key in data))
      ),
    }));
  }, []);

  // Validation functions
  const validateApplicant = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    const { applicant } = formData;

    if (!applicant.title) errs.title = 'Please select a title.';
    if (!applicant.surname?.trim()) errs.surname = 'Surname is required.';
    if (!applicant.givenName?.trim()) errs.givenName = 'Given name is required.';
    if (!applicant.dob) errs.dob = 'Date of birth is required.';
    if (!applicant.gender) errs.gender = 'Please select gender.';
    if (!applicant.mobile?.trim()) errs.mobile = 'Mobile phone is required.';
    if (!applicant.email?.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicant.email)) errs.email = 'A valid email is required.';
    if (!applicant.resAddress?.trim()) errs.resAddress = 'Residential address is required.';
    if (!applicant.resSuburb?.trim()) errs.resSuburb = 'Suburb is required.';
    if (!applicant.resState) errs.resState = 'State is required.';
    if (!applicant.resPostcode?.trim()) errs.resPostcode = 'Postcode is required.';
    else if (!/^\d{4}$/.test(applicant.resPostcode)) errs.resPostcode = 'Enter a valid 4-digit postcode.';

    if (applicant.postalDifferent) {
      if (!applicant.postAddress?.trim()) errs.postAddress = 'Postal address is required.';
      if (!applicant.postSuburb?.trim()) errs.postSuburb = 'Postal suburb is required.';
      if (!applicant.postState) errs.postState = 'Postal state is required.';
      if (!applicant.postPostcode?.trim()) errs.postPostcode = 'Postal postcode is required.';
      else if (!/^\d{4}$/.test(applicant.postPostcode)) errs.postPostcode = 'Enter a valid 4-digit postcode.';
    }

    if (!applicant.docPrimaryId) errs.docPrimaryId = 'Please upload your primary ID.';
    if (!applicant.emergencyName?.trim()) errs.emergencyName = 'Emergency contact name is required.';
    if (!applicant.emergencyRelationship?.trim()) errs.emergencyRelationship = 'Relationship is required.';
    if (!applicant.emergencyContactNumber?.trim()) errs.emergencyContactNumber = 'Contact number is required.';
    if (!applicant.emergencyPermission) errs.emergencyPermission = 'Please select Yes or No.';

    return errs;
  };

  const validateUSI = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    const { usi } = formData;

    if (!usi.usiApply) errs.usiApply = 'Please select an option.';

    if (usi.usiApply === 'Yes') {
      if (!usi.usiAuthoriseName?.trim()) errs.usiAuthoriseName = 'Name is required for USI application.';
      if (!usi.usiConsent) errs.usiConsent = 'Consent is required to apply through STA.';
      if (!usi.townCityBirth?.trim()) errs.townCityBirth = 'Town/City of birth is required.';
      if (!usi.overseasCityBirth?.trim()) errs.overseasCityBirth = 'Overseas city of birth is required.';
      if (!usi.usiIdType) errs.usiIdType = 'Please select an ID type.';
      if (!usi.usiIdUpload) errs.usiIdUpload = 'Please upload the selected ID document.';

      // Validate specific ID type fields
      if (usi.usiIdType === '1') {
        if (!usi.dlState?.trim()) errs.dlState = 'State is required.';
        if (!usi.dlNumber?.trim()) errs.dlNumber = 'Licence number is required.';
      }
      if (usi.usiIdType === '2') {
        if (!usi.medicareNumber?.trim()) errs.medicareNumber = 'Medicare card number is required.';
        if (!usi.medicareIRN?.trim()) errs.medicareIRN = 'IRN is required.';
        if (!usi.medicareColor) errs.medicareColor = 'Card colour is required.';
        if (!usi.medicareExpiry) errs.medicareExpiry = 'Expiry date is required.';
      }
      if (usi.usiIdType === '3' && !usi.birthState?.trim()) errs.birthState = 'State/Territory is required.';
      if (usi.usiIdType === '4' && !usi.immiNumber?.trim()) errs.immiNumber = 'ImmiCard number is required.';
      if (usi.usiIdType === '5' && !usi.ausPassportNumber?.trim()) errs.ausPassportNumber = 'Passport number is required.';
      if (usi.usiIdType === '6') {
        if (!usi.nonAusPassportNumber?.trim()) errs.nonAusPassportNumber = 'Passport number is required.';
        if (!usi.nonAusPassportCountry?.trim()) errs.nonAusPassportCountry = 'Country of issue is required.';
      }
      if (usi.usiIdType === '7') {
        if (!usi.citizenshipStock?.trim()) errs.citizenshipStock = 'Stock number is required.';
        if (!usi.citizenshipAcqDate) errs.citizenshipAcqDate = 'Acquisition date is required.';
      }
      if (usi.usiIdType === '8' && !usi.descentAcqDate) errs.descentAcqDate = 'Acquisition date is required.';
    }

    return errs;
  };

  const validateEducation = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    const { education } = formData;

    if (!education.schoolLevel) errs.schoolLevel = 'Please select one school level.';
    if (!education.schoolCompleteYear) errs.schoolCompleteYear = 'Year is required.';

    if (education.schoolInAus) {
      if (!education.schoolState?.trim()) errs.schoolState = 'State is required.';
      if (!education.schoolPostcode?.trim()) errs.schoolPostcode = 'Postcode is required.';
      else if (!/^\d{4}$/.test(education.schoolPostcode)) errs.schoolPostcode = 'Valid postcode required.';
    } else {
      if (!education.schoolCountry?.trim()) errs.schoolCountry = 'Country is required.';
    }

    if (!education.hasPostQual) errs.hasPostQual = 'Please select Yes or No.';
    if (education.hasPostQual === 'Yes' && !education.qualEvidenceUpload) {
      errs.qualEvidenceUpload = 'Qualification evidence is required when "Yes" is selected.';
    }

    if (!education.employmentStatus) errs.employmentStatus = 'Please select one option.';
    if (!education.trainingReason) errs.trainingReason = 'Please select one option.';
    if (education.trainingReason === 'Other' && !education.trainingReasonOther?.trim()) {
      errs.trainingReasonOther = 'Please provide details.';
    }

    return errs;
  };

  const validateAdditionalInfo = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    const { additionalInfo } = formData;

    if (!additionalInfo.countryOfBirth?.trim()) errs.countryOfBirth = 'Country of birth is required.';
    if (!additionalInfo.langOther) errs.langOther = 'Please select an option.';
    if (additionalInfo.langOther === 'Yes' && !additionalInfo.homeLanguage?.trim()) {
      errs.homeLanguage = 'Please enter the language.';
    }
    if (!additionalInfo.indigenousStatus) errs.indigenousStatus = 'Please select an option.';
    if (!additionalInfo.hasDisability) errs.hasDisability = 'Please select an option.';

    return errs;
  };

  const validatePrivacyTerms = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    const { privacyTerms } = formData;

    if (!privacyTerms.acceptPrivacy) errs.acceptPrivacy = 'You must accept the Privacy Notice.';
    if (!privacyTerms.acceptTerms) errs.acceptTerms = 'You must accept the Terms & Conditions.';
    if (!privacyTerms.declareName?.trim()) errs.declareName = 'Name is required.';
    if (!privacyTerms.declareDate) errs.declareDate = 'Date is required.';
    if (!privacyTerms.signatureData) errs.signatureData = 'Signature is required.';

    return errs;
  };

  const validateCurrentTab = (): boolean => {
    let tabErrors: Record<string, string> = {};
    let errorKey: keyof ValidationErrors;

    switch (activeTab) {
      case 'applicant':
        tabErrors = validateApplicant();
        errorKey = 'applicant';
        break;
      case 'usi':
        tabErrors = validateUSI();
        errorKey = 'usi';
        break;
      case 'education':
        tabErrors = validateEducation();
        errorKey = 'education';
        break;
      case 'additional':
        tabErrors = validateAdditionalInfo();
        errorKey = 'additionalInfo';
        break;
      case 'privacy':
        tabErrors = validatePrivacyTerms();
        errorKey = 'privacyTerms';
        break;
      default:
        return true;
    }

    setErrors((prev) => ({ ...prev, [errorKey]: tabErrors }));
    return Object.keys(tabErrors).length === 0;
  };

  const validateAllTabs = (): boolean => {
    const allErrors: ValidationErrors = {
      applicant: validateApplicant(),
      usi: validateUSI(),
      education: validateEducation(),
      additionalInfo: validateAdditionalInfo(),
      privacyTerms: validatePrivacyTerms(),
    };

    setErrors(allErrors);

    const hasErrors = Object.values(allErrors).some((errs) => Object.keys(errs).length > 0);
    return !hasErrors;
  };

  const goToNextTab = () => {
    if (validateCurrentTab()) {
      const nextIndex = currentTabIndex + 1;
      if (nextIndex < TABS.length) {
        setActiveTab(TABS[nextIndex].id);
      }
    } else {
      toast.error('Please fill in all required fields before proceeding.');
    }
  };

  const goToPrevTab = () => {
    const prevIndex = currentTabIndex - 1;
    if (prevIndex >= 0) {
      setActiveTab(TABS[prevIndex].id);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({
      applicant: {},
      usi: {},
      education: {},
      additionalInfo: {},
      privacyTerms: {},
    });
    setActiveTab('applicant');
    toast.info('Form has been reset.');
  };

  const handleSubmit = async () => {
    if (!validateAllTabs()) {
      // Find first tab with errors and navigate to it
      const errorTabs = Object.entries(errors).find(([, errs]) => Object.keys(errs).length > 0);
      if (errorTabs) {
        const tabMapping: Record<string, TabId> = {
          applicant: 'applicant',
          usi: 'usi',
          education: 'education',
          additionalInfo: 'additional',
          privacyTerms: 'privacy',
        };
        setActiveTab(tabMapping[errorTabs[0]]);
      }
      toast.error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Integrate with your actual service
      // Example:
      // await studentEnrolmentService.submitEnrolment(formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success('Enrolment submitted successfully!');
      console.log('Form Data:', formData);

      // Optionally reset form after successful submission
      // handleReset();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit enrolment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Safety Training Academy — Enrolment Form</h1>
              <p className="text-blue-100 text-sm">
                RTO: 45234 · Australian International Education and Training Pty Ltd (Trading as STA)
              </p>
              <div className="flex items-center gap-4 text-blue-100 text-sm mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  14–16 Marjorie Street, Sefton NSW 2162
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  1300 976 097
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleReset}
              className="bg-amber-500 hover:bg-amber-600 text-white border-amber-500 hover:border-amber-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Progress Card */}
        <Card className="mb-6 border-gray-200 shadow-lg rounded-2xl">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Please complete all sections clearly and carefully (web version of the paper form).
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Progress</span>
                <Progress value={progressPercent} className="w-48 h-2" />
                <Badge variant="default" className="bg-blue-600">
                  {currentTabIndex + 1} / {TABS.length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Form Card */}
        <Card className="border-gray-200 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>
              {/* Tab Navigation */}
              <TabsList className="flex flex-wrap gap-2 mb-6 h-auto bg-transparent p-0">
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2 rounded-lg border border-gray-200 data-[state=active]:border-blue-600"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <hr className="mb-6" />

              {/* Tab Content */}
              <TabsContent value="applicant" className="mt-0">
                <ApplicantSection
                  data={formData.applicant}
                  onChange={updateApplicant}
                  errors={errors.applicant}
                />
              </TabsContent>

              <TabsContent value="usi" className="mt-0">
                <USISection
                  data={formData.usi}
                  onChange={updateUSI}
                  errors={errors.usi}
                />
              </TabsContent>

              <TabsContent value="education" className="mt-0">
                <EducationSection
                  data={formData.education}
                  onChange={updateEducation}
                  errors={errors.education}
                />
              </TabsContent>

              <TabsContent value="additional" className="mt-0">
                <AdditionalInfoSection
                  data={formData.additionalInfo}
                  onChange={updateAdditionalInfo}
                  errors={errors.additionalInfo}
                />
              </TabsContent>

              <TabsContent value="privacy" className="mt-0">
                <PrivacyTermsSection
                  data={formData.privacyTerms}
                  onChange={updatePrivacyTerms}
                  errors={errors.privacyTerms}
                />
              </TabsContent>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {currentTabIndex > 0 ? (
                <Button variant="outline" onClick={goToPrevTab}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentTabIndex < TABS.length - 1 ? (
                <Button onClick={goToNextTab} className="bg-blue-600 hover:bg-blue-700">
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Enrolment
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
