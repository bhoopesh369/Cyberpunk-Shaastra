import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { Leaf, Building2, Shield, BarChart3, LucideIcon } from 'lucide-react';

interface ESGReport {
  Environmental_Score: number;
  Governance_Score: number;
  Social_Score: number;
  Total_Score: number;
  symbol: string;
  year: number;
}

interface ScoreCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  iconColor: string;
}

function DocumentUploader() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [geminiResponse, setGeminiResponse] = useState<ESGReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadStatus('Please select at least one file.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading...');

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://localhost:8000/upload-documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        setUploadStatus('Upload Successful!');
        const parsedResponse = JSON.parse(response.data?.responses[0].gemini_response);
        setGeminiResponse(parsedResponse.ESG_Report);
        setIsModalOpen(true);
      } else {
        setUploadStatus('Upload Failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadStatus('Upload Failed. An error occurred.');
    } finally {
      setIsUploading(false);
      setSelectedFiles([]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-blue-600';
    if (score >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, icon: Icon, iconColor }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-200 hover:scale-105">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h3 className="text-gray-700 font-semibold">{title}</h3>
      </div>
      <p className={`text-3xl font-bold ${getScoreColor(score)}`}>
        {score.toFixed(2)}
      </p>
    </div>
  );

  return (
    <div className="w-full h-full mx-auto p-6 bg-white rounded-lg shadow-md relative">
      {isModalOpen && geminiResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl relative">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              z
            </button>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800">
                ESG Report for {geminiResponse.symbol} ({geminiResponse.year})
              </h3>
              <p className="text-gray-600 mt-2">Environmental, Social, and Governance Analysis</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ScoreCard 
                title="Environmental"
                score={geminiResponse.Environmental_Score}
                icon={Leaf}
                iconColor="text-green-600"
              />
              <ScoreCard 
                title="Social"
                score={geminiResponse.Social_Score}
                icon={Building2}
                iconColor="text-blue-600"
              />
              <ScoreCard 
                title="Governance"
                score={geminiResponse.Governance_Score}
                icon={Shield}
                iconColor="text-purple-600"
              />
              <ScoreCard 
                title="Total Score"
                score={geminiResponse.Total_Score}
                icon={BarChart3}
                iconColor="text-gray-600"
              />
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Upload Documents</h2>

      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`w-full py-3 text-white font-semibold rounded-lg transition-all ${
            isUploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload Documents'}
        </button>

        {uploadStatus && (
          <p className="text-lg font-semibold text-center text-gray-700">
            {uploadStatus}
          </p>
        )}

        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
            <ul className="space-y-2">
              {selectedFiles.map((file, index) => (
                <li key={index} className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentUploader;