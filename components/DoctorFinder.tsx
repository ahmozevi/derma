import React, { useState } from 'react';
import { MapPin, Navigation, Star, ExternalLink } from 'lucide-react';
import { findLocalDoctors } from '../services/geminiService';
import { GroundingChunk } from '../types';

export const DoctorFinder: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GroundingChunk[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleFindDoctors = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { chunks } = await findLocalDoctors(
            position.coords.latitude,
            position.coords.longitude
          );
          // Filter to only maps chunks
          const mapChunks = chunks.filter(c => c.maps);
          setResults(mapChunks);
          setSearched(true);
        } catch (err) {
          setError("Failed to fetch doctor information.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Unable to retrieve your location.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="text-teal-500" /> Find Local Specialists
          </h2>
          <p className="text-slate-500 text-sm">Locate dermatologists and clinics near you.</p>
        </div>
        
        <button
          onClick={handleFindDoctors}
          disabled={loading}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-teal-200 hover:bg-teal-700 hover:shadow-xl transition-all disabled:opacity-50 active:scale-95"
        >
          {loading ? (
             <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          {loading ? "Locating..." : "Find Near Me"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 text-center border border-red-100">
          {error}
        </div>
      )}

      {!searched && !loading && (
        <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-20" />
          <p>Click "Find Near Me" to see specialists in your area.</p>
        </div>
      )}

      {searched && results.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-slate-500">
          No clinics found nearby. Try again or check your location settings.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((chunk, index) => {
          const mapData = chunk.maps!;
          const review = mapData.placeAnswerSources?.[0]?.reviewSnippets?.[0]?.content;
          
          return (
            <a 
              key={index} 
              href={mapData.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-teal-600 transition-colors">
                  {mapData.title}
                </h3>
                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-teal-500" />
              </div>
              
              <div className="mt-3 flex items-center gap-1 text-amber-400 text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-slate-600 font-medium">Verified Location</span>
              </div>

              {review && (
                <p className="mt-3 text-slate-500 text-sm italic line-clamp-3 bg-slate-50 p-2 rounded-lg">
                  "{review}"
                </p>
              )}

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-teal-600 text-sm font-medium">
                 <span>View details & book</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
