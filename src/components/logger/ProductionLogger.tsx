
import { useLoggerStore } from "../../lib/store-logger";
import "./production-logger.scss";
import { StreamingLog, isServerContentMessage, isClientContentMessage } from "../../multimodal-live-types";

export default function ProductionLogger() {
  const { logs } = useLoggerStore();
  
  // Filter out non-message logs
  const messageLogs = logs.filter(log => {
    const message = log.message;
    
    // Check if it's a user message
    if (typeof message === 'object' && isClientContentMessage(message)) {
      return message.clientContent && message.clientContent.turns && message.clientContent.turns.length > 0;
    }
    
    // Check if it's an AI message
    if (typeof message === 'object' && isServerContentMessage(message)) {
      return message.serverContent && 
             message.serverContent.modelTurn && 
             message.serverContent.modelTurn.parts && 
             message.serverContent.modelTurn.parts.length > 0;
    }
    
    return false;
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
      {messageLogs.map((log: StreamingLog, index: number) => {
        const message = log.message;
        
        // Handle user messages
        if (typeof message === 'object' && isClientContentMessage(message)) {
          const clientMessage = message.clientContent;
          if (!clientMessage.turns || clientMessage.turns.length === 0) return null;
          
          const userText = clientMessage.turns[0].text || '';
          
          return (
            <div key={`user-${index}`} className="conversation-entry user-entry">
              <div className="entry-header">
                <span className="entry-role">You</span>
                <span className="entry-time">
                  {new Date(log.date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="entry-content">
                {userText}
              </div>
            </div>
          );
        }
        
        // Handle AI messages
        if (typeof message === 'object' && isServerContentMessage(message)) {
          const serverContent = message.serverContent;
          
          if (!serverContent.modelTurn || !serverContent.modelTurn.parts) return null;
          
          const textParts = serverContent.modelTurn.parts.filter(part => part.text);
          
          if (textParts.length === 0) return null;
          
          return (
            <div key={`ai-${index}`} className="conversation-entry ai-entry">
              <div className="entry-header">
                <span className="entry-role">AI Doctor</span>
                <span className="entry-time">
                  {new Date(log.date).toLocaleTimeString([], {
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
