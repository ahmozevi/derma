import React, { useState } from 'react';
import { Upload, Camera, ShieldCheck, Heart, Menu, UserCircle } from 'lucide-react';
import { analyzeSkinImage } from './services/geminiService';
import { ChatInterface } from './components/ChatInterface';
import { DoctorFinder } from './components/DoctorFinder';
import { NurseOnCall } from './components/NurseOnCall';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showNurse, setShowNurse] = useState(false);
  const [view, setView] = useState<'home' | 'profile'>('home');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setImage(base64String);
      setAnalyzing(true);
      
      try {
        const analysis = await analyzeSkinImage(base64String);
        setResult(analysis);
      } catch (err) {
        alert("Failed to analyze image. Ensure API Key is set.");
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-slate-800">
      
      {/* 3D Background Layers */}
      {/* Layer 1: Deep Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-200/40 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-200/40 rounded-full blur-[120px] animate-float-delayed"></div>
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-blue-100/30 rounded-full blur-[80px]"></div>
      </div>

      {/* Layer 2: Grid Texture */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      {/* Layer 3: Main Content (Glassmorphism) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                  <ShieldCheck size={20} />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800">Derma<span className="text-teal-600">AI</span></span>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowNurse(true)}
                  className="hidden md:flex items-center gap-2 text-rose-500 font-semibold px-4 py-2 bg-rose-50 rounded-full hover:bg-rose-100 transition-colors"
                >
                  <Heart size={18} className="fill-current" /> Nurse on Call
                </button>
                <button 
                  onClick={() => setView(view === 'home' ? 'profile' : 'home')}
                  className="p-2 text-slate-500 hover:text-teal-600 transition-colors"
                >
                  {view === 'home' ? <UserCircle size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main View Switch */}
        <main className="flex-grow container mx-auto px-4 py-8">
          
          {/* Profile View (Simple Mockup) */}
          {view === 'profile' && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
                  <h2 className="text-2xl font-bold mb-6">User Profile</h2>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center">
                      <UserCircle size={40} className="text-slate-400"/>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Guest User</h3>
                      <p className="text-slate-500">Member since Nov 2025</p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 text-blue-700 rounded-xl mb-4">
                    <p>Save your case history feature coming in Sprint 2.</p>
                  </div>
                  <button onClick={() => setView('home')} className="text-teal-600 font-medium hover:underline">Back to Analysis</button>
               </div>
            </div>
          )}

          {/* Analysis View */}
          {view === 'home' && (
            <>
              {!image ? (
                // HERO SECTION
                <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
                  <div className="space-y-4 max-w-2xl mx-auto perspective-container">
                    <div className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold mb-2 shadow-sm border border-teal-100">
                      Sprint 1: Early Access
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                      Identify skin concerns <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">instantly with AI</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-xl mx-auto leading-relaxed">
                      Upload a photo for preliminary classification, then connect with local specialists or a nurse immediately.
                    </p>
                  </div>

                  {/* 3D Upload Card */}
                  <div className="group relative w-full max-w-md mx-auto h-64 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-teal-500 transition-all duration-300 transform hover:scale-105 rotate-3d cursor-pointer overflow-hidden">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center group-hover:bg-teal-600 transition-colors duration-300 shadow-lg group-hover:shadow-teal-300/50">
                        <Camera className="w-8 h-8 text-teal-600 group-hover:text-white" />
                      </div>
                      <div className="text-center">
                        <span className="block font-bold text-slate-700 text-lg group-hover:text-teal-700">Upload or Take Photo</span>
                        <span className="text-sm text-slate-400">JPG, PNG supported</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-sm text-slate-400 font-medium">
                     <span className="flex items-center gap-1"><ShieldCheck size={14}/> Private & Secure</span>
                     <span className="flex items-center gap-1"><ShieldCheck size={14}/> AI Powered</span>
                  </div>
                </div>
              ) : (
                // ANALYSIS & RESULTS SECTION
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  
                  {analyzing ? (
                    <div className="flex flex-col items-center justify-center h-[50vh]">
                       <div className="relative w-24 h-24">
                          <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Upload className="text-teal-500 animate-pulse" />
                          </div>
                       </div>
                       <h3 className="mt-6 text-2xl font-bold text-slate-700">Analyzing Skin Texture...</h3>
                       <p className="text-slate-500">Comparing with dermatology patterns</p>
                    </div>
                  ) : (
                    <>
                       {/* Chat Interface */}
                       <ChatInterface image={image} initialAnalysis={result || ""} />
                       
                       {/* Action Buttons Row */}
                       <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button 
                            onClick={reset}
                            className="p-4 bg-white rounded-2xl shadow-md text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                          >
                             Upload New Image
                          </button>
                          <button 
                            onClick={() => setShowNurse(true)}
                            className="p-4 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-200 font-semibold hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
                          >
                             <Heart size={20} className="fill-current"/> Speak to a Nurse Now
                          </button>
                       </div>

                       {/* Doctor Finder */}
                       <div className="pb-12">
                          <DoctorFinder />
                       </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-slate-400 text-sm">
           <p>© 2025 Derma AI. Sprint 1 Prototype.</p>
        </footer>
      </div>

      {/* Modals */}
      <NurseOnCall isOpen={showNurse} onClose={() => setShowNurse(false)} />

    </div>
  );
}

export default App;
