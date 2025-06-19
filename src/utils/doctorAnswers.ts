// Local knowledge base for offline doctor responses
interface DoctorAnswer {
  question: string;
  answer: string;
  keywords: string[];
  category: string;
}

// Comprehensive initial knowledge base with 20+ sample questions
const initialAnswers: DoctorAnswer[] = [
  {
    question: "How can I manage chronic pain with a disability?",
    answer: "Managing chronic pain with a disability requires a comprehensive approach. Work with your healthcare team to develop a pain management plan that may include medication, physical therapy, occupational therapy, and lifestyle modifications. Consider keeping a pain diary to track patterns and triggers. Don't hesitate to seek help from pain specialists, and remember that mental health support is also important for chronic pain management.",
    keywords: ["chronic", "pain", "disability", "manage", "hurt", "ache"],
    category: "pain-management"
  },
  {
    question: "What exercises can I do with limited mobility?",
    answer: "There are many exercises you can do with limited mobility! Chair exercises, resistance band workouts, swimming (if accessible), and upper body strengthening are great options. Work with a physical therapist to develop a safe exercise program tailored to your abilities. Many community centers offer adaptive fitness programs. Even small movements like stretching and range-of-motion exercises can be beneficial.",
    keywords: ["exercise", "mobility", "limited", "wheelchair", "fitness", "movement"],
    category: "mobility"
  },
  {
    question: "Can I get vaccinated if I'm using a wheelchair?",
    answer: "Absolutely! Using a wheelchair does not prevent you from getting vaccinated. Healthcare facilities are required to provide accessible vaccination sites. You can receive vaccines while remaining in your wheelchair. If you have concerns about specific vaccines due to your medical condition, discuss them with your healthcare provider, but wheelchair use itself is not a contraindication for vaccination.",
    keywords: ["vaccine", "vaccination", "wheelchair", "immunization", "shot"],
    category: "general-health"
  },
  {
    question: "What assistive technologies are available for vision impairment?",
    answer: "There are many assistive technologies for vision impairment, including screen readers like JAWS or NVDA, magnification software, braille displays, talking devices, and smartphone apps with voice guidance. Smart home devices can also help with daily tasks. Contact your local services for the blind or low vision rehabilitation services for personalized assessments and training.",
    keywords: ["vision", "blind", "sight", "assistive", "technology", "screen reader"],
    category: "vision"
  },
  {
    question: "How do I maintain independence with mobility limitations?",
    answer: "Maintaining independence with mobility limitations involves using appropriate assistive devices, modifying your environment, and developing adaptive strategies. Consider working with an occupational therapist to assess your home and recommend modifications. Mobility aids like wheelchairs, walkers, or scooters can help. Don't forget about transportation options and community resources that support independent living.",
    keywords: ["mobility", "wheelchair", "walker", "independence", "movement"],
    category: "mobility"
  },
  {
    question: "What should I know about hearing aids and assistive listening devices?",
    answer: "Modern hearing aids are much more advanced and discreet than older models. They can significantly improve quality of life. Besides hearing aids, there are assistive listening devices for phones, TVs, and public spaces. Consider seeing an audiologist for a comprehensive hearing evaluation. Many insurance plans cover hearing aids, and there are also programs that provide financial assistance.",
    keywords: ["hearing", "deaf", "hearing aid", "assistive listening", "audiologist"],
    category: "hearing"
  },
  {
    question: "How can I communicate my needs to healthcare providers?",
    answer: "Effective communication with healthcare providers is crucial. Prepare for appointments by writing down your questions and concerns. Be specific about your symptoms and how they affect your daily life. Don't hesitate to ask for clarification if you don't understand something. Consider bringing a trusted friend or family member to appointments. If you need accommodations like sign language interpreters, request them in advance.",
    keywords: ["communicate", "healthcare", "provider", "doctor", "appointment"],
    category: "communication"
  },
  {
    question: "What mental health resources are available for people with disabilities?",
    answer: "Mental health is just as important as physical health. Many therapists specialize in working with people with disabilities. Look for accessible therapy offices or telehealth options. Support groups, both in-person and online, can be very helpful. Don't ignore signs of depression or anxiety - they're treatable conditions. Contact your local disability services organization for mental health resources in your area.",
    keywords: ["mental health", "depression", "anxiety", "therapy", "counseling"],
    category: "mental-health"
  },
  {
    question: "How do I manage multiple medications safely?",
    answer: "Managing multiple medications requires organization and communication with your healthcare team. Use a pill organizer or medication app to track doses and timing. Keep an updated list of all medications, including over-the-counter drugs and supplements. Never stop medications without consulting your doctor. Set up regular medication reviews with your pharmacist or doctor. Watch for side effects and drug interactions.",
    keywords: ["medication", "medicine", "prescription", "pills", "drugs"],
    category: "medication"
  },
  {
    question: "What are my rights for workplace accommodations?",
    answer: "Under the Americans with Disabilities Act (ADA), you have the right to reasonable accommodations in the workplace if you have a qualifying disability. This might include modified work schedules, assistive technology, accessible workspaces, or job restructuring. Start by discussing your needs with HR or your supervisor. Document all requests and communications. Contact the EEOC if you face discrimination.",
    keywords: ["workplace", "accommodation", "ADA", "rights", "employment", "job"],
    category: "legal-rights"
  },
  {
    question: "How can I prevent pressure sores if I use a wheelchair?",
    answer: "Preventing pressure sores is crucial for wheelchair users. Change positions frequently (every 15-30 minutes), use proper cushioning, maintain good hygiene, and inspect your skin daily. Ensure your wheelchair fits properly and consider pressure-relieving cushions. Stay well-hydrated and maintain good nutrition. If you notice any red areas or skin changes, contact your healthcare provider immediately.",
    keywords: ["pressure sores", "wheelchair", "skin", "prevention", "cushion"],
    category: "mobility"
  },
  {
    question: "What should I do if I'm experiencing depression related to my disability?",
    answer: "Depression is common among people with disabilities and is very treatable. Reach out to a mental health professional who has experience with disability-related issues. Consider both individual therapy and support groups. Don't isolate yourself - maintain social connections. Regular exercise (adapted to your abilities), good sleep habits, and engaging in meaningful activities can help. If you're having thoughts of self-harm, seek immediate help.",
    keywords: ["depression", "disability", "mental health", "therapy", "mood"],
    category: "mental-health"
  },
  {
    question: "How do I find accessible housing?",
    answer: "Finding accessible housing requires research and patience. Look for properties that meet ADA guidelines or can be modified. Contact local disability organizations, housing authorities, and real estate agents who specialize in accessible properties. Consider factors like ramp access, doorway widths, bathroom accessibility, and proximity to services. Some programs offer financial assistance for accessibility modifications.",
    keywords: ["housing", "accessible", "ADA", "home", "modifications"],
    category: "daily-living"
  },
  {
    question: "What are the signs of autonomic dysreflexia?",
    answer: "Autonomic dysreflexia is a serious condition that can occur in people with spinal cord injuries above T6. Signs include sudden high blood pressure, severe headache, sweating above the injury level, flushed skin, nasal congestion, and slow heart rate. This is a medical emergency. Remove or address the triggering stimulus (full bladder, tight clothing, etc.) and seek immediate medical attention if symptoms don't resolve quickly.",
    keywords: ["autonomic dysreflexia", "spinal cord", "blood pressure", "headache", "emergency"],
    category: "emergency"
  },
  {
    question: "How can I improve my speech after a stroke?",
    answer: "Speech recovery after stroke often improves with time and therapy. Work with a speech-language pathologist who can assess your specific needs and develop a treatment plan. Practice exercises regularly, be patient with yourself, and consider using communication aids if needed. Family support is important - ask loved ones to be patient and give you time to communicate. Some people benefit from technology-assisted communication devices.",
    keywords: ["speech", "stroke", "communication", "therapy", "language"],
    category: "communication"
  },
  {
    question: "What adaptive equipment can help with daily tasks?",
    answer: "There's a wide range of adaptive equipment available for daily tasks. Kitchen aids include jar openers, adaptive utensils, and reachers. Bathroom equipment includes grab bars, shower chairs, and raised toilet seats. Dressing aids include button hooks, zipper pulls, and sock aids. An occupational therapist can assess your needs and recommend specific equipment. Many items are available through medical supply companies or online.",
    keywords: ["adaptive equipment", "daily tasks", "assistive devices", "independence"],
    category: "daily-living"
  },
  {
    question: "How do I manage fatigue with a chronic condition?",
    answer: "Managing fatigue with chronic conditions requires energy conservation strategies. Pace yourself throughout the day, prioritize important activities, and take regular breaks. Maintain a consistent sleep schedule and create a restful environment. Light exercise, as tolerated, can actually help with energy levels. Consider working with an occupational therapist to learn energy conservation techniques. Don't hesitate to ask for help when needed.",
    keywords: ["fatigue", "chronic condition", "energy", "tired", "exhaustion"],
    category: "symptom-management"
  },
  {
    question: "What should I know about traveling with a disability?",
    answer: "Traveling with a disability requires extra planning but is definitely possible. Research accessibility at your destination, including hotels, transportation, and attractions. Notify airlines about your needs in advance and know your rights under the Air Carrier Access Act. Pack extra supplies and medications. Consider travel insurance that covers disability-related needs. Many travel agencies specialize in accessible travel and can help with planning.",
    keywords: ["travel", "disability", "accessible", "transportation", "vacation"],
    category: "daily-living"
  },
  {
    question: "How can I maintain my sexual health with a disability?",
    answer: "Sexual health is an important part of overall well-being for people with disabilities. Communicate openly with your partner about your needs and concerns. Consider consulting with a healthcare provider who has experience with disability and sexuality. There are adaptive techniques, positions, and devices that can help. Don't let embarrassment prevent you from seeking information and support - sexual health is a normal part of healthcare.",
    keywords: ["sexual health", "intimacy", "disability", "relationships"],
    category: "sexual-health"
  },
  {
    question: "What are the warning signs of a urinary tract infection?",
    answer: "UTI symptoms can include burning during urination, frequent urination, cloudy or strong-smelling urine, pelvic pain, and fever. For people with spinal cord injuries or other conditions affecting sensation, symptoms might be different - watch for increased spasticity, autonomic dysreflexia, or changes in urine appearance or smell. UTIs can be serious if untreated, so contact your healthcare provider if you suspect an infection.",
    keywords: ["UTI", "urinary tract infection", "bladder", "infection", "urine"],
    category: "health-conditions"
  },
  {
    question: "How do I advocate for myself in healthcare settings?",
    answer: "Self-advocacy in healthcare is crucial. Come prepared with questions and concerns written down. Bring a support person if helpful. Be clear about your needs and don't be afraid to speak up if something doesn't feel right. Ask for explanations in terms you understand. Know your rights, including the right to accessible communication and reasonable accommodations. If you're not satisfied with care, ask to speak with a supervisor or patient advocate.",
    keywords: ["advocacy", "healthcare", "rights", "self-advocacy", "patient rights"],
    category: "advocacy"
  },
  {
    question: "What resources are available for caregivers of people with disabilities?",
    answer: "Caregivers need support too! Look for local caregiver support groups, respite care services, and educational programs. Many organizations offer caregiver training and resources. Don't neglect your own health - schedule regular check-ups and take breaks when possible. Consider counseling if you're feeling overwhelmed. Online communities can provide 24/7 support and advice from other caregivers in similar situations.",
    keywords: ["caregiver", "support", "respite", "family", "care"],
    category: "caregiver-support"
  },
  {
    question: "How can I manage bowel and bladder issues?",
    answer: "Bowel and bladder management is important for health and quality of life. Work with your healthcare team to develop a management program that works for you. This might include scheduled toileting, dietary modifications, medications, or assistive devices. Stay hydrated but time fluid intake appropriately. Keep track of patterns and what works best. Don't be embarrassed to discuss these issues with your healthcare providers - they're trained to help.",
    keywords: ["bowel", "bladder", "incontinence", "catheter", "management"],
    category: "health-management"
  }
];

