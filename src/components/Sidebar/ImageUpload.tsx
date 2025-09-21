import React, { useCallback, useState } from 'react';
import { Input } from '../ui';
import { isSupportedImageFormat } from '../../utils';

interface ImageUploadProps {
  onImageUpload: (file: File, url: string, dimensions: { width: number; height: number }) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!isSupportedImageFormat(file)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    setError(null);

    const url = URL.createObjectURL(file);

    // Get image dimensions
    const img = new Image();
    img.onload = () => {
      onImageUpload(file, url, { width: img.width, height: img.height });
    };
    img.src = url;
  }, [onImageUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Upload Image</h3>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          <div className="text-gray-600">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Drop an image here</span>
            <br />
            or
            <br />
            <label htmlFor="file-upload" className="text-blue-600 hover:text-blue-500 cursor-pointer">
              browse files
            </label>
          </div>
          <div className="text-xs text-gray-500">
            Supports JPEG, PNG, WebP
          </div>
        </div>

        <Input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="sr-only"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};
