import React, { useRef, useState } from 'react';

interface ImagePreviewProps {
  imageUrl: string;
  rows: number;
  cols: number;
  ratioMode: 'original' | 'square';
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, rows, cols, ratioMode, margins }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    setImgSize({ width: target.naturalWidth, height: target.naturalHeight });
  };

  // Calculate percentages for margins to render them responsively
  const getMarginStyle = () => {
    if (imgSize.width === 0 || imgSize.height === 0) return {};
    // Base crop according to ratio
    let baseW = imgSize.width;
    let baseH = imgSize.height;
    let baseXPercent = 0;
    let baseYPercent = 0;

    if (ratioMode === 'square') {
      const side = Math.min(imgSize.width, imgSize.height);
      baseW = side;
      baseH = side;
      baseXPercent = ((imgSize.width - side) / 2 / imgSize.width) * 100;
      baseYPercent = ((imgSize.height - side) / 2 / imgSize.height) * 100;
    }

    // Ensure margins don't exceed base crop size
    const safeW = Math.max(1, baseW - margins.left - margins.right);
    const safeH = Math.max(1, baseH - margins.top - margins.bottom);

    return {
      top: `${baseYPercent + (margins.top / imgSize.height) * 100}%`,
      left: `${baseXPercent + (margins.left / imgSize.width) * 100}%`,
      width: `${(safeW / imgSize.width) * 100}%`,
      height: `${(safeH / imgSize.height) * 100}%`,
    };
  };

  const safeAreaStyle = getMarginStyle();

  return (
    <div className="relative inline-block overflow-hidden rounded-lg shadow-sm bg-white">
      {/* Base Image */}
      <img 
        ref={imgRef}
        src={imageUrl} 
        alt="Preview" 
        onLoad={onImgLoad}
        className="block max-h-[70vh] w-auto max-w-full object-contain" 
      />
      
      {/* Darken Overlay for Margins (simulated by a safe area with a huge box shadow or using 4 divs) */}
      {/* Actually, let's use a container for the grid that is positioned absolutely based on margins */}
      
      {/* Margin Overlays (Top, Bottom, Left, Right) - Semi-transparent black */}
      {imgSize.width > 0 && (
        <>
          {/* Top Margin */}
          <div className="absolute top-0 left-0 right-0 bg-black/50 pointer-events-none" style={{ height: safeAreaStyle.top }} />
          {/* Bottom Margin */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 pointer-events-none" style={{ height: `${(margins.bottom / imgSize.height) * 100}%` }} />
          {/* Left Margin (between top and bottom) */}
          <div className="absolute left-0 bg-black/50 pointer-events-none" style={{ top: safeAreaStyle.top, bottom: `${(margins.bottom / imgSize.height) * 100}%`, width: safeAreaStyle.left }} />
          {/* Right Margin */}
          <div className="absolute right-0 bg-black/50 pointer-events-none" style={{ top: safeAreaStyle.top, bottom: `${(margins.bottom / imgSize.height) * 100}%`, width: `${(margins.right / imgSize.width) * 100}%` }} />
          
          {/* Grid Container - positioned exactly over the safe area */}
          <div 
            className="absolute grid pointer-events-none border border-blue-500/40 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] rounded-md overflow-hidden"
            style={{
              top: safeAreaStyle.top,
              left: safeAreaStyle.left,
              width: safeAreaStyle.width,
              height: safeAreaStyle.height,
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`
            }}
          >
            {Array.from({ length: rows * cols }).map((_, i) => (
              <div 
                key={i} 
                className="border border-blue-500/30"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