// Sample questions for the UI
const sampleQuestions = [
  "How can I manage chronic pain with a disability?",
  "What exercises can I do with limited mobility?",
  "Can I get vaccinated if I'm using a wheelchair?",
  "What assistive technologies are available for vision impairment?",
  "How do I maintain independence with mobility limitations?",
  "What should I know about hearing aids and assistive listening devices?",
  "How can I communicate my needs to healthcare providers?",
  "What mental health resources are available for people with disabilities?",
  "How do I manage multiple medications safely?",
  "What are my rights for workplace accommodations?",
  "How can I prevent pressure sores if I use a wheelchair?",
  "What should I do if I'm experiencing depression related to my disability?",
  "How do I find accessible housing?",
  "What are the signs of autonomic dysreflexia?",
  "How can I improve my speech after a stroke?",
  "What adaptive equipment can help with daily tasks?",
  "How do I manage fatigue with a chronic condition?",
  "What should I know about traveling with a disability?",
  "How can I maintain my sexual health with a disability?",
  "What are the warning signs of a urinary tract infection?",
  "How do I advocate for myself in healthcare settings?",
  "What resources are available for caregivers of people with disabilities?",
  "How can I manage bowel and bladder issues?"
];

// Keyword suggestions organized by category
const keywordSuggestions = [
  // Pain and symptoms
  "pain", "chronic pain", "headache", "fatigue", "spasticity",
  // Mobility
  "wheelchair", "mobility", "walking", "balance", "transfers",
  // Vision
  "vision", "blind", "low vision", "glasses", "magnification",
  // Hearing
  "hearing", "deaf", "hearing aid", "tinnitus", "communication",
  // Mental health
  "depression", "anxiety", "stress", "mood", "counseling",
  // Daily living
  "independence", "adaptive equipment", "home modifications", "transportation",
  // Medical care
  "medication", "doctor", "therapy", "treatment", "symptoms",
  // Specific conditions
  "stroke", "spinal cord", "multiple sclerosis", "cerebral palsy", "autism",
  // Body functions
  "bladder", "bowel", "breathing", "swallowing", "skin care"
];

