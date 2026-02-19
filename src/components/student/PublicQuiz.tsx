import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { AlertCircle, Loader2, CheckCircle2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Progress } from '../ui/progress';
import { quizService, type SubmitGuestQuizRequest, type SubmitQuizSectionResult } from '../../services/quiz.service';
import { QuizSection } from './QuizSection';
import type { QuizSectionData } from './Quiz';

interface PublicQuizProps {
  onComplete: (result: { userId: string; studentId: string; email: string; fullName: string; isPassed: boolean }) => void;
  onCancel: () => void;
}

// Quiz sections data (same as in Quiz.tsx)
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
        type: 'dropdown',
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
        type: 'dropdown',
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

export function PublicQuiz({ onComplete, onCancel }: PublicQuizProps) {
  // Step management
  const [currentStep, setCurrentStep] = useState<'registration' | 'quiz' | 'declaration' | 'results'>('registration');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  
  // User registration form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [agreedToDeclaration, setAgreedToDeclaration] = useState(false);
  
  // Quiz state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionResults, setSectionResults] = useState<{ section: string; score: number; percentage: number; passed: boolean }[]>([]);
  
  // Declaration form state
  const [declarationChecks, setDeclarationChecks] = useState({ honest: false, understand: false });
  const [declarationName, setDeclarationName] = useState('');
  const [declarationDate] = useState(new Date().toLocaleDateString('en-AU'));
  
  // Results data
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [quizAttemptId, setQuizAttemptId] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    userId: string;
    studentId: string;
    email: string;
    fullName: string;
    isPassed: boolean;
  } | null>(null);

  const validateRegistrationForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!agreedToDeclaration) {
      errors.declaration = 'Please agree to the conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStartQuiz = () => {
    if (!validateRegistrationForm()) {
      return;
    }
    setDeclarationName(formData.fullName);
    setCurrentStep('quiz');
  };

  const handleSectionComplete = (sectionAnswers: Record<string, string>) => {
    const section = quizSections[currentSectionIndex];
    const newAnswers = { ...answers, ...sectionAnswers };
    setAnswers(newAnswers);

    // Calculate score for this section
    let correct = 0;
    section.questions.forEach(q => {
      const userAnswer = newAnswers[q.id]?.toLowerCase().trim();
      const correctAnswer = typeof q.correctAnswer === 'string' ? q.correctAnswer.toLowerCase().trim() : '';
      
      if (q.type === 'drag-drop' && userAnswer === 'completed') {
        correct++;
      } else if (userAnswer === correctAnswer) {
        correct++;
      }
    });

    const percentage = (correct / section.questions.length) * 100;
    const passed = percentage >= section.passingPercentage;

    const newResult = {
      section: section.title,
      score: correct,
      percentage: Math.round(percentage),
      passed
    };

    const updatedResults = [...sectionResults, newResult];
    setSectionResults(updatedResults);

    if (currentSectionIndex < quizSections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      let totalQ = 0;
      let totalCorrect = 0;
      
      quizSections.forEach(sec => {
        sec.questions.forEach(q => {
          totalQ++;
          const userAnswer = newAnswers[q.id]?.toLowerCase().trim();
          const correctAns = typeof q.correctAnswer === 'string' ? q.correctAnswer.toLowerCase().trim() : '';
          
          if (q.type === 'drag-drop' && userAnswer === 'completed') {
            totalCorrect++;
          } else if (userAnswer === correctAns) {
            totalCorrect++;
          }
        });
      });
      
      setTotalQuestions(totalQ);
      setCorrectAnswers(totalCorrect);
      setWrongAnswers(totalQ - totalCorrect);
      setCurrentStep('declaration');
    }
  };

  const handleDeclarationSubmit = () => {
    if (!declarationChecks.honest || !declarationChecks.understand || !declarationName.trim()) {
      return;
    }
    setCurrentStep('results');
  };

  // Submit quiz results to the API (as guest)
  const handleSubmitResults = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const passed = sectionResults.every(r => r.passed);
      const percentage = totalQuestions > 0 ? parseFloat(((correctAnswers / totalQuestions) * 100).toFixed(2)) : 0;

      const sectionResultsForApi: SubmitQuizSectionResult[] = sectionResults.map((sr, index) => {
        const sectionData = quizSections[index];
        return {
          sectionName: extractSectionName(sr.section),
          totalQuestions: sectionData?.questions.length || sr.score,
          correctAnswers: sr.score,
          sectionPercentage: sr.percentage,
          sectionPassed: sr.passed
        };
      });

      const request: SubmitGuestQuizRequest = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        totalQuestions: totalQuestions,
        correctAnswers: correctAnswers,
        overallPercentage: percentage,
        isPassed: passed,
        declarationName: declarationName,
        sectionResults: sectionResultsForApi
      };

      console.log('Submitting guest quiz request:', request);

      const result = await quizService.submitGuestQuiz(request);

      if (result.success) {
        setQuizAttemptId(result.quizAttemptId);
        setSubmissionResult({
          userId: result.userId,
          studentId: result.studentId,
          email: result.email,
          fullName: result.fullName,
          isPassed: result.isPassed
        });
        console.log('Guest quiz submitted successfully. User ID:', result.userId, 'Student ID:', result.studentId);
      } else {
        setSubmitError(result.message || 'Failed to submit quiz results. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting guest quiz:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while submitting your quiz. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToPortal = () => {
    if (submissionResult) {
      onComplete(submissionResult);
    }
  };

  // Registration + Guidelines Step
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
            Pre-Enrollment Assessment
          </h1>
          <p className="text-gray-600">Complete your registration and the assessment to continue</p>
        </div>

        <Card className="border-violet-100">
          <CardHeader className="bg-black text-white">
            <CardTitle>Safety Training Academy - LLND Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Registration Form */}
            <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-lg p-6 border border-violet-200">
              <h2 className="text-xl font-semibold mb-4 text-violet-900">Your Details</h2>
              <p className="text-gray-600 mb-4 text-sm">Please fill in your details to create your account before starting the assessment.</p>
              
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <Label htmlFor="fullName">Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (validationErrors.fullName) {
                        setValidationErrors({ ...validationErrors, fullName: '' });
                      }
                    }}
                    className={`mt-1 ${validationErrors.fullName ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
                  )}
                </div>

                {/* Email and Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (validationErrors.email) {
                          setValidationErrors({ ...validationErrors, email: '' });
                        }
                      }}
                      className={`mt-1 ${validationErrors.email ? 'border-red-500' : ''}`}
                    />
                    {validationErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone<span className="text-red-500">*</span></Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+61 xxx xxx xxx"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (validationErrors.phone) {
                          setValidationErrors({ ...validationErrors, phone: '' });
                        }
                      }}
                      className={`mt-1 ${validationErrors.phone ? 'border-red-500' : ''}`}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">Password<span className="text-red-500">*</span></Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (validationErrors.password) {
                          setValidationErrors({ ...validationErrors, password: '' });
                        }
                      }}
                      className={`pr-12 ${validationErrors.password ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Important Instructions</h2>
              <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                <li>This is an editable online document. Please type your answers directly into the spaces provided.</li>
                <li>If you run out of space for your answers, the text box will expand.</li>
                <li>Please ensure your answers are clear and complete before submission.</li>
                <li>You should allocate approximately 15 minutes to complete the test once you begin.</li>
                <li>Internet access is permitted for the Digital Literacy section (Safety First Training task).</li>
                <li>This test must be completed in English only.</li>
                <li>You can check your answers before submitting.</li>
                <li>Some questions may have more than one correct answer.</li>
                <li>Your results will be emailed to your trainer.</li>
                <li>You will also receive your test results by email.</li>
                <li>To PASS you must get 2 out of 3 or 66% correct for each core skill.</li>
              </ol>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Conditions of Assessment</h2>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>This test will help determine if you have the required Language, Literacy, Numeracy and Digital (LLND) skills to successfully undertake your training course.</li>
                <li>Your answers will be reviewed by an assessor, who may also contact you for a short follow-up discussion if required.</li>
                <li>If you do not meet the required skill level, support or referral options will be discussed with you.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Student Declaration</h2>
              <div className="bg-violet-50 rounded-lg p-4 space-y-2">
                <p className="text-gray-700">By completing and submitting this assessment, I confirm that:</p>
                <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                  <li>I have completed this assessment independently and without help from others.</li>
                  <li>The work is my own and is not copied from another person.</li>
                  <li>I understand that providing false or misleading information may affect my enrolment.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <Checkbox 
                id="declaration" 
                checked={agreedToDeclaration}
                onCheckedChange={(checked: boolean) => {
                  setAgreedToDeclaration(checked);
                  if (validationErrors.declaration) {
                    setValidationErrors({ ...validationErrors, declaration: '' });
                  }
                }}
              />
              <label htmlFor="declaration" className="text-gray-700 cursor-pointer">
                I have read and agree to the conditions of assessment and student declaration above
              </label>
            </div>
            {validationErrors.declaration && (
              <p className="text-red-500 text-sm">{validationErrors.declaration}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleStartQuiz}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
            >
              Start Assessment
            </Button>
          </CardFooter>
        </Card>

        {!agreedToDeclaration && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fill in your details and agree to the declaration to begin the assessment
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  // Declaration Modal
  if (currentStep === 'declaration') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">??</span>
            <h2 className="text-2xl font-bold text-gray-800">Declaration</h2>
          </div>
          
          <p className="text-gray-600 mb-6">Before viewing your result, please confirm the following:</p>
          
          <div className="space-y-4 mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={declarationChecks.honest}
                onChange={(e) => setDeclarationChecks(prev => ({ ...prev, honest: e.target.checked }))}
                className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-gray-700">I completed this quiz honestly and did not cheat in any way.</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={declarationChecks.understand}
                onChange={(e) => setDeclarationChecks(prev => ({ ...prev, understand: e.target.checked }))}
                className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-gray-700">I understand that my score will be recorded under my name.</span>
            </label>
          </div>
          
          <p className="text-gray-600 mb-4">Please enter your full name below and click <strong>Submit</strong> to proceed.</p>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Name:</span>
              <input 
                type="text"
                value={declarationName}
                onChange={(e) => setDeclarationName(e.target.value)}
                className="border-b-2 border-gray-300 focus:border-violet-500 outline-none px-2 py-1 w-40"
                placeholder=""
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Date</span>
              <span className="border-b-2 border-gray-300 px-2 py-1">{declarationDate}</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleDeclarationSubmit}
              disabled={!declarationChecks.honest || !declarationChecks.understand || !declarationName.trim()}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 px-8 py-3"
            >
              Submit Form
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results Step
  if (currentStep === 'results') {
    const percentage = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : '0';
    const passed = sectionResults.every(r => r.passed);
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-violet-100">
          <CardHeader className="bg-black text-white">
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="py-8 space-y-6">
            <div className="text-center">
              <span className={`text-xl font-bold ${passed ? 'text-green-500' : 'text-red-500'}`}>
                {passed ? 'Your Attempt has been Passed' : 'Your Attempt has been Failed'}
              </span>
            </div>
            
            <div className="space-y-1">
              <p><strong>NAME:</strong> {declarationName}</p>
              <p><strong>EMAIL:</strong> {formData.email}</p>
            </div>
            
            <div className="space-y-2">
              <p>Total Questions: <span className="text-blue-600">{totalQuestions}</span></p>
              <p>Wrong Answers: <span className="text-red-500">{wrongAnswers}</span></p>
              <p>Right Answers: <span className="text-green-500">{correctAnswers}</span></p>
            </div>
            
            <div>
              <p>Percentage: <span className="text-blue-600">{percentage}%</span></p>
            </div>

            {/* Section-wise Results */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Section-wise Results:</h3>
              <div className="space-y-2">
                {sectionResults.map((result, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{result.section}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{result.score}/{quizSections[index]?.questions.length || 0}</span>
                      <span className={`text-sm font-semibold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                        {result.percentage}%
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${result.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {result.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Alert */}
            {submitError && (
              <Alert variant="destructive">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            {/* Success message if submitted */}
            {quizAttemptId && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Account Created & Quiz Submitted!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your account has been created and quiz results saved. 
                  Click the button below to access your student portal.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            {!quizAttemptId ? (
              <Button 
                onClick={handleSubmitResults}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account & Submitting...
                  </>
                ) : (
                  'Submit & Create Account'
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleGoToPortal}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Go to Student Portal
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Quiz sections
  const currentSection = quizSections[currentSectionIndex];
  const progress = ((currentSectionIndex + 1) / quizSections.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Pre-Enrollment Assessment
        </h1>
        <p className="text-gray-600">Complete all sections to finish your registration</p>
      </div>

      {/* Progress */}
      <Card className="border-violet-100">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-lg">Progress</CardTitle>
            <span className="text-gray-600">Section {currentSectionIndex + 1} of {quizSections.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {quizSections.map((section, index) => (
              <div key={section.id} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentSectionIndex
                    ? 'bg-green-100 text-green-700'
                    : index === currentSectionIndex
                    ? 'bg-violet-100 text-violet-700'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {index < currentSectionIndex ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className="text-sm text-gray-600 hidden md:inline">
                  {section.title.replace('Section ' + (index + 1) + ': ', '')}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Section */}
      <QuizSection
        section={currentSection}
        onComplete={handleSectionComplete}
        onCancel={onCancel}
      />
    </div>
  );
}
