import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { QuizSectionData } from './Quiz';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

interface QuizSectionProps {
  section: QuizSectionData;
  onComplete: (answers: Record<string, string>) => void;
  onCancel?: () => void;
}

// Audio player defined outside QuizSection so it isn't recreated on re-renders.
// When defined inside, taps on dropdowns/inputs caused remounts and stopped playback.
const AudioPlayerCarlos = () => (
  <div className="my-6">
    <div className="bg-white p-6 rounded-lg border-2 border-purple-400">
      <p className="text-gray-700 mb-4">Note: You can listen to recording more than once.</p>
      <audio controls className="w-full mb-4" playsInline>
        <source src="/assets/Question Audio.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="flex justify-center mt-4">
        <img 
          src="/assets/family.jpg" 
          alt="Happy family" 
          className="w-40 rounded-lg shadow-md"
        />
      </div>
    </div>
  </div>
);

export function QuizSection({ section, onComplete, onCancel }: QuizSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [multiPartAnswers, setMultiPartAnswers] = useState<Record<string, Record<number, string>>>({});
  const [showValidation, setShowValidation] = useState(false);

  // State for drag and drop - Desktop Files
  const [filesDragState, setFilesDragState] = useState<{
    pdf1: string | null;
    pdf2: string | null;
    image: string | null;
    checklistBook: string[];
    imagesFolder: string[];
  }>({
    pdf1: 'available',
    pdf2: 'available', 
    image: 'available',
    checklistBook: [],
    imagesFolder: []
  });

  // State for drag and drop - Digital Devices
  const [devicesDragState, setDevicesDragState] = useState<{
    labels: { id: string; text: string; placed: boolean }[];
    devices: { id: string; name: string; matchedLabel: string | null }[];
  }>({
    labels: [
      { id: 'desktop', text: 'Desktop Computer', placed: false },
      { id: 'laptop', text: '2 in 1 / Laptop / Macbook', placed: false },
      { id: 'phone', text: 'iPhone / iPad', placed: false },
      { id: 'scanner', text: 'Barcode Scanner', placed: false },
      { id: 'copier', text: 'Photocopier that photocopies, scans, prints, sends emails, and saves files onto a server', placed: false }
    ],
    devices: [
      { id: 'device1', name: 'Desktop Computer', matchedLabel: null },
      { id: 'device2', name: 'iPhone', matchedLabel: null },
      { id: 'device3', name: 'Photocopier', matchedLabel: null },
      { id: 'device4', name: 'Laptop', matchedLabel: null },
      { id: 'device5', name: 'Barcode Scanner', matchedLabel: null }
    ]
  });

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  // Ref for drag ID - updates synchronously so drop works on first try (state is async)
  const draggedItemRef = useRef<string | null>(null);

  // Reset state when section changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setMultiPartAnswers({});
    setShowValidation(false);
    // Reset drag-drop states
    setFilesDragState({
      pdf1: 'available',
      pdf2: 'available', 
      image: 'available',
      checklistBook: [],
      imagesFolder: []
    });
    setDevicesDragState({
      labels: [
        { id: 'desktop', text: 'Desktop Computer', placed: false },
        { id: 'laptop', text: '2 in 1 / Laptop / Macbook', placed: false },
        { id: 'phone', text: 'iPhone / iPad', placed: false },
        { id: 'scanner', text: 'Barcode Scanner', placed: false },
        { id: 'copier', text: 'Photocopier that photocopies, scans, prints, sends emails, and saves files onto a server', placed: false }
      ],
      devices: [
        { id: 'device1', name: 'Desktop Computer', matchedLabel: null },
        { id: 'device2', name: 'iPhone', matchedLabel: null },
        { id: 'device3', name: 'Photocopier', matchedLabel: null },
        { id: 'device4', name: 'Laptop', matchedLabel: null },
        { id: 'device5', name: 'Barcode Scanner', matchedLabel: null }
      ]
    });
    draggedItemRef.current = null;
    setDraggedItem(null);
  }, [section.id]);

  const currentQuestion = section.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === section.questions.length - 1;
  
  // Check if files drag-drop is complete
  const isFilesComplete = filesDragState.checklistBook.length === 2 && filesDragState.imagesFolder.length === 1;
  
  // Check if devices drag-drop is complete
  const isDevicesComplete = devicesDragState.labels.every(l => l.placed);

  // Auto-mark as complete when drag-drop is done
  useEffect(() => {
    if (currentQuestion?.image === 'desktop-files' && isFilesComplete && !answers[currentQuestion.id]) {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: 'completed' }));
    }
  }, [isFilesComplete, currentQuestion?.image, currentQuestion?.id, answers]);

  useEffect(() => {
    if (currentQuestion?.image === 'digital-devices' && isDevicesComplete && !answers[currentQuestion.id]) {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: 'completed' }));
    }
  }, [isDevicesComplete, currentQuestion?.image, currentQuestion?.id, answers]);

  // Safety check - if currentQuestion is undefined, return null
  if (!currentQuestion) {
    return null;
  }
  
  // Check if current question is answered
  const hasAnsweredCurrent = currentQuestion.multiPart 
    ? currentQuestion.parts?.every((_, index) => multiPartAnswers[currentQuestion.id]?.[index])
    : !!answers[currentQuestion.id];

  const handleNext = () => {
    if (!hasAnsweredCurrent) {
      setShowValidation(true);
      return;
    }

    setShowValidation(false);

    // For multi-part questions, combine answers
    if (currentQuestion.multiPart && currentQuestion.parts) {
      const combinedAnswer = currentQuestion.parts.map((_, index) => 
        multiPartAnswers[currentQuestion.id]?.[index] || ''
      ).join('|');
      
      setAnswers({
        ...answers,
        [currentQuestion.id]: combinedAnswer
      });
    }

    if (isLastQuestion) {
      // Prepare final answers
      const finalAnswers = { ...answers };
      if (currentQuestion.multiPart && currentQuestion.parts) {
        const combinedAnswer = currentQuestion.parts.map((_, index) => 
          multiPartAnswers[currentQuestion.id]?.[index] || ''
        ).join('|');
        finalAnswers[currentQuestion.id] = combinedAnswer;
      }
      onComplete(finalAnswers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    });
    setShowValidation(false);
  };

  const handleMultiPartAnswerChange = (partIndex: number, value: string) => {
    setMultiPartAnswers({
      ...multiPartAnswers,
      [currentQuestion.id]: {
        ...multiPartAnswers[currentQuestion.id],
        [partIndex]: value
      }
    });
    setShowValidation(false);
  };

  // Hardhat image URL for question display
  const hardhatImage = '/assets/hard-hat.jpg';
  const barrierImage = '/assets/safety-barriers.png';
  const scaffoldImage = '/assets/scaffold.png';

  // Email component
  const EmailDisplay = () => (
    <div className="border-2 border-pink-400 rounded-lg p-6 my-6 bg-white">
      <div className="space-y-4">
        <div className="grid grid-cols-[100px_1fr] gap-2">
          <span className="font-semibold">From:</span>
          <span>Silvia &lt;silvia@commercialtyres.com.au&gt;</span>
        </div>
        <div className="grid grid-cols-[100px_1fr] gap-2">
          <span className="font-semibold">To:</span>
          <span>Mike &lt;mike@bridgestone.com.au&gt;</span>
        </div>
        <div className="grid grid-cols-[100px_1fr] gap-2">
          <span className="font-semibold">Subject:</span>
          <span>Tyres needed - Order no 2457</span>
        </div>
        <div className="pt-4 space-y-3 text-sm">
          <p>Hi Mike,</p>
          <p>Thank you for your quote Number 2457. I would like to place an order for the following items:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>x 20 Bridgestone Supercat PSR at $109 each including gst.</li>
            <li>x 20 Bridgestone Dueler A/T D697 at $225 each including gst.</li>
            <li>x 20 Bridgestone Turanza Serenity Plus at $185 each including gst.</li>
          </ul>
          <p>Can you please ship them to our Port Melbourne warehouse, 290 Normanby Rd, Port Melbourne. The site closes at 4 pm so please arrange delivery before then. Please deliver them as soon as possible as we are out of stock. Please phone me if you are out of stock.</p>
          <p>Thank you,<br/>Silvia Chinoto</p>
        </div>
      </div>
    </div>
  );

  // Infection Control Poster
  const InfectionPoster = () => (
    <div className="flex justify-center my-6">
      <div className="max-w-xs">
        <img 
          src="/assets/infection_control.png" 
          alt="9 Ways to Protect Your Patients - Infection Control Poster" 
          className="w-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );

  // Incident Report Form Scenario (display only - no inputs needed)
  const IncidentFormScenario = () => (
    <div className="my-6 space-y-4">
      <div className="bg-gray-100 p-6 rounded-lg space-y-3">
        <h3 className="font-bold text-gray-800">SCENARIO</h3>
        <p className="text-gray-700">Jenny is a full time worker in the Moulding section. Her ID number is JEN-123.</p>
        <p className="text-gray-700">Jenny only used one hand getting onto the forklift and slipped. She bruised her right hip falling onto the ground.</p>
        <p className="text-gray-700">The accident happened at 10 am on the 6th of February. An ice pack was put on Jenny's hip.</p>
        <p className="text-gray-700">The accident was reported at 10:30 am on the same day.</p>
      </div>
      <div className="bg-gray-200 p-6 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-4">Incident Report Form</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Name:</span>
            <span className="px-2 py-1 bg-white border rounded">Jenny</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Sex:</span>
            <span className="px-2 py-1 bg-white border rounded">Female</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Section:</span>
            <span className="px-2 py-1 bg-white border rounded">Moulding</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">ID Number:</span>
            <span className="px-2 py-1 bg-white border rounded">JEN-123</span>
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <span className="font-semibold">Employment:</span>
            <span className="px-2 py-1 bg-white border rounded">Full Time</span>
          </div>
          <div className="col-span-2">
            <span className="font-semibold">Describe the incident:</span> Date: 6 of Feb, Time: 10:00 am
          </div>
        </div>
      </div>
    </div>
  );

  // PPE Reading Paragraph
  const PPEReadingParagraph = () => (
    <div className="my-6 space-y-4">
      <div className="bg-white p-6 rounded-lg border-2 border-pink-500">
        <p className="text-gray-700 leading-relaxed">
          "All workers must wear hard hats, steel-capped boots and high-visibility vests while on a construction site. 
          Personal protective equipment (PPE) must be checked daily. Report any damaged PPE or equipment immediately to 
          the site supervisor. Workers must follow all safety signs and instructions at all times."
        </p>
      </div>
      <div className="flex justify-center">
        <div className="flex gap-3">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-4xl">⛑</span>
          </div>
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-4xl">🧤</span>
          </div>
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-4xl">👂</span>
          </div>
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-4xl">👢</span>
          </div>
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-4xl">🦺</span>
          </div>
        </div>
      </div>
    </div>
  );

  // PPE Notice
  const PPENotice = () => (
    <div className="flex justify-center my-6">
      <div className="border-4 border-black p-6 bg-white max-w-sm">
        <div className="text-center space-y-2">
          <div className="font-bold text-lg">THIS PROTECTIVE EQUIPMENT</div>
          <div className="font-bold text-2xl">MUST BE WORN</div>
          <div className="font-semibold">ON THIS SITE</div>
          <div className="flex justify-center gap-3 mt-4">
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">⛑</span>
            </div>
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">🧤</span>
            </div>
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">👂</span>
            </div>
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">🦺</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Handle file drag - use ref (synchronous) so drop works on first try
  const handleFileDragStart = (e: React.DragEvent, fileType: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', fileType);
    draggedItemRef.current = fileType;
  };

  const handleFileDrop = (e: React.DragEvent, folder: 'checklistBook' | 'imagesFolder') => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = e.dataTransfer.getData('text/plain') || draggedItemRef.current || draggedItem;
    if (!draggedId) return;
    
    if (folder === 'checklistBook' && (draggedId === 'pdf1' || draggedId === 'pdf2')) {
      if (!filesDragState.checklistBook.includes(draggedId)) {
        setFilesDragState(prev => ({
          ...prev,
          [draggedId]: null,
          checklistBook: [...prev.checklistBook, draggedId]
        }));
      }
    } else if (folder === 'imagesFolder' && draggedId === 'image') {
      if (!filesDragState.imagesFolder.includes(draggedId)) {
        setFilesDragState(prev => ({
          ...prev,
          image: null,
          imagesFolder: [...prev.imagesFolder, draggedId]
        }));
      }
    }
    draggedItemRef.current = null;
    setDraggedItem(null);
  };

  const resetFiles = () => {
    setFilesDragState({
      pdf1: 'available',
      pdf2: 'available',
      image: 'available',
      checklistBook: [],
      imagesFolder: []
    });
  };

  // Handle device label drag - use ref (synchronous) so drop works on first try
  const handleLabelDragStart = (e: React.DragEvent, labelId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', labelId);
    draggedItemRef.current = labelId;
  };

  const handleDeviceDrop = (e: React.DragEvent, deviceId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = e.dataTransfer.getData('text/plain') || draggedItemRef.current || draggedItem;
    if (!draggedId) return;
    
    setDevicesDragState(prev => ({
      labels: prev.labels.map(l => l.id === draggedId ? { ...l, placed: true } : l),
      devices: prev.devices.map(d => d.id === deviceId ? { ...d, matchedLabel: draggedId } : d)
    }));
    draggedItemRef.current = null;
    setDraggedItem(null);
  };

  const resetDevices = () => {
    setDevicesDragState({
      labels: [
        { id: 'desktop', text: 'Desktop Computer', placed: false },
        { id: 'laptop', text: '2 in 1 / Laptop / Macbook', placed: false },
        { id: 'phone', text: 'iPhone / iPad', placed: false },
        { id: 'scanner', text: 'Barcode Scanner', placed: false },
        { id: 'copier', text: 'Photocopier that photocopies, scans, prints, sends emails, and saves files onto a server', placed: false }
      ],
      devices: [
        { id: 'device1', name: 'Desktop Computer', matchedLabel: null },
        { id: 'device2', name: 'iPhone', matchedLabel: null },
        { id: 'device3', name: 'Photocopier', matchedLabel: null },
        { id: 'device4', name: 'Laptop', matchedLabel: null },
        { id: 'device5', name: 'Barcode Scanner', matchedLabel: null }
      ]
    });
  };

  // Desktop Files Drag and Drop Component
  const DesktopFilesDragDrop = () => (
    <div className="my-6">
      <div className="quiz-desktop-files-container">
        {/* Left side - Draggable files */}
        <div className="quiz-draggable-files-left">
          {filesDragState.pdf1 && (
            <div 
              draggable="true"
              onDragStart={(e) => handleFileDragStart(e, 'pdf1')}
              className="quiz-draggable-file"
              style={{ cursor: 'grab' }}
            >
              <img src="/assets/pngimage.png" alt="PDF" className="quiz-pdf-icon" />
            </div>
          )}
          {filesDragState.pdf2 && (
            <div 
              draggable="true"
              onDragStart={(e) => handleFileDragStart(e, 'pdf2')}
              className="quiz-draggable-file"
              style={{ cursor: 'grab' }}
            >
              <img src="/assets/pngimage.png" alt="PDF" className="quiz-pdf-icon" />
            </div>
          )}
          {filesDragState.image && (
            <div 
              draggable="true"
              onDragStart={(e) => handleFileDragStart(e, 'image')}
              className="quiz-draggable-file"
              style={{ cursor: 'grab' }}
            >
              <img src="/assets/imagefordraganddrop.png" alt="Image" className="quiz-image-icon" />
            </div>
          )}
        </div>

        {/* Right side - Desktop with folders */}
        <div className="quiz-desktop-screen-right">
          <img 
            src="/assets/dekstop-computer.png" 
            alt="Desktop" 
            className="quiz-desktop-image"
          />
          {/* Drop zones - Folders */}
          <div className="quiz-desktop-folders">
            <div 
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => handleFileDrop(e, 'checklistBook')}
              className={`quiz-drop-zone ${
                filesDragState.checklistBook.length === 2 
                  ? 'quiz-drop-zone-complete' 
                  : 'quiz-drop-zone-active'
              }`}
            >
              <span className="text-xl">📁</span>
              <span className="font-semibold text-gray-800">Checklist Book</span>
              {filesDragState.checklistBook.length > 0 && (
                <span className="ml-2 text-green-600 font-bold">({filesDragState.checklistBook.length}/2)</span>
              )}
            </div>
            <div 
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => handleFileDrop(e, 'imagesFolder')}
              className={`quiz-drop-zone ${
                filesDragState.imagesFolder.length === 1 
                  ? 'quiz-drop-zone-complete' 
                  : 'quiz-drop-zone-active'
              }`}
            >
              <span className="text-xl">📁</span>
              <span className="font-semibold text-gray-800">Images</span>
              {filesDragState.imagesFolder.length > 0 && (
                <span className="ml-2 text-green-600 font-bold">✓</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <button 
          onClick={resetFiles}
          className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg border hover:bg-gray-200 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );

  // Digital Devices Drag and Drop Component  
  const DigitalDevicesDragDrop = () => (
    <div className="my-6">
      <div className="quiz-devices-container">
        {/* Left side - Sticky Labels */}
        <div className="quiz-devices-labels-sticky">
          <div className="text-sm font-semibold text-gray-700 mb-3">Labels:</div>
          <div className="space-y-2">
            {devicesDragState.labels.filter(l => !l.placed).map(label => (
              <div 
                key={label.id}
                draggable="true"
                onDragStart={(e) => handleLabelDragStart(e, label.id)}
                className="quiz-device-label"
                style={{ cursor: 'grab' }}
              >
                {label.text}
              </div>
            ))}
            {devicesDragState.labels.every(l => l.placed) && (
              <div className="text-center text-green-600 font-semibold py-3 text-sm">
                ✓ All labels placed!
              </div>
            )}
          </div>
        </div>

        {/* Right side - Scrollable Device images with drop zones */}
        <div className="quiz-devices-scroll-area">
          <div className="grid grid-cols-2 gap-4">
            {/* Desktop Computer */}
            <div className="flex flex-col items-center">
              <img 
                src="/assets/dekstop-computer.png" 
                alt="Desktop Computer" 
                className="w-24 h-20 object-cover rounded-lg shadow-md mb-2"
              />
              <div 
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => handleDeviceDrop(e, 'device1')}
                className={`quiz-device-drop-zone ${
                  devicesDragState.devices[0].matchedLabel 
                    ? 'quiz-device-drop-zone-filled' 
                    : ''
                }`}
              >
                {devicesDragState.devices[0].matchedLabel 
                  ? devicesDragState.labels.find(l => l.id === devicesDragState.devices[0].matchedLabel)?.text
                  : 'Drop here'}
              </div>
            </div>
            
            {/* iPhone */}
            <div className="flex flex-col items-center">
              <img 
                src="/assets/phone.png" 
                alt="iPhone" 
                className="w-20 h-20 object-cover rounded-lg shadow-md mb-2"
              />
              <div 
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => handleDeviceDrop(e, 'device2')}
                className={`quiz-device-drop-zone ${
                  devicesDragState.devices[1].matchedLabel 
                    ? 'quiz-device-drop-zone-filled' 
                    : ''
                }`}
              >
                {devicesDragState.devices[1].matchedLabel 
                  ? devicesDragState.labels.find(l => l.id === devicesDragState.devices[1].matchedLabel)?.text
                  : 'Drop here'}
              </div>
            </div>

            {/* Photocopier */}
            <div className="flex flex-col items-center">
              <img 
                src="/assets/photocopier.jpg" 
                alt="Photocopier" 
                className="w-20 h-20 object-cover rounded-lg shadow-md mb-2"
              />
              <div 
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => handleDeviceDrop(e, 'device3')}
                className={`quiz-device-drop-zone ${
                  devicesDragState.devices[2].matchedLabel 
                    ? 'quiz-device-drop-zone-filled' 
                    : ''
                }`}
              >
                {devicesDragState.devices[2].matchedLabel 
                  ? devicesDragState.labels.find(l => l.id === devicesDragState.devices[2].matchedLabel)?.text
                  : 'Drop here'}
              </div>
            </div>

            {/* Laptop */}
            <div className="flex flex-col items-center">
              <img 
                src="/assets/laptop.jpg" 
                alt="Laptop" 
                className="w-24 h-16 object-cover rounded-lg shadow-md mb-2"
              />
              <div 
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => handleDeviceDrop(e, 'device4')}
                className={`quiz-device-drop-zone ${
                  devicesDragState.devices[3].matchedLabel 
                    ? 'quiz-device-drop-zone-filled' 
                    : ''
                }`}
              >
                {devicesDragState.devices[3].matchedLabel 
                  ? devicesDragState.labels.find(l => l.id === devicesDragState.devices[3].matchedLabel)?.text
                  : 'Drop here'}
              </div>
            </div>

            {/* Barcode Scanner */}
            <div className="flex flex-col items-center">
              <img 
                src="/assets/barcode-scanner.jpg" 
                alt="Barcode Scanner" 
                className="w-20 h-20 object-cover rounded-lg shadow-md mb-2"
              />
              <div 
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => handleDeviceDrop(e, 'device5')}
                className={`quiz-device-drop-zone ${
                  devicesDragState.devices[4].matchedLabel 
                    ? 'quiz-device-drop-zone-filled' 
                    : ''
                }`}
              >
                {devicesDragState.devices[4].matchedLabel 
                  ? devicesDragState.labels.find(l => l.id === devicesDragState.devices[4].matchedLabel)?.text
                  : 'Drop here'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <button 
          onClick={resetDevices}
          className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg border hover:bg-gray-200 transition-colors text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <Card className="border-violet-100">
      <CardHeader className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
        <CardTitle>{section.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className={`px-4 py-2 rounded-lg uppercase tracking-wide font-semibold quiz-section-header ${
          section.id === 'numeracy' 
            ? 'bg-green-500' 
            : section.id === 'literacy' 
            ? 'quiz-literacy-header' 
            : section.id === 'language'
            ? 'bg-purple-500'
            : 'quiz-digital-header'
        }`} style={{ color: '#000000' }}>
          {section.id === 'numeracy' 
            ? 'NUMERACY' 
            : section.id === 'literacy' && (currentQuestion.id === 'l4' || currentQuestion.id === 'l5' || currentQuestion.id === 'l6')
            ? 'READING' 
            : section.id === 'literacy'
            ? 'LITERACY'
            : section.id === 'language'
            ? 'LANGUAGE'
            : 'DIGITAL LITERACY'}
        </div>

        <div className="space-y-6">
          <div className="text-gray-700 font-semibold">
            {currentQuestion.question}
          </div>

          {/* Numeracy Images */}
          {currentQuestion.image === 'hardhat' && (
            <div className="flex justify-center my-6">
              <img 
                src={hardhatImage} 
                alt="Yellow hard hat" 
                className="w-32 h-32 object-contain"
              />
            </div>
          )}

          {currentQuestion.image === 'barrier' && (
            <div className="flex justify-center my-6">
              <img 
                src={barrierImage} 
                alt="Safety barrier" 
                className="w-40 h-32 object-contain"
              />
            </div>
          )}

          {currentQuestion.image === 'scaffold' && (
            <div className="flex justify-center my-6">
              <img 
                src={scaffoldImage} 
                alt="Scaffold with 300 kg maximum load" 
                className="w-40 h-32 object-contain"
              />
            </div>
          )}

          {/* Literacy Images */}
          {currentQuestion.image === 'email' && <EmailDisplay />}
          {currentQuestion.image === 'infection-poster' && <InfectionPoster />}
          {currentQuestion.image === 'incident-form' && <IncidentFormScenario />}
          {currentQuestion.image === 'ppe-reading' && <PPEReadingParagraph />}
          {currentQuestion.image === 'ppe-notice' && <PPENotice />}

          {/* Language Audio */}
          {currentQuestion.image === 'audio-carlos' && <AudioPlayerCarlos />}

          {/* Digital Literacy Drag and Drop */}
          {currentQuestion.image === 'desktop-files' && <DesktopFilesDragDrop />}
          {currentQuestion.image === 'digital-devices' && <DigitalDevicesDragDrop />}

          {/* URL Search Question */}
          {currentQuestion.image === 'url-search' && (
            <div className="my-6 flex items-center gap-4">
              <img 
                src="/assets/SafetyTrainingAcademylogo.png" 
                alt="Safety Training Academy Logo" 
                className="w-14 h-14 object-contain"
              />
            </div>
          )}

          {/* Drag-drop questions - Status indicator */}
          {currentQuestion.type === 'drag-drop' && (
            <div className="flex justify-center mt-6">
              {answers[currentQuestion.id] === 'completed' ? (
                <div className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold">
                  ✓ Marked Complete
                </div>
              ) : (
                <div className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg border">
                  Complete the drag and drop activity above to continue
                </div>
              )}
            </div>
          )}

          {/* Text input question */}
          {currentQuestion.type === 'text' && (
            <div className="my-6">
              <div className="flex items-center gap-4">
                <Label className="font-semibold whitespace-nowrap">Fill in the URL</Label>
                <input
                  type="text"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="https://"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <RadioGroup 
              value={answers[currentQuestion.id] || ''}
              onValueChange={handleAnswerChange}
            >
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:border-violet-300 transition-colors">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {currentQuestion.type === 'dropdown' && currentQuestion.options && (
            <div className="space-y-4">
              <div className="text-gray-600 font-semibold">
                2. Choose the correct answer in each drop-down list:
              </div>
              
              {/* Multi-part questions (numeracy, email, infection poster) */}
              {currentQuestion.multiPart && currentQuestion.parts ? (
                <>
                  {currentQuestion.parts.map((part, index) => (
                    <div key={index} className="space-y-2">
                      <Label>{part.label}</Label>
                      <Select 
                        value={multiPartAnswers[currentQuestion.id]?.[index] || ''} 
                        onValueChange={(value) => handleMultiPartAnswerChange(index, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {part.options.map((option, optIndex) => (
                            <SelectItem key={optIndex} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </>
              ) : null}
            </div>
          )}

          {showValidation && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please select an answer before continuing
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="text-right text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {section.questions.length}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
          >
            {currentQuestionIndex === 0 ? 'Submit' : isLastQuestion ? 'Submit Section' : 'Continue'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
