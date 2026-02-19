import { Clock } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export function AdminCertificates() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Certificate Management
        </h1>
        <p className="text-gray-600">Issue and manage student certificates</p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="pt-6 flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-amber-900">🚀 Coming Soon!</div>
            <p className="text-amber-800 text-sm">
              The certificate management system will be fully implemented in the next update. All features including certificate issuance, approval workflow, and management will be available shortly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
