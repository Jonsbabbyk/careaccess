import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <footer className={`py-6 ${
      theme === 'dark' ? 'bg-gray-800 text-gray-300' : 
      theme === 'high-contrast' ? 'bg-black text-white border-t border-white' : 
      'bg-white text-gray-600 shadow-inner'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} CareEase Hub. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for better healthcare access</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;