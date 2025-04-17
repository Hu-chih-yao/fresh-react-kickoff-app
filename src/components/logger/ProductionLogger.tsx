
import { useLoggerStore } from "../../lib/store-logger";
import "./production-logger.scss";
import { MessageCircle } from "lucide-react";

export default function ProductionLogger() {
  const { logs } = useLoggerStore();
  
  // Filter out non-message logs
  const messageLogs = logs.filter(log => {
    return (
      log.userMessage || 
      (log.serverContent && log.serverContent.modelTurn && 
       log.serverContent.modelTurn.parts && 
       log.serverContent.modelTurn.parts.length > 0)
    );
  });

  if (messageLogs.length === 0) {
    return (
      <div className="production-logger-container">
        <div className="empty-conversation">
          <div className="welcome-message">
            <h3>Welcome to your medical consultation</h3>
            <p>
              Your conversation with the doctor will appear here, and all important details will be 
              captured in your Medical Note.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="production-logger-container">
      {messageLogs.map((log, index) => {
        if (log.userMessage) {
          return (
            <div key={`user-${index}`} className="conversation-entry user-entry">
              <div className="entry-header">
                <span className="entry-role">You</span>
                <span className="entry-time">
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="entry-content">
                {log.userMessage.text}
              </div>
            </div>
          );
        }
        
        if (log.serverContent && log.serverContent.modelTurn && log.serverContent.modelTurn.parts) {
          const textParts = log.serverContent.modelTurn.parts.filter(part => part.text);
          
          if (textParts.length === 0) return null;
          
          return (
            <div key={`ai-${index}`} className="conversation-entry ai-entry">
              <div className="entry-header">
                <span className="entry-role">AI Doctor</span>
                <span className="entry-time">
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="entry-content">
                {textParts.map((part, i) => (
                  <p key={i}>{part.text}</p>
                ))}
              </div>
            </div>
          );
        }
        
        return null;
      })}
    </div>
  );
}
