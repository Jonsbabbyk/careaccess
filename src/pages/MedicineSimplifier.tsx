import React, { useState } from 'react';
import { Pill, Sun, Moon, Coffee, Utensils, HelpCircle, Volume2, Mic, VolumeX } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { simplifyInstructions } from '../utils/medicineHelper';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string[];
  specialInstructions: string[];
  simplifiedInstructions: string;
}

const MedicineSimplifier: React.FC = () => {
  const { theme } = useTheme();
  const [showHelp, setShowHelp] = useState(false);
  const [medicationInput, setMedicationInput] = useState('');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  
  const timingOptions = [
    { value: 'morning', label: 'Morning', icon: <Sun className="w-5 h-5" /> },
    { value: 'afternoon', label: 'Afternoon', icon: <Sun className="w-5 h-5" /> },
    { value: 'evening', label: 'Evening', icon: <Moon className="w-5 h-5" /> },
    { value: 'beforeMeal', label: 'Before meals', icon: <Utensils className="w-5 h-5" /> },
    { value: 'withMeal', label: 'With meals', icon: <Utensils className="w-5 h-5" /> },
    { value: 'afterMeal', label: 'After meals', icon: <Utensils className="w-5 h-5" /> },
  ];

  const specialInstructionsOptions = [
    'Take with water',
    'Take with food',
    'Do not take with dairy products',
    'Avoid alcohol',
    'May cause drowsiness',
    'Take on an empty stomach',
  ];

  const startVoiceInput = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setIsRecording(true);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMedicationInput(transcript);
        setIsRecording(false);
      };
      
      recognition.onerror = () => {
        setIsRecording(false);
      };
      
      recognition.start();
    } else {
      alert('Voice input is not supported in your browser');
    }
  };

  const handleAddMedication = () => {
    if (medicationInput.trim()) {
      const parsedInfo = parseRawText(medicationInput);
      setMedications([...medications, parsedInfo]);
      setMedicationInput('');
    }
  };

  const parseRawText = (text: string): Medication => {
    // In a real app, this would use NLP to extract medication info
    // For demo purposes, we'll do simple parsing
    const lines = text.split('\n');
    const nameMatch = text.match(/([A-Za-z]+(?: [A-Za-z]+)*) (\d+\.?\d*\s*(?:mg|g|mcg|ml))/i);
    
    const newMed: Medication = {
      id: Date.now().toString(),
      name: nameMatch ? nameMatch[1] : 'Medicine',
      dosage: nameMatch ? nameMatch[2] : '1 tablet',
      frequency: text.includes('twice') ? 'twice daily' : 
                text.includes('three times') ? 'three times daily' : 'daily',
      timing: ['morning'],
      specialInstructions: [],
      simplifiedInstructions: ''
    };
    
    if (text.toLowerCase().includes('morning')) newMed.timing.push('morning');
    if (text.toLowerCase().includes('afternoon')) newMed.timing.push('afternoon');
    if (text.toLowerCase().includes('evening')) newMed.timing.push('evening');
    if (text.toLowerCase().includes('meal')) {
      if (text.toLowerCase().includes('before')) newMed.timing.push('beforeMeal');
      else if (text.toLowerCase().includes('after')) newMed.timing.push('afterMeal');
      else newMed.timing.push('withMeal');
    }
    
    if (text.toLowerCase().includes('water')) newMed.specialInstructions.push('Take with water');
    if (text.toLowerCase().includes('food') && !text.toLowerCase().includes('without food')) 
      newMed.specialInstructions.push('Take with food');
    if (text.toLowerCase().includes('empty stomach')) 
      newMed.specialInstructions.push('Take on an empty stomach');
    if (text.toLowerCase().includes('drowsiness') || text.toLowerCase().includes('sleepy')) 
      newMed.specialInstructions.push('May cause drowsiness');
    
    newMed.simplifiedInstructions = simplifyInstructions(newMed);
    
    return newMed;
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const handleUpdateMedication = (id: string, field: keyof Medication, value: any) => {
    const updatedMedications = medications.map(med => {
      if (med.id === id) {
        const updatedMed = { ...med, [field]: value };
        updatedMed.simplifiedInstructions = simplifyInstructions(updatedMed);
        return updatedMed;
      }
      return med;
    });
    setMedications(updatedMedications);
  };

  const handleToggleTiming = (id: string, timing: string) => {
    const medication = medications.find(med => med.id === id);
    if (medication) {
      const newTiming = medication.timing.includes(timing)
        ? medication.timing.filter(t => t !== timing)
        : [...medication.timing, timing];
      handleUpdateMedication(id, 'timing', newTiming);
    }
  };

  const handleToggleSpecialInstruction = (id: string, instruction: string) => {
    const medication = medications.find(med => med.id === id);
    if (medication) {
      const newInstructions = medication.specialInstructions.includes(instruction)
        ? medication.specialInstructions.filter(i => i !== instruction)
        : [...medication.specialInstructions, instruction];
      handleUpdateMedication(id, 'specialInstructions', newInstructions);
    }
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Medicine Instruction Simplifier</h1>
        <button 
          onClick={() => setShowHelp(!showHelp)}
          aria-label="Show help"
          className={`p-2 rounded-full ${
            theme === 'high-contrast' ? 'bg-white text-black' : 'text-teal-600 hover:bg-teal-100'
          }`}
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {showHelp && (
        <div className={`mb-6 p-4 rounded-lg ${
          theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <h2 className="text-xl font-semibold mb-2">How to use the Medicine Helper</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Enter your medication information from your prescription using text or voice input</li>
            <li>The system will try to automatically parse the information</li>
            <li>You can adjust the details if needed</li>
            <li>Get clear, simple instructions with helpful visual indicators</li>
            <li>Use the audio button to hear the instructions read aloud</li>
          </ul>
        </div>
      )}

      <div className={`mb-8 p-6 rounded-xl ${
        theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
      }`}>
        <h2 className="text-xl font-bold mb-4">Enter Medication Information</h2>
        
        <div className="mb-4">
          <label htmlFor="medicationInput" className="block mb-2 font-medium">
            Enter your prescription text:
          </label>
          <div className="flex">
            <textarea
              id="medicationInput"
              value={medicationInput}
              onChange={(e) => setMedicationInput(e.target.value)}
              placeholder="Copy and paste your prescription here or type it manually (e.g., 'Amoxicillin 500mg, take one tablet three times daily with food')"
              rows={4}
              className={`flex-grow p-3 rounded-l-md ${
                theme === 'high-contrast' 
                  ? 'bg-black text-white border border-white focus:ring-2 focus:ring-white' 
                  : theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-teal-500'
                    : 'border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500'
              }`}
            />
            <button
              onClick={startVoiceInput}
              className={`px-4 rounded-r-md flex items-center justify-center ${
                isRecording
                  ? (theme === 'high-contrast' ? 'bg-white text-black animate-pulse' : 'bg-red-500 text-white animate-pulse')
                  : (theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-600 text-white')
              }`}
              aria-label="Use voice input"
            >
              {isRecording ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        
        <button
          onClick={handleAddMedication}
          disabled={!medicationInput.trim()}
          className={`w-full py-3 rounded-md font-medium transition-colors ${
            !medicationInput.trim()
              ? (theme === 'high-contrast' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
              : (theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-600 text-white hover:bg-teal-700')
          }`}
        >
          Add Medication
        </button>
      </div>

      {medications.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Medications</h2>
          <div className="space-y-8">
            {medications.map((medication) => (
              <div 
                key={medication.id} 
                className={`p-6 rounded-xl ${
                  theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <Pill className={`w-6 h-6 mr-2 ${theme === 'high-contrast' ? 'text-white' : 'text-teal-600'}`} />
                    <h3 className="text-xl font-semibold">{medication.name}</h3>
                  </div>
                  <button
                    onClick={() => handleRemoveMedication(medication.id)}
                    className={`p-1 rounded-full ${
                      theme === 'high-contrast' ? 'text-white hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'
                    }`}
                    aria-label={`Remove ${medication.name}`}
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label htmlFor={`name-${medication.id}`} className="block mb-1 font-medium">
                        Medication Name:
                      </label>
                      <input
                        type="text"
                        id={`name-${medication.id}`}
                        value={medication.name}
                        onChange={(e) => handleUpdateMedication(medication.id, 'name', e.target.value)}
                        className={`w-full p-2 rounded-md ${
                          theme === 'high-contrast' 
                            ? 'bg-black text-white border border-white focus:ring-2 focus:ring-white' 
                            : theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-teal-500'
                              : 'border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500'
                        }`}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor={`dosage-${medication.id}`} className="block mb-1 font-medium">
                        Dosage:
                      </label>
                      <input
                        type="text"
                        id={`dosage-${medication.id}`}
                        value={medication.dosage}
                        onChange={(e) => handleUpdateMedication(medication.id, 'dosage', e.target.value)}
                        className={`w-full p-2 rounded-md ${
                          theme === 'high-contrast' 
                            ? 'bg-black text-white border border-white focus:ring-2 focus:ring-white' 
                            : theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-teal-500'
                              : 'border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500'
                        }`}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor={`frequency-${medication.id}`} className="block mb-1 font-medium">
                        Frequency:
                      </label>
                      <select
                        id={`frequency-${medication.id}`}
                        value={medication.frequency}
                        onChange={(e) => handleUpdateMedication(medication.id, 'frequency', e.target.value)}
                        className={`w-full p-2 rounded-md ${
                          theme === 'high-contrast' 
                            ? 'bg-black text-white border border-white focus:ring-2 focus:ring-white' 
                            : theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-teal-500'
                              : 'border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500'
                        }`}
                      >
                        <option value="daily">Once daily</option>
                        <option value="twice daily">Twice daily</option>
                        <option value="three times daily">Three times daily</option>
                        <option value="four times daily">Four times daily</option>
                        <option value="as needed">As needed</option>
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <span className="block mb-1 font-medium">When to take:</span>
                      <div className="flex flex-wrap gap-2">
                        {timingOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleToggleTiming(medication.id, option.value)}
                            aria-pressed={medication.timing.includes(option.value)}
                            className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                              medication.timing.includes(option.value)
                                ? (theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-600 text-white')
                                : (theme === 'high-contrast' ? 'bg-gray-800 text-white border border-white' : theme === 'dark' ? 'bg-gray-700 text-white border border-gray-600' : 'bg-gray-200 text-gray-700')
                            }`}
                          >
                            <span className="mr-1">{option.icon}</span>
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="block mb-1 font-medium">Special instructions:</span>
                      <div className="flex flex-wrap gap-2">
                        {specialInstructionsOptions.map((instruction) => (
                          <button
                            key={instruction}
                            onClick={() => handleToggleSpecialInstruction(medication.id, instruction)}
                            aria-pressed={medication.specialInstructions.includes(instruction)}
                            className={`px-3 py-1.5 rounded-full text-sm ${
                              medication.specialInstructions.includes(instruction)
                                ? (theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-600 text-white')
                                : (theme === 'high-contrast' ? 'bg-gray-800 text-white border border-white' : theme === 'dark' ? 'bg-gray-700 text-white border border-gray-600' : 'bg-gray-200 text-gray-700')
                            }`}
                          >
                            {instruction}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    theme === 'high-contrast' ? 'bg-gray-800 border border-white' : 
                    theme === 'dark' ? 'bg-gray-700' : 'bg-teal-50'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold">Simplified Instructions</h4>
                      <button
                        onClick={() => playAudio(medication.simplifiedInstructions)}
                        aria-label="Listen to instructions"
                        className={`p-2 rounded-full ${
                          theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="mb-4">{medication.simplifiedInstructions}</p>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Take at these times:</h5>
                      <div className="flex flex-wrap gap-2">
                        {medication.timing.includes('morning') && (
                          <div className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                            theme === 'high-contrast' ? 'bg-white text-black' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            <Sun className="w-4 h-4 mr-1" />
                            Morning
                          </div>
                        )}
                        {medication.timing.includes('afternoon') && (
                          <div className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                            theme === 'high-contrast' ? 'bg-white text-black' : 'bg-blue-100 text-blue-800'
                          }`}>
                            <Sun className="w-4 h-4 mr-1" />
                            Afternoon
                          </div>
                        )}
                        {medication.timing.includes('evening') && (
                          <div className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                            theme === 'high-contrast' ? 'bg-white text-black' : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            <Moon className="w-4 h-4 mr-1" />
                            Evening
                          </div>
                        )}
                      </div>
                      
                      {(medication.timing.includes('beforeMeal') || 
                        medication.timing.includes('withMeal') || 
                        medication.timing.includes('afterMeal')) && (
                        <div>
                          <h5 className="font-medium text-sm mt-2">Meal instructions:</h5>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {medication.timing.includes('beforeMeal') && (
                              <div className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                                theme === 'high-contrast' ? 'bg-white text-black' : 'bg-orange-100 text-orange-800'
                              }`}>
                                <Utensils className="w-4 h-4 mr-1" />
                                Before meals
                              </div>
                            )}
                            {medication.timing.includes('withMeal') && (
                              <div className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                                theme === 'high-contrast' ? 'bg-white text-black' : 'bg-orange-100 text-orange-800'
                              }`}>
                                <Utensils className="w-4 h-4 mr-1" />
                                With meals
                              </div>
                            )}
                            {medication.timing.includes('afterMeal') && (
                              <div className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                                theme === 'high-contrast' ? 'bg-white text-black' : 'bg-orange-100 text-orange-800'
                              }`}>
                                <Utensils className="w-4 h-4 mr-1" />
                                After meals
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {medication.specialInstructions.length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm mt-2">Remember:</h5>
                          <ul className="list-disc list-inside mt-1">
                            {medication.specialInstructions.map((instruction, index) => (
                              <li key={index} className="text-sm">
                                {instruction}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineSimplifier;