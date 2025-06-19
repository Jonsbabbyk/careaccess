// Simple rule-based AI assistant for basic conversations
// This doesn't require any external APIs and works entirely offline

interface AIResponse {
  response: string;
  confidence: number;
}

interface ConversationPattern {
  keywords: string[];
  responses: string[];
  category: string;
}

// Comprehensive conversation patterns for a healthcare AI assistant
const conversationPatterns: ConversationPattern[] = [
  // Greetings
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    responses: [
      "Hello! I'm your AI health assistant. How can I help you today?",
      "Hi there! I'm here to help with your health questions. What would you like to know?",
      "Good day! I'm ready to assist you with health-related questions. How may I help?"
    ],
    category: 'greeting'
  },
  
  // Pain-related queries
  {
    keywords: ['pain', 'hurt', 'ache', 'sore', 'chronic pain', 'headache', 'back pain'],
    responses: [
      "I understand you're experiencing pain. Pain management is important for quality of life. Consider keeping a pain diary to track patterns and triggers. For chronic pain, work with your healthcare team to develop a comprehensive management plan that may include medication, therapy, and lifestyle changes.",
      "Pain can significantly impact daily activities. Some general strategies include gentle exercise as tolerated, stress management, proper sleep, and working with healthcare professionals. If pain is severe or persistent, please consult with a doctor.",
      "Managing pain effectively often requires a multi-faceted approach. This might include physical therapy, occupational therapy, medication management, and sometimes psychological support. Don't hesitate to seek professional help."
    ],
    category: 'pain'
  },
  
  // Mobility and wheelchair questions
  {
    keywords: ['wheelchair', 'mobility', 'walking', 'movement', 'paralyzed', 'spinal cord'],
    responses: [
      "Mobility challenges can be addressed in many ways. Working with physical and occupational therapists can help optimize your mobility and independence. There are many assistive devices and home modifications that can help.",
      "For wheelchair users, it's important to focus on pressure relief, proper positioning, and maintaining upper body strength. Regular skin checks and proper cushioning are essential for preventing pressure sores.",
      "Mobility limitations don't have to limit your independence. There are many adaptive techniques, assistive technologies, and community resources available to help you maintain an active lifestyle."
    ],
    category: 'mobility'
  },
  
  // Vision-related queries
  {
    keywords: ['vision', 'blind', 'sight', 'see', 'eyes', 'visual', 'low vision'],
    responses: [
      "Vision changes can be concerning. Regular eye exams are important for everyone. If you're experiencing sudden vision changes, this should be evaluated promptly by an eye care professional.",
      "There are many assistive technologies available for people with vision impairments, including screen readers, magnification software, and smartphone apps designed for accessibility.",
      "Living with vision loss can be challenging, but there are many resources and strategies available. Organizations like the National Federation of the Blind offer excellent support and training programs."
    ],
    category: 'vision'
  },
  
  // Hearing-related queries
  {
    keywords: ['hearing', 'deaf', 'ear', 'sound', 'hearing aid', 'tinnitus'],
    responses: [
      "Hearing health is important for communication and safety. If you're experiencing hearing changes, consider seeing an audiologist for a comprehensive evaluation.",
      "Modern hearing aids are much more advanced and discreet than older models. There are also many assistive listening devices available for different situations.",
      "Communication strategies can be very helpful for people with hearing loss. This might include lip reading, sign language, or using visual cues and written communication."
    ],
    category: 'hearing'
  },
  
  // Mental health queries
  {
    keywords: ['depression', 'anxiety', 'stress', 'mental health', 'sad', 'worried', 'counseling'],
    responses: [
      "Mental health is just as important as physical health. It's completely normal and healthy to seek mental health support when you need it.",
      "People with disabilities may face additional stressors, and it's important to address mental health concerns. Look for therapists who have experience working with people with disabilities.",
      "Support groups, both in-person and online, can be very helpful for mental health. Don't ignore signs of depression or anxiety - they are treatable conditions."
    ],
    category: 'mental-health'
  },
  
  // Medication queries
  {
    keywords: ['medication', 'medicine', 'prescription', 'pills', 'drugs', 'side effects'],
    responses: [
      "Managing medications safely is crucial. Always take medications exactly as prescribed and don't stop without consulting your doctor. Use pill organizers or apps to help stay organized.",
      "If you're experiencing side effects from medications, don't stop taking them without talking to your healthcare provider first. They may be able to adjust the dose or switch to a different medication.",
      "Keep an updated list of all your medications, including over-the-counter drugs and supplements. This is important information to share with all your healthcare providers."
    ],
    category: 'medication'
  },
  
  // Exercise and fitness
  {
    keywords: ['exercise', 'fitness', 'workout', 'physical activity', 'gym', 'sports'],
    responses: [
      "Regular physical activity is beneficial for everyone, including people with disabilities. The key is finding activities that work for your specific abilities and limitations.",
      "Consider working with a physical therapist or adaptive fitness specialist who can design a safe, effective exercise program tailored to your needs.",
      "Many gyms and community centers offer adaptive fitness programs. Swimming, chair exercises, and adaptive sports are great options for many people with disabilities."
    ],
    category: 'exercise'
  },
  
  // Emergency situations
  {
    keywords: ['emergency', 'urgent', 'serious', 'hospital', '911', 'ambulance'],
    responses: [
      "If this is a medical emergency, please call 911 or your local emergency number immediately. Don't delay seeking emergency care.",
      "For urgent medical concerns, contact your healthcare provider right away or go to the nearest emergency room. Your safety is the top priority.",
      "I'm not able to handle medical emergencies. Please seek immediate professional medical help if you're experiencing a serious health issue."
    ],
    category: 'emergency'
  },
  
  // General health questions
  {
    keywords: ['health', 'doctor', 'medical', 'symptoms', 'treatment', 'diagnosis'],
    responses: [
      "For specific medical questions, it's always best to consult with your healthcare provider who can evaluate your individual situation and provide personalized advice.",
      "I can provide general health information, but I cannot diagnose conditions or recommend specific treatments. Please work with qualified healthcare professionals for medical decisions.",
      "Maintaining good health involves regular check-ups, following medical advice, staying active as able, eating well, and managing stress. Your healthcare team can help you develop a plan that works for you."
    ],
    category: 'general-health'
  },
  
  // Accessibility and rights
  {
    keywords: ['accessibility', 'rights', 'discrimination', 'accommodation', 'ADA', 'workplace'],
    responses: [
      "You have rights under the Americans with Disabilities Act (ADA) to reasonable accommodations in employment, public accommodations, and other areas. Don't hesitate to advocate for yourself.",
      "Workplace accommodations might include modified schedules, assistive technology, accessible workspaces, or job restructuring. Start by discussing your needs with HR or your supervisor.",
      "If you face discrimination, document everything and consider contacting the Equal Employment Opportunity Commission (EEOC) or other appropriate agencies for help."
    ],
    category: 'rights'
  },
  
  // Gratitude and positive responses
  {
    keywords: ['thank you', 'thanks', 'appreciate', 'helpful', 'good', 'great'],
    responses: [
      "You're very welcome! I'm glad I could help. Remember, I'm here whenever you have questions about health and disability topics.",
      "I'm happy to help! Don't hesitate to ask if you have more questions. Your health and well-being are important.",
      "Thank you for the kind words! I'm here to support you with health information and resources whenever you need them."
    ],
    category: 'gratitude'
  },
  
  // Goodbye
  {
    keywords: ['goodbye', 'bye', 'see you', 'talk later', 'farewell'],
    responses: [
      "Goodbye! Take care of yourself, and remember that I'm here if you need health information or support in the future.",
      "Take care! Remember to prioritize your health and don't hesitate to reach out to healthcare professionals when needed.",
      "Farewell! Wishing you good health and wellness. I'm always here if you need assistance with health-related questions."
    ],
    category: 'goodbye'
  }
];

