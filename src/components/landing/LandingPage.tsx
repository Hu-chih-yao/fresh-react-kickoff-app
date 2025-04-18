
import React from 'react';
import { Clock, Shield, BookOpen, ArrowRight, Navigation } from 'lucide-react';
import './landing-page.scss';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="landing-page">
      <header className="hero">
        <div className="hero-content">
          <h1>
            <span className="gradient-text">Not a Doctor</span>
          </h1>
          <h2>
            <span className="black-text">AI-Powered<br />Telemedicine.</span><br />
            <span className="gradient-text">Human-Like Care.</span>
          </h2>
          
          <p className="subtitle">
            Connect with our AI doctor for instant medical consultations, symptom analysis, and 
            personalized health guidance - available 24/7, without the wait.
          </p>

          <div className="cta-buttons">
            <button className="primary-button" onClick={onStart}>
              Start Consultation
              <ArrowRight size={20} />
            </button>
            <button className="secondary-button">
              Learn More
            </button>
          </div>

          <div className="disclaimer-banner">
            <p>
              <strong>Academic Experiment</strong><br />
              This "Not a Doctor" project is developed by Medvisor Group as an academic experiment. 
              It is NOT a real medical device and should not be used for actual healthcare decisions.
            </p>
          </div>
        </div>
      </header>

      <section className="features">
        <div className="feature">
          <Clock size={32} />
          <h3>Instant Access</h3>
          <p>Connect with a medical AI without appointments or waiting rooms</p>
        </div>
        <div className="feature">
          <Shield size={32} />
          <h3>Privacy First</h3>
          <p>Your health data stays private and secure with medical-grade encryption</p>
        </div>
        <div className="feature">
          <BookOpen size={32} />
          <h3>Medical Knowledge</h3>
          <p>Backed by up-to-date medical research and FDA-approved resources</p>
        </div>
        <div className="feature">
          <Navigation size={32} />
          <h3>Smart Referrals</h3>
          <p>Get guided to in-person care when needed with clear next steps</p>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How Not a Doctor Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Start a Consultation</h3>
            <p>Launch a video consultation from any device, any time</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Discuss Your Symptoms</h3>
            <p>Talk naturally as you would with a human doctor</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Personalized Guidance</h3>
            <p>Receive evidence-based recommendations and clear next steps</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What People Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial">
            <p>"I was skeptical at first, but the guidance I received was clear and helpful. It recommended I see a specialist for what turned out to be an early-stage condition."</p>
            <cite>- Michael R.</cite>
          </div>
          <div className="testimonial">
            <p>"As someone with anxiety about doctor visits, this platform has been a game-changer. I can get initial guidance without the stress."</p>
            <cite>- Sarah T.</cite>
          </div>
          <div className="testimonial">
            <p>"The most impressive part was how it explained my medication interactions in a way my pharmacy never did."</p>
            <cite>- David L.</cite>
          </div>
        </div>
      </section>

      <footer>
        <div className="health-disclaimer">
          <h3>Important Health Disclaimer</h3>
          <p>
            Not a Doctor is an AI-powered health guidance tool and is not a substitute for professional 
            medical advice, diagnosis, or treatment. Always seek the advice of your physician or other 
            qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
        <div className="footer-links">
          <span>Not a Doctor</span>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
