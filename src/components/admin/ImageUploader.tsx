'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, Link as LinkIcon, RefreshCw, Sparkles } from 'lucide-react';
import { uploadMediaToCloudinary, CloudinaryFolder } from '@/lib/cloudinary/upload';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: CloudinaryFolder;
  label?: string;
  aspectRatio?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  folder = 'meow/products',
  label = 'Upload Image',
  aspectRatio = 'aspect-[4/3]',
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadFile = async (file: File) => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      const result = await uploadMediaToCloudinary(file, folder, (p) => setProgress(p));
      onChange(result.url);
    } catch (err: any) {
      alert(`Upload error: ${err.message || 'Failed to upload media to Cloudinary'}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setShowUrlInput(false);
      setCustomUrl('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-meow-muted hover:text-meow-dark flex items-center gap-1 underline"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL Input' : 'Paste Image URL'}</span>
        </button>
      </div>

      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 rounded border border-meow-border bg-meow-surface">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            className="flex-1 text-xs px-2.5 py-1.5 rounded border border-meow-border bg-white outline-none"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 bg-meow-dark text-white text-xs font-semibold rounded"
          >
            Apply
          </button>
        </div>
      )}

      {/* Image Preview or Dropzone with Drag and Drop */}
      {value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative ${aspectRatio} rounded-lg border-2 ${
            isDragging ? 'border-meow-dark border-dashed bg-meow-surface/80 scale-[1.01]' : 'border-meow-border'
          } overflow-hidden bg-[#FAF9F6] group transition-all`}
        >
          <img src={value} alt="Preview" className="w-full h-full object-cover object-center" />

          {/* Drag Overlay when dragging over existing image */}
          {isDragging && (
            <div className="absolute inset-0 bg-meow-dark/70 text-white flex flex-col items-center justify-center p-4 z-20 backdrop-blur-sm animate-fade-in">
              <Upload className="w-8 h-8 animate-bounce mb-2" />
              <p className="text-xs font-semibold uppercase tracking-wider">Drop new image to replace</p>
            </div>
          )}

          {/* Remove / Replace Overlay */}
          {!isDragging && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white text-meow-dark text-xs font-semibold rounded shadow hover:bg-meow-surface"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1.5 bg-red-600 text-white rounded shadow hover:bg-red-700"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed ${
            isDragging
              ? 'border-meow-dark bg-[#F4F1EA] scale-[1.01] shadow-inner'
              : 'border-meow-border hover:border-meow-dark bg-meow-surface hover:bg-white'
          } rounded-lg ${aspectRatio} flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all`}
        >
          {uploading ? (
            <div className="space-y-2 flex flex-col items-center">
              <RefreshCw className="w-6 h-6 animate-spin text-meow-dark" />
              <span className="text-xs font-medium text-meow-dark">
                Uploading to Cloudinary ({progress}%)
              </span>
            </div>
          ) : isDragging ? (
            <div className="space-y-2 flex flex-col items-center text-meow-dark animate-pulse">
              <Upload className="w-8 h-8 stroke-[2]" />
              <p className="text-xs font-bold uppercase tracking-wider">
                Drop your image here
              </p>
              <p className="text-[10px] text-meow-subtle">
                Release to upload directly to Cloudinary
              </p>
            </div>
          ) : (
            <div className="space-y-2 flex flex-col items-center text-meow-muted">
              <Upload className="w-6 h-6 stroke-[1.5]" />
              <p className="text-xs font-medium text-meow-dark">
                Drag &amp; drop image here, or <span className="underline font-semibold">browse</span>
              </p>
              <p className="text-[10px] text-meow-subtle">
                PNG, JPG, WebP, SVG up to 20MB
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
