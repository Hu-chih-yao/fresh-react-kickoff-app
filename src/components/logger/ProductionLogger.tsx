
import React, { useEffect, useRef } from 'react';
import { useLiveAPIContext } from '../../contexts/LiveAPIContext';
import { useLoggerStore } from '../../lib/store-logger';
import "./production-logger.scss";

const ProductionLogger: React.FC = () => {
  const { logs } = useLoggerStore();
  const { connected } = useLiveAPIContext();
  const endRef = useRef<HTMLDivElement>(null);
  
  // Automatically scroll to bottom when new messages arrive
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);
  
  // Filter logs to only show user messages and AI responses
  const filteredLogs = logs
    .filter(log => 
      (log.userMessage && log.userMessage.text) || 
      (log.serverContent && log.serverContent.modelTurn && 
       log.serverContent.modelTurn.parts && 
       log.serverContent.modelTurn.parts.some(part => part.text))
    );

  // Check if there are any messages to display
  const hasMessages = filteredLogs.length > 0;
  
  return (
    <div className="production-logger-container">
      {!hasMessages ? (
        <div className="empty-state">
          <div className="welcome-message">
            <h3>AI Medical Consultation</h3>
            <p>Describe your symptoms or health concerns, and I'll provide medical advice and guidance.</p>
            
            {!connected && (
              <div className="connect-hint">
                <span className="material-symbols-outlined">play_circle</span>
                <span>Press the purple play button to start your consultation</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Display actual conversation
        filteredLogs.map((log, index) => {
          // User message
          if (log.userMessage && log.userMessage.text) {
            return (
              <div key={`user-${index}`} className="conversation-entry user-entry">
                <div className="entry-header">
                  <span className="entry-role">You</span>
                  <span className="entry-time">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="entry-content">
                  {log.userMessage.text}
                </div>
              </div>
            );
          }
          
          // AI response
          if (log.serverContent && log.serverContent.modelTurn) {
            const { parts } = log.serverContent.modelTurn;
            
            if (!parts || !Array.isArray(parts)) return null;
            
            // Combine all text parts into one response
            const textParts = parts
              .filter(part => part.text && typeof part.text === 'string')
              .map(part => part.text)
              .join("\n");
              
            if (!textParts) return null;
            
            return (
              <div key={`ai-${index}`} className="conversation-entry ai-entry">
                <div className="entry-header">
                  <span className="entry-role">AI Doctor</span>
                  <span className="entry-time">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="entry-content">
                  {textParts.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            );
          }
          
          // Tool use (simplified display)
          if (log.toolCall) {
            return (
              <div key={`tool-${index}`} className="conversation-entry tool-entry">
                <div className="entry-content">
                  <div className="friendly-tool-message">
                    <span className="tool-icon material-symbols-outlined">search</span>
                    <span>Looking up medical information...</span>
                  </div>
                </div>
              </div>
            );
          }
          
          return null;
        })
      )}
      
      {connected && !hasMessages && (
        <div className="conversation-entry ai-entry">
          <div className="entry-header">
            <span className="entry-role">AI Doctor</span>
            <span className="entry-time">{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="entry-content">
            <p>Hello! I'm here to help you with your health concerns. What symptoms are you experiencing today?</p>
          </div>
        </div>
      )}
      
      {/* This div is used for auto-scrolling */}
      <div ref={endRef} />
    </div>
  );
};

export default ProductionLogger;
