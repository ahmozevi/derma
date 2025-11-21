import React, { useRef, useState } from 'react';
import { Upload, Camera, AlertTriangle, ChevronRight, FileImage } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCase } from '../context/CaseContext';

export const Home: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setCurrentImage } = useCase();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setCurrentImage(base64);
      navigate('/analyze');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Skin Health, <span className="text-primary">Decoded by AI</span>
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto leading-relaxed">
          Upload a photo of a skin concern for a preliminary AI analysis and instant guidance. 
          <span className="block mt-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Private • Secure • Fast</span>
        </p>
      </div>

      {/* Disclaimer Card */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg max-w-2xl mx-auto w-full shadow-sm">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-amber-800">Important Medical Disclaimer</h3>
            <p className="text-sm text-amber-700 mt-1">
              Derma is an educational tool powered by Artificial Intelligence. 
              It is <strong>NOT</strong> a diagnostic device. Always consult a qualified dermatologist for medical advice.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="max-w-md mx-auto w-full">
        <div 
          className={`
            relative group border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer
            ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-slate-300 bg-white hover:border-primary/50 hover:bg-slate-50'}
          `}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload or Take Photo</h3>
          <p className="text-slate-500 text-sm mb-6">
            Drag and drop an image here, or click to select from your device
          </p>
          
          <div className="flex justify-center gap-3">
            <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 shadow-sm flex items-center">
              <FileImage className="w-3 h-3 mr-2" /> JPG/PNG
            </span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-200">
        {[
          { title: 'Instant Analysis', desc: 'Get preliminary insights in seconds powered by Gemini 2.5.' },
          { title: 'Find Local Help', desc: 'Locate dermatologists near you immediately.' },
          { title: 'Secure History', desc: 'Save your cases locally to track changes over time.' }
        ].map((item, i) => (
          <div key={i} className="text-center p-4">
            <div className="w-8 h-1 bg-primary/30 mx-auto mb-4 rounded-full" />
            <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};