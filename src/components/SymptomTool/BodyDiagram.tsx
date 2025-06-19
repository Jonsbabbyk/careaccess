import React from 'react';

interface BodyDiagramProps {
  onSelectBodyPart: (bodyPart: string) => void;
  theme: string;
}

const BodyDiagram: React.FC<BodyDiagramProps> = ({ onSelectBodyPart, theme }) => {
  const bodyParts = [
    { id: 'head', label: 'Head', top: '5%', left: '50%', width: '15%', height: '15%' },
    { id: 'throat', label: 'Throat', top: '20%', left: '50%', width: '15%', height: '5%' },
    { id: 'chest', label: 'Chest', top: '30%', left: '50%', width: '30%', height: '15%' },
    { id: 'stomach', label: 'Stomach', top: '45%', left: '50%', width: '30%', height: '10%' },
    { id: 'leftArm', label: 'Left Arm', top: '35%', left: '25%', width: '10%', height: '25%' },
    { id: 'rightArm', label: 'Right Arm', top: '35%', left: '75%', width: '10%', height: '25%' },
    { id: 'leftLeg', label: 'Left Leg', top: '70%', left: '40%', width: '10%', height: '25%' },
    { id: 'rightLeg', label: 'Right Leg', top: '70%', left: '60%', width: '10%', height: '25%' },
    { id: 'back', label: 'Back', top: '35%', left: '50%', width: '30%', height: '20%' },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto h-96 border-2 border-dashed rounded-lg p-4 mb-4 flex items-center justify-center">
      <div className={`absolute inset-0 m-auto h-full w-40 ${
        theme === 'high-contrast' ? 'bg-white' : 'bg-gray-200'
      } rounded-full`} style={{ borderRadius: '40%' }} aria-hidden="true" />
      <div className={`absolute inset-x-0 mx-auto h-24 w-24 top-4 ${
        theme === 'high-contrast' ? 'bg-white' : 'bg-gray-200'
      } rounded-full`} aria-hidden="true" />
      
      {bodyParts.map((part) => (
        <button
          key={part.id}
          onClick={() => onSelectBodyPart(part.label)}
          className={`absolute cursor-pointer rounded-md ${
            theme === 'high-contrast' 
              ? 'border-2 border-white hover:bg-gray-800 focus:bg-gray-800' 
              : 'border border-transparent hover:bg-teal-100 hover:border-teal-500 focus:bg-teal-100 focus:border-teal-500'
          }`}
          style={{
            top: part.top,
            left: part.left,
            width: part.width,
            height: part.height,
            transform: 'translate(-50%, -50%)',
          }}
          aria-label={`Select ${part.label}`}
        >
          <span className={`absolute w-full text-center text-xs font-medium -bottom-6 left-0 ${
            theme === 'high-contrast' ? 'text-white' : 'text-gray-700'
          }`}>
            {part.label}
          </span>
        </button>
      ))}
      
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <p className={theme === 'dark' ? 'text-gray-300' : theme === 'high-contrast' ? 'text-white' : 'text-gray-500'}>
          Click on a body part to add it as a symptom
        </p>
      </div>
    </div>
  );
};

export default BodyDiagram;