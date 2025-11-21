import React, { useState } from 'react';
import { Upload, Camera, ShieldCheck, Heart, Menu, UserCircle, AlertCircle, Settings } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setImage(base64String);
      setAnalyzing(true);
      setError(null);
      
      try {
        const analysis = await analyzeSkinImage(base64String);
        setResult(analysis);
      } catch (err: any) {
        console.error(err);
        const errorMessage = err.message || "Failed to analyze.";
        setError(errorMessage);
        
        // If specific API key error, keep image but stop loading
        if (errorMessage.includes("API Key")) {
           setImage(null);
        }
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-slate-800 bg-slate-50">
      
      {/* 3D Background Layers */}
      
      {/* Layer 1: Deep Moving Gradient Orbs (Furthest back) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-teal-300/20 rounded-full blur-[120px] animate-float mix-blend-multiply"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-rose-300/20 rounded-full blur-[120px] animate-float-delayed mix-blend-multiply"></div>
        <div className="absolute top-[30%] left-[40%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px] animate-float duration-[10s]"></div>
      </div>

      {/* Layer 2: Moving Grid Texture (Mid-ground) */}
      <div className="fixed inset-0 z-0 opacity-[0.15] pointer-events-none animate-pan" 
           style={{ 
             backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', 
             backgroundSize: '40px 40px',
             transform: 'perspective(500px) rotateX(10deg) scale(1.5)'
           }}>
      </div>

      {/* Layer 3: Main Content (Foreground with 3D elements) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform" onClick={reset}>
                <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200">
                  <ShieldCheck size={20} />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800">Derma<span className="text-teal-600">AI</span></span>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowNurse(true)}
                  className="hidden md:flex items-center gap-2 text-rose-600 font-bold px-5 py-2 bg-rose-50 border border-rose-100 rounded-full hover:bg-rose-100 hover:shadow-md hover:scale-105 transition-all"
                >
                  <Heart size={18} className="fill-current animate-pulse" /> Nurse on Call
                </button>
                <button 
                  onClick={() => setView(view === 'home' ? 'profile' : 'home')}
                  className="p-2 text-slate-500 hover:text-teal-600 transition-colors bg-white/50 rounded-full hover:bg-white"
                >
                  {view === 'home' ? <UserCircle size={26} /> : <Menu size={26} />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main View Switch */}
        <main className="flex-grow container mx-auto px-4 py-8">
          
          {/* Error Banner */}
          {error && (
            <div className="max-w-4xl mx-auto mb-6 p-6 bg-red-50 border border-red-200 rounded-2xl flex flex-col gap-3 text-red-800 animate-in slide-in-from-top-2 shadow-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 shrink-0 text-red-600" />
                <h3 className="font-bold text-lg">Unable to Process Request</h3>
              </div>
              
              <p>{error}</p>

              {error.includes("API Key") && (
                <div className="mt-2 bg-white/50 p-4 rounded-xl text-sm border border-red-100">
                  <p className="font-semibold flex items-center gap-2 mb-2"><Settings className="w-4 h-4"/> Configuration Required:</p>
                  <ol className="list-decimal list-inside space-y-1 text-red-700/80">
                    <li>Go to your Vercel Project Dashboard</li>
                    <li>Navigate to <strong>Settings</strong> &gt; <strong>Environment Variables</strong></li>
                    <li>Add Key: <code className="bg-white px-1 rounded border">API_KEY</code></li>
                    <li>Paste your Google Gemini API Key as the Value</li>
                    <li><strong>Redeploy</strong> your project for changes to take effect</li>
                  </ol>
                </div>
              )}
              
              <button 
                onClick={() => setError(null)} 
                className="self-start mt-2 text-sm font-semibold text-red-600 hover:text-red-800 underline decoration-red-300 underline-offset-2"
              >
                Dismiss Message
              </button>
            </div>
          )}
          
          {/* Profile View */}
          {view === 'profile' && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 perspective-container">
               <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 rotate-3d">
                  <h2 className="text-2xl font-bold mb-6 text-slate-800">User Profile</h2>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-300 rounded-full flex items-center justify-center shadow-inner">
                      <UserCircle size={40} className="text-slate-500"/>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Guest User</h3>
                      <p className="text-teal-600 font-medium">Sprint 1 Access</p>
                    </div>
                  </div>
                  <div className="p-6 bg-blue-50/80 border border-blue-100 text-blue-800 rounded-2xl mb-6">
                    <p className="font-semibold mb-1">Case History</p>
                    <p className="text-sm opacity-80">Save your case history feature coming in Sprint 2.</p>
                  </div>
                  <button onClick={() => setView('home')} className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:shadow-sm transition-all">Back to Analysis</button>
               </div>
            </div>
          )}

          {/* Analysis View */}
          {view === 'home' && (
            <>
              {!image ? (
                // HERO SECTION
                <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-10">
                  <div className="space-y-6 max-w-3xl mx-auto perspective-container">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-md text-teal-700 rounded-full text-sm font-bold mb-2 shadow-sm border border-white/60 animate-float">
                      <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                      AI-Powered Dermatology Assistant
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight">
                      Identify skin concerns <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-teal-500 animate-pan bg-[length:200%_auto]">instantly.</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-xl mx-auto leading-relaxed font-light">
                      Upload a photo for preliminary classification, then connect with local specialists or a nurse immediately.
                    </p>
                  </div>

                  {/* 3D Upload Card */}
                  <div className="perspective-container w-full max-w-md mx-auto">
                    <div className="group relative h-72 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-teal-100/50 flex flex-col items-center justify-center border border-white/60 hover:border-teal-400 transition-all duration-500 rotate-3d cursor-pointer overflow-hidden">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      />
                      
                      {/* Animated Gradient Background on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10 flex flex-col items-center space-y-5 transform transition-transform duration-300 group-hover:scale-105">
                        <div className="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-300 shadow-lg group-hover:shadow-teal-400/40">
                          <Camera className="w-10 h-10 text-teal-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="text-center">
                          <span className="block font-bold text-slate-700 text-xl group-hover:text-teal-800">Upload Photo</span>
                          <span className="text-sm text-slate-400 mt-1 block">or take a picture</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-medium">
                     <span className="flex items-center gap-2 px-4 py-2 bg-white/40 rounded-full"><ShieldCheck size={16} className="text-teal-600"/> Private & HIPAA Compliant</span>
                     <span className="flex items-center gap-2 px-4 py-2 bg-white/40 rounded-full"><UserCircle size={16} className="text-teal-600"/> No Account Needed</span>
                  </div>
                </div>
              ) : (
                // ANALYSIS & RESULTS SECTION
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
                  
                  {analyzing ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] perspective-container">
                       <div className="relative w-32 h-32 rotate-3d">
                          <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
                          <div className="absolute inset-0 border-8 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Upload className="w-10 h-10 text-teal-500 animate-pulse" />
                          </div>
                       </div>
                       <h3 className="mt-8 text-3xl font-bold text-slate-800">Analyzing...</h3>
                       <p className="text-slate-500 mt-2">Comparing image patterns</p>
                    </div>
                  ) : (
                    <>
                       {/* Action Buttons Row */}
                       <div className="max-w-4xl mx-auto flex justify-between items-center">
                          <button 
                            onClick={reset}
                            className="text-sm font-semibold text-slate-500 hover:text-teal-600 flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full hover:bg-white transition-all"
                          >
                             ← New Analysis
                          </button>
                       </div>

                       {/* Chat Interface - now with 3D class */}
                       <div className="perspective-container">
                          <div className="rotate-3d">
                            <ChatInterface image={image} initialAnalysis={result || ""} />
                          </div>
                       </div>
                       
                       {/* Nurse CTA */}
                       <div className="max-w-4xl mx-auto mt-8">
                          <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-1 shadow-xl transform hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => setShowNurse(true)}>
                            <div className="bg-white/10 backdrop-blur-sm rounded-[1.3rem] p-6 flex flex-col md:flex-row items-center justify-between text-white">
                               <div className="flex items-center gap-4 mb-4 md:mb-0">
                                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                                    <Heart className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-xl">Need immediate advice?</h3>
                                    <p className="text-rose-100">Speak to a registered nurse now.</p>
                                  </div>
                               </div>
                               <button className="px-6 py-3 bg-white text-rose-600 rounded-xl font-bold hover:bg-rose-50 transition-colors shadow-lg">
                                  Connect 24/7
                               </button>
                            </div>
                          </div>
                       </div>

                       {/* Doctor Finder */}
                       <div className="pb-12 pt-4">
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
        <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200/50 bg-white/30 backdrop-blur-sm">
           <p>© 2025 Derma AI. Sprint 1 Prototype.</p>
           <p className="text-xs mt-2 opacity-60">Emergency? Call 000 immediately.</p>
        </footer>
      </div>

      {/* Modals */}
      <NurseOnCall isOpen={showNurse} onClose={() => setShowNurse(false)} />

    </div>
  );
}

export default App;