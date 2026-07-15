import React, { useState } from 'react';
import { UploadCloud, ArrowRight, FileText } from 'lucide-react';
import { academyApi } from '../../api/academyApi';
import './ResumeUploadCard.css';

interface Props {
  onNext: (resumeText?: string) => void;
}

export const ResumeUploadCard: React.FC<Props> = ({ onNext }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
    try {
      const result = await academyApi.parseResume(file);
      setIsUploading(false);
      onNext(result.text);
    } catch (e) {
      setIsUploading(false);
      // Even if it fails, let's proceed to not block the user
      onNext();
    }
  };

  return (
    <div className="upload-container fade-in">
      <div className="upload-card">
        <div className="icon-header">
          <FileText size={32} />
        </div>
        <h2 className="title">AI Background Analysis</h2>
        <p className="subtitle">Upload your resume to instantly personalize your assessment and receive targeted career recommendations.</p>
        
        <label 
          className={`dropzone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="upload-state spinner-container">
              <div className="spinner"></div>
              <p className="spinner-text">Analyzing your background...</p>
            </div>
          ) : (
            <div className="upload-state">
              <UploadCloud size={56} className="upload-icon" />
              <p className="drop-text-main">Drag & Drop your resume</p>
              <p className="drop-text-sub">Supported formats: PDF, DOCX (Max 5MB)</p>
              <div className="btn btn-primary browse-btn">
                Browse Files
                <input type="file" hidden accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
              </div>
            </div>
          )}
        </label>

        <div className="skip-section">
          <span className="divider">OR</span>
          <button className="btn skip-btn" onClick={() => onNext()} disabled={isUploading}>
            Skip this step <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
