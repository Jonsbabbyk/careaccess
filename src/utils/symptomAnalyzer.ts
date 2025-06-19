// This is a simplified symptom analyzer that would be replaced with a more robust system
// In a real app, this would use a comprehensive medical database

interface ConditionMatch {
  condition: string;
  probability: string;
  advice: string;
}

// Sample medical knowledge base
const knowledgeBase = [
  {
    symptoms: ['headache', 'head', 'fever', 'fatigue'],
    conditions: [
      {
        name: 'Common Cold',
        probability: 70,
        advice: 'Rest, stay hydrated, and take over-the-counter pain relievers if needed. Contact a healthcare provider if symptoms worsen or persist beyond a week.'
      },
      {
        name: 'Flu',
        probability: 60, 
        advice: 'Rest, stay hydrated, and monitor your temperature. Consider over-the-counter flu medications. Contact a healthcare provider if symptoms are severe or you have underlying health conditions.'
      },
      {
        name: 'Migraine',
        probability: 40,
        advice: 'Rest in a quiet, dark room. Try over-the-counter pain medications. If migraines are recurring, consult a healthcare provider for preventive treatments.'
      }
    ]
  },
  {
    symptoms: ['cough', 'chest', 'chest pain', 'shortness of breath', 'breathing difficulty'],
    conditions: [
      {
        name: 'Bronchitis',
        probability: 65,
        advice: 'Rest, stay hydrated, and use a humidifier to ease breathing. Avoid smoking or secondhand smoke. Consult a healthcare provider if symptoms worsen or persist.'
      },
      {
        name: 'Common Cold',
        probability: 60,
        advice: 'Rest, stay hydrated, and consider over-the-counter cough medications. Use honey (if over 1 year old) to soothe throat. Contact a healthcare provider if symptoms persist beyond 10 days.'
      },
      {
        name: 'Asthma',
        probability: 45,
        advice: 'Use a prescribed inhaler if available. Sit upright to facilitate breathing. Seek immediate medical attention if having severe difficulty breathing or symptoms don`t improve quickly with medication.'
      }
    ]
  },
  {
    symptoms: ['stomach', 'stomach pain', 'nausea', 'vomiting', 'diarrhea'],
    conditions: [
      {
        name: 'Gastroenteritis',
        probability: 75,
        advice: 'Stay hydrated with small sips of clear fluids. Rest and avoid solid foods until vomiting stops. Gradually reintroduce bland foods. Seek medical attention if unable to keep fluids down or symptoms are severe.'
      },
      {
        name: 'Food Poisoning',
        probability: 65,
        advice: 'Stay hydrated and rest. Avoid solid foods until symptoms improve, then gradually reintroduce bland foods. Seek medical attention if symptoms are severe or persist beyond 48 hours.'
      },
      {
        name: 'Irritable Bowel Syndrome',
        probability: 40,
        advice: 'Try to identify and avoid trigger foods. Manage stress through relaxation techniques. Consider over-the-counter antidiarrheal medications if appropriate. Consult a healthcare provider for chronic symptoms.'
      }
    ]
  },
  {
    symptoms: ['rash', 'skin', 'itching', 'swelling'],
    conditions: [
      {
        name: 'Contact Dermatitis',
        probability: 70,
        advice: 'Avoid the suspected irritant. Apply cool, wet compresses and consider over-the-counter hydrocortisone cream. Take an antihistamine for itching if needed. Seek medical attention if the rash is severe or spreads.'
      },
      {
        name: 'Eczema',
        probability: 55,
        advice: 'Keep skin moisturized with fragrance-free lotions. Avoid hot water and harsh soaps. Consider over-the-counter hydrocortisone cream for flare-ups. Consult a healthcare provider for recurring or severe symptoms.'
      },
      {
        name: 'Allergic Reaction',
        probability: 50,
        advice: 'Take an antihistamine if available. Apply cool compresses to affected areas. Seek immediate medical attention if experiencing difficulty breathing, throat tightness, or severe swelling.'
      }
    ]
  },
  {
    symptoms: ['sore throat', 'throat', 'difficulty swallowing'],
    conditions: [
      {
        name: 'Strep Throat',
        probability: 65,
        advice: 'Rest and stay hydrated. Gargle with warm salt water. Consider over-the-counter pain relievers. Consult a healthcare provider as antibiotics may be needed if caused by streptococcal bacteria.'
      },
      {
        name: 'Common Cold',
        probability: 60,
        advice: 'Rest, stay hydrated, and use throat lozenges for temporary relief. Try warm liquids like tea with honey. Seek medical attention if symptoms worsen or persist beyond a week.'
      },
      {
        name: 'Tonsillitis',
        probability: 55,
        advice: 'Rest and stay hydrated. Use warm salt water gargles and over-the-counter pain relievers. Consult a healthcare provider if you have a high fever, severe symptoms, or difficulty breathing or swallowing.'
      }
    ]
  }
];

export function analyzeSymptoms(symptoms: string[]): ConditionMatch[] {
  // Normalize symptoms to lowercase for matching
  const normalizedSymptoms = symptoms.map(s => s.toLowerCase());
  
  let possibleConditions: ConditionMatch[] = [];
  
  // Find matching symptom groups in our knowledge base
  knowledgeBase.forEach(group => {
    const matchingSymptoms = group.symptoms.filter(s => 
      normalizedSymptoms.some(userSymptom => 
        userSymptom.includes(s) || s.includes(userSymptom)
      )
    );
    
    // If there are matching symptoms, add the associated conditions
    if (matchingSymptoms.length > 0) {
      const matchRatio = matchingSymptoms.length / normalizedSymptoms.length;
      
      group.conditions.forEach(condition => {
        // Adjust probability based on symptom match ratio
        let adjustedProbability = Math.round(condition.probability * matchRatio);
        
        // Ensure probability is between 20 and 90
        adjustedProbability = Math.min(90, Math.max(20, adjustedProbability));
        
        possibleConditions.push({
          condition: condition.name,
          probability: adjustedProbability.toString(),
          advice: condition.advice
        });
      });
    }
  });
  
  // If no conditions found, provide a generic response
  if (possibleConditions.length === 0) {
    possibleConditions = [{
      condition: 'Unrecognized Symptoms',
      probability: '20',
      advice: 'Your symptoms don\'t clearly match common conditions in our database. Consider consulting a healthcare provider for proper evaluation, especially if symptoms are severe or persistent.'
    }];
  }
  
  // Remove duplicates and sort by probability
  const uniqueConditions = Array.from(
    new Map(possibleConditions.map(item => [item.condition, item])).values()
  );
  
  return uniqueConditions
    .sort((a, b) => parseInt(b.probability) - parseInt(a.probability))
    .slice(0, 3); // Return top 3 matches
}