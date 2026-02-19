import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function AdminReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Reports & Analytics
        </h1>
        <p className="text-gray-600">Generate and view reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Reports functionality will be available here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Advanced reporting and analytics features are under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}
