import React, { useEffect, useState, useRef } from 'react';
import { useLoggerStore } from '../../lib/store-logger';
import './production-logger.scss';
import { FaSearch, FaNotesMedical, FaStethoscope } from 'react-icons/fa';
import { 
  isServerContentMessage, 
  isClientContentMessage,
  isToolCallMessage,
  isToolResponseMessage,
  ServerContentMessage,
  ClientContentMessage,
  ToolCallMessage,
  ToolResponseMessage,
  Content,
  Part,
  ModelTurn,
  isModelTurn
} from '../../multimodal-live-types';
import cn from 'classnames';

type ConversationEntry = {
  id: number;
  type: 'user' | 'ai' | 'tool' | 'tool-response';
  content: React.ReactNode;
  timestamp: Date;
  toolName?: string;
};

const formatTime = (d: Date) => d.toLocaleTimeString().slice(0, -3);

// Helper to create a patient-friendly message for tool calls
const getPatientFriendlyToolMessage = (toolName: string, args?: any): React.ReactNode => {
  if (toolName === "medvisor_search" || toolName === "googleSearch") {
    let searchQuery = "medical information";
    if (args && args.query) {
      searchQuery = args.query;
    }
    
    return (
      <div className="friendly-tool-message">
        <FaSearch className="tool-icon" />
        <span>Doctor is researching information about <strong>{searchQuery}</strong></span>
      </div>
    );
  } else if (toolName === "update_soap_note") {
    // Extract useful information from the args if available
    let noteMessage = "Doctor is updating your medical notes...";
    
    if (args) {
      if (args.chiefComplaint) {
        noteMessage = `Doctor has noted your chief complaint: "<strong>${args.chiefComplaint}</strong>"`;
      } else if (args.subjective) {
        const shortSubjective = args.subjective.length > 50 
          ? args.subjective.substring(0, 50) + "..." 
          : args.subjective;
        noteMessage = `Doctor has recorded your symptoms: "<strong>${shortSubjective}</strong>"`;
      } else if (args.assessment) {
        noteMessage = `Doctor is documenting assessment in your medical note`;
      } else if (args.plan) {
        noteMessage = `Doctor is adding treatment recommendations to your medical note`;
      } else if (args.icdCodes && Array.isArray(args.icdCodes) && args.icdCodes.length > 0) {
        noteMessage = `Doctor is adding medical codes to your documentation`;
      }
    }
    
    return (
      <div className="friendly-tool-message">
        <FaNotesMedical className="tool-icon" />
        <span dangerouslySetInnerHTML={{ __html: noteMessage }}></span>
      </div>
    );
  } else if (toolName === "dailymed_api") {
    let medicationName = "medication details";
    if (args && args.search_term) {
      medicationName = args.search_term;
    }
    
    return (
      <div className="friendly-tool-message">
        <FaStethoscope className="tool-icon" />
        <span>Doctor is looking up information about <strong>{medicationName}</strong></span>
      </div>
    );
  }
  
  // Default message for other tools
  return (
    <div className="friendly-tool-message">
      <FaStethoscope className="tool-icon" />
      <span>Doctor is consulting medical resources...</span>
    </div>
  );
};

const RenderPart = ({ part }: { part: Part }) => {
  if ('text' in part && part.text && part.text.length) {
    if (part.text.includes('print(') || part.text.startsWith('Code:') || 
        part.text.includes('Result:') || part.text.includes('OUTCOME_')) {
      return null;
    }
    return <p className="part part-text">{part.text}</p>;
  }
  return null;
};

