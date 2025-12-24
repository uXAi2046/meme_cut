import { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImagePreview } from './components/ImagePreview';
import { ControlPanel, type ExportFormat, type RatioMode } from './components/ControlPanel';
import { PromptModal } from './components/PromptModal';
import { sliceImage, downloadZip } from './utils/sliceImage';
import { Scissors, Github, Sparkles, X } from 'lucide-react';

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  
  // Configuration State
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  
  // Ratio mode (preview & export crop base)
  const [ratioMode, setRatioMode] = useState<RatioMode>('original');
  
  // Margins
  const [marginTop, setMarginTop] = useState(0);
  const [marginBottom, setMarginBottom] = useState(0);
  const [marginLeft, setMarginLeft] = useState(0);
  const [marginRight, setMarginRight] = useState(0);

  // Export
  const [filenamePrefix, setFilenamePrefix] = useState('');
  const [format, setFormat] = useState<ExportFormat>('png');

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const handleReset = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    // Reset configs
    setRows(3);
    setCols(3);
    setRatioMode('original');
    handleResetMargins();
  };

  const handleResetMargins = () => {
    setMarginTop(0);
    setMarginBottom(0);
    setMarginLeft(0);
    setMarginRight(0);
  };

  const handleDownload = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { zipBlob } = await sliceImage({
        file,
        rows,
        cols,
        ratioMode,
        margins: { top: marginTop, bottom: marginBottom, left: marginLeft, right: marginRight },
        format,
        prefix: filenamePrefix
      });
      
      downloadZip(zipBlob, `blockslice-${Date.now()}.zip`);
    } catch (error) {
      console.error('Failed to slice image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-50 flex overflow-hidden font-sans">
      {/* Left Icon Sidebar (Mini) */}
      <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-6 z-20 hidden sm:flex">
        <div className="bg-blue-600 p-2 rounded-xl shadow-md">
          <Scissors className="text-white w-6 h-6" />
        </div>
        
        <div className="w-8 h-px bg-gray-200 -my-2"></div>

        <div className="flex-1 flex flex-col gap-4 w-full items-center">
          <button 
            onClick={() => setIsPromptModalOpen(true)}
            className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all" 
            title="Enhance"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all" title="GitHub">
            <Github className="w-5 h-5" />
          </button>
          <button className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all" title="X (Twitter)">
            <XLogo className="w-5 h-5" />
          </button>
        </div>
      </aside>

      <PromptModal isOpen={isPromptModalOpen} onClose={() => setIsPromptModalOpen(false)} />

      {/* Main Preview Area */}
      <main className="flex-1 h-full relative flex flex-col overflow-hidden">
        {/* Header inside main area for mobile */}
        <header className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-10 sm:hidden">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Scissors className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-gray-800">BlockSlice</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-gray-50/50">
          {!file ? (
            <div className="w-full max-w-xl animate-fade-in">
              <ImageUploader onImageSelect={handleImageSelect} />
            </div>
          ) : (
            <div className="relative animate-fade-in max-w-full">
              {/* Preview with Grid & Margins */}
              <ImagePreview 
                imageUrl={previewUrl!} 
                rows={rows} 
                cols={cols} 
                ratioMode={ratioMode}
                margins={{ top: marginTop, bottom: marginBottom, left: marginLeft, right: marginRight }}
              />
              
              <button 
                onClick={handleReset}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-600 hover:text-red-500 p-2 rounded-full shadow-lg border border-gray-200 transition-all z-20"
                title="Close Image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Right Control Panel Sidebar */}
      <aside className="w-full sm:w-[360px] lg:w-[400px] bg-white border-l border-gray-200 h-full overflow-y-auto flex-shrink-0 z-10 shadow-xl sm:shadow-none absolute sm:relative right-0 transition-transform duration-300 transform translate-x-0">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">设置</h2>
            {file && (
              <button onClick={handleReset} className="text-sm text-red-500 hover:text-red-600 font-medium">
                关闭图片
              </button>
            )}
          </div>
          
          <ControlPanel
            rows={rows} setRows={setRows}
            cols={cols} setCols={setCols}
            ratioMode={ratioMode} setRatioMode={setRatioMode}
            
            marginTop={marginTop} setMarginTop={setMarginTop}
            marginBottom={marginBottom} setMarginBottom={setMarginBottom}
            marginLeft={marginLeft} setMarginLeft={setMarginLeft}
            marginRight={marginRight} setMarginRight={setMarginRight}
            onResetMargins={handleResetMargins}
            
            filenamePrefix={filenamePrefix} setFilenamePrefix={setFilenamePrefix}
            format={format} setFormat={setFormat}
            
            onDownload={handleDownload}
            isProcessing={isProcessing}
          />
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} BlockSlice. 本地处理，图片不上传。
          </div>
        </div>
      </aside>
    </div>
  );
}

export default App;
