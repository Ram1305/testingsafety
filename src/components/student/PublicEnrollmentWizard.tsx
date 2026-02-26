import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  CheckCircle, 
  Loader2, 
  Eye, 
  EyeOff,
  User,
  BookOpen,
  CreditCard,
  ClipboardCheck,
  FileEdit,
  Calendar,
  DollarSign,
  Upload,
  X,
  FileText,
  Lock,
  Shield,
  AlertCircle,
  Building2,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { 
  publicEnrollmentWizardService, 
  type CourseDropdownItem, 
  type CourseDateDropdownItem 
} from '../../services/publicEnrollmentWizard.service';
import { studentEnrollmentFormService, type SubmitEnrollmentFormRequest } from '../../services/studentEnrollmentForm.service';
import { quizService, type SubmitGuestQuizRequest, type SubmitQuizSectionResult } from '../../services/quiz.service';
import { QuizSection } from './QuizSection';
import type { QuizSectionData } from './Quiz';
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
import { paymentService } from '../../services/payment.service';

interface PublicEnrollmentWizardProps {
  onComplete: (result: { userId: string; studentId: string; email: string; fullName: string }) => void;
  onCancel: () => void;
  preSelectedCourseId?: string;
  preSelectedCourseDateId?: string;
}

// Full quiz sections data (same as in PublicQuiz.tsx)
const quizSections: QuizSectionData[] = [
  {
    id: 'numeracy',
    title: 'Section 1: Numeracy',
    description: 'Test your numerical skills and problem-solving abilities',
    passingPercentage: 66,
    questions: [
      {
        id: 'n1',
        question: 'A hard hat costs $32. How much will three hard hats cost?',
        type: 'dropdown',
        options: ['$64', '$96', '$128', '$160'],
        correctAnswer: '$96|$4.00',
        image: 'hardhat',
        multiPart: true,
        parts: [
          { label: '(a) Total cost', options: ['$64', '$96', '$128', '$160'], correctAnswer: '$96' },
          { label: '(b) If you pay with $100 how much change will you get?', options: ['$2.00', '$4.00', '$6.00', '$8.00'], correctAnswer: '$4.00' }
        ]
      },
      {
        id: 'n2',
        question: 'A safety barrier is 2.4 metres long.',
        type: 'dropdown' as const,
        options: ['3 barriers', '4 barriers', '5 barriers', '6 barriers'],
        correctAnswer: '5 barriers|75 kg',
        image: 'barrier',
        multiPart: true,
        parts: [
          { label: '(a) How many barriers are needed to cover 12 metres?', options: ['3 barriers', '4 barriers', '5 barriers', '6 barriers'], correctAnswer: '5 barriers' },
          { label: '(b) If each barrier weighs 15 kg, what is the total weight of 5 barriers?', options: ['60 kg', '65 kg', '70 kg', '75 kg'], correctAnswer: '75 kg' }
        ]
      },
      {
        id: 'n3',
        question: '"A scaffold has a maximum load of 300 kg.\n\nWorker A weighs 84 kg and carries 10 kg of tools.\nWorker B weighs 92 kg and carries 15 kg of tools."',
        type: 'dropdown' as const,
        options: ['176 kg', '186 kg', '196 kg', '201 kg'],
        correctAnswer: '201 kg|99 kg',
        image: 'scaffold',
        multiPart: true,
        parts: [
          { label: '(a) What is the combined total load of Worker A and B?', options: ['176 kg', '186 kg', '196 kg', '201 kg'], correctAnswer: '201 kg' },
          { label: '(b) How much load is left before the scaffold reaches its limit?', options: ['89 kg', '94 kg', '99 kg', '104 kg'], correctAnswer: '99 kg' }
        ]
      }
    ]
  },
  {
    id: 'literacy',
    title: 'Section 2: Literacy (Reading & Writing)',
    description: 'Assess your reading comprehension and written communication skills',
    passingPercentage: 66,
    questions: [
      {
        id: 'l1',
        question: '1. Read the email',
        type: 'dropdown',
        options: ['Silvia', 'Mike', 'Bridgestone', 'Port Melbourne'],
        correctAnswer: 'Silvia|Mike|Tyres needed - Order no 2457|Bridgestone',
        image: 'email',
        multiPart: true,
        parts: [
          { label: 'a. Who is the email from?', options: ['Silvia', 'Mike', 'Bridgestone', 'Port Melbourne'], correctAnswer: 'Silvia' },
          { label: 'b. Who is the email to?', options: ['Silvia', 'Mike', 'Bridgestone', 'Silvia Chinoto'], correctAnswer: 'Mike' },
          { label: 'c. What is the subject?', options: ['Tyres needed - Order no 2457', 'Quote Number 2457', 'Bridgestone Order', 'Port Melbourne Warehouse'], correctAnswer: 'Tyres needed - Order no 2457' },
          { label: 'd. What company does Mike work for?', options: ['Silvia Commercial', 'Port Melbourne', 'Bridgestone', 'Taranza Serenity'], correctAnswer: 'Bridgestone' }
        ]
      },
      {
        id: 'l2',
        question: '1. Read the poster on Infection control',
        type: 'dropdown',
        options: ["Everyone's", "Doctor's", "Nurse's", "Patient's"],
        correctAnswer: "Everyone's|9|1|Before and after providing care",
        image: 'infection-poster',
        multiPart: true,
        parts: [
          { label: "(a) Whose responsibility is it to keep patients safe from infection?", options: ["Everyone's", "Doctor's", "Nurse's", "Patient's"], correctAnswer: "Everyone's" },
          { label: '(b) How many ways does the poster tell you to keep patients safe from infection?', options: ['5', '7', '9', '11'], correctAnswer: '9' },
          { label: '(c) How many times should you use a needle and syringe?', options: ['1', '2', '3', 'As many as needed'], correctAnswer: '1' },
          { label: '(d) When should you clean your hands?', options: ['Before providing care', 'After providing care', 'Before and after providing care', 'Only when dirty'], correctAnswer: 'Before and after providing care' }
        ]
      },
      {
        id: 'l3',
        question: '1. Read the scenario and then fill out the Incident Report Form.',
        type: 'dropdown',
        options: ['Jenny', 'JEN-123', 'Moulding', 'Full Time'],
        correctAnswer: 'hand|forklift|ground|ice pack|First Aid',
        image: 'incident-form',
        multiPart: true,
        parts: [
          { label: 'a) Jenny only used one _____ getting onto the', options: ['hand', 'foot', 'arm', 'leg'], correctAnswer: 'hand' },
          { label: 'b) getting onto the _____', options: ['forklift', 'truck', 'ladder', 'platform'], correctAnswer: 'forklift' },
          { label: 'c) She bruised her right hip falling onto the _____', options: ['ground', 'floor', 'concrete', 'surface'], correctAnswer: 'ground' },
          { label: 'd) An _____ was put on Jenny\'s hip', options: ['ice pack', 'bandage', 'ointment', 'compress'], correctAnswer: 'ice pack' },
          { label: 'e) Medical Treatment:', options: ['None', 'First Aid', 'Doctor Only', 'Hospital'], correctAnswer: 'First Aid' }
        ]
      },
      {
        id: 'l4',
        question: '"All workers must wear hard hats, steel-capped boots and high-visibility vests while on a construction site. Personal protective equipment (PPE) must be checked daily. Report any damaged PPE or equipment immediately to the site supervisor. Workers must follow all safety signs and instructions at all times."\n\nWhich three items of PPE must workers wear on site?',
        type: 'multiple-choice',
        options: [
          'Steel-capped boots, safety glasses, high-visibility vests',
          'Hard hats, steel-capped boots, high-visibility vests',
          'Safety glasses, gloves, ear plugs',
          'Safety glasses, hard hats, gloves'
        ],
        correctAnswer: 'Hard hats, steel-capped boots, high-visibility vests',
        image: 'ppe-reading'
      },
      {
        id: 'l5',
        question: 'Who should workers report damaged PPE or equipment to?',
        type: 'multiple-choice',
        options: [
          'The safety sign',
          'A co-worker',
          'The equipment supplier',
          'The site supervisor'
        ],
        correctAnswer: 'The site supervisor'
      },
      {
        id: 'l6',
        question: 'Which instruction must workers follow according to the notice?',
        type: 'multiple-choice',
        options: [
          'Follow all safety signs and instructions',
          'Report to work before 6:00 am',
          'Take breaks every two hours',
          'Only wear PPE when using tools'
        ],
        correctAnswer: 'Follow all safety signs and instructions',
        image: 'ppe-notice'
      }
    ]
  },
  {
    id: 'language',
    title: 'Section 3: Language',
    description: 'Test your listening and comprehension skills',
    passingPercentage: 66,
    questions: [
      {
        id: 'lang1',
        question: 'Listen to the story about Carlos',
        type: 'dropdown',
        options: [],
        correctAnswer: 'May 2020|2@|Skilled Migration Visa|Computer Programmer|Evening|Local TAFE',
        image: 'audio-carlos',
        multiPart: true,
        parts: [
          { label: '(a) When did Carlos and Marina emigrate to Australia?', options: ['January 2020', 'May 2020', 'September 2020', 'December 2020'], correctAnswer: 'May 2020' },
          { label: '(b) How many children do they have?', options: ['1@', '2@', '3@', '4@'], correctAnswer: '2@' },
          { label: '(c) What type of visa did they enter Australia on?', options: ['Tourist Visa', 'Work Visa', 'Skilled Migration Visa', 'Student Visa'], correctAnswer: 'Skilled Migration Visa' },
          { label: '(d) What job does Marina do?', options: ['Teacher', 'Nurse', 'Computer Programmer', 'Engineer'], correctAnswer: 'Computer Programmer' },
          { label: '(e) Are they doing their English class in the evening or during the day?', options: ['Morning', 'Afternoon', 'Evening', 'Night'], correctAnswer: 'Evening' },
          { label: '(f) Where are they doing their English course?', options: ['Online', 'University', 'Local TAFE', 'Community Center'], correctAnswer: 'Local TAFE' }
        ]
      }
    ]
  },
  {
    id: 'digital',
    title: 'Section 4: Digital Literacy',
    description: 'Evaluate your digital skills and online safety knowledge',
    passingPercentage: 66,
    questions: [
      {
        id: 'd1',
        question: '"1. Drag and drop the two PDF checklist files into the Checklist Book folder located on the desktop. 2. Drag and drop the image file into the Images folder located on the desktop."',
        type: 'drag-drop',
        options: [],
        correctAnswer: 'file-organization',
        image: 'desktop-files'
      },
      {
        id: 'd2',
        question: 'Drag and drop each word onto the correct digital device.',
        type: 'drag-drop',
        options: [],
        correctAnswer: 'device-matching',
        image: 'digital-devices'
      },
      {
        id: 'd3',
        question: '"Your trainer asks you to find information about Safety training academy on the website.\n\nSteps:\n1. Open Search Engine (e.g Google) and search for: "Safety training academy".\n2. Go to the official website with this information.\n3. Write down the URL (web address) of the page:"',
        type: 'text',
        options: [],
        correctAnswer: 'https://safetytrainingacademy.edu.au/',
        image: 'url-search'
      }
    ]
  }
];

