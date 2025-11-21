import React, { useRef, useEffect, useState } from 'react';
import { Message, Sender } from '../types';
import { Send, MapPin, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useCase } from '../context/CaseContext';
import { sendMessageToChat } from '../services/geminiService';

export const ChatInterface: React.FC = () => {
  const { currentMessages, setCurrentMessages } = useCase();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<{latitude: number, longitude: number} | undefined>(undefined);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  // Get location once on mount for potential doctor search
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
        },
        (err) => console.warn("Location access denied", err)
      );
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    // Add User Message
    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: Sender.USER,
      timestamp: Date.now()
    };
    setCurrentMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const response = await sendMessageToChat(userText, location);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: Sender.AI,
        timestamp: Date.now(),
        groundingUrls: response.groundingUrls
      };
      setCurrentMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        const errorMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: "I'm sorry, I encountered an error processing your request. Please try again.",
            sender: Sender.AI,
            timestamp: Date.now()
        }
        setCurrentMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-slate-700">Derma Assistant Active</span>
        </div>
        {location && (
            <div className="flex items-center text-xs text-slate-400">
                <MapPin className="w-3 h-3 mr-1" />
                <span>Location Active</span>
            </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
        {currentMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === Sender.USER ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.sender === Sender.USER ? 'bg-slate-200' : 'bg-primary/10'
            }`}>
              {msg.sender === Sender.USER ? <UserIcon className="w-5 h-5 text-slate-500" /> : <Bot className="w-5 h-5 text-primary" />}
            </div>

            <div className={`flex flex-col max-w-[85%] ${msg.sender === Sender.USER ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm ${
                  msg.sender === Sender.USER
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                }`}
              >
                <MarkdownRenderer content={msg.text} />
              </div>
              
              {/* Grounding Sources (Maps/Web) */}
              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100 w-full text-xs">
                      <p className="font-semibold text-blue-800 mb-1 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" /> Sources found:
                      </p>
                      <div className="flex flex-wrap gap-2">
                          {msg.groundingUrls.map((url, idx) => (
                              <a 
                                key={idx} 
                                href={url.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-white rounded border border-blue-200 text-blue-600 hover:text-blue-800 truncate max-w-[200px]"
                              >
                                  {url.title}
                              </a>
                          ))}
                      </div>
                  </div>
              )}
              
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
             </div>
             <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};