const ProductionLogger: React.FC = () => {
  const { logs } = useLoggerStore();
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [lastToolType, setLastToolType] = useState<string | null>(null);
  const loggerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (loggerRef.current) {
      loggerRef.current.scrollTop = loggerRef.current.scrollHeight;
    }
  }, [conversation]);
  
  // Process logs to create a clean conversation
  useEffect(() => {
    if (!logs || logs.length === 0) return;

    const processedConversation: ConversationEntry[] = [];
    const uniqueKeys = new Set<string>();
    let aiResponseInProgress = false;
    
    logs.forEach((log, index) => {
      const message = log.message;
      const timestamp = log.date;
      
      if (isClientContentMessage(message)) {
        const { clientContent } = message as ClientContentMessage;
        if (!clientContent.turns || clientContent.turns.length === 0) return;
        
        const parts = clientContent.turns.flatMap(turn => 
          turn.parts.filter(part => 'text' in part && part.text && part.text.trim() !== "")
        );
        
        if (parts.length === 0) return;
        
        const userMessageContent = (
          <div className="user-message">
            {parts.map((part, j) => (
              <RenderPart key={`user-part-${j}`} part={part} />
            ))}
          </div>
        );
        
        const key = `user-${timestamp.getTime()}-${index}`;
        if (!uniqueKeys.has(key)) {
          uniqueKeys.add(key);
          processedConversation.push({
            id: index,
            type: 'user',
            content: userMessageContent,
            timestamp
          });
          aiResponseInProgress = true;
          setIsThinking(true);
        }
      } 
      else if (isServerContentMessage(message)) {
        const { serverContent } = message as ServerContentMessage;
        
        if (isModelTurn(serverContent)) {
          const parts = serverContent.modelTurn.parts;
          if (!parts || parts.length === 0) return;
          
          const filteredParts = parts.filter(part => {
            if (!('text' in part) || !part.text || part.text.trim() === "") return false;
            if (part.text.includes('print(') || 
                part.text.startsWith('Code:') || 
                part.text.includes('Result:') || 
                part.text.includes('OUTCOME_') ||
                part.text.includes('default_api')) {
              return false;
            }
            return true;
          });
          
          if (filteredParts.length === 0) return;
          
          const aiMessageContent = (
            <div className="ai-message">
              {filteredParts.map((part, j) => (
                <RenderPart key={`ai-part-${j}`} part={part} />
              ))}
            </div>
          );
          
          const key = `ai-${timestamp.getTime()}-${index}`;
          if (!uniqueKeys.has(key)) {
            uniqueKeys.add(key);
            processedConversation.push({
              id: index,
              type: 'ai',
              content: aiMessageContent,
              timestamp
            });
            aiResponseInProgress = false;
            setIsThinking(false);
            setLastToolType(null);
          }
        }
      }
      else if (isToolCallMessage(message)) {
        const { toolCall } = message as ToolCallMessage;
        
        if (!toolCall.functionCalls || toolCall.functionCalls.length === 0) return;
        
        const functionCall = toolCall.functionCalls[0]; // Get the first function call
        const toolName = functionCall.name;
        setLastToolType(toolName); // Save the tool type
        
        // Friendly version for patients with args for context
        const friendlyToolContent = getPatientFriendlyToolMessage(toolName, functionCall.args);
        
        const key = `tool-${timestamp.getTime()}-${index}`;
        if (!uniqueKeys.has(key)) {
          uniqueKeys.add(key);
          processedConversation.push({
            id: index,
            type: 'tool',
            content: friendlyToolContent,
            timestamp,
            toolName
          });
        }
      }
      else if (isToolResponseMessage(message)) {
        // Tool response - hidden in simple mode, so we don't need to show it
        // Keep empty so Patient Mode doesn't see technical responses
      }
    });
    
    processedConversation.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    setConversation(processedConversation);
    
    const latestLog = logs[logs.length - 1];
    if (latestLog && isServerContentMessage(latestLog.message)) {
      setIsThinking(false);
    }
  }, [logs]);

  return (
    <div className="production-logger-container" ref={loggerRef}>
      {conversation.length === 0 && (
        <div className="empty-conversation">
          <div className="welcome-message">
            <h3>Welcome to your medical consultation</h3>
            <p>Your conversation with the doctor will appear here, and all important details will be captured in your Medical Note.</p>
          </div>
        </div>
      )}
      {conversation.map((entry) => (
        <div
          key={`entry-${entry.id}`}
          className={cn("conversation-entry", {
            "user-entry": entry.type === "user",
            "ai-entry": entry.type === "ai",
            "tool-entry": entry.type === "tool",
            "response-entry": entry.type === "tool-response",
          })}
        >
          <div className="entry-header">
            <span className="entry-role">
              {entry.type === "user" ? "You" : 
               entry.type === "ai" ? "Doctor" : 
               ""}
            </span>
            <span className="entry-time">{formatTime(entry.timestamp)}</span>
          </div>
          <div className="entry-content">{entry.content}</div>
        </div>
      ))}
      {isThinking && (
        <div className="thinking-indicator">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="typing-text">
            {lastToolType ? 
              getPatientFriendlyToolMessage(lastToolType) : 
              "Doctor is typing..."}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionLogger;