// Load answers from localStorage or use initial set
let doctorAnswers: DoctorAnswer[] = [];

const loadAnswers = () => {
  try {
    const stored = localStorage.getItem('doctorAnswers');
    if (stored) {
      doctorAnswers = JSON.parse(stored);
    } else {
      doctorAnswers = [...initialAnswers];
      saveAnswers();
    }
  } catch (error) {
    console.error('Error loading doctor answers:', error);
    doctorAnswers = [...initialAnswers];
  }
};

const saveAnswers = () => {
  try {
    localStorage.setItem('doctorAnswers', JSON.stringify(doctorAnswers));
  } catch (error) {
    console.error('Error saving doctor answers:', error);
  }
};

// Initialize on module load
loadAnswers();

// Simple fuzzy matching function using Levenshtein distance
const calculateSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

export const findBestAnswer = (question: string): string => {
  const normalizedQuestion = question.toLowerCase().trim();
  
  let bestMatch: DoctorAnswer | null = null;
  let bestScore = 0;
  
  // First, try keyword matching with weighted scoring
  for (const answer of doctorAnswers) {
    let keywordScore = 0;
    let totalKeywords = answer.keywords.length;
    
    for (const keyword of answer.keywords) {
      if (normalizedQuestion.includes(keyword.toLowerCase())) {
        // Give higher weight to longer, more specific keywords
        const keywordWeight = keyword.length > 5 ? 2 : 1;
        keywordScore += keywordWeight;
      }
    }
    
    if (keywordScore > 0) {
      const keywordRatio = keywordScore / (totalKeywords * 1.5); // Adjust for weighted scoring
      if (keywordRatio > bestScore) {
        bestScore = keywordRatio;
        bestMatch = answer;
      }
    }
  }
  
  // If no good keyword match, try fuzzy matching on questions
  if (bestScore < 0.4) {
    for (const answer of doctorAnswers) {
      const similarity = calculateSimilarity(normalizedQuestion, answer.question.toLowerCase());
      if (similarity > bestScore && similarity > 0.4) {
        bestScore = similarity;
        bestMatch = answer;
      }
    }
  }
  
  if (bestMatch && bestScore > 0.3) {
    return bestMatch.answer;
  }
  
  // Enhanced default response with more helpful guidance
  return "I understand you have a health-related question, but I don't have specific information about that topic in my current knowledge base. Here are some suggestions:\n\n• Try rephrasing your question using different keywords\n• Check the sample questions for similar topics\n• For urgent concerns, contact your healthcare provider immediately\n• For non-urgent questions, consider scheduling an appointment with your doctor\n• You can also contact disability-specific organizations for specialized guidance\n\nRemember, I'm here to provide general information, but your healthcare provider can give you personalized advice based on your specific situation.";
};

