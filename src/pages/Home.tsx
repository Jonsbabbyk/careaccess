import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, FileText, Pill, User, ExternalLink, MapPin, Bot } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Home: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      title: 'Symptom Checker',
      description: 'Report symptoms via voice, text, or by clicking on a body diagram to get possible conditions or actions.',
      icon: <Heart className="w-10 h-10" />,
      path: '/symptom-extractor',
      color: theme === 'high-contrast' ? 'bg-white text-black' : 'bg-red-100 text-red-600',
    },
    {
      title: 'Health Form Assistant',
      description: 'Complete health forms with simple language and visual aids, with accessible instructions and PDF export.',
      icon: <FileText className="w-10 h-10" />,
      path: '/health-form',
      color: theme === 'high-contrast' ? 'bg-white text-black' : 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Medicine Helper',
      description: 'Get clear, plain-language instructions and visual indicators for your medications.',
      icon: <Pill className="w-10 h-10" />,
      path: '/medicine-simplifier',
      color: theme === 'high-contrast' ? 'bg-white text-black' : 'bg-green-100 text-green-600',
    },
    {
      title: 'Ask Dr. CareEase',
      description: 'Chat with our virtual doctor assistant for disability-related health questions and guidance.',
      icon: <User className="w-10 h-10" />,
      path: '/ask-doctor',
      color: theme === 'high-contrast' ? 'bg-white text-black' : 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Accessibility & Location',
      description: 'Find your location with real-time GPS detection and access nearby healthcare services.',
      icon: <MapPin className="w-10 h-10" />,
      path: '/accessibility',
      color: theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-100 text-teal-600',
    },
    {
      title: 'AI Chat Assistant',
      description: 'Chat with our offline AI assistant for health conversations without needing internet connection.',
      icon: <Bot className="w-10 h-10" />,
      path: '/ai-chat',
      color: theme === 'high-contrast' ? 'bg-white text-black' : 'bg-indigo-100 text-indigo-600',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <section className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          <span className={theme === 'high-contrast' ? 'text-white' : 'text-teal-600'}>CareEase Hub</span>
          <span>: Healthcare Made Simpler</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          A local-first healthcare assistant designed to be accessible for everyone and usable in low-resource settings, without requiring internet connection.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/symptom-extractor"
            className={`px-6 py-3 rounded-lg font-medium text-white transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
              theme === 'high-contrast' ? 'bg-white text-black' : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            Get Started
          </Link>
          <a
            href="#features"
            className={`px-6 py-3 rounded-lg font-medium transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
              theme === 'high-contrast' 
                ? 'bg-black text-white border border-white' 
                : theme === 'dark'
                  ? 'bg-gray-700 text-white border border-gray-600'
                  : 'bg-white text-teal-600 border border-teal-600'
            }`}
          >
            Learn More
          </a>
        </div>
      </section>
      
      <section id="features" className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.path}
              className={`block p-6 rounded-xl transition duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                theme === 'high-contrast' 
                  ? 'bg-gray-900 border border-white hover:bg-gray-800' 
                  : theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-white shadow hover:shadow-xl'
              }`}
            >
              <div className={`rounded-full w-16 h-16 flex items-center justify-center mb-4 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : theme === 'high-contrast' ? 'text-gray-100' : 'text-gray-600'}>
                {feature.description}
              </p>
              <div className="mt-4 flex items-center text-teal-500">
                <span className="mr-2">Try it now</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      <section className="mb-16">
        <div className={`rounded-xl p-8 ${
          theme === 'high-contrast' 
            ? 'bg-gray-900 border border-white' 
            : theme === 'dark' 
              ? 'bg-gray-800'
              : 'bg-white shadow-lg'
        }`}>
          <h2 className="text-3xl font-bold mb-6 text-center">Why CareEase Hub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Accessible for Everyone</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : theme === 'high-contrast' ? 'text-gray-100' : 'text-gray-600'}>
                Designed with accessibility in mind, CareEase Hub works for people with disabilities, low literacy, or limited technical experience.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Works Offline</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : theme === 'high-contrast' ? 'text-gray-100' : 'text-gray-600'}>
                No internet connection required. All tools function completely offline, making it perfect for low-resource settings.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Privacy-Focused</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : theme === 'high-contrast' ? 'text-gray-100' : 'text-gray-600'}>
                Your health information stays on your device. We don't collect, store, or transmit your personal data.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Simple and Clear</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : theme === 'high-contrast' ? 'text-gray-100' : 'text-gray-600'}>
                Complex health information presented in plain language with visual aids, making healthcare more understandable for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;