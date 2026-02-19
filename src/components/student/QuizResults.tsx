import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface QuizResultsProps {
  results: { section: string; score: number; percentage: number; passed: boolean }[];
  onClose: () => void;
}

export function QuizResults({ results, onClose }: QuizResultsProps) {
  const allPassed = results.every(r => r.passed);
  const overallScore = Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Assessment Results
        </h1>
        <p className="text-gray-600">Your pre-enrollment assessment has been completed</p>
      </div>

      {allPassed ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-900">Congratulations! You passed the assessment</AlertTitle>
          <AlertDescription className="text-green-800">
            You have successfully met the requirements to enroll in courses. You can now proceed with course enrollment.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Assessment Not Passed</AlertTitle>
          <AlertDescription>
            You did not meet the passing requirements for all sections. An administrator will review your results and may grant access to enroll in courses.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-violet-100">
        <CardHeader>
          <CardTitle>Overall Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">Average Score</span>
              <span className={`text-2xl ${allPassed ? 'text-green-600' : 'text-red-600'}`}>
                {overallScore}%
              </span>
            </div>
            <Progress 
              value={overallScore} 
              className={`h-3 ${allPassed ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-gray-700">Section Breakdown</h3>
            {results.map((result, index) => (
              <Card key={index} className={`border-2 ${result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {result.passed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <h4 className={result.passed ? 'text-green-900' : 'text-red-900'}>
                          {result.section}
                        </h4>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Score: {result.percentage}%</span>
                        <span className={result.passed ? 'text-green-700' : 'text-red-700'}>
                          {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    </div>
                    <div className={`text-2xl ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {result.percentage}%
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress 
                      value={result.percentage} 
                      className={`h-2 ${result.passed ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 space-y-2 text-sm">
            <h4 className="text-violet-900">What happens next?</h4>
            {allPassed ? (
              <ul className="space-y-1 text-violet-800 list-disc list-inside">
                <li>You can now browse and enroll in available courses</li>
                <li>After enrollment, you'll need to upload payment receipt</li>
                <li>Once payment is verified by admin, you can access your course</li>
                <li>You won't need to retake this assessment for other courses</li>
              </ul>
            ) : (
              <ul className="space-y-1 text-violet-800 list-disc list-inside">
                <li>An administrator will review your assessment results</li>
                <li>The admin may provide access to enroll despite the results</li>
                <li>You will be notified once a decision has been made</li>
                <li>Consider reviewing the areas where you scored lower</li>
              </ul>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 w-full"
          >
            Return to Courses
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
