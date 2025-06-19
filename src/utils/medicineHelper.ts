interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string[];
  specialInstructions: string[];
  simplifiedInstructions: string;
}

export function simplifyInstructions(medication: Medication): string {
  // Create plain language instructions based on the medication info
  const { name, dosage, frequency, timing, specialInstructions } = medication;
  
  // Create basic instruction
  let instructions = `Take ${dosage} of ${name} `;
  
  // Add frequency
  switch (frequency) {
    case 'daily':
      instructions += 'once a day';
      break;
    case 'twice daily':
      instructions += 'twice a day';
      break;
    case 'three times daily':
      instructions += 'three times a day';
      break;
    case 'four times daily':
      instructions += 'four times a day';
      break;
    case 'as needed':
      instructions += 'only when you need it';
      break;
    default:
      instructions += frequency;
  }
  
  // Add timing details
  const timingParts = [];
  
  if (timing.includes('morning')) {
    timingParts.push('in the morning');
  }
  
  if (timing.includes('afternoon')) {
    timingParts.push('in the afternoon');
  }
  
  if (timing.includes('evening')) {
    timingParts.push('in the evening');
  }
  
  if (timingParts.length > 0) {
    instructions += ` ${timingParts.join(' and ')}`;
  }
  
  // Add meal-related timing
  if (timing.includes('beforeMeal')) {
    instructions += ', about 30 minutes before eating';
  } else if (timing.includes('withMeal')) {
    instructions += ', with your food';
  } else if (timing.includes('afterMeal')) {
    instructions += ', after you finish eating';
  }
  
  // Add period
  instructions += '.';
  
  // Add the most important special instructions
  if (specialInstructions.length > 0) {
    const criticalInstructions = [];
    
    if (specialInstructions.includes('Take with water')) {
      criticalInstructions.push('Always take with a full glass of water');
    }
    
    if (specialInstructions.includes('Take with food') && !timing.includes('withMeal')) {
      criticalInstructions.push('Take with food to avoid stomach upset');
    }
    
    if (specialInstructions.includes('Take on an empty stomach') && 
        !timing.includes('beforeMeal')) {
      criticalInstructions.push('Take on an empty stomach');
    }
    
    if (specialInstructions.includes('May cause drowsiness')) {
      criticalInstructions.push('This medicine may make you sleepy. Do not drive or use machinery after taking it');
    }
    
    if (specialInstructions.includes('Avoid alcohol')) {
      criticalInstructions.push('Do not drink alcohol while taking this medicine');
    }
    
    if (criticalInstructions.length > 0) {
      instructions += ' ' + criticalInstructions.join('. ') + '.';
    }
  }
  
  return instructions;
}