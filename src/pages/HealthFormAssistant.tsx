import React, { useState, useRef } from 'react';
import { Save, FileText, HelpCircle, ArrowLeft, ArrowRight, Mic, VolumeX, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { generatePDF } from '../utils/pdfGenerator';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'radio' | 'checkbox' | 'select' | 'date';
  options?: string[];
  required: boolean;
  helpText?: string;
  value: string | string[];
}

const HealthFormAssistant: React.FC = () => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentFieldId, setCurrentFieldId] = useState<string | null>(null);
  const [voiceInputSuccess, setVoiceInputSuccess] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: FormField[] }>({
    personalInfo: [
      { id: 'fullName', label: 'Full Name', type: 'text', required: true, value: '' },
      { id: 'birthDate', label: 'Date of Birth', type: 'date', required: true, value: '' },
      { id: 'gender', label: 'Gender', type: 'radio', options: ['Male', 'Female', 'Other'], required: true, value: '' },
      { id: 'phone', label: 'Phone Number', type: 'text', required: false, value: '' },
    ],
    medicalHistory: [
      { id: 'allergies', label: 'Do you have any allergies?', type: 'radio', options: ['Yes', 'No'], required: true, value: '', helpText: 'This includes allergies to medications, food, or environmental factors' },
      { id: 'allergiesList', label: 'If yes, please list your allergies', type: 'text', required: false, value: '' },
      { id: 'conditions', label: 'Do you have any of the following conditions?', type: 'checkbox', options: [
        'High blood pressure', 
        'Diabetes', 
        'Heart disease', 
        'Asthma',
        'Cancer',
        'Other'
      ], required: true, value: [] },
      { id: 'otherConditions', label: 'If other, please specify', type: 'text', required: false, value: '' },
    ],
    currentMedications: [
      { id: 'takingMeds', label: 'Are you currently taking any medications?', type: 'radio', options: ['Yes', 'No'], required: true, value: '' },
      { id: 'medications', label: 'If yes, please list all medications', type: 'text', required: false, value: '', helpText: 'Include prescription, over-the-counter medications, and supplements' },
    ],
    emergencyContact: [
      { id: 'emergencyName', label: 'Emergency Contact Name', type: 'text', required: true, value: '' },
      { id: 'emergencyRelation', label: 'Relationship to You', type: 'text', required: true, value: '' },
      { id: 'emergencyPhone', label: 'Emergency Contact Phone', type: 'text', required: true, value: '' },
    ],
  });

  const formSections = Object.keys(formData);
  const currentFields = formData[formSections[currentStep]];

  const handleInputChange = (fieldId: string, value: string | string[]) => {
    const updatedFields = [...currentFields];
    const fieldIndex = updatedFields.findIndex(field => field.id === fieldId);
    
    if (fieldIndex !== -1) {
      updatedFields[fieldIndex] = {
        ...updatedFields[fieldIndex],
        value
      };
      
      setFormData({
        ...formData,
        [formSections[currentStep]]: updatedFields
      });
    }
  };

  const startVoiceInput = (fieldId: string) => {
    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setIsRecording(true);
      setCurrentFieldId(fieldId);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        console.log('Voice recognition started');
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice input received:', transcript);
        
        // Get current field value and append or replace based on field type
        const currentField = currentFields.find(field => field.id === fieldId);
        if (currentField) {
          let newValue = transcript;
          
          // For text fields, if there's existing content, ask user if they want to append or replace
          if (currentField.type === 'text' && currentField.value && typeof currentField.value === 'string') {
            const shouldAppend = confirm(`Current text: "${currentField.value}"\n\nDo you want to add the new text to the existing text?\n\nClick OK to add, Cancel to replace.`);
            if (shouldAppend) {
              newValue = `${currentField.value} ${transcript}`;
            }
          }
          
          handleInputChange(fieldId, newValue);
        }
        
        setIsRecording(false);
        setCurrentFieldId(null);
        setVoiceInputSuccess(fieldId);
        recognitionRef.current = null;
        
        // Clear success message after 3 seconds
        setTimeout(() => setVoiceInputSuccess(null), 3000);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setCurrentFieldId(null);
        recognitionRef.current = null;
        
        let errorMessage = 'Voice input failed. Please try again or type your response.';
        if (event.error === 'not-allowed') {
          errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings and try again.';
        } else if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Please speak clearly and try again.';
        } else if (event.error === 'network') {
          errorMessage = 'Network error occurred. Please check your connection and try again.';
        } else if (event.error === 'audio-capture') {
          errorMessage = 'No microphone found. Please ensure a microphone is connected and try again.';
        } else if (event.error === 'aborted') {
          errorMessage = 'Voice input was cancelled.';
        }
        
        alert(errorMessage);
      };
      
      recognition.onend = () => {
        console.log('Voice recognition ended');
        setIsRecording(false);
        setCurrentFieldId(null);
        recognitionRef.current = null;
      };
      
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
        setIsRecording(false);
        setCurrentFieldId(null);
        recognitionRef.current = null;
        alert('Failed to start voice recognition. Please ensure your browser supports this feature and try again.');
      }
    } else {
      alert('Voice input is not supported in your browser. Please type your response or try using a different browser like Chrome, Edge, or Safari.');
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setCurrentFieldId(null);
  };

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    const updatedFields = [...currentFields];
    const fieldIndex = updatedFields.findIndex(field => field.id === fieldId);
    
    if (fieldIndex !== -1) {
      const field = updatedFields[fieldIndex];
      let newValue = [...(field.value as string[])];
      
      if (checked && !newValue.includes(option)) {
        newValue.push(option);
      } else if (!checked && newValue.includes(option)) {
        newValue = newValue.filter(val => val !== option);
      }
      
      updatedFields[fieldIndex] = {
        ...field,
        value: newValue
      };
      
      setFormData({
        ...formData,
        [formSections[currentStep]]: updatedFields
      });
    }
  };

  const handleNext = () => {
    if (currentStep < formSections.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAsPDF = () => {
    generatePDF(formData);
  };

  const isStepComplete = () => {
    return !currentFields.some(field => field.required && 
      (field.value === '' || (Array.isArray(field.value) && field.value.length === 0)));
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <div>
            <div className="flex">
              <input
                type="text"
                id={field.id}
                value={field.value as string}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className={`flex-grow p-4 rounded-l-md text-lg ${
                  theme === 'high-contrast' 
                    ? 'bg-black text-white border border-white focus:ring-2 focus:ring-white' 
                    : theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-teal-500'
                      : 'border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500'
                }`}
                aria-required={field.required}
                aria-describedby={field.helpText ? `${field.id}-help` : undefined}
                aria-label={field.label}
              />
              <button
                onClick={() => {
                  if (isRecording && currentFieldId === field.id) {
                    stopVoiceInput();
                  } else {
                    startVoiceInput(field.id);
                  }
                }}
                className={`px-6 py-4 rounded-r-md flex items-center justify-center text-lg transition-colors ${
                  isRecording && currentFieldId === field.id
                    ? (theme === 'high-contrast' ? 'bg-white text-black animate-pulse' : 'bg-red-500 text-white animate-pulse')
                    : (theme === 'high-contrast' ? 'bg-white text-black hover:bg-gray-200' : 'bg-teal-600 text-white hover:bg-teal-700')
                }`}
                aria-label={`${isRecording && currentFieldId === field.id ? 'Stop' : 'Start'} voice input for ${field.label}`}
                type="button"
              >
                {isRecording && currentFieldId === field.id ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
            </div>
            {voiceInputSuccess === field.id && (
              <div className={`mt-2 p-2 rounded-md flex items-center text-sm ${
                theme === 'high-contrast' ? 'bg-white text-black' : 'bg-green-100 text-green-800'
              }`}>
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>✅ Voice input received successfully!</span>
              </div>
            )}
          </div>
        );
      case 'date':
        return (
          <input
            type="date"
            id={field.id}
            value={field.value as string}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full p-4 rounded-md text-lg ${
              theme === 'high-contrast' 
                ? 'bg-black text-white border border-white focus:ring-2 focus:ring-white' 
                : theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-teal-500'
                  : 'border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500'
            }`}
            aria-required={field.required}
            aria-label={field.label}
          />
        );
      case 'radio':
        return (
          <div className="space-y-3">
            {field.options?.map(option => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.id}-${option}`}
                  name={field.id}
                  value={option}
                  checked={field.value === option}
                  onChange={() => handleInputChange(field.id, option)}
                  className={`mr-3 h-5 w-5 ${
                    theme === 'high-contrast' ? 'accent-white' : 'accent-teal-600'
                  }`}
                  aria-describedby={field.helpText ? `${field.id}-help` : undefined}
                />
                <label 
                  htmlFor={`${field.id}-${option}`}
                  className="text-lg cursor-pointer"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-3">
            {field.options?.map(option => (
              <div key={option} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${field.id}-${option}`}
                  name={field.id}
                  value={option}
                  checked={(field.value as string[]).includes(option)}
                  onChange={(e) => handleCheckboxChange(field.id, option, e.target.checked)}
                  className={`mr-3 h-5 w-5 ${
                    theme === 'high-contrast' ? 'accent-white' : 'accent-teal-600'
                  }`}
                  aria-describedby={field.helpText ? `${field.id}-help` : undefined}
                />
                <label 
                  htmlFor={`${field.id}-${option}`}
                  className="text-lg cursor-pointer"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Health Form Assistant</h1>
        <button 
          onClick={() => setShowHelp(!showHelp)}
          aria-label="Show help information"
          className={`p-3 rounded-full ${
            theme === 'high-contrast' ? 'bg-white text-black' : 'text-teal-600 hover:bg-teal-100'
          }`}
        >
          <HelpCircle className="w-8 h-8" />
        </button>
      </div>

      {showHelp && (
        <div className={`mb-8 p-6 rounded-lg ${
          theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <h2 className="text-2xl font-semibold mb-4">How to use the Health Form Assistant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>Fill out each section of the form at your own pace</li>
              <li>Use the large microphone button next to text fields for voice input</li>
              <li>Required fields are marked with an asterisk (*)</li>
              <li>Click the help icons (?) for more information about specific questions</li>
            </ul>
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>Navigate between sections using the Previous and Next buttons</li>
              <li>Voice input works in most modern browsers</li>
              <li>All information stays on your device - nothing is sent to servers</li>
              <li>Once completed, you can save your form as a PDF to print or share</li>
            </ul>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center">
          {formSections.map((section, index) => (
            <div 
              key={section} 
              className={`flex-1 py-3 text-center ${index < formSections.length - 1 ? 'border-b-4' : ''} ${
                index === currentStep 
                  ? (theme === 'high-contrast' ? 'border-white font-bold' : 'border-teal-600 font-bold') 
                  : index < currentStep 
                    ? (theme === 'high-contrast' ? 'border-gray-400' : 'border-gray-300') 
                    : 'border-transparent'
              }`}
            >
              <span className={`inline-block rounded-full w-12 h-12 flex items-center justify-center text-lg mb-2 ${
                index === currentStep 
                  ? (theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-600 text-white') 
                  : index < currentStep 
                    ? (theme === 'high-contrast' ? 'bg-gray-600 text-white' : 'bg-teal-100 text-teal-800') 
                    : (theme === 'high-contrast' ? 'bg-gray-800 text-white border border-gray-600' : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-500')
              }`}>
                {index + 1}
              </span>
              <span className="hidden md:inline text-lg font-medium">
                {section.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-8 rounded-xl mb-8 ${
        theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
      }`}>
        <h2 className="text-3xl font-bold mb-8">
          {formSections[currentStep].replace(/([A-Z])/g, ' $1').trim()}
        </h2>

        <form className="space-y-8">
          {currentFields.map((field) => (
            <div key={field.id} className="space-y-3">
              <div className="flex items-start">
                <label htmlFor={field.id} className="block text-xl font-medium mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1 text-2xl">*</span>}
                </label>
                {field.helpText && (
                  <div className="relative ml-3 group">
                    <button 
                      type="button"
                      className={`h-6 w-6 rounded-full text-sm flex items-center justify-center ${
                        theme === 'high-contrast' ? 'bg-white text-black' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      aria-label={`Help for ${field.label}`}
                    >
                      ?
                    </button>
                    <div className={`absolute left-0 transform -translate-x-1/2 mt-2 p-3 rounded shadow-lg w-80 z-10 text-base hidden group-hover:block ${
                      theme === 'high-contrast' ? 'bg-white text-black border border-gray-300' : theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 border border-gray-200'
                    }`} id={`${field.id}-help`}>
                      {field.helpText}
                    </div>
                  </div>
                )}
              </div>
              {renderField(field)}
            </div>
          ))}
        </form>

        <div className="flex justify-between mt-12">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-4 rounded-md flex items-center text-lg ${
              currentStep === 0
                ? (theme === 'high-contrast' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                : (theme === 'high-contrast' ? 'bg-white text-black hover:bg-gray-200' : 'bg-teal-600 text-white hover:bg-teal-700')
            }`}
            aria-label="Go to previous section"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </button>
          
          {currentStep < formSections.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!isStepComplete()}
              className={`px-6 py-4 rounded-md flex items-center text-lg ${
                !isStepComplete()
                  ? (theme === 'high-contrast' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                  : (theme === 'high-contrast' ? 'bg-white text-black hover:bg-gray-200' : 'bg-teal-600 text-white hover:bg-teal-700')
              }`}
              aria-label="Go to next section"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSaveAsPDF}
              disabled={!isStepComplete()}
              className={`px-6 py-4 rounded-md flex items-center text-lg ${
                !isStepComplete()
                  ? (theme === 'high-contrast' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                  : (theme === 'high-contrast' ? 'bg-white text-black hover:bg-gray-200' : 'bg-teal-600 text-white hover:bg-teal-700')
              }`}
              aria-label="Save completed form as PDF"
            >
              <Save className="w-5 h-5 mr-2" />
              Save as PDF
            </button>
          )}
        </div>
      </div>

      <div className={`p-6 rounded-lg ${
        theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <div className="flex items-start">
          <FileText className={`w-8 h-8 mr-3 mt-1 ${
            theme === 'high-contrast' ? 'text-white' : 'text-teal-600'
          }`} />
          <div>
            <h3 className="text-xl font-medium mb-2">Privacy & Accessibility Note</h3>
            <div className="text-lg space-y-2">
              <p>
                🔒 All information entered in this form is stored locally on your device only. No data is sent to any server.
              </p>
              <p>
                🎤 Voice input uses your browser's built-in speech recognition and works offline.
              </p>
              <p>
                ♿ This form is designed to be accessible with screen readers, keyboard navigation, and high contrast mode.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthFormAssistant;