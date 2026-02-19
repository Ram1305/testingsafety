import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import type { USIDetails } from '../../../types/studentEnrolment';
import { USI_ID_TYPE_OPTIONS, MEDICARE_COLOR_OPTIONS } from '../../../types/studentEnrolment';

interface USISectionProps {
  data: USIDetails;
  onChange: (data: Partial<USIDetails>) => void;
  errors: Record<string, string>;
}

export function USISection({ data, onChange, errors }: USISectionProps) {
  const isApplyingThroughSTA = data.usiApply === 'Yes';

  const handleFileChange = (file: File | null) => {
    onChange({ usiIdUpload: file });
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <h2 className="text-lg font-bold text-gray-800">SECTION 2 — UNIQUE STUDENT IDENTIFIER (USI)</h2>
      </div>

      {/* USI Information Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              From 1 January 2015, an RTO can be prevented from issuing nationally recognised VET certification if you do not provide a USI.
              If you have not obtained a USI you can apply for it directly. If you already have a USI, provide it below.
            </p>
            <p>
              If you forgot your USI, you can retrieve it from the official USI site.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* USI Entry & Permission */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-800 mb-4">Unique Student Identifier (USI)</h3>

          <div className="grid gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <Label htmlFor="usi">Enter your USI (if you already have one)</Label>
                <Input
                  id="usi"
                  value={data.usi || ''}
                  onChange={(e) => onChange({ usi: e.target.value.toUpperCase() })}
                  maxLength={10}
                  placeholder="10-character USI"
                />
                <p className="text-sm text-gray-500">If you don't have one, select "Apply through STA" below.</p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="usiAccessPermission"
                  checked={data.usiAccessPermission}
                  onCheckedChange={(checked) => onChange({ usiAccessPermission: !!checked })}
                />
                <Label htmlFor="usiAccessPermission" className="font-normal cursor-pointer text-sm">
                  I give permission for Safety Training Academy to access my Unique Student Identifier (USI) for the purpose of recording my results.
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                USI application through STA (if you do not already have one)
                <span className="text-red-500 font-bold">*</span>
              </Label>
              <RadioGroup
                value={data.usiApply}
                onValueChange={(value) => onChange({ usiApply: value as 'Yes' | 'No' })}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="usiApply-no" />
                  <Label htmlFor="usiApply-no" className="font-normal cursor-pointer">
                    No (I will provide my USI)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="usiApply-yes" />
                  <Label htmlFor="usiApply-yes" className="font-normal cursor-pointer">
                    Yes (Apply through STA)
                  </Label>
                </div>
              </RadioGroup>
              {errors.usiApply && <p className="text-sm text-red-500">{errors.usiApply}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* USI Application through STA (Conditional) */}
      {isApplyingThroughSTA && (
        <Card className="border border-red-200 shadow-sm bg-red-50/30">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-red-700 mb-2">USI application through STA (if you do not already have one)</h3>
            <p className="text-sm text-gray-600 mb-6">
              If you would like STA to apply for a USI on your behalf, you must authorise us to do so and provide additional information.
            </p>

            <div className="grid gap-6">
              {/* Authorisation Name */}
              <div className="space-y-2">
                <Label htmlFor="usiAuthoriseName" className="flex items-center gap-1">
                  [Name] — authorises Safety Training Academy to apply your USI
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="usiAuthoriseName"
                  value={data.usiAuthoriseName || ''}
                  onChange={(e) => onChange({ usiAuthoriseName: e.target.value })}
                  className={errors.usiAuthoriseName ? 'border-red-500' : ''}
                />
                {errors.usiAuthoriseName && <p className="text-sm text-red-500">{errors.usiAuthoriseName}</p>}
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="usiConsent"
                  checked={data.usiConsent || false}
                  onCheckedChange={(checked) => onChange({ usiConsent: !!checked })}
                  className="mt-1"
                />
                <div>
                  <Label htmlFor="usiConsent" className="font-normal cursor-pointer flex items-center gap-1">
                    I have read and I consent to the collection, use and disclosure of my personal information to create my USI.
                    <span className="text-red-500 font-bold">*</span>
                  </Label>
                  {errors.usiConsent && <p className="text-sm text-red-500">{errors.usiConsent}</p>}
                </div>
              </div>

              {/* Birth Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="townCityBirth" className="flex items-center gap-1">
                    Town/City of Birth <span className="text-sm text-gray-500">(please write the name)</span>
                    <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    id="townCityBirth"
                    value={data.townCityBirth || ''}
                    onChange={(e) => onChange({ townCityBirth: e.target.value })}
                    className={errors.townCityBirth ? 'border-red-500' : ''}
                  />
                  {errors.townCityBirth && <p className="text-sm text-red-500">{errors.townCityBirth}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overseasCityBirth" className="flex items-center gap-1">
                    Overseas town or city where you were born
                    <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    id="overseasCityBirth"
                    value={data.overseasCityBirth || ''}
                    onChange={(e) => onChange({ overseasCityBirth: e.target.value })}
                    className={errors.overseasCityBirth ? 'border-red-500' : ''}
                  />
                  {errors.overseasCityBirth && <p className="text-sm text-red-500">{errors.overseasCityBirth}</p>}
                </div>
              </div>

              {/* Identity Verification */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">We will also need to verify your identity to create your USI.</h4>
                <p className="text-sm text-gray-500">
                  Please provide details for <strong>one</strong> form of identity and upload a clear copy of that document.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="usiIdType" className="flex items-center gap-1">
                    Select ONE identity document type
                    <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Select
                    value={data.usiIdType || ''}
                    onValueChange={(value) => onChange({ usiIdType: value })}
                  >
                    <SelectTrigger className={errors.usiIdType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {USI_ID_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.usiIdType && <p className="text-sm text-red-500">{errors.usiIdType}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usiIdUpload" className="flex items-center gap-1">
                    Upload the selected ID document
                    <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    id="usiIdUpload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className={errors.usiIdUpload ? 'border-red-500' : ''}
                  />
                  <p className="text-sm text-gray-500">This becomes required when you choose "Yes (Apply through STA)".</p>
                  {errors.usiIdUpload && <p className="text-sm text-red-500">{errors.usiIdUpload}</p>}
                </div>
              </div>

              {/* Dynamic ID Details based on selected type */}
              {data.usiIdType && (
                <Card className="border border-gray-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-gray-700 mb-4">Identity document details</h4>

                    {/* 1. Driver's Licence */}
                    {data.usiIdType === '1' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dlState" className="flex items-center gap-1">
                            State
                            <span className="text-red-500 font-bold">*</span>
                          </Label>
                          <Input
                            id="dlState"
                            value={data.dlState || ''}
                            onChange={(e) => onChange({ dlState: e.target.value })}
                            className={errors.dlState ? 'border-red-500' : ''}
                          />
                          {errors.dlState && <p className="text-sm text-red-500">{errors.dlState}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dlNumber" className="flex items-center gap-1">
                            Licence number
                            <span className="text-red-500 font-bold">*</span>
                          </Label>
                          <Input
                            id="dlNumber"
                            value={data.dlNumber || ''}
                            onChange={(e) => onChange({ dlNumber: e.target.value })}
                            className={errors.dlNumber ? 'border-red-500' : ''}
                          />
                          {errors.dlNumber && <p className="text-sm text-red-500">{errors.dlNumber}</p>}
                        </div>
                      </div>
                    )}

                    {/* 2. Medicare */}
                    {data.usiIdType === '2' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="medicareNumber" className="flex items-center gap-1">
                            Medicare card number
                            <span className="text-red-500 font-bold">*</span>
                          </Label>
                          <Input
                            id="medicareNumber"
                            value={data.medicareNumber || ''}
                            onChange={(e) => onChange({ medicareNumber: e.target.value })}
                            className={errors.medicareNumber ? 'border-red-500' : ''}
                          />
                          {errors.medicareNumber && <p className="text-sm text-red-500">{errors.medicareNumber}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="medicareIRN" className="flex items-center gap-1">
                            Individual reference number (IRN)
                            <span className="text-red-500 font-bold">*</span>
                          </Label>
                          <Input
                            id="medicareIRN"
                            value={data.medicareIRN || ''}
                            onChange={(e) => onChange({ medicareIRN: e.target.value })}
                            className={errors.medicareIRN ? 'border-red-500' : ''}
                          />
                          {errors.medicareIRN && <p className="text-sm text-red-500">{errors.medicareIRN}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="medicareColor" className="flex items-center gap-1">
                            Card colour
                            <span className="text-red-500 font-bold">*</span>
                          </Label>
                          <Select
                            value={data.medicareColor || ''}
                            onValueChange={(value) => onChange({ medicareColor: value as USIDetails['medicareColor'] })}
                          >
                            <SelectTrigger className={errors.medicareColor ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              {MEDICARE_COLOR_OPTIONS.map((color) => (
                                <SelectItem key={color} value={color}>
                                  {color}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.medicareColor && <p className="text-sm text-red-500">{errors.medicareColor}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="medicareExpiry" className="flex items-center gap-1">
                            Expiry date
                            <span className="text-red-500 font-bold">*</span>
                          </Label>
                          <Input
                            id="medicareExpiry"
                            type="date"
                            value={data.medicareExpiry || ''}
                            onChange={(e) => onChange({ medicareExpiry: e.target.value })}
                            className={errors.medicareExpiry ? 'border-red-500' : ''}
                          />
                          {errors.medicareExpiry && <p className="text-sm text-red-500">{errors.medicareExpiry}</p>}
                        </div>
                      </div>
                    )}

                    {/* 3. Birth Certificate */}
                    {data.usiIdType === '3' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="birthState" className="flex items-center gap-1">
                            State/Territory
                            <span className="text-red-500 font-bold">*</span>
                          </Label>
                          <Input
                            id="birthState"
                            value={data.birthState || ''}
                            onChange={(e) => onChange({ birthState: e.target.value })}
                            className={errors.birthState ? 'border-red-500' : ''}
                          />
                          {errors.birthState && <p className="text-sm text-red-500">{errors.birthState}</p>}
                        </div>
                      </div>
                    )}

                    {/* 4. ImmiCard */}
                    {data.usiIdType === '4' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="immiNumber" className="flex items-center gap-1">
                            ImmiCard number
                            <span className="text-red-500 font-bold">*</span>
                          </Label>
                          <Input
                            id="immiNumber"
                            value={data.immiNumber || ''}
                            onChange={(e) => onChange({ immiNumber: e.target.value })}
                            className={errors.immiNumber ? 'border-red-500' : ''}
                          />
                          {errors.immiNumber && <p className="text-sm text-red-500">{errors.immiNumber}</p>}
                        </div>
                      </div>
                    )}

                    {/* 5. Australian Passport */}
                    {data.usiIdType === '5' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ausPassportNumber" className="flex items-center gap-1">
                            Passport number
                            <span className="text-red-500 font-bold">*</span>
                          </Label>
                          <Input
                            id="ausPassportNumber"
                            value={data.ausPassportNumber || ''}
                            onChange={(e) => onChange({ ausPassportNumber: e.target.value })}
                            className={errors.ausPassportNumber ? 'border-red-500' : ''}
                          />
                          {errors.ausPassportNumber && <p className="text-sm text-red-500">{errors.ausPassportNumber}</p>}
                        </div>
                      </div>
                    )}

                    {/* 6. Non-Australian Passport */}
                    {data.usiIdType === '6' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nonAusPassportNumber" className="flex items-center gap-1">
                            Passport number
                            <span className="text-red-500 font-bold">*</span>
                          </Label>
                          <Input
                            id="nonAusPassportNumber"
                            value={data.nonAusPassportNumber || ''}
                            onChange={(e) => onChange({ nonAusPassportNumber: e.target.value })}
                            className={errors.nonAusPassportNumber ? 'border-red-500' : ''}
                          />
                          {errors.nonAusPassportNumber && <p className="text-sm text-red-500">{errors.nonAusPassportNumber}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nonAusPassportCountry" className="flex items-center gap-1">
                            Country of issue
                            <span className="text-red-500 font-bold">*</span>
                          </Label>
                          <Input
                            id="nonAusPassportCountry"
                            value={data.nonAusPassportCountry || ''}
                            onChange={(e) => onChange({ nonAusPassportCountry: e.target.value })}
                            className={errors.nonAusPassportCountry ? 'border-red-500' : ''}
                          />
                          {errors.nonAusPassportCountry && <p className="text-sm text-red-500">{errors.nonAusPassportCountry}</p>}
                        </div>
                      </div>
                    )}

                    {/* 7. Citizenship Certificate */}
                    {data.usiIdType === '7' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="citizenshipStock" className="flex items-center gap-1">
                            Stock number
                            <span className="text-red-500 font-bold">*</span>
                          </Label>
                          <Input
                            id="citizenshipStock"
                            value={data.citizenshipStock || ''}
                            onChange={(e) => onChange({ citizenshipStock: e.target.value })}
                            className={errors.citizenshipStock ? 'border-red-500' : ''}
                          />
                          {errors.citizenshipStock && <p className="text-sm text-red-500">{errors.citizenshipStock}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="citizenshipAcqDate" className="flex items-center gap-1">
                            Acquisition date
                            <span className="text-red-500 font-bold">*</span>
                          </Label>
                          <Input
                            id="citizenshipAcqDate"
                            type="date"
                            value={data.citizenshipAcqDate || ''}
                            onChange={(e) => onChange({ citizenshipAcqDate: e.target.value })}
                            className={errors.citizenshipAcqDate ? 'border-red-500' : ''}
                          />
                          {errors.citizenshipAcqDate && <p className="text-sm text-red-500">{errors.citizenshipAcqDate}</p>}
                        </div>
                      </div>
                    )}

                    {/* 8. Registration by Descent */}
                    {data.usiIdType === '8' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="descentAcqDate" className="flex items-center gap-1">
                            Acquisition date
                            <span className="text-red-500 font-bold">*</span>
                          </Label>
                          <Input
                            id="descentAcqDate"
                            type="date"
                            value={data.descentAcqDate || ''}
                            onChange={(e) => onChange({ descentAcqDate: e.target.value })}
                            className={errors.descentAcqDate ? 'border-red-500' : ''}
                          />
                          {errors.descentAcqDate && <p className="text-sm text-red-500">{errors.descentAcqDate}</p>}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
