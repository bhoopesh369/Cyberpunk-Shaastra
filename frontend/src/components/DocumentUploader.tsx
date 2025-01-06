import React, { useState } from 'react';
import axios from 'axios';

function DocumentUploader() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event:any) => {
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
      console.log(response.data)
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadStatus('Upload Failed. An error occurred.');
    } finally {
      setIsUploading(false);
      setSelectedFiles([])
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Documents'}
      </button>
      {uploadStatus && <p>{uploadStatus}</p>}
        {selectedFiles.length > 0 && (
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}
    </div>
  );
}

export default DocumentUploader;