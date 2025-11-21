import React, { useState } from 'react';
import { Phone, MapPin, Search, Navigation, ExternalLink } from 'lucide-react';
import { sendMessageToChat } from '../services/geminiService';

export const FindHelp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ uri: string; title: string }[]>([]);
  
  const handleFindNearby = async () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          // We use the chat service to leverage Gemini's tool capabilities directly
          // In a real app, we might instantiate a specific search session
          const response = await sendMessageToChat(
              "Find highly rated dermatologist clinics near my current location.", 
              { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
          );
          
          if (response.groundingUrls) {
            setResults(response.groundingUrls);
          }
        } catch (e) {
            console.error(e);
            alert("Unable to connect to the assistant. Please try again.");
        } finally {
            setIsLoading(false);
        }
      }, (err) => {
          console.warn("Location access denied", err);
          setIsLoading(false);
          alert("Please enable location services to find nearby clinics.");
      });
    } else {
        setIsLoading(false);
        alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Find Professional Help</h1>
        <p className="text-slate-600 text-sm">Connect with certified dermatologists or emergency services.</p>
      </div>

      {/* Nurse on Call Card */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-lg font-bold flex items-center mb-2">
                <Phone className="w-5 h-5 mr-2" /> Nurse-on-Call (24/7)
            </h2>
            <p className="text-white/90 text-sm mb-6 max-w-sm">
                For non-emergency health advice from a registered nurse. Available 24 hours a day.
            </p>
            <a href="tel:1300606024" className="inline-block bg-white text-rose-600 px-6 py-3 rounded-full font-bold shadow-md hover:bg-rose-50 transition-colors">
                Call 1300 60 60 24
            </a>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
            <Phone className="w-48 h-48" />
        </div>
      </div>

      {/* Local Doctor Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-lg font-bold text-slate-800">Local Dermatologists</h3>
                <p className="text-xs text-slate-500">Uses Google Maps to find rated clinics nearby.</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
                <MapPin className="w-6 h-6 text-blue-600" />
            </div>
        </div>

        {results.length === 0 ? (
            <div className="text-center py-8">
                <button 
                    onClick={handleFindNearby}
                    disabled={isLoading}
                    className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium flex items-center mx-auto hover:bg-slate-800 disabled:opacity-70 transition-all"
                >
                    {isLoading ? (
                        <>Searching...</>
                    ) : (
                        <>
                            <Navigation className="w-4 h-4 mr-2" /> Locate Nearby Clinics
                        </>
                    )}
                </button>
                <p className="text-xs text-slate-400 mt-3">Requires location permission</p>
            </div>
        ) : (
            <div className="space-y-3">
                {results.map((place, idx) => (
                    <a 
                        key={idx}
                        href={place.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors flex justify-between items-center"
                    >
                        <div>
                            <h4 className="font-semibold text-slate-800 text-sm">{place.title}</h4>
                            <span className="text-xs text-blue-600 flex items-center mt-1">
                                View on Maps <ExternalLink className="w-3 h-3 ml-1" />
                            </span>
                        </div>
                    </a>
                ))}
                <button 
                    onClick={handleFindNearby}
                    className="w-full py-3 text-sm text-slate-500 hover:text-slate-800 font-medium border-t border-slate-100 mt-4"
                >
                    Refresh Location
                </button>
            </div>
        )}
      </div>
    </div>
  );
};