// Simple sentiment analysis
const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
  const positiveWords = ['good', 'great', 'excellent', 'wonderful', 'amazing', 'fantastic', 'happy', 'pleased', 'satisfied'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'sad', 'angry', 'frustrated', 'worried', 'scared', 'pain', 'hurt'];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

// Calculate similarity between user input and pattern keywords
const calculatePatternMatch = (userInput: string, pattern: ConversationPattern): number => {
  const userWords = userInput.toLowerCase().split(/\s+/);
  let matchCount = 0;
  let totalKeywords = pattern.keywords.length;
  
  pattern.keywords.forEach(keyword => {
    const keywordWords = keyword.toLowerCase().split(/\s+/);
    
    // Check for exact phrase match
    if (userInput.toLowerCase().includes(keyword.toLowerCase())) {
      matchCount += keywordWords.length * 2; // Give higher weight to phrase matches
    } else {
      // Check for individual word matches
      keywordWords.forEach(keywordWord => {
        if (userWords.includes(keywordWord)) {
          matchCount += 1;
        }
      });
    }
  });
  
  // Normalize the score
  return matchCount / (totalKeywords * 2);
};

// Main AI response function
export const getAIResponse = (userInput: string): AIResponse => {
  if (!userInput.trim()) {
    return {
      response: "I'm here to help! Please feel free to ask me any health-related questions or tell me what's on your mind.",
      confidence: 1.0
    };
  }
  
  // Find the best matching pattern
  let bestMatch: ConversationPattern | null = null;
  let bestScore = 0;
  
  conversationPatterns.forEach(pattern => {
    const score = calculatePatternMatch(userInput, pattern);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = pattern;
    }
  });
  
  // If we found a good match, use it
  if (bestMatch && bestScore > 0.1) {
    const responses = bestMatch.responses;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Adjust response based on sentiment
    const sentiment = analyzeSentiment(userInput);
    let finalResponse = randomResponse;
    
    if (sentiment === 'negative' && bestMatch.category !== 'emergency') {
      finalResponse += " I understand this can be challenging. Remember that seeking help and support is always a good step.";
    } else if (sentiment === 'positive') {
      finalResponse += " I'm glad to hear you're taking a positive approach to your health!";
    }
    
    return {
      response: finalResponse,
      confidence: Math.min(bestScore * 2, 0.9) // Cap confidence at 0.9
    };
  }
  
  // Fallback responses for when no pattern matches well
  const fallbackResponses = [
    "I understand you have a question about health or disability topics. While I can provide general information, I'd recommend discussing specific concerns with a healthcare professional who can give you personalized advice.",
    "That's an interesting question. For the most accurate and personalized information, I'd suggest consulting with a healthcare provider who can better understand your specific situation.",
    "I want to help, but I may not have specific information about that topic. Healthcare professionals would be the best source for detailed medical advice and guidance.",
    "Thank you for your question. While I can offer general health information, it's always best to consult with qualified healthcare providers for specific medical concerns or advice."
  ];
  
  const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  
  return {
    response: randomFallback,
    confidence: 0.3
  };
};

