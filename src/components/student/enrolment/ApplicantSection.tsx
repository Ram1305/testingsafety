import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import type { ApplicantDetails } from '../../../types/studentEnrolment';
import { TITLE_OPTIONS, GENDER_OPTIONS, STATE_OPTIONS } from '../../../types/studentEnrolment';

interface ApplicantSectionProps {
  data: ApplicantDetails;
  onChange: (data: Partial<ApplicantDetails>) => void;
  errors: Record<string, string>;
}

export function ApplicantSection({ data, onChange, errors }: ApplicantSectionProps) {
  const handleFileChange = (field: 'docPrimaryId' | 'docSecondaryId', file: File | null) => {
    onChange({ [field]: file });
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <h2 className="text-lg font-bold text-gray-800">SECTION 1 — APPLICANT INFORMATION</h2>
      </div>

      {/* Applicant Details Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-800 mb-2">APPLICANT DETAILS</h3>
          <p className="text-sm text-gray-500 mb-6">
            Please complete <strong>full name</strong> and <strong>date of birth</strong> as listed on your ID documents.
          </p>

          <div className="grid gap-6">
            {/* Title */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Title (please tick)
                <span className="text-red-500 font-bold">*</span>
              </Label>
              <RadioGroup
                value={data.title}
                onValueChange={(value) => onChange({ title: value as ApplicantDetails['title'] })}
                className="flex flex-wrap gap-4"
              >
                {TITLE_OPTIONS.map((title) => (
                  <div key={title} className="flex items-center space-x-2">
                    <RadioGroupItem value={title} id={`title-${title}`} />
                    <Label htmlFor={`title-${title}`} className="font-normal cursor-pointer">
                      {title}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="surname" className="flex items-center gap-1">
                  Surname
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="surname"
                  value={data.surname}
                  onChange={(e) => onChange({ surname: e.target.value })}
                  className={errors.surname ? 'border-red-500' : ''}
                />
                {errors.surname && <p className="text-sm text-red-500">{errors.surname}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="givenName" className="flex items-center gap-1">
                  Given name
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="givenName"
                  value={data.givenName}
                  onChange={(e) => onChange({ givenName: e.target.value })}
                  className={errors.givenName ? 'border-red-500' : ''}
                />
                {errors.givenName && <p className="text-sm text-red-500">{errors.givenName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Middle name</Label>
                <Input
                  id="middleName"
                  value={data.middleName || ''}
                  onChange={(e) => onChange({ middleName: e.target.value })}
                />
              </div>
            </div>

            {/* Preferred Name & DOB & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredName">
                  Preferred name <span className="text-sm text-gray-500">(if different to above)</span>
                </Label>
                <Input
                  id="preferredName"
                  value={data.preferredName || ''}
                  onChange={(e) => onChange({ preferredName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob" className="flex items-center gap-1">
                  Date of Birth
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={data.dob}
                  onChange={(e) => onChange({ dob: e.target.value })}
                  className={errors.dob ? 'border-red-500' : ''}
                />
                {errors.dob && <p className="text-sm text-red-500">{errors.dob}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Gender (please tick)
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <RadioGroup
                  value={data.gender}
                  onValueChange={(value) => onChange({ gender: value as ApplicantDetails['gender'] })}
                  className="flex gap-4"
                >
                  {GENDER_OPTIONS.map((gender) => (
                    <div key={gender} className="flex items-center space-x-2">
                      <RadioGroupItem value={gender} id={`gender-${gender}`} />
                      <Label htmlFor={`gender-${gender}`} className="font-normal cursor-pointer">
                        {gender}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homePhone">Home Phone</Label>
                <Input
                  id="homePhone"
                  type="tel"
                  placeholder="(optional)"
                  value={data.homePhone || ''}
                  onChange={(e) => onChange({ homePhone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workPhone">Work Phone</Label>
                <Input
                  id="workPhone"
                  type="tel"
                  placeholder="(optional)"
                  value={data.workPhone || ''}
                  onChange={(e) => onChange({ workPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobile" className="flex items-center gap-1">
                  Mobile Phone
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={data.mobile}
                  onChange={(e) => onChange({ mobile: e.target.value })}
                  className={errors.mobile ? 'border-red-500' : ''}
                />
                {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  Email
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => onChange({ email: e.target.value })}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            {/* Residential Address */}
            <div className="space-y-2">
              <Label htmlFor="resAddress" className="flex items-center gap-1">
                Residential Address
                <span className="text-red-500 font-bold">*</span>
              </Label>
              <Input
                id="resAddress"
                value={data.resAddress}
                onChange={(e) => onChange({ resAddress: e.target.value })}
                className={errors.resAddress ? 'border-red-500' : ''}
              />
              {errors.resAddress && <p className="text-sm text-red-500">{errors.resAddress}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resSuburb" className="flex items-center gap-1">
                  Suburb
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="resSuburb"
                  value={data.resSuburb}
                  onChange={(e) => onChange({ resSuburb: e.target.value })}
                  className={errors.resSuburb ? 'border-red-500' : ''}
                />
                {errors.resSuburb && <p className="text-sm text-red-500">{errors.resSuburb}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="resState" className="flex items-center gap-1">
                  State
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Select
                  value={data.resState}
                  onValueChange={(value) => onChange({ resState: value })}
                >
                  <SelectTrigger className={errors.resState ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {STATE_OPTIONS.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.resState && <p className="text-sm text-red-500">{errors.resState}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="resPostcode" className="flex items-center gap-1">
                  Postcode
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="resPostcode"
                  value={data.resPostcode}
                  onChange={(e) => onChange({ resPostcode: e.target.value })}
                  maxLength={4}
                  pattern="\d{4}"
                  className={errors.resPostcode ? 'border-red-500' : ''}
                />
                {errors.resPostcode && <p className="text-sm text-red-500">{errors.resPostcode}</p>}
              </div>
            </div>

            {/* Postal Address Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="postalDifferent"
                checked={data.postalDifferent}
                onCheckedChange={(checked) => onChange({ postalDifferent: !!checked })}
              />
              <Label htmlFor="postalDifferent" className="font-normal cursor-pointer">
                Postal Address is different from Residential Address
              </Label>
            </div>

            {/* Postal Address (conditional) */}
            {data.postalDifferent && (
              <Card className="border border-gray-200 bg-gray-50">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-gray-700 mb-4">
                    Postal Address <span className="text-sm text-gray-500 font-normal">(if different from above)</span>
                  </h4>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postAddress" className="flex items-center gap-1">
                        Postal Address
                        <span className="text-red-500 font-bold">*</span>
                      </Label>
                      <Input
                        id="postAddress"
                        value={data.postAddress || ''}
                        onChange={(e) => onChange({ postAddress: e.target.value })}
                        className={errors.postAddress ? 'border-red-500' : ''}
                      />
                      {errors.postAddress && <p className="text-sm text-red-500">{errors.postAddress}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="postSuburb" className="flex items-center gap-1">
                          Suburb
                          <span className="text-red-500 font-bold">*</span>
                        </Label>
                        <Input
                          id="postSuburb"
                          value={data.postSuburb || ''}
                          onChange={(e) => onChange({ postSuburb: e.target.value })}
                          className={errors.postSuburb ? 'border-red-500' : ''}
                        />
                        {errors.postSuburb && <p className="text-sm text-red-500">{errors.postSuburb}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postState" className="flex items-center gap-1">
                          State
                          <span className="text-red-500 font-bold">*</span>
                        </Label>
                        <Select
                          value={data.postState || ''}
                          onValueChange={(value) => onChange({ postState: value })}
                        >
                          <SelectTrigger className={errors.postState ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {STATE_OPTIONS.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.postState && <p className="text-sm text-red-500">{errors.postState}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postPostcode" className="flex items-center gap-1">
                          Postcode
                          <span className="text-red-500 font-bold">*</span>
                        </Label>
                        <Input
                          id="postPostcode"
                          value={data.postPostcode || ''}
                          onChange={(e) => onChange({ postPostcode: e.target.value })}
                          maxLength={4}
                          pattern="\d{4}"
                          className={errors.postPostcode ? 'border-red-500' : ''}
                        />
                        {errors.postPostcode && <p className="text-sm text-red-500">{errors.postPostcode}</p>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Required Documents Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-800 mb-2">REQUIRED DOCUMENTS — ID VERIFICATION</h3>
          <p className="text-sm text-gray-500 mb-6">
            Please upload a clear copy of your identification document(s). Files must be readable.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="docPrimaryId" className="flex items-center gap-1">
                Primary Photo ID (required)
                <span className="text-red-500 font-bold">*</span>
              </Label>
              <Input
                id="docPrimaryId"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange('docPrimaryId', e.target.files?.[0] || null)}
                className={errors.docPrimaryId ? 'border-red-500' : ''}
              />
              <p className="text-sm text-gray-500">Accepted: PDF, JPG, PNG. Example: Passport / Driver Licence.</p>
              {errors.docPrimaryId && <p className="text-sm text-red-500">{errors.docPrimaryId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="docSecondaryId">Secondary ID (optional)</Label>
              <Input
                id="docSecondaryId"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange('docSecondaryId', e.target.files?.[0] || null)}
              />
              <p className="text-sm text-gray-500">
                Example: Medicare card / Birth certificate / Visa document (if applicable).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-800 mb-4">EMERGENCY CONTACT</h3>

          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyName" className="flex items-center gap-1">
                  Full Name
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="emergencyName"
                  value={data.emergencyName}
                  onChange={(e) => onChange({ emergencyName: e.target.value })}
                  className={errors.emergencyName ? 'border-red-500' : ''}
                />
                {errors.emergencyName && <p className="text-sm text-red-500">{errors.emergencyName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyRelationship" className="flex items-center gap-1">
                  Relationship
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="emergencyRelationship"
                  value={data.emergencyRelationship}
                  onChange={(e) => onChange({ emergencyRelationship: e.target.value })}
                  className={errors.emergencyRelationship ? 'border-red-500' : ''}
                />
                {errors.emergencyRelationship && <p className="text-sm text-red-500">{errors.emergencyRelationship}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactNumber" className="flex items-center gap-1">
                  Contact Number
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="emergencyContactNumber"
                  type="tel"
                  value={data.emergencyContactNumber}
                  onChange={(e) => onChange({ emergencyContactNumber: e.target.value })}
                  className={errors.emergencyContactNumber ? 'border-red-500' : ''}
                />
                {errors.emergencyContactNumber && <p className="text-sm text-red-500">{errors.emergencyContactNumber}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">Emergency permission</h4>
              <p className="text-sm text-gray-500">
                In the event of an emergency do you give STA permission to organise emergency transport and treatment and do you agree to pay all costs related to the emergency?
              </p>
              <RadioGroup
                value={data.emergencyPermission}
                onValueChange={(value) => onChange({ emergencyPermission: value as 'Yes' | 'No' })}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="emergencyPermission-yes" />
                  <Label htmlFor="emergencyPermission-yes" className="font-normal cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="emergencyPermission-no" />
                  <Label htmlFor="emergencyPermission-no" className="font-normal cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
              {errors.emergencyPermission && <p className="text-sm text-red-500">{errors.emergencyPermission}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
