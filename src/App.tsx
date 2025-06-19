import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import SymptomExtractor from './pages/SymptomExtractor';
import HealthFormAssistant from './pages/HealthFormAssistant';
import MedicineSimplifier from './pages/MedicineSimplifier';
import AskDoctor from './pages/AskDoctor';
import Accessibility from './pages/Accessibility';
import SimpleAIChat from './components/SimpleAIChat';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/symptom-extractor" element={<SymptomExtractor />} />
            <Route path="/health-form" element={<HealthFormAssistant />} />
            <Route path="/medicine-simplifier" element={<MedicineSimplifier />} />
            <Route path="/ask-doctor" element={<AskDoctor />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/ai-chat" element={<SimpleAIChat />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;