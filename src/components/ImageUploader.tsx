import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageSelect(acceptedFiles[0]);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[420px] w-full">
      <div
        {...getRootProps()}
        className={clsx(
          "w-full max-w-xl border border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 p-10 bg-white/90 shadow-sm",
          isDragActive 
            ? "border-blue-400 bg-blue-50 scale-[1.01]" 
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="bg-gray-100 p-4 rounded-2xl mb-4">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          上传图片
        </h3>
        <p className="text-gray-500 text-sm mb-6 text-center max-w-[320px] leading-6">
          拖拽图片到这里，或者点击选择
          <br />
          <span className="text-xs opacity-70">支持 JPG, PNG, WEBP（最大 10MB）</span>
        </p>
        <button className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors">
          <Upload className="w-4 h-4" />
          选择图片
        </button>
      </div>
    </div>
  );
};
