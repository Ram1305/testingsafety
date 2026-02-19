import { Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  onNavigateToLanding?: () => void;
}

export function AdminDashboard({ onNavigate, onNavigateToLanding }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your institute</p>
      </div>

      {/* Quick Actions */}
      <Card className="border-violet-100 bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {onNavigateToLanding && (
            <Button 
              variant="secondary" 
              className="w-full justify-start"
              onClick={onNavigateToLanding}
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Landing Page
            </Button>
          )}
          <Button 
            variant="secondary" 
            className="w-full justify-start"
            onClick={() => onNavigate('students')}
          >
            Walk-in Registration
          </Button>
          <Button 
            variant="secondary" 
            className="w-full justify-start"
            onClick={() => onNavigate('courses')}
          >
            Add New Course
          </Button>
          <Button 
            variant="secondary" 
            className="w-full justify-start"
            onClick={() => onNavigate('reports')}
          >
            Generate Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
