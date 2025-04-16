
import React, { useEffect, useRef } from 'react';
import { useLoggerStore } from '../../lib/store-logger';
import './logger.scss';
import { 
  isServerContentMessage, 
  isClientContentMessage,
  ServerContentMessage,
  ClientContentMessage,
  isModelTurn
} from '../../multimodal-live-types';

const ProductionLogger: React.FC = () => {
  const { logs } = useLoggerStore();
  const loggerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (loggerRef.current) {
      loggerRef.current.scrollTop = loggerRef.current.scrollHeight;
    }
  }, [logs]);
  
  // Filter logs to only show user messages and AI responses
  const chatLogs = logs.filter(log => {
    return (
      (log.type.includes('client.send') && !log.type.includes('setup')) || 
      (log.type.includes('server.content') && 
       isServerContentMessage(log.message) && 
       isModelTurn(log.message.serverContent))
    );
  });
  
  return (
    <div className="production-logger" ref={loggerRef}>
      {chatLogs.map((log, i) => {
        const isUser = log.type.includes('client.send');
        const isModel = log.type.includes('server.content');
        
        if (isUser) {
          let userMessage = '';
          
          if (isClientContentMessage(log.message)) {
            const clientContent = log.message.clientContent;
            const turns = clientContent.turns || [];
            if (turns.length > 0 && turns[0].parts && turns[0].parts.length > 0) {
              userMessage = turns[0].parts.map(part => part.text || '').join(' ');
            }
          }
          
          if (!userMessage) {
            return null;
          }
          
          return (
            <div key={i} className="user-message">
              <div className="message-avatar">You</div>
              <div className="message-content">{userMessage}</div>
            </div>
          );
        }
        
        if (isModel) {
          let modelMessage = '';
          
          if (
            isServerContentMessage(log.message) && 
            isModelTurn(log.message.serverContent) && 
            log.message.serverContent.modelTurn.parts
          ) {
            modelMessage = log.message.serverContent.modelTurn.parts
              .filter(part => part.text && !part.functionCall)
              .map(part => part.text || '')
              .join(' ');
          }
          
          if (!modelMessage) {
            return null;
          }
          
          return (
            <div key={i} className="model-message">
              <div className="message-avatar">AI Doctor</div>
              <div className="message-content">{modelMessage}</div>
            </div>
          );
        }
        
        return null;
      })}
    </div>
  );
};

export default ProductionLogger;
