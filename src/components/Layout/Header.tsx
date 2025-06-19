import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Heart, FileText, Pill, User, Moon, Sun, Menu, X, MapPin, Bot } from 'lucide-react';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Symptom Checker', path: '/symptom-extractor', icon: <Heart className="w-5 h-5" /> },
    { name: 'Health Forms', path: '/health-form', icon: <FileText className="w-5 h-5" /> },
    { name: 'Medicine Helper', path: '/medicine-simplifier', icon: <Pill className="w-5 h-5" /> },
    { name: 'Ask Doctor', path: '/ask-doctor', icon: <User className="w-5 h-5" /> },
    { name: 'Accessibility', path: '/accessibility', icon: <MapPin className="w-5 h-5" /> },
    { name: 'AI Chat', path: '/ai-chat', icon: <Bot className="w-5 h-5" /> },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={`sticky top-0 z-10 transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-800 text-white' : 
      theme === 'high-contrast' ? 'bg-black text-white border-b border-white' : 
      'bg-white text-gray-900 shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 font-bold text-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            aria-label="CareEase Hub Home"
          >
            <Heart className={`w-7 h-7 ${theme === 'high-contrast' ? 'text-white' : 'text-teal-600'}`} />
            <span className={`${theme === 'high-contrast' ? 'text-white' : 'text-teal-600'}`}>CareEase Hub</span>
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 hover:bg-teal-100 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  location.pathname === item.path 
                    ? (theme === 'high-contrast' 
                      ? 'bg-white text-black' 
                      : 'bg-teal-100 text-teal-800') 
                    : ''
                }`}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'high contrast' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 mr-2"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'high contrast' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
              aria-expanded={isMenuOpen}
              aria-label="Main menu"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className={`px-2 pt-2 pb-3 space-y-1 ${
          theme === 'dark' ? 'bg-gray-800' : 
          theme === 'high-contrast' ? 'bg-black border-t border-white' : 
          'bg-white'
        }`}>
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === item.path 
                  ? (theme === 'high-contrast' 
                    ? 'bg-white text-black' 
                    : 'bg-teal-100 text-teal-800') 
                  : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
              aria-current={location.pathname === item.path ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;