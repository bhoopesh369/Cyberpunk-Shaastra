import React, { useState } from 'react';
import axios from 'axios';

function DocumentUploader() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: any) => {
    setSelectedFiles(Array.from(event.target.files));
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
      } else {
        setUploadStatus('Upload Failed. Please try again.');
      }
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadStatus('Upload Failed. An error occurred.');
    } finally {
      setIsUploading(false);
      setSelectedFiles([]);
    }
  };

  return (
    <div className="w-full h-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Upload Documents</h2>
      
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4"
      />
      
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className={`w-full py-3 text-white font-semibold rounded-md transition-all ${
          isUploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Upload Documents'}
      </button>

      {uploadStatus && (
        <p className="mt-4 text-lg font-semibold text-center">
          {uploadStatus}
        </p>
      )}

      {selectedFiles.length > 0 && (
        <ul className="mt-6 space-y-2">
          {selectedFiles.map((file, index) => (
            <li key={index} className="bg-gray-100 p-3 rounded-md">
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DocumentUploader;
