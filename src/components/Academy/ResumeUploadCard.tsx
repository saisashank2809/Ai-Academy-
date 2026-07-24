import React, { useState } from 'react';
import { UploadCloud, ArrowRight, FileText } from 'lucide-react';
import { academyApi } from '../../api/academyApi';

interface Props {
  onNext: (resumeText?: string) => void;
}

export const ResumeUploadCard: React.FC<Props> = ({ onNext }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    setErrorMsg(null);
    try {
      const result = await academyApi.parseResume(file);
      setIsUploading(false);
      onNext(result.text);
    } catch (e: any) {
      setIsUploading(false);
      setErrorMsg(e.message || "Failed to analyze document. Please try again.");
    }
  };

  const handleUrlSubmit = () => {
    if (!profileUrl.trim()) return;
    setIsUploading(true);
    // Simulate analyzing the URL
    setTimeout(() => {
      setIsUploading(false);
      onNext(`Profile URL: ${profileUrl}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0B1120] text-slate-200 fade-in font-['Inter']">
      <div className="max-w-2xl w-full bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-indigo-500/10 text-indigo-400 mb-6 border border-indigo-500/20">
            <FileText size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">AI Background Analysis</h2>
          <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
            Upload your resume to instantly personalize your assessment and receive targeted career recommendations.
          </p>
        </div>
        
        <label 
          className={`relative flex flex-col items-center justify-center w-full min-h-[280px] p-8 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer group ${
            isDragging 
              ? 'border-indigo-400 bg-indigo-500/10 scale-[1.02]' 
              : isUploading 
                ? 'border-slate-600 bg-slate-800/30 cursor-wait' 
                : 'border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center animate-pulse">
              <div className="w-12 h-12 border-4 border-slate-600 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
              <p className="text-indigo-400 font-medium text-lg">Analyzing your background...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-slate-800/50 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud size={48} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <p className="text-xl font-semibold text-slate-200 mb-2">Drag & drop your resume</p>
              <p className="text-slate-500 text-sm mb-8">Supported formats: PDF, DOCX (Max 5MB)</p>
              <div className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-indigo-500/25">
                Browse Files
                <input type="file" hidden accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
              </div>
              {errorMsg && (
                <div className="mt-6 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-lg">
                  {errorMsg}
                </div>
              )}
            </div>
          )}
        </label>

        <div className="relative my-10 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700/50"></div>
          </div>
          <span className="relative px-4 bg-transparent text-slate-500 text-sm font-medium">
            <span className="bg-slate-900 px-4 rounded-full">OR</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="url" 
            className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-5 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
            placeholder="Paste LinkedIn or Portfolio URL..."
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            disabled={isUploading}
          />
          <button 
            className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleUrlSubmit}
            disabled={!profileUrl.trim() || isUploading}
          >
            Analyze URL
          </button>
        </div>

        <div className="mt-10 flex justify-center">
          <button 
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-200 font-medium transition-colors" 
            onClick={() => onNext()} 
            disabled={isUploading}
          >
            Skip this step 
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
