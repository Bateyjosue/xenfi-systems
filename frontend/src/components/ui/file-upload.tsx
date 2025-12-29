'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { api } from '@/lib/api';
import { CloudArrowUpIcon, XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  defaultUrl?: string | null;
  label?: string;
}

export function FileUpload({ onUploadComplete, defaultUrl, label = "Receipt/Attachment" }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate type
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(selectedFile.type)) {
      setError('Invalid file type. Only JPG, PNG, and PDF are allowed.');
      return;
    }

    // Validate size (e.g., 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Create local preview for images
    if (selectedFile.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
    } else {
        setPreviewUrl(null); // No preview for PDF yet
    }
    
    // Auto-upload immediately upon selection for better UX
    await uploadFile(selectedFile);
  };

  const uploadFile = async (fileToUpload: File) => {
    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const uploadedUrl = response.data.url;
      onUploadComplete(uploadedUrl);
      
      // If it wasn't an image, we can just show the uploaded URL or generic icon
      if (!fileToUpload.type.startsWith('image/')) {
          setPreviewUrl(uploadedUrl);
      }
      
    } catch (err) {
      console.error("Upload failed", err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    onUploadComplete(''); // Clear URL in parent
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      
      {!previewUrl ? (
          <div
            className={cn(
                "mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 transition-colors",
                isUploading ? "opacity-50 cursor-wait" : "hover:bg-gray-50 cursor-pointer"
            )}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <div className="text-center">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
              <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                <span className="relative rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                  <span>Upload a file</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="sr-only"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">PNG, JPG, PDF up to 5MB</p>
              {isUploading && <p className="mt-2 text-sm text-indigo-600 font-medium">Uploading...</p>}
            </div>
          </div>
      ) : (
          <div className="relative mt-2 rounded-lg border border-gray-200 p-2">
             <div className="flex items-center space-x-4">
                <div className="shrink-0">
                    {file?.type.startsWith('image/') || previewUrl.match(/\.(jpg|jpeg|png)/i) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="h-16 w-16 object-cover rounded-md" 
                        />
                    ) : (
                        <DocumentIcon className="h-16 w-16 text-gray-400" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {file ? file.name : "Uploaded Attachment"}
                    </p>
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 hover:text-indigo-600">
                        View File
                    </a>
                </div>
                <div>
                   <Button 
                     type="button" 
                     variant="ghost" 
                     size="icon" 
                     onClick={handleRemove}
                     disabled={isUploading}
                    >
                     <XMarkIcon className="h-5 w-5 text-gray-500" />
                   </Button>
                </div>
             </div>
          </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}
