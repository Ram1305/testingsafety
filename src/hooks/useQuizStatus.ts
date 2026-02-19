import { useState, useEffect, useCallback } from 'react';
import { quizService, type StudentQuizStatus } from '../services/quiz.service';
import { useAuth } from '../contexts/AuthContext';

interface UseQuizStatusReturn {
  quizStatus: StudentQuizStatus | null;
  isLoading: boolean;
  error: string | null;
  refreshStatus: () => Promise<void>;
  hasAttemptedQuiz: boolean;
  hasPassedQuiz: boolean;
  canEnroll: boolean;
}

export function useQuizStatus(): UseQuizStatusReturn {
  const { user } = useAuth();
  const [quizStatus, setQuizStatus] = useState<StudentQuizStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizStatus = useCallback(async () => {
    if (!user?.studentId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const status = await quizService.getStudentQuizStatus(user.studentId);
      setQuizStatus(status);
    } catch (err) {
      console.error('Error fetching quiz status:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch quiz status');
    } finally {
      setIsLoading(false);
    }
  }, [user?.studentId]);

  useEffect(() => {
    fetchQuizStatus();
  }, [fetchQuizStatus]);

  return {
    quizStatus,
    isLoading,
    error,
    refreshStatus: fetchQuizStatus,
    hasAttemptedQuiz: quizStatus?.hasAttemptedQuiz ?? false,
    hasPassedQuiz: quizStatus?.hasPassedQuiz ?? false,
    canEnroll: quizStatus?.canEnroll ?? false,
  };
}