// TypeScript interfaces for Student Enrolment Form

export interface ApplicantDetails {
  // Basic Details
  title: 'Mr' | 'Mrs' | 'Miss' | 'Ms' | 'Dr' | 'Other' | '';
  surname: string;
  givenName: string;
  middleName?: string;
  preferredName?: string;
  dob: string;
  gender: 'Male' | 'Female' | '';

  // Contact Details
  homePhone?: string;
  workPhone?: string;
  mobile: string;
  email: string;

  // Residential Address
  resAddress: string;
  resSuburb: string;
  resState: string;
  resPostcode: string;

  // Postal Address (if different)
  postalDifferent: boolean;
  postAddress?: string;
  postSuburb?: string;
  postState?: string;
  postPostcode?: string;

  // Documents
  docPrimaryId?: File | null;
  docSecondaryId?: File | null;

  // Emergency Contact
  emergencyName: string;
  emergencyRelationship: string;
  emergencyContactNumber: string;
  emergencyPermission: 'Yes' | 'No' | '';
}

export interface USIDetails {
  usi?: string;
  usiAccessPermission: boolean;
  usiApply: 'Yes' | 'No' | '';

  // USI Application through STA (required if usiApply is Yes)
  usiAuthoriseName?: string;
  usiConsent?: boolean;
  townCityBirth?: string;
  overseasCityBirth?: string;

  // Identity Document for USI
  usiIdType?: string;
  usiIdUpload?: File | null;

  // Driver's Licence (ID Type 1)
  dlState?: string;
  dlNumber?: string;

  // Medicare (ID Type 2)
  medicareNumber?: string;
  medicareIRN?: string;
  medicareColor?: 'Green' | 'Yellow' | 'Blue' | '';
  medicareExpiry?: string;

  // Birth Certificate (ID Type 3)
  birthState?: string;

  // ImmiCard (ID Type 4)
  immiNumber?: string;

  // Australian Passport (ID Type 5)
  ausPassportNumber?: string;

  // Non-Australian Passport (ID Type 6)
  nonAusPassportNumber?: string;
  nonAusPassportCountry?: string;

  // Citizenship Certificate (ID Type 7)
  citizenshipStock?: string;
  citizenshipAcqDate?: string;

  // Registration by Descent (ID Type 8)
  descentAcqDate?: string;
}

export interface EducationDetails {
  // Prior Education
  schoolLevel: string;
  schoolCompleteYear: string;
  schoolName: string;
  schoolInAus: boolean;
  schoolState?: string;
  schoolPostcode?: string;
  schoolCountry?: string;

  // Qualifications
  hasPostQual: 'Yes' | 'No' | '';
  qualLevels?: string[];
  qualDetails?: string;
  qualEvidenceUpload?: File | null;

  // Employment Status
  employmentStatus: string;

  // Employment Details
  employerName?: string;
  supervisorName?: string;
  employerAddress?: string;
  employerEmail?: string;
  employerPhone?: string;

  // Reason for Training
  trainingReason: string;
  trainingReasonOther?: string;
}

export interface AdditionalInfo {
  countryOfBirth: string;
  langOther: 'Yes' | 'No' | '';
  homeLanguage?: string;
  indigenousStatus: string;
  hasDisability: 'Yes' | 'No' | '';
  disabilityTypes?: string[];
  disabilityNotes?: string;
}

export interface PrivacyTerms {
  acceptPrivacy: boolean;
  acceptTerms: boolean;
  declareName: string;
  declareDate: string;
  signatureData: string;
}

export interface StudentEnrolmentFormData {
  applicant: ApplicantDetails;
  usi: USIDetails;
  education: EducationDetails;
  additionalInfo: AdditionalInfo;
  privacyTerms: PrivacyTerms;
}

// Initial/default values
export const initialApplicantDetails: ApplicantDetails = {
  title: '',
  surname: '',
  givenName: '',
  middleName: '',
  preferredName: '',
  dob: '',
  gender: '',
  homePhone: '',
  workPhone: '',
  mobile: '',
  email: '',
  resAddress: '',
  resSuburb: '',
  resState: '',
  resPostcode: '',
  postalDifferent: false,
  postAddress: '',
  postSuburb: '',
  postState: '',
  postPostcode: '',
  docPrimaryId: null,
  docSecondaryId: null,
  emergencyName: '',
  emergencyRelationship: '',
  emergencyContactNumber: '',
  emergencyPermission: '',
};

