
import React, { useState } from 'react';
import { FaUserMd, FaWifi, FaComment, FaHeadset } from 'react-icons/fa';
import './welcome-overlay.scss';

interface WelcomeOverlayProps {
  onGetStarted: () => void;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onGetStarted }) => {
  return (
    <div className="welcome-overlay">
      <div className="welcome-content">
        <div className="welcome-header">
          <h1>Medical Consultation</h1>
          <p className="subtitle">Connect with your AI medical assistant</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <FaUserMd className="feature-icon" />
            <h3>Expert Guidance</h3>
            <p>Get professional medical advice through our AI assistant</p>
          </div>
          
          <div className="feature-card">
            <FaWifi className="feature-icon" />
            <p>One-click connection to your virtual medical assistant</p>
            <h3>Simple Connection</h3>
          </div>
          
          <div className="feature-card">
            <FaComment className="feature-icon" />
            <h3>Interactive Chat</h3>
            <p>Discuss your symptoms and receive personalized insights</p>
          </div>
          
          <div className="feature-card">
            <FaHeadset className="feature-icon" />
            <h3>Video Consultation</h3>
            <p>Share visuals to enhance your consultation experience</p>
          </div>
        </div>
        
        <div className="steps-container">
          <h2>How it works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Connect</h4>
                <p>Press the play button to start your session</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Describe</h4>
                <p>Share your symptoms or questions</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Review</h4>
                <p>Get medical insights and SOAP notes</p>
              </div>
            </div>
          </div>
        </div>
        
        <button className="get-started-button" onClick={onGetStarted}>
          Begin Consultation
        </button>
        
        <p className="privacy-note">
          Your consultation data is private and secure.
        </p>
      </div>
    </div>
  );
};

export default WelcomeOverlay;
