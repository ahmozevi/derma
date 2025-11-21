import React from 'react';
import { useCase } from '../context/CaseContext';
import { Calendar, ChevronRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const History: React.FC = () => {
  const { cases } = useCase();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Case History</h1>

      {cases.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No cases saved yet</h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">Your analysis history will appear here.</p>
          <button 
            onClick={() => navigate('/')}
            className="text-primary font-semibold text-sm hover:underline"
          >
            Start a new analysis
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {cases.map((record) => (
            <div key={record.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
              <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                <img src={record.imageUrl} alt="Case" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-grow min-w-0">
                <h3 className="text-sm font-bold text-slate-800 truncate">
                  {record.summary}
                </h3>
                <div className="flex items-center text-xs text-slate-500 mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(record.date).toLocaleDateString()}
                </div>
              </div>

              <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
              </button>
              
              <button className="p-2 text-primary hover:bg-primary/5 rounded-full">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
