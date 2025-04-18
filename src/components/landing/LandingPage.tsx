
import React from 'react';
import { MessageCircle, Play } from 'lucide-react';
import './LandingPage.scss';

const LandingPage = ({ onStartConsultation }: { onStartConsultation: () => void }) => {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="logo-container">
          <div className="logo">
            <span className="gradient-text">Not a Doctor</span>
          </div>
        </div>
        
        <h1>AI-Powered Telemedicine. <span className="gradient-text">Human-Like Care.</span></h1>
        
        <p className="subtitle">
          Connect with our AI doctor for instant medical consultations, symptom analysis, 
          and personalized health guidance - available 24/7, without the wait.
        </p>
        
        <div className="cta-buttons">
          <button onClick={onStartConsultation} className="primary-button">
            <Play size={20} />
            <span>Start Consultation</span>
          </button>
        </div>

        <div className="academic-disclaimer">
          <h3>Academic Experiment</h3>
          <p>
            This is an academic experiment and should not be used for actual healthcare decisions.
            This platform demonstrates the advancement of AI in healthcare for educational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
