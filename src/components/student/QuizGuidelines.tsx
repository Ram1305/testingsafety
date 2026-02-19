import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface QuizGuidelinesProps {
  onStart: () => void;
  onCancel?: () => void;
}

export function QuizGuidelines({ onStart, onCancel }: QuizGuidelinesProps) {
  const [agreedToDeclaration, setAgreedToDeclaration] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Pre-Enrollment Assessment
        </h1>
        <p className="text-gray-600">Please read the instructions carefully before starting the assessment</p>
      </div>

      <Card className="border-violet-100">
        <CardHeader className="bg-black text-white">
          <CardTitle>Safety Training Academy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div>
            <h2 className="mb-4">Important Instructions</h2>
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
            <h2 className="mb-4">Conditions of Assessment</h2>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>This test will help determine if you have the required Language, Literacy, Numeracy and Digital (LLND) skills to successfully undertake your training course.</li>
              <li>Your answers will be reviewed by an assessor, who may also contact you for a short follow-up discussion if required.</li>
              <li>If you do not meet the required skill level, support or referral options will be discussed with you.</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4">Student Declaration</h2>
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
              onCheckedChange={(checked: boolean) => setAgreedToDeclaration(checked)}
            />
            <label htmlFor="declaration" className="text-gray-700 cursor-pointer">
              I have read and agree to the conditions of assessment and student declaration above
            </label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-3">
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={onStart}
            disabled={!agreedToDeclaration}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 ml-auto"
          >
            Start Assessment
          </Button>
        </CardFooter>
      </Card>

      {!agreedToDeclaration && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please agree to the declaration to begin the assessment
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