// Function to get conversation starters
export const getConversationStarters = (): string[] => {
  return [
    "How can I manage chronic pain better?",
    "What are some good exercises for people with limited mobility?",
    "How do I advocate for myself in healthcare settings?",
    "What assistive technologies are available for daily living?",
    "How can I maintain my mental health while dealing with a disability?",
    "What should I know about medication management?",
    "How do I find accessible housing?",
    "What are my rights under the ADA?",
    "How can I stay active with my condition?",
    "What resources are available for caregivers?"
  ];
};

// Function to analyze conversation context for better responses
export const analyzeConversationContext = (conversationHistory: string[]): string => {
  if (conversationHistory.length === 0) {
    return "This appears to be the start of our conversation.";
  }
  
  const recentMessages = conversationHistory.slice(-3).join(' ').toLowerCase();
  
  if (recentMessages.includes('pain') || recentMessages.includes('hurt')) {
    return "We've been discussing pain management.";
  }
  
  if (recentMessages.includes('wheelchair') || recentMessages.includes('mobility')) {
    return "Our conversation has focused on mobility topics.";
  }
  
  if (recentMessages.includes('medication') || recentMessages.includes('medicine')) {
    return "We've been talking about medication-related topics.";
  }
  
  return "We've been having a general health discussion.";
};