import React, { useRef, useEffect, useState } from 'react';
import { Send, Bot, User, RefreshCw, AlertTriangle } from 'lucide-react';
import { Message } from '../types';
import { chatWithContext } from '../services/geminiService';

interface Props {
  image: string;
  initialAnalysis: string;
}

export const ChatInterface: React.FC<Props> = ({ image, initialAnalysis }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: initialAnalysis,
      timestamp: new Date(),
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Convert messages for Gemini API
    // Note: In a real app, you would pass the image again in the history if using multimodal history,
    // but here we just keep the text context for the Q&A after initial analysis.
    const history = messages.map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    // Add current message to history
    history.push({ role: 'user', parts: [{ text: userMsg.text }] });

    const responseText = await chatWithContext(history, userMsg.text);

    const modelMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 perspective-container">
      {/* Header */}
      <div className="bg-white/80 p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-teal-100 p-2 rounded-full">
            <Bot className="text-teal-600 w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Derma AI Assistant</h3>
            <p className="text-xs text-gray-500">Preliminary Analysis</p>
          </div>
        </div>
        <div className="text-xs text-amber-600 flex items-center bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
           <AlertTriangle className="w-3 h-3 mr-1" /> Not Medical Advice
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex justify-center mb-6">
           <div className="bg-white p-2 rounded-2xl shadow-lg rotate-3d transform transition-transform">
             <img src={image} alt="Uploaded Skin" className="w-48 h-48 object-cover rounded-xl" />
           </div>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                 {msg.role === 'user' ? <User className="w-3 h-3"/> : <Bot className="w-3 h-3"/>}
                 <span>{msg.role === 'user' ? 'You' : 'Derma AI'}</span>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed text-sm">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-gray-100 rounded-full px-4 py-2 text-xs text-gray-500">
              Analyzing and thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 border-t border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a follow-up question..."
            className="flex-1 bg-transparent px-4 py-2 outline-none text-gray-700 placeholder-gray-400"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600 transition-colors shadow-lg"
          >
            {isTyping ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
