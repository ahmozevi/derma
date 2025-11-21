import React, { useEffect, useState } from 'react';
import { useCase } from '../context/CaseContext';
import { useNavigate } from 'react-router-dom';
import { startAnalysisChat } from '../services/geminiService';
import { Sender, Message } from '../types';
import { ChatInterface } from '../components/ChatInterface';
import { Loader2, Save, ArrowLeft, AlertTriangle } from 'lucide-react';

export const Analysis: React.FC = () => {
  const { currentImage, setCurrentMessages, addCase } = useCase();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'analyzing' | 'complete' | 'error'>('analyzing');

  useEffect(() => {
    if (!currentImage) {
      navigate('/');
      return;
    }
    
    // Avoid double-firing in React Strict Mode
    let isMounted = true;

    const runAnalysis = async () => {
      try {
        // Extract base64 data
        const base64Data = currentImage.split(',')[1];
        const mimeType = currentImage.split(';')[0].split(':')[1];

        const resultText = await startAnalysisChat(base64Data, mimeType);
        
        if (isMounted) {
          const initialMsg: Message = {
            id: Date.now().toString(),
            text: resultText,
            sender: Sender.AI,
            timestamp: Date.now()
          };
          setCurrentMessages([initialMsg]);
          setStatus('complete');
        }
      } catch (error) {
        console.error(error);
        if (isMounted) setStatus('error');
      }
    };

    runAnalysis();

    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImage]); // Only depend on image presence

  const handleSaveCase = () => {
    if (!currentImage) return;
    // Create a summary from first sentence of AI response or default
    addCase({
      id: Date.now().toString(),
      imageUrl: currentImage,
      summary: "Skin Analysis " + new Date().toLocaleDateString(),
      date: Date.now(),
      messages: [] // In a real app we'd pass currentMessages here, simplified for context
    });
    navigate('/history');
  };

  if (status === 'analyzing') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 animate-in fade-in">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-lg">
                 <img src={currentImage || ''} alt="Analyzing" className="w-full h-full object-cover opacity-50" />
            </div>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800">Analyzing Image...</h2>
          <p className="text-slate-500 text-sm mt-2">Gemini Vision is examining patterns and textures.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Analysis Failed</h2>
        <p className="text-slate-600 mb-6">We couldn't process the image. Please try uploading a clearer photo.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center text-slate-500 hover:text-slate-800 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <button 
          onClick={handleSaveCase}
          className="flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
        >
          <Save className="w-4 h-4 mr-1.5" /> Save to History
        </button>
      </div>

      {/* Image Preview */}
      <div className="flex justify-center">
        <div className="relative rounded-xl overflow-hidden shadow-md max-h-48 w-full max-w-xs border border-slate-200">
          <img src={currentImage || ''} alt="Analyzed" className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
             <p className="text-white text-xs font-medium text-center">Source Image</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1">
         <ChatInterface />
      </div>
    </div>
  );
};