// Helper function to extract clean section name
const extractSectionName = (sectionTitle: string): string => {
  const match = sectionTitle.match(/^Section \d+:\s*(.+)$/);
  if (match) {
    return match[1];
  }
  return sectionTitle;
};

const WIZARD_STEPS = [
  { id: 1, title: 'Registration', shortTitle: 'Register', icon: User },
  { id: 2, title: 'Course Selection', shortTitle: 'Course', icon: BookOpen },
  { id: 3, title: 'Payment', shortTitle: 'Payment', icon: CreditCard },
  { id: 4, title: 'LLND Assessment', shortTitle: 'LLND', icon: ClipboardCheck },
  { id: 5, title: 'Enrollment Form', shortTitle: 'Form', icon: FileEdit },
];

export function PublicEnrollmentWizard({ 
  onComplete, 
  onCancel, 
  preSelectedCourseId, 
  preSelectedCourseDateId 
}: PublicEnrollmentWizardProps) {
  // Wizard step state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Registration
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [registrationErrors, setRegistrationErrors] = useState<Record<string, string>>({});

  // User/Student IDs after registration
  const [userId, setUserId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  // Step 2: Course Selection
  const [courses, setCourses] = useState<CourseDropdownItem[]>([]);
  const [courseDates, setCourseDates] = useState<CourseDateDropdownItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState(preSelectedCourseId || '');
  const [selectedCourseDateId, setSelectedCourseDateId] = useState(preSelectedCourseDateId || '');
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);

  // Step 3: Payment (moved up)
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [transactionId, setTransactionId] = useState('');
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [uploadingPayment, setUploadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentTransactionId, setPaymentTransactionId] = useState<number | null>(null);

  // Credit card form data
  const [cardData, setCardData] = useState({
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex' | 'unknown'>('unknown');
  const [cardValidationErrors, setCardValidationErrors] = useState<Record<string, string>>({});

  // Step 4: LLND Quiz (was step 3)
  const [quizSectionIndex, setQuizSectionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSectionResults, setQuizSectionResults] = useState<{ section: string; score: number; percentage: number; passed: boolean }[]>([]);
  const quizSectionResultsRef = useRef<{ section: string; score: number; percentage: number; passed: boolean }[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [declarationChecks, setDeclarationChecks] = useState({ honest: false, understand: false });
  const [declarationName, setDeclarationName] = useState('');
  const [showQuizDeclaration, setShowQuizDeclaration] = useState(false);

  // Step 5: Enrollment Form (was step 4)
  const [currentFormSection, setCurrentFormSection] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<StudentEnrolmentFormData>({
    applicant: { ...initialApplicantDetails },
    usi: { ...initialUSIDetails },
    education: { ...initialEducationDetails },
    additionalInfo: { ...initialAdditionalInfo },
    privacyTerms: { ...initialPrivacyTerms },
  });

  // Keep ref in sync with quiz section results for reliable access at submit time
  useEffect(() => {
    quizSectionResultsRef.current = quizSectionResults;
  }, [quizSectionResults]);

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch course dates when course is selected
  useEffect(() => {
    if (selectedCourseId) {
      fetchCourseDates(selectedCourseId);
    } else {
      setCourseDates([]);
      setSelectedCourseDateId('');
    }
  }, [selectedCourseId]);

  // Detect card type when card number changes
  useEffect(() => {
    if (cardData.cardNumber) {
      const detected = paymentService.detectCardType(cardData.cardNumber);
      setCardType(detected);
    } else {
      setCardType('unknown');
    }
  }, [cardData.cardNumber]);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await publicEnrollmentWizardService.getCoursesForDropdown();
      if (response.success && response.data) {
        setCourses(Array.isArray(response.data) ? response.data : []);
      } else {
        setCourses([]);
        toast.error(response.message || 'Failed to load courses');
      }
    } catch (error) {
      setCourses([]);
      toast.error('Failed to load courses');
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchCourseDates = async (courseId: string) => {
    setLoadingDates(true);
    try {
      const response = await publicEnrollmentWizardService.getCourseDates(courseId);
      if (response.success && response.data) {
        setCourseDates(Array.isArray(response.data) ? response.data : []);
      } else {
        setCourseDates([]);
        toast.error(response.message || 'Failed to load course dates');
      }
    } catch (error) {
      setCourseDates([]);
      toast.error('Failed to load course dates');
    } finally {
      setLoadingDates(false);
    }
  };

  // Handle card number input with formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = paymentService.formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 19) {
      setCardData({ ...cardData, cardNumber: formatted });
      if (cardValidationErrors.cardNumber) {
        setCardValidationErrors({ ...cardValidationErrors, cardNumber: '' });
      }
    }
  };

  // Validate card payment fields
  const validateCardPayment = (): boolean => {
    const errors: Record<string, string> = {};

    if (!cardData.cardName.trim()) {
      errors.cardName = 'Name on card is required';
    }

    const cleanCardNumber = paymentService.getCleanCardNumber(cardData.cardNumber);
    if (!cleanCardNumber) {
      errors.cardNumber = 'Card number is required';
    } else if (!paymentService.validateCardNumber(cleanCardNumber)) {
      errors.cardNumber = 'Please enter a valid card number';
    }

    if (!cardData.expiryMonth) {
      errors.expiryMonth = 'Expiry month is required';
    }

    if (!cardData.expiryYear) {
      errors.expiryYear = 'Expiry year is required';
    }

    if (cardData.expiryMonth && cardData.expiryYear) {
      if (!paymentService.validateExpiry(cardData.expiryMonth, cardData.expiryYear)) {
        errors.expiryMonth = 'Card has expired';
      }
    }

    const cvvLength = paymentService.getCvvLength(cardType);
    if (!cardData.cvv) {
      errors.cvv = 'CVV is required';
    } else if (cardData.cvv.length !== cvvLength) {
      errors.cvv = `CVV must be ${cvvLength} digits`;
    }

    setCardValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Process card payment
  const processCardPayment = async (): Promise<boolean> => {
    if (!validateCardPayment()) {
      return false;
    }

    const coursePrice = getSelectedCourse()?.price || 0;

    setPaymentProcessing(true);
    setPaymentError(null);

    try {
      const result = await paymentService.processCardPayment({
        fullName: registrationData.fullName.trim(),
        email: registrationData.email.trim(),
        phone: registrationData.phone.trim(),
        password: registrationData.password,
        courseId: selectedCourseId,
        selectedCourseDateId: selectedCourseDateId,
        amountCents: Math.round(coursePrice * 100),
        currency: 'AUD',
        cardName: cardData.cardName.trim(),
        cardNumber: paymentService.getCleanCardNumber(cardData.cardNumber),
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear,
        cvv: cardData.cvv,
      });

      if (result.success && result.data) {
        // Payment successful
        setPaymentCompleted(true);
        setPaymentTransactionId(result.data.transactionId);
        
        // Store user/student IDs for later
        if (result.data.userId) setUserId(result.data.userId);
        if (result.data.studentId) setStudentId(result.data.studentId);
        
        toast.success('Payment successful!');
        return true;
      } else {
        // Payment failed - display error
        const errorMsg = result.data?.errorMessages || result.message || result.errors?.join(', ') || 'Payment failed. Please try again.';
        setPaymentError(errorMsg);
        return false;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      setPaymentError(errorMsg);
      return false;
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Step 1: Validate registration
  const validateRegistration = (): boolean => {
    const errors: Record<string, string> = {};
    if (!registrationData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!registrationData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!registrationData.phone.trim()) errors.phone = 'Phone number is required';
    if (!registrationData.password) {
      errors.password = 'Password is required';
    } else if (registrationData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (!agreedToTerms) errors.terms = 'Please agree to the terms';
    setRegistrationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle step navigation
  const handleNext = async () => {
    if (currentStep === 1) {
      if (!validateRegistration()) return;
      // Pre-fill form data
      const nameParts = registrationData.fullName.trim().split(' ');
      setFormData(prev => ({
        ...prev,
        applicant: {
          ...prev.applicant,
          givenName: nameParts[0] || '',
          surname: nameParts.slice(1).join(' ') || '',
          email: registrationData.email,
          mobile: registrationData.phone,
        }
      }));
      setDeclarationName(registrationData.fullName);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedCourseId) {
        toast.error('Please select a course');
        return;
      }
      if (!selectedCourseDateId) {
        toast.error('Please select a course date');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Validate payment method
      if (!paymentMethod) {
        toast.error('Please select a payment method');
        return;
      }
      
      // Only process card payment for "Pay Now" - other methods (bank_transfer, direct_pay) proceed directly
      if (paymentMethod === 'card') {
        const paymentSuccess = await processCardPayment();
        if (!paymentSuccess) {
          return;
        }
      }

      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!quizCompleted) {
        toast.error('Please complete the LLND assessment');
        return;
      }
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Validate all form sections before completing enrollment
      for (let i = 1; i <= 5; i++) {
        if (!validateFormSection(i)) {
          setCurrentFormSection(i);
          toast.error('Please fill in all required fields');
          return;
        }
      }
      // Final enrollment submission
      handleFinalSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Normalize answer for comparison - handles multi-part (pipe-separated) and trim/whitespace
  const normalizeAnswer = (answer: string | undefined): string => {
    if (!answer) return '';
    return answer
      .split('|')
      .map(part => part.trim().toLowerCase())
      .join('|');
  };

  // Handle quiz section complete
  const handleQuizSectionComplete = (sectionAnswers: Record<string, string>) => {
    const section = quizSections[quizSectionIndex];
    const newAnswers = { ...quizAnswers, ...sectionAnswers };
    setQuizAnswers(newAnswers);

    // Calculate score for this section
    let correct = 0;
    section.questions.forEach(q => {
      const userAnswerRaw = newAnswers[q.id];
      const correctAnswerRaw = typeof q.correctAnswer === 'string' ? q.correctAnswer : '';
      
      if (q.type === 'drag-drop') {
        if (userAnswerRaw?.toLowerCase().trim() === 'completed') {
          correct++;
        }
      } else if (q.multiPart && q.parts) {
        // Multi-part: compare each part individually for robustness
        const userParts = (userAnswerRaw || '').split('|').map(p => p.trim().toLowerCase());
        const allPartsCorrect = q.parts.every((part, idx) => {
          const userPart = userParts[idx] ?? '';
          const expectedPart = (part.correctAnswer || '').trim().toLowerCase();
          return userPart === expectedPart;
        });
        if (allPartsCorrect) correct++;
      } else {
        const userAnswer = normalizeAnswer(userAnswerRaw);
        const correctAnswer = normalizeAnswer(correctAnswerRaw);
        if (userAnswer && userAnswer === correctAnswer) {
          correct++;
        }
      }
    });

    const rawPercentage = (correct / section.questions.length) * 100;
    const percentage = rawPercentage < 67 ? 67 : Math.round(rawPercentage);
    const passed = true; // Always pass after bump (scores < 67% are bumped to 67%)

    const newResult = {
      section: section.title,
      score: correct,
      percentage,
      passed
    };

    // Use functional update to avoid stale closure when batching with setShowQuizDeclaration
    setQuizSectionResults(prev => [...prev, newResult]);

    if (quizSectionIndex < quizSections.length - 1) {
      setQuizSectionIndex(quizSectionIndex + 1);
    } else {
      // Quiz completed - show declaration (batched with setQuizSectionResults above)
      setShowQuizDeclaration(true);
    }
  };

  // Handle quiz declaration submit
  const handleQuizDeclarationSubmit = () => {
    if (!declarationChecks.honest || !declarationChecks.understand || !declarationName.trim()) {
      toast.error('Please complete all declaration fields');
      return;
    }
    
    const allPassed = quizSectionResults.every(r => r.passed);
    setQuizPassed(allPassed);
    setQuizCompleted(true);
    setShowQuizDeclaration(false);
  };

  // Form section handlers
  const handleApplicantChange = (data: Partial<ApplicantDetails>) => {
    setFormData(prev => ({ ...prev, applicant: { ...prev.applicant, ...data } }));
  };

  const handleUSIChange = (data: Partial<USIDetails>) => {
    setFormData(prev => ({ ...prev, usi: { ...prev.usi, ...data } }));
  };

  const handleEducationChange = (data: Partial<EducationDetails>) => {
    setFormData(prev => ({ ...prev, education: { ...prev.education, ...data } }));
  };

  const handleAdditionalInfoChange = (data: Partial<AdditionalInfo>) => {
    setFormData(prev => ({ ...prev, additionalInfo: { ...prev.additionalInfo, ...data } }));
  };

  const handlePrivacyTermsChange = (data: Partial<PrivacyTerms>) => {
    setFormData(prev => ({ ...prev, privacyTerms: { ...prev.privacyTerms, ...data } }));
  };

  // Validate form section
  const validateFormSection = (section: number): boolean => {
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
    }

    if (section === 2) {
      const u = formData.usi;
      if (!u.usiApply) newErrors.usiApply = 'Please select an option';
    }

    if (section === 3) {
      const e = formData.education;
      if (!e.schoolLevel) newErrors.schoolLevel = 'School level is required';
      if (!e.employmentStatus) newErrors.employmentStatus = 'Employment status is required';
    }

    if (section === 4) {
      const ai = formData.additionalInfo;
      if (!ai.countryOfBirth) newErrors.countryOfBirth = 'Country of birth is required';
    }

    if (section === 5) {
      const pt = formData.privacyTerms;
      if (!pt.acceptPrivacy) newErrors.acceptPrivacy = 'You must accept the privacy notice';
      if (!pt.acceptTerms) newErrors.acceptTerms = 'You must accept the terms';
      if (!pt.declareName) newErrors.declareName = 'Name is required';
      if (!pt.declareDate) newErrors.declareDate = 'Date is required';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormNext = () => {
    if (validateFormSection(currentFormSection)) {
      setCurrentFormSection(prev => Math.min(prev + 1, 5));
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleFormPrevious = () => {
    setCurrentFormSection(prev => Math.max(prev - 1, 1));
  };

  // Payment proof file handler
  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setPaymentProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePaymentProof = () => {
    setPaymentProofFile(null);
    setPaymentProofPreview(null);
  };

  // Map form data to request
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
      emergencyPermission: applicant.emergencyPermission || 'Yes',
      usi: usi.usi || undefined,
      usiAccessPermission: usi.usiAccessPermission,
      usiApplyThroughSTA: usi.usiApply || 'No',
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
      schoolLevel: education.schoolLevel || 'Year 12 or equivalent',
      schoolCompleteYear: education.schoolCompleteYear || '2020',
      schoolName: education.schoolName || 'N/A',
      schoolInAustralia: education.schoolInAus,
      schoolState: education.schoolState || undefined,
      schoolPostcode: education.schoolPostcode || undefined,
      schoolCountry: education.schoolCountry || undefined,
      hasPostSecondaryQualification: education.hasPostQual || 'No',
      qualificationLevels: education.qualLevels?.length ? education.qualLevels : undefined,
      qualificationDetails: education.qualDetails || undefined,
      employmentStatus: education.employmentStatus || 'Not employed',
      employerName: education.employerName || undefined,
      supervisorName: education.supervisorName || undefined,
      employerAddress: education.employerAddress || undefined,
      employerEmail: education.employerEmail || undefined,
      employerPhone: education.employerPhone || undefined,
      trainingReason: education.trainingReason || 'To get a job',
      trainingReasonOther: education.trainingReasonOther || undefined,
      countryOfBirth: additionalInfo.countryOfBirth || 'Australia',
      speaksOtherLanguage: additionalInfo.langOther || 'No',
      homeLanguage: additionalInfo.homeLanguage || undefined,
      indigenousStatus: additionalInfo.indigenousStatus || 'No',
      hasDisability: additionalInfo.hasDisability || 'No',
      disabilityTypes: additionalInfo.disabilityTypes?.length ? additionalInfo.disabilityTypes : undefined,
      disabilityNotes: additionalInfo.disabilityNotes || undefined,
      acceptedPrivacyNotice: privacyTerms.acceptPrivacy,
      acceptedTermsAndConditions: privacyTerms.acceptTerms,
      declarationName: privacyTerms.declareName,
      declarationDate: privacyTerms.declareDate,
      signatureData: privacyTerms.signatureData || '',
    };
  };

  // Calculate quiz totals
  const calculateQuizTotals = () => {
    let totalQuestions = 0;
    let totalCorrect = 0;

    quizSections.forEach((sec, index) => {
      const sectionResult = quizSectionResults[index];
      if (sectionResult) {
        totalQuestions += sec.questions.length;
        totalCorrect += sectionResult.score;
      }
    });

    return { totalQuestions, totalCorrect };
  };

  // Final submit
  const handleFinalSubmit = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setIsSubmitting(true);
    try {
      const formRequest = mapFormDataToRequest();
      // Use ref to ensure we have the latest quiz results (avoids stale closure)
      const resultsToSubmit = quizSectionResultsRef.current.length > 0 ? quizSectionResultsRef.current : quizSectionResults;
      const { totalQuestions, totalCorrect } = (() => {
        let tq = 0, tc = 0;
        quizSections.forEach((sec, index) => {
          const sr = resultsToSubmit[index];
          if (sr) {
            tq += sec.questions.length;
            tc += sr.score;
          }
        });
        return { totalQuestions: tq, totalCorrect: tc };
      })();
      const overallPercentage = totalQuestions > 0 ? parseFloat(((totalCorrect / totalQuestions) * 100).toFixed(2)) : 0;

      // Prepare quiz section results for API (bump all sections < 67% to 67%)
      const sectionResultsForApi: SubmitQuizSectionResult[] = resultsToSubmit.map((sr, index) => {
        const sectionData = quizSections[index];
        const sectionName = extractSectionName(sr.section);
        const storedPercentage = sr.percentage < 67 ? 67 : sr.percentage;
        return {
          sectionName,
          totalQuestions: sectionData?.questions.length ?? 0,
          correctAnswers: sr.score,
          sectionPercentage: storedPercentage,
          sectionPassed: true // Always true after bump (scores < 67% are bumped to 67%)
        };
      });

      // Get course price for payment amount
      const coursePrice = getSelectedCourse()?.price || 0;

      // Build the full request with quiz data and payment info
      const fullRequest: SubmitGuestQuizRequest & SubmitEnrollmentFormRequest & { 
        password: string; 
        courseId?: string; 
        courseDateId?: string; 
        paymentMethod?: string;
        transactionId?: string;
        paymentAmount?: number;
      } = {
        ...formRequest,
        password: registrationData.password,
        fullName: registrationData.fullName,
        phone: registrationData.phone,
        // Quiz data
        totalQuestions: totalQuestions,
        correctAnswers: totalCorrect,
        overallPercentage: overallPercentage,
        isPassed: quizPassed,
        declarationName: declarationName,
        sectionResults: sectionResultsForApi,
        // Course selection
        courseId: selectedCourseId,
        courseDateId: selectedCourseDateId,
        // Payment details
        paymentMethod: paymentMethod,
        transactionId: transactionId || undefined,
        paymentAmount: coursePrice,
      };

      // Submit public enrollment form (creates user + student + form + quiz + payment)
      const response = await studentEnrollmentFormService.submitPublicEnrollmentForm(fullRequest);

      if (response.success && response.data) {
        toast.success('Enrollment completed successfully!');
        onComplete({
          userId: response.data.userId,
          studentId: response.data.studentId,
          email: response.data.email,
          fullName: response.data.fullName,
        });
      } else {
        toast.error(response.message || 'Failed to submit enrollment');
      }
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit enrollment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedCourse = () => courses.find(c => c.courseId === selectedCourseId);
  const getSelectedDate = () => courseDates.find(d => d.courseDateId === selectedCourseDateId);

  // Quiz Declaration Modal
  if (showQuizDeclaration) {
    const { totalQuestions, totalCorrect } = calculateQuizTotals();
    const percentage = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(2) : '0';
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">??</span>
            <h2 className="text-2xl font-bold text-gray-800">Assessment Complete</h2>
          </div>

          {/* Results Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3">Your Results:</h3>
            <div className="space-y-2 text-sm">
              <p>Total Questions: <span className="text-blue-600 font-medium">{totalQuestions}</span></p>
              <p>Correct Answers: <span className="text-green-500 font-medium">{totalCorrect}</span></p>
              <p>Overall Percentage: <span className="text-blue-600 font-medium">{percentage}%</span></p>
            </div>
            <div className="mt-3 space-y-1">
              {quizSectionResults.map((result, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span>{result.section}</span>
                  <Badge className={result.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                    {result.percentage}% - {result.passed ? 'Passed' : 'Failed'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <h3 className="font-semibold mb-4">Declaration</h3>
          <p className="text-gray-600 mb-4">
            Before proceeding, please confirm the following:
          </p>
          
          <div className="space-y-4 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={declarationChecks.honest}
                onChange={(e) => setDeclarationChecks(prev => ({ ...prev, honest: e.target.checked }))}
                className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500 mt-0.5"
              />
              <span className="text-gray-700 text-sm">
                I completed this quiz honestly and did not cheat in any way.
              </span>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={declarationChecks.understand}
                onChange={(e) => setDeclarationChecks(prev => ({ ...prev, understand: e.target.checked }))}
                className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500 mt-0.5"
              />
              <span className="text-gray-700 text-sm">
                I understand that my score will be recorded under my name.
              </span>
            </label>
          </div>
          
          <p className="text-gray-600 mb-4 text-sm">
            Please confirm your name below and click <strong>Continue</strong> to proceed.
          </p>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 flex-1">
              <span className="font-semibold text-gray-700 text-sm">Name:</span>
              <input 
                type="text"
                value={declarationName}
                onChange={(e) => setDeclarationName(e.target.value)}
                className="border-b-2 border-gray-300 focus:border-violet-500 outline-none px-2 py-1 flex-1 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700 text-sm">Date:</span>
              <span className="border-b-2 border-gray-300 px-2 py-1 text-sm">{new Date().toLocaleDateString('en-AU')}</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleQuizDeclarationSubmit}
              disabled={!declarationChecks.honest || !declarationChecks.understand || !declarationName.trim()}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 px-8"
            >
              Continue to Enrollment Form
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="border-violet-100">
            <CardHeader className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Step 1: Registration
              </CardTitle>
              <CardDescription className="text-violet-100">
                Create your account to begin the enrollment process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={registrationData.fullName}
                  onChange={(e) => {
                    setRegistrationData({ ...registrationData, fullName: e.target.value });
                    if (registrationErrors.fullName) setRegistrationErrors({ ...registrationErrors, fullName: '' });
                  }}
                  className={registrationErrors.fullName ? 'border-red-500' : ''}
                />
                {registrationErrors.fullName && <p className="text-red-500 text-sm mt-1">{registrationErrors.fullName}</p>}
              </div>

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
                      if (registrationErrors.email) setRegistrationErrors({ ...registrationErrors, email: '' });
                    }}
                    className={registrationErrors.email ? 'border-red-500' : ''}
                  />
                  {registrationErrors.email && <p className="text-red-500 text-sm mt-1">{registrationErrors.email}</p>}
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
                      if (registrationErrors.phone) setRegistrationErrors({ ...registrationErrors, phone: '' });
                    }}
                    className={registrationErrors.phone ? 'border-red-500' : ''}
                  />
                  {registrationErrors.phone && <p className="text-red-500 text-sm mt-1">{registrationErrors.phone}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a secure password"
                    value={registrationData.password}
                    onChange={(e) => {
                      setRegistrationData({ ...registrationData, password: e.target.value });
                      if (registrationErrors.password) setRegistrationErrors({ ...registrationErrors, password: '' });
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
                {registrationErrors.password && <p className="text-red-500 text-sm mt-1">{registrationErrors.password}</p>}
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked: boolean) => {
                    setAgreedToTerms(checked);
                    if (registrationErrors.terms) setRegistrationErrors({ ...registrationErrors, terms: '' });
                  }}
                />
                <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                  I agree to the terms and conditions and understand my information will be used for enrollment purposes
                </label>
              </div>
              {registrationErrors.terms && <p className="text-red-500 text-sm">{registrationErrors.terms}</p>}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="border-violet-100">
            <CardHeader className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Step 2: Course Selection
              </CardTitle>
              <CardDescription className="text-violet-100">
                Select your course and preferred date
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <Label>Select Course <span className="text-red-500">*</span></Label>
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId} disabled={loadingCourses}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={loadingCourses ? "Loading courses..." : "Select a course"} />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.courseId} value={course.courseId}>
                        <div className="flex items-center justify-between w-full">
                          <span>{course.courseCode} - {course.courseName}</span>
                          <Badge className="ml-2">${course.price}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCourseId && (
                <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
                  <h4 className="font-semibold text-violet-900 mb-2">Selected Course</h4>
                  <p className="text-violet-700">{getSelectedCourse()?.courseName}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-violet-600">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ${getSelectedCourse()?.price}
                    </span>
                    {getSelectedCourse()?.duration && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {getSelectedCourse()?.duration}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {selectedCourseId && (
                <div>
                  <Label>Select Date <span className="text-red-500">*</span></Label>
                  <Select 
                    value={selectedCourseDateId} 
                    onValueChange={setSelectedCourseDateId} 
                    disabled={loadingDates || courseDates.length === 0}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={
                        loadingDates ? "Loading dates..." : 
                        courseDates.length === 0 ? "No dates available" : 
                        "Select a date"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {courseDates.filter(d => d.isAvailable).map(date => (
                        <SelectItem key={date.courseDateId} value={date.courseDateId}>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(date.startDate).toLocaleDateString()} - {new Date(date.endDate).toLocaleDateString()}</span>
                            {date.location && <span className="text-gray-500">({date.location})</span>}
                            <Badge variant="outline" className="ml-2">
                              {date.availableSlots} slots left
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 3:
        // Generate year options for expiry (current year + 10 years)
        const currentYear = new Date().getFullYear() % 100;
        const yearOptions = Array.from({ length: 11 }, (_, i) => {
          const year = currentYear + i;
          return year.toString().padStart(2, '0');
        });

        return (
          <Card className="border-violet-100">
            <CardHeader className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Step 3: Payment
              </CardTitle>
              <CardDescription className="text-violet-100">
                Choose your payment method and provide payment details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Order Summary */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course:</span>
                    <span className="font-medium">{getSelectedCourse()?.courseName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {getSelectedDate() && `${new Date(getSelectedDate()!.startDate).toLocaleDateString()} - ${new Date(getSelectedDate()!.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="font-semibold text-blue-900">Total:</span>
                    <span className="font-bold text-blue-900 text-lg">${getSelectedCourse()?.price}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Select Payment Method <span className="text-red-500">*</span></Label>
                <RadioGroup value={paymentMethod} onValueChange={(value) => {
                  setPaymentMethod(value);
                  setPaymentError(null); // Clear any previous errors
                }}>
                  <div className="space-y-3">
                    <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      paymentMethod === 'bank_transfer' ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          <span className="font-medium">Bank Transfer</span>
                        </div>
                        <div className="text-sm text-gray-500">Transfer to our bank account - pay later</div>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      paymentMethod === 'card' ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span className="font-medium">Credit Card - Pay Now</span>
                        </div>
                        <div className="text-sm text-gray-500">Pay securely with your card online</div>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      paymentMethod === 'direct_pay' ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <RadioGroupItem value="direct_pay" id="direct_pay" />
                      <Label htmlFor="direct_pay" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="font-medium">Direct Pay</span>
                        </div>
                        <div className="text-sm text-gray-500">Pay at the Institute </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Bank Details (shown when bank transfer selected - informational only) */}
              {paymentMethod === 'bank_transfer' && (
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h4 className="font-semibold mb-3">Bank Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank:</span>
                      <span className="font-medium">Commonwealth Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Name:</span>
                      <span className="font-medium">AIET College</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">BSB:</span>
                      <span className="font-medium">062 141</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account No:</span>
                      <span className="font-medium">10490235</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 pt-2 border-t">
                      Please use your name and course code as the payment reference.
                    </p>
                  </div>
                </div>
              )}

              {/* Credit Card Form (shown when card selected) */}
              {paymentMethod === 'card' && (
                <div className="space-y-6">
                  {/* Secure Payment Notice */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <Lock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-blue-800 font-semibold text-sm">Secure Payment</p>
                      <p className="text-blue-600 text-xs">Your card details are encrypted and secure</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-xs text-gray-600 font-medium">PCI Compliant</span>
                    </div>
                  </div>

                  {/* Card Name */}
                  <div>
                    <Label htmlFor="cardName">Name on Card <span className="text-red-500">*</span></Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="JOHN SMITH"
                      value={cardData.cardName}
                      onChange={(e) => {
                        setCardData({ ...cardData, cardName: e.target.value.toUpperCase() });
                        if (cardValidationErrors.cardName) {
                          setCardValidationErrors({ ...cardValidationErrors, cardName: '' });
                        }
                      }}
                      className={`mt-1 ${cardValidationErrors.cardName ? 'border-red-500' : ''}`}
                      disabled={paymentProcessing}
                    />
                    {cardValidationErrors.cardName && (
                      <p className="text-red-500 text-sm mt-1">{cardValidationErrors.cardName}</p>
                    )}
                  </div>

                  {/* Card Number */}
                  <div>
                    <Label htmlFor="cardNumber">Card Number <span className="text-red-500">*</span></Label>
                    <div className="relative mt-1">
                      <Input
                        id="cardNumber"
                        type="text"
                        placeholder="4111 1111 1111 1111"
                        value={cardData.cardNumber}
                        onChange={handleCardNumberChange}
                        className={`pr-16 ${cardValidationErrors.cardNumber ? 'border-red-500' : ''}`}
                        disabled={paymentProcessing}
                        maxLength={23}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {cardType === 'visa' && (
                          <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[8px] font-bold">VISA</div>
                        )}
                        {cardType === 'mastercard' && (
                          <div className="w-10 h-6 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full opacity-80"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-80 -ml-1"></div>
                          </div>
                        )}
                        {cardType === 'amex' && (
                          <div className="w-10 h-6 bg-blue-400 rounded flex items-center justify-center text-white text-[7px] font-bold">AMEX</div>
                        )}
                        {cardType === 'unknown' && cardData.cardNumber && (
                          <CreditCard className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {cardValidationErrors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">{cardValidationErrors.cardNumber}</p>
                    )}
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth">Expiry Month <span className="text-red-500">*</span></Label>
                      <Select 
                        value={cardData.expiryMonth} 
                        onValueChange={(value) => {
                          setCardData({ ...cardData, expiryMonth: value });
                          if (cardValidationErrors.expiryMonth) {
                            setCardValidationErrors({ ...cardValidationErrors, expiryMonth: '' });
                          }
                        }}
                        disabled={paymentProcessing}
                      >
                        <SelectTrigger className={`mt-1 ${cardValidationErrors.expiryMonth ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, '0');
                            return (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {cardValidationErrors.expiryMonth && (
                        <p className="text-red-500 text-sm mt-1">{cardValidationErrors.expiryMonth}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="expiryYear">Expiry Year <span className="text-red-500">*</span></Label>
                      <Select 
                        value={cardData.expiryYear} 
                        onValueChange={(value) => {
                          setCardData({ ...cardData, expiryYear: value });
                          if (cardValidationErrors.expiryYear) {
                            setCardValidationErrors({ ...cardValidationErrors, expiryYear: '' });
                          }
                        }}
                        disabled={paymentProcessing}
                      >
                        <SelectTrigger className={`mt-1 ${cardValidationErrors.expiryYear ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="YY" />
                        </SelectTrigger>
                        <SelectContent>
                          {yearOptions.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {cardValidationErrors.expiryYear && (
                        <p className="text-red-500 text-sm mt-1">{cardValidationErrors.expiryYear}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="cvv">CVV <span className="text-red-500">*</span></Label>
                      <div className="relative mt-1">
                        <Input
                          id="cvv"
                          type="password"
                          placeholder={cardType === 'amex' ? '????' : '???'}
                          value={cardData.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            const maxLength = paymentService.getCvvLength(cardType);
                            if (value.length <= maxLength) {
                              setCardData({ ...cardData, cvv: value });
                              if (cardValidationErrors.cvv) {
                                setCardValidationErrors({ ...cardValidationErrors, cvv: '' });
                              }
                            }
                          }}
                          className={cardValidationErrors.cvv ? 'border-red-500' : ''}
                          disabled={paymentProcessing}
                          maxLength={cardType === 'amex' ? 4 : 3}
                        />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {cardValidationErrors.cvv && (
                        <p className="text-red-500 text-sm mt-1">{cardValidationErrors.cvv}</p>
                      )}
                    </div>
                  </div>

                  {/* Accepted Cards */}
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-xs text-gray-500">We accept:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[8px] font-bold">VISA</div>
                      <div className="w-10 h-6 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full opacity-80"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-80 -ml-1"></div>
                      </div>
                      <div className="w-10 h-6 bg-blue-400 rounded flex items-center justify-center text-white text-[7px] font-bold">AMEX</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {paymentError && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm leading-relaxed">{paymentError}</p>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> {paymentMethod === 'card' 
                    ? 'Your card will be charged immediately. Upon successful payment, you will proceed to the LLND Assessment.'
                    : paymentMethod === 'bank_transfer' || paymentMethod === 'direct_pay'
                    ? 'You will proceed to the LLND Assessment and then the Enrollment Form. Payment can be completed later.'
                    : 'After completing the payment step, you will proceed to the LLND Assessment and then the Enrollment Form.'}
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        if (quizCompleted) {
          const { totalQuestions, totalCorrect } = calculateQuizTotals();
          const percentage = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(2) : '0';
          
          return (
            <Card className="border-violet-100">
              <CardHeader className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5" />
                  Step 4: LLND Assessment - Complete
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className={`p-6 rounded-lg text-center ${quizPassed ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${quizPassed ? 'text-green-500' : 'text-yellow-500'}`} />
                  <h3 className="text-xl font-bold mb-2">
                    {quizPassed ? 'Assessment Passed!' : 'Assessment Completed'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {quizPassed 
                      ? 'Congratulations! You have successfully passed the LLND assessment.'
                      : 'You have completed the assessment. Our team will review your results.'}
                  </p>
                  <div className="text-sm mb-4">
                    <p>Total: {totalCorrect}/{totalQuestions} ({percentage}%)</p>
                  </div>
                  <div className="space-y-2">
                    {quizSectionResults.map((result, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-white rounded text-sm">
                        <span>{result.section}</span>
                        <Badge className={result.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {result.percentage}% - {result.passed ? 'Passed' : 'Failed'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }

        return (
          <div className="space-y-4">
            <Card className="border-violet-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5" />
                  Step 4: LLND Assessment
                </CardTitle>
                <CardDescription>
                  Section {quizSectionIndex + 1} of {quizSections.length}: {quizSections[quizSectionIndex].title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={((quizSectionIndex + 1) / quizSections.length) * 100} className="h-2" />
                <div className="flex gap-2 mt-4 flex-wrap">
                  {quizSections.map((s, i) => (
                    <Badge 
                      key={s.id} 
                      variant={i < quizSectionIndex ? 'default' : i === quizSectionIndex ? 'secondary' : 'outline'}
                      className={i < quizSectionIndex ? 'bg-green-500' : ''}
                    >
                      {i + 1}. {s.id.charAt(0).toUpperCase() + s.id.slice(1)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <QuizSection
              section={quizSections[quizSectionIndex]}
              onComplete={handleQuizSectionComplete}
              onCancel={onCancel}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card className="border-violet-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileEdit className="w-5 h-5" />
                      Step 5: Enrollment Form
                    </CardTitle>
                    <CardDescription>
                      Section {currentFormSection} of 5
                    </CardDescription>
                  </div>
                  <Badge>{Math.round((currentFormSection / 5) * 100)}% Complete</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={(currentFormSection / 5) * 100} className="h-2" />
                <div className="flex justify-between mt-4">
                  {['Applicant', 'USI', 'Education', 'Additional', 'Privacy'].map((label, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentFormSection(i + 1)}
                      className={`flex flex-col items-center text-xs ${
                        currentFormSection === i + 1 ? 'text-violet-600 font-semibold' :
                        currentFormSection > i + 1 ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                        currentFormSection === i + 1 ? 'bg-violet-600 text-white' :
                        currentFormSection > i + 1 ? 'bg-green-100 text-green-600' : 'bg-gray-100'
                      }`}>
                        {currentFormSection > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className="hidden sm:block">{label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="min-h-[400px]">
              {currentFormSection === 1 && (
                <ApplicantSection data={formData.applicant} onChange={handleApplicantChange} errors={formErrors} />
              )}
              {currentFormSection === 2 && (
                <USISection data={formData.usi} onChange={handleUSIChange} errors={formErrors} />
              )}
              {currentFormSection === 3 && (
                <EducationSection data={formData.education} onChange={handleEducationChange} errors={formErrors} />
              )}
              {currentFormSection === 4 && (
                <AdditionalInfoSection data={formData.additionalInfo} onChange={handleAdditionalInfoChange} errors={formErrors} />
              )}
              {currentFormSection === 5 && (
                <PrivacyTermsSection data={formData.privacyTerms} onChange={handlePrivacyTermsChange} errors={formErrors} />
              )}
            </div>

            {/* Navigation Buttons for Form Sections 1-4 */}
            {currentFormSection < 5 && (
              <div className="pt-4 border-t flex justify-between">
                {currentFormSection > 1 && (
                  <Button variant="outline" onClick={handleFormPrevious}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
                <Button 
                  onClick={handleFormNext}
                  className={`bg-violet-600 hover:bg-violet-700 ${currentFormSection === 1 ? 'ml-auto' : ''}`}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Submit Button for Enrollment Form Step */}
            {currentFormSection === 5 && (
              <div className="pt-4 border-t">
                <Button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-6 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting Enrollment...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Complete Enrollment
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  By clicking "Complete Enrollment", you agree to our terms and conditions.
                  Your account will be created and you can log in to access your student portal.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
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
        <p className="text-gray-600">Complete all steps to enroll in your course</p>
      </div>

      {/* Progress Steps */}
      <Card className="border-violet-100">
        <CardContent className="pt-6">
          <div className="flex justify-between">
            {WIZARD_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center text-xs ${
                    currentStep === step.id ? 'text-violet-600 font-semibold' :
                    currentStep > step.id ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                    currentStep === step.id ? 'bg-violet-600 text-white' :
                    currentStep > step.id ? 'bg-green-100 text-green-600' : 'bg-gray-100'
                  }`}>
                    {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className="hidden sm:block">{step.shortTitle}</span>
                </div>
              );
            })}
          </div>
          <Progress value={(currentStep / WIZARD_STEPS.length) * 100} className="mt-4 h-2" />
        </CardContent>
      </Card>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation (for steps 1-3) */}
      {currentStep <= 3 && (
        <Card className="border-violet-100">
          <CardContent className="py-4">
            <div className="flex justify-between">
              <Button variant="ghost" onClick={onCancel}>Cancel</Button>
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handlePrevious} disabled={paymentProcessing}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600"
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : currentStep === 3 && paymentMethod === 'card' ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pay ${getSelectedCourse()?.price || 0} & Continue
                    </>
                  ) : currentStep === 3 ? (
                    'Continue to LLND Assessment'
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Navigation for step 4 (quiz completed) */}
      {currentStep === 4 && quizCompleted && (
        <Card className="border-violet-100">
          <CardContent className="py-4">
            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600"
              >
                Continue to Enrollment Form
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
