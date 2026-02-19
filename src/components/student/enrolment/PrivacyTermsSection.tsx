import { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Checkbox } from '../../ui/checkbox';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { AlertTriangle } from 'lucide-react';
import type { PrivacyTerms } from '../../../types/studentEnrolment';

interface PrivacyTermsSectionProps {
  data: PrivacyTerms;
  onChange: (data: Partial<PrivacyTerms>) => void;
  errors: Record<string, string>;
}

export function PrivacyTermsSection({ data, onChange, errors }: PrivacyTermsSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasInk, setHasInk] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Fit canvas to CSS size
  const fitCanvasToSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000';
  }, []);

  useEffect(() => {
    fitCanvasToSize();
    window.addEventListener('resize', fitCanvasToSize);
    return () => window.removeEventListener('resize', fitCanvasToSize);
  }, [fitCanvasToSize]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    lastPos.current = getPos(e);
    e.preventDefault();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPos.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPos.current = pos;
    setHasInk(true);
    e.preventDefault();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (canvas && hasInk) {
      onChange({ signatureData: canvas.toDataURL('image/png') });
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fitCanvasToSize();
    setHasInk(false);
    lastPos.current = null;
    onChange({ signatureData: '' });
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <h2 className="text-lg font-bold text-gray-800">SECTION 5 — PRIVACY NOTICE, TERMS & ONLINE SIGNATURE</h2>
      </div>

      {/* Warning Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-amber-800 text-sm">
          Please read the Privacy Notice and Terms & Conditions. You must accept them before submitting.
        </p>
      </div>

      {/* Privacy Notice */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-800 mb-4">Privacy Notice</h3>
          <ScrollArea className="h-[280px] border border-gray-200 rounded-lg p-4 bg-white">
            <div className="text-sm text-gray-600 space-y-4 pr-4">
              <div>
                <strong>Why we collect your personal information</strong>
                <p className="mt-1">
                  As a registered training organisation (RTO), we collect your personal information so we can process and manage your enrolment in vocational education and training (VET) course(s).
                </p>
              </div>

              <div>
                <strong>How we use your personal information</strong>
                <p className="mt-1">
                  We use your personal information to enable us to deliver VET courses to you and, otherwise, as needed, to comply with our obligations as an RTO.
                </p>
              </div>

              <div>
                <strong>How we disclose your personal information</strong>
                <p className="mt-1">
                  We are required by law (under the National Vocational Education and Training Regulator Act 2011 (Cth)) to disclose the personal information we collect to the National VET Data Collection kept by the National Centre for Vocational Education Research (NCVER).
                  NCVER is responsible for collecting, managing, analysing and communicating research and statistics about the Australian VET sector.
                  We are also authorised by law (under the NVETR Act) to disclose your personal information to relevant State/Territory training authorities.
                </p>
              </div>

              <div>
                <strong>How the NCVER and other bodies handle your personal information</strong>
                <p className="mt-1">
                  NCVER will collect, hold, use and disclose your personal information in accordance with the law, including the Privacy Act 1988 (Cth) and the NVETR Act.
                  Your information may be used for purposes including administration of VET, facilitating statistics and research, and understanding how the VET market operates.
                </p>
              </div>

              <div>
                <strong>Surveys</strong>
                <p className="mt-1">
                  You may receive a student survey conducted by or on behalf of government departments or NCVER. You may opt out at the time of being contacted.
                </p>
              </div>

              <div>
                <strong>Contact information</strong>
                <p className="mt-1">
                  Safety Training Academy — Maria Hajjar<br />
                  0439 007 746<br />
                  maria@safetytrainingacademy.edu.au
                </p>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-800 mb-4">Terms & Conditions (Key Policies)</h3>
          <ScrollArea className="h-[280px] border border-gray-200 rounded-lg p-4 bg-white">
            <div className="text-sm text-gray-600 space-y-4 pr-4">
              <div>
                <strong>Complaints & Appeals</strong>
                <p className="mt-1">
                  Complaints are recorded and managed through STA's complaints process. If not resolved, you may lodge an appeal.
                  Appeals may progress to independent mediation (e.g., National Training Complaints Hotline / Ombudsman pathways where applicable).
                </p>
              </div>

              <div>
                <strong>Reassessment</strong>
                <p className="mt-1">
                  If you believe an assessment outcome is unfair, first discuss with your assessor. If unresolved, follow the formal appeals process.
                  STA may require evidence, and independent reassessment may be arranged where necessary.
                </p>
              </div>

              <div>
                <strong>Consumer Guarantee</strong>
                <p className="mt-1">
                  STA will provide training and assessment with due care and skill, fit for purpose, and within a reasonable timeframe.
                </p>
              </div>

              <div>
                <strong>Change to agreed services</strong>
                <p className="mt-1">
                  Changes may occur due to course/practical requirements, third party arrangements, or ownership changes.
                  Where possible, STA will notify affected learners.
                </p>
              </div>

              <div>
                <strong>Credit Transfer / RPL</strong>
                <p className="mt-1">
                  Credit Transfer may be granted for equivalent units with verified evidence. RPL requires evidence of competence.
                </p>
              </div>

              <div>
                <strong>Language, Literacy and Numeracy (LLN)</strong>
                <p className="mt-1">
                  Learners may be assessed for LLN needs. Support may be provided or referrals made where appropriate.
                </p>
              </div>

              <div>
                <strong>Important information</strong>
                <p className="mt-1">
                  By signing this form, you confirm the information provided is correct and you agree to STA policies and procedures.
                </p>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Acceptance Checkboxes */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptPrivacy"
              checked={data.acceptPrivacy}
              onCheckedChange={(checked) => onChange({ acceptPrivacy: !!checked })}
              className="mt-1"
            />
            <div>
              <Label htmlFor="acceptPrivacy" className="font-normal cursor-pointer flex items-center gap-1">
                I have read and understood the Privacy Notice.
                <span className="text-red-500 font-bold">*</span>
              </Label>
              {errors.acceptPrivacy && <p className="text-sm text-red-500">{errors.acceptPrivacy}</p>}
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={data.acceptTerms}
              onCheckedChange={(checked) => onChange({ acceptTerms: !!checked })}
              className="mt-1"
            />
            <div>
              <Label htmlFor="acceptTerms" className="font-normal cursor-pointer flex items-center gap-1">
                I accept the Terms & Conditions and agree to comply.
                <span className="text-red-500 font-bold">*</span>
              </Label>
              {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Declaration */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-800 mb-4">Declaration</h3>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mb-6">
            <li>I confirm the information provided is true and correct.</li>
            <li>I understand I must provide a USI to receive certification (where applicable).</li>
            <li>I understand STA policies apply (training, assessment, complaints/appeals and privacy).</li>
          </ul>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="declareName" className="flex items-center gap-1">
                Student Name
                <span className="text-red-500 font-bold">*</span>
              </Label>
              <Input
                id="declareName"
                value={data.declareName}
                onChange={(e) => onChange({ declareName: e.target.value })}
                className={errors.declareName ? 'border-red-500' : ''}
              />
              {errors.declareName && <p className="text-sm text-red-500">{errors.declareName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="declareDate" className="flex items-center gap-1">
                Date
                <span className="text-red-500 font-bold">*</span>
              </Label>
              <Input
                id="declareDate"
                type="date"
                value={data.declareDate}
                onChange={(e) => onChange({ declareDate: e.target.value })}
                className={errors.declareDate ? 'border-red-500' : ''}
              />
              {errors.declareDate && <p className="text-sm text-red-500">{errors.declareDate}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Online Signature */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <Label className="flex items-center gap-1 mb-4">
            Online Signature
            <span className="text-red-500 font-bold">*</span>
          </Label>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-white">
            <canvas
              ref={canvasRef}
              className="w-full h-[180px] border border-gray-200 rounded-lg bg-white cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearSignature}
              >
                Clear
              </Button>
              <span className="text-sm text-gray-500">Draw with mouse or finger.</span>
            </div>
            {errors.signatureData && (
              <p className="text-sm text-red-500 mt-2">{errors.signatureData}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
