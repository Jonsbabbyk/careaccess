import React, { useState, useRef, useEffect } from 'react';
import { Mic, VolumeX, Volume2, User, MessageCircle, HelpCircle, Send, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { findBestAnswer, saveNewQuestion, getSampleQuestions, getKeywordSuggestions } from '../utils/doctorAnswers';

interface Message {
  id: string;
  type: 'user' | 'doctor';
  content: string;
  timestamp: Date;
}

const AskDoctor: React.FC = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [voiceInputSuccess, setVoiceInputSuccess] = useState(false);
  const [showSamples, setShowSamples] = useState(true);
  const [isMuted, setIsMuted] = useState(() => {
    // Load mute state from localStorage
    const saved = localStorage.getItem('askDoctor_muted');
    return saved ? JSON.parse(saved) : false;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const sampleQuestions = getSampleQuestions();
  const keywordSuggestions = getKeywordSuggestions();

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      // Clean up speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      // Clean up speech synthesis
      if (currentUtteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (voiceInputSuccess) {
      const timer = setTimeout(() => setVoiceInputSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [voiceInputSuccess]);

  // Save mute state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('askDoctor_muted', JSON.stringify(isMuted));
  }, [isMuted]);

  const startVoiceInput = () => {
    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setIsRecording(true);
      
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
        
        // Append to existing text or replace based on user preference
        if (inputText.trim()) {
          const shouldAppend = confirm(`Current text: "${inputText}"\n\nDo you want to add the new text to your existing question?\n\nClick OK to add, Cancel to replace.`);
          if (shouldAppend) {
            setInputText(prev => `${prev} ${transcript}`);
          } else {
            setInputText(transcript);
          }
        } else {
          setInputText(transcript);
        }
        
        setIsRecording(false);
        setVoiceInputSuccess(true);
        recognitionRef.current = null;
        
        // Focus back to textarea for accessibility
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        recognitionRef.current = null;
        
        let errorMessage = 'Voice recognition failed. Please try again or type your question.';
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
        recognitionRef.current = null;
      };
      
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
        setIsRecording(false);
        recognitionRef.current = null;
        alert('Failed to start voice recognition. Please ensure your browser supports this feature and try again.');
      }
    } else {
      // Fallback for browsers without speech recognition
      alert('Voice input is not supported in your browser. Please type your question or try using a different browser like Chrome, Edge, or Safari.');
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);
    setShowSamples(false);

    try {
      let doctorResponse = '';
      
      if (isOnline) {
        // Simulate online AI response (in real app, this would call Tavus API)
        doctorResponse = await simulateOnlineResponse(userMessage.content);
      } else {
        // Use offline fuzzy matching
        doctorResponse = findBestAnswer(userMessage.content);
      }

      const doctorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'doctor',
        content: doctorResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, doctorMessage]);
      
      // Save new question-answer pair for learning
      saveNewQuestion(userMessage.content, doctorResponse);
      
      // Speak the response if not muted
      if (!isMuted) {
        speakText(doctorResponse);
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'doctor',
        content: "I'm sorry, I'm having trouble processing your question right now. Please try again later or contact a healthcare professional if this is urgent.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateOnlineResponse = async (question: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Enhanced response generation based on keywords
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('wheelchair') || lowerQuestion.includes('mobility') || lowerQuestion.includes('walking')) {
      return "For wheelchair and mobility concerns, I recommend consulting with a physical therapist or occupational therapist. They can assess your specific needs and recommend appropriate equipment, exercises, or home modifications. If you're experiencing new mobility issues, please see your primary care doctor for evaluation. There are also many community resources and adaptive equipment options available to help maintain independence.";
    }
    
    if (lowerQuestion.includes('vision') || lowerQuestion.includes('blind') || lowerQuestion.includes('sight') || lowerQuestion.includes('see')) {
      return "For vision-related concerns, it's important to see an ophthalmologist or optometrist regularly. If you're experiencing sudden vision changes, this could be urgent and should be evaluated immediately. There are many assistive technologies available, including screen readers, magnification software, and smartphone apps. Organizations like the National Federation of the Blind offer excellent resources and support.";
    }
    
    if (lowerQuestion.includes('hearing') || lowerQuestion.includes('deaf') || lowerQuestion.includes('ear') || lowerQuestion.includes('sound')) {
      return "For hearing concerns, I recommend seeing an audiologist for a comprehensive hearing test. If you're experiencing sudden hearing loss, this should be evaluated promptly as early treatment can be crucial. Modern hearing aids are much more advanced and discreet than older models. There are also many assistive listening devices and communication strategies that can significantly improve quality of life.";
    }
    
    if (lowerQuestion.includes('pain') || lowerQuestion.includes('hurt') || lowerQuestion.includes('ache') || lowerQuestion.includes('chronic')) {
      return "Chronic pain can significantly impact daily life and is a common concern for people with disabilities. I recommend keeping a detailed pain diary to track patterns, triggers, and what helps. Work with your healthcare team to develop a comprehensive pain management plan that may include medication, physical therapy, occupational therapy, and lifestyle modifications. Don't hesitate to seek help from pain specialists, and remember that mental health support is also important for chronic pain management.";
    }
    
    if (lowerQuestion.includes('exercise') || lowerQuestion.includes('fitness') || lowerQuestion.includes('physical activity')) {
      return "Regular physical activity is important for everyone, including people with disabilities. The key is finding activities that work for your specific situation and abilities. Consider working with a physical therapist or adaptive fitness specialist who can design a safe, effective exercise program for you. Many gyms and community centers offer adaptive fitness programs. Swimming, chair exercises, and adaptive sports are great options for many people.";
    }
    
    if (lowerQuestion.includes('mental health') || lowerQuestion.includes('depression') || lowerQuestion.includes('anxiety') || lowerQuestion.includes('stress')) {
      return "Mental health is just as important as physical health, and people with disabilities may face additional stressors. It's completely normal to seek mental health support. Look for therapists who have experience working with people with disabilities. Many offer telehealth options for accessibility. Support groups, both in-person and online, can also be very helpful. Don't ignore signs of depression or anxiety - they're treatable conditions.";
    }
    
    if (lowerQuestion.includes('medication') || lowerQuestion.includes('medicine') || lowerQuestion.includes('prescription')) {
      return "Managing medications can be complex, especially when dealing with multiple conditions. Always take medications exactly as prescribed and don't stop without consulting your doctor. Use pill organizers, medication apps, or other tools to help you stay organized. If you're having trouble affording medications, ask your doctor about generic alternatives or patient assistance programs. Always inform all your healthcare providers about all medications you're taking.";
    }
    
    return "Thank you for your question. While I can provide general health information, it's important to consult with your healthcare provider for personalized medical advice. They can properly evaluate your specific situation and provide appropriate treatment recommendations. If this is urgent or you're experiencing severe symptoms, please contact your doctor immediately or seek emergency care.";
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      // Stop any currently speaking text
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Try to use a more natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Natural') || 
        voice.name.includes('Enhanced') || 
        voice.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Store reference to current utterance
      currentUtteranceRef.current = utterance;
      
      utterance.onend = () => {
        currentUtteranceRef.current = null;
      };
      
      utterance.onerror = () => {
        currentUtteranceRef.current = null;
        console.error('Speech synthesis error');
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // If muting, stop any current speech
    if (newMutedState && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      currentUtteranceRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSampleQuestionClick = (question: string) => {
    setInputText(question);
    setShowSamples(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeywordClick = (keyword: string) => {
    const currentText = inputText.trim();
    const newText = currentText ? `${currentText} ${keyword}` : keyword;
    setInputText(newText);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${
            theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-100 text-teal-600'
          }`}>
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Ask Dr. CareEase</h1>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : theme === 'high-contrast' ? 'text-gray-200' : 'text-gray-600'
            }`}>
              Virtual Health Assistant for Disability-Related Questions
            </p>
            <div className="flex items-center gap-4">
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : theme === 'high-contrast' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Status: {isOnline ? '🟢 Online' : '🔴 Offline'} | All conversations are private and secure
              </p>
              <button
                onClick={toggleMute}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                  theme === 'high-contrast' 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label={isMuted ? "Unmute voice responses" : "Mute voice responses"}
                aria-pressed={isMuted}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isMuted ? 'Muted' : 'Voice On'}</span>
              </button>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowHelp(!showHelp)}
          aria-label="Show help information"
          className={`p-3 rounded-full text-2xl ${
            theme === 'high-contrast' ? 'bg-white text-black' : 'text-teal-600 hover:bg-teal-100'
          }`}
        >
          <HelpCircle className="w-8 h-8" />
        </button>
      </div>

      {showHelp && (
        <div className={`mb-6 p-6 rounded-lg ${
          theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <h2 className="text-2xl font-semibold mb-4">How to use Dr. CareEase</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="list-disc list-inside space-y-2">
              <li>Ask questions about disability-related health topics</li>
              <li>Use voice input by clicking the large microphone button</li>
              <li>Click on sample questions below to get started quickly</li>
              <li>Use keyword suggestions to help form your questions</li>
            </ul>
            <ul className="list-disc list-inside space-y-2">
              <li>All responses are automatically read aloud (unless muted)</li>
              <li>Works both online and offline</li>
              <li>Your conversations help improve the system</li>
              <li>Always consult healthcare providers for medical decisions</li>
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          {/* Doctor Avatar */}
          <div className={`mb-6 p-6 rounded-lg text-center ${
            theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          }`}>
            <div className={`w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center ${
              theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-100 text-teal-600'
            }`}>
              <User className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dr. CareEase</h3>
            <p className="text-lg">
              Hello! I'm here to help answer your disability-related health questions. 
              I can provide information, guidance, and support for various health concerns.
            </p>
          </div>

          {/* Messages */}
          <div className={`h-96 overflow-y-auto p-6 rounded-lg mb-6 ${
            theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className={`w-20 h-20 mx-auto mb-4 ${
                  theme === 'high-contrast' ? 'text-white' : 'text-gray-400'
                }`} />
                <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : theme === 'high-contrast' ? 'text-gray-200' : 'text-gray-600'}`}>
                  Start a conversation by asking a health-related question
                </p>
                <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : theme === 'high-contrast' ? 'text-gray-300' : 'text-gray-500'}`}>
                  Use the sample questions below or type your own
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-md px-6 py-4 rounded-lg ${
                      message.type === 'user'
                        ? (theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-600 text-white')
                        : (theme === 'high-contrast' ? 'bg-gray-800 text-white border border-white' : 
                           theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 shadow')
                    }`}>
                      {message.type === 'doctor' && (
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            <span className="font-semibold">Dr. CareEase</span>
                          </div>
                          <button
                            onClick={() => speakText(message.content)}
                            className={`p-2 rounded-full transition-colors ${
                              theme === 'high-contrast' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                            }`}
                            aria-label="Play audio of this response"
                            disabled={isMuted}
                          >
                            {isMuted ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}
                      <p className="text-base leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-teal-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className={`max-w-md px-6 py-4 rounded-lg ${
                      theme === 'high-contrast' ? 'bg-gray-800 text-white border border-white' : 
                      theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 shadow'
                    }`}>
                      <div className="flex items-center mb-2">
                        <User className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Dr. CareEase</span>
                      </div>
                      <p className="text-base">Thinking about your question...</p>
                      <div className="flex space-x-1 mt-3">
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className={`p-6 rounded-lg ${
            theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          }`}>
            {voiceInputSuccess && (
              <div className={`mb-4 p-3 rounded-lg flex items-center ${
                theme === 'high-contrast' ? 'bg-white text-black' : 'bg-green-100 text-green-800'
              }`}>
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">✅ Voice input received successfully!</span>
              </div>
            )}
            
            <div className="flex space-x-3">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your health concerns, disability-related questions, or type your symptoms..."
                rows={4}
                className={`flex-1 p-4 rounded-md resize-none text-lg ${
                  theme === 'high-contrast' 
                    ? 'bg-black text-white border border-white focus:ring-2 focus:ring-white' 
                    : theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-teal-500'
                      : 'border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500'
                }`}
                disabled={isProcessing}
                aria-label="Type your health question here"
              />
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    if (isRecording) {
                      stopVoiceInput();
                    } else {
                      startVoiceInput();
                    }
                  }}
                  disabled={isProcessing}
                  className={`p-4 rounded-md text-xl transition-colors ${
                    isRecording
                      ? (theme === 'high-contrast' ? 'bg-white text-black animate-pulse' : 'bg-red-500 text-white animate-pulse')
                      : (theme === 'high-contrast' ? 'bg-white text-black hover:bg-gray-200' : 'bg-teal-600 text-white hover:bg-teal-700')
                  } disabled:opacity-50`}
                  aria-label={isRecording ? "Stop recording your voice..." : "Click to use voice input"}
                >
                  {isRecording ? (
                    <VolumeX className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isProcessing}
                  className={`p-4 rounded-md text-xl transition-colors ${
                    !inputText.trim() || isProcessing
                      ? (theme === 'high-contrast' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                      : (theme === 'high-contrast' ? 'bg-white text-black hover:bg-gray-200' : 'bg-teal-600 text-white hover:bg-teal-700')
                  }`}
                  aria-label="Send your message"
                >
                  <Send className="w-8 h-8" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with Sample Questions and Keywords */}
        <div className="space-y-6">
          {/* Sample Questions */}
          {showSamples && (
            <div className={`p-6 rounded-lg ${
              theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
              theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
            }`}>
              <h3 className="text-xl font-semibold mb-4">Sample Questions</h3>
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-gray-300' : theme === 'high-contrast' ? 'text-gray-200' : 'text-gray-600'
              }`}>
                Click on any question to get started:
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleQuestionClick(question)}
                    className={`w-full text-left p-3 rounded-md text-sm transition-colors ${
                      theme === 'high-contrast' 
                        ? 'bg-gray-800 text-white border border-white hover:bg-gray-700' 
                        : theme === 'dark'
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                    }`}
                    aria-label={`Ask: ${question}`}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keyword Suggestions */}
          <div className={`p-6 rounded-lg ${
            theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          }`}>
            <h3 className="text-xl font-semibold mb-4">Health Keywords</h3>
            <p className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-gray-300' : theme === 'high-contrast' ? 'text-gray-200' : 'text-gray-600'
            }`}>
              Click to add keywords to your question:
            </p>
            <div className="flex flex-wrap gap-2">
              {keywordSuggestions.map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => handleKeywordClick(keyword)}
                  className={`px-3 py-2 rounded-full text-sm transition-colors ${
                    theme === 'high-contrast' 
                      ? 'bg-white text-black hover:bg-gray-200' 
                      : theme === 'dark'
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                  }`}
                  aria-label={`Add keyword: ${keyword}`}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Features */}
          <div className={`p-6 rounded-lg ${
            theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          }`}>
            <h3 className="text-xl font-semibold mb-4">Accessibility Features</h3>
            <ul className={`space-y-2 text-sm ${
              theme === 'dark' ? 'text-gray-300' : theme === 'high-contrast' ? 'text-gray-200' : 'text-gray-600'
            }`}>
              <li>🎤 Voice input for hands-free typing</li>
              <li>🔊 Automatic audio responses (with mute option)</li>
              <li>🔍 High contrast mode available</li>
              <li>⌨️ Full keyboard navigation</li>
              <li>📱 Mobile-friendly interface</li>
              <li>🌐 Works offline</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className={`mt-8 p-6 rounded-lg text-base ${
        theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
        theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <p className={`font-semibold mb-2 ${theme === 'high-contrast' ? 'text-white' : theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'}`}>
          🏥 Important Medical Disclaimer:
        </p>
        <p className={theme === 'high-contrast' ? 'text-gray-200' : theme === 'dark' ? 'text-gray-300' : 'text-yellow-700'}>
          This virtual assistant provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. 
          Always consult with qualified healthcare providers for medical decisions and urgent health concerns. If you're experiencing a medical emergency, 
          call emergency services immediately.
        </p>
      </div>
    </div>
  );
};

export default AskDoctor;