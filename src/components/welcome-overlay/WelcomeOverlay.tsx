
import { useState, useEffect } from 'react';
import { useLiveAPIContext } from '../../contexts/LiveAPIContext';
import './welcome-overlay.scss';

interface WelcomeOverlayProps {
  onStart: () => void;
}

const WelcomeOverlay = ({ onStart }: WelcomeOverlayProps) => {
  const [step, setStep] = useState(1);
  const { connect } = useLiveAPIContext();
  const [isVisible, setIsVisible] = useState(true);
  
  // Check if user has seen the welcome overlay before
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome) {
      setIsVisible(false);
    }
  }, []);
  
  const handleStart = async () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    await connect();
    onStart();
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="welcome-overlay">
      <div className="welcome-content">
        <div className="welcome-header">
          <h1>Welcome to AI Doctor</h1>
          <p className="subtitle">Your personal medical assistant powered by AI</p>
        </div>
        
        {step === 1 && (
          <div className="welcome-step">
            <div className="step-icon">
              <span className="material-symbols-outlined">medical_services</span>
            </div>
            <h2>How I can help you</h2>
            <p>
              I'm your AI medical assistant, designed to provide preliminary medical advice, 
              diagnose common conditions, and suggest treatments. I'll document everything
              in your medical note for your records.
            </p>
            <button className="next-button" onClick={() => setStep(2)}>
              Next
            </button>
          </div>
        )}
        
        {step === 2 && (
          <div className="welcome-step">
            <div className="step-icon">
              <span className="material-symbols-outlined">mic</span>
            </div>
            <h2>Talk or type to me</h2>
            <p>
              You can speak to me using your microphone, or type your symptoms 
              and concerns. I'll listen and respond just like a doctor would during 
              a consultation.
            </p>
            <button className="next-button" onClick={() => setStep(3)}>
              Next
            </button>
          </div>
        )}
        
        {step === 3 && (
          <div className="welcome-step">
            <div className="step-icon">
              <span className="material-symbols-outlined">description</span>
            </div>
            <h2>Your Medical Note</h2>
            <p>
              I'll create a detailed medical note for you, capturing important information 
              about your symptoms, possible diagnoses, and recommended treatments. You can 
              review this anytime.
            </p>
            <div className="button-group">
              <button className="back-button" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="start-button" onClick={handleStart}>
                Start Consultation
              </button>
            </div>
          </div>
        )}
        
        <div className="step-indicators">
          <div className={`step-dot ${step === 1 ? 'active' : ''}`} onClick={() => setStep(1)}></div>
          <div className={`step-dot ${step === 2 ? 'active' : ''}`} onClick={() => setStep(2)}></div>
          <div className={`step-dot ${step === 3 ? 'active' : ''}`} onClick={() => setStep(3)}></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOverlay;
