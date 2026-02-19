import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Textarea } from '../../ui/textarea';
import type { AdditionalInfo } from '../../../types/studentEnrolment';
import { INDIGENOUS_STATUS_OPTIONS, DISABILITY_TYPES } from '../../../types/studentEnrolment';

interface AdditionalInfoSectionProps {
  data: AdditionalInfo;
  onChange: (data: Partial<AdditionalInfo>) => void;
  errors: Record<string, string>;
}

export function AdditionalInfoSection({ data, onChange, errors }: AdditionalInfoSectionProps) {
  const handleDisabilityTypeChange = (type: string, checked: boolean) => {
    const currentTypes = data.disabilityTypes || [];
    if (checked) {
      onChange({ disabilityTypes: [...currentTypes, type] });
    } else {
      onChange({ disabilityTypes: currentTypes.filter((t) => t !== type) });
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <h2 className="text-lg font-bold text-gray-800">SECTION 4 — ADDITIONAL INFORMATION</h2>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="grid gap-6">
            {/* Country of Birth */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="countryOfBirth" className="flex items-center gap-1">
                  Country of Birth
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="countryOfBirth"
                  value={data.countryOfBirth}
                  onChange={(e) => onChange({ countryOfBirth: e.target.value })}
                  className={errors.countryOfBirth ? 'border-red-500' : ''}
                />
                {errors.countryOfBirth && <p className="text-sm text-red-500">{errors.countryOfBirth}</p>}
              </div>

              {/* Language Other Than English */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Do you speak a language other than English at home?
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <RadioGroup
                  value={data.langOther}
                  onValueChange={(value) => onChange({ langOther: value as 'Yes' | 'No' })}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="langOther-no" />
                    <Label htmlFor="langOther-no" className="font-normal cursor-pointer">
                      No
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="langOther-yes" />
                    <Label htmlFor="langOther-yes" className="font-normal cursor-pointer">
                      Yes
                    </Label>
                  </div>
                </RadioGroup>
                {errors.langOther && <p className="text-sm text-red-500">{errors.langOther}</p>}
              </div>
            </div>

            {/* Home Language (conditional) */}
            {data.langOther === 'Yes' && (
              <div className="space-y-2">
                <Label htmlFor="homeLanguage" className="flex items-center gap-1">
                  Language (if Yes)
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="homeLanguage"
                  value={data.homeLanguage || ''}
                  onChange={(e) => onChange({ homeLanguage: e.target.value })}
                  className={errors.homeLanguage ? 'border-red-500' : ''}
                />
                {errors.homeLanguage && <p className="text-sm text-red-500">{errors.homeLanguage}</p>}
              </div>
            )}

            {/* Indigenous Status & Disability */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="indigenousStatus" className="flex items-center gap-1">
                  Indigenous Status
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Select
                  value={data.indigenousStatus}
                  onValueChange={(value) => onChange({ indigenousStatus: value })}
                >
                  <SelectTrigger className={errors.indigenousStatus ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIGENOUS_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.indigenousStatus && <p className="text-sm text-red-500">{errors.indigenousStatus}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Do you consider yourself to have a disability, impairment or long-term condition?
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <RadioGroup
                  value={data.hasDisability}
                  onValueChange={(value) => onChange({ hasDisability: value as 'Yes' | 'No' })}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="hasDisability-no" />
                    <Label htmlFor="hasDisability-no" className="font-normal cursor-pointer">
                      No
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="hasDisability-yes" />
                    <Label htmlFor="hasDisability-yes" className="font-normal cursor-pointer">
                      Yes
                    </Label>
                  </div>
                </RadioGroup>
                {errors.hasDisability && <p className="text-sm text-red-500">{errors.hasDisability}</p>}
              </div>
            </div>

            {/* Disability Supplement (conditional) */}
            {data.hasDisability === 'Yes' && (
              <Card className="border border-gray-200 bg-gray-50">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Disability Supplement (if Yes)</h4>
                  <p className="text-sm text-gray-500 mb-4">Select all that apply.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    <div className="space-y-2">
                      {DISABILITY_TYPES.slice(0, 4).map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`disability-${type}`}
                            checked={data.disabilityTypes?.includes(type) || false}
                            onCheckedChange={(checked) => handleDisabilityTypeChange(type, !!checked)}
                          />
                          <Label htmlFor={`disability-${type}`} className="font-normal cursor-pointer">
                            {type === 'Hearing/deafness' ? 'Hearing / deafness' : type}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {DISABILITY_TYPES.slice(4).map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`disability-${type}`}
                            checked={data.disabilityTypes?.includes(type) || false}
                            onCheckedChange={(checked) => handleDisabilityTypeChange(type, !!checked)}
                          />
                          <Label htmlFor={`disability-${type}`} className="font-normal cursor-pointer">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="disabilityNotes">Other / Notes</Label>
                    <Textarea
                      id="disabilityNotes"
                      value={data.disabilityNotes || ''}
                      onChange={(e) => onChange({ disabilityNotes: e.target.value })}
                      rows={2}
                      placeholder="If you need support adjustments, describe them here."
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
