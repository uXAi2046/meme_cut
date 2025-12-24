import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

export type ExportFormat = 'png' | 'jpg' | 'webp';
export type RatioMode = 'original' | 'square';

interface ControlPanelProps {
  rows: number;
  setRows: (val: number) => void;
  cols: number;
  setCols: (val: number) => void;

  ratioMode: RatioMode;
  setRatioMode: (val: RatioMode) => void;

  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  setMarginTop: (val: number) => void;
  setMarginBottom: (val: number) => void;
  setMarginLeft: (val: number) => void;
  setMarginRight: (val: number) => void;
  onResetMargins: () => void;

  filenamePrefix: string;
  setFilenamePrefix: (val: string) => void;
  format: ExportFormat;
  setFormat: (val: ExportFormat) => void;
  
  onDownload: () => void;
  isProcessing: boolean;
}

const Section: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
        {title}
      </h3>
      {action}
    </div>
    {children}
  </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({
  rows, setRows, cols, setCols,
  ratioMode, setRatioMode,
  marginTop, marginBottom, marginLeft, marginRight,
  setMarginTop, setMarginBottom, setMarginLeft, setMarginRight, onResetMargins,
  filenamePrefix, setFilenamePrefix, format, setFormat,
  onDownload, isProcessing
}) => {
  const totalSlices = rows * cols;

  return (
    <div className="w-full space-y-4">
      {/* 网格切割 */}
      <Section title="网格切割">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">列数</label>
            <input
              type="number"
              min={1}
              max={10}
              value={cols}
              onChange={(e) => setCols(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              className="w-full bg-gray-50 px-3 py-2.5 rounded-xl border-none text-center font-semibold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">行数</label>
            <input
              type="number"
              min={1}
              max={10}
              value={rows}
              onChange={(e) => setRows(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              className="w-full bg-gray-50 px-3 py-2.5 rounded-xl border-none text-center font-semibold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="flex justify-between items-center px-1">
          <span className="text-xs text-gray-400">切片总数</span>
          <span className="text-sm font-bold text-gray-800">{totalSlices}</span>
        </div>
      </Section>

      {/* 调整与裁剪 */}
      <Section title="调整与裁剪">
        <div className="space-y-4">
          <div className="flex p-1 bg-gray-100 rounded-lg">
            {(['original', 'square'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setRatioMode(m)}
                className={clsx(
                  "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                  ratioMode === m ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                {m === 'original' ? '原比例' : '正方形'}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 text-center">
            提示：可以在预览区域拖动缩放（不影响导出）
          </p>
        </div>
      </Section>

      {/* 切割边缘（像素） */}
      <Section 
        title="切割边缘（px）" 
        action={
          <button onClick={onResetMargins} className="text-xs text-blue-500 hover:text-blue-600 font-medium">
            重置
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="col-span-2">
            <input 
              placeholder="统一边距" 
              className="w-full bg-gray-50 px-3 py-2 rounded-lg text-xs border-none text-center focus:ring-1 focus:ring-blue-500 outline-none"
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setMarginTop(val); setMarginBottom(val); setMarginLeft(val); setMarginRight(val);
              }}
            />
          </div>
          <input 
            placeholder="上" type="number" value={marginTop} 
            onChange={(e) => setMarginTop(parseInt(e.target.value) || 0)}
            className="bg-gray-50 px-2 py-2 rounded-lg text-xs text-center outline-none"
          />
          <input 
            placeholder="下" type="number" value={marginBottom} 
            onChange={(e) => setMarginBottom(parseInt(e.target.value) || 0)}
            className="bg-gray-50 px-2 py-2 rounded-lg text-xs text-center outline-none"
          />
          <input 
            placeholder="左" type="number" value={marginLeft} 
            onChange={(e) => setMarginLeft(parseInt(e.target.value) || 0)}
            className="bg-gray-50 px-2 py-2 rounded-lg text-xs text-center outline-none"
          />
          <input 
            placeholder="右" type="number" value={marginRight} 
            onChange={(e) => setMarginRight(parseInt(e.target.value) || 0)}
            className="bg-gray-50 px-2 py-2 rounded-lg text-xs text-center outline-none"
          />
        </div>
        <p className="text-[10px] text-gray-400 text-center">
          会从各边裁掉对应像素
        </p>
      </Section>

      {/* 文件命名与导出 */}
      <Section title="文件命名与导出">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">自定义前缀（可选）</label>
            <input
              type="text"
              placeholder="例如：product_image"
              value={filenamePrefix}
              onChange={(e) => setFilenamePrefix(e.target.value)}
              className="w-full bg-gray-50 px-3 py-2.5 rounded-xl border-none text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">导出格式</label>
            <div className="flex p-1 bg-gray-100 rounded-lg">
              {(['png', 'jpg', 'webp'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={clsx(
                    "flex-1 py-1.5 text-xs font-medium rounded-md uppercase transition-all",
                    format === fmt 
                      ? "bg-white text-gray-800 shadow-sm" 
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-[10px] text-gray-400">
            预览：<span className="font-mono text-gray-500">{filenamePrefix || 'slice'}_1_1.{format}</span>
          </div>
        </div>
      </Section>

      <button
        onClick={onDownload}
        disabled={isProcessing}
        className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform active:scale-[0.98]"
      >
        {isProcessing ? (
          <>
            <RefreshCw className="animate-spin w-5 h-5" />
            正在处理…
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            下载全部（{totalSlices}）
          </>
        )}
      </button>
    </div>
  );
};
