
import { useEffect, useRef, useState } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { useLoggerStore } from "../../lib/store-logger";
import { MessageCircle } from "lucide-react";
import "./production-logger.scss";
import { ServerContent, ModelTurn } from "../../multimodal-live-types";

export default function ProductionLogger() {
  const { connected } = useLiveAPIContext();
  const { logs } = useLoggerStore();
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const renderMessageContent = (content: ServerContent) => {
    if ((content as ModelTurn).modelTurn) {
      return (content as ModelTurn).modelTurn.parts.map((part, idx) => {
        if (part.text) {
          return <p key={idx}>{part.text}</p>;
        }
        return null;
      });
    }
    return null;
  };

  if (!connected || logs.length === 0) {
    return (
      <div className="production-logger-container">
        <div className="empty-conversation">
          <div className="welcome-message">
            <h3>Welcome to AI Medical Consultation</h3>
            <p>
              I'm your AI medical assistant, ready to help answer your health-related
              questions and provide general medical information. Please note that I'm
              here to assist, but not to replace professional medical advice.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="production-logger-container" ref={logContainerRef}>
      {logs.map((log, index) => {
        const date = new Date(log.date);
        const time = date.toLocaleTimeString();

        if (log.type === "userMessage" && "userMessage" in log.message) {
          return (
            <div key={index} className="conversation-entry user-entry">
              <div className="entry-header">
                <span className="entry-role">You</span>
                <span className="entry-time">{time}</span>
              </div>
              <div className="entry-content">
                <p>{log.message.userMessage.text}</p>
              </div>
            </div>
          );
        }

        if (log.type === "serverContent" && "serverContent" in log.message) {
          return (
            <div key={index} className="conversation-entry ai-entry">
              <div className="entry-header">
                <span className="entry-role">AI Doctor</span>
                <span className="entry-time">{time}</span>
              </div>
              <div className="entry-content">
                {renderMessageContent(log.message.serverContent)}
              </div>
            </div>
          );
        }

        return null;
      })}
      
      {connected && (
        <div className="thinking-indicator">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="typing-text">AI is thinking...</span>
        </div>
      )}
    </div>
  );
}
