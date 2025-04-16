
import React, { useEffect, useRef } from "react";
import { useLoggerStore } from "../../lib/store-logger";
import "./production-logger.scss";
import { FaRobot, FaUser, FaCogs } from "react-icons/fa";

// This component displays the chat in a user-friendly way
const ProductionLogger = () => {
  const { logs } = useLoggerStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Helper function to format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);
  
  // Filter and format logs for display
  const processedLogs = logs.filter(log => {
    // Only show user messages and AI responses
    if (log.type === 'user-input' || log.type === 'model-turn') {
      return true;
    }
    // Show function calls from either the model or external tools
    if (log.type === 'function-call' || log.type === 'function-response') {
      return true;
    }
    return false;
  });
  
  // Check if there are any messages to display
  const hasMessages = processedLogs.length > 0;
  
  return (
    <div className="production-logger-container" ref={containerRef}>
      {!hasMessages ? (
        // Empty state
        <div className="empty-conversation">
          <div className="welcome-message">
            <h3>Welcome to your medical consultation</h3>
            <p>
              To begin your session, press the blue "Play" button below.
              Then you can start typing or speaking to describe your symptoms or ask questions.
            </p>
            <p>
              The medical assistant will help you and create a SOAP note automatically.
            </p>
          </div>
        </div>
      ) : (
        // Message display
        processedLogs.map((log, index) => {
          // User message
          if (log.type === 'user-input' && log.content) {
            return (
              <div key={index} className="conversation-entry user-entry">
                <div className="entry-header">
                  <div className="entry-role">
                    <FaUser /> You
                  </div>
                  <div className="entry-time">
                    {formatTime(log.time)}
                  </div>
                </div>
                <div className="entry-content">
                  {log.content.text}
                </div>
              </div>
            );
          }
          
          // AI response
          if (log.type === 'model-turn' && log.content && log.content.parts) {
            // Extract text content only
            const textParts = log.content.parts.filter(part => part.text).map(part => part.text).join(' ');
            
            if (textParts.trim()) {
              return (
                <div key={index} className="conversation-entry ai-entry">
                  <div className="entry-header">
                    <div className="entry-role">
                      <FaRobot /> Medical Assistant
                    </div>
                    <div className="entry-time">
                      {formatTime(log.time)}
                    </div>
                  </div>
                  <div className="entry-content">
                    {textParts}
                  </div>
                </div>
              );
            }
          }
          
          // Tool/Function calls (simplified representation)
          if ((log.type === 'function-call' || log.type === 'function-response') && log.content) {
            return (
              <div key={index} className="conversation-entry tool-entry">
                <div className="entry-content">
                  <div className="friendly-tool-message">
                    <FaCogs className="tool-icon" /> 
                    {log.type === 'function-call' 
                      ? "Updating medical information..." 
                      : "Medical information updated"}
                  </div>
                </div>
              </div>
            );
          }
          
          return null;
        })
      )}
      
      {/* Show thinking indicator if needed */}
      {logs.some(log => log.type === 'thinking') && (
        <div className="thinking-indicator">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="typing-text">Medical assistant is thinking...</div>
        </div>
      )}
    </div>
  );
};

export default ProductionLogger;
