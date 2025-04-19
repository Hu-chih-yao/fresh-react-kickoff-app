
import React from 'react';
import './landing-page.scss';
import { MessageCircle } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>
          <span className="gradient-text">Not a Doctor</span>
        </h1>
        
        <h2>
          <span className="black-text">AI-Powered Telemedicine.</span>
          <br />
          <span className="gradient-text">Human-Like Care.</span>
        </h2>
        
        <p className="subtitle">
          Connect with our AI doctor for instant medical consultations, symptom analysis, 
          and personalized health guidance - available 24/7, without the wait.
        </p>

        <div className="cta-buttons">
          <button onClick={onStart} className="primary-button">
            Start Consultation
          </button>
          <button className="secondary-button">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
