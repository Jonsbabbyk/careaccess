import React, { useState } from 'react';
import { Mic, VolumeX, Search, HelpCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import BodyDiagram from '../components/SymptomTool/BodyDiagram';
import { analyzeSymptoms } from '../utils/symptomAnalyzer';

const SymptomExtractor: React.FC = () => {
  const { theme } = useTheme();
  const [inputMethod, setInputMethod] = useState<'text' | 'voice' | 'diagram'>('text');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState<{ condition: string; probability: string; advice: string }[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [voiceInputSuccess, setVoiceInputSuccess] = useState(false);

  const handleAddSymptom = (symptom: string) => {
    if (symptom.trim() !== '' && !symptoms.includes(symptom.trim())) {
      setSymptoms([...symptoms, symptom.trim()]);
      setTextInput('');
    }
  };

  const handleRemoveSymptom = (index: number) => {
    const newSymptoms = [...symptoms];
    newSymptoms.splice(index, 1);
    setSymptoms(newSymptoms);
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      return;
    }

    // Start recording
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setIsRecording(true);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleAddSymptom(transcript);
        setIsRecording(false);
        setVoiceInputSuccess(true);
        
        // Clear success message after 3 seconds
        setTimeout(() => setVoiceInputSuccess(false), 3000);
      };
      
      recognition.onerror = (event) => {
        setIsRecording(false);
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = 'Voice recognition failed. Please try again or type your symptom.';
        if (event.error === 'not-allowed') {
          errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings and try again.';
        } else if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Please speak clearly and try again.';
        } else if (event.error === 'network') {
          errorMessage = 'Network error occurred. Please check your connection and try again.';
        }
        
        alert(errorMessage);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      try {
        recognition.start();
      } catch (error) {
        setIsRecording(false);
        alert('Failed to start voice recognition. Please ensure your browser supports this feature and try again.');
      }
    } else {
      // Fallback for browsers without speech recognition
      alert('Voice input is not supported in your browser. Please type your symptom or try using a different browser like Chrome, Edge, or Safari.');
    }
  };

  const handleDiagramSelection = (bodyPart: string) => {
    handleAddSymptom(bodyPart);
  };

  const handleAnalyze = () => {
    if (symptoms.length > 0) {
      const analysisResults = analyzeSymptoms(symptoms);
      setResults(analysisResults);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Symptom Checker</h1>
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
          <h2 className="text-xl font-semibold mb-2">How to use the Symptom Checker</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Enter your symptoms using text, voice, or by clicking on the body diagram</li>
            <li>Add multiple symptoms to get more accurate results</li>
            <li>Click "Analyze Symptoms" to see possible conditions and advice</li>
            <li>This tool is for informational purposes only and is not a substitute for professional medical advice</li>
          </ul>
        </div>
      )}

      <div className={`mb-8 p-6 rounded-xl ${
        theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
      }`}>
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={() => setInputMethod('text')} 
              className={`px-4 py-2 rounded-md transition-colors ${
                inputMethod === 'text' 
                  ? (theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-600 text-white') 
                  : (theme === 'high-contrast' ? 'bg-gray-800 text-white border border-white' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200')
              }`}
              aria-pressed={inputMethod === 'text'}
            >
              Text Input
            </button>
            <button 
              onClick={() => setInputMethod('voice')} 
              className={`px-4 py-2 rounded-md transition-colors ${
                inputMethod === 'voice' 
                  ? (theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-600 text-white') 
                  : (theme === 'high-contrast' ? 'bg-gray-800 text-white border border-white' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200')
              }`}
              aria-pressed={inputMethod === 'voice'}
            >
              Voice Input
            </button>
            <button 
              onClick={() => setInputMethod('diagram')} 
              className={`px-4 py-2 rounded-md transition-colors ${
                inputMethod === 'diagram' 
                  ? (theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-600 text-white') 
                  : (theme === 'high-contrast' ? 'bg-gray-800 text-white border border-white' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200')
              }`}
              aria-pressed={inputMethod === 'diagram'}
            >
              Body Diagram
            </button>
          </div>

          {inputMethod === 'text' && (
            <div className="flex">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSymptom(textInput)}
                placeholder="Type your symptom (e.g., headache, fever)"
                className={`flex-grow p-3 rounded-l-md border ${
                  theme === 'high-contrast' 
                    ? 'bg-black text-white border-white focus:ring-2 focus:ring-white' 
                    : theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-teal-500'
                      : 'border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500'
                }`}
                aria-label="Enter symptom"
              />
              <button
                onClick={() => handleAddSymptom(textInput)}
                className={`p-3 rounded-r-md ${
                  theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
                aria-label="Add symptom"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          )}

          {inputMethod === 'voice' && (
            <div className="text-center">
              {voiceInputSuccess && (
                <div className={`mb-4 p-3 rounded-lg flex items-center justify-center ${
                  theme === 'high-contrast' ? 'bg-white text-black' : 'bg-green-100 text-green-800'
                }`}>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">✅ Voice input received successfully!</span>
                </div>
              )}
              
              <button
                onClick={toggleRecording}
                className={`p-6 rounded-full mb-4 transition-colors ${
                  isRecording 
                    ? (theme === 'high-contrast' ? 'bg-white text-black animate-pulse' : 'bg-red-500 text-white animate-pulse') 
                    : (theme === 'high-contrast' ? 'bg-white text-black hover:bg-gray-200' : 'bg-teal-600 text-white hover:bg-teal-700')
                }`}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? (
                  <VolumeX className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
              <p className={theme === 'dark' ? 'text-gray-300' : theme === 'high-contrast' ? 'text-white' : 'text-gray-600'}>
                {isRecording 
                  ? "Listening... Speak your symptoms clearly" 
                  : "Click the microphone and speak your symptoms"
                }
              </p>
            </div>
          )}

          {inputMethod === 'diagram' && (
            <BodyDiagram onSelectBodyPart={handleDiagramSelection} theme={theme} />
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Your Symptoms:</h3>
          {symptoms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom, index) => (
                <div 
                  key={index} 
                  className={`flex items-center px-3 py-1 rounded-full ${
                    theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  <span>{symptom}</span>
                  <button
                    onClick={() => handleRemoveSymptom(index)}
                    className="ml-2 text-sm rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-200"
                    aria-label={`Remove ${symptom}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className={`italic ${theme === 'dark' ? 'text-gray-400' : theme === 'high-contrast' ? 'text-gray-300' : 'text-gray-500'}`}>
              No symptoms added yet
            </p>
          )}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={symptoms.length === 0}
          className={`w-full py-3 rounded-md font-medium transition-colors ${
            symptoms.length === 0
              ? (theme === 'high-contrast' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
              : (theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-600 text-white hover:bg-teal-700')
          }`}
        >
          Analyze Symptoms
        </button>
      </div>

      {results.length > 0 && (
        <div className={`p-6 rounded-xl mb-8 ${
          theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
        }`}>
          <h2 className="text-2xl font-bold mb-4">Possible Conditions</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  theme === 'high-contrast' 
                    ? 'border-white' 
                    : theme === 'dark' 
                      ? 'border-gray-700 bg-gray-700' 
                      : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{result.condition}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    parseInt(result.probability) > 70
                      ? (theme === 'high-contrast' ? 'bg-white text-black' : 'bg-red-100 text-red-800')
                      : parseInt(result.probability) > 40
                        ? (theme === 'high-contrast' ? 'bg-white text-black' : 'bg-yellow-100 text-yellow-800')
                        : (theme === 'high-contrast' ? 'bg-white text-black' : 'bg-green-100 text-green-800')
                  }`}>
                    {result.probability}% match
                  </span>
                </div>
                <p className={theme === 'dark' ? 'text-gray-300' : theme === 'high-contrast' ? 'text-gray-100' : 'text-gray-600'}>
                  {result.advice}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
            <p className="font-medium">Important Note:</p>
            <p className="text-sm">This information is for educational purposes only and is not a substitute for professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomExtractor;