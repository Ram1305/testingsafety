import { useState } from 'react';
import { UserPlus, Search, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';

export function AdminWalkIn() {
  const [step, setStep] = useState<'search' | 'create' | 'enroll' | 'payment'>('search');
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const availableCourses = [
    { id: '1', name: 'Forklift Operator Certification', price: 450, nextBatch: 'Dec 1, 2024' },
    { id: '2', name: 'Licensed Electrician Level 1', price: 850, nextBatch: 'Dec 5, 2024' },
    { id: '3', name: 'Professional Plumber License', price: 650, nextBatch: 'Nov 28, 2024' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Walk-in Registration
        </h1>
        <p className="text-gray-600">Quick registration for walk-in students</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4">
        {['Search/Create', 'Enroll', 'Payment'].map((stepName, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              index === 0 ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            <span className={index === 0 ? 'text-violet-600' : 'text-gray-600'}>{stepName}</span>
            {index < 2 && <div className="w-12 h-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>

      {step === 'search' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Search Existing Student */}
          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle>Search Existing Student</CardTitle>
              <CardDescription>Find student by phone or email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Phone or Email</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="search" placeholder="Enter phone or email..." className="pl-10" />
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
                <Search className="w-4 h-4 mr-2" />
                Search Student
              </Button>
            </CardContent>
          </Card>

          {/* Create New Student */}
          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle>Create New Student Profile</CardTitle>
              <CardDescription>Register a new student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe"
                  value={studentData.name}
                  onChange={(e) => setStudentData({...studentData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="john@example.com"
                  value={studentData.email}
                  onChange={(e) => setStudentData({...studentData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input 
                  id="phone" 
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={studentData.phone}
                  onChange={(e) => setStudentData({...studentData, phone: e.target.value})}
                />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                onClick={() => setStep('enroll')}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create & Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'enroll' && (
        <Card className="border-violet-100">
          <CardHeader>
            <CardTitle>Select Courses</CardTitle>
            <CardDescription>Choose courses for {studentData.name || 'the student'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 rounded-lg border border-violet-100">
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="w-5 h-5 rounded" />
                  <div>
                    <div className="mb-1">{course.name}</div>
                    <p className="text-gray-600">Next batch: {course.nextBatch}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                    ${course.price}
                  </div>
                  <Badge variant="secondary">Available</Badge>
                </div>
              </div>
            ))}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep('search')}>
                Back
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                onClick={() => setStep('payment')}
              >
                Continue to Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'payment' && (
        <Card className="border-violet-100">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Process payment for selected courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-violet-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Forklift Operator Certification</span>
                <span>$450.00</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Tax (8%)</span>
                <span>$36.00</span>
              </div>
              <div className="border-t border-violet-200 pt-2 mt-2 flex justify-between">
                <span>Total Amount</span>
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  $486.00
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="h-16">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Card
                </Button>
                <Button variant="outline" className="h-16">
                  Cash
                </Button>
                <Button variant="outline" className="h-16">
                  Bank Transfer
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep('enroll')}>
                Back
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  alert('Registration completed successfully!');
                  setStep('search');
                  setStudentData({ name: '', email: '', phone: '', address: '', emergencyContact: '', emergencyPhone: '' });
                }}
              >
                Complete Registration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