export const saveNewQuestion = (question: string, answer: string): void => {
  // Extract potential keywords from the question
  const words = question.toLowerCase().split(/\s+/);
  const stopWords = ['what', 'how', 'when', 'where', 'why', 'who', 'can', 'will', 'should', 'would', 'could', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const keywords = words.filter(word => 
    word.length > 3 && 
    !stopWords.includes(word) &&
    /^[a-zA-Z]+$/.test(word) // Only alphabetic words
  ).slice(0, 8); // Limit to 8 keywords
  
  // Determine category based on keywords
  let category = 'general';
  if (keywords.some(k => ['pain', 'hurt', 'ache', 'chronic'].includes(k))) category = 'pain-management';
  else if (keywords.some(k => ['vision', 'blind', 'sight', 'see', 'eyes'].includes(k))) category = 'vision';
  else if (keywords.some(k => ['hearing', 'deaf', 'ear', 'sound'].includes(k))) category = 'hearing';
  else if (keywords.some(k => ['mobility', 'wheelchair', 'walk', 'movement'].includes(k))) category = 'mobility';
  else if (keywords.some(k => ['mental', 'depression', 'anxiety', 'mood'].includes(k))) category = 'mental-health';
  else if (keywords.some(k => ['medication', 'medicine', 'prescription', 'pills'].includes(k))) category = 'medication';
  else if (keywords.some(k => ['exercise', 'fitness', 'therapy', 'rehabilitation'].includes(k))) category = 'therapy';
  
  const newAnswer: DoctorAnswer = {
    question: question.trim(),
    answer: answer,
    keywords: keywords,
    category
  };
  
  // Check if similar question already exists (avoid duplicates)
  const existingIndex = doctorAnswers.findIndex(existing => 
    calculateSimilarity(existing.question.toLowerCase(), question.toLowerCase()) > 0.85
  );
  
  if (existingIndex === -1) {
    doctorAnswers.push(newAnswer);
    saveAnswers();
  }
};

export const getSampleQuestions = (): string[] => {
  return [...sampleQuestions];
};

export const getKeywordSuggestions = (): string[] => {
  return [...keywordSuggestions];
};

export const getAllAnswers = (): DoctorAnswer[] => {
  return [...doctorAnswers];
};

export const getAnswersByCategory = (category: string): DoctorAnswer[] => {
  return doctorAnswers.filter(answer => answer.category === category);
};