export const initialUSIDetails: USIDetails = {
  usi: '',
  usiAccessPermission: false,
  usiApply: '',
  usiAuthoriseName: '',
  usiConsent: false,
  townCityBirth: '',
  overseasCityBirth: '',
  usiIdType: '',
  usiIdUpload: null,
  dlState: '',
  dlNumber: '',
  medicareNumber: '',
  medicareIRN: '',
  medicareColor: '',
  medicareExpiry: '',
  birthState: '',
  immiNumber: '',
  ausPassportNumber: '',
  nonAusPassportNumber: '',
  nonAusPassportCountry: '',
  citizenshipStock: '',
  citizenshipAcqDate: '',
  descentAcqDate: '',
};

export const initialEducationDetails: EducationDetails = {
  schoolLevel: '',
  schoolCompleteYear: '',
  schoolName: '',
  schoolInAus: true,
  schoolState: '',
  schoolPostcode: '',
  schoolCountry: '',
  hasPostQual: '',
  qualLevels: [],
  qualDetails: '',
  qualEvidenceUpload: null,
  employmentStatus: '',
  employerName: '',
  supervisorName: '',
  employerAddress: '',
  employerEmail: '',
  employerPhone: '',
  trainingReason: '',
  trainingReasonOther: '',
};

export const initialAdditionalInfo: AdditionalInfo = {
  countryOfBirth: '',
  langOther: '',
  homeLanguage: '',
  indigenousStatus: '',
  hasDisability: '',
  disabilityTypes: [],
  disabilityNotes: '',
};

export const initialPrivacyTerms: PrivacyTerms = {
  acceptPrivacy: false,
  acceptTerms: false,
  declareName: '',
  declareDate: '',
  signatureData: '',
};

export const initialFormData: StudentEnrolmentFormData = {
  applicant: initialApplicantDetails,
  usi: initialUSIDetails,
  education: initialEducationDetails,
  additionalInfo: initialAdditionalInfo,
  privacyTerms: initialPrivacyTerms,
};

// Constants for dropdowns
export const TITLE_OPTIONS = ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Other'] as const;

export const GENDER_OPTIONS = ['Male', 'Female'] as const;

export const STATE_OPTIONS = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'] as const;

export const SCHOOL_LEVEL_OPTIONS = [
  { value: '12 Year 12 or equivalent', label: '12 — Year 12 or equivalent' },
  { value: '11 Year 11 or equivalent', label: '11 — Year 11 or equivalent' },
  { value: '10 Year 10 or equivalent', label: '10 — Year 10 or equivalent' },
  { value: '09 Year 9 or equivalent', label: '09 — Year 9 or equivalent' },
  { value: '08 Year 8 or below', label: '08 — Year 8 or below' },
  { value: '02 Never attended school', label: '02 — Never attended school' },
] as const;

export const QUALIFICATION_LEVELS = [
  'Bachelor or Higher',
  'Advanced Diploma',
  'Diploma',
  'Certificate IV',
  'Certificate III',
  'Certificate II',
  'Certificate I',
  'Other',
] as const;

export const EMPLOYMENT_STATUS_OPTIONS = [
  { value: 'Full-time', label: 'Full-time employee' },
  { value: 'Part-time', label: 'Part-time employee' },
  { value: 'Self-employed', label: 'Self-employed' },
  { value: 'Unemployed seeking', label: 'Unemployed — seeking work' },
  { value: 'Not seeking', label: 'Not employed — not seeking' },
] as const;

export const TRAINING_REASON_OPTIONS = [
  { value: 'Job', label: 'To get a job' },
  { value: 'Promotion', label: 'Promotion' },
  { value: 'Skills', label: 'Extra skills' },
  { value: 'Course entry', label: 'Entry to another course' },
  { value: 'Personal', label: 'Personal development' },
  { value: 'Other', label: 'Other' },
] as const;

export const INDIGENOUS_STATUS_OPTIONS = [
  'Aboriginal',
  'Torres Strait Islander',
  'Both Aboriginal and Torres Strait Islander',
  'Neither',
  'Prefer not to say',
] as const;

export const DISABILITY_TYPES = [
  'Hearing/deafness',
  'Physical',
  'Intellectual',
  'Learning',
  'Mental illness',
  'Acquired brain impairment',
  'Vision',
  'Medical condition',
] as const;

export const USI_ID_TYPE_OPTIONS = [
  { value: '1', label: "1. Australian Driver's Licence" },
  { value: '2', label: '2. Medicare Card' },
  { value: '3', label: '3. Australian Birth Certificate' },
  { value: '4', label: '4. ImmiCard' },
  { value: '5', label: '5. Australian Passport' },
  { value: '6', label: '6. Non-Australian Passport (with Australian Visa)' },
  { value: '7', label: '7. Citizenship Certificate' },
  { value: '8', label: '8. Certificate of Registration by Descent' },
] as const;

export const MEDICARE_COLOR_OPTIONS = ['Green', 'Yellow', 'Blue'] as const;
