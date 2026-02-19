import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Checkbox } from '../../ui/checkbox';
import { Textarea } from '../../ui/textarea';
import type { EducationDetails } from '../../../types/studentEnrolment';
import {
  SCHOOL_LEVEL_OPTIONS,
  QUALIFICATION_LEVELS,
  EMPLOYMENT_STATUS_OPTIONS,
  TRAINING_REASON_OPTIONS,
} from '../../../types/studentEnrolment';

interface EducationSectionProps {
  data: EducationDetails;
  onChange: (data: Partial<EducationDetails>) => void;
  errors: Record<string, string>;
}

export function EducationSection({ data, onChange, errors }: EducationSectionProps) {
  const handleQualLevelChange = (level: string, checked: boolean) => {
    const currentLevels = data.qualLevels || [];
    if (checked) {
      onChange({ qualLevels: [...currentLevels, level] });
    } else {
      onChange({ qualLevels: currentLevels.filter((l) => l !== level) });
    }
  };

  const handleFileChange = (file: File | null) => {
    onChange({ qualEvidenceUpload: file });
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <h2 className="text-lg font-bold text-gray-800">SECTION 3 — EDUCATION AND EMPLOYMENT INFORMATION</h2>
      </div>

      {/* AVETMISS Info */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-800">AVETMISS Data Collection</h3>
          <p className="text-sm text-gray-500">
            Information collected in this section is used for National reporting and planning.
            Please complete all sections.
          </p>
        </CardContent>
      </Card>

      {/* Prior Education */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-800 mb-2">PRIOR EDUCATION</h3>
          <p className="text-sm text-gray-500 mb-4">What was your highest completed level at school?</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4">
            <RadioGroup
              value={data.schoolLevel}
              onValueChange={(value) => onChange({ schoolLevel: value })}
              className="space-y-2"
            >
              {SCHOOL_LEVEL_OPTIONS.slice(0, 3).map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`school-${option.value}`} />
                  <Label htmlFor={`school-${option.value}`} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <RadioGroup
              value={data.schoolLevel}
              onValueChange={(value) => onChange({ schoolLevel: value })}
              className="space-y-2"
            >
              {SCHOOL_LEVEL_OPTIONS.slice(3).map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`school-${option.value}`} />
                  <Label htmlFor={`school-${option.value}`} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          {errors.schoolLevel && <p className="text-sm text-red-500 mb-4">{errors.schoolLevel}</p>}

          <hr className="my-4" />

          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schoolCompleteYear" className="flex items-center gap-1">
                  Year completed
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="schoolCompleteYear"
                  type="number"
                  min={1950}
                  max={2100}
                  value={data.schoolCompleteYear}
                  onChange={(e) => onChange({ schoolCompleteYear: e.target.value })}
                  className={errors.schoolCompleteYear ? 'border-red-500' : ''}
                />
                {errors.schoolCompleteYear && <p className="text-sm text-red-500">{errors.schoolCompleteYear}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="schoolName">Name of School (optional)</Label>
                <Input
                  id="schoolName"
                  value={data.schoolName}
                  onChange={(e) => onChange({ schoolName: e.target.value })}
                  className={errors.schoolName ? 'border-red-500' : ''}
                />
                {errors.schoolName && <p className="text-sm text-red-500">{errors.schoolName}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="schoolInAus"
                checked={data.schoolInAus}
                onCheckedChange={(checked) => onChange({ schoolInAus: !!checked })}
              />
              <Label htmlFor="schoolInAus" className="font-normal cursor-pointer">
                School was in Australia
              </Label>
            </div>
            <p className="text-sm text-gray-500 -mt-2">Uncheck if the school was not in Australia.</p>

            {data.schoolInAus ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolState" className="flex items-center gap-1">
                    State
                    <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    id="schoolState"
                    value={data.schoolState || ''}
                    onChange={(e) => onChange({ schoolState: e.target.value })}
                    className={errors.schoolState ? 'border-red-500' : ''}
                  />
                  {errors.schoolState && <p className="text-sm text-red-500">{errors.schoolState}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolPostcode" className="flex items-center gap-1">
                    Postcode
                    <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    id="schoolPostcode"
                    value={data.schoolPostcode || ''}
                    onChange={(e) => onChange({ schoolPostcode: e.target.value })}
                    maxLength={4}
                    pattern="\d{4}"
                    className={errors.schoolPostcode ? 'border-red-500' : ''}
                  />
                  {errors.schoolPostcode && <p className="text-sm text-red-500">{errors.schoolPostcode}</p>}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="schoolCountry" className="flex items-center gap-1">
                  Country (if overseas)
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="schoolCountry"
                  value={data.schoolCountry || ''}
                  onChange={(e) => onChange({ schoolCountry: e.target.value })}
                  className={errors.schoolCountry ? 'border-red-500' : ''}
                />
                {errors.schoolCountry && <p className="text-sm text-red-500">{errors.schoolCountry}</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Qualifications */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-800 mb-2">QUALIFICATIONS</h3>
          <p className="text-sm text-gray-500 mb-4">
            Do you have post-secondary or vocational/trade qualifications?
          </p>

          <RadioGroup
            value={data.hasPostQual}
            onValueChange={(value) => onChange({ hasPostQual: value as 'Yes' | 'No' })}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="postQual-yes" />
              <Label htmlFor="postQual-yes" className="font-normal cursor-pointer">
                Yes — I will provide evidence
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="postQual-no" />
              <Label htmlFor="postQual-no" className="font-normal cursor-pointer">
                No
              </Label>
            </div>
          </RadioGroup>
          {errors.hasPostQual && <p className="text-sm text-red-500 mt-2">{errors.hasPostQual}</p>}

          {data.hasPostQual === 'Yes' && (
            <Card className="border border-gray-200 mt-4">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-gray-700 mb-4">Qualification Level(s)</h4>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4">
                  <div className="space-y-2">
                    {QUALIFICATION_LEVELS.slice(0, 4).map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`qual-${level}`}
                          checked={data.qualLevels?.includes(level) || false}
                          onCheckedChange={(checked) => handleQualLevelChange(level, !!checked)}
                        />
                        <Label htmlFor={`qual-${level}`} className="font-normal cursor-pointer">
                          {level === 'Bachelor or Higher' ? 'Bachelor Degree or Higher' :
                           level === 'Advanced Diploma' ? 'Advanced Diploma / Associate Degree' : level}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {QUALIFICATION_LEVELS.slice(4).map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`qual-${level}`}
                          checked={data.qualLevels?.includes(level) || false}
                          onCheckedChange={(checked) => handleQualLevelChange(level, !!checked)}
                        />
                        <Label htmlFor={`qual-${level}`} className="font-normal cursor-pointer">
                          {level === 'Other' ? 'Other / Overseas' : level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="qualDetails">Qualification details (optional)</Label>
                  <Textarea
                    id="qualDetails"
                    value={data.qualDetails || ''}
                    onChange={(e) => onChange({ qualDetails: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualEvidenceUpload" className="flex items-center gap-1">
                    Upload qualification evidence
                    <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    id="qualEvidenceUpload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className={errors.qualEvidenceUpload ? 'border-red-500' : ''}
                  />
                  <p className="text-sm text-gray-500">
                    Certificate, Statement of Attainment, Transcript, or overseas equivalent.
                  </p>
                  {errors.qualEvidenceUpload && <p className="text-sm text-red-500">{errors.qualEvidenceUpload}</p>}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Employment Status */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-800 mb-4">EMPLOYMENT STATUS</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <RadioGroup
              value={data.employmentStatus}
              onValueChange={(value) => onChange({ employmentStatus: value })}
              className="space-y-2"
            >
              {EMPLOYMENT_STATUS_OPTIONS.slice(0, 3).map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`emp-${option.value}`} />
                  <Label htmlFor={`emp-${option.value}`} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <RadioGroup
              value={data.employmentStatus}
              onValueChange={(value) => onChange({ employmentStatus: value })}
              className="space-y-2"
            >
              {EMPLOYMENT_STATUS_OPTIONS.slice(3).map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`emp-${option.value}`} />
                  <Label htmlFor={`emp-${option.value}`} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          {errors.employmentStatus && <p className="text-sm text-red-500 mt-2">{errors.employmentStatus}</p>}
        </CardContent>
      </Card>

      {/* Employment Details */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-800 mb-4">EMPLOYMENT DETAILS (if applicable)</h3>

          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employerName">Employer name</Label>
                <Input
                  id="employerName"
                  value={data.employerName || ''}
                  onChange={(e) => onChange({ employerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervisorName">Supervisor name</Label>
                <Input
                  id="supervisorName"
                  value={data.supervisorName || ''}
                  onChange={(e) => onChange({ supervisorName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employerAddress">Workplace address</Label>
              <Input
                id="employerAddress"
                value={data.employerAddress || ''}
                onChange={(e) => onChange({ employerAddress: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employerEmail">Email</Label>
                <Input
                  id="employerEmail"
                  type="email"
                  value={data.employerEmail || ''}
                  onChange={(e) => onChange({ employerEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employerPhone">Phone</Label>
                <Input
                  id="employerPhone"
                  type="tel"
                  value={data.employerPhone || ''}
                  onChange={(e) => onChange({ employerPhone: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reason for Training */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-800 mb-4">REASON FOR UNDERTAKING TRAINING / RPL</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <RadioGroup
              value={data.trainingReason}
              onValueChange={(value) => onChange({ trainingReason: value })}
              className="space-y-2"
            >
              {TRAINING_REASON_OPTIONS.slice(0, 3).map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`reason-${option.value}`} />
                  <Label htmlFor={`reason-${option.value}`} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <RadioGroup
              value={data.trainingReason}
              onValueChange={(value) => onChange({ trainingReason: value })}
              className="space-y-2"
            >
              {TRAINING_REASON_OPTIONS.slice(3).map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`reason-${option.value}`} />
                  <Label htmlFor={`reason-${option.value}`} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          {errors.trainingReason && <p className="text-sm text-red-500 mt-2">{errors.trainingReason}</p>}

          {data.trainingReason === 'Other' && (
            <div className="space-y-2 mt-4">
              <Label htmlFor="trainingReasonOther" className="flex items-center gap-1">
                Other — details
                <span className="text-red-500 font-bold">*</span>
              </Label>
              <Input
                id="trainingReasonOther"
                value={data.trainingReasonOther || ''}
                onChange={(e) => onChange({ trainingReasonOther: e.target.value })}
                className={errors.trainingReasonOther ? 'border-red-500' : ''}
              />
              {errors.trainingReasonOther && <p className="text-sm text-red-500">{errors.trainingReasonOther}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
